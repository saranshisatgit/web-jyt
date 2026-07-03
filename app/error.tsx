'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import * as Sentry from '@sentry/nextjs'

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <main>
      <section className="kt-section" style={{ minHeight: '70vh', display: 'flex', alignItems: 'center' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="kt-error-loom" aria-hidden>
            <svg width="120" height="120" viewBox="0 0 120 120" fill="none" style={{ margin: '0 auto' }}>
              <rect x="20" y="10" width="80" height="100" rx="4" stroke="var(--ink)" strokeWidth="1.5" fill="none" />
              <line x1="30" y1="30" x2="90" y2="30" stroke="var(--accent-soft)" strokeWidth="1" className="kt-error-thread" />
              <line x1="30" y1="46" x2="70" y2="46" stroke="var(--accent-soft)" strokeWidth="1" className="kt-error-thread" />
              <line x1="76" y1="46" x2="90" y2="46" stroke="var(--err)" strokeWidth="1.5" strokeDasharray="2 3" opacity="0.7" />
              <line x1="30" y1="62" x2="90" y2="62" stroke="var(--accent-soft)" strokeWidth="1" className="kt-error-thread" />
              <line x1="30" y1="78" x2="90" y2="78" stroke="var(--accent-soft)" strokeWidth="1" className="kt-error-thread" style={{ animationDelay: '0.3s' }} />
              <circle cx="76" cy="46" r="4" fill="var(--accent-deep)" opacity="0.6" className="kt-error-knot" />
            </svg>
          </div>

          <div className="kt-eyebrow" style={{ justifyContent: 'center', marginTop: '32px' }}>
            server error · thread snapped
          </div>

          <h1 className="kt-display m" style={{ marginTop: '20px' }}>
            A thread came loose
          </h1>

          <p className="kt-error-verse" style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '21px',
            lineHeight: 1.6,
            maxWidth: '560px',
            margin: '20px auto 0',
            color: 'var(--ink-soft)',
          }}>
            Sometimes a thread snaps under tension. The loom stops, the pattern
            holds its breath — and a weaver steps in to tie the knot. Give it
            another try, or come back to the warp.
          </p>

          <div style={{ marginTop: '16px' }}>
            <p style={{ fontSize: '14px', color: 'var(--ink-mute)', fontFamily: 'var(--font-mono)', letterSpacing: '0.04em' }}>
              {error.digest ? `ref: ${error.digest}` : null}
            </p>
          </div>

          <div style={{ marginTop: '36px', display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button type="button" className="kt-btn" onClick={reset}>Weave again</button>
            <Link className="kt-btn ghost" href="/">Back to the warp</Link>
          </div>

          <style>{`
@keyframes kt-error-weave {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.9; }
}
@keyframes kt-error-knot-pulse {
  0%, 100% { transform: scale(1); opacity: 0.4; }
  50% { transform: scale(1.3); opacity: 0.8; }
}
.kt-error-thread {
  animation: kt-error-weave 2.5s ease-in-out infinite;
}
.kt-error-knot {
  animation: kt-error-knot-pulse 2s ease-in-out infinite;
  transform-origin: center;
}
          `}</style>
        </div>
      </section>
    </main>
  )
}
