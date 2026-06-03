'use client'
import Link from 'next/link'

const LINKS = [
  { label: 'Services', href: '#services' },
  { label: 'Process',  href: '#process' },
  { label: 'Contact',  href: '#contact' },
]

export function SiteFooter() {
  return (
    <footer
      className="border-t"
      style={{
        borderColor: 'var(--color-border)',
        padding: 'var(--s-8) var(--gutter)',
      }}
      aria-label="Site footer"
    >
      <div
        className="flex flex-col md:flex-row items-center justify-between gap-6"
        style={{ maxWidth: 'var(--max-w)', margin: '0 auto' }}
      >
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-display font-bold"
          style={{ color: 'var(--color-text)' }}
          aria-label="ShapeKraft — Home"
        >
          <FooterLogoMark />
          <span>ShapeKraft</span>
        </Link>

        {/* Nav */}
        <nav aria-label="Footer navigation" className="flex items-center gap-6">
          {LINKS.map(({ label, href }) => (
            <Link
              key={href}
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

        {/* Copyright */}
        <p
          className="text-sm"
          style={{ color: 'var(--color-muted)' }}
        >
          © 2026 ShapeKraft. All rights reserved.
        </p>
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
