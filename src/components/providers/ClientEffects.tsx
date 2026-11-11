'use client'
import { useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import { Preloader } from '@/components/motion/Preloader'
import { PageTransition } from '@/components/motion/PageTransition'

const CursorTrailDot = dynamic(
  () => import('@/components/motion/CursorTrailDot').then((m) => m.CursorTrailDot),
  { ssr: false }
)

function ScrollProgressBar() {
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => {
      if (!barRef.current) return
      const total = document.body.scrollHeight - window.innerHeight
      const pct = total > 0 ? window.scrollY / total : 0
      barRef.current.style.transform = `scaleX(${pct})`
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div
      ref={barRef}
      className="fixed top-0 left-0 right-0 pointer-events-none"
      style={{
        height: '2px',
        backgroundColor: 'var(--color-primary)',
        transformOrigin: 'left',
        transform: 'scaleX(0)',
        zIndex: 'var(--z-toast)' as string,
      }}
      aria-hidden="true"
    />
  )
}

/** Feeds --mx/--my to any [data-spotlight] element so its CSS glow follows the cursor. */
function SpotlightTracker() {
  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return
    const onMove = (e: PointerEvent) => {
      const el = (e.target as Element | null)?.closest?.<HTMLElement>('[data-spotlight]')
      if (!el) return
      const r = el.getBoundingClientRect()
      el.style.setProperty('--mx', `${e.clientX - r.left}px`)
      el.style.setProperty('--my', `${e.clientY - r.top}px`)
    }
    document.addEventListener('pointermove', onMove, { passive: true })
    return () => document.removeEventListener('pointermove', onMove)
  }, [])
  return null
}

export function ClientEffects() {
  return (
    <>
      <ScrollProgressBar />
      <CursorTrailDot />
      <SpotlightTracker />
      <Preloader />
      <PageTransition />
    </>
  )
}
