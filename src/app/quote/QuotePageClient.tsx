'use client'
import { QuotationBuilder, CONFIG } from '@/components/sections/QuotationBuilder'

export function QuotePageClient() {
  function onRequestQuote(summary: string) {
    const host = window.location.hostname
    const number = host.endsWith('.in')
      ? CONFIG.whatsapp.IN.replace('+', '')
      : CONFIG.whatsapp.US.replace('+', '')
    window.open(
      `https://wa.me/${number}?text=${encodeURIComponent(summary)}`,
      '_blank',
      'noopener,noreferrer',
    )
  }

  return <QuotationBuilder onRequestQuote={onRequestQuote} />
}
