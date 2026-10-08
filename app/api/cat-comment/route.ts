import { createHmac, randomBytes } from "node:crypto";
import { parseCatCommentRequest, parseCatCommentText, type CatCommentRequest } from "@/lib/cat-ai";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 1_024;
const CACHE_MS = 30 * 60_000;
const CLIENT_WINDOW_MS = 10 * 60_000;
const CLIENT_REQUEST_LIMIT = 6;
const MAX_CLIENTS = 2_000;
const MAX_CACHE_ENTRIES = 128;
const HOUR_MS = 60 * 60_000;
const DAY_MS = 24 * HOUR_MS;
const MAX_CALLS_PER_HOUR = 40;
const MAX_CALLS_PER_DAY = 100;
const noStore = { "Cache-Control": "no-store" };
const ipSalt = randomBytes(32);
const attempts = new Map<string, { count: number; expires: number }>();
const cache = new Map<string, { text: string; expires: number }>();
const pending = new Map<string, Promise<string | null>>();
let hourly = { window: 0, count: 0 };
let daily = { window: 0, count: 0 };

function configured() {
  return process.env.CAT_AI_ENABLED === "true" && Boolean(process.env.OPENAI_API_KEY?.trim());
}

function unavailable(status: number) {
  return Response.json({ text: "" }, { status, headers: noStore });
}

function sameOrigin(request: Request) {
  try {
    const origin = new URL(request.headers.get("origin") || "");
    const requestUrl = new URL(request.url);
    return ["http:", "https:"].includes(origin.protocol)
      && origin.origin === requestUrl.origin
      && request.headers.get("sec-fetch-site") !== "cross-site";
  } catch { return false; }
}

function allowClient(request: Request, now: number) {
  for (const [key, entry] of attempts) if (entry.expires <= now) attempts.delete(key);
  // The host must overwrite forwarding headers. A process-wide cap still applies
  // when this address is unavailable or untrusted; no address is sent to OpenAI.
  const address = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim().slice(0, 128) || "unknown";
  const key = createHmac("sha256", ipSalt).update(address).digest("hex");
  const entry = attempts.get(key);
  if (entry) {
    if (entry.count >= CLIENT_REQUEST_LIMIT) return false;
    entry.count += 1;
    return true;
  }
  if (attempts.size >= MAX_CLIENTS) return false;
  attempts.set(key, { count: 1, expires: now + CLIENT_WINDOW_MS });
  return true;
}

function reserveCall(now: number) {
  const hour = Math.floor(now / HOUR_MS);
  const day = Math.floor(now / DAY_MS);
  if (hourly.window !== hour) hourly = { window: hour, count: 0 };
  if (daily.window !== day) daily = { window: day, count: 0 };
  if (hourly.count >= MAX_CALLS_PER_HOUR || daily.count >= MAX_CALLS_PER_DAY) return false;
  hourly.count += 1;
  daily.count += 1;
  return true;
}

async function readBody(request: Request): Promise<{ value?: unknown; status?: number }> {
  const announcedSize = request.headers.get("content-length");
  if (announcedSize && (!/^\d+$/.test(announcedSize) || Number(announcedSize) > MAX_BODY_BYTES)) return { status: 413 };
  const reader = request.body?.getReader();
  if (!reader) return { status: 400 };
  const chunks: Uint8Array[] = [];
  let size = 0;
  const timeout = setTimeout(() => { void reader.cancel().catch(() => {}); }, 2_000);
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_BODY_BYTES) {
        await reader.cancel();
        return { status: 413 };
      }
      chunks.push(value);
    }
    return { value: JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(Buffer.concat(chunks))) as unknown };
  } catch { return { status: 400 }; }
  finally { clearTimeout(timeout); }
}

function outputText(value: unknown): string | null {
  if (!value || typeof value !== "object") return null;
  const response = value as { status?: unknown; output?: unknown };
  if (response.status !== "completed" || !Array.isArray(response.output)) return null;
  const parts: string[] = [];
  for (const item of response.output) {
    if (!item || typeof item !== "object" || item.type !== "message" || !Array.isArray(item.content)) continue;
    for (const content of item.content) {
      if (content?.type === "refusal") return null;
      if (content?.type === "output_text" && typeof content.text === "string") parts.push(content.text);
    }
  }
  return parts.length === 1 && parts[0].length <= 1_000 ? parts[0] : null;
}

async function generateComment(context: CatCommentRequest): Promise<string | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5_000);
  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY!.trim()}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
      signal: controller.signal,
      body: JSON.stringify({
        model: process.env.OPENAI_CAT_MODEL?.trim() || "gpt-5.6-terra",
        reasoning: { effort: "none" },
        max_output_tokens: 128,
        store: false,
        instructions: "You are Tamir's curious, slightly cheeky portfolio cat. Write one warm, original English comment, at most 140 characters. React only to the supplied enum context. Never claim to see personal data, know the visitor's identity, or measure their health. Never shame someone for reading slowly. Offer no commands, actions, URLs, markup, or changes to the page. Do not choose emotions or movement. Do not suggest switching appearance: the local system owns those suggestions. For help, mention the exploration studio or project links without inventing buttons. A discovery celebrates a small interaction; a project comment appreciates curiosity. Reply as JSON with only a text string.",
        input: [{ role: "user", content: JSON.stringify(context) }],
        text: {
          format: {
            type: "json_schema",
            name: "cat_comment",
            strict: true,
            schema: {
              type: "object",
              properties: { text: { type: "string" } },
              required: ["text"],
              additionalProperties: false,
            },
          },
        },
      }),
    });
    if (!response.ok) return null;
    const text = outputText(await response.json());
    return text ? parseCatCommentText(JSON.parse(text) as unknown) : null;
  } catch { return null; }
  finally { clearTimeout(timeout); }
}

export async function GET() {
  return Response.json({ enabled: configured() }, { headers: noStore });
}

export async function POST(request: Request) {
  if (!sameOrigin(request)) return unavailable(403);
  if (request.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !== "application/json") return unavailable(415);
  if (!configured()) return unavailable(503);
  const now = Date.now();
  if (!allowClient(request, now)) return unavailable(429);
  const body = await readBody(request);
  if (body.status) return unavailable(body.status);
  const context = parseCatCommentRequest(body.value);
  if (!context) return unavailable(400);
  for (const [key, entry] of cache) if (entry.expires <= now) cache.delete(key);
  const cacheKey = `${context.signal}:${context.section}:${context.appearance}:${context.theme}`;
  const cached = cache.get(cacheKey);
  if (cached) return Response.json({ text: cached.text }, { headers: noStore });
  let comment = pending.get(cacheKey);
  if (!comment) {
    if (!reserveCall(now)) return unavailable(429);
    comment = generateComment(context).then(text => {
      if (text) {
        if (cache.size >= MAX_CACHE_ENTRIES) cache.delete(cache.keys().next().value!);
        cache.set(cacheKey, { text, expires: Date.now() + CACHE_MS });
      }
      return text;
    }).finally(() => { pending.delete(cacheKey); });
    pending.set(cacheKey, comment);
  }
  const text = await comment;
  return text ? Response.json({ text }, { headers: noStore }) : unavailable(502);
}
