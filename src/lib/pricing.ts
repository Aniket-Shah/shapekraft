// ── CONFIG: all pricing lives here — do not scatter ─────────────────────────
// Source: Notion "Founder Pack v2 — Board, Pricing, Marketing, Brand (12 Nov)".
// India (INR) leads with the B2B ladder: Pilot → Catalogue Site → RFQ Launch
// Kit (headline) → Sales Desk; the Starter site stays as a quiet side option.
// US/global (USD) keeps the Starter / Growth / Studio site tiers (inbound only).
// No struck-through "was" prices anywhere (no fake anchors). The only discount
// is the real Founding 5 offer on the RFQ Launch Kit, shown as a labelled note.
// Shared by the quote builder (client) and the quote desk (server), so it
// must stay a plain module with no 'use client'.
// If you change a price here, update src/lib/faq.ts too.
export type MarketCurrency = 'INR' | 'USD'

export interface Package {
  id: string
  tier: 'Pilot' | 'Starter' | 'Growth' | 'Studio' | 'B2B'
  label: string
  description: string
  includedPages: number // 0 = page count not priced (scope agreed on a call)
  listINR: number
  listUSD: number // 0 = priced on a call
  markets: MarketCurrency[]
  /** Monthly plan that comes with the package (required), instead of the optional care plan. */
  monthly?: { label: string; INR: number; USD: number }
  fromPrice?: boolean // show "from ₹X"
  badge?: string
  foundingNote?: string
  noExtras?: boolean // no add-ons, care plan or payment split (the pilot)
}

export interface Addon {
  id: string
  label: string
  description: string
  listINR: number
  listUSD: number
  /** Package ids this add-on is already part of. */
  hideFor?: string[]
}

export const CONFIG = {
  whatsapp: {
    IN: '+919999999999', // UPDATE: your India WhatsApp number
    US: '+14155550000',  // UPDATE: your US/global WhatsApp number
  },
  founding: {
    slotsLeft: 5, // UPDATE as founding slots fill; remove foundingNote at 0
    endsLabel: '31 Jan 2027',
  },
  packages: [
    // ── India: B2B ladder ──
    {
      id: 'pilot',
      tier: 'Pilot',
      label: 'Quote Desk Pilot (14 days)',
      description: 'Try the quote desk for 14 days on your own price list and real enquiries before you commit. The ₹5,000 is deducted from the RFQ Launch Kit if you continue.',
      includedPages: 0,
      listINR: 5_000,
      listUSD: 0,
      markets: ['INR'],
      badge: 'Start here',
      noExtras: true,
    },
    {
      id: 'catalogue',
      tier: 'Growth',
      label: 'Catalogue Site',
      description: 'Up to 10 pages: your products and categories, fast on every device, with every enquiry sent straight to your WhatsApp.',
      includedPages: 10,
      listINR: 35_000,
      listUSD: 0,
      markets: ['INR'],
    },
    {
      id: 'b2b',
      tier: 'B2B',
      label: 'RFQ Launch Kit',
      description: 'For traders and distributors: a catalogue site plus a quote desk. Enquiries from IndiaMART, WhatsApp, email and your site become quotes drafted from your own price list, sent to you on WhatsApp to approve in one tap.',
      includedPages: 0,
      listINR: 60_000,
      listUSD: 0,
      markets: ['INR', 'USD'],
      monthly: { label: 'Automation plan (runs the quote desk)', INR: 5_000, USD: 0 },
      badge: 'Recommended',
      foundingNote: 'Founding 5: ₹45,000 setup + first month free, in exchange for a written case study',
    },
    {
      id: 'salesdesk',
      tier: 'B2B',
      label: 'Sales Desk',
      description: 'Everything in the RFQ Launch Kit, plus CRM, ERP or Tally integration and ready-to-send proposals.',
      includedPages: 0,
      listINR: 1_00_000,
      listUSD: 0,
      markets: ['INR'],
      monthly: { label: 'Sales Desk plan', INR: 10_000, USD: 0 },
      fromPrice: true,
    },
    // ── Website tiers (USD main ladder; Starter also in INR) ──
    {
      id: 'basic',
      tier: 'Starter',
      label: 'Starter Website',
      description: '5 custom pages, fast on every device, a contact form wired to your inbox, and the SEO basics. 90+ Lighthouse.',
      includedPages: 5,
      listINR: 15_000,
      listUSD: 750,
      markets: ['INR', 'USD'],
    },
    {
      id: 'pro',
      tier: 'Growth',
      label: 'Growth Website',
      description: 'Up to 10 pages, smooth animations, a blog or portfolio you update yourself, analytics, and enquiries sent straight to email, WhatsApp or your CRM.',
      includedPages: 10,
      listINR: 35_000,
      listUSD: 1_500,
      markets: ['USD'],
    },
    {
      id: 'advanced',
      tier: 'Studio',
      label: 'Studio Website',
      description: 'Up to 15 pages built from scratch to your brand: your own design system, custom interactions, and a performance guarantee.',
      includedPages: 15,
      listINR: 60_000,
      listUSD: 3_000,
      markets: ['USD'],
    },
  ] as Package[],
  addons: [
    {
      id: 'ai',
      label: 'AI Automation (first workflow)',
      description: 'One workflow that saves you hours: RFQ → auto-quote, enquiry → CRM/WhatsApp, or invoice and document extraction.',
      listINR: 30_000,
      listUSD: 1_500,
      hideFor: ['b2b', 'salesdesk'],
    },
    {
      id: 'performance',
      label: 'Performance Optimisation',
      description: 'Make your site noticeably faster. Better Google scores, lower bounce rate, happier users.',
      listINR: 10_000,
      listUSD: 750,
    },
    {
      id: 'webhook',
      label: 'Integrations',
      description: 'Connect the tools you already use — CRMs, payment gateways, email, Slack, Notion. They talk to each other so you don\'t have to.',
      listINR: 10_000,
      listUSD: 500,
      hideFor: ['salesdesk'],
    },
  ] as Addon[],
  carePlans: [
    { id: 'none', label: 'No care plan', description: 'You manage hosting and updates yourself.', priceINR: 0, priceUSD: 0 },
    { id: 'essential', label: 'Essential care', description: 'Hosting, backups, updates, uptime and form monitoring.', priceINR: 1_500, priceUSD: 99 },
    { id: 'growth', label: 'Growth care', description: 'Essential + 2 hrs of changes a month, monthly speed/SEO report, 24h response.', priceINR: 5_000, priceUSD: 299 },
  ],
  // Extra pages beyond the package's included pages
  pageRate: { INR: 2_000, USD: 40 },
  basePages: 5,
  maxPages: 50,
  split: { design: 40, build: 30, launch: 30 },
}
