'use client'
import { useRef, type MouseEvent } from 'react'
import { cn } from '@/lib/utils'

interface Props {
  children: React.ReactNode
  strength?: number
  className?: string
}

/** Pulls toward the cursor, then springs back with an elastic ease. */
export function MagneticButton({ children, strength = 0.3, className }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  const handleMove = async (e: MouseEvent) => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (window.matchMedia('(pointer: coarse)').matches) return
    const { gsap } = await import('gsap')
    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    gsap.to(el, { x: x * strength, y: y * strength, duration: 0.4, ease: 'power3.out', overwrite: 'auto' })
  }

  const handleLeave = async () => {
    const el = ref.current
    if (!el) return
    const { gsap } = await import('gsap')
    gsap.to(el, { x: 0, y: 0, duration: 1.1, ease: 'elastic.out(1, 0.35)', overwrite: 'auto' })
  }

  return (
    <div
      ref={ref}
      className={cn('inline-block', className)}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ willChange: 'transform' }}
    >
      {children}
    </div>
  )
}
