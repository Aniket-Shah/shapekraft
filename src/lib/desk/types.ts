import type { MarketCurrency } from '@/lib/pricing'

export type Channel = 'web' | 'email' | 'whatsapp' | 'manual'
export type Intent = 'quote' | 'question' | 'spam'
export type Status = 'pending' | 'sent' | 'approved_manual' | 'rejected' | 'failed'

/** One incoming enquiry, whatever channel it came from. */
export interface Enquiry {
  channel: Channel
  name: string
  email?: string
  phone?: string
  subject?: string
  message: string
  /** Page URL (web) or Message-ID (email), for context and threading. */
  source?: string
  messageId?: string
  /** Choices the visitor already made in the quote builder. */
  preselected?: {
    packageId?: string
    pages?: number
    addonIds?: string[]
    carePlanId?: string
    currency?: MarketCurrency
  }
  currencyHint?: MarketCurrency
}

export interface Extracted {
  intent: Intent
  currency: MarketCurrency
  packageId?: string
  pages?: number
  addonIds: string[]
  carePlanId?: string
  customerName: string
  /** One line for the owner: what they want. */
  summary: string
  /** Optional 1-3 sentence personal opening, written by the AI. */
  opening?: string
  via: 'rules' | 'ai'
}

export interface QuoteLine {
  label: string
  amount: number // 0 = priced on a call
  monthly?: boolean
}

export interface Quote {
  currency: MarketCurrency
  packageId?: string
  packageLabel?: string
  lines: QuoteLine[]
  setup: number
  monthly: number
  fromPrice: boolean
  onCall: boolean
  isPilot: boolean
  foundingNote?: string
}

export interface Draft {
  replySubject: string
  replyBody: string
}

/** A row in the Google Sheet. */
export interface DeskRecord {
  id: string
  receivedAt: string
  channel: Channel
  name: string
  email: string
  phone: string
  subject: string
  message: string
  intent: Intent
  summary: string
  packageLabel: string
  currency: MarketCurrency
  setup: number
  monthly: number
  replySubject: string
  replyBody: string
  status: Status
  messageId: string
  telegramMessageId: string
  updatedAt: string
  note: string
}
