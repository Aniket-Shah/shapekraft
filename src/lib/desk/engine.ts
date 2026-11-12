import { formatPrice } from '@/lib/market'
import { refineWithAI } from './ai'
import { draftReply } from './draft'
import { extractByRules } from './extract'
import { mailerConfigured, sendEmail } from './mailer'
import { buildQuote } from './quote'
import { appendRecord, getRecord, sheetConfigured, updateRecord } from './sheet'
import { editOwnerMessage, esc, sendToOwner, telegramConfigured, tg, type Button } from './telegram'
import type { DeskRecord, Enquiry } from './types'

// The quote desk: enquiry in → read it → price it from the price list → draft a
// reply → owner approves on Telegram → reply sent and logged in the Sheet.
// Nothing is ever sent to a customer without the owner tapping "Send".

export function newId() {
  return `SK-${Date.now().toString(36).toUpperCase().slice(-5)}${Math.random().toString(36).slice(2, 4).toUpperCase()}`
}

const waLink = (phone: string, text: string) =>
  `https://wa.me/${phone.replace(/[^\d]/g, '').replace(/^(?=[6-9]\d{9}$)/, '91')}?text=${encodeURIComponent(text)}`

function ownerCard(r: DeskRecord, extra = '') {
  const contact = [r.email, r.phone].filter(Boolean).join(' · ') || 'no contact'
  const price = r.setup > 0 ? `${formatPrice(r.setup, r.currency)}${r.monthly > 0 ? ` + ${formatPrice(r.monthly, r.currency)}/mo` : ''}` : r.intent === 'quote' ? 'on a call' : '—'
  const flag = r.intent === 'spam' ? '🚫 Likely spam\n' : ''
  return [
    `${flag}<b>🆕 ${esc(r.id)}</b> · ${esc(r.channel)} · ${esc(r.name || 'Unknown')}`,
    esc(contact),
    `<b>${esc(r.summary)}</b>`,
    r.packageLabel ? `Quote: ${esc(r.packageLabel)} · ${esc(price)}` : '',
    '',
    `<i>${esc(r.message.replace(/\s+/g, ' ').slice(0, 500))}</i>`,
    '',
    `<b>Draft reply</b> — ${esc(r.replySubject)}`,
    `<pre>${esc(r.replyBody.slice(0, 2500))}</pre>`,
    extra,
  ].filter((l) => l !== '').join('\n')
}

function buttonsFor(r: DeskRecord): Button[][] {
  if (!sheetConfigured()) return []
  if (r.email) {
    return [
      [{ text: mailerConfigured() ? '✅ Send email' : '✅ Send (email not set up)', callback_data: `a:${r.id}` }, { text: '✏️ Edit', callback_data: `e:${r.id}` }],
      [{ text: '🗑 Reject', callback_data: `r:${r.id}` }],
    ]
  }
  const rows: Button[][] = []
  if (r.phone) rows.push([{ text: '💬 Open in WhatsApp', url: waLink(r.phone, r.replyBody) }])
  rows.push([{ text: '✅ Mark sent', callback_data: `a:${r.id}` }, { text: '✏️ Edit', callback_data: `e:${r.id}` }])
  rows.push([{ text: '🗑 Reject', callback_data: `r:${r.id}` }])
  return rows
}

