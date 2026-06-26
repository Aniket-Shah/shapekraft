import type { ReactNode } from 'react'

interface Props {
  title: string
  lastUpdated: string
  children: ReactNode
}

export function LegalPage({ title, lastUpdated, children }: Props) {
  return (
    <main
      id="main-content"
      style={{ padding: 'clamp(5rem, 10vw, var(--s-24)) var(--gutter) clamp(3rem, 8vw, var(--s-16))' }}
    >
      <div style={{ maxWidth: '48rem', margin: '0 auto' }}>
        {/* Header */}
        <h1
          className="font-display font-black leading-tight tracking-tight mb-3"
          style={{ fontSize: 'var(--fs-3xl)', color: 'var(--color-text)' }}
        >
          {title}
        </h1>
        <p className="text-sm mb-10" style={{ color: 'var(--color-muted)' }}>
          Last updated: {lastUpdated}
        </p>

        <hr style={{ borderColor: 'var(--color-border)', marginBottom: '2.5rem' }} />

        {/* Prose body */}
        <div className="legal-prose">
          {children}
        </div>
      </div>

      <style>{`
        .legal-prose h2 {
          font-size: var(--fs-lg);
          font-weight: 700;
          color: var(--color-text);
          margin: 2.5rem 0 0.75rem;
          letter-spacing: -0.01em;
        }
        .legal-prose h2:first-child {
          margin-top: 0;
        }
        .legal-prose p {
          font-size: var(--fs-base);
          color: var(--color-muted);
          line-height: 1.8;
          margin-bottom: 1rem;
        }
        .legal-prose ul {
          list-style: none;
          padding: 0;
          margin: 0 0 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .legal-prose li {
          font-size: var(--fs-base);
          color: var(--color-muted);
          line-height: 1.7;
          padding-left: 1.25rem;
          position: relative;
        }
        .legal-prose li::before {
          content: '—';
          position: absolute;
          left: 0;
          color: var(--color-border);
        }
        .legal-prose a {
          color: var(--color-accent);
          text-decoration: underline;
          text-decoration-color: transparent;
          text-underline-offset: 3px;
          transition: text-decoration-color 0.2s;
        }
        .legal-prose a:hover {
          text-decoration-color: var(--color-accent);
        }
        .legal-prose a:focus-visible {
          outline: 2px solid var(--color-accent);
          outline-offset: 3px;
          border-radius: 2px;
        }
        .legal-prose table {
          width: 100%;
          border-collapse: collapse;
          margin: 1rem 0 1.5rem;
          font-size: var(--fs-sm);
        }
        .legal-prose th {
          text-align: left;
          font-weight: 600;
          font-size: 11px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--color-muted);
          padding: 0.5rem 0.75rem 0.5rem 0;
          border-bottom: 1px solid var(--color-border);
        }
        .legal-prose td {
          padding: 0.65rem 0.75rem 0.65rem 0;
          color: var(--color-muted);
          border-bottom: 1px solid var(--color-border);
          vertical-align: top;
          line-height: 1.6;
        }
        .legal-prose td:first-child {
          color: var(--color-text);
          font-weight: 500;
          white-space: nowrap;
        }
        @media (max-width: 640px) {
          .legal-prose table, .legal-prose thead, .legal-prose tbody, .legal-prose th, .legal-prose td, .legal-prose tr {
            display: block;
          }
          .legal-prose thead {
            display: none;
          }
          .legal-prose td {
            padding: 0.4rem 0;
            border: none;
          }
          .legal-prose tr {
            border-bottom: 1px solid var(--color-border);
            padding: 0.75rem 0;
          }
        }
      `}</style>
    </main>
  )
}
