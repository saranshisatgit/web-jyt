'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import homeBlocks from '@/data/home-blocks.json'

/**
 * PIXEL MOSAIC + JOURNEY PIXEL DRAW
 *
 * All content lives in data/home-blocks.json (editable backend blocks):
 * the journey image pool, per-step resolution/grayscale, mega-menu items
 * and their images, and draw timings. Swap the JSON for an API later and
 * nothing here changes.
 *
 * PixelMosaic is the reusable engine: it paints one image as a pixel
 * mosaic where every block carries a color sampled from the image, drawn
 * with a hairline gap around it so each shape keeps a boundary. Blocks
 * sweep in on a diagonal with jitter and pop in with a soft overshoot —
 * the image is being drawn, not faded.
 */

// Tuning (in-code; the imagery + step mapping live in the JSON blocks).
const STEPS = 4
// Saturation lift — canvas averaging washes color out; nudge blocks
// away from gray so the image's own palette reads true.
const SAT_BOOST = 1.12
// Per-cell luminance jitter (±) — gives flat regions a woven texture.
const WEAVE_JITTER = 4
// Overshoot cap for the pop-in, as a fraction of the cell.
const POP_MAX = 1.06

// Decoded-image cache, so a src only ever loads once per session.
const IMG_CACHE = new Map<string, HTMLImageElement>()

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v)
const clamp255 = (v: number) => (v < 0 ? 0 : v > 255 ? 255 : v)

// easeOutBack — settles with a soft overshoot so tiles pop, not fade.
const easePop = (t: number) => {
  const c = 1.2
  const u = t - 1
  return 1 + (c + 1) * u * u * u + c * u * u
}

/**
 * PixelMosaic — one image, drawn as an animated pixel mosaic.
 * Redraws itself whenever src / cols / gray change or the canvas resizes.
 */
