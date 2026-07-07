/**
 * SYSTEM — Sketch → Shipment.
 *
 * A scroll-pinned, scrubbed narrative that walks one garment through the whole
 * system: Sketch → Design → Production → Shipment. Motion tracks the scrollbar
 * 1:1 (overlapping cross-dissolves, no hard cuts) — the same StoryStage
 * treatment used on /create, but on the Sky "night sky" ground with periwinkle
 * gradient backdrops instead of photography. Honours prefers-reduced-motion
 * (falls back to a plain stacked read). Reuses the global `.kt-stage-*` styles.
 */
"use client"

import { useEffect, useRef, useState } from "react"
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  AnimatePresence,
} from "framer-motion"
import { SkyIcon, type DomainIconName } from "./icons/domain"

type Stage = {
  label: string
  icon: DomainIconName
  title: React.ReactNode
  blurb: string
  rows: [string, string][]
  /** Two-stop periwinkle wash for this stage's backdrop. */
  from: string
  to: string
}

const STAGES: Stage[] = [
  {
    label: "Sketch",
    icon: "swatches",
    title: (
      <>
        It starts with a <em className="serif italic">sketch</em>.
      </>
    ),
    blurb:
      "A drawing, a photo, or a one-line brief. Describe the piece and the system spins up a design — mood, references, and a draft techpack in one place.",
    rows: [
      ["Input", "Sketch · photo · brief"],
      ["Output", "Draft techpack"],
    ],
    from: "oklch(0.42 0.10 264)",
    to: "oklch(0.24 0.06 274)",
  },
  {
    label: "Design",
    icon: "ruler",
    title: (
      <>
        Locked into a <em className="serif italic">spec</em>.
      </>
    ),
    blurb:
      "Bill of materials, size sets, construction details and per-technique pricing — resolved and versioned. No loose files, no version_3_final.ai.",
    rows: [
      ["BOM", "Materials + costs"],
      ["Sizes", "Size sets · graded"],
    ],
    from: "oklch(0.44 0.11 258)",
    to: "oklch(0.26 0.06 268)",
  },
  {
    label: "Production",
    icon: "scissors",
    title: (
      <>
        Routed to <em className="serif italic">vetted hands</em>.
      </>
    ),
    blurb:
      "The run is dispatched to a vetted atelier and tracked stitch by stitch — accept, start, finish — with cost rolled up per piece as it moves.",
    rows: [
      ["Run", "RUN-0442 · ×12"],
      ["Status", "Tracked per piece"],
    ],
    from: "oklch(0.46 0.12 250)",
    to: "oklch(0.27 0.07 262)",
  },
  {
    label: "Shipment",
    icon: "package",
    title: (
      <>
        Made, passported, <em className="serif italic">shipped</em>.
      </>
    ),
    blurb:
      "Every piece leaves with a Digital Product Passport and lands at the door — verifiable provenance from the first sketch to the last mile.",
    rows: [
      ["Passport", "DPP · EU ESPR"],
      ["Delivery", "Door · traceable"],
    ],
    from: "oklch(0.48 0.12 244)",
    to: "oklch(0.28 0.07 258)",
  },
]

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

function StageBackdrop({
  index,
  count,
  progress,
  stage,
}: {
  index: number
  count: number
  progress: import("framer-motion").MotionValue<number>
  stage: Stage
}) {
  const band = 1 / count
  const start = index * band
  const end = start + band
  const w = band * 0.24
  const ramp =
    index === 0
      ? [start, start, end - w, end + w]
      : index === count - 1
        ? [start - w, start + w, end, end]
        : [start - w, start + w, end - w, end + w]
  const opacity = useTransform(progress, ramp, [0, 1, 1, 0])
  const scale = useTransform(progress, [start - w, end + w], [1.12, 1.0])

  return (
    <motion.div className="kt-stage-layer" style={{ opacity }} aria-hidden>
      <motion.div
        className="kt-stage-layer-bg"
        style={{
          scale,
          background: `radial-gradient(120% 90% at 32% 28%, ${stage.from}, ${stage.to} 78%)`,
        }}
      >
        <div className="kt-stage-layer-veil" />
      </motion.div>
    </motion.div>
  )
}

function StageCard({ stage, index }: { stage: Stage; index: number }) {
  return (
    <div className="sts-card">
      <div className="sts-card-head">
        <span className="sts-card-icon" aria-hidden>
          <SkyIcon name={stage.icon} size={20} />
        </span>
        <span className="sts-card-eyebrow">
          {String(index + 1).padStart(2, "0")} · {stage.label.toUpperCase()}
        </span>
      </div>
      <h3 className="sts-card-title">{stage.title}</h3>
      <p className="sts-card-blurb">{stage.blurb}</p>
      <div className="sts-card-rows">
        {stage.rows.map(([k, v]) => (
          <div className="sts-card-row" key={k}>
            <span className="sts-card-row-k">{k}</span>
            <span className="sts-card-row-v">{v}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function SketchToShipment() {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = usePrefersReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] })
  const [active, setActive] = useState(0)
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const i = Math.min(STAGES.length - 1, Math.max(0, Math.floor(v * STAGES.length + 0.0001)))
    if (i !== active) setActive(i)
  })
  const railScale = useTransform(scrollYProgress, [0, 1], [0, 1])

  if (reduced) {
    return (
      <section id="system" className="kt-stage-scroll kt-stage-scroll--reduced" aria-label="Sketch to shipment">
        {STAGES.map((s, i) => (
          <div
            className="kt-stage-static"
            key={s.label}
            style={{ background: `radial-gradient(120% 90% at 32% 28%, ${s.from}, ${s.to} 78%)` }}
          >
            <StageCard stage={s} index={i} />
          </div>
        ))}
      </section>
    )
  }

  return (
    <section id="system" className="kt-stage-scroll" ref={ref} aria-label="Sketch to shipment" style={{ height: "440vh" }}>
      <div className="kt-stage-pin">
        <div className="kt-stage-eyebrow">
          <span className="kt-create-tag">The system · sketch → shipment</span>
        </div>
        <div className="kt-stage-viewport">
          {STAGES.map((s, i) => (
            <StageBackdrop key={s.label} index={i} count={STAGES.length} progress={scrollYProgress} stage={s} />
          ))}
        </div>
        <div className="kt-stage-layer-card">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -24, filter: "blur(6px)" }}
              transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
            >
              <StageCard stage={STAGES[active]} index={active} />
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="kt-stage-rail" aria-hidden>
          <div className="kt-stage-rail-track">
            <motion.div className="kt-stage-rail-fill" style={{ scaleY: railScale }} />
          </div>
          <div className="kt-stage-rail-ticks">
            {STAGES.map((s, i) => (
              <div
                key={s.label}
                className={`kt-stage-rail-tick${i === active ? " active" : ""}${i < active ? " done" : ""}`}
              >
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
