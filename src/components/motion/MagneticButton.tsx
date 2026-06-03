'use client'
import { useRef, type MouseEvent } from 'react'
import { cn } from '@/lib/utils'

interface Props {
  children: React.ReactNode
  strength?: number
  className?: string
}

export function MagneticButton({ children, strength = 0.3, className }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  const handleMove = (e: MouseEvent) => {
    if (!ref.current) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const rect = ref.current.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    ref.current.style.transform = `translate(${x * strength}px, ${y * strength}px)`
    ref.current.style.transition = 'transform 0.1s linear'
  }

  const handleLeave = () => {
    if (!ref.current) return
    ref.current.style.transform = 'translate(0, 0)'
    ref.current.style.transition = 'transform 0.5s cubic-bezier(0.16,1,0.3,1)'
  }

  return (
    <div
      ref={ref}
      className={cn('inline-block', className)}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      {children}
    </div>
  )
}
