import { SITE_URL, SITE_URL_IN, languages } from '@/lib/site'
import type { MetadataRoute } from 'next'

const routes: { path: string; changeFrequency: 'monthly' | 'yearly'; priority: number }[] = [
  { path: '/', changeFrequency: 'monthly', priority: 1 },
  { path: '/quote', changeFrequency: 'monthly', priority: 0.9 },
  { path: '/privacy', changeFrequency: 'yearly', priority: 0.3 },
  { path: '/terms', changeFrequency: 'yearly', priority: 0.3 },
]

// Lists every page on both hosts, each with the full hreflang set.
// Verify both www.shapekraft.co and www.shapekraft.in in Search Console so the
// cross-host entries are accepted.
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()
  return [SITE_URL, SITE_URL_IN].flatMap((origin) =>
    routes.map(({ path, changeFrequency, priority }) => ({
      url: path === '/' ? `${origin}/` : `${origin}${path}`,
      lastModified,
      changeFrequency,
      priority,
      alternates: { languages: languages(path) },
    })),
  )
}
