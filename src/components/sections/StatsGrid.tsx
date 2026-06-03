import { FadeUp } from '@/components/motion/FadeUp'

interface Stat {
  value: string
  label: string
  note?: string
}

const STATS: Stat[] = [
  { value: '3+',   label: 'Projects Shipped',   note: 'and growing' },
  { value: '100',  label: 'Lighthouse Score',    note: 'perfect score' },
  { value: '<2s',  label: 'Avg LCP',             note: 'real-world speed' },
  { value: '90+',  label: 'Performance Score',   note: 'all categories' },
]

export function StatsGrid() {
  return (
    <section
      aria-label="Agency statistics"
      className="border-y"
      style={{
        borderColor: 'var(--color-border)',
        padding: 'var(--s-16) var(--gutter)',
      }}
    >
      <div
        className="grid grid-cols-2 md:grid-cols-4 gap-px"
        style={{
          maxWidth: 'var(--max-w)',
          margin: '0 auto',
          backgroundColor: 'var(--color-border)',
          border: '1px solid var(--color-border)',
        }}
      >
        {STATS.map((stat, i) => (
          <FadeUp key={stat.label} delay={i * 80}>
            <div
              className="flex flex-col justify-between p-8"
              style={{ backgroundColor: 'var(--color-bg)' }}
            >
              <span
                className="font-display font-black block mb-2 leading-none"
                style={{ fontSize: 'var(--fs-3xl)', color: 'var(--color-text)' }}
              >
                {stat.value}
                <span style={{ color: 'var(--color-primary)' }}>.</span>
              </span>
              <div>
                <p
                  className="font-semibold text-sm"
                  style={{ color: 'var(--color-text)' }}
                >
                  {stat.label}
                </p>
                {stat.note && (
                  <p
                    className="text-xs mt-0.5"
                    style={{ color: 'var(--color-muted)' }}
                  >
                    {stat.note}
                  </p>
                )}
              </div>
            </div>
          </FadeUp>
        ))}
      </div>
    </section>
  )
}
