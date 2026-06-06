'use client'
import { useState } from 'react'
import { FadeUp } from '@/components/motion/FadeUp'
import { cn } from '@/lib/utils'

interface Service {
  number: string
  title: string
  description: string
  detail: string
  tags: string[]
}

const SERVICES: Service[] = [
  {
    number: '01',
    title: 'Website Design & Development',
    description:
      'Custom-built websites engineered for performance and conversion. Every pixel intentional, every interaction considered.',
    detail:
      'From architecture to deployment — we design, build, and optimise. Next.js, React, TypeScript. No themes. No compromises.',
    tags: ['Next.js', 'TypeScript', 'Design System', 'CMS'],
  },
  {
    number: '02',
    title: 'AI Automation & Agents',
    description:
      "Intelligent workflows and autonomous agents that eliminate repetitive tasks and amplify your team's output.",
    detail:
      'Custom LLM integrations, RAG pipelines, and multi-agent systems. We connect AI to your existing tools and processes.',
    tags: ['LLM', 'RAG', 'Workflows', 'Integrations'],
  },
  {
    number: '03',
    title: 'Performance Optimisation',
    description:
      'We take slow websites and make them fast. 100 Lighthouse, sub-2s LCP, and conversion rates that follow.',
    detail:
      'Core Web Vitals audit, bundle optimisation, image pipeline, edge delivery. Measurable results guaranteed.',
    tags: ['Core Web Vitals', 'Lighthouse', 'CDN', 'Bundle Analysis'],
  },
  {
    number: '04',
    title: 'Webhook & Integrations',
    description:
      'Reliable event systems and API wiring that keep your tools in sync — without breaking at 2am.',
    detail:
      'End-to-end webhook infrastructure, custom event pipelines, and third-party API orchestration built to last.',
    tags: ['Webhooks', 'APIs', 'Event Systems', 'Pipelines'],
  },
]

export function ServicesGrid() {
  const [expanded, setExpanded] = useState<number | null>(null)

  return (
    <section
      id="services"
      style={{ padding: 'var(--s-24) var(--gutter)' }}
      aria-labelledby="services-heading"
    >
      <div style={{ maxWidth: 'var(--max-w)', margin: '0 auto' }}>
        <FadeUp>
          <div className="flex items-end justify-between mb-16 flex-wrap gap-6">
            <div>
              <span
                className="text-xs font-semibold tracking-widest uppercase block mb-3"
                style={{ color: 'var(--color-primary)' }}
              >
                What we do
              </span>
              <h2
                id="services-heading"
                className="font-display font-black leading-tight tracking-tight"
                style={{ fontSize: 'var(--fs-3xl)', color: 'var(--color-text)' }}
              >
                Services
              </h2>
            </div>
            <p
              className="max-w-xs"
              style={{ color: 'var(--color-muted)', fontSize: 'var(--fs-sm)' }}
            >
              Four things we do exceptionally well. No generalist fluff.
            </p>
          </div>
        </FadeUp>

        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-px"
          style={{ backgroundColor: 'var(--color-border)' }}
          role="list"
        >
          {SERVICES.map((service, i) => (
            <FadeUp key={service.number} delay={i * 80}>
              <article
                role="listitem"
                className={cn('cursor-pointer p-8 md:p-10 flex flex-col gap-5 transition-colors duration-300')}
                style={{ backgroundColor: 'var(--color-bg)' }}
                onClick={() => setExpanded(expanded === i ? null : i)}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = 'var(--color-surface)')
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = 'var(--color-bg)')
                }
              >
                <div className="flex items-center justify-between">
                  <span
                    className="font-mono text-xs tracking-widest"
                    style={{ color: 'var(--color-primary)' }}
                  >
                    {service.number}
                  </span>
                  <button
                    className="w-8 h-8 rounded-full border flex items-center justify-center shrink-0 transition-all duration-300"
                    style={{
                      borderColor:
                        expanded === i ? 'var(--color-primary)' : 'var(--color-border)',
                      color:
                        expanded === i ? 'var(--color-primary)' : 'var(--color-muted)',
                      transform: expanded === i ? 'rotate(45deg)' : 'none',
                    }}
                    aria-expanded={expanded === i}
                    aria-label={
                      expanded === i
                        ? `Collapse ${service.title}`
                        : `Expand ${service.title}`
                    }
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path
                        d="M6 1v10M1 6h10"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                </div>

                <h3
                  className="font-display font-bold leading-tight"
                  style={{ fontSize: 'var(--fs-xl)', color: 'var(--color-text)' }}
                >
                  {service.title}
                </h3>

                <p
                  style={{
                    color: 'var(--color-muted)',
                    fontSize: 'var(--fs-sm)',
                    lineHeight: 1.7,
                  }}
                >
                  {service.description}
                </p>

                <div
                  className="overflow-hidden transition-all duration-500"
                  style={{
                    maxHeight: expanded === i ? '220px' : '0',
                    opacity: expanded === i ? 1 : 0,
                  }}
                >
                  <div
                    className="pt-5 border-t"
                    style={{ borderColor: 'var(--color-border)' }}
                  >
                    <p
                      className="mb-4"
                      style={{
                        color: 'var(--color-muted)',
                        fontSize: 'var(--fs-sm)',
                        lineHeight: 1.7,
                      }}
                    >
                      {service.detail}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {service.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 text-xs font-medium"
                          style={{
                            backgroundColor: 'rgba(124,58,237,0.08)',
                            color: 'var(--color-accent)',
                            border: '1px solid rgba(124,58,237,0.2)',
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  )
}
