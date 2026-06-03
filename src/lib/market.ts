export type Market = 'IN' | 'US'
export type Currency = 'INR' | 'USD'

const DOMAIN_MAP: Record<string, Market> = {
  'shapekraft.in': 'IN',
  'shapekraft.co': 'US',
}

const CURRENCY_MAP: Record<Market, Currency> = {
  IN: 'INR',
  US: 'USD',
}

export function getMarket(hostname?: string): Market {
  if (!hostname && typeof window !== 'undefined') {
    hostname = window.location.hostname
  }
  return DOMAIN_MAP[hostname ?? ''] ?? 'US'
}

export function getCurrency(market: Market): Currency {
  return CURRENCY_MAP[market]
}

export function formatPrice(amount: number, currency: Currency): string {
  const locale = currency === 'INR' ? 'en-IN' : 'en-US'
  return new Intl.NumberFormat(locale, { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount)
}
