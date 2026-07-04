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
            <svg
  width="140"
  height="140"
  viewBox="0 0 140 140"
  fill="none"
  style={{ margin: "0 auto" }}
>
  {/* Frame */}
  <rect
    x="22"
    y="12"
    width="96"
    height="116"
    rx="5"
    stroke="var(--ink)"
    strokeWidth="2"
  />

  {/* Top Beam */}
  <rect
    x="30"
    y="18"
    width="80"
    height="6"
    rx="2"
    fill="var(--ink)"
    opacity=".18"
  />

  {/* Bottom Beam */}
  <rect
    x="30"
    y="116"
    width="80"
    height="6"
    rx="2"
    fill="var(--ink)"
    opacity=".18"
  />

  {/* Warp Threads */}
  {[38,46,54,62,70,78,86,94,102].map((x,i)=>(
    <line
      key={i}
      x1={x}
      y1="24"
      x2={x}
      y2="116"
      stroke="var(--accent-soft)"
      strokeWidth="1.1"
      className="loom-thread"
      style={{ animationDelay:`${i*0.08}s` }}
    />
  ))}

  {/* Heddle Bars */}
  <line
    x1="34"
    y1="48"
    x2="106"
    y2="48"
    stroke="var(--ink)"
    strokeWidth="1.5"
    opacity=".4"
  />

  <line
    x1="34"
    y1="70"
    x2="106"
    y2="70"
    stroke="var(--ink)"
    strokeWidth="1.5"
    opacity=".4"
  />

  {/* Woven Fabric */}
  <g opacity=".95">
    {[84,90,96,102,108].map((y,i)=>(
      <line
        key={i}
        x1="34"
        y1={y}
        x2="106"
        y2={y}
        stroke={i%2===0 ? "var(--accent)" : "var(--accent-deep)"}
        strokeWidth="2"
      />
    ))}
  </g>

  {/* Shuttle */}
  <g className="loom-shuttle">
    <rect
      x="48"
      y="58"
      width="18"
      height="8"
      rx="4"
      fill="var(--accent)"
    />
    <circle
      cx="50"
      cy="62"
      r="1.2"
      fill="white"
      opacity=".8"
    />
    <circle
      cx="64"
      cy="62"
      r="1.2"
      fill="white"
      opacity=".8"
    />
  </g>

  {/* Flying Thread */}
  <path
    d="M66 62 H92"
    stroke="var(--accent)"
    strokeWidth="1.5"
    strokeDasharray="3 3"
    className="loom-weft"
  />

  {/* Decorative Corners */}
  <circle cx="22" cy="12" r="2" fill="var(--ink)" opacity=".25"/>
  <circle cx="118" cy="12" r="2" fill="var(--ink)" opacity=".25"/>
  <circle cx="22" cy="128" r="2" fill="var(--ink)" opacity=".25"/>
  <circle cx="118" cy="128" r="2" fill="var(--ink)" opacity=".25"/>
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
.loom-thread {
  opacity: .7;
  animation: threadPulse 2.2s ease-in-out infinite;
}
.loom-shuttle {
  animation: shuttleMove 1.8s ease-in-out infinite alternate;
  transform-box: fill-box;
  transform-origin: center;
}
.loom-weft {
  animation: weave 1.8s linear infinite;
}
@keyframes shuttleMove {
  from { transform: translateX(-18px); }
  to   { transform: translateX(34px); }
}
@keyframes weave {
  from { stroke-dashoffset: 18; }
  to   { stroke-dashoffset: 0; }
}
@keyframes threadPulse {
  0%, 100% { opacity: .45; }
  50%      { opacity: 1; }
}
          `}</style>
        </div>
      </section>
    </main>
  )
}
