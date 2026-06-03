'use client'
import { useEffect } from 'react'

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let cleanup: (() => void) | undefined

    const init = async () => {
      const { default: Lenis } = await import('lenis')
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')

      gsap.registerPlugin(ScrollTrigger)

      const lenis = new Lenis()
      lenis.on('scroll', ScrollTrigger.update)
      gsap.ticker.add((time) => lenis.raf(time * 1000))
      gsap.ticker.lagSmoothing(0)

      cleanup = () => {
        lenis.destroy()
        gsap.ticker.remove((time) => lenis.raf(time * 1000))
      }
    }

    init()
    return () => cleanup?.()
  }, [])

  return <>{children}</>
}
