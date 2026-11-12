'use client'
import { useEffect, useRef, useState } from 'react'
import { markReady } from '@/lib/ready'

const SEEN_KEY = 'sk-intro-seen'

/**
 * Intro sequence: logo mark draws itself, counter runs 000 → 100, then the
 * teal curtain lifts to reveal the hero. Plays once per browser session.
 * Skipped entirely for prefers-reduced-motion.
 */
export function Preloader() {
  const rootRef = useRef<HTMLDivElement>(null)
  const [done, setDone] = useState(false)

  useEffect(() => {
    let seen = false
    try {
      seen = sessionStorage.getItem(SEEN_KEY) === '1'
    } catch {}
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (seen || reduced) {
      markReady()
      setDone(true)
      return
    }

    const html = document.documentElement
    const prevOverflow = html.style.overflow
    html.style.overflow = 'hidden'

    let killed = false
    let tl: { kill: () => void } | undefined

    const finish = () => {
      html.style.overflow = prevOverflow
      try {
        sessionStorage.setItem(SEEN_KEY, '1')
      } catch {}
      markReady()
      setDone(true)
    }
    // Failsafe: never trap the user behind the intro. Whole intro ≈ 1.6s (was ≈ 2.9s)
    // because the hero headline (the LCP element) can't paint until it ends.
    const failsafe = window.setTimeout(finish, 3000)

    ;(async () => {
      const { gsap } = await import('gsap')
      const el = rootRef.current
      if (killed || !el) return

      const counter = el.querySelector<HTMLElement>('[data-count]')
      const paths = el.querySelectorAll<SVGGeometryElement>('[data-draw]')
      paths.forEach((p) => {
        const len = p.getTotalLength()
        p.style.strokeDasharray = `${len}`
        p.style.strokeDashoffset = `${len}`
      })

      const obj = { v: 0 }
      const timeline = gsap.timeline({
        onComplete: () => {
          window.clearTimeout(failsafe)
          finish()
        },
      })
      tl = timeline
      timeline
        .to(paths, { strokeDashoffset: 0, duration: 0.6, ease: 'power2.inOut', stagger: 0.05 }, 0)
        .to(
          obj,
          {
            v: 100,
            duration: 0.8,
            ease: 'power2.inOut',
            onUpdate: () => {
              if (counter) counter.textContent = String(Math.round(obj.v)).padStart(3, '0')
            },
          },
          0,
        )
        .to(
          el.querySelectorAll('[data-fade]'),
          { opacity: 0, y: -24, duration: 0.3, ease: 'power2.in', stagger: 0.04 },
          '+=0.05',
        )
        .to(el, { yPercent: -100, duration: 0.6, ease: 'power4.inOut' }, '>-0.05')
    })()

    return () => {
      killed = true
      window.clearTimeout(failsafe)
      tl?.kill()
      html.style.overflow = prevOverflow
    }
  }, [])

  if (done) return null

  return (
    <div
      ref={rootRef}
      className="preloader"
      role="status"
      aria-label="Loading ShapeKraft"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10000,
        backgroundColor: 'var(--color-teal-600)',
        color: 'var(--color-cream-50)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 'var(--gutter)',
        borderRadius: '0 0 50% 50% / 0 0 6vw 6vw',
        willChange: 'transform',
      }}
    >
      <div data-fade className="flex items-center justify-between text-xs font-semibold tracking-widest uppercase">
        <span>ShapeKraft</span>
        <span>Web Design &amp; Development Studio</span>
      </div>

      <div data-fade className="flex items-center justify-center">
        <svg width="112" height="124" viewBox="0 0 140 155" fill="none" aria-hidden="true">
          <g stroke="currentColor" strokeWidth="1.7">
            <rect data-draw x="20" y="15" width="100" height="100" />
            <polygon data-draw points="70,15 120,65 70,115 20,65" fill="none" />
            <line data-draw x1="20" y1="65" x2="120" y2="65" />
            <line data-draw x1="70" y1="15" x2="70" y2="115" />
            <path data-draw d="M4,92 L4,137 L44,137" fill="none" strokeLinecap="square" />
          </g>
        </svg>
      </div>

      <div data-fade className="flex items-end justify-between">
        <span
          data-count
          className="font-display font-black leading-none tabular-nums"
          style={{ fontSize: 'clamp(4rem, 16vw, 12rem)' }}
        >
          000
        </span>
        <span className="text-xs font-semibold tracking-widest uppercase pb-2">Loading</span>
      </div>
    </div>
  )
}
