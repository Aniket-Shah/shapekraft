'use client'
import { useState, useEffect } from 'react'
import { Plus, Minus, CheckCircle2, Circle, Download, MessageSquare } from 'lucide-react'
import { getMarket, getCurrency, formatPrice, type Currency } from '@/lib/market'
import { FadeUp } from '@/components/motion/FadeUp'

// ── CONFIG: all pricing lives here — do not scatter ─────────────────────────
export const CONFIG = {
  whatsapp: {
    IN: '+919999999999', // UPDATE: your India WhatsApp number
    US: '+14155550000',  // UPDATE: your US/global WhatsApp number
  },
  packages: [
    {
      id: 'basic',
      tier: 'Basic',
      label: 'Landing Page',
      description: 'Responsive single-page site, contact form, basic SEO',
      priceINR: 12_000,
      priceUSD: 175,
    },
    {
      id: 'pro',
      tier: 'Pro',
      label: 'Landing Page',
      description: 'Multi-section, scroll animations, CMS integration, SEO',
      priceINR: 25_000,
      priceUSD: 350,
    },
    {
      id: 'advanced',
      tier: 'Advanced',
      label: 'Landing Page',
      description: 'Fully custom build, design system, complex interactions',
      priceINR: 40_000,
      priceUSD: 550,
    },
    {
      id: 'b2b',
      tier: 'B2B',
      label: 'Business',
      description: 'Enterprise site with dedicated collab call support, proposals & decks included',
      priceINR: 35_000,
      priceUSD: 500,
    },
  ],
  addons: [
    {
      id: 'ai',
      label: 'AI Automation & Agents',
      description: 'LLM integrations, RAG pipelines, custom workflows',
      priceINR: 25_000,
      priceUSD: 350,
    },
    {
      id: 'performance',
      label: 'Performance Optimisation',
      description: 'Core Web Vitals audit, Lighthouse 100, sub-2s LCP',
      priceINR: 15_000,
      priceUSD: 200,
    },
    {
      id: 'webhook',
      label: 'Webhook & Integrations',
      description: 'Event systems, API orchestration, third-party pipelines',
      priceINR: 10_000,
      priceUSD: 150,
    },
  ],
  pageRate: { INR: 2_000, USD: 30 },
  basePages: 5,
  maxPages: 50,
  split: { design: 40, build: 30, launch: 30 },
} as const

const TIER_BADGE: Record<string, { color: string; bg: string }> = {
  Basic:    { color: 'var(--color-muted)',   bg: 'rgba(255,255,255,0.05)' },
  Pro:      { color: 'var(--color-primary)', bg: 'rgba(124,58,237,0.10)' },
  Advanced: { color: 'var(--color-accent)',  bg: 'rgba(124,58,237,0.15)' },
  B2B:      { color: 'var(--color-text)',    bg: 'rgba(255,255,255,0.08)' },
}

interface Props {
  onRequestQuote?: (summary: string) => void
}

