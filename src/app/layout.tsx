import type { Metadata, Viewport } from 'next'
import { Inter, Syne, Black_Ops_One } from 'next/font/google'
import './globals.css'
import { SmoothScrollProvider } from '@/components/providers/SmoothScrollProvider'
import { ClientEffects } from '@/components/providers/ClientEffects'
import { CookieBanner } from '@/components/CookieBanner'
import { AnalyticsScripts } from '@/components/AnalyticsScripts'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Analytics } from '@vercel/analytics/next'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
})

const blackOpsOne = Black_Ops_One({
  subsets: ['latin'],
  variable: '--font-black-ops-one',
  weight: ['400'],
  display: 'swap',
})

export const viewport: Viewport = {
  themeColor: '#E97451',
  colorScheme: 'light',
}

export const metadata: Metadata = {
  metadataBase: new URL('https://www.shapekraft.co'),
  title: {
    template: '%s — ShapeKraft',
    default: 'ShapeKraft — Web Design, Development & AI Automation Studio',
  },
  description:
    'Fast custom websites, AI automation and integrations for growing businesses and B2B teams in India and worldwide. Next.js builds, no templates.',
  keywords: [
    'web design',
    'web development',
    'Next.js agency',
    'AI automation',
    'performance optimisation',
    'webhook integrations',
    'digital agency India',
    'website design India',
    'ShapeKraft',
  ],
  authors: [{ name: 'ShapeKraft', url: 'https://www.shapekraft.co' }],
  creator: 'ShapeKraft',
  publisher: 'ShapeKraft',
  alternates: {
    canonical: 'https://www.shapekraft.co',
  },
  openGraph: {
    title: 'ShapeKraft — Digital Engineering Studio',
    description:
      'We build fast, conversion-focused websites. Custom Next.js builds, AI automation, and performance optimisation.',
    url: 'https://www.shapekraft.co',
    siteName: 'ShapeKraft',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'ShapeKraft — Digital Engineering Studio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ShapeKraft — Digital Engineering Studio',
    description:
      'We build fast, conversion-focused websites. Custom Next.js builds, AI automation, and performance optimisation.',
    images: ['/opengraph-image'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${syne.variable} ${blackOpsOne.variable}`}>
      <head>
        {/* Skip the intro for returning visitors before first paint */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(sessionStorage.getItem("sk-intro-seen")==="1")document.documentElement.dataset.seen="1"}catch(e){}`,
          }}
        />
        {/* Consent Mode v2 default — must run before gtag.js/GTM so tags are gated from first load */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('consent', 'default', {
                'analytics_storage': 'denied',
                'ad_storage': 'denied',
                'ad_user_data': 'denied',
                'ad_personalization': 'denied',
                'wait_for_update': 500
              });
            `,
          }}
        />
        {/* Without JavaScript the intro overlay never leaves and animated text stays at opacity 0.
            Show the page as plain content instead. */}
        <noscript>
          <style>{`.preloader{display:none!important}.char,[data-fade-up]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </head>
      <body suppressHydrationWarning>
        {/* Skip to main content — accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:rounded-md focus:text-sm focus:font-semibold"
          style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-primary-fg)' }}
        >
          Skip to main content
        </a>

        <SmoothScrollProvider>
          <ClientEffects />
          {children}
        </SmoothScrollProvider>
        <CookieBanner />
        <AnalyticsScripts />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
