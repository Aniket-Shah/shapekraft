'use client'
import { useEffect, useRef } from 'react'
import { FadeUp } from '@/components/motion/FadeUp'

interface Step {
  number: string
  title: string
  description: string
}

const STEPS: Step[] = [
  {
    number: '01',
    title: 'Brief & Discovery',
    description:
      'We learn your business, your goals, your users. No assumptions — just questions and listening. This shapes everything that follows.',
  },
  {
    number: '02',
    title: 'Design & Spec',
    description:
      'We design the architecture before the aesthetics. Wireframes, component specs, motion brief. You see exactly what we\'ll build before we build it.',
  },
  {
    number: '03',
    title: 'Build & Assemble',
    description:
      'Development starts. Every component precision-built, every interaction crafted. Regular check-ins so nothing is a surprise.',
  },
  {
    number: '04',
    title: 'Review & Ship',
    description:
      'QA, performance audit, Lighthouse pass. We hand over a site that\'s live, fast, and fully yours. Plus a handoff doc so your team can move.',
  },
]

export function ProcessSteps() {
  const sectionRef = useRef<HTMLElement>(null)
  const barRef = useRef<HTMLDivElement>(null)

  // Progress line fills as the section scrolls through the viewport.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      if (barRef.current) barRef.current.style.transform = 'scaleX(1)'
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
          barRef.current,
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: 'none',
            scrollTrigger: { trigger: sectionRef.current, start: 'top 60%', end: 'bottom 75%', scrub: true },
          },
        )
      }, sectionRef)
    })()
    return () => {
      cancelled = true
      ctx?.revert()
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      id="process"
      className="theme-cream"
      aria-labelledby="process-heading"
      style={{ padding: 'clamp(3rem, 8vw, var(--s-24)) var(--gutter)' }}
    >
      <div style={{ maxWidth: 'var(--max-w)', margin: '0 auto' }}>
        {/* Header */}
        <FadeUp>
          <span
            className="text-xs font-semibold tracking-widest uppercase block mb-3"
            style={{ color: 'var(--color-primary-ink)' }}
          >
            How we work
          </span>
          <h2
            id="process-heading"
            className="font-display font-black tracking-tight mb-8 md:mb-16"
            style={{ fontSize: 'var(--fs-3xl)', color: 'var(--color-text)' }}
          >
            Our Process
          </h2>
        </FadeUp>

        {/* Scroll progress line */}
        <div className="relative mb-6" style={{ height: 2, backgroundColor: 'var(--color-border)' }} aria-hidden="true">
          <div
            ref={barRef}
            className="absolute inset-0"
            style={{ backgroundColor: 'var(--color-primary)', transformOrigin: 'left', transform: 'scaleX(0)' }}
          />
        </div>

        {/* Steps */}
        <ol
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px"
          style={{
            backgroundColor: 'var(--color-border)',
            border: '1px solid var(--color-border)',
          }}
        >
          {STEPS.map((step, i) => (
            <FadeUp key={step.number} delay={i * 100} className="h-full">
              <li
                data-spotlight
                className="h-full p-8 flex flex-col gap-6 transition-colors duration-300"
                style={{ backgroundColor: 'var(--color-bg)' }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-surface)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-bg)')}

              >
                <div className="flex items-center justify-between">
                  <span
                    className="font-mono text-xs font-bold tracking-widest"
                    style={{ color: 'var(--color-primary-ink)' }}
                  >
                    {step.number}
                  </span>
                  {i < STEPS.length - 1 && (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      aria-hidden="true"
                      className="hidden lg:block"
                    >
                      <path
                        d="M3 8h10M9 4l4 4-4 4"
                        stroke="var(--color-muted)"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>
                <h3
                  className="font-display font-bold"
                  style={{ fontSize: 'var(--fs-lg)', color: 'var(--color-text)' }}
                >
                  {step.title}
                </h3>
                <p
                  className="flex-1"
                  style={{ fontSize: 'var(--fs-sm)', color: 'var(--color-muted)', lineHeight: 1.7 }}
                >
                  {step.description}
                </p>
              </li>
            </FadeUp>
          ))}
        </ol>
      </div>
    </section>
  )
}
