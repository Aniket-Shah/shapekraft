import { FadeUp } from '@/components/motion/FadeUp'
import { TestimonialSlider } from '@/components/sections/TestimonialSlider'
import { TESTIMONIALS, type Testimonial } from '@/lib/testimonials'

// Live preview of the site we built. Wide screens only: an iframe is heavy on a phone,
// so small screens get the link in the caption instead. The frame is not interactive;
// a link laid over it opens the real site.
function SitePreview({ t }: { t: Testimonial }) {
  if (!t.site) return null
  return (
    <div className="site-preview hidden md:block">
      <div className="site-preview__bar" aria-hidden="true">
        <span className="site-preview__dot" />
        <span className="site-preview__dot" />
        <span className="site-preview__dot" />
        <span className="site-preview__host">{t.site.label}</span>
      </div>
      <div className="site-preview__viewport">
        <iframe
          src={t.site.url}
          title={`Live preview of the website built for ${t.name}`}
          loading="lazy"
          tabIndex={-1}
          sandbox="allow-scripts allow-same-origin"
          referrerPolicy="no-referrer"
        />
        <a
          href={t.site.url}
          target="_blank"
          rel="noopener noreferrer"
          className="site-preview__link"
          aria-label={`Open the live website built for ${t.name} (opens in a new tab)`}
        />
      </div>
    </div>
  )
}

function Card({ t }: { t: Testimonial }) {
  const large = t.size === 'large'
  return (
    <figure
      className={
        'glass-card grid h-full gap-8 p-7 md:p-10 ' +
        (t.site ? 'md:grid-cols-2 md:items-center md:gap-12' : '')
      }
    >
      <SitePreview t={t} />
      <div className="flex h-full flex-col justify-between gap-8">
      <div>
        <span
          aria-hidden="true"
          className="font-display block font-black leading-none"
          style={{ fontSize: 'var(--fs-3xl)', color: 'var(--color-primary-ink)', height: '0.55em' }}
        >
          &ldquo;
        </span>
        <blockquote
          className={
            large
              ? 'font-display font-bold leading-snug tracking-tight text-[length:var(--fs-xl)]'
              : 'leading-relaxed text-[length:var(--fs-base)] md:text-[length:var(--fs-lg)]'
          }
          style={{ color: 'var(--color-text)' }}
        >
          <p>{t.quote}</p>
        </blockquote>
      </div>

      <figcaption className="flex items-center gap-4">
        <span
          aria-hidden="true"
          className="font-display flex h-12 w-12 shrink-0 items-center justify-center rounded-full font-black"
          style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-primary-fg)' }}
        >
          {t.name.charAt(0)}
        </span>
        <span className="flex flex-col">
          <cite className="font-semibold not-italic" style={{ color: 'var(--color-text)' }}>
            {t.name}
          </cite>
          <span className="text-sm" style={{ color: 'var(--color-muted)' }}>
            {t.context}
          </span>
          {t.site && (
            <a
              href={t.site.url}
              target="_blank"
              rel="noopener noreferrer"
              className="link-underline mt-1 w-fit text-sm font-semibold"
              style={{ color: 'var(--color-primary-ink)' }}
            >
              View live site
              <span aria-hidden="true"> ↗</span>
              <span className="sr-only"> for {t.name} (opens in a new tab)</span>
            </a>
          )}
        </span>
      </figcaption>
      </div>
    </figure>
  )
}

// The cards are rendered on the server, so every quote is in the HTML.
// Only the fade-in and the slider controls are client-side.
export function Testimonials() {
  if (TESTIMONIALS.length === 0) return null

  return (
    <section
      id="testimonials"
      aria-labelledby="testimonials-heading"
      className="relative overflow-hidden"
      style={{ padding: 'clamp(3rem, 8vw, var(--s-24)) var(--gutter)' }}
    >
      {/* Soft colour behind the cards so the glass has something to blur */}
      <div aria-hidden="true" className="glass-glow glass-glow--teal" />
      <div aria-hidden="true" className="glass-glow glass-glow--cream" />

      <div className="relative" style={{ maxWidth: 'var(--max-w)', margin: '0 auto' }}>
        <span
          className="text-xs font-semibold tracking-widest uppercase block mb-3"
          style={{ color: 'var(--color-primary-ink)' }}
        >
          Client words
        </span>
        <h2
          id="testimonials-heading"
          className="font-display font-black tracking-tight leading-tight mb-8 md:mb-12"
          style={{
            fontSize: 'clamp(1.75rem, 7vw, var(--fs-3xl))',
            color: 'var(--color-text)',
            overflowWrap: 'break-word',
          }}
        >
          What clients say
        </h2>

        <FadeUp>
          <TestimonialSlider slides={TESTIMONIALS.map((t) => <Card key={t.name} t={t} />)} />
        </FadeUp>
      </div>
    </section>
  )
}
