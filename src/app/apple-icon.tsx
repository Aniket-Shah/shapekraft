import { ImageResponse } from 'next/og'

// 180×180 PNG of the ShapeKraft mark. Serves as the Apple touch icon and as the
// raster logo in Organization schema (Google needs a logo of at least 112×112).
export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#FAF0E6',
        }}
      >
        <svg width="132" height="146" viewBox="0 0 140 155" fill="none">
          <g stroke="#0B0B0F" strokeWidth="5">
            <rect x="20" y="15" width="100" height="100" />
            <polygon points="70,15 120,65 70,115 20,65" fill="none" />
            <line x1="20" y1="65" x2="120" y2="65" />
            <line x1="70" y1="15" x2="70" y2="115" />
            <path d="M4,92 L4,137 L44,137" fill="none" strokeLinecap="square" />
          </g>
        </svg>
      </div>
    ),
    size,
  )
}
