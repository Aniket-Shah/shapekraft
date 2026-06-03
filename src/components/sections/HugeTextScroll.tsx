'use client'
import { useRef, useEffect } from 'react'

const LINES = ['WE BUILD', 'WE SHIP', 'WE SCALE']

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
          const dir = i % 2 === 0 ? -1 : 1
          gsap.fromTo(
            line,
            { x: dir * 80 },
            {
              x: dir * -80,
              ease: 'none',
              scrollTrigger: {
                trigger: containerRef.current,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1.2,
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
      className="overflow-hidden py-24"
      aria-label="Agency statement"
      style={{ backgroundColor: 'var(--color-bg)' }}
    >
      <div className="flex flex-col gap-2">
        {LINES.map((line, i) => (
          <div
            key={line}
            ref={(el) => { linesRef.current[i] = el }}
            className="font-display font-black leading-none tracking-tighter whitespace-nowrap select-none"
            style={{
              fontSize: 'clamp(4rem, 12vw, 11rem)',
              color: i === 1 ? 'var(--color-primary)' : 'transparent',
              WebkitTextStroke: i === 1 ? 'none' : '1px var(--color-border)',
            }}
            aria-hidden="true"
          >
            {line}
          </div>
        ))}
        <span className="sr-only">{LINES.join(' — ')}</span>
      </div>
    </section>
  )
}