/** Read, price and draft an enquiry, store it and ask the owner. */
export async function processEnquiry(e: Enquiry) {
  const rules = extractByRules(e)
  const x = await refineWithAI(e, rules)
  const q = buildQuote(x)
  const d = draftReply(e, x, q)
  const now = new Date().toISOString()

  const record: DeskRecord = {
    id: newId(),
    receivedAt: now,
    channel: e.channel,
    name: e.name,
    email: e.email ?? '',
    phone: e.phone ?? '',
    subject: e.subject ?? '',
    message: e.message.slice(0, 5000),
    intent: x.intent,
    summary: x.summary,
    packageLabel: q.packageLabel ?? '',
    currency: q.currency,
    setup: q.setup,
    monthly: q.monthly,
    replySubject: d.replySubject,
    replyBody: d.replyBody,
    status: 'pending',
    messageId: e.messageId ?? '',
    telegramMessageId: '',
    updatedAt: now,
    note: `read by ${x.via}${e.source ? ` · ${e.source}` : ''}`,
  }

  if (sheetConfigured()) await appendRecord(record)
  if (telegramConfigured()) {
    const msg = await sendToOwner(
      ownerCard(record, sheetConfigured() ? '' : '\n⚠️ Connect the Google Sheet to approve from here.'),
      buttonsFor(record),
    )
    record.telegramMessageId = String(msg.message_id)
    if (sheetConfigured()) await updateRecord(record.id, { telegramMessageId: record.telegramMessageId })
  }
  if (!sheetConfigured() && !telegramConfigured()) {
    console.warn('[desk] Not configured; enquiry only logged:\n' + JSON.stringify(record, null, 2))
  }
  return { record, extracted: x, quote: q }
}

async function finish(r: DeskRecord, messageId: number, status: DeskRecord['status'], line: string) {
  await updateRecord(r.id, { status })
  await editOwnerMessage(messageId, ownerCard({ ...r, status }, `\n${line}`))
}

/** Inline button taps from the owner: a = approve, e = edit, r = reject. */
export async function handleCallback(data: string, messageId: number, callbackId: string) {
  const [action, id] = data.split(':')
  const answer = (text: string) => tg('answerCallbackQuery', { callback_query_id: callbackId, text })
  const r = await getRecord(id)
  if (!r) return answer('Not found in the Sheet')
  if (r.status !== 'pending') return answer(`Already ${r.status}`)

  if (action === 'r') {
    await finish(r, messageId, 'rejected', '🗑 Rejected — nothing was sent.')
    return answer('Rejected')
  }
  if (action === 'e') {
    await tg('sendMessage', {
      chat_id: process.env.TELEGRAM_OWNER_CHAT_ID,
      text: `✏️ Reply to this message with the new text for #${r.id}. The current draft is above.`,
      reply_markup: { force_reply: true, input_field_placeholder: 'New reply text…' },
    })
    return answer('Send the new text as a reply')
  }
  if (action === 'a') {
    if (r.email) {
      try {
        await sendEmail({ to: r.email, subject: r.replySubject, text: r.replyBody, inReplyTo: r.messageId || undefined })
        await finish(r, messageId, 'sent', `✅ Sent to ${esc(r.email)} at ${new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' })}`)
        return answer('Sent ✅')
      } catch (err) {
        await updateRecord(r.id, { status: 'failed', note: `${r.note} · send failed: ${(err as Error).message.slice(0, 200)}` })
        await tg('sendMessage', { chat_id: process.env.TELEGRAM_OWNER_CHAT_ID, text: `❌ ${r.id}: ${(err as Error).message.slice(0, 300)}` })
        return answer('Send failed')
      }
    }
    await finish(r, messageId, 'approved_manual', '✅ Marked as sent (WhatsApp / manual).')
    return answer('Marked sent')
  }
  return answer('Unknown action')
}

/** The owner replied to an "edit" prompt with new text. */
export async function handleEditReply(promptText: string, newText: string) {
  const id = promptText.match(/#(SK-[A-Z0-9]+)/)?.[1]
  if (!id) return
  const r = await getRecord(id)
  if (!r || r.status !== 'pending') {
    await tg('sendMessage', { chat_id: process.env.TELEGRAM_OWNER_CHAT_ID, text: `${id} is no longer pending.` })
    return
  }
  const updated: DeskRecord = { ...r, replyBody: newText.slice(0, 5000) }
  await updateRecord(id, { replyBody: updated.replyBody })
  if (r.telegramMessageId) await editOwnerMessage(r.telegramMessageId, ownerCard(updated, '\n<i>(edited — superseded below)</i>')).catch(() => undefined)
  const msg = await sendToOwner(ownerCard(updated, '✏️ Edited draft'), buttonsFor(updated))
  await updateRecord(id, { telegramMessageId: String(msg.message_id) })
}
