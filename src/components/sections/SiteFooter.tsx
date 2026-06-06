'use client'
import Link from 'next/link'

const SERVICES_LINKS = [
  { label: 'Website Design', href: '#services' },
  { label: 'AI Automation', href: '#services' },
  { label: 'Performance', href: '#services' },
  { label: 'Webhooks', href: '#services' },
]

const COMPANY_LINKS = [
  { label: 'Work', href: '#work' },
  { label: 'Process', href: '#process' },
  { label: 'Contact', href: '#contact' },
]

const SOCIAL_LINKS = [
  { label: 'Twitter / X', href: '#' },
  { label: 'LinkedIn', href: '#' },
  { label: 'GitHub', href: '#' },
]

export function SiteFooter() {
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
          padding: 'var(--s-12) var(--gutter) var(--s-6)',
        }}
      >
        {/* 4-col grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          {/* Brand col */}
          <div className="md:col-span-5 flex flex-col gap-5">
            <Link
              href="/"
              className="flex items-center gap-2.5 font-display font-bold text-lg w-fit"
              style={{ color: 'var(--color-text)' }}
              aria-label="ShapeKraft — Home"
            >
              <FooterLogoMark />
              <span>ShapeKraft</span>
            </Link>
            <p
              className="max-w-xs leading-relaxed"
              style={{ fontSize: 'var(--fs-sm)', color: 'var(--color-muted)', lineHeight: 1.75 }}
            >
              We build websites that perform — fast, precise, and built to convert. No templates. No shortcuts. Pure craft.
            </p>
            <a
              href="mailto:hello@shapekraft.co"
              className="text-sm font-medium w-fit transition-colors duration-200"
              style={{ color: 'var(--color-accent)' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-text)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-accent)')}
            >
              hello@shapekraft.co
            </a>
          </div>

          {/* Services col */}
          <div className="md:col-span-3 flex flex-col gap-4">
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

          {/* Company + Social col */}
          <div className="md:col-span-2 flex flex-col gap-4">
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

          {/* Connect col */}
          <div className="md:col-span-2 flex flex-col gap-4">
            <span
              className="text-xs font-semibold tracking-widest uppercase"
              style={{ color: 'var(--color-muted)' }}
            >
              Connect
            </span>
            <nav aria-label="Footer social links" className="flex flex-col gap-3">
              {SOCIAL_LINKS.map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  className="text-sm transition-colors duration-200 inline-flex items-center gap-1"
                  style={{ color: 'var(--color-muted)' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-text)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-muted)')}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {label}
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                    <path d="M1.5 8.5L8.5 1.5M8.5 1.5H3M8.5 1.5V7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              ))}
            </nav>
          </div>
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
            {['Privacy', 'Terms'].map((label) => (
              <a
                key={label}
                href="#"
                className="text-xs transition-colors duration-200"
                style={{ color: 'var(--color-muted)' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-text)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-muted)')}
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

function FooterLogoMark() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 28 28"
      fill="none"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="28" height="28" rx="6" fill="var(--color-primary)" />
      <path
        d="M8 9h7.5a4.5 4.5 0 0 1 0 9H8V9Z"
        fill="var(--color-primary-fg)"
        opacity="0.9"
      />
      <path
        d="M15 14h5"
        stroke="var(--color-primary-fg)"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}
