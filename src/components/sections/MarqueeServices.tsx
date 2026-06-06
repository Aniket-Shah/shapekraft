import { Marquee } from '@/components/motion/Marquee'

const ITEMS = [
  'WEBSITE DESIGN',
  'AI AUTOMATION',
  'PERFORMANCE BUILDS',
  'LANDING PAGES',
  'SAAS PRODUCTS',
  'WEBHOOK SYSTEMS',
  'ENGINEERING',
  'CONVERSION',
]

export function MarqueeServices() {
  const dot = (
    <span
      className="inline-block mx-6 w-1.5 h-1.5 rounded-full align-middle"
      style={{ backgroundColor: 'var(--color-primary)', opacity: 0.7 }}
      aria-hidden="true"
    />
  )

  return (
    <section
      aria-label="Services marquee"
      className="py-6 border-y overflow-hidden"
      style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg)' }}
    >
      <Marquee speed={38}>
        {ITEMS.map((item) => (
          <span key={item} className="inline-flex items-center shrink-0">
            <span
              className="font-display font-black tracking-widest uppercase"
              style={{
                fontSize: 'var(--fs-lg)',
                color: 'var(--color-muted)',
              }}
            >
              {item}
            </span>
            {dot}
          </span>
        ))}
      </Marquee>
    </section>
  )
}
