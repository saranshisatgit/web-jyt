/**
 * EDITIONS — abstract geometric glyph.
 *
 * A "strange" composition of triangles and circles that rotate, breathe and
 * morph, with small shapes orbiting around them (content passing around). Each
 * section walks through a different `variant`, so the glyph changes shape as you
 * move down the page. Pure SVG + framer-motion; honours prefers-reduced-motion
 * (renders the static composition).
 */
"use client"

import { motion, useReducedMotion } from "framer-motion"

type VariantCfg = {
  sides: number // core polygon sides (3=triangle … high=circle-ish)
  spin: number // seconds per rotation (sign = direction)
  ring: "solid" | "dashed"
  orbiters: number
  hue: number // periwinkle-family oklch hue
}

// Eight symbolic shapes — one per editions section, cycled by index.
const VARIANTS: VariantCfg[] = [
  { sides: 3, spin: 34, ring: "dashed", orbiters: 3, hue: 264 },
  { sides: 4, spin: -28, ring: "solid", orbiters: 4, hue: 258 },
  { sides: 6, spin: 40, ring: "dashed", orbiters: 5, hue: 250 },
  { sides: 3, spin: -36, ring: "solid", orbiters: 3, hue: 272 },
  { sides: 5, spin: 30, ring: "dashed", orbiters: 4, hue: 244 },
  { sides: 8, spin: -44, ring: "solid", orbiters: 6, hue: 262 },
  { sides: 4, spin: 26, ring: "dashed", orbiters: 3, hue: 254 },
  { sides: 3, spin: -32, ring: "solid", orbiters: 5, hue: 268 },
]

function polygonPoints(sides: number, r: number, cx = 100, cy = 100) {
  const pts: string[] = []
  for (let i = 0; i < sides; i++) {
    const a = (i / sides) * Math.PI * 2 - Math.PI / 2
    pts.push(`${(cx + Math.cos(a) * r).toFixed(2)},${(cy + Math.sin(a) * r).toFixed(2)}`)
  }
  return pts.join(" ")
}

export function EditionsGlyph({ variant = 0, size = 320 }: { variant?: number; size?: number }) {
  const reduce = useReducedMotion()
  const cfg = VARIANTS[((variant % VARIANTS.length) + VARIANTS.length) % VARIANTS.length]
  const stroke = `oklch(0.62 0.13 ${cfg.hue})`
  const soft = `oklch(0.78 0.08 ${cfg.hue})`
  const fill = `oklch(0.62 0.14 ${cfg.hue} / 0.10)`

  const spin = (dur: number) =>
    reduce
      ? undefined
      : { rotate: dur > 0 ? 360 : -360, transition: { duration: Math.abs(dur), ease: "linear" as const, repeat: Infinity } }

  return (
    <div className="kt-editions-glyph" aria-hidden style={{ width: size, height: size }}>
      <svg viewBox="0 0 200 200" width={size} height={size}>
        {/* outer ring, counter-rotating */}
        <motion.circle
          cx={100} cy={100} r={82}
          fill="none" stroke={soft} strokeWidth={1}
          strokeDasharray={cfg.ring === "dashed" ? "3 7" : undefined}
          style={{ transformOrigin: "100px 100px" }}
          animate={spin(-cfg.spin * 1.4)}
        />

        {/* core morphing polygon */}
        <motion.polygon
          points={polygonPoints(cfg.sides, 54)}
          fill={fill} stroke={stroke} strokeWidth={1.5}
          strokeLinejoin="round"
          style={{ transformOrigin: "100px 100px" }}
          animate={
            reduce
              ? undefined
              : { rotate: cfg.spin > 0 ? 360 : -360, scale: [1, 1.06, 1], transition: {
                  rotate: { duration: Math.abs(cfg.spin), ease: "linear", repeat: Infinity },
                  scale: { duration: 6, ease: "easeInOut", repeat: Infinity },
                } }
          }
        />

        {/* inner circle, breathing */}
        <motion.circle
          cx={100} cy={100} r={22}
          fill="none" stroke={stroke} strokeWidth={1.5}
          style={{ transformOrigin: "100px 100px" }}
          animate={reduce ? undefined : { scale: [1, 0.82, 1], opacity: [0.9, 0.5, 0.9], transition: { duration: 5, ease: "easeInOut", repeat: Infinity } }}
        />

        {/* orbiters — small shapes passing around */}
        <motion.g
          style={{ transformOrigin: "100px 100px" }}
          animate={spin(cfg.spin * 0.8)}
        >
          {Array.from({ length: cfg.orbiters }).map((_, i) => {
            const a = (i / cfg.orbiters) * Math.PI * 2
            const R = 82
            const x = 100 + Math.cos(a) * R
            const y = 100 + Math.sin(a) * R
            const isTri = i % 2 === 0
            return isTri ? (
              <polygon key={i} points={polygonPoints(3, 5, x, y)} fill={soft} opacity={0.9} />
            ) : (
              <circle key={i} cx={x} cy={y} r={3.4} fill={stroke} opacity={0.9} />
            )
          })}
        </motion.g>
      </svg>
    </div>
  )
}
