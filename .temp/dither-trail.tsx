'use client'

import { useEffect, useRef } from 'react'

/**
 * DITHER TRAIL — a soft trail that follows the pointer and breaks into chunky
 * ordered-dither dots as it fades: wide and solid near the cursor, thinning
 * into scattered specks toward the tail.
 *
 * Unlike the Dithering component (a Bayer filter over a photo/video with a
 * cursor lens), this uses the dither pattern as the RENDERER for a live
 * decaying field — there is no image involved. Each frame the field decays;
 * a pointer deposit adds intensity around the cursor. Cells whose intensity
 * clears their Bayer threshold light up as chunky squares, so a saturated
 * region reads as a solid block and a fading region scatters into specks.
 *
 * Pointer: mouse follows on hover. Touch: dragging splats, a single tap does
 * not (a drag shorter than TAP_SLOP is ignored).
 */

const CELL = 4 // chunky cell size (px)
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5] // 4×4 ordered matrix
const RADIUS = 64 // deposit radius — wide near the cursor
const DECAY = 0.9 // per-frame field decay
const STRENGTH = 0.95
const TAP_SLOP = 8 // px — drags shorter than this are a tap, not a splat

export function DitherTrail({ color = '#4670bc', maxOpacity = 0.4 }: { color?: string; maxOpacity?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const canvas = canvasRef.current
    if (!canvas || reduced) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const c = canvas // non-null binding for the closures below

    let w = 0
    let h = 0
    let cols = 0
    let rows = 0
    let field = new Float32Array(0)
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    function resize() {
      const rect = c.getBoundingClientRect()
      w = Math.max(1, Math.floor(rect.width))
      h = Math.max(1, Math.floor(rect.height))
      c.width = Math.floor(w * dpr)
      c.height = Math.floor(h * dpr)
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
      cols = Math.ceil(w / CELL)
      rows = Math.ceil(h / CELL)
      field = new Float32Array(cols * rows)
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    function deposit(x: number, y: number) {
      const c0 = Math.floor(x / CELL)
      const r0 = Math.floor(y / CELL)
      const rad = Math.ceil(RADIUS / CELL)
      for (let r = r0 - rad; r <= r0 + rad; r++) {
        for (let c = c0 - rad; c <= c0 + rad; c++) {
          if (c < 0 || r < 0 || c >= cols || r >= rows) continue
          const dx = c * CELL + CELL / 2 - x
          const dy = r * CELL + CELL / 2 - y
          const d = Math.sqrt(dx * dx + dy * dy)
          if (d > RADIUS) continue
          const i = r * cols + c
          const v = field[i] + (1 - d / RADIUS) * STRENGTH
          field[i] = v > 1 ? 1 : v
        }
      }
    }

    function line(x0: number, y0: number, x1: number, y1: number) {
      const dist = Math.hypot(x1 - x0, y1 - y0)
      const steps = Math.max(1, Math.ceil(dist / (CELL * 0.5)))
      for (let i = 1; i <= steps; i++) {
        deposit(x0 + ((x1 - x0) * i) / steps, y0 + ((y1 - y0) * i) / steps)
      }
    }

    let down = false
    let dragX = 0
    let dragY = 0
    let lastX = 0
    let lastY = 0
    let hasLast = false

    function local(e: PointerEvent) {
      const r = c.getBoundingClientRect()
      const x = e.clientX - r.left
      const y = e.clientY - r.top
      const inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom
      return { x, y, inside }
    }

    function onMove(e: PointerEvent) {
      const { x, y, inside } = local(e)
      if (!inside) {
        hasLast = false
        return
      }
      if (e.pointerType === 'touch') {
        if (!down) return
        if (Math.hypot(x - dragX, y - dragY) < TAP_SLOP) return
      }
      if (hasLast) line(lastX, lastY, x, y)
      else deposit(x, y)
      lastX = x
      lastY = y
      hasLast = true
    }
    function onDown(e: PointerEvent) {
      if (e.pointerType !== 'touch') return
      down = true
      const { x, y } = local(e)
      dragX = x
      dragY = y
      hasLast = false
    }
    function onUp(e: PointerEvent) {
      if (e.pointerType === 'touch') {
        down = false
        hasLast = false
      }
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerdown', onDown, { passive: true })
    window.addEventListener('pointerup', onUp, { passive: true })
    window.addEventListener('pointercancel', onUp, { passive: true })

    let raf = 0
    function frame() {
      raf = requestAnimationFrame(frame)
      ctx!.clearRect(0, 0, w, h)
      ctx!.fillStyle = color
      for (let r = 0; r < rows; r++) {
        const base = r * cols
        for (let c = 0; c < cols; c++) {
          const i = base + c
          const f = field[i]
          if (f <= 0.002) {
            field[i] = 0
            continue
          }
          field[i] = f * DECAY
          const th = (BAYER[((r & 3) << 2) + (c & 3)] + 0.5) / 16
          if (f > th) {
            const a = Math.min(1, (f - th) / (1 - th + 0.02))
            ctx!.globalAlpha = a * maxOpacity
            ctx!.fillRect(c * CELL, r * CELL, CELL, CELL)
          }
        }
      }
      ctx!.globalAlpha = 1
    }
    frame()

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)
    }
  }, [color, maxOpacity])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }}
    />
  )
}