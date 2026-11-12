import { NextResponse } from 'next/server'
import { processEnquiry } from '@/lib/desk/engine'
import type { Channel } from '@/lib/desk/types'

// Inbound enquiries from other channels: the Cloudflare Email Worker (email),
// or a manual/test call. Protected by DESK_SECRET in the x-desk-secret header.

type Body = {
  channel?: Channel
  from?: string
  name?: string
  phone?: string
  subject?: string
  text?: string
  messageId?: string
  autoSubmitted?: string
}

const OWN_DOMAINS = /@(shapekraft\.(co|in))$/i
const NO_REPLY = /(no-?reply|mailer-daemon|postmaster|notifications?@|bounce)/i

export async function POST(request: Request) {
  if (!process.env.DESK_SECRET || request.headers.get('x-desk-secret') !== process.env.DESK_SECRET) {
    return NextResponse.json({ ok: false }, { status: 401 })
  }
  const b = (await request.json().catch(() => ({}))) as Body
  const from = (b.from ?? '').trim().toLowerCase()
  const text = (b.text ?? '').trim()
  if (!text) return NextResponse.json({ ok: false, error: 'Empty message' }, { status: 400 })

  // Never answer ourselves, robots or auto-replies (prevents mail loops).
  if (b.channel === 'email' && (OWN_DOMAINS.test(from) || NO_REPLY.test(from) || (b.autoSubmitted && b.autoSubmitted !== 'no'))) {
    return NextResponse.json({ ok: true, skipped: 'automated or own address' })
  }

  const { record } = await processEnquiry({
    channel: b.channel ?? 'email',
    name: (b.name || from.split('@')[0] || 'there').slice(0, 120),
    email: from || undefined,
    phone: b.phone,
    subject: b.subject?.slice(0, 300),
    message: text.slice(0, 8000),
    messageId: b.messageId,
  })
  return NextResponse.json({ ok: true, id: record.id, intent: record.intent, summary: record.summary })
}
