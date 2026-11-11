'use client'
import { useRef } from 'react'
import { useInView } from '@/lib/scroll'
import { useSiteReady } from '@/lib/ready'
import { cn } from '@/lib/utils'

interface Props {
  children: React.ReactNode
  delay?: number
  className?: string
}

export function FadeUp({ children, delay = 0, className }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const seen = useInView(ref)
  const ready = useSiteReady()
  const inView = seen && ready

  return (
    <div
      ref={ref}
      className={cn('transition-all duration-700', className)}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(40px)',
        transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}
