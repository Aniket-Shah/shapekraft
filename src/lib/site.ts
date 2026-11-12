// The one canonical origin for the site. Vercel 308-redirects the bare domain
// (shapekraft.co) to www, so every canonical, sitemap entry and schema @id must
// use the www host, or search engines get canonicals that point at redirects.
export const SITE_URL = 'https://www.shapekraft.co'
export const SITE_URL_IN = 'https://www.shapekraft.in'
