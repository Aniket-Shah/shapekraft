import { useEffect, useState, useRef, type RefObject } from 'react'

export function useScrollProgress(): number {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      setProgress(docHeight > 0 ? scrollTop / docHeight : 0)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  return progress
}

export function useInView(ref: RefObject<Element | null>, threshold = 0.1): boolean {
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true) },
      { threshold }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [ref, threshold])
  return inView
}

export function useParallax(speed = 0.5) {
  const ref = useRef<HTMLElement>(null)
  useEffect(() => {
    if (!ref.current) return
    let gsapModule: typeof import('gsap') | null = null
    const setup = async () => {
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)
      gsapModule = { default: gsap } as typeof import('gsap')
      gsap.to(ref.current!, {
        yPercent: -20 * speed,
        ease: 'none',
        scrollTrigger: {
          trigger: ref.current!,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      })
    }
    setup()
    return () => {
      if (gsapModule) {
        // cleanup handled by gsap context in components
      }
    }
  }, [speed])
  return ref
}

export function lockScroll(): void {
  document.body.style.overflow = 'hidden'
}

export function unlockScroll(): void {
  document.body.style.overflow = ''
}
