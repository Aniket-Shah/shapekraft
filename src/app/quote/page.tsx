import type { Metadata } from 'next'
import { NavStickyMinimal } from '@/components/sections/NavStickyMinimal'
import { SiteFooter } from '@/components/sections/SiteFooter'
import { QuotePageClient } from './QuotePageClient'
import { SchemaOrg } from '@/components/SchemaOrg'

export const metadata: Metadata = {
  title: 'Get a Quote',
  description:
    'Build your instant project estimate. Pick a package, add services, choose page count — live pricing with no forms.',
  alternates: {
    canonical: 'https://shapekraft.co/quote',
  },
  openGraph: {
    title: 'Get a Quote — ShapeKraft',
    description: 'Live pricing builder. Pick a package and add-ons for an instant estimate.',
    url: 'https://shapekraft.co/quote',
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
      item: 'https://shapekraft.co',
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Get a Quote',
      item: 'https://shapekraft.co/quote',
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
      </main>
      <SiteFooter />
    </>
  )
}