export function QuotationBuilder({ onRequestQuote }: Props) {
  const [currency, setCurrency] = useState<Currency>('USD')
  const [hostname, setHostname] = useState('')
  const [selectedPackage, setSelectedPackage] = useState<string | null>('basic')
  const [selectedAddons, setSelectedAddons] = useState<Set<string>>(new Set())
  const [pages, setPages] = useState<number>(CONFIG.basePages)
  const [negotiationNote, setNegotiationNote] = useState('')
  const [showNegotiation, setShowNegotiation] = useState(false)

  useEffect(() => {
    const host = window.location.hostname
    setHostname(host)
    fetch('https://api.country.is/')
      .then((r) => r.json())
      .then((data: { ip: string; country: string }) => {
        setCurrency(data.country === 'IN' ? 'INR' : 'USD')
      })
      .catch(() => {
        setCurrency(getCurrency(getMarket(host)))
      })
  }, [])

  const showPages = selectedPackage !== null

  const getPkgPrice = (p: (typeof CONFIG.packages)[number]) =>
    currency === 'INR' ? p.priceINR : p.priceUSD
  const getAddonPrice = (a: (typeof CONFIG.addons)[number]) =>
    currency === 'INR' ? a.priceINR : a.priceUSD

  const activePkg = CONFIG.packages.find((p) => p.id === selectedPackage) ?? null
  const pkgPrice = activePkg ? getPkgPrice(activePkg) : 0
  const addonTotal = CONFIG.addons
    .filter((a) => selectedAddons.has(a.id))
    .reduce((sum, a) => sum + getAddonPrice(a), 0)
  const pageTotal = showPages ? pages * CONFIG.pageRate[currency] : 0
  const total = pkgPrice + addonTotal + pageTotal

  const phaseDesign = Math.round((total * CONFIG.split.design) / 100)
  const phaseBuild = Math.round((total * CONFIG.split.build) / 100)
  const phaseLaunch = total - phaseDesign - phaseBuild

  function toggleAddon(id: string) {
    setSelectedAddons((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function pkgDisplayName(p: (typeof CONFIG.packages)[number]): string {
    return p.tier === 'B2B' ? 'Business B2B' : `${p.label} — ${p.tier}`
  }

  function buildSummary(): string {
    const lines: string[] = []
    if (activePkg) lines.push(pkgDisplayName(activePkg))
    CONFIG.addons.filter((a) => selectedAddons.has(a.id)).forEach((a) => lines.push(a.label))
    let msg = `Hi ShapeKraft! I'd like a quote for: ${lines.join(', ')}.`
    if (showPages) msg += ` Pages: ${pages}.`
    msg += ` Estimate: ${formatPrice(total, currency)}.`
    if (negotiationNote.trim()) msg += ` Note: ${negotiationNote.trim()}`
    msg += ` Please get in touch.`
    return msg
  }

  function handleCTA() {
    if (!hasSelection) return
    if (onRequestQuote) { onRequestQuote(buildSummary()); return }
    const number = hostname.endsWith('.in')
      ? CONFIG.whatsapp.IN.replace('+', '')
      : CONFIG.whatsapp.US.replace('+', '')
    window.open(
      `https://wa.me/${number}?text=${encodeURIComponent(buildSummary())}`,
      '_blank',
      'noopener,noreferrer',
    )
  }

  function handlePDF() {
    if (!hasSelection) return
    const pkgRow = activePkg
      ? `<tr><td>${pkgDisplayName(activePkg)}</td><td style="text-align:right;font-family:monospace">${formatPrice(getPkgPrice(activePkg), currency)}</td></tr>`
      : ''
    const addonRows = CONFIG.addons
      .filter((a) => selectedAddons.has(a.id))
      .map((a) => `<tr><td>${a.label}</td><td style="text-align:right;font-family:monospace">${formatPrice(getAddonPrice(a), currency)}</td></tr>`)
      .join('')
    const pageRow = showPages
      ? `<tr><td>${pages} page${pages !== 1 ? 's' : ''} × ${formatPrice(CONFIG.pageRate[currency], currency)}</td><td style="text-align:right;font-family:monospace">${formatPrice(pageTotal, currency)}</td></tr>`
      : ''
    const noteBlock = negotiationNote.trim()
      ? `<p class="label">Notes / Budget</p><div class="custom-note">${negotiationNote.trim()}</div>`
      : ''
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>ShapeKraft Quote</title><style>
      *{box-sizing:border-box;margin:0;padding:0}
      body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#0a0a0a;max-width:600px;margin:48px auto;padding:0 24px}
      h1{font-size:22px;font-weight:900;letter-spacing:-.02em;margin-bottom:2px}
      .date{font-size:13px;color:#666;margin-bottom:36px}
      .label{font-size:10px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#888;margin:24px 0 10px}
      table{width:100%;border-collapse:collapse}
      td{padding:9px 0;border-bottom:1px solid #eee;font-size:14px;color:#111}
      .total{font-size:32px;font-weight:900;letter-spacing:-.02em;margin:8px 0 4px;font-family:monospace}
      .note{font-size:12px;color:#888}
      .phase{display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #eee;font-size:14px}
      .custom-note{font-size:14px;color:#333;line-height:1.6;background:#f8f8f8;padding:12px;border-radius:6px}
      .footer{margin-top:40px;font-size:11px;color:#aaa;border-top:1px solid #eee;padding-top:16px}
      @media print{body{margin:24px auto}}
    </style></head><body>
      <h1>ShapeKraft</h1>
      <p class="date">Project Estimate · ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
      <p class="label">Services</p>
      <table>${pkgRow}${addonRows}${pageRow}</table>
      <p class="label">Estimated Total</p>
      <div class="total">${formatPrice(total, currency)}</div>
      <p class="note">Estimate only · final quote confirmed after discovery call</p>
      <p class="label">Payment Schedule</p>
      <div class="phase"><span>Design · ${CONFIG.split.design}%</span><span style="font-family:monospace">${formatPrice(phaseDesign, currency)}</span></div>
      <div class="phase"><span>Build · ${CONFIG.split.build}%</span><span style="font-family:monospace">${formatPrice(phaseBuild, currency)}</span></div>
      <div class="phase"><span>Launch · ${CONFIG.split.launch}%</span><span style="font-family:monospace">${formatPrice(phaseLaunch, currency)}</span></div>
      ${noteBlock}
      <div class="footer">Generated by ShapeKraft · shapekraft.co</div>
    </body></html>`
    const iframe = document.createElement('iframe')
    iframe.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:1px;height:1px;'
    document.body.appendChild(iframe)
    const doc = iframe.contentDocument
    if (!doc) { document.body.removeChild(iframe); return }
    doc.write(html)
    doc.close()
    iframe.contentWindow?.focus()
    iframe.contentWindow?.print()
    setTimeout(() => document.body.removeChild(iframe), 2000)
  }

  const hasSelection = selectedPackage !== null || selectedAddons.size > 0

  return (
    <section
      aria-labelledby="quote-heading"
      style={{ padding: 'clamp(3rem, 8vw, var(--s-24)) var(--gutter)' }}
    >
      <div style={{ maxWidth: '960px', margin: '0 auto' }}>

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
            Pick a package, add services, get a live estimate. No forms, no waitlists.
          </p>
        </FadeUp>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-start">

          {/* ── LEFT: controls ── */}
          <div className="flex flex-col gap-8">

            {/* PACKAGES — radio group */}
            <FadeUp delay={100}>
              <h2
                className="text-xs font-semibold tracking-widest uppercase mb-4"
                style={{ color: 'var(--color-muted)' }}
              >
                Choose a package
              </h2>
              <div className="flex flex-col gap-3" role="radiogroup" aria-label="Choose a website package">
                {CONFIG.packages.map((pkg) => {
                  const active = selectedPackage === pkg.id
                  const badge = TIER_BADGE[pkg.tier] ?? TIER_BADGE.Basic
                  return (
                    <button
                      key={pkg.id}
                      role="radio"
                      aria-checked={active}
                      onClick={() => setSelectedPackage(active ? null : pkg.id)}
                      className="flex items-start gap-3 sm:gap-4 p-4 sm:p-5 text-left w-full transition-all duration-300"
                      style={{
                        backgroundColor: active ? 'rgba(124, 58, 237, 0.06)' : 'var(--color-surface)',
                        border: `1px solid ${active ? 'var(--color-primary)' : 'var(--color-border)'}`,
                        borderRadius: 'var(--radius-sm)',
                      }}
                    >
                      {/* Radio dot */}
                      <span
                        className="shrink-0 flex items-center justify-center"
                        style={{
                          width: 18,
                          height: 18,
                          minWidth: 18,
                          borderRadius: '50%',
                          border: `2px solid ${active ? 'var(--color-primary)' : 'var(--color-border)'}`,
                          marginTop: 2,
                          transition: 'border-color 0.2s',
                        }}
                      >
                        {active && (
                          <span
                            style={{
                              width: 8,
                              height: 8,
                              borderRadius: '50%',
                              backgroundColor: 'var(--color-primary)',
                              display: 'block',
                            }}
                          />
                        )}
                      </span>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-sm" style={{ color: 'var(--color-text)' }}>
                              {pkg.tier === 'B2B' ? 'Business B2B' : pkg.label}
                            </span>
                            <span
                              className="font-semibold"
                              style={{
                                fontSize: '10px',
                                letterSpacing: '0.07em',
                                textTransform: 'uppercase',
                                color: badge.color,
                                backgroundColor: badge.bg,
                                padding: '2px 7px',
                                borderRadius: 4,
                              }}
                            >
                              {pkg.tier === 'B2B' ? 'Call Support' : pkg.tier}
                            </span>
                          </div>
                          <span
                            className="font-mono text-sm shrink-0"
                            style={{ color: active ? 'var(--color-accent)' : 'var(--color-muted)' }}
                          >
                            {formatPrice(getPkgPrice(pkg), currency)}
                          </span>
                        </div>
                        <p className="text-xs mt-1.5" style={{ color: 'var(--color-muted)', lineHeight: 1.5 }}>
                          {pkg.description}
                        </p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </FadeUp>

            {/* ADD-ONS — checkbox group */}
            <FadeUp delay={150}>
              <h2
                className="text-xs font-semibold tracking-widest uppercase mb-4"
                style={{ color: 'var(--color-muted)' }}
              >
                Add-ons
              </h2>
              <div className="flex flex-col gap-3" role="group" aria-label="Select add-on services">
                {CONFIG.addons.map((addon) => {
                  const active = selectedAddons.has(addon.id)
                  return (
                    <button
                      key={addon.id}
                      onClick={() => toggleAddon(addon.id)}
                      className="flex items-start gap-3 sm:gap-4 p-4 sm:p-5 text-left w-full transition-all duration-300"
                      style={{
                        backgroundColor: active ? 'rgba(124, 58, 237, 0.06)' : 'var(--color-surface)',
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
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-semibold text-sm" style={{ color: 'var(--color-text)' }}>
                            {addon.label}
                          </span>
                          <span
                            className="font-mono text-sm shrink-0"
                            style={{ color: active ? 'var(--color-accent)' : 'var(--color-muted)' }}
                          >
                            {formatPrice(getAddonPrice(addon), currency)}
                          </span>
                        </div>
                        <p className="text-xs mt-1.5" style={{ color: 'var(--color-muted)', lineHeight: 1.5 }}>
                          {addon.description}
                        </p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </FadeUp>

            {/* PAGE STEPPER — only when a package is selected */}
            {showPages && (
              <FadeUp delay={200}>
                <h2
                  className="text-xs font-semibold tracking-widest uppercase mb-4"
                  style={{ color: 'var(--color-muted)' }}
                >
                  Number of pages
                </h2>
                <div
                  className="flex items-center justify-between p-4 sm:p-5"
                  style={{
                    backgroundColor: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-sm)',
                  }}
                >
                  <button
                    onClick={() => setPages((p) => Math.max(1, p - 1))}
                    disabled={pages <= 1}
                    className="flex items-center justify-center rounded-full transition-all duration-200"
                    style={{
                      width: 44,
                      height: 44,
                      backgroundColor: pages <= 1 ? 'transparent' : 'rgba(124, 58, 237, 0.1)',
                      border: '1px solid var(--color-border)',
                      color: pages <= 1 ? 'var(--color-muted)' : 'var(--color-primary)',
                      cursor: pages <= 1 ? 'not-allowed' : 'pointer',
                    }}
                    aria-label="Remove a page"
                  >
                    <Minus size={16} />
                  </button>
                  <div className="text-center">
                    <span
                      className="font-display font-black"
                      style={{ fontSize: 'var(--fs-2xl)', color: 'var(--color-text)' }}
                    >
                      {pages}
                    </span>
                    <span className="block text-xs mt-0.5" style={{ color: 'var(--color-muted)' }}>
                      {pages === 1 ? 'page' : 'pages'}
                    </span>
                  </div>
                  <button
                    onClick={() => setPages((p) => Math.min(CONFIG.maxPages, p + 1))}
                    disabled={pages >= CONFIG.maxPages}
                    className="flex items-center justify-center rounded-full transition-all duration-200"
                    style={{
                      width: 44,
                      height: 44,
                      backgroundColor: pages >= CONFIG.maxPages ? 'transparent' : 'rgba(124, 58, 237, 0.1)',
                      border: `1px solid ${pages >= CONFIG.maxPages ? 'var(--color-border)' : 'var(--color-primary)'}`,
                      color: pages >= CONFIG.maxPages ? 'var(--color-muted)' : 'var(--color-primary)',
                      cursor: pages >= CONFIG.maxPages ? 'not-allowed' : 'pointer',
                    }}
                    aria-label="Add a page"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <p className="text-xs mt-2" style={{ color: 'var(--color-muted)' }}>
                  Per page: {formatPrice(CONFIG.pageRate[currency], currency)}
                </p>
              </FadeUp>
            )}
          </div>

          {/* ── RIGHT: estimate card ── */}
          <FadeUp delay={200}>
            <div
              className="lg:sticky lg:top-24 flex flex-col gap-5 p-6 sm:p-8"
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
                    style={{
                      fontSize: 'clamp(2rem, 8vw, var(--fs-3xl))',
                      color: 'var(--color-text)',
                    }}
                  >
                    {formatPrice(total, currency)}
                  </div>
                ) : (
                  <div
                    className="font-display font-bold"
                    style={{ fontSize: 'var(--fs-xl)', color: 'var(--color-muted)' }}
                  >
                    Select a package
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
                      { label: 'Design', pct: 40, amount: phaseDesign },
                      { label: 'Build', pct: 30, amount: phaseBuild },
                      { label: 'Launch', pct: 30, amount: phaseLaunch },
                    ].map((phase) => (
                      <div key={phase.label} className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 min-w-0">
                          <div
                            style={{
                              width: 7,
                              height: 7,
                              minWidth: 7,
                              borderRadius: '50%',
                              backgroundColor: 'var(--color-primary)',
                            }}
                          />
                          <span className="text-sm" style={{ color: 'var(--color-muted)' }}>
                            {phase.label} · {phase.pct}%
                          </span>
                        </div>
                        <span
                          className="font-mono text-sm font-semibold shrink-0"
                          style={{ color: 'var(--color-text)' }}
                        >
                          {formatPrice(phase.amount, currency)}
                        </span>
                      </div>
                    ))}
                  </div>
                  {/* Split bar */}
                  <div
                    className="flex mt-3 overflow-hidden"
                    style={{ height: '4px', borderRadius: '2px', gap: '2px' }}
                  >
                    <div style={{ width: '40%', backgroundColor: 'var(--color-primary)', borderRadius: '2px 0 0 2px' }} />
                    <div style={{ width: '30%', backgroundColor: 'var(--color-accent)' }} />
                    <div style={{ width: '30%', backgroundColor: 'rgba(167,139,250,0.35)', borderRadius: '0 2px 2px 0' }} />
                  </div>
                </div>
              )}

              {/* Line items */}
              {hasSelection && (
                <div
                  className="flex flex-col gap-2 pt-3"
                  style={{ borderTop: '1px solid var(--color-border)' }}
                >
                  {activePkg && (
                    <div className="flex items-center justify-between text-sm">
                      <span style={{ color: 'var(--color-muted)' }}>{pkgDisplayName(activePkg)}</span>
                      <span className="font-mono" style={{ color: 'var(--color-text)' }}>
                        {formatPrice(pkgPrice, currency)}
                      </span>
                    </div>
                  )}
                  {CONFIG.addons
                    .filter((a) => selectedAddons.has(a.id))
                    .map((a) => (
                      <div key={a.id} className="flex items-center justify-between text-sm">
                        <span style={{ color: 'var(--color-muted)' }}>{a.label}</span>
                        <span className="font-mono" style={{ color: 'var(--color-text)' }}>
                          {formatPrice(getAddonPrice(a), currency)}
                        </span>
                      </div>
                    ))}
                  {showPages && (
                    <div className="flex items-center justify-between text-sm">
                      <span style={{ color: 'var(--color-muted)' }}>
                        {pages} {pages === 1 ? 'page' : 'pages'} ×{' '}
                        {formatPrice(CONFIG.pageRate[currency], currency)}
                      </span>
                      <span className="font-mono" style={{ color: 'var(--color-text)' }}>
                        {formatPrice(pageTotal, currency)}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Negotiate */}
              {hasSelection && (
                <div>
                  <button
                    onClick={() => setShowNegotiation((n) => !n)}
                    className="flex items-center gap-2 text-sm transition-colors duration-200"
                    style={{ color: 'var(--color-muted)' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-text)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-muted)')}
                  >
                    <MessageSquare size={14} />
                    {showNegotiation ? 'Hide note' : 'Have a budget in mind? Add a note'}
                  </button>
                  {showNegotiation && (
                    <textarea
                      value={negotiationNote}
                      onChange={(e) => setNegotiationNote(e.target.value)}
                      placeholder="E.g. My budget is ₹20,000 — can we work something out?"
                      rows={3}
                      className="w-full mt-3 p-3 text-sm resize-none"
                      style={{
                        backgroundColor: 'var(--color-bg)',
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-sm)',
                        color: 'var(--color-text)',
                        outline: 'none',
                      }}
                    />
                  )}
                </div>
              )}

              {/* Primary CTA */}
              <button
                onClick={handleCTA}
                disabled={!hasSelection}
                className="w-full py-4 font-semibold text-base transition-all duration-300"
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
                aria-label={hasSelection ? 'Request quote via WhatsApp' : 'Select a package to continue'}
              >
                {hasSelection ? 'Request Quote via WhatsApp →' : 'Select a package to continue'}
              </button>

              {/* PDF download */}
              {hasSelection && (
                <button
                  onClick={handlePDF}
                  className="flex items-center justify-center gap-2 w-full py-3 text-sm font-medium transition-all duration-200"
                  style={{
                    backgroundColor: 'transparent',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-full)',
                    color: 'var(--color-muted)',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--color-text)'
                    e.currentTarget.style.color = 'var(--color-text)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--color-border)'
                    e.currentTarget.style.color = 'var(--color-muted)'
                  }}
                >
                  <Download size={14} />
                  Download as PDF
                </button>
              )}

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
