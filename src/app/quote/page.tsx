import type { Metadata } from 'next'
import { NavStickyMinimal } from '@/components/sections/NavStickyMinimal'
import { SiteFooter } from '@/components/sections/SiteFooter'
import { QuotePageClient } from './QuotePageClient'
import { SchemaOrg } from '@/components/SchemaOrg'
import { FAQSection } from '@/components/sections/FAQSection'
import { QUOTE_FAQS } from '@/lib/faq'

export const metadata: Metadata = {
  title: 'Website Cost Calculator: Instant Quote',
  description:
    'Build your instant project estimate. Pick a package, add services, choose page count — live pricing in INR or USD.',
  openGraph: {
    title: 'Get a Quote — ShapeKraft',
    description: 'Live pricing builder. Pick a package and add-ons for an instant estimate.',
    url: 'https://www.shapekraft.co/quote',
    type: 'website',
  },
}

const quoteSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: 'https://www.shapekraft.co',
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Get a Quote',
      item: 'https://www.shapekraft.co/quote',
    },
  ],
}

export default function QuotePage() {
  return (
    <>
      <SchemaOrg schema={quoteSchema} />
      <NavStickyMinimal />
      <main id="main-content" style={{ paddingTop: '5rem' }}>
        <QuotePageClient />
        <FAQSection items={QUOTE_FAQS} showQuoteLink={false} />
      </main>
      <SiteFooter />
    </>
  )
}
