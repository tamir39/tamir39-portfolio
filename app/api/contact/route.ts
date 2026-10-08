import nodemailer from "nodemailer";
export const runtime = "nodejs";
const attempts = new Map<string, { count: number; expires: number }>();
const reply = (status: number) => Response.json({ ok: status === 200 }, { status });
export async function POST(request: Request) {
  try {
    const origin = new URL(request.headers.get("origin") || "");
    if (!["http:", "https:"].includes(origin.protocol) || origin.host !== request.headers.get("host")) return reply(403);
  } catch { return reply(403); }
  if (!request.headers.get("content-type")?.includes("application/json")) return reply(415);
  const now = Date.now();
  for (const [key, value] of attempts) if (value.expires <= now) attempts.delete(key);
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const entry = attempts.get(ip) || { count: 0, expires: now + 600_000 };
  if (entry.count >= 5 || attempts.size >= 10_000) return reply(429);
  entry.count++; attempts.set(ip, entry);
  let data: Record<string, unknown>;
  try {
    const reader = request.body?.getReader();
    if (!reader) return reply(400);
    const chunks: Uint8Array[] = [];
    let size = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 24_000) { await reader.cancel(); return reply(413); }
      chunks.push(value);
    }
    data = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    if (!data || typeof data !== "object" || Array.isArray(data)) return reply(400);
  } catch { return reply(400); }
  if (data._gotcha) return reply(400);
  if (typeof data.name !== "string" || (data.email !== undefined && typeof data.email !== "string") || typeof data.message !== "string") return reply(400);
  const name = data.name.trim(), email = typeof data.email === "string" ? data.email.trim() : "", message = data.message.trim();
  if (name.length < 2 || name.length > 80 || /[\r\n]/.test(name)
    || email.length > 254 || (email !== "" && !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email))
    || message.length === 0 || message.length > 5000) return reply(400);
  const user = process.env.GMAIL_USER?.trim();
  const password = process.env.GMAIL_APP_PASSWORD?.replace(/\s/g, "");
  if (!user || !password) return reply(503);
  const transport = nodemailer.createTransport({
    host: "smtp.gmail.com", port: 465, secure: true,
    auth: { user, pass: password },
    connectionTimeout: 10_000, greetingTimeout: 10_000, socketTimeout: 20_000,
  });
  try {
    await transport.sendMail({
      from: { name: "Tamir Portfolio Notifications", address: user },
      to: "tamphi5002@gmail.com", ...(email ? { replyTo: { name, address: email } } : {}),
      subject: `${name} sent you a message from your portfolio`,
      text: `TAMIR / PORTFOLIO\nSomeone sent you a message from your portfolio.\n\nFrom: ${name}\nEmail: ${email || "Not provided — no reply address"}\n\nMESSAGE\n${message}\n\nSent from your portfolio contact form.`,
      html: contactEmail(name, email, message),
    });
    return reply(200);
  } catch { return reply(502); }
  finally { transport.close(); }
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]!));
}

function contactEmail(name: string, email: string, message: string) {
  return `<div style="background:#f7f4fa;padding:32px 16px;font-family:Arial,sans-serif;color:#302841"><div style="max-width:560px;margin:auto;background:#fff;border:1px solid #ded5e8;border-radius:20px;padding:32px"><p style="font-size:11px;letter-spacing:3px;color:#79648f">TAMIR / PORTFOLIO</p><h1 style="font-size:28px;font-weight:500;margin:24px 0">Someone sent you a message from your portfolio.</h1><p style="line-height:1.8"><strong>From</strong><br>${escapeHtml(name)}</p><p style="line-height:1.8"><strong>Email</strong><br>${email ? escapeHtml(email) : "Not provided — no reply address"}</p><div style="border-top:1px solid #ded5e8;margin-top:24px;padding-top:24px"><p style="font-size:11px;letter-spacing:2px;color:#79648f">MESSAGE</p><p style="font-size:16px;line-height:1.8;overflow-wrap:anywhere">${escapeHtml(message).replace(/\r?\n/g, "<br>")}</p></div><p style="font-size:12px;color:#79648f;margin-top:32px">${email ? "Use Reply to continue the conversation." : "This visitor didn’t leave an email address."}</p></div></div>`;
}
