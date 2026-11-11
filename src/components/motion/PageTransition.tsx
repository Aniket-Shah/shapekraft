'use client'
import { useEffect, useRef } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { gsap } from 'gsap'

const LABELS: Record<string, string> = {
  '/': 'Home',
  '/quote': 'Get a Quote',
  '/privacy': 'Privacy',
  '/terms': 'Terms',
}

function scrollToHash(hash: string, immediate = false) {
  const target = hash && hash !== '#' ? document.querySelector<HTMLElement>(decodeURIComponent(hash)) : null
  const lenis = window.__lenis
  if (lenis && immediate) {
    // After a route swap Lenis' cached scroll is stale: sync it to the real
    // position first, then jump to an absolute offset measured from the DOM.
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
    lenis.resize() // refresh cached page height/limit for the new route
    lenis.scrollTo(0, { immediate: true, force: true })
    const y = target ? target.getBoundingClientRect().top + window.scrollY - 72 : 0
    lenis.scrollTo(Math.max(0, y), { immediate: true, force: true })
  } else if (lenis) {
    lenis.scrollTo(target ?? 0, { offset: target ? -72 : 0, duration: 1.4 })
  } else if (target) {
    target.scrollIntoView({ behavior: immediate ? 'auto' : 'smooth' })
  } else {
    window.scrollTo({ top: 0, behavior: immediate ? 'auto' : 'smooth' })
  }
}

/**
 * Route transitions: a teal curtain wipes up over the page, the route
 * changes underneath, then the curtain lifts away. Also smooth-scrolls
 * same-page anchor links through Lenis.
 */
export function PageTransition() {
  const router = useRouter()
  const pathname = usePathname()
  const curtainRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)
  const pending = useRef<{ hash: string } | null>(null)
  const busy = useRef(false)
  const failsafe = useRef<number | undefined>(undefined)

  const cover = () =>
    new Promise<void>((resolve) => {
      const el = curtainRef.current
      if (!el) return resolve()
      gsap.set(el, { display: 'flex', yPercent: 100 })
      gsap.set(labelRef.current, { opacity: 0, y: 40 })
      gsap
        .timeline({ onComplete: resolve })
        .to(el, { yPercent: 0, duration: 0.7, ease: 'power4.inOut' })
        .to(labelRef.current, { opacity: 1, y: 0, duration: 0.45, ease: 'power3.out' }, '-=0.25')
    })

  const uncover = () =>
    new Promise<void>((resolve) => {
      const el = curtainRef.current
      if (!el) return resolve()
      gsap
        .timeline({
          onComplete: () => {
            gsap.set(el, { display: 'none', yPercent: 100 })
            resolve()
          },
        })
        .to(labelRef.current, { opacity: 0, y: -30, duration: 0.3, ease: 'power2.in' })
        .to(el, { yPercent: -100, duration: 0.8, ease: 'power4.inOut' }, '-=0.1')
    })

  // Intercept internal link clicks (capture phase, before Next's <Link>).
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const a = (e.target as Element | null)?.closest?.('a') as HTMLAnchorElement | null
      if (!a || !a.href) return
      if (a.target && a.target !== '_self') return
      if (a.hasAttribute('download')) return

      let url: URL
      try {
        url = new URL(a.href, window.location.href)
      } catch {
        return
      }
      if (url.origin !== window.location.origin) return

      const samePath = url.pathname === window.location.pathname && url.search === window.location.search

      if (samePath) {
        e.preventDefault()
        e.stopPropagation()
        scrollToHash(url.hash)
        if (url.hash !== window.location.hash) {
          window.history.pushState(null, '', url.pathname + url.search + url.hash)
        }
        return
      }

      e.preventDefault()
      e.stopPropagation()
      if (busy.current) return
      busy.current = true
      pending.current = { hash: url.hash }
      if (labelRef.current) labelRef.current.textContent = LABELS[url.pathname] ?? 'ShapeKraft'

      cover().then(() => router.push(url.pathname + url.search + url.hash))

      // Failsafe: if navigation never lands, lift the curtain anyway.
      window.clearTimeout(failsafe.current)
      failsafe.current = window.setTimeout(() => {
        pending.current = null
        uncover().then(() => {
          busy.current = false
        })
      }, 5000)
    }

    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router])

  // New route committed → reset scroll under the curtain, then lift it.
  useEffect(() => {
    if (!pending.current) return
    const { hash } = pending.current
    pending.current = null
    window.clearTimeout(failsafe.current)

    const place = () => {
      if (hash) scrollToHash(hash, true)
      else if (window.__lenis) window.__lenis.scrollTo(0, { immediate: true })
      else window.scrollTo(0, 0)
    }
    place()
    // Next.js applies its own scroll reset right after commit; re-apply
    // while the curtain still covers the page, then lift it.
    // (No cleanup: React Strict Mode re-runs this effect in dev, and the
    // second run would find `pending` already consumed.)
    window.setTimeout(() => {
      place()
      uncover().then(() => {
        busy.current = false
      })
    }, 180)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  return (
    <div
      ref={curtainRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9990,
        display: 'none',
        alignItems: 'flex-end',
        padding: 'var(--gutter)',
        backgroundColor: 'var(--color-teal-600)',
        color: 'var(--color-cream-50)',
        transform: 'translateY(100%)',
        willChange: 'transform',
        pointerEvents: 'none',
      }}
    >
      <span
        ref={labelRef}
        className="font-display font-black leading-none tracking-tight"
        style={{ fontSize: 'clamp(3rem, 12vw, 10rem)' }}
      />
    </div>
  )
}
