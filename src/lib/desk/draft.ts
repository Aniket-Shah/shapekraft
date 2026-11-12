import { formatPrice } from '@/lib/market'
import { CONFIG } from '@/lib/pricing'
import type { Draft, Enquiry, Extracted, Quote } from './types'

const SIGN = '— Team ShapeKraft\nhttps://www.shapekraft.co'

function money(n: number, q: Quote) {
  return formatPrice(n, q.currency)
}

/** Plain-text reply in the studio voice. No founder name (studio voice only). */
export function draftReply(e: Enquiry, x: Extracted, q: Quote): Draft {
  const hi = `Hi ${x.customerName},`
  const subject = e.subject
    ? (/^re:/i.test(e.subject) ? e.subject : `Re: ${e.subject}`)
    : q.packageLabel ? `Your ${q.packageLabel} quote from ShapeKraft` : 'Thanks for getting in touch with ShapeKraft'
  const quoteUrl = q.currency === 'INR' ? 'https://www.shapekraft.in/quote' : 'https://www.shapekraft.co/quote'

  if (x.intent !== 'quote' || q.lines.length === 0) {
    const body = [
      hi,
      '',
      x.opening ?? 'Thanks for reaching out to ShapeKraft.',
      '',
      `So we can send you an exact price, could you tell us a little more: what the website or automation is for, roughly how many pages, and when you need it live? You can also build an instant estimate yourself here: ${quoteUrl}`,
      '',
      SIGN,
    ].join('\n')
    return { replySubject: subject, replyBody: body }
  }

  const rows = q.lines.map((l) => {
    const amt = l.amount === 0 ? 'priced on a call' : `${money(l.amount, q)}${l.monthly ? ' / month' : ''}`
    return `• ${l.label}: ${q.fromPrice && l.amount > 0 && (l === q.lines[0] || l.monthly) ? 'from ' : ''}${amt}`
  })

  const totals: string[] = []
  if (q.onCall) totals.push('The setup price depends on your scope, so we confirm it on a short call.')
  else {
    totals.push(`Setup total: ${q.fromPrice ? 'from ' : ''}${money(q.setup, q)}${q.currency === 'INR' ? ' (+ GST if applicable)' : ''}`)
    if (q.monthly > 0) totals.push(`Monthly: ${q.fromPrice ? 'from ' : ''}${money(q.monthly, q)}`)
  }

  const terms = q.isPilot
    ? 'The pilot is paid upfront and runs for 14 days on your own price list and real enquiries. If you continue, the full amount is deducted from the RFQ Launch Kit.'
    : q.onCall ? '' : `Payment is split ${CONFIG.split.design}% to start, ${CONFIG.split.build}% when the build is ready for review and ${CONFIG.split.launch}% at launch.`

  const body = [
    hi,
    '',
    x.opening ?? `Thanks for your enquiry. Here is what we would suggest, based on what you described:`,
    '',
    ...rows,
    '',
    ...totals,
    ...(q.foundingNote ? ['', q.foundingNote] : []),
    ...(terms ? ['', terms] : []),
    '',
    'This is an estimate; we confirm the final scope with you before any work starts. Would a 15-minute call this week work? Reply with a time that suits you.',
    '',
    SIGN,
  ].join('\n')

  return { replySubject: subject, replyBody: body }
}
