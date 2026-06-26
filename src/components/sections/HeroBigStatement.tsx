'use client'
import Link from 'next/link'
import { SplitText } from '@/components/motion/SplitText'
import { FadeUp } from '@/components/motion/FadeUp'
import { MagneticButton } from '@/components/motion/MagneticButton'

export function HeroBigStatement() {
  return (
    <section
      id="hero"
      className="relative flex flex-col justify-center min-h-screen overflow-hidden"
      style={{
        padding: 'calc(var(--s-16) + 4rem) var(--gutter) var(--s-16)',
      }}
      aria-label="Hero — ShapeKraft agency statement"
    >
      {/* Subtle grid background */}
      <GridBackground />

      {/* Accent gradient blob */}
      <div
        className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
        aria-hidden="true"
      />

      <div style={{ maxWidth: 'var(--max-w)', margin: '0 auto', width: '100%' }}>
        {/* Eyebrow */}
        <FadeUp delay={100}>
          <div className="flex items-center gap-3 mb-8">
            <span
              className="inline-block w-8 h-px"
              style={{ backgroundColor: 'var(--color-primary)' }}
              aria-hidden="true"
            />
            <span
              className="text-xs font-semibold tracking-widest uppercase"
              style={{ color: 'var(--color-muted)' }}
            >
              Digital Engineering Studio
            </span>
          </div>
        </FadeUp>

        {/* Headline — SplitText assembly reveal */}
        <h1
          className="font-display font-black leading-[0.92] tracking-tight"
          style={{ fontSize: 'var(--fs-hero)' }}
        >
          <SplitText
            text="We don't design"
            trigger="mount"
            stagger={0.03}
            duration={1.0}
            delay={0.3}
            className="block"
          />
          <SplitText
            text="websites. We"
            trigger="mount"
            stagger={0.03}
            duration={1.0}
            delay={0.55}
            className="block"
          />
          <span className="block" style={{ color: 'var(--color-primary)' }}>
            <SplitText
              text="engineer them."
              trigger="mount"
              stagger={0.03}
              duration={1.0}
              delay={0.8}
            />
          </span>
        </h1>

        {/* Subline */}
        <FadeUp delay={1400}>
          <p
            className="mt-8 max-w-lg leading-relaxed"
            style={{
              fontSize: 'var(--fs-lg)',
              color: 'var(--color-muted)',
            }}
          >
            Precision-built for companies that compete at the highest level.
            No templates. No shortcuts. Pure craft.
          </p>
        </FadeUp>

        {/* CTAs */}
        <FadeUp delay={1600}>
          <div className="flex flex-wrap items-center gap-4 mt-10">
            <MagneticButton>
              <Link
                href="#contact"
                className="px-10 py-5 rounded-full font-semibold text-base transition-all duration-300 inline-block"
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
              >
                Start a Project
              </Link>
            </MagneticButton>
            <Link
              href="#services"
              className="px-10 py-5 rounded-full font-semibold text-base border transition-all duration-300"
              style={{
                borderColor: 'var(--color-border)',
                color: 'var(--color-muted)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-accent)'
                e.currentTarget.style.color = 'var(--color-text)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-border)'
                e.currentTarget.style.color = 'var(--color-muted)'
              }}
            >
              See our work
            </Link>
          </div>
        </FadeUp>

        {/* Scroll indicator */}
        <FadeUp delay={2000}>
          <div className="flex items-center gap-3 mt-10 md:mt-20">
            <div
              className="relative flex items-center justify-center"
              style={{
                width: 24,
                height: 40,
                border: '1px solid var(--color-border)',
                borderRadius: 12,
                overflow: 'hidden',
              }}
              aria-hidden="true"
            >
              <div
                className="absolute"
                style={{
                  width: 3,
                  height: 7,
                  borderRadius: 2,
                  backgroundColor: 'var(--color-accent)',
                  top: 6,
                  animation: 'scrollDot 2s ease-in-out infinite',
                }}
              />
            </div>
            <span
              className="text-xs tracking-widest uppercase"
              style={{ color: 'var(--color-muted)' }}
            >
              Scroll
            </span>
          </div>
        </FadeUp>
      </div>
    </section>
  )
}

function GridBackground() {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        backgroundImage: `
          linear-gradient(var(--color-border) 1px, transparent 1px),
          linear-gradient(90deg, var(--color-border) 1px, transparent 1px)
        `,
        backgroundSize: '80px 80px',
        opacity: 0.3,
        maskImage: 'radial-gradient(ellipse 70% 60% at 50% 50%, black 30%, transparent 100%)',
      }}
      aria-hidden="true"
    />
  )
}
