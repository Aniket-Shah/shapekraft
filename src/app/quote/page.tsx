import type { Metadata } from 'next'
import { NavStickyMinimal } from '@/components/sections/NavStickyMinimal'
import { SiteFooter } from '@/components/sections/SiteFooter'
import { QuotePageClient } from './QuotePageClient'

export const metadata: Metadata = {
  title: 'Get a Quote — ShapeKraft',
  description:
    'Build your instant project estimate. Select services and page count — live pricing, no forms.',
  openGraph: {
    title: 'Get a Quote — ShapeKraft',
    description: 'Live pricing builder. Select services and pages for an instant estimate.',
    url: 'https://shapekraft.co/quote',
  },
}

export default function QuotePage() {
  return (
    <>
      <NavStickyMinimal />
      <main id="main-content">
        <QuotePageClient />
      </main>
      <SiteFooter />
    </>
  )
}
