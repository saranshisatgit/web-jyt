/**
 * CREATE — one continuous, scroll-scrubbed cinematic.
 *
 * The hero is the FIRST beat of the movie, not a separate block: its copy sits
 * over a calm particle field and dissolves as you scroll into the story. From
 * there a single pinned WebGL scene carries five beats —
 *
 *   Hero → Inspire → Design → Fabric → Sell → Get paid
 *
 * — with the fabric resolving out of the particles and, at the end, warm coins
 * rising off the cloth while a payout meter counts up. Everything is scrubbed
 * off scroll progress so it tracks the scrollbar 1:1.
 *
 * This component is server-rendered (hero H1 + all copy ship in the HTML for
 * SEO); only <CreateCanvas> is a nested dynamic(ssr:false) client import.
 * Honours prefers-reduced-motion (plain stacked read, no canvas).
 */
"use client"

import { useEffect, useRef, useState } from "react"
import dynamic from "next/dynamic"
import Link from "next/link"
import { Button } from "@medusajs/ui"
import { motion, useScroll, useMotionValueEvent, useTransform, AnimatePresence } from "framer-motion"
import type { HeroData } from "@/app/create/page"
import { CreateSymbols } from "./create-symbols"

const CreateCanvas = dynamic(() => import("./create-canvas").then((m) => m.CreateCanvas), {
  ssr: false,
  loading: () => <div className="cin-canvas-boot" aria-hidden />,
})

/* ─── the five story beats (beat 0 is the hero) ──────────────────────────── */

type Stage = { label: string; title: string; blurb: string }

const STAGES: Stage[] = [
  { label: "Inspire", title: "From the art that moves you", blurb: "A sketch, a photo, a museum plate. The system reads palette, motif and mood — and turns a spark into a brief." },
  { label: "Design", title: "Woven into a spec", blurb: "Pattern, colourway, bill of materials and sizes resolve into a techpack a vetted atelier can run — no loose files." },
  { label: "Fabric", title: "Made real, thread by thread", blurb: "Cloth comes off the loom with a passport attached — verifiable provenance from the first idea to the last stitch." },
  { label: "Sell", title: "Live on every surface at once", blurb: "Your storefront goes live on your domain, WhatsApp, Instagram and AI agents together. Update once, sell everywhere." },
  { label: "Get paid", title: "Paid the moment it ships", blurb: "Fair splits, instant payouts — to UPI, wallet or cash pickup. The maker keeps the lion’s share, every order." },
]

const BEATS = STAGES.length + 1 // + hero

/* ─── payout meter for the final beat ────────────────────────────────────── */

const PAYOUT_TARGET = 24800
const MAKER_PCT = 90

function PayoutMeter({ progress }: { progress: number }) {
  // progress is 0…1 across the whole cinematic; the payout beat is the last slice
  const local = Math.max(0, Math.min(1, (progress - (STAGES.length - 1) / BEATS) * BEATS))
  const paid = Math.round(PAYOUT_TARGET * local)
  const inr = paid.toLocaleString("en-IN")
  return (
    <div className="cin-payout" aria-hidden>
      <div className="cin-payout-amount">
        <span className="cin-payout-cur">₹</span>
        {inr}
      </div>
      <div className="cin-payout-bar">
        <span className="cin-payout-bar-fill" style={{ width: `${MAKER_PCT}%`, opacity: 0.4 + local * 0.6 }} />
      </div>
      <div className="cin-payout-legend">
        <span><i className="cin-dot cin-dot--maker" /> Maker keeps {MAKER_PCT}%</span>
        <span><i className="cin-dot cin-dot--fee" /> Platform {100 - MAKER_PCT}%</span>
      </div>
    </div>
  )
}

/* ─── reduced-motion helper ──────────────────────────────────────────────── */

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReduced(mq.matches)
    const on = () => setReduced(mq.matches)
    mq.addEventListener("change", on)
    return () => mq.removeEventListener("change", on)
  }, [])
  return reduced
}

/* ─── the section ────────────────────────────────────────────────────────── */

