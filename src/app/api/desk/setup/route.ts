import { NextResponse } from 'next/server'
import { tg } from '@/lib/desk/telegram'
import { mailerConfigured } from '@/lib/desk/mailer'
import { sheetConfigured } from '@/lib/desk/sheet'

// One-time setup check. Open /api/desk/setup?secret=<DESK_SECRET> after setting
// the env vars: it points the Telegram bot at this site and reports what is
// configured. Safe to open again any time.

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const url = new URL(request.url)
  if (!process.env.DESK_SECRET || url.searchParams.get('secret') !== process.env.DESK_SECRET) {
    return NextResponse.json({ ok: false }, { status: 401 })
  }
  const status: Record<string, unknown> = {
    sheet: sheetConfigured(),
    email: mailerConfigured(),
    ai: !!process.env.ANTHROPIC_API_KEY,
    telegramOwnerChat: !!process.env.TELEGRAM_OWNER_CHAT_ID,
  }
  if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_WEBHOOK_SECRET) {
    const webhook = `${url.origin}/api/desk/telegram`
    try {
      await tg('setWebhook', {
        url: webhook,
        secret_token: process.env.TELEGRAM_WEBHOOK_SECRET,
        allowed_updates: ['message', 'callback_query'],
      })
      const me = await tg<{ username: string }>('getMe', {})
      status.telegram = `webhook set to ${webhook} for @${me.username}`
    } catch (err) {
      status.telegram = `error: ${(err as Error).message}`
    }
  } else {
    status.telegram = 'missing TELEGRAM_BOT_TOKEN or TELEGRAM_WEBHOOK_SECRET'
  }
  return NextResponse.json({ ok: true, ...status })
}
