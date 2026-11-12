import type { DeskRecord } from './types'

// Google Sheet store through a small Apps Script web app (apps-script/desk-sheet.gs).
// Env: DESK_SHEET_URL (the web app /exec URL) + DESK_SHEET_TOKEN (shared secret).

async function call<T>(action: string, payload: Record<string, unknown>): Promise<T> {
  const url = process.env.DESK_SHEET_URL
  const token = process.env.DESK_SHEET_TOKEN
  if (!url || !token) throw new Error('Google Sheet not configured (DESK_SHEET_URL, DESK_SHEET_TOKEN)')
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' }, // Apps Script reads e.postData.contents
    body: JSON.stringify({ token, action, ...payload }),
    redirect: 'follow',
  })
  const data = (await res.json().catch(() => ({ ok: false, error: `Bad response ${res.status}` }))) as { ok: boolean; error?: string } & T
  if (!data.ok) throw new Error(`Sheet ${action} failed: ${data.error ?? res.status}`)
  return data
}

export function sheetConfigured() {
  return !!process.env.DESK_SHEET_URL && !!process.env.DESK_SHEET_TOKEN
}

export async function appendRecord(record: DeskRecord) {
  await call('append', { record })
}

export async function getRecord(id: string): Promise<DeskRecord | null> {
  const data = await call<{ record: DeskRecord | null }>('get', { id })
  return data.record
}

export async function updateRecord(id: string, fields: Partial<DeskRecord>) {
  await call('update', { id, fields: { ...fields, updatedAt: new Date().toISOString() } })
}
