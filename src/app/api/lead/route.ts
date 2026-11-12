import { NextResponse } from 'next/server'

// Receives quote-builder leads and forwards them to whichever delivery channel is configured.
//
// Env vars (set in the hosting dashboard, never in code):
//   RESEND_API_KEY + LEAD_TO_EMAIL (+ optional LEAD_FROM_EMAIL) → email via Resend
//   LEAD_RELAY_URL → JSON POST to any webhook (e.g. https://formsubmit.co/ajax/<email>, Zapier, Make)
// If neither is set, the lead is logged server-side so nothing is silently lost in development.

type Lead = {
  name?: unknown
  contact?: unknown
  currency?: unknown
  package?: unknown
  pages?: unknown
  extraPages?: unknown
  addons?: unknown
  carePlan?: unknown
  carePlanMonthly?: unknown
  total?: unknown
  foundingRate?: unknown
  note?: unknown
  page?: unknown
}

const MAX_FIELD = 1000

function str(value: unknown): string {
  if (value === null || value === undefined) return ''
  if (Array.isArray(value)) return value.map(str).join(', ').slice(0, MAX_FIELD)
  return String(value).slice(0, MAX_FIELD)
}

// Very small in-memory rate limit (per server instance) to blunt form spam.
const hits = new Map<string, number[]>()
function rateLimited(ip: string): boolean {
  const now = Date.now()
  const windowMs = 10 * 60 * 1000
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < windowMs)
  recent.push(now)
  hits.set(ip, recent)
  return recent.length > 5
}

export async function POST(request: Request) {
  const ip =
    request.headers.get('cf-connecting-ip') ??
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    'unknown'
  if (rateLimited(ip)) {
    return NextResponse.json({ ok: false, error: 'Too many requests' }, { status: 429 })
  }

  let body: Lead
  try {
    body = (await request.json()) as Lead
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 })
  }

  const name = str(body.name).trim()
  const contact = str(body.contact).trim()
  if (!name || !contact) {
    return NextResponse.json({ ok: false, error: 'Name and contact are required' }, { status: 400 })
  }

  const lines = [
    `Name: ${name}`,
    `Contact: ${contact}`,
    `Package: ${str(body.package) || '—'}`,
    `Pages: ${str(body.pages) || '—'} (extra: ${str(body.extraPages) || '0'})`,
    `Add-ons: ${str(body.addons) || '—'}`,
    `Care plan: ${str(body.carePlan) || 'none'}${body.carePlan ? ` (${str(body.carePlanMonthly)}/month, ${str(body.currency)})` : ''}`,
    `Total: ${str(body.total)} (${str(body.currency)})`,
    `Founding rate: ${body.foundingRate ? 'yes' : 'no'}`,
    `Note: ${str(body.note) || '—'}`,
    `Page: ${str(body.page) || '—'}`,
  ]
  const subject = `New quote lead: ${name} · ${str(body.package) || 'add-ons'} · ${str(body.total)}`
  const text = lines.join('\n')

  const deliveries: Promise<Response>[] = []

  const resendKey = process.env.RESEND_API_KEY
  const to = process.env.LEAD_TO_EMAIL
  if (resendKey && to) {
    deliveries.push(
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: process.env.LEAD_FROM_EMAIL ?? 'ShapeKraft Leads <onboarding@resend.dev>',
          to: [to],
          subject,
          text,
        }),
      }),
    )
  }

  const relay = process.env.LEAD_RELAY_URL
  if (relay) {
    deliveries.push(
      fetch(relay, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ _subject: subject, message: text, name, contact }),
      }),
    )
  }

  if (deliveries.length === 0) {
    console.warn('[lead] No delivery channel configured (set RESEND_API_KEY + LEAD_TO_EMAIL or LEAD_RELAY_URL).\n' + text)
    return NextResponse.json({ ok: true, delivered: false })
  }

  const results = await Promise.allSettled(deliveries)
  const delivered = results.some((r) => r.status === 'fulfilled' && r.value.ok)
  if (!delivered) console.error('[lead] Delivery failed for lead:\n' + text)
  return NextResponse.json({ ok: true, delivered })
}
