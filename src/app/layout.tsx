import type { Metadata } from 'next'
import { Inter, Syne, Black_Ops_One } from 'next/font/google'
import './globals.css'
import { SmoothScrollProvider } from '@/components/providers/SmoothScrollProvider'
import { ClientEffects } from '@/components/providers/ClientEffects'
import { SpeedInsights } from '@vercel/speed-insights/next'

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

export const metadata: Metadata = {
  title: 'ShapeKraft — Digital Engineering Studio',
  description:
    'We build websites that perform. Fast, precise, and engineered to convert. Custom Next.js builds, AI automation, and performance optimisation.',
  metadataBase: new URL('https://shapekraft.co'),
  openGraph: {
    title: 'ShapeKraft — Digital Engineering Studio',
    description:
      'We build websites that perform. Fast, precise, and engineered to convert.',
    url: 'https://shapekraft.co',
    siteName: 'ShapeKraft',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ShapeKraft — Digital Engineering Studio',
    description: 'We build websites that perform. Fast, precise, and engineered to convert.',
  },
  robots: {
    index: true,
    follow: true,
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
        <SpeedInsights />
      </body>
    </html>
  )
}
