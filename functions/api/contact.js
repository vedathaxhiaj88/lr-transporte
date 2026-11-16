// Cloudflare Pages Function for verified Resend sender and Turnstile-protected contact form.
const json = (body, status = 200) => new Response(JSON.stringify(body), {
  status, headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
});
const escapeHtml = (value) => value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
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
  // Some mail clients ignore Reply-To and reply to the noreply sender instead.
  // Give the recipient a prominent, explicit link to reply to the customer.
  const replySubject = `Re: Website-Anfrage: ${service || "Transport"}`;
  const replyLink = `mailto:${email}?subject=${encodeURIComponent(replySubject)}`;
  const html = `<p><strong>Neue Website-Anfrage</strong></p><p><a href="${escapeHtml(replyLink)}" style="display:inline-block;padding:12px 18px;background:#b84623;color:#fff;text-decoration:none;border-radius:4px;font-weight:bold">Dem Kunden antworten</a></p><p><strong>Kunden-E-Mail:</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p><p><strong>Name:</strong> ${escapeHtml(name)}<br><strong>Telefon:</strong> ${escapeHtml(phone || "Nicht angegeben")}<br><strong>Leistung:</strong> ${escapeHtml(service)}</p><p><strong>Nachricht:</strong></p><p style="white-space:pre-wrap">${escapeHtml(message)}</p><p style="color:#555;font-size:12px">Bitte zum Antworten auf «Dem Kunden antworten» klicken. Die normale Antworten-Funktion kann an noreply@lrtransporte.ch gehen.</p>`;
  const sent = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: env.CONTACT_FROM_EMAIL, to: ["info@lrtransporte.ch"], reply_to: email,
      subject: `Website-Anfrage: ${service || "Transport"}`, text: body, html }),
  });
  if (!sent.ok) return json({ error: "Delivery failed" }, 502);
  return json({ ok: true });
}
export function onRequestGet() { return json({ error: "Method not allowed" }, 405); }
