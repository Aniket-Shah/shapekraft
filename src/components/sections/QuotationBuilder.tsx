'use client'
import { useState, useEffect } from 'react'
import { Plus, Minus, CheckCircle2, Circle, Download, MessageSquare } from 'lucide-react'
import { getMarket, getCurrency, formatPrice, type Currency } from '@/lib/market'
import { pushDataLayerEvent } from '@/lib/analytics'
import { FadeUp } from '@/components/motion/FadeUp'

// ── CONFIG: all pricing lives here — do not scatter ─────────────────────────
// Founding Client rates (Nov 2026): quoted to the first clients in each market
// in exchange for a case study + testimonial. `list*` is the anchor price shown
// struck-through. When founding slots run out, set foundingRates.active = false
// and the list prices become the quoted prices. See Notion → Pricing Plan v2.
export const CONFIG = {
  whatsapp: {
    IN: '+919999999999', // UPDATE: your India WhatsApp number
    US: '+14155550000',  // UPDATE: your US/global WhatsApp number
  },
  foundingRates: {
    active: true,
    slotsLeft: 5, // UPDATE as founding slots fill
  },
  packages: [
    {
      id: 'basic',
      tier: 'Starter',
      label: 'Starter Website',
      description: '5 custom pages, fast on every device, a contact form wired to your inbox, and the SEO basics. 90+ Lighthouse.',
      includedPages: 5,
      priceINR: 12_000,
      priceUSD: 450,
      listINR: 15_000,
      listUSD: 750,
    },
    {
      id: 'pro',
      tier: 'Growth',
      label: 'Growth Website',
      description: 'Up to 10 pages, smooth animations, a blog or portfolio you update yourself, analytics, and enquiries sent straight to email, WhatsApp or your CRM.',
      includedPages: 10,
      priceINR: 25_000,
      priceUSD: 900,
      listINR: 35_000,
      listUSD: 1_500,
    },
    {
      id: 'advanced',
      tier: 'Studio',
      label: 'Studio Website',
      description: 'Up to 15 pages built from scratch to your brand: your own design system, custom interactions, and a performance guarantee.',
      includedPages: 15,
      priceINR: 45_000,
      priceUSD: 1_800,
      listINR: 60_000,
      listUSD: 3_000,
    },
    {
      id: 'b2b',
      tier: 'B2B',
      label: 'Business B2B',
      description: 'Discovery calls, catalog and RFQ flows, proposals and decks, plus 3 months of care included. Priced by scope, from ₹75,000 / $4,000.',
      includedPages: 0,
      priceINR: 0,
      priceUSD: 0,
      listINR: 0,
      listUSD: 0,
    },
  ],
  addons: [
    {
      id: 'ai',
      label: 'AI Automation (first workflow)',
      description: 'One workflow that saves you hours: RFQ → auto-quote, enquiry → CRM/WhatsApp, or invoice and document extraction.',
      priceINR: 18_000,
      priceUSD: 700,
      listINR: 30_000,
      listUSD: 1_500,
    },
    {
      id: 'performance',
      label: 'Performance Optimisation',
      description: 'Make your site noticeably faster. Better Google scores, lower bounce rate, happier users.',
      priceINR: 10_000,
      priceUSD: 300,
      listINR: 10_000,
      listUSD: 750,
    },
    {
      id: 'webhook',
      label: 'Integrations',
      description: 'Connect the tools you already use — CRMs, payment gateways, email, Slack, Notion. They talk to each other so you don\'t have to.',
      priceINR: 10_000,
      priceUSD: 300,
      listINR: 10_000,
      listUSD: 500,
    },
  ],
  carePlans: [
    { id: 'none', label: 'No care plan', description: 'You manage hosting and updates yourself.', priceINR: 0, priceUSD: 0 },
    { id: 'essential', label: 'Essential care', description: 'Hosting, backups, updates, uptime and form monitoring.', priceINR: 1_500, priceUSD: 99 },
    { id: 'growth', label: 'Growth care', description: 'Essential + 2 hrs of changes a month, monthly speed/SEO report, 24h response.', priceINR: 5_000, priceUSD: 299 },
  ],
  // Extra pages beyond the package's included pages
  pageRate: { INR: 2_000, USD: 40 },
  basePages: 5,
  maxPages: 50,
  split: { design: 40, build: 30, launch: 30 },
} as const

