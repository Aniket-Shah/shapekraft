import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'ShapeKraft — Digital Engineering Studio'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          background: '#080808',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: '80px',
          position: 'relative',
          fontFamily: 'system-ui, sans-serif',
          overflow: 'hidden',
        }}
      >
        {/* Subtle grid overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
            backgroundSize: '80px 80px',
            display: 'flex',
          }}
        />

        {/* Purple glow blob */}
        <div
          style={{
            position: 'absolute',
            top: -180,
            right: -120,
            width: 560,
            height: 560,
            borderRadius: '50%',
            background: '#7C3AED',
            opacity: 0.18,
            display: 'flex',
            filter: 'blur(80px)',
          }}
        />

        {/* Diamond logo mark */}
        <div
          style={{
            position: 'relative',
            width: 56,
            height: 56,
            marginBottom: 36,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              border: '2px solid rgba(255,255,255,0.9)',
              transform: 'rotate(45deg)',
              display: 'flex',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: 0,
              right: 0,
              height: 2,
              background: 'rgba(255,255,255,0.9)',
              marginTop: -1,
              display: 'flex',
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: 0,
              bottom: 0,
              width: 2,
              background: 'rgba(255,255,255,0.9)',
              marginLeft: -1,
              display: 'flex',
            }}
          />
        </div>

        {/* Wordmark */}
        <div
          style={{
            color: '#f0f0f0',
            fontSize: 86,
            fontWeight: 900,
            letterSpacing: '-3px',
            lineHeight: 1,
            marginBottom: 22,
            display: 'flex',
          }}
        >
          ShapeKraft
        </div>

        {/* Tagline */}
        <div
          style={{
            color: '#6a6a6a',
            fontSize: 28,
            fontWeight: 400,
            letterSpacing: '0.04em',
            display: 'flex',
            alignItems: 'center',
            gap: 16,
          }}
        >
          <span>Digital Engineering Studio</span>
          <span
            style={{
              background: 'rgba(124,58,237,0.2)',
              border: '1px solid rgba(124,58,237,0.4)',
              color: '#A78BFA',
              fontSize: 18,
              fontWeight: 500,
              padding: '4px 16px',
              borderRadius: 100,
              letterSpacing: '0.08em',
              display: 'flex',
            }}
          >
            shapekraft.co
          </span>
        </div>

        {/* Bottom accent bar */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 4,
            background: 'linear-gradient(90deg, #7C3AED 0%, #A78BFA 100%)',
            display: 'flex',
          }}
        />
      </div>
    ),
    { ...size },
  )
}
