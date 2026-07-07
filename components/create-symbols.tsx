/**
 * CREATE — the morphing story symbol.
 *
 * One big, soft glyph floating in the centre of the cinematic that MORPHS from
 * one textile symbol to the next as you scroll — each shape stands for a beat:
 *
 *   Inspire  → needle & thread   (the idea / the making)
 *   Design   → swatches          (the spec / pattern)
 *   Fabric   → a dress           (the finished cloth)
 *   Sell     → a storefront      (out to every channel)
 *   Get paid → a ₹ coin          (the payout)
 *
 * Real Phosphor fill-weight glyphs (MIT, no attribution), single-path so they
 * morph predictably. flubber interpolates the path between consecutive symbols
 * off scroll progress; the glyph fades in after the hero and clears at the end.
 * Sits above the canvas/scrim, below the copy, so text stays legible.
 */
"use client"

import { useMemo } from "react"
import { motion, useTransform, type MotionValue } from "framer-motion"
import { interpolate } from "flubber"

/* Phosphor fill-weight paths, viewBox 0 0 256 256, one per story beat. */
const SYMBOLS = [
  // needle & thread
  "M212.28,43.72a40,40,0,0,0-56.56,0l-24,24a8,8,0,0,0-2.23,4.3C120.69,123.28,36,208.73,34.36,210.33h0a8,8,0,0,0,11.31,11.32h0c.86-.87,86.83-86.31,138.32-95.15a8,8,0,0,0,4.3-2.23l24-24a40,40,0,0,0,0-56.56ZM189.66,77.66l-16,16a8,8,0,0,1-11.32-11.32l16-16a8,8,0,0,1,11.32,11.32Z",
  // swatches
  "M240,155.91a16,16,0,0,0-1-5.22L219.94,98.48A16,16,0,0,0,199.49,89l-67.81,24.57,12.08-69A16,16,0,0,0,130.84,26L76.17,16.25a15.94,15.94,0,0,0-18.47,13l-25,143.12A43.82,43.82,0,0,0,75.78,224H224a16,16,0,0,0,16-16ZM76,196a16,16,0,1,1,16-16A16,16,0,0,1,76,196Zm42.72-8.38,9.78-55.92L204.92,104,224,156.11,116.78,195A44.89,44.89,0,0,0,118.72,187.62ZM224,208H127.74L224,173.11Z",
  // dress
  "M66.26,80.23a15.26,15.26,0,0,1-1.65-12.17,15.54,15.54,0,0,1,2-4.76L88,32.7V8a8,8,0,0,1,8.53-8A8.17,8.17,0,0,1,104,8.27V32.42L109.25,39a23.91,23.91,0,0,0,19.13,9,24.67,24.67,0,0,0,18.71-9.43L152,32.42V8a8,8,0,0,1,8.53-8A8.17,8.17,0,0,1,168,8.27V32.7l21.42,30.6a15.54,15.54,0,0,1,2,4.76,15.26,15.26,0,0,1-1.65,12.17,1.74,1.74,0,0,0-.11.18l-13.86,21.74A4,4,0,0,1,172.4,104H83.6a4,4,0,0,1-3.37-1.85L66.37,80.41A1.74,1.74,0,0,0,66.26,80.23Zm148.5,129.56a2.52,2.52,0,0,0-.15-.34L173.69,122.3a4,4,0,0,0-3.63-2.3H85.94a4,4,0,0,0-3.63,2.3L41.39,209.45a2.52,2.52,0,0,0-.15.34A16.19,16.19,0,0,0,41.6,223,16,16,0,0,0,56,232H200a16,16,0,0,0,14.39-9A16.19,16.19,0,0,0,214.76,209.79Z",
  // storefront
  "M231.69,93.81,217.35,43.6A16.07,16.07,0,0,0,202,32H54A16.07,16.07,0,0,0,38.65,43.6L24.31,93.81A7.94,7.94,0,0,0,24,96v16a40,40,0,0,0,16,32v72a8,8,0,0,0,8,8H208a8,8,0,0,0,8-8V144a40,40,0,0,0,16-32V96A7.94,7.94,0,0,0,231.69,93.81ZM88,112a24,24,0,0,1-35.12,21.26,7.88,7.88,0,0,0-1.82-1.06A24,24,0,0,1,40,112v-8H88Zm64,0a24,24,0,0,1-48,0v-8h48Zm64,0a24,24,0,0,1-11.07,20.2,8.08,8.08,0,0,0-1.8,1.05A24,24,0,0,1,168,112v-8h48Z",
  // ₹ coin
  "M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm38.32,72H176a8,8,0,0,1,0,16h-8.19A44.06,44.06,0,0,1,124,152H111.32l53.59,41.69a8,8,0,1,1-9.82,12.62l-72-56A8,8,0,0,1,88,136h36a28,28,0,0,0,27.71-24H88a8,8,0,0,1,0-16h61.29A28,28,0,0,0,124,80H88a8,8,0,0,1,0-16h88a8,8,0,0,1,0,16H157.92A43.87,43.87,0,0,1,166.32,96Z",
]

const START = 1 / 6 // symbols begin once the hero (beat 0) has dissolved
const MORPH_END = 0.9 // the final coin is fully formed here, then it holds…
const clamp01 = (v: number) => Math.max(0, Math.min(1, v))
const smoothstep = (v: number, a: number, b: number) => {
  const t = clamp01((v - a) / (b - a))
  return t * t * (3 - 2 * t)
}

export function CreateSymbols({ progress }: { progress: MotionValue<number> }) {
  const interps = useMemo(
    () => SYMBOLS.slice(0, -1).map((s, i) => interpolate(s, SYMBOLS[i + 1], { maxSegmentLength: 3 })),
    []
  )

  const d = useTransform(progress, (p) => {
    const sp = clamp01((p - START) / (MORPH_END - START))
    const idx = sp * (SYMBOLS.length - 1) // 0…4
    const seg = Math.max(0, Math.min(interps.length - 1, Math.floor(idx)))
    return interps[seg](idx - seg)
  })

  // fade in after the hero; hold the coin through "get paid"; then clear
  const opacity = useTransform(progress, (p) =>
    smoothstep(p, START, START + 0.05) * (1 - smoothstep(p, 0.96, 1.0)) * 0.92
  )

  return (
    <motion.div className="cin-symbol" style={{ opacity }} aria-hidden>
      <svg viewBox="0 0 256 256" width="100%" height="100%">
        <defs>
          <linearGradient id="cin-sym-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#9cbaea" />
            <stop offset="1" stopColor="#5475b4" />
          </linearGradient>
        </defs>
        <motion.path
          d={d}
          fill="url(#cin-sym-grad)"
          fillOpacity={0.16}
          fillRule="evenodd"
          stroke="url(#cin-sym-grad)"
          strokeOpacity={0.7}
          strokeWidth={1.4}
          strokeLinejoin="round"
        />
      </svg>
    </motion.div>
  )
}

export default CreateSymbols
