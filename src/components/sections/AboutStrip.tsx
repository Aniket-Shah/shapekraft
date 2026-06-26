'use client'
import { FadeUp } from '@/components/motion/FadeUp'

const FACTS = [
  ['Studio',   'Global · Remote'],
  ['Founded',  '2025'],
  ['Approach', 'Craft over volume'],
]

export function AboutStrip() {
  return (
    <section
      style={{
        padding: 'clamp(2.5rem, 7vw, var(--s-16)) var(--gutter)',
        borderBottom: '1px solid var(--color-border)',
      }}
      aria-labelledby="about-heading"
    >
      <div style={{ maxWidth: 'var(--max-w)', margin: '0 auto' }}>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">

          {/* Statement */}
          <div className="md:col-span-8 flex flex-col gap-6">
            <FadeUp>
              <span
                className="text-xs font-semibold tracking-widest uppercase"
                style={{ color: 'var(--color-primary)' }}
              >
                About
              </span>
            </FadeUp>

            <FadeUp delay={100}>
              <h2
                id="about-heading"
                className="font-display font-black leading-tight tracking-tight"
                style={{ fontSize: 'var(--fs-3xl)', color: 'var(--color-text)' }}
              >
                We don&apos;t take every project.{' '}
                We take the{' '}
                <span style={{ color: 'var(--color-primary)' }}>right</span>{' '}
                ones. Then we engineer them to win.
              </h2>
            </FadeUp>
          </div>

          {/* Meta */}
          <div className="md:col-span-4 flex flex-col justify-end gap-8">
            <FadeUp delay={200}>
              <p
                style={{
                  color: 'var(--color-muted)',
                  fontSize: 'var(--fs-base)',
                  lineHeight: 1.75,
                }}
              >
                A global digital engineering studio. Precision-built for
                companies that refuse to settle for average.
              </p>
            </FadeUp>

            <FadeUp delay={300}>
              <dl
                className="flex flex-col gap-3 pt-6 border-t"
                style={{ borderColor: 'var(--color-border)' }}
              >
                {FACTS.map(([label, value]) => (
                  <div key={label} className="flex justify-between text-sm">
                    <dt style={{ color: 'var(--color-muted)' }}>{label}</dt>
                    <dd style={{ color: 'var(--color-text)' }}>{value}</dd>
                  </div>
                ))}
              </dl>
            </FadeUp>
          </div>

        </div>
      </div>
    </section>
  )
}
