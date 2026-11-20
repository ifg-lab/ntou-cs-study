import { DurableObject } from "cloudflare:workers";

const announcementWindow = 180_000;
const cooldown = 20_000;
const encoder = new TextEncoder();
const requestIdPattern = /^[\da-f]{8}-[\da-f]{4}-4[\da-f]{3}-[89ab][\da-f]{3}-[\da-f]{12}$/i;
const keyPattern = /^[\w-]{22,128}$/;

export class StudyAnnouncements extends DurableObject {
  constructor(ctx, env) {
    super(ctx, env);
    this.sql = ctx.storage.sql;
    this.sql.exec(`CREATE TABLE IF NOT EXISTS announcements (
      id TEXT PRIMARY KEY, text TEXT NOT NULL, published INTEGER NOT NULL, expires INTEGER NOT NULL
    )`);
  }

  list(now = Date.now()) {
    return this.sql.exec("SELECT id, text, published, expires FROM announcements WHERE expires > ? ORDER BY published",
      now).toArray();
  }

  async publish(id, text) {
    const now = Date.now();
    const result = this.ctx.storage.transactionSync(() => {
      const previous = this.sql.exec("SELECT * FROM announcements WHERE id = ?", id).toArray()[0];
      if (previous) return previous.text === text ? { announcement: previous } : { status: 409 };
      const active = this.list(now);
      const duplicate = active.find(announcement => announcement.text === text);
      if (duplicate) return { announcement: duplicate };
      const last = active.at(-1);
      if (last && now - last.published < cooldown) return { retry: Math.ceil((last.published + cooldown - now) / 1000) };
      const announcement = { id, text, published: now, expires: now + announcementWindow };
      this.sql.exec("INSERT INTO announcements VALUES (?, ?, ?, ?)", id, text, now, announcement.expires);
      return { announcement, fresh: true };
    });
    if (result.fresh && await this.ctx.storage.getAlarm() === null) {
      await this.ctx.storage.setAlarm(now + announcementWindow * 2);
    }
    return result;
  }

  async alarm() {
    const now = Date.now();
    this.sql.exec("DELETE FROM announcements WHERE expires <= ?", now - announcementWindow);
    const next = this.sql.exec("SELECT min(expires) AS expires FROM announcements").one().expires;
    if (next !== null) await this.ctx.storage.setAlarm(next + announcementWindow);
  }
}

function storedKeys(value) {
  try {
    const result = JSON.parse(value);
    if (result && typeof result === "object" && !Array.isArray(result)) {
      return Object.values(result).filter(hash => typeof hash === "string" && /^[\da-f]{64}$/.test(hash));
    }
  } catch {}
  return [];
}

async function authorized(request, keys) {
  const code = request.headers.get("Authorization")?.match(/^Bearer ([\w-]+)$/)?.[1] ?? "";
  if (!keyPattern.test(code)) return false;
  const hash = await crypto.subtle.digest("SHA-256", encoder.encode(code));
  let accepted = 0;
  for (const key of keys) {
    const bytes = Uint8Array.from(key.match(/../g), pair => parseInt(pair, 16));
    accepted |= Number(crypto.subtle.timingSafeEqual(hash, bytes));
  }
  return accepted === 1;
}

async function readPayload(request) {
  const reader = request.body?.getReader();
  if (!reader) return null;
  const decoder = new TextDecoder("utf-8", { fatal: true });
  let size = 0, raw = "";
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 2048) return null;
      raw += decoder.decode(value, { stream: true });
    }
    const data = JSON.parse(raw + decoder.decode());
    if (!data || typeof data !== "object" || typeof data.id !== "string" ||
      !requestIdPattern.test(data.id) || typeof data.text !== "string") return null;
    const text = data.text.replace(/\s+/gu, " ").trim();
    if (!text || text.length > 100 || /[\u0000-\u001f\u007f-\u009f\u202a-\u202e\u2066-\u2069]/u.test(text)) return null;
    return { id: data.id.toLowerCase(), text };
  } catch {
    return null;
  } finally {
    reader.cancel().catch(() => {});
  }
}

export async function announce(request, env) {
  if (request.headers.get("Origin") !== env.SITE_ORIGIN) return new Response(null, { status: 403 });
  const headers = { "Access-Control-Allow-Origin": env.SITE_ORIGIN, "Cache-Control": "no-store", "Vary": "Origin" };
  const respond = (payload, status = 200) => Response.json(payload, { status, headers });
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: {
      ...headers, "Access-Control-Allow-Methods": "GET, POST",
      "Access-Control-Allow-Headers": "Authorization, Content-Type", "Access-Control-Max-Age": "3600"
    } });
  }
  try {
    const feed = env.ANNOUNCEMENTS.getByName("site");
    const keys = storedKeys(env.STUDY_ANNOUNCEMENT_KEYS);
    if (request.method === "GET") return respond({ announcements: await feed.list(), publishing: keys.length > 0 });
    if (request.method !== "POST") return respond({ error: "method" }, 405);
    if (!keys.length) return respond({ error: "disabled" }, 503);
    const key = request.headers.get("CF-Connecting-IP") ?? "unknown";
    if (!(await env.ANNOUNCEMENT_LIMIT.limit({ key })).success) return respond({ error: "rate" }, 429);
    if (!await authorized(request, keys)) return respond({ error: "code" }, 401);
    if (!/^application\/json(?:;|$)/i.test(request.headers.get("Content-Type") ?? "")) {
      return respond({ error: "text" }, 400);
    }
    const payload = await readPayload(request);
    if (!payload) return respond({ error: "text" }, 400);
    const result = await feed.publish(payload.id, payload.text);
    if (result.retry) return respond({ error: "cooldown", seconds: result.retry }, 429);
    if (result.status) return respond({ error: "conflict" }, 409);
    return respond({ announcement: result.announcement }, result.fresh ? 201 : 200);
  } catch {
    return respond({ error: "unavailable" }, 503);
  }
}
