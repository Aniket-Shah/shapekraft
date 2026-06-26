'use client'
import { useRef, useEffect } from 'react'

const ROWS = [
  { text: 'WE BUILD', isAccent: false, parallaxDir: -1 as const },
  { text: 'WE SHIP',  isAccent: true,  parallaxDir:  1 as const },
  { text: 'WE SCALE', isAccent: false, parallaxDir: -1 as const },
]

const REPEAT = 7

export function HugeTextScroll() {
  const containerRef = useRef<HTMLElement>(null)
  const linesRef = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const setup = async () => {
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)
      if (!containerRef.current) return

      const ctx = gsap.context(() => {
        linesRef.current.forEach((line, i) => {
          if (!line) return
          const dir = ROWS[i].parallaxDir
          gsap.fromTo(
            line,
            { x: dir * 120 },
            {
              x: dir * -120,
              ease: 'none',
              scrollTrigger: {
                trigger: containerRef.current,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1.4,
              },
            }
          )
        })
      }, containerRef)

      return () => ctx.revert()
    }

    setup()
  }, [])

  return (
    <section
      ref={containerRef}
      className="overflow-hidden"
      aria-label="Agency statement"
      style={{
        backgroundColor: 'var(--color-bg)',
        borderTop: '1px solid var(--color-border)',
        borderBottom: '1px solid var(--color-border)',
        padding: 'clamp(2rem, 6vw, 5rem) 0',
      }}
    >
      <div className="flex flex-col gap-4">
        {ROWS.map((row, rowIdx) => (
          <div
            key={row.text}
            ref={(el) => { linesRef.current[rowIdx] = el }}
            className="flex items-center whitespace-nowrap"
            style={{ gap: '2.5rem' }}
          >
            {Array.from({ length: REPEAT }, (_, i) => (
              <span
                key={i}
                className="font-display font-black leading-none tracking-tighter select-none"
                style={{
                  fontSize: 'clamp(3.5rem, 8.5vw, 8rem)',
                  color: row.isAccent
                    ? 'var(--color-primary)'
                    : i % 2 === 0
                      ? 'transparent'
                      : 'rgba(255,255,255,0.05)',
                  WebkitTextStroke: row.isAccent
                    ? 'none'
                    : i % 2 === 0
                      ? '1px rgba(255,255,255,0.2)'
                      : 'none',
                }}
                aria-hidden="true"
              >
                {row.text}
              </span>
            ))}
          </div>
        ))}
      </div>
      <span className="sr-only">{ROWS.map((r) => r.text).join(' · ')}</span>
    </section>
  )
}
