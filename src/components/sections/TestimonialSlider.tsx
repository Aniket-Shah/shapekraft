'use client'
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'

// One testimonial at a time. The track is a native horizontal scroll-snap list, so
// swipe, trackpad and keyboard scrolling work without script; the buttons just scroll it.
export function TestimonialSlider({ slides }: { slides: ReactNode[] }) {
  const track = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(0)
  const count = slides.length

  useEffect(() => {
    const el = track.current
    if (!el) return
    const onScroll = () => {
      if (el.clientWidth === 0) return
      setIndex(Math.min(count - 1, Math.max(0, Math.round(el.scrollLeft / el.clientWidth))))
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [count])

  const go = useCallback(
    (to: number) => {
      const el = track.current
      if (!el) return
      const next = Math.min(count - 1, Math.max(0, to))
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      el.scrollTo({ left: next * el.clientWidth, behavior: reduce ? 'auto' : 'smooth' })
    },
    [count],
  )

  return (
    <div role="region" aria-roledescription="carousel" aria-label="Client testimonials">
      <div ref={track} className="t-slider" tabIndex={0} aria-label="Testimonials, scroll sideways for more">
        {slides.map((slide, i) => (
          <div
            key={i}
            className="t-slide"
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${count}`}
          >
            {slide}
          </div>
        ))}
      </div>

      {count > 1 && (
        <div className="mt-2 flex items-center justify-center gap-5 md:justify-end">
          <button
            type="button"
            className="t-slider__btn"
            onClick={() => go(index - 1)}
            disabled={index === 0}
            aria-label="Previous testimonial"
          >
            <ArrowLeft size={20} aria-hidden="true" />
          </button>
          <span
            className="font-display text-sm font-bold tabular-nums"
            style={{ color: 'var(--color-text)' }}
            aria-live="polite"
          >
            <span className="sr-only">Testimonial </span>
            {index + 1} / {count}
          </span>
          <button
            type="button"
            className="t-slider__btn"
            onClick={() => go(index + 1)}
            disabled={index === count - 1}
            aria-label="Next testimonial"
          >
            <ArrowRight size={20} aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  )
}
