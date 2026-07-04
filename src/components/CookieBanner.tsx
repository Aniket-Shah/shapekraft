'use client'

import { useEffect, useState } from 'react'

const CONSENT_KEY = 'sk-cookie-consent'

type ConsentChoice = 'granted' | 'denied'

function applyConsent(choice: ConsentChoice) {
  window.dataLayer = window.dataLayer || []
  window.gtag =
    window.gtag ||
    function gtag(...args: unknown[]) {
      window.dataLayer!.push(args)
    }
  window.gtag('consent', 'update', {
    analytics_storage: choice,
    ad_storage: choice,
    ad_user_data: choice,
    ad_personalization: choice,
  })
}

export function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const stored = window.localStorage.getItem(CONSENT_KEY)
    if (stored === 'granted' || stored === 'denied') {
      applyConsent(stored)
    } else {
      setVisible(true)
    }
  }, [])

  const choose = (choice: ConsentChoice) => {
    window.localStorage.setItem(CONSENT_KEY, choice)
    applyConsent(choice)
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
      className="fixed inset-x-0 bottom-0 flex justify-center px-4 pb-4"
      style={{ zIndex: 'var(--z-modal)' as string }}
    >
      <div
        className="flex w-full max-w-2xl flex-col gap-3 rounded-lg border p-4 shadow-lg sm:flex-row sm:items-center sm:justify-between"
        style={{
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
          color: 'var(--color-text)',
        }}
      >
        <p className="text-sm" style={{ color: 'var(--color-muted)' }}>
          We use cookies to understand site usage. See our{' '}
          <a href="/privacy" className="underline" style={{ color: 'var(--color-text)' }}>
            Privacy Policy
          </a>
          .
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => choose('denied')}
            className="rounded-md px-3 py-2 text-sm font-medium"
            style={{ border: '1px solid var(--color-border)', color: 'var(--color-text)' }}
          >
            Reject
          </button>
          <button
            type="button"
            onClick={() => choose('granted')}
            className="rounded-md px-3 py-2 text-sm font-medium"
            style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-primary-fg)' }}
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  )
}
