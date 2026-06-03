'use client'

interface Props {
  children: React.ReactNode
  speed?: number
  className?: string
  reverse?: boolean
}

export function Marquee({ children, speed = 30, className, reverse = false }: Props) {
  const direction = reverse ? 'marquee-reverse' : 'marquee'

  return (
    <div className={`overflow-hidden ${className ?? ''}`} aria-hidden="true">
      <div
        className={`flex gap-0 w-max ${direction}`}
        style={{
          animationDuration: `${speed}s`,
          animationTimingFunction: 'linear',
          animationIterationCount: 'infinite',
        }}
      >
        {children}
        {children}
      </div>
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0) }
          to   { transform: translateX(-50%) }
        }
        @keyframes marquee-reverse {
          from { transform: translateX(-50%) }
          to   { transform: translateX(0) }
        }
        .marquee {
          animation-name: marquee;
        }
        .marquee-reverse {
          animation-name: marquee-reverse;
        }
        @media (prefers-reduced-motion: reduce) {
          .marquee, .marquee-reverse {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  )
}