type Priced = { priceINR: number; priceUSD: number; listINR: number; listUSD: number }

/** Escape user-entered text before it goes into the printable HTML estimate. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

const TIER_BADGE: Record<string, { color: string; bg: string }> = {
  Starter:  { color: 'var(--color-muted)',   bg: 'rgba(11,11,15,0.06)' },
  Growth:   { color: 'var(--color-primary-ink)', bg: 'rgba(11,100,108,0.10)' },
  Studio:   { color: 'var(--color-accent)',  bg: 'rgba(11,100,108,0.15)' },
  B2B:      { color: 'var(--color-text)',    bg: 'rgba(11,11,15,0.08)' },
}

export function QuotationBuilder() {
  const [currency, setCurrency] = useState<Currency>('USD')
  const [selectedPackage, setSelectedPackage] = useState<string | null>('basic')
  const [selectedAddons, setSelectedAddons] = useState<Set<string>>(new Set())
  const [pages, setPages] = useState<number>(CONFIG.basePages)
  const [negotiationNote, setNegotiationNote] = useState('')
  const [showNegotiation, setShowNegotiation] = useState(false)
  const [carePlan, setCarePlan] = useState<string>('none')
  const [leadName, setLeadName] = useState('')
  const [leadContact, setLeadContact] = useState('')
  const [showLeadForm, setShowLeadForm] = useState(false)
  const [leadError, setLeadError] = useState('')
  const [leadSending, setLeadSending] = useState(false)

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

  const founding = CONFIG.foundingRates.active

  // Quoted price: founding rate while founding slots are open, list price after.
  const priceOf = (item: Priced) =>
    founding
      ? currency === 'INR' ? item.priceINR : item.priceUSD
      : currency === 'INR' ? item.listINR : item.listUSD
  const listOf = (item: Priced) => (currency === 'INR' ? item.listINR : item.listUSD)
  const getPkgPrice = (p: (typeof CONFIG.packages)[number]) => priceOf(p)
  const getAddonPrice = (a: (typeof CONFIG.addons)[number]) => priceOf(a)
  const showList = (item: Priced) => founding && listOf(item) > priceOf(item)

  const activePkg = CONFIG.packages.find((p) => p.id === selectedPackage) ?? null
  const includedPages = activePkg?.includedPages ?? CONFIG.basePages
  const extraPages = showPages ? Math.max(0, pages - includedPages) : 0
  const pkgPrice = activePkg ? getPkgPrice(activePkg) : 0
  const addonTotal = CONFIG.addons
    .filter((a) => selectedAddons.has(a.id))
    .reduce((sum, a) => sum + getAddonPrice(a), 0)
  const pageTotal = extraPages * CONFIG.pageRate[currency]
  const total = pkgPrice + addonTotal + pageTotal

  const activeCare = CONFIG.carePlans.find((c) => c.id === carePlan) ?? CONFIG.carePlans[0]
  const carePrice = currency === 'INR' ? activeCare.priceINR : activeCare.priceUSD

  // Start the page stepper at the package's included pages
  function selectPackage(id: string | null) {
    setSelectedPackage(id)
    const pkg = CONFIG.packages.find((p) => p.id === id)
    if (pkg && pkg.includedPages > 0) setPages(pkg.includedPages)
  }

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

  // Step 1: the Download button opens the lead form instead of printing straight away.
  function handlePDF() {
    if (!hasSelection) return
    setShowLeadForm(true)
    setLeadError('')
  }

  // Step 2: capture the lead, then print the estimate.
  async function submitLeadAndPrint(e: React.FormEvent) {
    e.preventDefault()
    const name = leadName.trim()
    const contact = leadContact.trim()
    const looksLikeEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact)
    const looksLikePhone = /^\+?[\d\s()-]{8,}$/.test(contact)
    if (!name) { setLeadError('Please add your name.'); return }
    if (!looksLikeEmail && !looksLikePhone) {
      setLeadError('Please add a valid email or WhatsApp number.')
      return
    }
    setLeadError('')
    setLeadSending(true)

    const summary = {
      name,
      contact,
      currency,
      package: activePkg?.label ?? null,
      pages: showPages ? pages : null,
      extraPages,
      addons: CONFIG.addons.filter((a) => selectedAddons.has(a.id)).map((a) => a.label),
      carePlan: activeCare.id === 'none' ? null : activeCare.label,
      carePlanMonthly: carePrice,
      total: isB2B && total === 0 ? 'Custom' : formatPrice(total, currency),
      foundingRate: founding,
      note: negotiationNote.trim() || null,
      page: typeof window !== 'undefined' ? window.location.href : null,
    }

    try {
      // Fire-and-forget with a short timeout: a slow lead relay must never block the PDF.
      const controller = new AbortController()
      const timer = setTimeout(() => controller.abort(), 4000)
      await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(summary),
        signal: controller.signal,
      }).catch(() => undefined)
      clearTimeout(timer)
    } finally {
      setLeadSending(false)
    }

    pushDataLayerEvent('generate_lead')
    setShowLeadForm(false)
    printEstimate(name)
  }

  function printEstimate(preparedFor: string) {
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
      ? `<tr><td>${pages} page${pages !== 1 ? 's' : ''} (${includedPages} included${extraPages > 0 ? `, ${extraPages} extra × ${formatPrice(CONFIG.pageRate[currency], currency)}` : ''})</td><td>${extraPages > 0 ? formatPrice(pageTotal, currency) : 'Included'}</td></tr>`
      : ''
    const careRow = activeCare.id !== 'none'
      ? `<tr><td>${activeCare.label} (after launch)</td><td>${formatPrice(carePrice, currency)}/month</td></tr>`
      : ''
    const noteBlock = negotiationNote.trim()
      ? `<div class="section">Notes / Budget</div><div class="notes">${escapeHtml(negotiationNote.trim())}</div>`
      : ''
    const foundingNote = founding && !(isB2B && total === 0)
      ? ' · Founding client rate, in exchange for a case study + testimonial'
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
  html{background:#FAF0E6;print-color-adjust:exact;-webkit-print-color-adjust:exact}
  body{
    font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Helvetica Neue',Arial,sans-serif;
    background:#FAF0E6;color:#0B0B0F;
    max-width:680px;margin:0 auto;padding:52px 48px;
    print-color-adjust:exact;-webkit-print-color-adjust:exact;
  }
  .brand{display:flex;align-items:center;gap:14px;margin-bottom:52px}
  .brand-name{font-size:14px;font-weight:900;letter-spacing:0.05em;line-height:0.9;color:#0B0B0F;text-transform:uppercase}
  .doc-label{font-size:10px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:#0B646C;margin-bottom:6px}
  .doc-date{font-size:13px;color:#3B3B44;margin-bottom:44px}
  .section{font-size:10px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:#55555F;margin:36px 0 14px}
  table{width:100%;border-collapse:collapse}
  tr:last-child td{border-bottom:none}
  td{padding:12px 0;border-bottom:1px solid #E8D3BA;font-size:14px;line-height:1.4}
  td:first-child{color:#0B0B0F;font-weight:500;padding-right:20px}
  td:last-child{text-align:right;color:#3B3B44;font-family:'Courier New',monospace;white-space:nowrap}
  .total-wrap{margin-top:10px;padding:28px 0 24px;border-top:1px solid #E8D3BA}
  .total-amount{font-size:48px;font-weight:900;letter-spacing:-0.03em;color:#0B0B0F;line-height:1;margin-bottom:8px}
  .total-amount.custom{font-size:36px;color:#084D53}
  .total-note{font-size:12px;color:#55555F}
  .schedule{background:rgba(11,100,108,0.07);border:1px solid rgba(11,100,108,0.2);border-radius:10px;padding:22px 24px}
  .schedule-title{font-size:10px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:#0B646C;margin-bottom:18px}
  .phase{display:flex;justify-content:space-between;align-items:center;padding:9px 0;border-bottom:1px solid rgba(11,11,15,0.08)}
  .phase:last-of-type{border-bottom:none}
  .phase-left{display:flex;align-items:center;gap:10px;font-size:14px;color:#3B3B44}
  .dot{width:6px;height:6px;border-radius:50%;background:#0B646C;flex-shrink:0;display:inline-block}
  .phase-right{font-family:'Courier New',monospace;font-size:14px;font-weight:600;color:#0B0B0F}
  .bar-wrap{display:flex;height:3px;border-radius:2px;overflow:hidden;margin-top:18px;gap:2px}
  .bar-a{background:#0B646C;border-radius:2px 0 0 2px}
  .bar-b{background:#E97451}
  .bar-c{background:rgba(8,77,83,0.25);border-radius:0 2px 2px 0}
  .notes{background:rgba(11,11,15,0.04);border:1px solid #E8D3BA;border-radius:8px;padding:16px 20px;font-size:14px;color:#3B3B44;line-height:1.7}
  .footer{margin-top:52px;padding-top:20px;border-top:1px solid #E8D3BA;display:flex;justify-content:space-between;align-items:center}
  .footer-brand{font-size:12px;font-weight:700;letter-spacing:0.06em;color:#55555F;text-transform:uppercase}
  .footer-note{font-size:11px;color:#55555F}
  @media print{
    html,body{background:#FAF0E6 !important;print-color-adjust:exact !important;-webkit-print-color-adjust:exact !important}
    body{padding:40px 44px}
  }
</style>
</head>
<body>
  <div class="brand">
    <svg width="28" height="32" viewBox="0 0 140 155" fill="none" aria-hidden="true">
      <rect x="20" y="15" width="100" height="100" stroke="#0B0B0F" stroke-width="1.7"/>
      <polygon points="70,15 120,65 70,115 20,65" stroke="#0B0B0F" stroke-width="1.7" fill="none"/>
      <line x1="20" y1="65" x2="120" y2="65" stroke="#0B0B0F" stroke-width="1.7"/>
      <line x1="70" y1="15" x2="70" y2="115" stroke="#0B0B0F" stroke-width="1.7"/>
      <path d="M4,92 L4,137 L44,137" stroke="#0B0B0F" stroke-width="1.7" fill="none" stroke-linecap="square"/>
    </svg>
    <div class="brand-name">SHAPE<br>KRAFT</div>
  </div>

  <div class="doc-label">Project Estimate</div>
  <div class="doc-date">${date} · Prepared for ${escapeHtml(preparedFor)}</div>

  <div class="section">Services</div>
  <table>${pkgRow}${addonRows}${pageRow}${careRow}</table>

  <div class="total-wrap">
    <div class="total-amount${isB2B && total === 0 ? ' custom' : ''}">${totalDisplay}</div>
    <div class="total-note">${isB2B && total === 0 ? 'B2B pricing discussed on call · AMC &amp; scope included' : `Estimate only · final quote confirmed after discovery call${foundingNote}`}</div>
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
    pushDataLayerEvent('quote_submitted')
    setTimeout(() => document.body.removeChild(iframe), 2000)
  }

  const hasSelection = selectedPackage !== null || selectedAddons.size > 0

  return (
    <section
      className="theme-cream"
      aria-labelledby="quote-heading"
      style={{ padding: 'clamp(3rem, 8vw, var(--s-24)) var(--gutter)' }}
    >
      <div style={{ maxWidth: '960px', margin: '0 auto' }}>

        {/* ── Header ── */}
        <FadeUp>
          <span
            className="text-xs font-semibold tracking-widest uppercase block mb-4"
            style={{ color: 'var(--color-primary-ink)' }}
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
            Pick what you need, see the price right away. No sales calls, no waiting.
          </p>
          {founding && (
            <p
              className="mt-4 inline-block text-sm font-medium px-3 py-1.5"
              style={{
                color: 'var(--color-primary-ink)',
                backgroundColor: 'rgba(11,100,108,0.08)',
                border: '1px solid rgba(11,100,108,0.2)',
                borderRadius: 'var(--radius-full)',
              }}
            >
              Founding client rates · {CONFIG.foundingRates.slotsLeft} slots left · in exchange for a case study
            </p>
          )}
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
                  const badge = TIER_BADGE[pkg.tier] ?? TIER_BADGE.Starter
                  return (
                    <button
                      key={pkg.id}
                      role="radio"
                      aria-checked={active}
                      onClick={() => selectPackage(active ? null : pkg.id)}
                      className="flex items-start gap-3 sm:gap-4 p-4 sm:p-5 text-left w-full transition-all duration-300"
                      style={{
                        backgroundColor: active ? 'rgba(11,100,108, 0.06)' : 'var(--color-surface)',
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
                            style={{ color: active ? 'var(--color-primary-ink)' : 'var(--color-muted)' }}
                          >
                            {pkg.id === 'b2b' ? 'Custom' : (
                              <>
                                {showList(pkg) && (
                                  <s className="mr-1.5" style={{ opacity: 0.6 }}>{formatPrice(listOf(pkg), currency)}</s>
                                )}
                                {formatPrice(getPkgPrice(pkg), currency)}
                              </>
                            )}
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
                        backgroundColor: active ? 'rgba(11,100,108, 0.06)' : 'var(--color-surface)',
                        border: `1px solid ${active ? 'var(--color-primary)' : 'var(--color-border)'}`,
                        borderRadius: 'var(--radius-sm)',
                      }}
                      aria-pressed={active}
                    >
                      <span
                        className="mt-0.5 shrink-0"
                        style={{ color: active ? 'var(--color-primary-ink)' : 'var(--color-border)' }}
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
                            style={{ color: active ? 'var(--color-primary-ink)' : 'var(--color-muted)' }}
                          >
                            {showList(addon) && (
                              <s className="mr-1.5" style={{ opacity: 0.6 }}>{formatPrice(listOf(addon), currency)}</s>
                            )}
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
                      backgroundColor: pages <= 1 ? 'transparent' : 'rgba(11,100,108, 0.1)',
                      border: '1px solid var(--color-border)',
                      color: pages <= 1 ? 'var(--color-muted)' : 'var(--color-primary-ink)',
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
                      backgroundColor: pages >= CONFIG.maxPages ? 'transparent' : 'rgba(11,100,108, 0.1)',
                      border: `1px solid ${pages >= CONFIG.maxPages ? 'var(--color-border)' : 'var(--color-primary)'}`,
                      color: pages >= CONFIG.maxPages ? 'var(--color-muted)' : 'var(--color-primary-ink)',
                      cursor: pages >= CONFIG.maxPages ? 'not-allowed' : 'pointer',
                    }}
                    aria-label="Add a page"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <p className="text-xs mt-2" style={{ color: 'var(--color-muted)' }}>
                  {includedPages} pages included · each extra page {formatPrice(CONFIG.pageRate[currency], currency)}
                </p>
              </FadeUp>
            )}

            {/* CARE PLAN — monthly, after launch */}
            {hasSelection && (
              <FadeUp delay={250}>
                <h2
                  className="text-xs font-semibold tracking-widest uppercase mb-4"
                  style={{ color: 'var(--color-muted)' }}
                >
                  Care after launch (monthly)
                </h2>
                <div className="flex flex-col gap-3" role="radiogroup" aria-label="Choose a care plan">
                  {CONFIG.carePlans.map((plan) => {
                    const active = carePlan === plan.id
                    const price = currency === 'INR' ? plan.priceINR : plan.priceUSD
                    return (
                      <button
                        key={plan.id}
                        role="radio"
                        aria-checked={active}
                        onClick={() => setCarePlan(plan.id)}
                        className="flex items-start gap-3 sm:gap-4 p-4 text-left w-full transition-all duration-300"
                        style={{
                          backgroundColor: active ? 'rgba(11,100,108, 0.06)' : 'var(--color-surface)',
                          border: `1px solid ${active ? 'var(--color-primary)' : 'var(--color-border)'}`,
                          borderRadius: 'var(--radius-sm)',
                        }}
                      >
                        <span
                          className="mt-0.5 shrink-0"
                          style={{ color: active ? 'var(--color-primary-ink)' : 'var(--color-border)' }}
                        >
                          {active ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-semibold text-sm" style={{ color: 'var(--color-text)' }}>
                              {plan.label}
                            </span>
                            <span
                              className="font-mono text-sm shrink-0"
                              style={{ color: active ? 'var(--color-primary-ink)' : 'var(--color-muted)' }}
                            >
                              {price > 0 ? `${formatPrice(price, currency)}/mo` : '—'}
                            </span>
                          </div>
                          <p className="text-xs mt-1.5" style={{ color: 'var(--color-muted)', lineHeight: 1.5 }}>
                            {plan.description}
                          </p>
                        </div>
                      </button>
                    )
                  })}
                </div>
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
                      backgroundColor: 'rgba(11,100,108, 0.04)',
                      border: '1px solid rgba(11,100,108, 0.15)',
                      borderRadius: 'var(--radius-sm)',
                    }}
                  >
                    <span
                      className="text-xs font-semibold tracking-wider uppercase"
                      style={{ color: 'var(--color-primary-ink)' }}
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
                    <div style={{ width: '30%', backgroundColor: 'rgba(8,77,83,0.35)', borderRadius: '0 2px 2px 0' }} />
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
                        {pages} {pages === 1 ? 'page' : 'pages'}
                        {extraPages > 0
                          ? ` (${extraPages} extra × ${formatPrice(CONFIG.pageRate[currency], currency)})`
                          : ' (included)'}
                      </span>
                      <span className="font-mono" style={{ color: 'var(--color-text)' }}>
                        {extraPages > 0 ? formatPrice(pageTotal, currency) : 'Included'}
                      </span>
                    </div>
                  )}
                  {activeCare.id !== 'none' && (
                    <div className="flex items-center justify-between text-sm">
                      <span style={{ color: 'var(--color-muted)' }}>{activeCare.label} (after launch)</span>
                      <span className="font-mono" style={{ color: 'var(--color-text)' }}>
                        {formatPrice(carePrice, currency)}/mo
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

              {/* Lead capture — shown after the visitor asks for the PDF */}
              {showLeadForm && hasSelection && (
                <form onSubmit={submitLeadAndPrint} className="flex flex-col gap-3" noValidate>
                  <p className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
                    Where should we send your estimate?
                  </p>
                  <label className="flex flex-col gap-1 text-xs" style={{ color: 'var(--color-muted)' }}>
                    Your name
                    <input
                      type="text"
                      autoComplete="name"
                      value={leadName}
                      onChange={(e) => setLeadName(e.target.value)}
                      className="w-full p-3 text-sm"
                      style={{
                        backgroundColor: 'var(--color-bg)',
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-sm)',
                        color: 'var(--color-text)',
                      }}
                    />
                  </label>
                  <label className="flex flex-col gap-1 text-xs" style={{ color: 'var(--color-muted)' }}>
                    Email or WhatsApp number
                    <input
                      type="text"
                      inputMode="email"
                      autoComplete="email"
                      value={leadContact}
                      onChange={(e) => setLeadContact(e.target.value)}
                      className="w-full p-3 text-sm"
                      style={{
                        backgroundColor: 'var(--color-bg)',
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-sm)',
                        color: 'var(--color-text)',
                      }}
                    />
                  </label>
                  {leadError && (
                    <p role="alert" className="text-xs" style={{ color: 'var(--color-text)' }}>
                      {leadError}
                    </p>
                  )}
                  <button
                    type="submit"
                    disabled={leadSending}
                    className="flex items-center justify-center gap-2 w-full py-4 font-semibold text-base transition-all duration-300"
                    style={{
                      backgroundColor: 'var(--color-primary)',
                      color: 'var(--color-primary-fg)',
                      borderRadius: 'var(--radius-full)',
                      cursor: leadSending ? 'wait' : 'pointer',
                    }}
                  >
                    <Download size={16} /> {leadSending ? 'Preparing…' : 'Get my PDF estimate'}
                  </button>
                  <p className="text-xs" style={{ color: 'var(--color-muted)' }}>
                    We&apos;ll follow up once, within one business day. No spam.
                  </p>
                </form>
              )}

              {/* Primary: Download PDF */}
              {!showLeadForm && <button
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
                  e.currentTarget.style.color = 'var(--color-primary-fg)'
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
              </button>}

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
