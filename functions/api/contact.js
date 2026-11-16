// Cloudflare Pages Function. Preview-only until Resend sender verification,
// API secret and anti-spam protection are configured and tested.
const json = (body, status = 200) => new Response(JSON.stringify(body), {
  status, headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
});
const clean = (value, max) => typeof value === "string" ? value.trim().slice(0, max) : "";
export async function onRequestPost({ request, env }) {
  const origin = request.headers.get("Origin");
  if (origin && new URL(origin).host !== new URL(request.url).host) return json({ error: "Forbidden" }, 403);
  if (!env.RESEND_API_KEY || !env.CONTACT_FROM_EMAIL || !env.TURNSTILE_SECRET_KEY) {
    return json({ error: "Contact form not configured" }, 503);
  }
  if (Number(request.headers.get("content-length") || 0) > 12000) return json({ error: "Too large" }, 413);
  let data;
  try { data = await request.json(); } catch { return json({ error: "Invalid request" }, 400); }
  if (!data || typeof data !== "object") return json({ error: "Invalid request" }, 400);
  if (data.website) return json({ error: "Rejected" }, 400); // honeypot
  const name = clean(data.name, 120);
  const email = clean(data.email, 200);
  const phone = clean(data.phone, 60);
  const service = clean(data.service, 80);
  const message = clean(data.message, 3000);
  const token = clean(data["cf-turnstile-response"], 4096);
  if (!name || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !token)
    return json({ error: "Missing or invalid fields" }, 400);
  const challenge = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ secret: env.TURNSTILE_SECRET_KEY, response: token, remoteip: request.headers.get("CF-Connecting-IP") }),
  });
  if (!challenge.ok || !(await challenge.json()).success) return json({ error: "Verification failed" }, 400);
  const body = [`Name: ${name}`, `E-Mail: ${email}`, `Telefon: ${phone || "Nicht angegeben"}`, `Leistung: ${service}`, "", message].join("\n");
  const sent = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: env.CONTACT_FROM_EMAIL, to: ["info@lrtransporte.ch"], reply_to: email,
      subject: `Website-Anfrage: ${service || "Transport"}`, text: body }),
  });
  if (!sent.ok) return json({ error: "Delivery failed" }, 502);
  return json({ ok: true });
}
export function onRequestGet() { return json({ error: "Method not allowed" }, 405); }
