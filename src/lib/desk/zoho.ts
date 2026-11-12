// Zoho Mail API client. Used to read the hello@ inbox and send approved replies.
// Env: ZOHO_CLIENT_ID, ZOHO_CLIENT_SECRET, ZOHO_REFRESH_TOKEN, ZOHO_ACCOUNT_ID,
// ZOHO_FROM_ADDRESS (e.g. hello@shapekraft.co, a mailbox in that Zoho account),
// and ZOHO_REGION (default "in" for Zoho India accounts; "com" for the US).

const region = () => process.env.ZOHO_REGION || 'in'
const accountsHost = () => `https://accounts.zoho.${region()}`
const mailHost = () => `https://mail.zoho.${region()}/api/accounts/${process.env.ZOHO_ACCOUNT_ID}`

export function zohoConfigured() {
  return !!(
    process.env.ZOHO_CLIENT_ID &&
    process.env.ZOHO_CLIENT_SECRET &&
    process.env.ZOHO_REFRESH_TOKEN &&
    process.env.ZOHO_ACCOUNT_ID &&
    process.env.ZOHO_FROM_ADDRESS
  )
}

let cached: { token: string; expiresAt: number } | null = null

async function accessToken(): Promise<string> {
  if (cached && cached.expiresAt > Date.now() + 60_000) return cached.token
  const res = await fetch(`${accountsHost()}/oauth/v2/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      refresh_token: process.env.ZOHO_REFRESH_TOKEN!,
      client_id: process.env.ZOHO_CLIENT_ID!,
      client_secret: process.env.ZOHO_CLIENT_SECRET!,
      grant_type: 'refresh_token',
    }),
  })
  const data = (await res.json()) as { access_token?: string; expires_in?: number; error?: string }
  if (!data.access_token) throw new Error(`Zoho token failed: ${data.error ?? res.status}`)
  cached = { token: data.access_token, expiresAt: Date.now() + (data.expires_in ?? 3600) * 1000 }
  return cached.token
}

async function zoho<T>(path: string, init: { method?: string; body?: unknown } = {}): Promise<T> {
  const res = await fetch(`${mailHost()}${path}`, {
    method: init.method ?? 'GET',
    headers: {
      Authorization: `Zoho-oauthtoken ${await accessToken()}`,
      Accept: 'application/json',
      ...(init.body ? { 'Content-Type': 'application/json' } : {}),
    },
    body: init.body ? JSON.stringify(init.body) : undefined,
  })
  const data = (await res.json().catch(() => ({}))) as T
  if (!res.ok) throw new Error(`Zoho ${init.method ?? 'GET'} ${path} → ${res.status}`)
  return data
}

export type ZohoMessage = {
  messageId: string
  folderId: string
  subject: string
  fromAddress: string
  sender: string
  summary?: string
}

/** Unread messages in the inbox, oldest first. */
export async function listUnread(limit = 20): Promise<ZohoMessage[]> {
  const data = await zoho<{ data?: ZohoMessage[] }>(`/messages/view?status=unread&start=1&limit=${limit}`)
  return data.data ?? []
}

/** Plain text of one message (HTML stripped, quoted text kept short). */
export async function getText(m: ZohoMessage): Promise<string> {
  const data = await zoho<{ data?: { content?: string } }>(
    `/folders/${m.folderId}/messages/${m.messageId}/content`,
  )
  const html = data.data?.content ?? ''
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<br\s*\/?>|<\/p>|<\/div>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n\s*\n+/g, '\n\n')
    .trim()
}

export async function markRead(m: ZohoMessage) {
  await zoho('/updatemessage', {
    method: 'PUT',
    body: { mode: 'markAsRead', messageId: [m.messageId], folderId: m.folderId },
  })
}

export async function sendMail(opts: { to: string; subject: string; text: string }) {
  await zoho('/messages', {
    method: 'POST',
    body: {
      fromAddress: process.env.ZOHO_FROM_ADDRESS,
      toAddress: opts.to,
      subject: opts.subject,
      content: opts.text,
      mailFormat: 'plaintext',
      askReceipt: 'no',
    },
  })
}
