import type { Metadata } from 'next'
import { Inter, Syne } from 'next/font/google'
import './globals.css'
import { SmoothScrollProvider } from '@/components/providers/SmoothScrollProvider'
import { ClientEffects } from '@/components/providers/ClientEffects'

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
    <html lang="en" className={`${inter.variable} ${syne.variable}`}>
      <body>
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
      </body>
    </html>
  )
}
