import { ImageResponse } from 'next/og'

export const alt = 'ShapeKraft — Web Design, Development & AI Automation Studio'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          background: '#E97451',
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
              'linear-gradient(rgba(11,11,15,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(11,11,15,0.06) 1px, transparent 1px)',
            backgroundSize: '80px 80px',
            display: 'flex',
          }}
        />

        {/* Cream glow blob */}
        <div
          style={{
            position: 'absolute',
            top: -180,
            right: -120,
            width: 560,
            height: 560,
            borderRadius: '50%',
            background: '#FAF0E6',
            opacity: 0.45,
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
              border: '2px solid rgba(11,11,15,0.95)',
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
              background: 'rgba(11,11,15,0.95)',
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
              background: 'rgba(11,11,15,0.95)',
              marginLeft: -1,
              display: 'flex',
            }}
          />
        </div>

        {/* Wordmark */}
        <div
          style={{
            color: '#0B0B0F',
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
            color: '#26262D',
            fontSize: 28,
            fontWeight: 400,
            letterSpacing: '0.04em',
            display: 'flex',
            alignItems: 'center',
            gap: 16,
          }}
        >
          <span>Web Design · Development · AI Automation</span>
          <span
            style={{
              background: '#0B646C',
              border: '1px solid #084D53',
              color: '#FFFDF9',
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
            background: 'linear-gradient(90deg, #0B646C 0%, #FAF0E6 100%)',
            display: 'flex',
          }}
        />
      </div>
    ),
    { ...size },
  )
}
