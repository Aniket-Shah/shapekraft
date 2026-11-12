import { NextResponse } from 'next/server'
import { handleCallback, handleEditReply } from '@/lib/desk/engine'
import { tg } from '@/lib/desk/telegram'

// Telegram webhook. Only the owner's chat is obeyed; every call must carry the
// secret set with setWebhook (see /api/desk/setup).

type Update = {
  callback_query?: { id: string; data?: string; from: { id: number }; message?: { message_id: number; chat: { id: number } } }
  message?: { text?: string; chat: { id: number }; reply_to_message?: { text?: string } }
}

export async function POST(request: Request) {
  if (request.headers.get('x-telegram-bot-api-secret-token') !== process.env.TELEGRAM_WEBHOOK_SECRET) {
    return NextResponse.json({ ok: false }, { status: 401 })
  }
  const owner = String(process.env.TELEGRAM_OWNER_CHAT_ID ?? '')
  const update = (await request.json()) as Update

  try {
    const cq = update.callback_query
    if (cq) {
      if (String(cq.message?.chat.id) !== owner) return NextResponse.json({ ok: true })
      await handleCallback(cq.data ?? '', cq.message!.message_id, cq.id)
      return NextResponse.json({ ok: true })
    }

    const msg = update.message
    if (msg?.text) {
      const chatId = String(msg.chat.id)
      if (msg.text.startsWith('/start') || msg.text.startsWith('/id')) {
        // Helps setup: tells you the chat id to put in TELEGRAM_OWNER_CHAT_ID.
        await tg('sendMessage', {
          chat_id: chatId,
          text: chatId === owner
            ? '✅ ShapeKraft Quote Desk is connected. New enquiries will appear here.'
            : `Your chat id is ${chatId}. Put it in TELEGRAM_OWNER_CHAT_ID to receive enquiries.`,
        })
      } else if (chatId === owner && msg.reply_to_message?.text) {
        await handleEditReply(msg.reply_to_message.text, msg.text)
      }
    }
  } catch (err) {
    console.error('[desk] telegram webhook error', err)
    if (owner) await tg('sendMessage', { chat_id: owner, text: `❌ Desk error: ${(err as Error).message.slice(0, 300)}` }).catch(() => undefined)
  }
  // Always 200 so Telegram doesn't retry the same update forever.
  return NextResponse.json({ ok: true })
}
