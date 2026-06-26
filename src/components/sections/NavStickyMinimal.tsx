'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { label: 'Services', href: '/#services' },
  { label: 'Process',  href: '/#process' },
  { label: 'Get a Quote', href: '/quote' },
  { label: 'Contact',  href: '/#contact' },
]

export function NavStickyMinimal() {
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const lastScroll = useRef(0)
  const navRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY
      setScrolled(current > 20)
      setHidden(current > lastScroll.current && current > 80)
      lastScroll.current = current
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const closeMenu = () => setMenuOpen(false)

  return (
    <>
      <header
        ref={navRef}
        className={cn(
          'fixed top-0 left-0 right-0 transition-all duration-500',
          scrolled
            ? 'py-4 border-b'
            : 'py-6',
          hidden ? '-translate-y-full' : 'translate-y-0',
        )}
        style={{
          zIndex: 'var(--z-nav)' as string,
          borderColor: scrolled ? 'var(--color-border)' : 'transparent',
          backgroundColor: scrolled ? 'rgba(8, 8, 8, 0.92)' : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <div
          className="flex items-center justify-between mx-auto w-full"
          style={{ maxWidth: 'var(--max-w)', padding: '0 var(--gutter)' }}
        >
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3"
            aria-label="ShapeKraft — Home"
          >
            <LogoMark color="var(--color-text)" />
            <div style={{
              fontFamily: 'var(--font-black-ops-one), sans-serif',
              lineHeight: 0.86,
              letterSpacing: '0.03em',
              color: 'var(--color-text)',
            }}>
              <span style={{ display: 'block', fontSize: '22px' }}>SHAPE</span>
              <span style={{ display: 'block', fontSize: '22px', paddingLeft: '2px' }}>KRAFT</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav aria-label="Main navigation" className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className="text-sm font-medium transition-colors duration-200"
                style={{ color: 'var(--color-muted)' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-text)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-muted)')}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/#contact"
              className="px-7 py-3 rounded-full text-sm font-semibold transition-all duration-300"
              style={{
                backgroundColor: 'var(--color-primary)',
                color: 'var(--color-primary-fg)',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-accent)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-primary)')}
            >
              Start a Project
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            <span
              className="block w-6 h-px transition-all duration-300"
              style={{
                backgroundColor: 'var(--color-text)',
                transform: menuOpen ? 'translateY(7px) rotate(45deg)' : 'none',
              }}
            />
            <span
              className="block w-6 h-px transition-all duration-300"
              style={{
                backgroundColor: 'var(--color-text)',
                opacity: menuOpen ? 0 : 1,
                transform: menuOpen ? 'scaleX(0)' : 'scaleX(1)',
              }}
            />
            <span
              className="block w-6 h-px transition-all duration-300"
              style={{
                backgroundColor: 'var(--color-text)',
                transform: menuOpen ? 'translateY(-7px) rotate(-45deg)' : 'none',
              }}
            />
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      <div
        className={cn(
          'fixed inset-0 transition-all duration-500 md:hidden',
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        )}
        style={{
          zIndex: 90,
          backgroundColor: 'var(--color-bg)',
          paddingTop: '5rem',
        }}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        <nav className="flex flex-col gap-6 p-8">
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              onClick={closeMenu}
              className="font-display font-bold text-4xl"
              style={{ color: 'var(--color-text)' }}
            >
              {label}
            </Link>
          ))}
          <Link
            href="/#contact"
            onClick={closeMenu}
            className="mt-4 px-8 py-5 rounded-full text-lg font-semibold text-center"
            style={{
              backgroundColor: 'var(--color-primary)',
              color: 'var(--color-primary-fg)',
            }}
          >
            Start a Project
          </Link>
        </nav>
      </div>
    </>
  )
}

function LogoMark({ color = 'white' }: { color?: string }) {
  return (
    <svg width="36" height="42" viewBox="0 0 140 155" fill="none" aria-hidden="true">
      <rect x="20" y="15" width="100" height="100" stroke={color} strokeWidth="1.7" />
      <polygon points="70,15 120,65 70,115 20,65" stroke={color} strokeWidth="1.7" fill="none" />
      <line x1="20" y1="65" x2="120" y2="65" stroke={color} strokeWidth="1.7" />
      <line x1="70" y1="15" x2="70" y2="115" stroke={color} strokeWidth="1.7" />
      <path d="M4,92 L4,137 L44,137" stroke={color} strokeWidth="1.7" fill="none" strokeLinecap="square" />
    </svg>
  )
}
