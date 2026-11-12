import Link from 'next/link'
import { SchemaOrg } from '@/components/SchemaOrg'
import { faqSchema, type Faq } from '@/lib/faq'

interface Props {
  items: Faq[]
  /** Show the "get an instant quote" link (off on the quote page itself). */
  showQuoteLink?: boolean
}

// Server component: native <details>, so the answers are in the HTML for
// crawlers and work with JavaScript off.
export function FAQSection({ items, showQuoteLink = true }: Props) {
  return (
    <section
      id="faq"
      className="theme-cream"
      aria-labelledby="faq-heading"
      style={{ padding: 'clamp(3rem, 8vw, var(--s-24)) var(--gutter)' }}
    >
      <SchemaOrg schema={faqSchema(items)} />
      <div style={{ maxWidth: 'var(--max-w)', margin: '0 auto' }}>
        <span
          className="text-xs font-semibold tracking-widest uppercase block mb-3"
          style={{ color: 'var(--color-primary-ink)' }}
        >
          FAQ
        </span>
        <h2
          id="faq-heading"
          className="font-display font-black tracking-tight leading-tight mb-8 md:mb-12"
          // The display face is very wide: scale with the viewport so long words
          // like "ownership" fit on a phone instead of running off the screen.
          style={{
            fontSize: 'clamp(1.75rem, 7vw, var(--fs-3xl))',
            color: 'var(--color-text)',
            overflowWrap: 'break-word',
          }}
        >
          Website cost, payment &amp; ownership
        </h2>

        <div style={{ borderTop: '1px solid var(--color-border)' }}>
          {items.map(({ q, a }) => (
            <details
              key={q}
              className="group"
              style={{ borderBottom: '1px solid var(--color-border)' }}
            >
              <summary
                className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 font-semibold [&::-webkit-details-marker]:hidden"
                style={{ fontSize: 'var(--fs-lg)', color: 'var(--color-text)' }}
              >
                <h3 className="font-semibold" style={{ fontSize: 'inherit' }}>{q}</h3>
                <span
                  aria-hidden="true"
                  className="shrink-0 font-mono text-xl transition-transform duration-200 group-open:rotate-45"
                  style={{ color: 'var(--color-primary-ink)' }}
                >
                  +
                </span>
              </summary>
              <p
                className="max-w-3xl pb-6 leading-relaxed"
                style={{ color: 'var(--color-muted)' }}
              >
                {a}
              </p>
            </details>
          ))}
        </div>

        {showQuoteLink && (
          <p className="mt-10">
            <Link
              href="/quote"
              className="font-semibold underline underline-offset-4"
              style={{ color: 'var(--color-primary-ink)' }}
            >
              Use the website cost calculator for an instant quote →
            </Link>
          </p>
        )}
      </div>
    </section>
  )
}
