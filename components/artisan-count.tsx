'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView, animate } from 'framer-motion'
import { getCensusStats } from '@/app/map/actions'

/**
 * Fetch the live count of handloom artisans recorded in the open P2P census.
 * Returns { count, failed } — count is null until it resolves, failed flips true
 * if the feed is unreachable. Shared by the full section and the inline hero line.
 *
 * Reads through the `getCensusStats` server action rather than fetching the
 * reader from the browser: the durable reader node (census-node.jaalyantra.com)
 * serves the aggregates but emits no Access-Control-Allow-Origin header, so a
 * direct client fetch is blocked by CORS. Going through the server action makes
 * the request same-origin and reuses the exact node the map already reads.
 */
export function useCensusCount() {
  const [count, setCount] = useState<number | null>(null)
  const [failed, setFailed] = useState(false)
  useEffect(() => {
    let alive = true
    getCensusStats()
      .then((stats) => {
        const n = stats?.total?.weavers
        if (!alive) return
        if (typeof n === 'number' && n > 0) setCount(n)
        else setFailed(true)
      })
      .catch(() => alive && setFailed(true))
    return () => {
      alive = false
    }
  }, [])
  return { count, failed }
}

/**
 * Small inline census line for the hero — "Producing with N handloom artisans
 * mapped … and counting." Renders nothing until the live number resolves (so it
 * never flashes a placeholder), and stays hidden if the feed is down.
 */
export function ArtisanCensusLine() {
  const { count } = useCensusCount()
  if (count == null) return null
  return (
    <p className="kt-artisan-line">
      Producing with{' '}
      <strong>{count.toLocaleString('en-IN')}</strong> handloom artisans mapped across India
      <span className="kt-artisan-line-live" aria-hidden> · and counting</span>
    </p>
  )
}

/**
 * "The living census" — animates the number of handloom artisans recorded so far,
 * read live from the open P2P census (public aggregates only). Counts up when it
 * scrolls into view; degrades gracefully to a quiet copy line if the feed is down.
 */
export function ArtisanCount() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px 0px' })
  const { count: target, failed } = useCensusCount()
  const [display, setDisplay] = useState(0)

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
