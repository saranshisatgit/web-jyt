'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView, animate } from 'framer-motion'

// Public census edge reader (CORS-open, PII-free aggregates). Overridable via env.
const READER_URL =
  process.env.NEXT_PUBLIC_CENSUS_READER_URL || 'https://handloom-census-reader.onrender.com'

/**
 * "The living census" — animates the number of handloom artisans recorded so far,
 * read live from the open P2P census (public aggregates only). Counts up when it
 * scrolls into view; degrades gracefully to a quiet copy line if the feed is down.
 */
export function ArtisanCount() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px 0px' })
  const [target, setTarget] = useState<number | null>(null)
  const [failed, setFailed] = useState(false)
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    let alive = true
    fetch(`${READER_URL}/census/stats`, { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => {
        const n = d?.stats?.total?.weavers
        if (!alive) return
        if (typeof n === 'number' && n > 0) setTarget(n)
        else setFailed(true)
      })
      .catch(() => alive && setFailed(true))
    return () => {
      alive = false
    }
  }, [])

  useEffect(() => {
    if (target == null || !inView) return
    const controls = animate(0, target, {
      duration: 2.2,
      ease: [0.16, 1, 0.3, 1], // easeOutExpo — fast then settle
      onUpdate: (v) => setDisplay(Math.round(v)),
    })
    return () => controls.stop()
  }, [target, inView])

  return (
    <section className="kt-artisan-count" ref={ref}>
      <div className="kt-artisan-count-glow" />
      <div className="container">
        <motion.div
          className="kt-artisan-count-inner"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px 0px' }}
          transition={{ duration: 0.7 }}
        >
          <p className="kt-artisan-count-eyebrow">The living census</p>

          {failed ? (
            <div className="kt-artisan-count-number kt-artisan-count-number--soft">thousands</div>
          ) : (
            <div
              className="kt-artisan-count-number"
              aria-label={target ? `${target.toLocaleString('en-IN')} artisans recorded` : 'counting artisans'}
            >
              {(target == null ? 0 : display).toLocaleString('en-IN')}
            </div>
          )}

          <p className="kt-artisan-count-label">handloom artisans recorded — and counting</p>
          <p className="kt-artisan-count-sub">
            Every weaver we map becomes part of an open, living record of India&rsquo;s handloom
            heritage — updated as the census grows.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
