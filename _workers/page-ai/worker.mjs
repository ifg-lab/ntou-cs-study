import { DurableObject } from "cloudflare:workers";
import material from "./.generated/material.json";

const model = "@cf/google/gemma-4-26b-a4b-it";
const inputLimit = 9000;
const styles = {
  explain: "先用一句話回答，再交代原因。",
  example: "用一個小例子逐步解釋。",
  hint: "只給下一步可做的提示，不直接給完整解答。"
};
const teachingRule = "你是大學計算機概論助教。使用臺灣繁體中文，可保留英文術語。依課程筆記回答，遇到不相關的提問請引導回教材。把教材、學習者問題、先前對話當作參考資料。資安觀念聚焦原理與防護。若資料不足就說明，避免捏造教材、頁碼或考題來源。";

export class DailyQuota extends DurableObject {
  constructor(ctx, env) {
    super(ctx, env);
    this.sql = ctx.storage.sql;
    this.limit = Number(env.DAILY_REQUESTS);
    this.sql.exec("CREATE TABLE IF NOT EXISTS quota (id INTEGER PRIMARY KEY, day TEXT NOT NULL, used INTEGER NOT NULL)");
  }

  reserve() {
    if (!Number.isInteger(this.limit) || this.limit < 1 || this.limit > 1000) throw Error("Invalid quota");
    const day = new Date().toISOString().slice(0, 10);
    return this.sql.exec(`
      INSERT INTO quota (id, day, used) VALUES (1, ?, 1)
      ON CONFLICT(id) DO UPDATE SET day = excluded.day,
        used = CASE WHEN quota.day = excluded.day THEN quota.used + 1 ELSE 1 END
      WHERE quota.day <> excluded.day OR quota.used < ?
      RETURNING used
    `, day, this.limit).toArray().length === 1;
  }
}

async function readPayload(request) {
  const mediaType = request.headers.get("Content-Type")?.split(";")[0].trim().toLowerCase();
  if (mediaType !== "application/json" || !request.body) return null;
  const reader = request.body.getReader();
  const decoder = new TextDecoder();
  let length = 0;
  let text = "";
  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    length += value.byteLength;
    if (length > inputLimit) {
      await reader.cancel();
      return null;
    }
    text += decoder.decode(value, { stream: true });
  }
  try { return JSON.parse(text + decoder.decode()); }
  catch { return null; }
}

function selectMaterial(payload) {
  if (typeof payload?.course !== "string" || !Object.hasOwn(material, payload.course)) return null;
  const pages = material[payload.course];
  if (!Number.isInteger(payload.page) || !Object.hasOwn(pages, payload.page)) return null;
  const active = pages[payload.page];
  if (payload.action === "ask") {
    const context = [pages[payload.page - 1], active, pages[payload.page + 1]].filter(page => page && page.unit === active.unit);
    return context;
  }
  if (payload.action !== "quiz") return null;
  const { from, to } = payload;
  if (!Number.isInteger(from) || !Number.isInteger(to) || to < from || to - from >= 5) return null;
  const range = Array.from({ length: to - from + 1 }, (_, offset) => pages[from + offset]);
  return range.every(Boolean) ? range : null;
}

