'use client'

import { useEffect, useRef } from 'react'

/**
 * MOON — a decorative REAL moon (NASA full-moon photo) that waxes as
 * you scroll. Hidden during the hero; once you scroll into the section
 * after the hero a thin sliver appears from the right edge, slides down
 * the right edge, grows, and fades in — ending as a large full moon at
 * the bottom of the page. Rendered inside `.vh` at z-index -1, so it
 * stays in the BACKGROUND behind every other element (text, cards,
 * header) and in front of the footer. Purely decorative:
 * pointer-events none, aria-hidden; static under prefers-reduced-motion.
 */

const RES = 320 // canvas draw resolution
const MARGIN = 24
const TOP_OFFSET = 84 // clear the sticky header at the top
const SIZE_MIN = 96
const SIZE_MAX = 176
const OPACITY_MIN = 0.45
const F_MIN = 0.18 // a slim waxing crescent at the top of the page
const SHADOW = 'rgba(8, 10, 16, 0.78)'
const MOON_SRC = '/images/moon.jpg'

/**
 * Draw the full-moon photo with the unlit side darkened. f is the phase:
 * 0 = new, 1 = full. The terminator is a half-ellipse (radius
 * r·|cos(πf)|) sweeping from the right limb (f=0) to the left limb
 * (f=1), so the lit sliver grows from the right — a waxing moon.
 */
function drawPhase(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  f: number
) {
  const cx = RES / 2
  const cy = RES / 2
  const r = RES / 2
  ctx.clearRect(0, 0, RES, RES)
  ctx.save()
  ctx.beginPath()
  ctx.arc(cx, cy, r, 0, Math.PI * 2)
  ctx.clip()
  ctx.drawImage(img, cx - r, cy - r, r * 2, r * 2)

  const rx = r * Math.abs(Math.cos(Math.PI * f))
  ctx.beginPath()
  ctx.moveTo(cx, cy - r)
  if (f <= 0.5) {
    // crescent → quarter: terminator bulges right, shadow on the left
    ctx.ellipse(cx, cy, rx, r, 0, -Math.PI / 2, Math.PI / 2)
  } else {
    // gibbous: terminator bulges left, shadow is a thin lens
    ctx.ellipse(cx, cy, rx, r, 0, (3 * Math.PI) / 2, Math.PI / 2, true)
  }
  ctx.arc(cx, cy, r, Math.PI / 2, (3 * Math.PI) / 2, false)
  ctx.closePath()
  ctx.fillStyle = SHADOW
  ctx.fill()
  ctx.restore()
}

export function MoonPhase() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const target = useRef({ x: 0, y: 0, size: SIZE_MIN, opacity: OPACITY_MIN, f: F_MIN })
  const pos = useRef({ x: 0, y: 0, size: SIZE_MIN, opacity: OPACITY_MIN, f: F_MIN })

  useEffect(() => {
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    if (!wrap || !canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const img = new Image()
    img.src = MOON_SRC

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const apply = () => {
      wrap.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0)`
      wrap.style.opacity = String(pos.current.opacity)
      canvas.style.width = `${pos.current.size}px`
      canvas.style.height = `${pos.current.size}px`
    }
    const draw = () => {
      const f = Math.min(1, Math.max(0, pos.current.f))
      drawPhase(ctx, img, f)
    }

    const compute = () => {
      const vw = window.innerWidth
      const vh = window.innerHeight
      // The journey starts at the bottom of the hero (top of the next
      // section): invisible during the hero, then waxing from there.
      const hero = document.querySelector<HTMLElement>('.vh .hero')
      const heroBottom = hero ? hero.getBoundingClientRect().bottom + window.scrollY : 0
      const max = Math.max(1, document.documentElement.scrollHeight - vh)
      const range = Math.max(1, max - heroBottom)
      const p = Math.min(1, Math.max(0, (window.scrollY - heroBottom) / range))
      const size = SIZE_MIN + (SIZE_MAX - SIZE_MIN) * p
      target.current = {
        f: F_MIN + (1 - F_MIN) * p,
        size,
        opacity: p <= 0 ? 0 : OPACITY_MIN + (1 - OPACITY_MIN) * p,
        x: vw - MARGIN - size, // right edge stays pinned, grows leftward
        y: TOP_OFFSET + (vh - MARGIN - size - TOP_OFFSET) * p,
      }
    }

    if (reduced) {
      // static: a mid-waxing moon below the header at the top-right
      const size = 128
      const t = { f: 0.55, size, opacity: 0.85, x: window.innerWidth - MARGIN - size, y: TOP_OFFSET }
      target.current = t
      pos.current = { ...t }
      apply()
      if (img.complete) draw()
      else img.onload = draw
      return
    }

    let raf = 0
    const tick = () => {
      // Recompute every frame (not just on scroll events): the page
      // height grows while scrolling (lazy content), so events alone
      // would leave the moon short of its final position near the end.
      compute()
      const s = 0.09
      pos.current.x += (target.current.x - pos.current.x) * s
      pos.current.y += (target.current.y - pos.current.y) * s
      pos.current.size += (target.current.size - pos.current.size) * s
      pos.current.opacity += (target.current.opacity - pos.current.opacity) * s
      pos.current.f += (target.current.f - pos.current.f) * s
      apply()
      if (img.complete) draw()
      raf = requestAnimationFrame(tick)
    }

    // first placement: jump straight to the start (no entrance drift)
    compute()
    pos.current = { ...target.current }
    apply()

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div className="vc-moon" ref={wrapRef} aria-hidden>
      <span className="vc-moon-glow" aria-hidden />
      <canvas className="vc-moon-canvas" ref={canvasRef} width={RES} height={RES} />
    </div>
  )
}