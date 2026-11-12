import { CONFIG } from '@/lib/pricing'
import type { Extracted, Quote, QuoteLine } from './types'

// Deterministic pricing: the same rules as the quote builder. The AI never sets a price.
export function buildQuote(x: Extracted): Quote {
  const c = x.currency
  const price = (item: { listINR: number; listUSD: number }) => (c === 'INR' ? item.listINR : item.listUSD)
  const pkg = CONFIG.packages.find((p) => p.id === x.packageId && p.markets.includes(c))
  const lines: QuoteLine[] = []
  let setup = 0
  let monthly = 0

  if (pkg) {
    const amount = price(pkg)
    lines.push({ label: pkg.label, amount })
    setup += amount
    if (pkg.includedPages > 0 && x.pages && x.pages > pkg.includedPages) {
      const extra = x.pages - pkg.includedPages
      const cost = extra * CONFIG.pageRate[c]
      lines.push({ label: `${extra} extra page${extra > 1 ? 's' : ''}`, amount: cost })
      setup += cost
    }
    if (pkg.monthly) {
      const m = c === 'INR' ? pkg.monthly.INR : pkg.monthly.USD
      lines.push({ label: pkg.monthly.label, amount: m, monthly: true })
      monthly += m
    }
  }

  if (!pkg?.noExtras) {
    for (const id of x.addonIds) {
      const a = CONFIG.addons.find((ad) => ad.id === id)
      if (!a || a.hideFor?.includes(pkg?.id ?? '')) continue
      lines.push({ label: a.label, amount: price(a) })
      setup += price(a)
    }
    if (!pkg?.monthly && x.carePlanId && x.carePlanId !== 'none') {
      const care = CONFIG.carePlans.find((p) => p.id === x.carePlanId)
      if (care) {
        const m = c === 'INR' ? care.priceINR : care.priceUSD
        lines.push({ label: care.label, amount: m, monthly: true })
        monthly += m
      }
    }
  }

  return {
    currency: c,
    packageId: pkg?.id,
    packageLabel: pkg?.label,
    lines,
    setup,
    monthly,
    fromPrice: !!pkg?.fromPrice,
    onCall: !!pkg && price(pkg) === 0,
    isPilot: !!pkg?.noExtras,
    foundingNote: pkg?.foundingNote && c === 'INR' && CONFIG.founding.slotsLeft > 0
      ? `${pkg.foundingNote} (${CONFIG.founding.slotsLeft} of 5 places left, until ${CONFIG.founding.endsLabel}).`
      : undefined,
  }
}
