import type { Metadata } from 'next'

interface MetaOptions {
  title: string
  desc: string
  image?: string
  url?: string
}

export function generateMetaTags({ title, desc, image, url }: MetaOptions): Metadata {
  return {
    title,
    description: desc,
    openGraph: { title, description: desc, images: image ? [image] : [], url },
    twitter: { card: 'summary_large_image', title, description: desc, images: image ? [image] : [] },
  }
}

export function generateJsonLd(type: string, data: Record<string, unknown>): string {
  return JSON.stringify({ '@context': 'https://schema.org', '@type': type, ...data })
}
