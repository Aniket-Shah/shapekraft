import { Marquee } from '@/components/motion/Marquee'

const ITEMS = [
  'WEBSITE DESIGN',
  'AI AUTOMATION',
  'PERFORMANCE BUILDS',
  'LANDING PAGES',
  'ENGINEERING',
  'CONVERSION',
]

export function MarqueeServices() {
  const separator = (
    <span
      className="mx-6 text-2xl font-black"
      style={{ color: 'var(--color-primary)' }}
      aria-hidden="true"
    >
      ·
    </span>
  )

  return (
    <section
      aria-label="Services marquee"
      className="py-8 border-y overflow-hidden"
      style={{ borderColor: 'var(--color-border)' }}
    >
      <Marquee speed={40}>
        {ITEMS.map((item) => (
          <span key={item} className="flex items-center shrink-0">
            <span
              className="font-display font-black tracking-widest uppercase"
              style={{
                fontSize: 'var(--fs-xl)',
                color: 'var(--color-muted)',
                paddingLeft: '1.5rem',
                paddingRight: '1.5rem',
              }}
            >
              {item}
            </span>
            {separator}
          </span>
        ))}
      </Marquee>
    </section>
  )
}
