import { useEffect, useState } from 'react'

declare global {
  interface Window {
    /** Set once the intro/preloader has finished (or was skipped). */
    __skReady?: boolean
    /** Shared Lenis instance, exposed for anchor + page-transition scrolling. */
    __lenis?: import('lenis').default
  }
}

export const READY_EVENT = 'sk:ready'

/** Called by the Preloader when the entrance animations may start. */
export function markReady(): void {
  if (typeof window === 'undefined') return
  window.__skReady = true
  document.documentElement.dataset.ready = '1'
  window.dispatchEvent(new Event(READY_EVENT))
}

/** Resolves once the intro has finished. Resolves immediately on later calls. */
export function whenReady(): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || window.__skReady) return resolve()
    window.addEventListener(READY_EVENT, () => resolve(), { once: true })
  })
}

/** React hook: false until the intro has finished. */
export function useSiteReady(): boolean {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    if (window.__skReady) {
      setReady(true)
      return
    }
    const on = () => setReady(true)
    window.addEventListener(READY_EVENT, on)
    return () => window.removeEventListener(READY_EVENT, on)
  }, [])
  return ready
}
