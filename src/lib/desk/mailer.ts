// Sends an approved reply. Uses Resend (RESEND_API_KEY) or Brevo (BREVO_API_KEY).
// DESK_FROM_EMAIL is the sender, e.g. "ShapeKraft <hello@shapekraft.co>"; its
// domain must be verified with the provider.

export function mailerConfigured() {
  return !!process.env.DESK_FROM_EMAIL && (!!process.env.RESEND_API_KEY || !!process.env.BREVO_API_KEY)
}

function parseFrom(from: string) {
  const m = from.match(/^\s*(.*?)\s*<([^>]+)>\s*$/)
  return m ? { name: m[1] || 'ShapeKraft', email: m[2] } : { name: 'ShapeKraft', email: from.trim() }
}

export async function sendEmail(opts: { to: string; subject: string; text: string; inReplyTo?: string }) {
  const from = process.env.DESK_FROM_EMAIL
  if (!from) throw new Error('DESK_FROM_EMAIL not set')
  const headers: Record<string, string> = opts.inReplyTo ? { 'In-Reply-To': opts.inReplyTo, References: opts.inReplyTo } : {}

  if (process.env.RESEND_API_KEY) {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from, to: [opts.to], subject: opts.subject, text: opts.text, headers }),
    })
    if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`)
    return
  }
  if (process.env.BREVO_API_KEY) {
    const sender = parseFrom(from)
    const res = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: { 'api-key': process.env.BREVO_API_KEY, 'Content-Type': 'application/json', accept: 'application/json' },
      body: JSON.stringify({ sender, to: [{ email: opts.to }], subject: opts.subject, textContent: opts.text, headers }),
    })
    if (!res.ok) throw new Error(`Brevo ${res.status}: ${await res.text()}`)
    return
  }
  throw new Error('No email provider configured (RESEND_API_KEY or BREVO_API_KEY)')
}
