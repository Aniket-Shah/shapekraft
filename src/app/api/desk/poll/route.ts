import { NextResponse } from 'next/server'
import { pollZoho } from '@/lib/desk/inbound'

// Reads unread mail in the Zoho inbox and turns it into desk enquiries.
// Call it every few minutes from an external scheduler (see docs/desk-setup.md):
//   GET https://www.shapekraft.co/api/desk/poll?secret=<DESK_SECRET>
// Vercel Hobby crons run only once a day, so the schedule lives outside Vercel.

export const dynamic = 'force-dynamic'
export const maxDuration = 60

export async function GET(request: Request) {
  const secret = new URL(request.url).searchParams.get('secret')
  if (!process.env.DESK_SECRET || secret !== process.env.DESK_SECRET) {
    return NextResponse.json({ ok: false }, { status: 401 })
  }
  try {
    return NextResponse.json(await pollZoho())
  } catch (err) {
    return NextResponse.json({ ok: false, error: (err as Error).message }, { status: 502 })
  }
}
