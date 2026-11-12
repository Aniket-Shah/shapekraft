import { processEnquiry } from './engine'
import { listUnread, getText, markRead, zohoConfigured } from './zoho'
import { esc, sendToOwner, telegramConfigured } from './telegram'

// Shared email intake: used by the Zoho poller and the generic /api/desk/inbound route.

const OWN_DOMAINS = /@(shapekraft\.(co|in))$/i
const NO_REPLY = /(no-?reply|mailer-daemon|postmaster|notifications?@|bounce|donotreply)/i

/** Returns a reason to ignore the email, or null to process it. */
export function skipReason(from: string, autoSubmitted?: string): string | null {
  const f = from.trim().toLowerCase()
  if (OWN_DOMAINS.test(f)) return 'own address'
  if (NO_REPLY.test(f)) return 'automated sender'
  if (autoSubmitted && autoSubmitted !== 'no') return 'auto-reply'
  return null
}

export function nameFrom(sender: string, email: string) {
  const n = sender.replace(/<[^>]*>/g, '').replace(/"/g, '').trim()
  return (n || email.split('@')[0] || 'there').slice(0, 120)
}

/** Read unread mail in the Zoho inbox, turn each into a desk enquiry, then mark it read. */
export async function pollZoho(limit = 20) {
  if (!zohoConfigured()) return { ok: false as const, error: 'Zoho Mail not configured' }
  const messages = await listUnread(limit)
  const done: { id: string; intent: string }[] = []
  const skipped: string[] = []

  for (const m of messages) {
    const from = (m.fromAddress || '').toLowerCase()
    const reason = skipReason(from)
    if (reason) {
      await markRead(m)
      skipped.push(`${from}: ${reason}`)
      continue
    }
    try {
      const text = (await getText(m)).slice(0, 8000)
      const { record } = await processEnquiry({
        channel: 'email',
        name: nameFrom(m.sender || '', from),
        email: from,
        subject: m.subject?.slice(0, 300),
        message: text || m.summary || '(empty email)',
        messageId: m.messageId,
      })
      // Only mark read after the desk has the enquiry, so nothing is lost on failure.
      await markRead(m)
      done.push({ id: record.id, intent: record.intent })
    } catch (err) {
      console.error('[desk] zoho message failed', m.messageId, err)
      if (telegramConfigured()) {
        await sendToOwner(`⚠️ Couldn't read an email from ${esc(from)} (${esc(m.subject || 'no subject')}). It is still unread in Zoho.`).catch(() => undefined)
      }
    }
  }
  return { ok: true as const, processed: done, skipped }
}
