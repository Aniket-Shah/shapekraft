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
      label: 'Basic Website',
      description: 'A clean, fast site that looks great on every device. Includes a contact form and the basics to get found on Google.',
      priceINR: 8_000,
      priceUSD: 110,
    },
    {
      id: 'pro',
      tier: 'Pro',
      label: 'Pro Website',
      description: 'Multiple sections, smooth animations, a blog or portfolio you can update yourself, and better SEO out of the box.',
      priceINR: 25_000,
      priceUSD: 350,
    },
    {
      id: 'advanced',
      tier: 'Advanced',
      label: 'Advanced Website',
      description: 'Built from scratch to match your brand exactly — your own design system, custom interactions, no templates.',
      priceINR: 40_000,
      priceUSD: 550,
    },
    {
      id: 'b2b',
      tier: 'B2B',
      label: 'Business B2B',
      description: 'We hop on calls, understand your business, build the site, and handle proposals, decks, and AMC. Pricing depends on scope.',
      priceINR: 0,
      priceUSD: 0,
    },
  ],
  addons: [
    {
      id: 'ai',
      label: 'AI Automation & Agents',
      description: 'Hook AI into your product — automate the repetitive stuff, build smart workflows, stop doing things manually.',
      priceINR: 25_000,
      priceUSD: 350,
    },
    {
      id: 'performance',
      label: 'Performance Optimisation',
      description: 'Make your site noticeably faster. Better Google scores, lower bounce rate, happier users.',
      priceINR: 10_000,
      priceUSD: 150,
    },
    {
      id: 'webhook',
      label: 'Webhook & Integrations',
      description: 'Connect the tools you already use — CRMs, payment gateways, email, anything. They talk to each other so you don\'t have to.',
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

export function QuotationBuilder() {
  const [currency, setCurrency] = useState<Currency>('USD')
  const [selectedPackage, setSelectedPackage] = useState<string | null>('basic')
  const [selectedAddons, setSelectedAddons] = useState<Set<string>>(new Set())
  const [pages, setPages] = useState<number>(CONFIG.basePages)
  const [negotiationNote, setNegotiationNote] = useState('')
  const [showNegotiation, setShowNegotiation] = useState(false)

  useEffect(() => {
    const host = window.location.hostname
    fetch('https://api.country.is/')
      .then((r) => r.json())
      .then((data: { ip: string; country: string }) => {
        setCurrency(data.country === 'IN' ? 'INR' : 'USD')
      })
      .catch(() => {
        setCurrency(getCurrency(getMarket(host)))
      })
  }, [])

  // B2B scope is discussed on call — no page count applies
  const showPages = selectedPackage !== null && selectedPackage !== 'b2b'

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
    return p.label
  }

  const isB2B = selectedPackage === 'b2b'

  function handlePDF() {
    if (!hasSelection) return

    const date = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    const totalDisplay = isB2B && total === 0 ? 'Custom' : formatPrice(total, currency)

    const pkgRow = activePkg
      ? `<tr><td>${pkgDisplayName(activePkg)}</td><td>${isB2B ? 'On call' : formatPrice(getPkgPrice(activePkg), currency)}</td></tr>`
      : ''
    const addonRows = CONFIG.addons
      .filter((a) => selectedAddons.has(a.id))
      .map((a) => `<tr><td>${a.label}</td><td>${formatPrice(getAddonPrice(a), currency)}</td></tr>`)
      .join('')
    const pageRow = showPages
      ? `<tr><td>${pages} page${pages !== 1 ? 's' : ''} × ${formatPrice(CONFIG.pageRate[currency], currency)}</td><td>${formatPrice(pageTotal, currency)}</td></tr>`
      : ''
    const noteBlock = negotiationNote.trim()
      ? `<div class="section">Notes / Budget</div><div class="notes">${negotiationNote.trim()}</div>`
      : ''
    const scheduleBlock = total > 0 ? `
      <div class="section">Payment Schedule</div>
      <div class="schedule">
        <div class="schedule-title">How payments are split</div>
        <div class="phase"><div class="phase-left"><span class="dot"></span>Design · 40%</div><div class="phase-right">${formatPrice(phaseDesign, currency)}</div></div>
        <div class="phase"><div class="phase-left"><span class="dot"></span>Build · 30%</div><div class="phase-right">${formatPrice(phaseBuild, currency)}</div></div>
        <div class="phase"><div class="phase-left"><span class="dot"></span>Launch · 30%</div><div class="phase-right">${formatPrice(phaseLaunch, currency)}</div></div>
        <div class="bar-wrap"><div class="bar-a" style="flex:40"></div><div class="bar-b" style="flex:30"></div><div class="bar-c" style="flex:30"></div></div>
      </div>` : ''

    const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>ShapeKraft — Project Estimate</title>
<style>
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  html{background:#080808;print-color-adjust:exact;-webkit-print-color-adjust:exact}
  body{
    font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Helvetica Neue',Arial,sans-serif;
    background:#080808;color:#f0f0f0;
    max-width:680px;margin:0 auto;padding:52px 48px;
    print-color-adjust:exact;-webkit-print-color-adjust:exact;
  }
  .brand{display:flex;align-items:center;gap:14px;margin-bottom:52px}
  .brand-name{font-size:14px;font-weight:900;letter-spacing:0.05em;line-height:0.9;color:#f0f0f0;text-transform:uppercase}
  .doc-label{font-size:10px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:#7C3AED;margin-bottom:6px}
  .doc-date{font-size:13px;color:#6a6a6a;margin-bottom:44px}
  .section{font-size:10px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:#444;margin:36px 0 14px}
  table{width:100%;border-collapse:collapse}
  tr:last-child td{border-bottom:none}
  td{padding:12px 0;border-bottom:1px solid #222;font-size:14px;line-height:1.4}
  td:first-child{color:#f0f0f0;font-weight:500;padding-right:20px}
  td:last-child{text-align:right;color:#6a6a6a;font-family:'Courier New',monospace;white-space:nowrap}
  .total-wrap{margin-top:10px;padding:28px 0 24px;border-top:1px solid #222}
  .total-amount{font-size:48px;font-weight:900;letter-spacing:-0.03em;color:#f0f0f0;line-height:1;margin-bottom:8px}
  .total-amount.custom{font-size:36px;color:#A78BFA}
  .total-note{font-size:12px;color:#444}
  .schedule{background:rgba(124,58,237,0.07);border:1px solid rgba(124,58,237,0.2);border-radius:10px;padding:22px 24px}
  .schedule-title{font-size:10px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:#7C3AED;margin-bottom:18px}
  .phase{display:flex;justify-content:space-between;align-items:center;padding:9px 0;border-bottom:1px solid rgba(255,255,255,0.04)}
  .phase:last-of-type{border-bottom:none}
  .phase-left{display:flex;align-items:center;gap:10px;font-size:14px;color:#6a6a6a}
  .dot{width:6px;height:6px;border-radius:50%;background:#7C3AED;flex-shrink:0;display:inline-block}
  .phase-right{font-family:'Courier New',monospace;font-size:14px;font-weight:600;color:#f0f0f0}
  .bar-wrap{display:flex;height:3px;border-radius:2px;overflow:hidden;margin-top:18px;gap:2px}
  .bar-a{background:#7C3AED;border-radius:2px 0 0 2px}
  .bar-b{background:#A78BFA}
  .bar-c{background:rgba(167,139,250,0.25);border-radius:0 2px 2px 0}
  .notes{background:rgba(255,255,255,0.03);border:1px solid #222;border-radius:8px;padding:16px 20px;font-size:14px;color:#6a6a6a;line-height:1.7}
  .footer{margin-top:52px;padding-top:20px;border-top:1px solid #222;display:flex;justify-content:space-between;align-items:center}
  .footer-brand{font-size:12px;font-weight:700;letter-spacing:0.06em;color:#333;text-transform:uppercase}
  .footer-note{font-size:11px;color:#333}
  @media print{
    html,body{background:#080808 !important;print-color-adjust:exact !important;-webkit-print-color-adjust:exact !important}
    body{padding:40px 44px}
  }
</style>
</head>
<body>
  <div class="brand">
    <svg width="28" height="32" viewBox="0 0 140 155" fill="none" aria-hidden="true">
      <rect x="20" y="15" width="100" height="100" stroke="#f0f0f0" stroke-width="1.7"/>
      <polygon points="70,15 120,65 70,115 20,65" stroke="#f0f0f0" stroke-width="1.7" fill="none"/>
      <line x1="20" y1="65" x2="120" y2="65" stroke="#f0f0f0" stroke-width="1.7"/>
      <line x1="70" y1="15" x2="70" y2="115" stroke="#f0f0f0" stroke-width="1.7"/>
      <path d="M4,92 L4,137 L44,137" stroke="#f0f0f0" stroke-width="1.7" fill="none" stroke-linecap="square"/>
    </svg>
    <div class="brand-name">SHAPE<br>KRAFT</div>
  </div>

  <div class="doc-label">Project Estimate</div>
  <div class="doc-date">${date}</div>

  <div class="section">Services</div>
  <table>${pkgRow}${addonRows}${pageRow}</table>

  <div class="total-wrap">
    <div class="total-amount${isB2B && total === 0 ? ' custom' : ''}">${totalDisplay}</div>
    <div class="total-note">${isB2B && total === 0 ? 'B2B pricing discussed on call · AMC &amp; scope included' : 'Estimate only · final quote confirmed after discovery call'}</div>
  </div>

  ${scheduleBlock}
  ${noteBlock}

  <div class="footer">
    <div class="footer-brand">shapekraft.co</div>
    <div class="footer-note">Valid for 30 days from date of issue</div>
  </div>
</body>
</html>`

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
            Pick what you need, see the price right away. No forms, no sales calls, no waiting.
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
                              {pkg.label}
                            </span>
                            {pkg.tier === 'B2B' && (
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
                                Call Support
                              </span>
                            )}
                          </div>
                          <span
                            className="font-mono text-sm shrink-0"
                            style={{ color: active ? 'var(--color-accent)' : 'var(--color-muted)' }}
                          >
                            {pkg.id === 'b2b' ? 'Custom' : formatPrice(getPkgPrice(pkg), currency)}
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
                      fontSize: 'clamp(1.6rem, 4vw, 2.5rem)',
                      color: 'var(--color-text)',
                      wordBreak: 'break-word',
                    }}
                  >
                    {isB2B && total === 0 ? 'Custom' : formatPrice(total, currency)}
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
                  {isB2B && total === 0
                    ? 'Pricing discussed on call — AMC & scope included'
                    : 'Estimate only · final quote after discovery call'}
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
                        {isB2B ? 'On call' : formatPrice(pkgPrice, currency)}
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
                      placeholder="E.g. I have ₹20k to work with — can you make it happen?"
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

              {/* Primary: Download PDF */}
              <button
                onClick={handlePDF}
                disabled={!hasSelection}
                className="flex items-center justify-center gap-2 w-full py-4 font-semibold text-base transition-all duration-300"
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
                aria-label={hasSelection ? 'Download quote as PDF' : 'Select a package to continue'}
              >
                {hasSelection ? (
                  <><Download size={16} /> Download Quote as PDF</>
                ) : (
                  'Select a package to continue'
                )}
              </button>

              {/* Secondary: Contact */}
              {hasSelection && (
                <a
                  href="/#contact"
                  className="flex items-center justify-center gap-2 w-full py-3 text-sm font-medium transition-all duration-200"
                  style={{
                    backgroundColor: 'transparent',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-full)',
                    color: 'var(--color-muted)',
                    textDecoration: 'none',
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
                  Talk to us about this →
                </a>
              )}

              <p className="text-center text-xs" style={{ color: 'var(--color-muted)' }}>
                We respond within one business day
              </p>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  )
}
