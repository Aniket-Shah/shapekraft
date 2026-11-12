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

## 3. Zoho Mail API (15 min, for reading hello@ and sending approved replies)
1. Go to **api-console.zoho.in** (use zoho.com if your account is US-region) → **Add Client** → **Server-based Applications** → copy **Client ID** and **Client Secret**. Homepage URL: https://www.shapekraft.co, redirect URI: https://www.shapekraft.co.
2. Generate a grant code with scopes `ZohoMail.messages.ALL,ZohoMail.accounts.READ` (access type offline), then exchange it for a **refresh token**. The console shows the exact curl command.
3. Get your **account id**: `GET https://mail.zoho.in/api/accounts` with the access token, and copy `accountId` for hello@shapekraft.co.
4. Confirm hello@shapekraft.co is a mailbox in that account.
5. Set **ZOHO_REGION** = `in` (or `com`), **ZOHO_FROM_ADDRESS** = `hello@shapekraft.co`.

Check first: Zoho's API may need a paid Zoho Mail plan. Test it with step 3 before setting anything else.

## 4. Vercel env vars (Production)
| Name | Value |
| --- | --- |
| `DESK_SECRET` | a long random string |
| `TELEGRAM_BOT_TOKEN` | from step 1 |
| `TELEGRAM_WEBHOOK_SECRET` | from step 1 |
| `TELEGRAM_OWNER_CHAT_ID` | from step 5 |
| `DESK_SHEET_URL`, `DESK_SHEET_TOKEN` | from step 2 |
| `ZOHO_CLIENT_ID`, `ZOHO_CLIENT_SECRET`, `ZOHO_REFRESH_TOKEN`, `ZOHO_ACCOUNT_ID`, `ZOHO_FROM_ADDRESS`, `ZOHO_REGION` | from step 3 |
| `ANTHROPIC_API_KEY` (optional) | Claude reads enquiries better and writes a personal opening line. Prices never come from the AI. Without it, the rules still work. |

Redeploy after adding them.

## 5. Connect the bot
1. Open `https://www.shapekraft.co/api/desk/setup?secret=<DESK_SECRET>`. This points the bot at the site and shows what is configured.
2. Send `/start` to your bot. It replies with your chat id → put it in `TELEGRAM_OWNER_CHAT_ID` → redeploy → `/start` again should say "connected".
3. Test it: fill in the quote form on shapekraft.in/quote, and email hello@ from another address. A card should arrive on Telegram within seconds (email within 5 minutes, once the scheduler runs).

## 6. Email intake (5 min)
The desk checks hello@ every few minutes through `/api/desk/poll`. Vercel's free plan only runs crons once a day, so use a free external scheduler:
1. cron-job.org (or any uptime pinger) → new job every **5 minutes**
2. URL: `https://www.shapekraft.co/api/desk/poll?secret=<DESK_SECRET>`
3. Each run reads unread mail, skips automated and ShapeKraft-internal senders, drafts a reply for each real enquiry, and marks the email read.

Replies go out from hello@ in Zoho, so customers see one mailbox.

## Changing prices
Edit `src/lib/pricing.ts`. The quote page, the desk and the FAQ (`src/lib/faq.ts`, update the text there) all follow it. When a founding client signs, lower `CONFIG.founding.slotsLeft`.
