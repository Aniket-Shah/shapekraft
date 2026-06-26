import type { Metadata } from 'next'
import Link from 'next/link'
import { NavStickyMinimal } from '@/components/sections/NavStickyMinimal'
import { SiteFooter } from '@/components/sections/SiteFooter'

export const metadata: Metadata = {
  title: '404 — Page Not Found',
  description: 'The page you are looking for does not exist.',
  robots: { index: false, follow: false },
}

export default function NotFound() {
  return (
    <>
      <NavStickyMinimal />

      <main
        id="main-content"
        className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden"
        style={{ background: 'var(--color-bg)' }}
      >
        {/* Subtle grid backdrop */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(var(--color-border) 1px, transparent 1px), linear-gradient(90deg, var(--color-border) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
            opacity: 0.25,
          }}
        />

        {/* Purple glow orb */}
        <div
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 65%)',
          }}
        />

        <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
          {/* Big 404 */}
          <p
            aria-hidden
            className="font-display font-black leading-none select-none"
            style={{
              fontSize: 'clamp(7rem, 22vw, 16rem)',
              background: 'linear-gradient(135deg, #7C3AED 0%, #A78BFA 55%, #7C3AED 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '-0.04em',
            }}
          >
            404
          </p>

          <h1
            className="font-display font-bold mt-2 mb-4"
            style={{ fontSize: 'var(--fs-2xl)', color: 'var(--color-text)', lineHeight: 1.2 }}
          >
            This page didn&rsquo;t make the cut.
          </h1>

          <p
            className="mb-10 mx-auto max-w-md"
            style={{ fontSize: 'var(--fs-base)', color: 'var(--color-muted)', lineHeight: 1.75 }}
          >
            Even the best designs have dead ends.{' '}
            Let&rsquo;s get you back on track.
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full px-8 py-3 font-semibold text-sm transition-opacity duration-200 hover:opacity-85"
              style={{
                background: 'var(--color-primary)',
                color: 'var(--color-primary-fg)',
              }}
            >
              ← Back to Home
            </Link>
            <Link
              href="/#contact"
              className="inline-flex items-center gap-2 rounded-full border px-8 py-3 font-semibold text-sm transition-opacity duration-200 hover:opacity-70"
              style={{
                borderColor: 'var(--color-border)',
                color: 'var(--color-text)',
              }}
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </main>

      <SiteFooter />
    </>
  )
}
