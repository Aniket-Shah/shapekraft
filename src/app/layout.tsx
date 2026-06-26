import type { Metadata, Viewport } from 'next'
import { Inter, Syne, Black_Ops_One } from 'next/font/google'
import './globals.css'
import { SmoothScrollProvider } from '@/components/providers/SmoothScrollProvider'
import { ClientEffects } from '@/components/providers/ClientEffects'
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
  themeColor: '#080808',
  colorScheme: 'dark',
}

export const metadata: Metadata = {
  metadataBase: new URL('https://shapekraft.co'),
  title: {
    template: '%s — ShapeKraft',
    default: 'ShapeKraft — Digital Engineering Studio',
  },
  description:
    'We build fast, conversion-focused websites. Custom Next.js builds, AI automation, performance optimisation, and webhook integrations for growing businesses.',
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
  authors: [{ name: 'ShapeKraft', url: 'https://shapekraft.co' }],
  creator: 'ShapeKraft',
  publisher: 'ShapeKraft',
  alternates: {
    canonical: 'https://shapekraft.co',
  },
  openGraph: {
    title: 'ShapeKraft — Digital Engineering Studio',
    description:
      'We build fast, conversion-focused websites. Custom Next.js builds, AI automation, and performance optimisation.',
    url: 'https://shapekraft.co',
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
    <html lang="en" className={`${inter.variable} ${syne.variable} ${blackOpsOne.variable}`}>
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
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
