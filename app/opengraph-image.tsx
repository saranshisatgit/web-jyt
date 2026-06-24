import { ImageResponse } from 'next/og'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0a0a0a',
          color: '#f5f0e8',
          fontFamily: 'serif',
          padding: 80,
        }}
      >
        <div
          style={{
            fontSize: 72,
            letterSpacing: '-0.03em',
            lineHeight: 1.1,
            textAlign: 'center',
            fontWeight: 400,
          }}
        >
          Jaal Yantra Textiles
        </div>
        <div
          style={{
            fontSize: 28,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginTop: 24,
            opacity: 0.7,
          }}
        >
          Close every gap
        </div>
      </div>
    ),
    { ...size }
  )
}
