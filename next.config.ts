import type { NextConfig } from 'next'
import { HOST_CO, HOST_IN, PAGES, SITE_URL, SITE_URL_IN, linkHeader } from './src/lib/site'

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
      // Per-host canonical + hreflang (see src/lib/site.ts for why headers).
      ...PAGES.flatMap((path) => [
        {
          source: path,
          has: [{ type: 'host' as const, value: HOST_CO }],
          headers: [{ key: 'Link', value: linkHeader(SITE_URL, path) }],
        },
        {
          source: path,
          has: [{ type: 'host' as const, value: HOST_IN }],
          headers: [{ key: 'Link', value: linkHeader(SITE_URL_IN, path) }],
        },
      ]),
    ]
  },
}

export default nextConfig
