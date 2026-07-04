import type { Market } from './market'

export const GTM_ID: Record<Market, string> = {
  IN: process.env.NEXT_PUBLIC_GTM_ID_IN ?? '',
  US: process.env.NEXT_PUBLIC_GTM_ID_CO ?? '',
}

export const GA_ID: Record<Market, string> = {
  IN: process.env.NEXT_PUBLIC_GA_ID_IN ?? '',
  US: process.env.NEXT_PUBLIC_GA_ID_CO ?? '',
}

/** Pushes a custom event to the dataLayer for a GTM trigger to pick up. */
export function pushDataLayerEvent(event: string) {
  if (typeof window === 'undefined') return
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({ event })
}
