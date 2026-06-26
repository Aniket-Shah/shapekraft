'use client'
import { useState, useEffect } from 'react'
import { Plus, Minus, CheckCircle2, Circle } from 'lucide-react'
import { getMarket, getCurrency, formatPrice, type Currency } from '@/lib/market'
import { FadeUp } from '@/components/motion/FadeUp'

// ── CONFIG: all pricing lives here — do not scatter ─────────────────────────
export const CONFIG = {
  whatsapp: {
    IN: '+919999999999', // UPDATE: your India WhatsApp number
    US: '+14155550000',  // UPDATE: your US/global WhatsApp number
  },
  services: [
    {
      id: 'website',
      label: 'Website Design & Development',
      description: 'Custom Next.js build, design system, CMS integration',
      priceINR: 80_000,
      priceUSD: 1_200,
    },
    {
      id: 'ai',
      label: 'AI Automation & Agents',
      description: 'LLM integrations, RAG pipelines, custom workflows',
      priceINR: 60_000,
      priceUSD: 900,
    },
    {
      id: 'performance',
      label: 'Performance Optimisation',
      description: 'Core Web Vitals audit, Lighthouse 100, sub-2s LCP',
      priceINR: 40_000,
      priceUSD: 600,
    },
    {
      id: 'webhook',
      label: 'Webhook & Integrations',
      description: 'Event systems, API orchestration, third-party pipelines',
      priceINR: 30_000,
      priceUSD: 450,
    },
  ],
  pageRate: { INR: 8_000, USD: 120 },
  basePages: 5,
  maxPages: 50,
  split: { design: 40, build: 30, launch: 30 },
} as const

interface Props {
  onRequestQuote?: (summary: string) => void
}

