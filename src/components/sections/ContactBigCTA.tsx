'use client'
import { FadeUp } from '@/components/motion/FadeUp'
import { MagneticButton } from '@/components/motion/MagneticButton'

export function ContactBigCTA() {
  return (
    <section
      id="contact"
      className="relative overflow-hidden"
      style={{ padding: 'var(--s-24) var(--gutter)' }}
      aria-labelledby="contact-heading"
    >
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(124,58,237,0.08) 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      <div
        className="relative text-center"
        style={{ maxWidth: '900px', margin: '0 auto' }}
      >
        <FadeUp>
          <span
            className="text-xs font-semibold tracking-widest uppercase block mb-6"
            style={{ color: 'var(--color-primary)' }}
          >
            Ready to build?
          </span>
        </FadeUp>

        <FadeUp delay={100}>
          <h2
            id="contact-heading"
            className="font-display font-black leading-none tracking-tight mb-8"
            style={{ fontSize: 'var(--fs-hero)', color: 'var(--color-text)' }}
          >
            START A{' '}
            <span style={{ color: 'var(--color-primary)' }}>PROJECT</span>
          </h2>
        </FadeUp>

        <FadeUp delay={200}>
          <p
            className="mb-12 mx-auto max-w-md"
            style={{ fontSize: 'var(--fs-lg)', color: 'var(--color-muted)', lineHeight: 1.6 }}
          >
            Tell us what you&apos;re building. We&apos;ll tell you how we&apos;ll engineer it.
          </p>
        </FadeUp>

        <FadeUp delay={300}>
          <MagneticButton strength={0.2} className="inline-block">
            <a
              href="mailto:hello@shapekraft.co"
              className="group relative inline-flex items-center gap-3 px-10 py-5 rounded-full font-semibold text-lg transition-all duration-300 overflow-hidden"
              style={{
                backgroundColor: 'var(--color-primary)',
                color: 'var(--color-primary-fg)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-accent)'
                e.currentTarget.style.color = 'var(--color-bg)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-primary)'
                e.currentTarget.style.color = 'var(--color-primary-fg)'
              }}
              aria-label="Send us an email at hello@shapekraft.co"
            >
              <span>hello@shapekraft.co</span>
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                aria-hidden="true"
                className="transition-transform duration-300 group-hover:translate-x-1"
              >
                <path
                  d="M4 10h12M11 5l5 5-5 5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </MagneticButton>
        </FadeUp>

        {/* Response time note */}
        <FadeUp delay={400}>
          <p
            className="mt-8 text-sm"
            style={{ color: 'var(--color-muted)' }}
          >
            We typically respond within 24 hours.
          </p>
        </FadeUp>
      </div>
    </section>
  )
}