export function CreateCinematic({ hero }: { hero: HeroData }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = usePrefersReducedMotion()
  const progressRef = useRef(0)
  const pointerRef = useRef({ x: 0, y: 0 })
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] })
  const [active, setActive] = useState(0) // 0 = hero, 1…5 = stages
  const [rawP, setRawP] = useState(0)

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    progressRef.current = v
    setRawP(v)
    const i = Math.min(BEATS - 1, Math.max(0, Math.floor(v * BEATS + 0.0001)))
    if (i !== active) setActive(i)
  })

  // pointer parallax — the scene (particles + camera + art) leans toward the cursor
  useEffect(() => {
    if (reduced) return
    const el = ref.current
    if (!el) return
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      const cx = window.innerWidth / 2
      const cy = window.innerHeight / 2
      pointerRef.current = {
        x: Math.max(-1, Math.min(1, (e.clientX - cx) / cx)),
        y: Math.max(-1, Math.min(1, (e.clientY - cy) / cy)),
      }
    }
    window.addEventListener("pointermove", onMove, { passive: true })
    return () => window.removeEventListener("pointermove", onMove)
  }, [reduced])

  // hero copy dissolves into the scene over the first ~8% of scroll
  const heroOpacity = useTransform(scrollYProgress, [0, 0.07], [1, 0])
  const heroY = useTransform(scrollYProgress, [0, 0.07], [0, -48])
  const heroBlur = useTransform(scrollYProgress, [0, 0.07], ["blur(0px)", "blur(10px)"])
  const heroPE = useTransform(scrollYProgress, (v) => (v < 0.04 ? "auto" : "none"))
  const railScale = useTransform(scrollYProgress, [1 / BEATS, 1], [0, 1])

  const stageActive = active - 1 // index into STAGES, or -1 when on hero

  /* reduced-motion / no-JS fallback — plain stacked read (also SSR output) */
  const staticRead = (
    <div className="cin-static-list">
      <div className="cin-static cin-static--hero">
        <span className="cin-card-eyebrow">{hero.eyebrow}</span>
        <h1 className="cin-hero-title">{hero.title}</h1>
        <p className="cin-hero-sub">{hero.subtitle}</p>
        <div className="cin-hero-actions">
          <Button asChild><Link href={hero.primaryCta.href}>{hero.primaryCta.label}</Link></Button>
          <Button asChild variant="secondary"><Link href={hero.secondaryCta.href}>{hero.secondaryCta.label}</Link></Button>
        </div>
      </div>
      {STAGES.map((s, i) => (
        <div className="cin-static" key={s.label}>
          <span className="cin-card-eyebrow">{String(i + 1).padStart(2, "0")} · {s.label.toUpperCase()}</span>
          <h3 className="cin-card-title">{s.title}</h3>
          <p className="cin-card-blurb">{s.blurb}</p>
        </div>
      ))}
    </div>
  )

  if (reduced) {
    return (
      <section className="cin-scroll cin-scroll--reduced" aria-label="How create works">
        {staticRead}
      </section>
    )
  }

  return (
    <section className="cin-scroll" ref={ref} aria-label="How create works" style={{ height: `${BEATS * 100 + 20}vh` }}>
      <div className="cin-pin">
        <div className="cin-canvas">
          <CreateCanvas progressRef={progressRef} pointerRef={pointerRef} />
        </div>
        <div className="cin-scrim" aria-hidden />
        <CreateSymbols progress={scrollYProgress} />

        <div className="cin-eyebrow">
          <span className="kt-create-tag">Create · one continuous scene</span>
        </div>

        {/* Beat 0 — the hero, dissolving into the scene */}
        <motion.div
          className="cin-hero"
          style={{ opacity: heroOpacity, y: heroY, filter: heroBlur, pointerEvents: heroPE }}
        >
          <span className="cin-hero-eyebrow">{hero.eyebrow}</span>
          <h1 className="cin-hero-title">{hero.title}</h1>
          <p className="cin-hero-sub">{hero.subtitle}</p>
          <div className="cin-hero-actions">
            <Button asChild><Link href={hero.primaryCta.href}>{hero.primaryCta.label}</Link></Button>
            <Button asChild variant="secondary"><Link href={hero.secondaryCta.href}>{hero.secondaryCta.label}</Link></Button>
          </div>
          <span className="cin-hero-scroll">Scroll to begin</span>
        </motion.div>

        {/* Beats 1–5 — the stage copy */}
        <div className="cin-copy">
          <AnimatePresence mode="wait">
            {stageActive >= 0 && (
              <motion.div
                key={stageActive}
                initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -20, filter: "blur(6px)" }}
                transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
              >
                <span className="cin-card-eyebrow">{String(stageActive + 1).padStart(2, "0")} · {STAGES[stageActive].label.toUpperCase()}</span>
                <h3 className="cin-card-title">{STAGES[stageActive].title}</h3>
                <p className="cin-card-blurb">{STAGES[stageActive].blurb}</p>
                {stageActive === STAGES.length - 1 && <PayoutMeter progress={rawP} />}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Progress rail — five story ticks */}
        <div className="kt-stage-rail" aria-hidden>
          <div className="kt-stage-rail-track">
            <motion.div className="kt-stage-rail-fill" style={{ scaleY: railScale }} />
          </div>
          <div className="kt-stage-rail-ticks">
            {STAGES.map((s, i) => (
              <div key={s.label} className={`kt-stage-rail-tick${i === stageActive ? " active" : ""}${i < stageActive ? " done" : ""}`}>
                <span className="kt-stage-rail-dot" />
                <span className="kt-stage-rail-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default CreateCinematic
