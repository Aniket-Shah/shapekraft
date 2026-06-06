'use client'
import { useRef, useEffect, useState } from 'react'

interface Stat {
  prefix?: string
  value: number
  suffix: string
  label: string
  note?: string
}

const STATS: Stat[] = [
  { value: 3,   suffix: '+',  label: 'Projects Shipped',  note: 'and growing' },
  { value: 100, suffix: '',   label: 'Lighthouse Score',   note: 'perfect score' },
  { value: 2,   prefix: '<', suffix: 's', label: 'Avg LCP', note: 'real-world speed' },
  { value: 90,  suffix: '+',  label: 'Performance Score', note: 'all categories' },
]

function AnimatedStat({ stat }: { stat: Stat }) {
  const ref = useRef<HTMLDivElement>(null)
  const [count, setCount] = useState(0)
  const fired = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setCount(stat.value)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !fired.current) {
          fired.current = true
          const duration = 1800
          const start = performance.now()
          const tick = (now: number) => {
            const progress = Math.min((now - start) / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            setCount(Math.round(eased * stat.value))
            if (progress < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
        }
      },
      { threshold: 0.4 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [stat.value])

  return (
    <div
      ref={ref}
      className="flex flex-col justify-between p-8 md:p-10 transition-colors duration-300"
      style={{ backgroundColor: 'var(--color-bg)' }}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-surface)')}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-bg)')}
    >
      <span
        className="font-display font-black block mb-3 leading-none tabular-nums"
        style={{ fontSize: 'var(--fs-3xl)', color: 'var(--color-text)' }}
      >
        {stat.prefix}{count}{stat.suffix}
        <span style={{ color: 'var(--color-primary)' }}>.</span>
      </span>
      <div>
        <p className="font-semibold text-sm" style={{ color: 'var(--color-text)' }}>
          {stat.label}
        </p>
        {stat.note && (
          <p className="text-xs mt-0.5" style={{ color: 'var(--color-muted)' }}>
            {stat.note}
          </p>
        )}
      </div>
    </div>
  )
}

export function StatsGrid() {
  return (
    <section
      aria-label="Agency statistics"
      className="border-y"
      style={{ borderColor: 'var(--color-border)', padding: 'var(--s-4) var(--gutter)' }}
    >
      <div
        className="grid grid-cols-2 md:grid-cols-4 gap-px"
        style={{
          maxWidth: 'var(--max-w)',
          margin: '0 auto',
          backgroundColor: 'var(--color-border)',
          border: '1px solid var(--color-border)',
        }}
      >
        {STATS.map((stat) => (
          <AnimatedStat key={stat.label} stat={stat} />
        ))}
      </div>
    </section>
  )
}
