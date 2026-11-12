import { CONFIG, type MarketCurrency } from '@/lib/pricing'
import type { Enquiry, Extracted, Intent } from './types'

// Rule-based reading of an enquiry. Works with no API key, so the desk runs
// for free; ai.ts can improve it when ANTHROPIC_API_KEY is set.

const has = (text: string, re: RegExp) => re.test(text)

export function detectCurrency(e: Enquiry, text: string): MarketCurrency {
  if (e.preselected?.currency) return e.preselected.currency
  if (has(text, /₹|\binr\b|rupee|\blakh|\bcrore|\bgst\b|india|mumbai|delhi|pune|bangalore|bengaluru|ahmedabad|surat|chennai|hyderabad|kolkata/i)) return 'INR'
  if (e.phone && /^(\+?91)?[6-9]\d{9}$/.test(e.phone.replace(/[\s()-]/g, ''))) return 'INR'
  if (has(text, /\$|\busd\b|dollar/i)) return 'USD'
  return e.currencyHint ?? 'USD'
}

function available(id: string, currency: MarketCurrency) {
  return CONFIG.packages.some((p) => p.id === id && p.markets.includes(currency))
}

export function extractByRules(e: Enquiry): Extracted {
  const text = `${e.subject ?? ''}\n${e.message}`
  const currency = detectCurrency(e, text)

  const pagesMatch = text.match(/(\d{1,2})\s*-?\s*(?:pages?|screens?)\b/i)
  let pages = e.preselected?.pages ?? (pagesMatch ? Number(pagesMatch[1]) : undefined)
  if (pages !== undefined && (pages < 1 || pages > CONFIG.maxPages)) pages = undefined

  let packageId = e.preselected?.packageId
  if (!packageId) {
    if (has(text, /\bpilot\b|\btrial\b|try (it|this) first|test (it|this) first/i)) packageId = 'pilot'
    else if (has(text, /\btally\b|\berp\b|\bsap\b|sales desk/i)) packageId = 'salesdesk'
    else if (has(text, /\brfq\b|quote desk|auto[- ]?quot|quotation|indiamart|distributor|\btrader|\bdealer|price ?list|wholesale/i)) packageId = 'b2b'
    else if (has(text, /catalog(ue)?|product (list|range)/i)) packageId = currency === 'INR' ? 'catalogue' : 'pro'
    else if (has(text, /\bstudio\b|premium|design system|immersive|3d\b|webgl/i)) packageId = 'advanced'
    else if (pages !== undefined) packageId = pages <= 5 ? 'basic' : currency === 'INR' ? 'catalogue' : 'pro' // extra pages are added on top
    else if (has(text, /website|web ?site|landing page|web design|redesign|new site/i)) packageId = 'basic'
  }
  // Fall back to the nearest package sold in this market.
  if (packageId && !available(packageId, currency)) {
    const fallback: Record<string, string> = { advanced: currency === 'INR' ? 'catalogue' : 'advanced', pro: 'catalogue', catalogue: 'pro', pilot: 'b2b', salesdesk: 'b2b' }
    packageId = available(fallback[packageId] ?? '', currency) ? fallback[packageId] : 'basic'
  }

  const addonIds = new Set(e.preselected?.addonIds ?? [])
  if (!e.preselected?.addonIds) {
    if (has(text, /\bai\b|chat ?bot|automat|\bgpt\b|\bllm\b/i)) addonIds.add('ai')
    if (has(text, /\bslow\b|speed|performance|lighthouse|core web vitals|page ?speed/i)) addonIds.add('performance')
    if (has(text, /integrat|razorpay|stripe|payment gateway|hubspot|zoho|webhook|slack|notion|\bcrm\b/i)) addonIds.add('webhook')
  }

  const spammy = has(text, /guest post|backlink|seo services|link building|crypto|casino|loan offer|we can rank your|dear (sir|madam),? we are a/i)
  const intent: Intent = spammy && !packageId ? 'spam' : packageId || addonIds.size > 0 ? 'quote' : 'question'

  const pkg = CONFIG.packages.find((p) => p.id === packageId)
  const bits = [pkg?.label, pages ? `${pages} pages` : '', ...[...addonIds].map((id) => CONFIG.addons.find((a) => a.id === id)?.label ?? id)].filter(Boolean)
  const summary =
    intent === 'spam' ? 'Looks like a sales pitch / spam'
    : intent === 'question' ? `Question: ${e.message.replace(/\s+/g, ' ').slice(0, 140)}`
    : `Wants: ${bits.join(' + ')}`

  return {
    intent,
    currency,
    packageId,
    pages,
    addonIds: [...addonIds],
    carePlanId: e.preselected?.carePlanId,
    customerName: (e.name || '').trim().split(/\s+/)[0] || 'there',
    summary,
    via: 'rules',
  }
}
