// Telegram Bot API helpers. Env: TELEGRAM_BOT_TOKEN, TELEGRAM_OWNER_CHAT_ID,
// TELEGRAM_WEBHOOK_SECRET (checked on every webhook call).

const api = (method: string) => `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/${method}`

export function telegramConfigured() {
  return !!process.env.TELEGRAM_BOT_TOKEN && !!process.env.TELEGRAM_OWNER_CHAT_ID
}

export const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

export async function tg<T = unknown>(method: string, body: Record<string, unknown>): Promise<T> {
  const res = await fetch(api(method), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = (await res.json()) as { ok: boolean; result: T; description?: string }
  if (!data.ok) throw new Error(`Telegram ${method}: ${data.description}`)
  return data.result
}

export type Button = { text: string; callback_data?: string; url?: string }

export function sendToOwner(html: string, buttons?: Button[][]) {
  return tg<{ message_id: number }>('sendMessage', {
    chat_id: process.env.TELEGRAM_OWNER_CHAT_ID,
    text: html.slice(0, 4000),
    parse_mode: 'HTML',
    disable_web_page_preview: true,
    ...(buttons ? { reply_markup: { inline_keyboard: buttons } } : {}),
  })
}

export function editOwnerMessage(messageId: number | string, html: string, buttons?: Button[][]) {
  return tg('editMessageText', {
    chat_id: process.env.TELEGRAM_OWNER_CHAT_ID,
    message_id: Number(messageId),
    text: html.slice(0, 4000),
    parse_mode: 'HTML',
    disable_web_page_preview: true,
    reply_markup: { inline_keyboard: buttons ?? [] },
  })
}
