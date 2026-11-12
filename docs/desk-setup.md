# ShapeKraft Quote Desk — setup (about 30 minutes)

The desk runs on ShapeKraft's own enquiries first. It is the live demo for the RFQ Launch Kit, the Quote Desk Pilot, the Catalogue Site (enquiry → WhatsApp) and the AI Automation workflow.

**How it works:** an enquiry arrives (website quote form, or an email to hello@) → the desk reads it → it prices it from `src/lib/pricing.ts` → it drafts a reply → you get it on Telegram → you tap **Send**, **Edit** or **Reject** → everything is logged in a Google Sheet.

Nothing reaches a customer until you tap Send. For phone-only leads, you send the reply yourself from WhatsApp using the button on the Telegram card.

Until the env vars below are set, the code does nothing: the desk endpoints return 401 and web leads are only logged.

## 1. Telegram bot (5 min)
1. In Telegram, open **@BotFather** → `/newbot` → name it "ShapeKraft Desk" → copy the **token**.
2. Make up a long random string for **TELEGRAM_WEBHOOK_SECRET** (letters and numbers only).
3. Leave **TELEGRAM_OWNER_CHAT_ID** empty for now. You get it in step 5.

## 2. Google Sheet (5 min)
Follow the steps at the top of `apps-script/desk-sheet.gs`. You end up with **DESK_SHEET_URL** (the `/exec` URL) and **DESK_SHEET_TOKEN**.

## 3. Email sending (10 min, needed only for the Send button on email leads)
- Option A, **Brevo** (free, 300 emails a day): add and verify the domain shapekraft.co → create an API key → **BREVO_API_KEY**.
- Option B, **Resend**: verify the domain → **RESEND_API_KEY**.
- Then set **DESK_FROM_EMAIL** = `ShapeKraft <hello@shapekraft.co>`.

## 4. Vercel env vars (Production)
| Name | Value |
| --- | --- |
| `DESK_SECRET` | a long random string |
| `TELEGRAM_BOT_TOKEN` | from step 1 |
| `TELEGRAM_WEBHOOK_SECRET` | from step 1 |
| `TELEGRAM_OWNER_CHAT_ID` | from step 5 |
| `DESK_SHEET_URL`, `DESK_SHEET_TOKEN` | from step 2 |
| `BREVO_API_KEY` or `RESEND_API_KEY`, `DESK_FROM_EMAIL` | from step 3 |
| `ANTHROPIC_API_KEY` (optional) | Claude reads enquiries better and writes a personal opening line. Prices never come from the AI. Without it, the rules still work. |

Redeploy after adding them.

## 5. Connect the bot
1. Open `https://www.shapekraft.co/api/desk/setup?secret=<DESK_SECRET>`. This points the bot at the site and shows what is configured.
2. Send `/start` to your bot. It replies with your chat id → put it in `TELEGRAM_OWNER_CHAT_ID` → redeploy → `/start` again should say "connected".
3. Test it: fill in the quote form on shapekraft.in/quote. A card should arrive on Telegram within seconds.

## 6. Email channel (Cloudflare Email Worker, 10 min)
Email Routing for shapekraft.co already forwards to Gmail. This worker keeps that forward and also sends each email to the desk.
1. `cd workers/email-inbound && npm install && npx wrangler login && npx wrangler deploy`
2. `npx wrangler secret put DESK_SECRET` (the same value as in Vercel) and `npx wrangler secret put FORWARD_TO` (your Gmail).
3. Cloudflare → shapekraft.co → Email → Email Routing → Routes → `hello@` → action **Send to a Worker** → `shapekraft-email-desk`.

The desk ignores mail from shapekraft domains, no-reply addresses and auto-replies, so it can't loop.

## Changing prices
Edit `src/lib/pricing.ts`. The quote page, the desk and the FAQ (`src/lib/faq.ts`, update the text there) all follow it. When a founding client signs, lower `CONFIG.founding.slotsLeft`.
