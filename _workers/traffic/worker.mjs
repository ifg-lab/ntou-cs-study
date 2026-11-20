import { DurableObject } from "cloudflare:workers";
import { announce } from "./announcements.mjs";

export { StudyAnnouncements } from "./announcements.mjs";

const dayLength = 86_400_000;
const taipeiOffset = 8 * 3_600_000;
const onlineWindow = 120_000;
const visitorId = /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/;
const dayStart = now => Math.floor((now + taipeiOffset) / dayLength) * dayLength - taipeiOffset;

function cleanupTime(now) {
  const today = dayStart(now) + onlineWindow;
  return today > now ? today : today + dayLength;
}

export class StudyTraffic extends DurableObject {
  constructor(ctx, env) {
    super(ctx, env);
    this.sql = ctx.storage.sql;
    this.sql.exec("CREATE TABLE IF NOT EXISTS visits (browser TEXT PRIMARY KEY, seen_at INTEGER NOT NULL)");
    this.sql.exec("CREATE INDEX IF NOT EXISTS visits_seen_at ON visits(seen_at)");
    this.sql.exec("CREATE TABLE IF NOT EXISTS days (start_at INTEGER PRIMARY KEY, visitors INTEGER NOT NULL)");
    ctx.blockConcurrencyWhile(async () => {
      if (await ctx.storage.getAlarm() === null) {
        await ctx.storage.setAlarm(cleanupTime(Date.now()));
      }
    });
  }

  record(browser) {
    const now = Date.now();
    const day = dayStart(now);
    const { previous, today } = this.ctx.storage.transactionSync(() => {
      const previous = this.sql.exec("SELECT seen_at FROM visits WHERE browser = ?", browser).toArray()[0]?.seen_at;
      const firstToday = previous === undefined || previous < day;

      if (firstToday || now - previous >= 15_000) {
        this.sql.exec("INSERT INTO visits VALUES (?, ?) ON CONFLICT(browser) DO UPDATE SET seen_at = excluded.seen_at", browser, now);
      }
      if (firstToday) {
        this.sql.exec("INSERT INTO days VALUES (?, 1) ON CONFLICT(start_at) DO UPDATE SET visitors = visitors + 1", day);
      }
      return { previous, today: this.sql.exec("SELECT visitors FROM days WHERE start_at = ?", day).one().visitors };
    });

    // Limit repeated scans while many browsers send heartbeats together.
    if (!this.snapshot || now - this.snapshot.time >= 10_000) {
      this.snapshot = {
        time: now,
        count: this.sql.exec("SELECT count(*) AS count FROM visits WHERE seen_at >= ?", now - onlineWindow).one().count
      };
    } else if (previous === undefined || previous < this.snapshot.time - onlineWindow) {
      this.snapshot.count++;
    }

    return { today, online: this.snapshot.count };
  }

  async alarm() {
    const now = Date.now();
    const day = dayStart(now);
    this.sql.exec("DELETE FROM visits WHERE seen_at < ?", Math.min(day, now - onlineWindow));
    this.sql.exec("DELETE FROM days WHERE start_at < ?", day);
    await this.ctx.storage.setAlarm(cleanupTime(now));
  }
}

export default {
  async fetch(request, env) {
    const path = new URL(request.url).pathname;
    if (path === "/announcements") return announce(request, env);
    if (path !== "/count") return new Response(null, { status: 404 });
    if (request.headers.get("Origin") !== env.SITE_ORIGIN) return new Response(null, { status: 403 });

    const headers = {
      "Access-Control-Allow-Origin": env.SITE_ORIGIN,
      "Cache-Control": "no-store",
      "Vary": "Origin"
    };
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          ...headers,
          "Access-Control-Allow-Methods": "POST",
          "Access-Control-Allow-Headers": "X-Study-Visitor",
          "Access-Control-Max-Age": "3600"
        }
      });
    }
    if (request.method !== "POST") return new Response(null, { status: 405, headers });
    const id = request.headers.get("X-Study-Visitor") ?? "";
    if (!visitorId.test(id)) return new Response(null, { status: 400, headers });

    const key = request.headers.get("CF-Connecting-IP") ?? "unknown";
    const { success } = await env.VISITOR_LIMIT.limit({ key });
    if (!success) return new Response(null, { status: 429, headers });

    try {
      const hash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(id));
      const browser = Array.from(new Uint8Array(hash), byte => byte.toString(16).padStart(2, "0")).join("");
      const counts = await env.TRAFFIC.getByName("site").record(browser);
      return Response.json(counts, { headers });
    } catch {
      return new Response(null, { status: 503, headers });
    }
  }
};