export function PixelMosaic({
  src,
  cols: colsProp,
  gray = 0,
  duration = homeBlocks.pixelation.durationMs,
}: {
  src: string
  cols: number
  gray?: number
  duration?: number
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imgRef = useRef<HTMLImageElement | null>(null)
  const [ready, setReady] = useState(false)
  const [nonce, setNonce] = useState(0) // forces a redraw on resize

  // Load (or pull from cache) the source image.
  useEffect(() => {
    let cancelled = false
    const cached = IMG_CACHE.get(src)
    if (cached) {
      imgRef.current = cached
      setReady(true)
      return
    }
    setReady(false)
    const img = new Image()
    img.decoding = 'async'
    img.onload = () => {
      if (cancelled) return
      IMG_CACHE.set(src, img)
      imgRef.current = img
      setReady(true)
    }
    img.onerror = () => {
      if (!cancelled) setReady(true) // a failed src just draws nothing
    }
    img.src = src
    return () => {
      cancelled = true
    }
  }, [src])

  // Redraw when the canvas element is resized.
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver(() => setNonce((n) => n + 1))
    ro.observe(canvas)
    return () => ro.disconnect()
  }, [])

  // The drawing itself.
  useEffect(() => {
    const canvas = canvasRef.current
    const img = imgRef.current
    if (!canvas || !img || !ready) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const cssW = canvas.clientWidth
    const cssH = canvas.clientHeight
    if (cssW < 2 || cssH < 2) return

    canvas.width = Math.round(cssW * dpr)
    canvas.height = Math.round(cssH * dpr)
    const W = canvas.width
    const H = canvas.height

    // Sample the image at block resolution — every block gets its own color.
    const cols = Math.max(4, Math.round(colsProp))
    const rows = Math.max(4, Math.round((cols * cssH) / cssW))
    const off = document.createElement('canvas')
    off.width = cols
    off.height = rows
    const octx = off.getContext('2d', { willReadFrequently: true })
    if (!octx) return
    // Cover-fit the source image into the cols x rows grid.
    const srcR = img.width / img.height
    const dstR = cols / rows
    let sx = 0
    let sy = 0
    let sw = img.width
    let sh = img.height
    if (srcR > dstR) {
      sw = img.height * dstR
      sx = (img.width - sw) / 2
    } else {
      sh = img.width / dstR
      sy = (img.height - sh) / 2
    }
    octx.drawImage(img, sx, sy, sw, sh, 0, 0, cols, rows)
    const data = octx.getImageData(0, 0, cols, rows).data

    const gap = Math.max(1, Math.round(dpr * 0.9)) // hairline boundary per shape
    const cw = W / cols
    const ch = H / rows
    const canRound = typeof ctx.roundRect === 'function'

    type Cell = { r: number; g: number; b: number; delay: number }
    // channel pipeline: saturate (away from gray) -> sketch-gray mix -> weave jitter
    const boost = (v: number, lum: number) => lum + (v - lum) * SAT_BOOST
    const grayed = (v: number, lum: number) => v + (lum - v) * gray
    const cells: Cell[] = []
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const i = (y * cols + x) * 4
        const lum = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]
        const jit = (Math.random() - 0.5) * 2 * WEAVE_JITTER
        cells.push({
          r: clamp255(grayed(boost(data[i], lum), lum) + jit),
          g: clamp255(grayed(boost(data[i + 1], lum), lum) + jit),
          b: clamp255(grayed(boost(data[i + 2], lum), lum) + jit),
          // diagonal sweep + jitter: reads like the image is being drawn
          delay: ((x + y) / (cols + rows - 2)) * 0.66 + Math.random() * 0.2,
        })
      }
    }

    const reduced =
      typeof matchMedia === 'function' &&
      matchMedia('(prefers-reduced-motion: reduce)').matches
    const start = performance.now()
    let raf = 0

    const paint = (now: number) => {
      const p = reduced ? 1 : clamp01((now - start) / duration)
      ctx.clearRect(0, 0, W, H)
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const cell = cells[y * cols + x]
          const local = clamp01((p - cell.delay) / 0.34)
          if (local <= 0) continue
          // pop with overshoot, clamped so the boundary survives the settle
          const e = Math.min(POP_MAX, easePop(local))
          const bw = Math.max(0, (cw - gap) * e)
          const bh = Math.max(0, (ch - gap) * e)
          const px = cw * x + (cw - bw) / 2
          const py = ch * y + (ch - bh) / 2
          ctx.fillStyle = `rgb(${Math.round(cell.r)} ${Math.round(cell.g)} ${Math.round(cell.b)})`
          if (canRound) {
            const rad = Math.min(2.5, bw * 0.14)
            ctx.beginPath()
            ctx.roundRect(px, py, bw, bh, rad)
            ctx.fill()
          } else {
            ctx.fillRect(px, py, bw, bh)
          }
        }
      }
      if (p < 1) raf = requestAnimationFrame(paint)
    }
    raf = requestAnimationFrame(paint)
    return () => cancelAnimationFrame(raf)
  }, [ready, nonce, src, colsProp, gray, duration])

  return <canvas ref={canvasRef} />
}

/**
 * JourneyPixelDraw — the "Sketch → shipment" bento cell visual.
 * One random real image per journey step (from the JSON pool), resolving
 * sketch -> full color with the step resolution map from the JSON.
 */
export function JourneyPixelDraw({ step }: { step: number }) {
  const { pool, colsPerStep, grayPerStep } = homeBlocks.pixelation.journey
  // Pick one random real image per journey step, once per mount.
  const srcs = useMemo(() => shuffle(pool).slice(0, STEPS), [pool])
  const i = Math.min(step, STEPS - 1)
  return (
    <div className="jdraw" aria-hidden>
      <PixelMosaic src={srcs[i]} cols={colsPerStep[i]} gray={grayPerStep[i]} />
      <span className="jdraw-tag">{`Step ${String(i + 1).padStart(2, '0')} / 0${STEPS}`}</span>
    </div>
  )
}
