'use client'
import { FadeUp } from '@/components/motion/FadeUp'

interface Project {
  index: string
  title: string
  category: string
  year: string
  featured?: boolean
}

const PROJECTS: Project[] = [
  {
    index: '01',
    title: 'VC Interconnect',
    category: 'Website · Web App',
    year: '2026',
    featured: true,
  },
  {
    index: '02',
    title: 'Client Project 02',
    category: 'Landing Page',
    year: '2026',
  },
  {
    index: '03',
    title: 'Client Project 03',
    category: 'AI Automation',
    year: '2026',
  },
]

export function FeaturedWork() {
  return (
    <section
      id="work"
      style={{ padding: 'var(--s-24) var(--gutter)' }}
      aria-labelledby="work-heading"
    >
      <div style={{ maxWidth: 'var(--max-w)', margin: '0 auto' }}>
        <FadeUp>
          <div className="flex items-end justify-between mb-16 flex-wrap gap-6">
            <div>
              <span
                className="text-xs font-semibold tracking-widest uppercase block mb-3"
                style={{ color: 'var(--color-primary)' }}
              >
                Selected work
              </span>
              <h2
                id="work-heading"
                className="font-display font-black leading-tight tracking-tight"
                style={{ fontSize: 'var(--fs-3xl)', color: 'var(--color-text)' }}
              >
                Work
              </h2>
            </div>
            <p
              className="text-sm"
              style={{ color: 'var(--color-muted)' }}
            >
              3+ projects shipped · more coming soon
            </p>
          </div>
        </FadeUp>

        <div className="flex flex-col gap-px" style={{ backgroundColor: 'var(--color-border)' }}>
          {PROJECTS.map((project, i) => (
            <FadeUp key={project.index} delay={i * 80}>
              <div
                className="group flex flex-col gap-6 cursor-pointer transition-colors duration-300"
                style={{ backgroundColor: 'var(--color-bg)', padding: '0' }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = 'var(--color-surface)')
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = 'var(--color-bg)')
                }
              >
                {/* Image placeholder */}
                <div
                  className="w-full overflow-hidden"
                  style={{
                    aspectRatio: project.featured ? '21 / 8' : '16 / 7',
                    backgroundColor: 'var(--color-surface)',
                    borderBottom: '1px solid var(--color-border)',
                    position: 'relative',
                  }}
                >
                  <div
                    className="absolute inset-0 flex items-center justify-center"
                    style={{
                      backgroundImage: `
                        linear-gradient(var(--color-border) 1px, transparent 1px),
                        linear-gradient(90deg, var(--color-border) 1px, transparent 1px)
                      `,
                      backgroundSize: '40px 40px',
                      opacity: 0.4,
                    }}
                    aria-hidden="true"
                  />
                  <span
                    className="absolute inset-0 flex items-center justify-center text-xs font-mono tracking-widest uppercase"
                    style={{ color: 'var(--color-muted)' }}
                  >
                    {project.title} · {project.category}
                  </span>
                </div>

                {/* Meta row */}
                <div
                  className="flex items-center justify-between px-8 pb-8"
                >
                  <div className="flex items-center gap-6">
                    <span
                      className="font-mono text-xs"
                      style={{ color: 'var(--color-muted)' }}
                    >
                      {project.index} / {project.year}
                    </span>
                    <span
                      className="text-xs px-2 py-0.5"
                      style={{
                        color: 'var(--color-muted)',
                        border: '1px solid var(--color-border)',
                      }}
                    >
                      {project.category}
                    </span>
                  </div>

                  <div className="flex items-end gap-4">
                    <h3
                      className="font-display font-bold tracking-tight"
                      style={{
                        fontSize: 'var(--fs-xl)',
                        color: 'var(--color-text)',
                      }}
                    >
                      {project.title}
                    </h3>
                    <div
                      className="mb-1 w-8 h-8 rounded-full border flex items-center justify-center shrink-0 transition-all duration-300 group-hover:border-accent group-hover:rotate-45"
                      style={{
                        borderColor: 'var(--color-border)',
                        color: 'var(--color-muted)',
                      }}
                    >
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path
                          d="M2 10L10 2M10 2H4M10 2V8"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  )
}
