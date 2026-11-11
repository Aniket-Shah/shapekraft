'use client'
import { useEffect, useRef, type CSSProperties } from 'react'

interface Part {
  text: string
  accent?: boolean
}

interface Props {
  parts: Part[]
  id?: string
  className?: string
  style?: CSSProperties
}

/**
 * Heading whose words light up one by one as it scrolls through the viewport
 * (scrubbed to scroll position). Static, fully visible under reduced motion.
 */
export function ScrollWords({ parts, id, className, style }: Props) {
  const ref = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const words = el.querySelectorAll<HTMLElement>('[data-w]')

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      words.forEach((w) => (w.style.opacity = '1'))
      return
    }

    let ctx: { revert: () => void } | undefined
    let cancelled = false
    ;(async () => {
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      if (cancelled) return
      gsap.registerPlugin(ScrollTrigger)
      ctx = gsap.context(() => {
        gsap.fromTo(
          words,
          { opacity: 0.16 },
          {
            opacity: 1,
            ease: 'none',
            stagger: 0.12,
            scrollTrigger: { trigger: el, start: 'top 82%', end: 'bottom 48%', scrub: true },
          },
        )
      }, el)
    })()

    return () => {
      cancelled = true
      ctx?.revert()
    }
  }, [])

  return (
    <h2 ref={ref} id={id} className={className} style={style}>
      {parts.flatMap((part, pi) =>
        part.text
          .split(' ')
          .filter(Boolean)
          .map((word, wi) => (
            <span key={`${pi}-${wi}`}>
              <span
                data-w
                style={{
                  opacity: 0.16,
                  color: part.accent ? 'var(--color-primary-ink)' : undefined,
                }}
              >
                {word}
              </span>{' '}
            </span>
          )),
      )}
    </h2>
  )
}
