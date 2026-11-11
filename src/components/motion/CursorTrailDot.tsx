'use client'
import { useEffect, useRef } from 'react'

const INTERACTIVE = 'a, button, [role="button"], [data-cursor], summary, label[for]'

/**
 * Custom cursor: a precise dot plus a lagging ring. The ring swells over
 * interactive elements and compresses while pressed.
 */
export function CursorTrailDot() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let mouseX = -100
    let mouseY = -100
    let ringX = -100
    let ringY = -100
    let rafId: number

    const setState = (key: 'hover' | 'down', value: boolean) => {
      const v = String(value)
      if (dotRef.current) dotRef.current.dataset[key] = v
      if (ringRef.current) ringRef.current.dataset[key] = v
    }

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }
    const onOver = (e: MouseEvent) => {
      setState('hover', !!(e.target as Element | null)?.closest?.(INTERACTIVE))
    }
    const onDown = () => setState('down', true)
    const onUp = () => setState('down', false)
    const onLeaveWindow = () => {
      if (dotRef.current) dotRef.current.style.opacity = '0'
      if (ringRef.current) ringRef.current.style.opacity = '0'
    }
    const onEnterWindow = () => {
      if (dotRef.current) dotRef.current.style.opacity = '1'
      if (ringRef.current) ringRef.current.style.opacity = '1'
    }

    const tick = () => {
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`
      }
      ringX += (mouseX - ringX) * 0.14
      ringY += (mouseY - ringY) * 0.14
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`
      }
      rafId = requestAnimationFrame(tick)
    }

    window.addEventListener('mousemove', onMove)
    document.addEventListener('mouseover', onOver)
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)
    document.documentElement.addEventListener('mouseleave', onLeaveWindow)
    document.documentElement.addEventListener('mouseenter', onEnterWindow)
    rafId = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onOver)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
      document.documentElement.removeEventListener('mouseleave', onLeaveWindow)
      document.documentElement.removeEventListener('mouseenter', onEnterWindow)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <>
      <div
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none hidden md:block"
        style={{ zIndex: 'var(--z-cursor)' as string, transition: 'opacity 0.3s' }}
        aria-hidden="true"
      >
        <div className="cursor-dot" />
      </div>
      <div
        ref={ringRef}
        className="fixed top-0 left-0 pointer-events-none hidden md:block"
        style={{ zIndex: 'var(--z-cursor)' as string, transition: 'opacity 0.3s' }}
        aria-hidden="true"
      >
        <div className="cursor-ring" />
      </div>
    </>
  )
}
