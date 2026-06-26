'use client'
import Link from 'next/link'
import { useBrandEmail } from '@/lib/useBrandEmail'

const SERVICES_LINKS = [
  { label: 'Website Design', href: '/#services' },
  { label: 'AI Automation', href: '/#services' },
  { label: 'Performance', href: '/#services' },
  { label: 'Webhooks', href: '/#services' },
]

const COMPANY_LINKS = [
  { label: 'Process', href: '/#process' },
  { label: 'Get a Quote', href: '/quote' },
  { label: 'Contact', href: '/#contact' },
]

const SOCIAL_LINKS = [
  { label: 'Twitter / X', href: '#' },
  { label: 'LinkedIn', href: '#' },
  { label: 'GitHub', href: '#' },
]

export function SiteFooter() {
  const email = useBrandEmail()

  return (
    <footer
      className="border-t"
      style={{ borderColor: 'var(--color-border)' }}
      aria-label="Site footer"
    >
      <div
        style={{
          maxWidth: 'var(--max-w)',
          margin: '0 auto',
          padding: 'clamp(2.5rem, 6vw, var(--s-12)) var(--gutter) var(--s-6)',
        }}
      >
        {/* 4-col grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 mb-10 md:mb-16">
          {/* Brand col */}
          <div className="md:col-span-6 flex flex-col gap-5">
            <Link
              href="/"
              className="flex items-center gap-3 w-fit"
              aria-label="ShapeKraft — Home"
            >
              <FooterLogoMark />
              <div style={{
                fontFamily: 'var(--font-black-ops-one), sans-serif',
                lineHeight: 0.86,
                letterSpacing: '0.03em',
                color: 'var(--color-text)',
              }}>
                <span style={{ display: 'block', fontSize: '20px' }}>SHAPE</span>
                <span style={{ display: 'block', fontSize: '20px', paddingLeft: '2px' }}>KRAFT</span>
              </div>
            </Link>
            <p
              className="max-w-xs leading-relaxed"
              style={{ fontSize: 'var(--fs-sm)', color: 'var(--color-muted)', lineHeight: 1.75 }}
            >
              Precision-built digital products for companies that compete at the highest level. No templates. No shortcuts. Pure craft.
            </p>
            <a
              href={`mailto:${email}`}
              className="text-sm font-medium w-fit transition-colors duration-200"
              style={{ color: 'var(--color-accent)' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-text)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-accent)')}
            >
              {email}
            </a>
          </div>

          {/* Services col */}
          <div className="md:col-span-3 flex flex-col gap-4 md:pl-4">
            <span
              className="text-xs font-semibold tracking-widest uppercase"
              style={{ color: 'var(--color-muted)' }}
            >
              Services
            </span>
            <nav aria-label="Footer services" className="flex flex-col gap-3">
              {SERVICES_LINKS.map(({ label, href }) => (
                <Link
                  key={label}
                  href={href}
                  className="text-sm transition-colors duration-200"
                  style={{ color: 'var(--color-muted)' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-text)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-muted)')}
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Company col */}
          <div className="md:col-span-3 flex flex-col gap-4">
            <span
              className="text-xs font-semibold tracking-widest uppercase"
              style={{ color: 'var(--color-muted)' }}
            >
              Company
            </span>
            <nav aria-label="Footer company" className="flex flex-col gap-3">
              {COMPANY_LINKS.map(({ label, href }) => (
                <Link
                  key={label}
                  href={href}
                  className="text-sm transition-colors duration-200"
                  style={{ color: 'var(--color-muted)' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-text)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-muted)')}
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Connect col — hidden until social profiles are ready */}
          {/* <div className="md:col-span-2 flex flex-col gap-4">
            ...
          </div> */}
        </div>

        {/* Bottom bar */}
        <div
          className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6 border-t"
          style={{ borderColor: 'var(--color-border)' }}
        >
          <p className="text-xs" style={{ color: 'var(--color-muted)' }}>
            © 2026 ShapeKraft. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {[{ label: 'Privacy', href: '/privacy' }, { label: 'Terms', href: '/terms' }].map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="text-xs transition-colors duration-200"
                style={{ color: 'var(--color-muted)' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-text)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-muted)')}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

function FooterLogoMark() {
  return (
    <svg width="32" height="37" viewBox="0 0 140 155" fill="none" aria-hidden="true">
      <rect x="20" y="15" width="100" height="100" stroke="var(--color-text)" strokeWidth="1.7" />
      <polygon points="70,15 120,65 70,115 20,65" stroke="var(--color-text)" strokeWidth="1.7" fill="none" />
      <line x1="20" y1="65" x2="120" y2="65" stroke="var(--color-text)" strokeWidth="1.7" />
      <line x1="70" y1="15" x2="70" y2="115" stroke="var(--color-text)" strokeWidth="1.7" />
      <path d="M4,92 L4,137 L44,137" stroke="var(--color-text)" strokeWidth="1.7" fill="none" strokeLinecap="square" />
    </svg>
  )
}
