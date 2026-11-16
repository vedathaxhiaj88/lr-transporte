# Direct contact form — activation checklist

Status: PREPARED ON ISOLATED BRANCH ONLY. Do not merge to production until the following are completed and tested.

1. Confirm the client can receive email at info@lrtransporte.ch. Never ask for their mailbox password.
2. Set up Resend account and verify a sending domain/subdomain the client authorizes. Configure required DNS records carefully without changing Hostpoint MX or existing mailbox delivery. Alternatively select a provider with a verified sender.
3. Set Cloudflare Pages environment secrets for the lr-transporte-premium-v2 project only: RESEND_API_KEY, CONTACT_FROM_EMAIL (verified sender address), TURNSTILE_SECRET_KEY. Do not commit secrets.
4. Create a Cloudflare Turnstile widget for lrtransporte.ch and preview hostname; replace TURNSTILE_SITE_KEY placeholder in index.html with public site key.
5. Verify Cloudflare Pages Functions deploys correctly with the current build configuration; check preview route POST /api/contact and failed/error states. Ensure API is not cached.
6. Test using an authorized test message, confirm inbox delivery and Reply-To; test empty fields, invalid email, spam challenge, and failure response.
7. Only after successful tests and client's authorization merge feature/direct-contact-form into production branch feature/premium-v2 and verify lrtransporte.ch live.

No modifications to family_places, vedat-portfolio, DNS, MX or Hostpoint email are part of this branch.
