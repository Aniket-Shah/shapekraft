import { NextResponse } from 'next/server'
import { processEnquiry } from '@/lib/desk/engine'
import type { Channel } from '@/lib/desk/types'

// Generic inbound enquiries (manual, test, or any form/webhook). Email arrives
// through the Zoho poller at /api/desk/poll. Protected by DESK_SECRET in the x-desk-secret header.

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

import { skipReason } from '@/lib/desk/inbound'

export async function POST(request: Request) {
  if (!process.env.DESK_SECRET || request.headers.get('x-desk-secret') !== process.env.DESK_SECRET) {
    return NextResponse.json({ ok: false }, { status: 401 })
  }
  const b = (await request.json().catch(() => ({}))) as Body
  const from = (b.from ?? '').trim().toLowerCase()
  const text = (b.text ?? '').trim()
  if (!text) return NextResponse.json({ ok: false, error: 'Empty message' }, { status: 400 })

  if (b.channel === 'email') {
    const reason = skipReason(from, b.autoSubmitted)
    if (reason) return NextResponse.json({ ok: true, skipped: reason })
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
