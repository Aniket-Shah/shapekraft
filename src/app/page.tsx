import type { Metadata } from 'next'
import { NavStickyMinimal }  from '@/components/sections/NavStickyMinimal'
import { HeroBigStatement }  from '@/components/sections/HeroBigStatement'
import { MarqueeServices }   from '@/components/sections/MarqueeServices'
import { HugeTextScroll }    from '@/components/sections/HugeTextScroll'
import { AboutStrip }        from '@/components/sections/AboutStrip'
import { ServicesGrid }      from '@/components/sections/ServicesGrid'
import { StatsGrid }         from '@/components/sections/StatsGrid'
import { ProcessSteps }      from '@/components/sections/ProcessSteps'
import { ContactBigCTA }     from '@/components/sections/ContactBigCTA'
import { SiteFooter }        from '@/components/sections/SiteFooter'
import { SchemaOrg }         from '@/components/SchemaOrg'

export const metadata: Metadata = {
  alternates: {
    canonical: 'https://shapekraft.co',
  },
}

const homeSchema = [
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': 'https://shapekraft.co/#organization',
    name: 'ShapeKraft',
    alternateName: 'ShapeKraft Studio',
    url: 'https://shapekraft.co',
    description:
      'ShapeKraft is a remote web engineering studio that builds fast, custom Next.js websites and wires AI automation and integrations into them.',
    disambiguatingDescription:
      'Web design, development and AI automation studio. Not related to ShapeCraft 3D-modelling software, games or manufacturing companies.',
    slogan: 'Engineered, not just designed.',
    foundingDate: '2025',
    // TODO: add the LinkedIn company page, GitHub org and Google Business Profile URLs once live
    sameAs: [],
    logo: {
      '@type': 'ImageObject',
      url: 'https://shapekraft.co/icon.svg',
      width: 32,
      height: 32,
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'sales',
      email: 'hello@shapekraft.co',
      availableLanguage: ['English'],
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': 'https://shapekraft.co/#website',
    url: 'https://shapekraft.co',
    name: 'ShapeKraft',
    publisher: { '@id': 'https://shapekraft.co/#organization' },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': 'https://shapekraft.co/#business',
    name: 'ShapeKraft',
    url: 'https://shapekraft.co',
    description:
      'Web design, development, AI automation, performance optimisation, and webhook integrations for growing businesses.',
    email: 'hello@shapekraft.co',
    priceRange: '$$',
    areaServed: ['IN', 'US', 'GB', 'AU', 'CA'],
    knowsAbout: [
      'Web Design',
      'Web Development',
      'Next.js',
      'AI Automation',
      'Performance Optimisation',
      'Webhook Integration',
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'ShapeKraft Services',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Starter Website',
            description: 'Five custom pages, fast on every device, contact form wired to your inbox, SEO basics.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Growth Website',
            description: 'Up to ten pages, CMS/blog, animations, analytics and lead capture to email, WhatsApp or CRM.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Studio Website',
            description: 'Built from scratch to match your brand exactly.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Business B2B',
            description: 'Full-stack business website with discovery calls, AMC support, and custom scope.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'AI Automation Workflow',
            description: 'Hook AI into your product to save time on repetitive tasks.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Performance Optimisation',
            description: 'Make your site noticeably faster and rank higher on Google.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Integrations',
            description:
              'Connect the tools you already use — forms, CRMs, Slack, Notion, Zapier, and more.',
          },
        },
      ],
    },
  },
]

export default function HomePage() {
  return (
    <>
      <SchemaOrg schema={homeSchema} />
      <NavStickyMinimal />

      <main id="main-content">
        <HeroBigStatement />
        <MarqueeServices />
        <AboutStrip />
        <HugeTextScroll />
        {/* <FeaturedWork /> */}
        <ServicesGrid />
        <StatsGrid />
        <ProcessSteps />
        <ContactBigCTA />
      </main>

      <SiteFooter />
    </>
  )
}
