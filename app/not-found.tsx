'use client'

import Link from 'next/link'
import { useBrand } from '@/app/context/brand-context'
import { Navbar } from '@/components/navbar'

export default function NotFound() {
  const brand = useBrand()

  return (
    <main>
      <Navbar />
      <section className="kt-section" style={{ minHeight: '70vh', display: 'flex', alignItems: 'center' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="kt-404-loom" aria-hidden>
            <svg width="120" height="120" viewBox="0 0 120 120" fill="none" style={{ margin: '0 auto' }}>
              <rect x="20" y="10" width="80" height="100" rx="4" stroke="var(--ink)" strokeWidth="1.5" fill="none" />
              <line x1="30" y1="30" x2="90" y2="30" stroke="var(--accent-soft)" strokeWidth="1" className="kt-404-thread" />
              <line x1="30" y1="46" x2="90" y2="46" stroke="var(--accent-soft)" strokeWidth="1" className="kt-404-thread" style={{ animationDelay: '0.15s' }} />
              <line x1="30" y1="62" x2="90" y2="62" stroke="var(--accent-soft)" strokeWidth="1" className="kt-404-thread" style={{ animationDelay: '0.3s' }} />
              <line x1="30" y1="78" x2="90" y2="78" stroke="var(--accent-soft)" strokeWidth="1" className="kt-404-thread" style={{ animationDelay: '0.45s' }} />
              <line x1="58" y1="30" x2="58" y2="78" stroke="var(--accent)" strokeWidth="2" strokeDasharray="4 4" opacity="0.6" className="kt-404-shuttle" />
              <circle cx="60" cy="60" r="20" stroke="var(--accent-deep)" strokeWidth="1" fill="none" strokeDasharray="2 4" opacity="0.3" className="kt-404-orb" />
            </svg>
          </div>

          <div className="kt-eyebrow" style={{ justifyContent: 'center', marginTop: '32px' }}>
            404 · thread lost
          </div>

          <h1 className="kt-display m" style={{ marginTop: '20px' }}>
            This loom is still working
          </h1>

          <p className="kt-404-verse" style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '21px',
            lineHeight: 1.6,
            maxWidth: '560px',
            margin: '20px auto 0',
            color: 'var(--ink-soft)',
          }}>
            Some threads lead nowhere — a warp without a weft, a path that was
            woven once and cut loose. The loom hums on, even when the pattern
            skips a beat.
          </p>

          <div style={{ marginTop: '40px', display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link className="kt-btn" href="/">Back to the warp</Link>
            <Link className="kt-btn ghost" href="/blog">Read the journal</Link>
            <Link className="kt-btn ghost" href="/contact">Find a thread</Link>
          </div>

          <style>{`
@keyframes kt-thread-weave {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.9; }
}
@keyframes kt-shuttle-glow {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 1; }
}
@keyframes kt-orb-pulse {
  0%, 100% { transform: scale(1); opacity: 0.2; }
  50% { transform: scale(1.1); opacity: 0.5; }
}
.kt-404-thread {
  animation: kt-thread-weave 2.5s ease-in-out infinite;
}
.kt-404-shuttle {
  animation: kt-shuttle-glow 2s ease-in-out infinite;
}
.kt-404-orb {
  animation: kt-orb-pulse 3s ease-in-out infinite;
  transform-origin: center;
}
          `}</style>
        </div>
      </section>
    </main>
  )
}