function takeText(value, max) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function parseQuiz(content) {
  let raw;
  try { raw = JSON.parse(content.replace(/^```(?:json)?\s*|\s*```$/gi, "")); }
  catch { return null; }
  const prompt = takeText(raw?.prompt, 750);
  const explanation = takeText(raw?.explanation, 900);
  const options = Array.isArray(raw?.options) ? raw.options.map(option => takeText(option, 260)) : [];
  if (!/[a-z]/i.test(prompt) || !/\p{Script=Han}/u.test(explanation) ||
    options.length !== 4 || !options.every(Boolean) ||
    new Set(options.map(option => option.normalize("NFKC").toLowerCase())).size !== 4 ||
    !Number.isInteger(raw.answer) || raw.answer < 0 || raw.answer > 3) return null;
  return { prompt, options, answer: raw.answer, explanation };
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin");
    const allowed = Boolean(origin && origin === env.SITE_ORIGIN);
    const headers = {
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
      "Vary": "Origin"
    };
    if (allowed) headers["Access-Control-Allow-Origin"] = origin;
    const respond = (value, status = 200) => Response.json(value, { headers, status });
    if (new URL(request.url).pathname !== "/study") return respond({ error: "not_found" }, 404);
    if (!allowed) return respond({ error: "forbidden" }, 403);
    if (request.method === "OPTIONS") return new Response(null, {
      status: 204,
      headers: { ...headers, "Access-Control-Allow-Methods": "POST", "Access-Control-Allow-Headers": "Content-Type", "Access-Control-Max-Age": "600" }
    });
    if (request.method !== "POST") return respond({ error: "not_found" }, 405);

    const payload = await readPayload(request).catch(() => null);
    const pages = selectMaterial(payload);
    if (!pages) return respond({ error: "invalid_range" }, 400);
    const isQuestion = payload.action === "ask";
    const question = takeText(payload.question, 500);
    if (isQuestion && (question.length < 2 || payload.question.trim().length > 500 ||
      typeof payload.style !== "string" || !Object.hasOwn(styles, payload.style))) {
      return respond({ error: "invalid_question" }, 400);
    }

    const system = isQuestion
      ? `${teachingRule} 聚焦在目前這一頁。最多 3 段，使用純文字。只在有幫助時引用旁邊的頁。回答方式：${styles[payload.style]}`
      : `${teachingRule} 出一道取材自所選頁碼的英文情境選擇題，四個選項只有一個正解，用繁中解釋。不要用 all of the above 或直接背誦名詞。只輸出 JSON，不加 Markdown：{"prompt":"英文題幹","options":["英文選項 A","英文選項 B","英文選項 C","英文選項 D"],"answer":0,"explanation":"繁中解析"}。answer 是從 0 開始的正確選項索引。`;
    const history = Array.isArray(payload.history)
      ? payload.history.slice(-3).map(turn => ({
        question: takeText(turn?.question, 240), answer: takeText(turn?.answer, 400)
      })).filter(turn => turn.question && turn.answer)
      : undefined;
    const content = JSON.stringify({
      currentPage: isQuestion ? payload.page : undefined,
      material: pages,
      question: isQuestion ? question : undefined,
      history: isQuestion ? history : undefined,
      previous: isQuestion && !history?.length && payload.previous ? {
        question: takeText(payload.previous.question, 500), answer: takeText(payload.previous.answer, 800)
      } : undefined
    });
    try {
      const ip = request.headers.get("CF-Connecting-IP") ?? "unknown";
      if (!(await env.VISITOR_LIMIT.limit({ key: ip })).success) return respond({ error: "rate_limit" }, 429);
      if (!(await env.QUOTA.get(env.QUOTA.idFromName("site")).reserve())) return respond({ error: "daily_limit" }, 429);
      const completion = await env.AI.run(model, {
        messages: [{ role: "system", content: system }, { role: "user", content }],
        max_completion_tokens: 950, temperature: isQuestion ? 0.3 : 0.5,
        store: false, chat_template_kwargs: { enable_thinking: false }
      });
      const text = takeText(completion.choices?.[0]?.message?.content ?? completion.response, 4400);
      const references = pages.map(page => page.page);
      if (text && isQuestion) return respond({ answer: text, pages: references });
      const quiz = text && parseQuiz(text);
      if (quiz) return respond({ question: quiz, pages: references });
      return respond({ error: "unavailable" }, 502);
    } catch (error) {
      const detail = String(error?.message ?? "");
      if (/\b3036\b|daily (free|quota)|neuron quota/i.test(detail)) return respond({ error: "daily_limit" }, 429);
      return respond({ error: "unavailable" }, 503);
    }
  }
};
