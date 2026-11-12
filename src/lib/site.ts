// Two hosts serve the same static build:
//   www.shapekraft.co -> international (hreflang "en", also x-default)
//   www.shapekraft.in -> India (hreflang "en-IN")
// The bare domains 308-redirect to www. Because the build is static, the HTML
// cannot know which host it is on, so the canonical and hreflang tags are sent
// as HTTP Link headers per host (next.config.ts) and listed in the sitemap.
// Do NOT add `alternates.canonical` to page metadata: an HTML canonical would
// point .in pages at .co and cancel the hreflang.
export const SITE_URL = 'https://www.shapekraft.co'
export const SITE_URL_IN = 'https://www.shapekraft.in'

export const HOST_CO = 'www.shapekraft.co'
export const HOST_IN = 'www.shapekraft.in'

/** Indexable routes. Add new pages here so they get canonical + hreflang. */
export const PAGES = ['/', '/quote', '/privacy', '/terms'] as const

const abs = (origin: string, path: string) =>
  path === '/' ? `${origin}/` : `${origin}${path}`

/** Link header value: self canonical for `origin`, plus the hreflang set. */
export function linkHeader(origin: string, path: string): string {
  return [
    `<${abs(origin, path)}>; rel="canonical"`,
    `<${abs(SITE_URL, path)}>; rel="alternate"; hreflang="en"`,
    `<${abs(SITE_URL_IN, path)}>; rel="alternate"; hreflang="en-IN"`,
    `<${abs(SITE_URL, path)}>; rel="alternate"; hreflang="x-default"`,
  ].join(', ')
}

/** hreflang map for sitemap entries. */
export function languages(path: string): Record<string, string> {
  return {
    en: abs(SITE_URL, path),
    'en-IN': abs(SITE_URL_IN, path),
    'x-default': abs(SITE_URL, path),
  }
}
