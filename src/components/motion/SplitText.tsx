'use client'
import { useRef, useEffect } from 'react'

interface Props {
  text: string
  className?: string
  stagger?: number
  duration?: number
  trigger?: 'mount' | 'scroll'
  delay?: number
}

export function SplitText({
  text,
  className,
  stagger = 0.04,
  duration = 0.8,
  trigger = 'scroll',
  delay = 0,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!ref.current) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const run = async () => {
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      const chars = ref.current!.querySelectorAll<HTMLElement>('.char')

      const animConfig = {
        opacity: 1,
        y: 0,
        stagger,
        duration,
        delay,
        ease: 'power3.out',
      }

      if (trigger === 'mount') {
        gsap.fromTo(chars, { opacity: 0, y: 50 }, animConfig)
      } else {
        gsap.fromTo(chars, { opacity: 0, y: 50 }, {
          ...animConfig,
          scrollTrigger: { trigger: ref.current!, start: 'top 85%' },
        })
      }
    }

    run()
  }, [stagger, duration, trigger, delay])

  const words = text.split(' ')

  return (
    <span ref={ref} className={className} aria-label={text}>
      {words.map((word, wi) => (
        <span key={wi} className="inline-block overflow-hidden" aria-hidden="true">
          {word.split('').map((char, ci) => (
            <span key={ci} className="char inline-block" style={{ opacity: 0 }}>
              {char}
            </span>
          ))}
          {wi < words.length - 1 && (
            <span className="char inline-block" style={{ opacity: 0 }}>&nbsp;</span>
          )}
        </span>
      ))}
    </span>
  )
}
