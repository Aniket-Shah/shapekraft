'use client'
import { useEffect, useRef } from 'react'

export function CursorTrailDot() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let mouseX = 0
    let mouseY = 0
    let ringX = 0
    let ringY = 0
    let rafId: number

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }

    const tick = () => {
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`
      }
      ringX += (mouseX - ringX) * 0.12
      ringY += (mouseY - ringY) * 0.12
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`
      }
      rafId = requestAnimationFrame(tick)
    }

    window.addEventListener('mousemove', onMove)
    rafId = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <>
      <div
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none hidden md:block"
        style={{ zIndex: 'var(--z-cursor)' as string }}
        aria-hidden="true"
      >
        <div
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            backgroundColor: 'var(--color-accent)',
          }}
        />
      </div>
      <div
        ref={ringRef}
        className="fixed top-0 left-0 pointer-events-none hidden md:block"
        style={{ zIndex: 'var(--z-cursor)' as string }}
        aria-hidden="true"
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            border: '1px solid var(--color-accent)',
            opacity: 0.5,
          }}
        />
      </div>
    </>
  )
}