export function QuotationBuilder({ onRequestQuote }: Props) {
  const [currency, setCurrency] = useState<Currency>('USD')
  const [hostname, setHostname] = useState('')
  const [selected, setSelected] = useState<Set<string>>(new Set(['website']))
  const [pages, setPages] = useState<number>(CONFIG.basePages)

  useEffect(() => {
    const host = window.location.hostname
    setHostname(host)
    setCurrency(getCurrency(getMarket(host)))
  }, [])

  const getPrice = (s: (typeof CONFIG.services)[number]) =>
    currency === 'INR' ? s.priceINR : s.priceUSD

  const serviceTotal = CONFIG.services
    .filter((s) => selected.has(s.id))
    .reduce((sum, s) => sum + getPrice(s), 0)
  const pageTotal = pages * CONFIG.pageRate[currency]
  const total = serviceTotal + pageTotal

  const phaseDesign = Math.round((total * CONFIG.split.design) / 100)
  const phaseBuild = Math.round((total * CONFIG.split.build) / 100)
  const phaseLaunch = total - phaseDesign - phaseBuild

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function buildSummary(): string {
    const labels = CONFIG.services
      .filter((s) => selected.has(s.id))
      .map((s) => s.label)
      .join(', ')
    return `Hi ShapeKraft! I'd like a quote for: ${labels}. Pages: ${pages}. Estimate: ${formatPrice(total, currency)}. Please get in touch.`
  }

  function handleCTA() {
    if (selected.size === 0) return
    if (onRequestQuote) {
      onRequestQuote(buildSummary())
      return
    }
    // Default: WhatsApp deep link using market from hostname
    const number = hostname.endsWith('.in')
      ? CONFIG.whatsapp.IN.replace('+', '')
      : CONFIG.whatsapp.US.replace('+', '')
    window.open(
      `https://wa.me/${number}?text=${encodeURIComponent(buildSummary())}`,
      '_blank',
      'noopener,noreferrer',
    )
  }

  const hasSelection = selected.size > 0

  return (
    <section
      aria-labelledby="quote-heading"
      style={{ padding: 'clamp(3rem, 8vw, var(--s-24)) var(--gutter)' }}
    >
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>

        {/* ── Header ── */}
        <FadeUp>
          <span
            className="text-xs font-semibold tracking-widest uppercase block mb-4"
            style={{ color: 'var(--color-primary)' }}
          >
            Instant Estimate
          </span>
          <h1
            id="quote-heading"
            className="font-display font-black leading-tight tracking-tight mb-3"
            style={{ fontSize: 'var(--fs-3xl)', color: 'var(--color-text)' }}
          >
            Build your quote
          </h1>
          <p style={{ color: 'var(--color-muted)', fontSize: 'var(--fs-lg)', maxWidth: '520px' }}>
            Select services and page count for a live estimate. No forms, no waitlists.
          </p>
        </FadeUp>

        <div className="mt-14 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

          {/* ── LEFT: controls ── */}
          <div className="flex flex-col gap-8">

            {/* Services */}
            <FadeUp delay={100}>
              <h2
                className="text-xs font-semibold tracking-widest uppercase mb-4"
                style={{ color: 'var(--color-muted)' }}
              >
                Services
              </h2>
              <div className="flex flex-col gap-3" role="group" aria-label="Select services">
                {CONFIG.services.map((service) => {
                  const active = selected.has(service.id)
                  return (
                    <button
                      key={service.id}
                      onClick={() => toggle(service.id)}
                      className="flex items-start gap-4 p-5 text-left w-full transition-all duration-300"
                      style={{
                        backgroundColor: active
                          ? 'rgba(124, 58, 237, 0.06)'
                          : 'var(--color-surface)',
                        border: `1px solid ${active ? 'var(--color-primary)' : 'var(--color-border)'}`,
                        borderRadius: 'var(--radius-sm)',
                      }}
                      aria-pressed={active}
                    >
                      <span
                        className="mt-0.5 shrink-0"
                        style={{ color: active ? 'var(--color-primary)' : 'var(--color-border)' }}
                      >
                        {active ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <span
                            className="font-semibold text-sm"
                            style={{ color: 'var(--color-text)' }}
                          >
                            {service.label}
                          </span>
                          <span
                            className="font-mono text-sm shrink-0"
                            style={{
                              color: active ? 'var(--color-accent)' : 'var(--color-muted)',
                            }}
                          >
                            {formatPrice(getPrice(service), currency)}
                          </span>
                        </div>
                        <p className="text-xs mt-1" style={{ color: 'var(--color-muted)' }}>
                          {service.description}
                        </p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </FadeUp>

            {/* Page count stepper */}
            <FadeUp delay={200}>
              <h2
                className="text-xs font-semibold tracking-widest uppercase mb-4"
                style={{ color: 'var(--color-muted)' }}
              >
                Number of pages
              </h2>
              <div
                className="flex items-center justify-between p-5"
                style={{
                  backgroundColor: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-sm)',
                }}
              >
                <button
                  onClick={() => setPages((p) => Math.max(1, p - 1))}
                  disabled={pages <= 1}
                  className="flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200"
                  style={{
                    backgroundColor: pages <= 1 ? 'transparent' : 'rgba(124, 58, 237, 0.1)',
                    border: '1px solid var(--color-border)',
                    color: pages <= 1 ? 'var(--color-muted)' : 'var(--color-primary)',
                    cursor: pages <= 1 ? 'not-allowed' : 'pointer',
                  }}
                  aria-label="Remove a page"
                >
                  <Minus size={14} />
                </button>

                <div className="text-center">
                  <span
                    className="font-display font-black"
                    style={{ fontSize: 'var(--fs-2xl)', color: 'var(--color-text)' }}
                  >
                    {pages}
                  </span>
                  <span
                    className="block text-xs mt-0.5"
                    style={{ color: 'var(--color-muted)' }}
                  >
                    {pages === 1 ? 'page' : 'pages'}
                  </span>
                </div>

                <button
                  onClick={() => setPages((p) => Math.min(CONFIG.maxPages, p + 1))}
                  disabled={pages >= CONFIG.maxPages}
                  className="flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200"
                  style={{
                    backgroundColor:
                      pages >= CONFIG.maxPages ? 'transparent' : 'rgba(124, 58, 237, 0.1)',
                    border: `1px solid ${pages >= CONFIG.maxPages ? 'var(--color-border)' : 'var(--color-primary)'}`,
                    color:
                      pages >= CONFIG.maxPages ? 'var(--color-muted)' : 'var(--color-primary)',
                    cursor: pages >= CONFIG.maxPages ? 'not-allowed' : 'pointer',
                  }}
                  aria-label="Add a page"
                >
                  <Plus size={14} />
                </button>
              </div>
              <p className="text-xs mt-2" style={{ color: 'var(--color-muted)' }}>
                Per page: {formatPrice(CONFIG.pageRate[currency], currency)}
              </p>
            </FadeUp>
          </div>

          {/* ── RIGHT: estimate card ── */}
          <FadeUp delay={150}>
            <div
              className="sticky top-8 flex flex-col gap-6 p-8"
              style={{
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
              }}
            >
              {/* Total */}
              <div>
                <span
                  className="text-xs font-semibold tracking-widest uppercase block mb-2"
                  style={{ color: 'var(--color-muted)' }}
                >
                  Estimated total
                </span>
                {hasSelection ? (
                  <div
                    className="font-display font-black leading-none"
                    style={{ fontSize: 'var(--fs-3xl)', color: 'var(--color-text)' }}
                  >
                    {formatPrice(total, currency)}
                  </div>
                ) : (
                  <div
                    className="font-display font-bold"
                    style={{ fontSize: 'var(--fs-xl)', color: 'var(--color-muted)' }}
                  >
                    Select services
                  </div>
                )}
                <p className="text-xs mt-2" style={{ color: 'var(--color-muted)' }}>
                  Estimate only · final quote after discovery call
                </p>
              </div>

              {/* Payment split */}
              {hasSelection && (
                <div>
                  <div
                    className="p-4 flex flex-col gap-3"
                    style={{
                      backgroundColor: 'rgba(124, 58, 237, 0.04)',
                      border: '1px solid rgba(124, 58, 237, 0.15)',
                      borderRadius: 'var(--radius-sm)',
                    }}
                  >
                    <span
                      className="text-xs font-semibold tracking-wider uppercase"
                      style={{ color: 'var(--color-primary)' }}
                    >
                      Payment schedule
                    </span>
                    {[
                      { label: 'Design', pct: CONFIG.split.design, amount: phaseDesign },
                      { label: 'Build', pct: CONFIG.split.build, amount: phaseBuild },
                      { label: 'Launch', pct: CONFIG.split.launch, amount: phaseLaunch },
                    ].map((phase) => (
                      <div key={phase.label} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-1.5 h-1.5 rounded-full shrink-0"
                            style={{ backgroundColor: 'var(--color-primary)' }}
                          />
                          <span className="text-sm" style={{ color: 'var(--color-muted)' }}>
                            {phase.label} · {phase.pct}%
                          </span>
                        </div>
                        <span
                          className="font-mono text-sm font-semibold"
                          style={{ color: 'var(--color-text)' }}
                        >
                          {formatPrice(phase.amount, currency)}
                        </span>
                      </div>
                    ))}
                  </div>
                  {/* Visual split bar */}
                  <div className="flex gap-0.5 mt-3 overflow-hidden" style={{ height: '4px', borderRadius: '2px' }}>
                    <div
                      style={{
                        width: `${CONFIG.split.design}%`,
                        backgroundColor: 'var(--color-primary)',
                        borderRadius: '2px 0 0 2px',
                      }}
                    />
                    <div
                      style={{
                        width: `${CONFIG.split.build}%`,
                        backgroundColor: 'var(--color-accent)',
                      }}
                    />
                    <div
                      style={{
                        width: `${CONFIG.split.launch}%`,
                        backgroundColor: 'rgba(167, 139, 250, 0.35)',
                        borderRadius: '0 2px 2px 0',
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Line items */}
              {hasSelection && (
                <div
                  className="flex flex-col gap-2 pt-4"
                  style={{ borderTop: '1px solid var(--color-border)' }}
                >
                  {CONFIG.services
                    .filter((s) => selected.has(s.id))
                    .map((s) => (
                      <div key={s.id} className="flex items-center justify-between text-sm">
                        <span style={{ color: 'var(--color-muted)' }}>{s.label}</span>
                        <span className="font-mono" style={{ color: 'var(--color-text)' }}>
                          {formatPrice(getPrice(s), currency)}
                        </span>
                      </div>
                    ))}
                  <div className="flex items-center justify-between text-sm">
                    <span style={{ color: 'var(--color-muted)' }}>
                      {pages} {pages === 1 ? 'page' : 'pages'} ×{' '}
                      {formatPrice(CONFIG.pageRate[currency], currency)}
                    </span>
                    <span className="font-mono" style={{ color: 'var(--color-text)' }}>
                      {formatPrice(pageTotal, currency)}
                    </span>
                  </div>
                </div>
              )}

              {/* CTA */}
              <button
                onClick={handleCTA}
                disabled={!hasSelection}
                className="w-full py-4 font-semibold text-base transition-all duration-300 mt-2"
                style={{
                  backgroundColor: hasSelection ? 'var(--color-primary)' : 'var(--color-border)',
                  color: hasSelection ? 'var(--color-primary-fg)' : 'var(--color-muted)',
                  borderRadius: 'var(--radius-full)',
                  cursor: hasSelection ? 'pointer' : 'not-allowed',
                }}
                onMouseEnter={(e) => {
                  if (!hasSelection) return
                  e.currentTarget.style.backgroundColor = 'var(--color-accent)'
                  e.currentTarget.style.color = 'var(--color-bg)'
                }}
                onMouseLeave={(e) => {
                  if (!hasSelection) return
                  e.currentTarget.style.backgroundColor = 'var(--color-primary)'
                  e.currentTarget.style.color = 'var(--color-primary-fg)'
                }}
                aria-label={hasSelection ? 'Request quote via WhatsApp' : 'Select at least one service'}
              >
                {hasSelection ? 'Request Quote via WhatsApp →' : 'Select at least one service'}
              </button>

              <p className="text-center text-xs" style={{ color: 'var(--color-muted)' }}>
                No spam · We respond within one business day
              </p>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  )
}
