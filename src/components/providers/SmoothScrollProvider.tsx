'use client'
import { useEffect } from 'react'
import '@/lib/ready'

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let cleanup: (() => void) | undefined

    const init = async () => {
      const { default: Lenis } = await import('lenis')
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')

      gsap.registerPlugin(ScrollTrigger)

      const lenis = new Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      })
      window.__lenis = lenis
      lenis.on('scroll', ScrollTrigger.update)
      gsap.ticker.add((time) => lenis.raf(time * 1000))
      gsap.ticker.lagSmoothing(0)

      cleanup = () => {
        lenis.destroy()
        window.__lenis = undefined
        gsap.ticker.remove((time) => lenis.raf(time * 1000))
      }
    }

    init()
    return () => cleanup?.()
  }, [])

  return <>{children}</>
}
