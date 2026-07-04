'use client'

import { useRef, useState, useEffect, type ReactNode } from 'react'
import Link from 'next/link'
import { motion, useInView, useMotionValue, useSpring, useTransform, useScroll, useMotionValueEvent, AnimatePresence, animate } from 'framer-motion'
import type { CreateContent } from './page'

type Props = { content: CreateContent }

function MotionText({ value, prefix = '', suffix = '', round = true }: { value: any; prefix?: string; suffix?: string; round?: boolean }) {
  const [text, setText] = useState('')
  useEffect(() => {
    const update = (v: number) => setText(`${prefix}${round ? Math.round(v) : v}${suffix}`)
    update(value.get())
    const unsub = value.on('change', update)
    return () => unsub()
  }, [value, prefix, suffix, round])
  return <>{text}</>
}

const INDIAN_ART = [
  'https://images.metmuseum.org/CRDImages/as/original/DP152309.jpg',
  'https://images.metmuseum.org/CRDImages/as/original/DP154823.jpg',
  'https://images.metmuseum.org/CRDImages/as/original/DP154824.jpg',
  'https://images.metmuseum.org/CRDImages/as/original/DP154829.jpg',
  'https://images.metmuseum.org/CRDImages/as/original/DP154830.jpg',
  'https://images.metmuseum.org/CRDImages/as/original/DP154825.jpg',
  'https://images.metmuseum.org/CRDImages/as/original/DP154764.jpg',
  'https://images.metmuseum.org/CRDImages/ep/original/DP-41223-001.jpg',
  'https://images.metmuseum.org/CRDImages/ep/original/DP-42549-001.jpg',
  'https://images.metmuseum.org/CRDImages/as/original/DP152310.jpg',
  'https://images.metmuseum.org/CRDImages/as/original/DP152311.jpg',
  'https://images.metmuseum.org/CRDImages/as/original/DP154826.jpg',
  'https://images.metmuseum.org/CRDImages/as/original/DP154827.jpg',
  'https://images.metmuseum.org/CRDImages/as/original/DP154828.jpg',
  'https://images.metmuseum.org/CRDImages/as/original/DP154831.jpg',
  'https://images.metmuseum.org/CRDImages/as/original/DP154832.jpg',
  'https://images.metmuseum.org/CRDImages/as/original/DP154765.jpg',
  'https://images.metmuseum.org/CRDImages/as/original/DP154766.jpg',
  'https://images.metmuseum.org/CRDImages/as/original/DP154767.jpg',
  'https://images.metmuseum.org/CRDImages/as/original/DP154768.jpg',
  'https://images.metmuseum.org/CRDImages/as/original/DP161054.jpg',
  'https://images.metmuseum.org/CRDImages/as/original/DP161055.jpg',
  'https://images.metmuseum.org/CRDImages/as/original/DP161056.jpg',
  'https://images.metmuseum.org/CRDImages/as/original/DP161057.jpg',
  'https://images.metmuseum.org/CRDImages/as/original/DP161058.jpg',
]

const STAGE_IMG = [0, 2, 3, 6, 8]
const STAGE_HUES = [40, 250, 145, 60, 290]
const CELL_MAP = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i']

function WordReveal({ text }: { text: string }) {
  const words = text.split(' ')
  return (
    <span style={{ display: 'inline-flex', flexWrap: 'wrap', gap: '0.18em' }}>
      {words.map((w, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 28, rotateX: 15, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, rotateX: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.8, ease: [0.12, 0.74, 0.22, 1], delay: 0.15 + i * 0.08 }}
          style={{ display: 'inline-block', perspective: 600 }}
        >
          {w}{i < words.length - 1 ? '\u00A0' : ''}
        </motion.span>
      ))}
    </span>
  )
}

function MagneticBtn({ children, href, className = 'kt-btn kt-btn-lg' }: { children: ReactNode; href: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 300, damping: 18 })
  const springY = useSpring(y, { stiffness: 300, damping: 18 })
  return (
    <motion.div
      ref={ref}
      style={{ x: springX, y: springY, display: 'inline-block' }}
      onMouseMove={(e) => {
        const el = ref.current
        if (!el) return
        const r = el.getBoundingClientRect()
        x.set((e.clientX - (r.left + r.width / 2)) * 0.22)
        y.set((e.clientY - (r.top + r.height / 2)) * 0.22)
      }}
      onMouseLeave={() => { x.set(0); y.set(0) }}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
    >
      <Link href={href} className={className}>{children}</Link>
    </motion.div>
  )
}

function WeaveTile({ src, active, index, parallaxX, parallaxY }: {
  src: string; active: boolean; index: number; parallaxX: any; parallaxY: any
}) {
  const depth = STAGE_IMG.includes(index) ? 1.6 : 0.8
  const tileX = useTransform(parallaxX, (v: number) => v * depth)
  const tileY = useTransform(parallaxY, (v: number) => v * depth)
  return (
    <motion.div
      className={`kt-story-tile${active ? ' active' : ''}`}
      style={{ x: tileX, y: tileY }}
      animate={{ scale: active ? 1.08 : 1, opacity: active ? 1 : 0.5, rotate: active ? -1.5 : 0 }}
      transition={{ type: 'spring', stiffness: 120, damping: 16 }}
    >
      <motion.img
        src={src} alt="" loading="lazy"
        initial={{ clipPath: 'inset(48% 0% 48% 0%)', scale: 1.3, opacity: 0 }}
        animate={{ clipPath: 'inset(0% 0% 0% 0%)', scale: 1, opacity: 1 }}
        transition={{ duration: 1.4, ease: [0.2, 0.8, 0.2, 1], delay: 0.3 + index * 0.12 }}
        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
      />
      {active && <motion.div className="kt-tile-ripple" initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} transition={{ duration: 0.6 }} />}
      <motion.div className="kt-weave-warp" initial={{ opacity: 0.9, scaleY: 0 }} animate={{ opacity: 0, scaleY: 1 }}
        transition={{ opacity: { duration: 0.6, delay: 1.2 + index * 0.12 }, scaleY: { duration: 0.7, ease: [0.2, 0.8, 0.2, 1], delay: 0.2 + index * 0.12 } }} />
      <motion.div className="kt-weave-weft" initial={{ opacity: 0.8, scaleX: 0 }} animate={{ opacity: 0, scaleX: 1 }}
        transition={{ opacity: { duration: 0.5, delay: 1.5 + index * 0.12 }, scaleX: { duration: 0.6, ease: [0.2, 0.8, 0.2, 1], delay: 0.5 + index * 0.12 } }} />
      <div className="kt-story-tile-shine" />
      {active && <motion.div className="kt-story-tile-glow" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} />}
    </motion.div>
  )
}

function StoryArena({ activeStage }: { activeStage: number }) {
  const arenaRef = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const rotX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), { stiffness: 150, damping: 20 })
  const rotY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), { stiffness: 150, damping: 20 })
  const parX = useSpring(useTransform(mouseX, [-0.5, 0.5], [-12, 12]), { stiffness: 100, damping: 20 })
  const parY = useSpring(useTransform(mouseY, [-0.5, 0.5], [-12, 12]), { stiffness: 100, damping: 20 })
  return (
    <div ref={arenaRef} className="kt-story-arena"
      onMouseMove={(e) => { const r = arenaRef.current!.getBoundingClientRect(); mouseX.set((e.clientX - r.left) / r.width - 0.5); mouseY.set((e.clientY - r.top) / r.height - 0.5) }}
      onMouseLeave={() => { mouseX.set(0); mouseY.set(0) }}
      style={{ perspective: 1200 }}
    >
      <motion.div className="kt-story-arena-inner" style={{ rotateX: rotX, rotateY: rotY, transformStyle: 'preserve-3d' }}>
        <div className="kt-story-grid">
          {INDIAN_ART.slice(0, 9).map((src, i) => {
            if (i === 4) return null
            const isActive = STAGE_IMG.includes(i) && STAGE_IMG.indexOf(i) === activeStage
            return (
              <div key={src} className="kt-story-cell" style={{ gridArea: CELL_MAP[i], transformStyle: 'preserve-3d' }}>
                <WeaveTile src={src} active={isActive} index={i} parallaxX={parX} parallaxY={parY} />
              </div>
            )
          })}
        </div>
        <div className="kt-story-player-wrap" style={{ transform: 'translateZ(40px)' }}>
          <HeroStagePlayer activeStage={activeStage} />
        </div>
      </motion.div>
      <motion.div className="kt-stage-wash"
        animate={{ background: `radial-gradient(circle at 50% 50%, oklch(0.78 0.06 ${STAGE_HUES[activeStage]} / 0.06), transparent 70%)` }}
        transition={{ duration: 1.2 }} />
    </div>
  )
}

const STAGES = [
  { label: 'Inspire', icon: '✦', title: 'From the art that moves you', desc: 'AI reads palette, motif, and mood.', chips: ['Miniature', 'Textile', 'Mughal'] },
  { label: 'Design', icon: '◎', title: 'Your product takes shape', desc: 'Palette, motif, dimensions assigned.', colors: ['oklch(65% 0.12 35)', 'oklch(55% 0.1 250)', 'oklch(70% 0.08 145)'] },
  { label: 'Craft', icon: '◉', title: 'Handmade by master artisans', desc: 'Dye → Weave → Finish → QC.', dots: [true, true, true, false] },
  { label: 'Package', icon: '▣', title: 'Wrapped with care', desc: 'Digital Product Passport included.' },
  { label: 'Ship', icon: '▶', title: 'On its way to you', desc: 'Carbon-neutral shipping insured.', pct: 72 },
]

function HeroStagePlayer({ activeStage }: { activeStage: number }) {
  const stage = STAGES[activeStage]
  return (
    <div className="kt-stage-player">
      <div className="kt-stage-counter">
        <AnimatePresence mode="wait">
          <motion.span key={activeStage} initial={{ y: 20, opacity: 0, filter: 'blur(6px)' }} animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }} exit={{ y: -20, opacity: 0, filter: 'blur(6px)' }} transition={{ duration: 0.4 }}>
            {String(activeStage + 1).padStart(2, '0')}
          </motion.span>
        </AnimatePresence>
        <span className="kt-stage-counter-total">/ 05</span>
      </div>
      <div className="kt-stage-pips">
        {STAGES.map((s, i) => (
          <div key={s.label} className={`kt-stage-pip${i === activeStage ? ' active' : ''}${i < activeStage ? ' done' : ''}`} />
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={activeStage} className="kt-stage-body"
          initial={{ opacity: 0, clipPath: 'inset(40% 0% 40% 0%)', y: 16 }}
          animate={{ opacity: 1, clipPath: 'inset(0% 0% 0% 0%)', y: 0 }}
          exit={{ opacity: 0, clipPath: 'inset(40% 0% 40% 0%)', y: -12 }}
          transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}>
          <motion.div className="kt-stage-icon" initial={{ rotate: -90, scale: 0 }} animate={{ rotate: 0, scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 14, delay: 0.15 }}>{stage.icon}</motion.div>
          <div className="kt-stage-label">{stage.label}</div>
          <div className="kt-stage-title">{stage.title}</div>
          {stage.chips && <div className="kt-stage-chips">{stage.chips.map(c => <span key={c} className="kt-stage-chip">{c}</span>)}</div>}
          {stage.colors && <div className="kt-stage-swatches">{stage.colors.map(c => <div key={c} className="kt-stage-swatch" style={{ background: c }} />)}</div>}
          {stage.dots && <div className="kt-stage-dots">{stage.dots.map((f, i) => <div key={i} className={`kt-stage-dot${f ? ' fill' : ''}`} />)}</div>}
          {stage.pct != null && <div className="kt-stage-bar-wrap"><div className="kt-stage-bar-track"><span>Artisan</span><span>Hub</span><span>You</span></div><div className="kt-stage-bar"><motion.div className="kt-stage-bar-fill" initial={{ width: '0%' }} animate={{ width: `${stage.pct}%` }} transition={{ duration: 1.2, delay: 0.2 }} /></div></div>}
          <p className="kt-stage-desc">{stage.desc}</p>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

/* ═══ SCROLL JOURNEY — auto-playing scenes with zoom transitions ═══ */

const SCENES = [
  { tag: '01 — Choose', title: 'Pick your fabric', desc: 'Select from handwoven cotton, silk, pashmina. Every material carries a story — choose the one that becomes yours.', hue: 40 },
  { tag: '02 — Make', title: 'Weave on the loom', desc: 'Warp, weft, and weave. Master artisans bring the design to life thread by thread. Watch the fabric grow.', hue: 145 },
  { tag: '03 — Sell', title: 'Launch your store', desc: 'Your product goes live with provenance, pricing, and fulfillment handled. From loom to customer in one flow.', hue: 290 },
]

const EASE = [0.2, 0.8, 0.2, 1] as const
const EASE_OUT = [0.4, 0, 0.2, 1] as const

function FabricScene() {
  return (
    <motion.div className="kt-scene kt-scene-fabric"
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.3 }}
      transition={{ duration: 0.7, ease: EASE }}
    >
      <svg viewBox="0 0 400 400" className="kt-scene-svg">
        {/* Fabric rolls slide in */}
        {[60, 140, 240, 320].map((tx, i) => (
          <motion.g key={`roll${i}`}
            initial={{ x: i % 2 === 0 ? -120 : 120 }}
            animate={{ x: tx }}
            transition={{ duration: 0.6, delay: 0.2 + i * 0.08, ease: EASE }}
          >
            <rect x="0" y={100 + i * 50} width="50" height="30" rx="15" fill={`oklch(0.5 0.08 ${30 + i * 60})`} />
            <rect x="0" y={100 + i * 50} width="50" height="30" rx="15" fill="none" stroke="oklch(0.78 0.06 145 / 0.2)" strokeWidth="1" />
            <line x1="10" y1={105 + i * 50} x2="10" y2={125 + i * 50} stroke="oklch(0.78 0.06 145 / 0.3)" strokeWidth="1" />
            <line x1="25" y1={105 + i * 50} x2="25" y2={125 + i * 50} stroke="oklch(0.78 0.06 145 / 0.3)" strokeWidth="1" />
            <line x1="40" y1={105 + i * 50} x2="40" y2={125 + i * 50} stroke="oklch(0.78 0.06 145 / 0.3)" strokeWidth="1" />
          </motion.g>
        ))}
        {/* Spools */}
        {[340, 360, 340].map((cy, i) => (
          <motion.g key={`spool${i}`}
            initial={{ x: -50 }}
            animate={{ x: 50 + i * 30 }}
            transition={{ duration: 0.5, delay: 0.3 + i * 0.06, ease: EASE }}
          >
            <circle cx="0" cy={cy} r="12" fill="oklch(0.6 0.05 40)" />
            <circle cx="0" cy={cy} r="12" fill="none" stroke="oklch(0.78 0.06 145 / 0.3)" strokeWidth="1" />
            <line x1="-8" y1={cy - 4} x2="8" y2={cy - 4} stroke="oklch(0.78 0.06 145 / 0.2)" strokeWidth="0.5" />
            <line x1="-8" y1={cy} x2="8" y2={cy} stroke="oklch(0.78 0.06 145 / 0.2)" strokeWidth="0.5" />
            <line x1="-8" y1={cy + 4} x2="8" y2={cy + 4} stroke="oklch(0.78 0.06 145 / 0.2)" strokeWidth="0.5" />
          </motion.g>
        ))}
        {/* Central swatch */}
        <motion.g
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6, ease: EASE }}
          style={{ transformOrigin: '200px 200px' }}
        >
          <rect x="140" y="140" width="120" height="120" rx="8" fill="oklch(0.55 0.08 40)" />
          <rect x="140" y="140" width="120" height="120" rx="8" fill="none" stroke="oklch(0.78 0.06 145)" strokeWidth="1" />
          {Array.from({ length: 8 }).map((_, i) => (
            <line key={`h${i}`} x1="145" y1={150 + i * 14} x2="255" y2={150 + i * 14} stroke="oklch(0.7 0.04 40 / 0.3)" strokeWidth="0.5" />
          ))}
          {Array.from({ length: 8 }).map((_, i) => (
            <line key={`v${i}`} x1={150 + i * 14} y1="145" x2={150 + i * 14} y2="255" stroke="oklch(0.7 0.04 40 / 0.3)" strokeWidth="0.5" />
          ))}
          <motion.rect x="134" y="134" width="132" height="132" rx="10" fill="none"
            stroke="oklch(0.78 0.06 145)" strokeWidth="2" strokeDasharray="6 4"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ duration: 0.6, delay: 0.9, ease: EASE }}
          />
        </motion.g>
      </svg>
    </motion.div>
  )
}

function LoomScene() {
  return (
    <motion.div className="kt-scene kt-scene-loom"
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.3 }}
      transition={{ duration: 0.7, ease: EASE }}
    >
      <svg viewBox="0 0 400 400" className="kt-scene-svg">
        {/* Loom frame */}
        <rect x="80" y="60" width="240" height="8" rx="4" fill="oklch(0.35 0.03 40)" />
        <rect x="80" y="340" width="240" height="8" rx="4" fill="oklch(0.35 0.03 40)" />
        <rect x="76" y="60" width="8" height="288" rx="4" fill="oklch(0.35 0.03 40)" />
        <rect x="316" y="60" width="8" height="288" rx="4" fill="oklch(0.35 0.03 40)" />
        {/* Warp threads */}
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.line key={`warp${i}`} x1={100 + i * 14} y1="68" x2={100 + i * 14} y2="340"
            stroke="oklch(0.7 0.04 40 / 0.5)" strokeWidth="1"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ duration: 0.4, delay: 0.2 + i * 0.03, ease: EASE }}
          />
        ))}
        {/* Fabric area */}
        <motion.rect x="96" y="68" width="208" height="272" fill="oklch(0.55 0.08 40 / 0.15)"
          initial={{ scaleY: 0 }} animate={{ scaleY: 1 }}
          transition={{ duration: 1.2, delay: 0.4, ease: EASE }}
          style={{ transformOrigin: '200px 340px' }}
        />
        {/* Weft threads */}
        {Array.from({ length: 18 }).map((_, i) => (
          <motion.line key={`weft${i}`} x1="96" y1={340 - i * 15} x2="304" y2={340 - i * 15}
            stroke="oklch(0.78 0.06 145 / 0.6)" strokeWidth="1.5"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ duration: 0.15, delay: 0.5 + i * 0.06, ease: EASE }}
          />
        ))}
        {/* Shuttle */}
        <motion.g
          initial={{ x: 120 }} animate={{ x: 280 }}
          transition={{ duration: 1.5, delay: 0.5, ease: EASE, repeat: Infinity, repeatType: 'reverse' }}
        >
          <rect x="-12" y="162" width="24" height="10" rx="5" fill="oklch(0.85 0.04 40)" stroke="oklch(0.78 0.06 145)" strokeWidth="1" />
          <line x1="-8" y1="167" x2="8" y2="167" stroke="oklch(0.78 0.06 145 / 0.4)" strokeWidth="0.5" />
        </motion.g>
      </svg>
    </motion.div>
  )
}

function StoreScene() {
  return (
    <motion.div className="kt-scene kt-scene-store"
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.3 }}
      transition={{ duration: 0.7, ease: EASE }}
    >
      <motion.div className="kt-phone"
        initial={{ scale: 0.85 }} animate={{ scale: 1 }}
        transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
      >
        <div className="kt-phone-frame">
          <div className="kt-phone-notch" />
          <motion.div className="kt-phone-screen"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <div className="kt-phone-status">
              <span>9:41</span>
              <span className="kt-phone-status-icons">●●● 100%</span>
            </div>
            <div className="kt-phone-header">
              <div className="kt-phone-store-name">JYT · Atelier</div>
              <div className="kt-phone-cart-icon">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                  <path d="M3 6h18" />
                  <path d="M16 10a4 4 0 01-8 0" />
                </svg>
                <motion.div className="kt-phone-cart-badge"
                  initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 1.2, ease: EASE }}
                >1</motion.div>
              </div>
            </div>
            <motion.div className="kt-phone-product"
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5, ease: EASE }}
            >
              <div className="kt-phone-product-img" style={{ backgroundImage: `url(${INDIAN_ART[1]})` }} />
              <div className="kt-phone-product-info">
                <div className="kt-phone-product-artisan">Handwoven · Bagru, Rajasthan</div>
                <div className="kt-phone-product-title">Pashmina Shawl</div>
                <div className="kt-phone-product-price">₹4,200</div>
              </div>
            </motion.div>
            <motion.div className="kt-phone-btn"
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.8, ease: EASE }}
            >
              <motion.span className="kt-phone-btn-add"
                initial={{ opacity: 1 }} animate={{ opacity: 0 }}
                transition={{ duration: 0.3, delay: 1.5 }}
              >Add to Cart</motion.span>
              <motion.span className="kt-phone-btn-checkout"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 1.5 }}
              >Checkout · ₹4,200</motion.span>
            </motion.div>
            <motion.div className="kt-phone-drawer"
              initial={{ y: 200, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.8, ease: EASE }}
            >
              <div className="kt-phone-drawer-handle" />
              <div className="kt-phone-drawer-title">Your cart</div>
              <div className="kt-phone-drawer-item">
                <div className="kt-phone-drawer-item-img" style={{ backgroundImage: `url(${INDIAN_ART[1]})` }} />
                <div className="kt-phone-drawer-item-info">
                  <div className="kt-phone-drawer-item-name">Pashmina Shawl</div>
                  <div className="kt-phone-drawer-item-desc">Cashmere · Qty 1</div>
                </div>
                <div className="kt-phone-drawer-item-price">₹4,200</div>
              </div>
              <div className="kt-phone-drawer-total">
                <span>Total</span><span>₹4,200</span>
              </div>
            </motion.div>
            <motion.div className="kt-phone-confirmed"
              initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 2.3, ease: EASE }}
            >
              <div className="kt-phone-confirmed-circle">
                <svg viewBox="0 0 48 48" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                  <motion.path d="M14 24L21 31L34 18"
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                    transition={{ duration: 0.4, delay: 2.5, ease: EASE }}
                  />
                </svg>
              </div>
              <div className="kt-phone-confirmed-text">Order Confirmed</div>
              <div className="kt-phone-confirmed-sub">Passport DPP-2261 minted</div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  )
}

function ScrollJourney() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const [activeScene, setActiveScene] = useState(0)
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const scene = v < 0.33 ? 0 : v < 0.66 ? 1 : 2
    if (scene !== activeScene) setActiveScene(scene)
  })

  return (
    <section className="kt-journey" ref={ref}>
      <div className="kt-journey-sticky">
        <motion.div className="kt-journey-bg"
          animate={{ background: `radial-gradient(ellipse at 30% 40%, oklch(0.78 0.06 ${SCENES[activeScene].hue} / 0.05), transparent 60%)` }}
          transition={{ duration: 1 }} />
        <div className="container kt-journey-inner">
          <div className="kt-journey-visual">
            <AnimatePresence mode="sync">
              {activeScene === 0 && <FabricScene key="fabric" />}
              {activeScene === 1 && <LoomScene key="loom" />}
              {activeScene === 2 && <StoreScene key="store" />}
            </AnimatePresence>
          </div>
          <div className="kt-journey-text">
            <AnimatePresence mode="wait">
              <motion.div key={activeScene}
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: EASE }}>
                <span className="kt-journey-tag">{SCENES[activeScene].tag}</span>
                <h2 className="kt-journey-title">{SCENES[activeScene].title}</h2>
                <p className="kt-journey-desc">{SCENES[activeScene].desc}</p>
              </motion.div>
            </AnimatePresence>
            <div className="kt-journey-rail">
              {SCENES.map((s, i) => (
                <div key={s.tag} className={`kt-journey-rail-item${i === activeScene ? ' active' : ''}${i < activeScene ? ' done' : ''}`}>
                  <span className="kt-journey-rail-num">{String(i + 1).padStart(2, '0')}</span>
                  <span className="kt-journey-rail-label">{s.tag.split('—')[1]?.trim()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Get Paid section ───

const PAID_SCENES = [
  { tag: '01 — Currencies', title: 'Sell in any currency', desc: 'Customers pay in ₹, €, $, £. You settle in rupees. We handle the conversion, FX risk, and remittance — automatically.', hue: 40 },
  { tag: '02 — Commission', title: 'Decide your margin', desc: 'Slide the commission to choose what you earn. Artisan gets paid fairly, platform takes a small cut, you keep the rest.', hue: 145 },
  { tag: '03 — Payout', title: 'Get paid instantly', desc: 'Funds land in your bank account the moment the order ships. No waiting periods, no minimum thresholds.', hue: 290 },
]

function GetPaid() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const [activeScene, setActiveScene] = useState(0)
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const scene = v < 0.33 ? 0 : v < 0.66 ? 1 : 2
    if (scene !== activeScene) setActiveScene(scene)
  })

  return (
    <section className="kt-paid" ref={ref}>
      <div className="kt-paid-sticky">
        <motion.div className="kt-paid-bg"
          animate={{ background: `radial-gradient(ellipse at 70% 40%, oklch(0.78 0.06 ${PAID_SCENES[activeScene].hue} / 0.05), transparent 60%)` }}
          transition={{ duration: 1 }} />
        <div className="container kt-paid-inner">
          <div className="kt-paid-text">
            <AnimatePresence mode="wait">
              <motion.div key={activeScene}
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: EASE }}>
                <span className="kt-journey-tag">{PAID_SCENES[activeScene].tag}</span>
                <h2 className="kt-journey-title">{PAID_SCENES[activeScene].title}</h2>
                <p className="kt-journey-desc">{PAID_SCENES[activeScene].desc}</p>
              </motion.div>
            </AnimatePresence>
            <div className="kt-journey-rail">
              {PAID_SCENES.map((s, i) => (
                <div key={s.tag} className={`kt-journey-rail-item${i === activeScene ? ' active' : ''}${i < activeScene ? ' done' : ''}`}>
                  <span className="kt-journey-rail-num">{String(i + 1).padStart(2, '0')}</span>
                  <span className="kt-journey-rail-label">{s.tag.split('—')[1]?.trim()}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="kt-paid-visual">
            <AnimatePresence mode="sync">
              {activeScene === 0 && <CurrencyScene key="currency" />}
              {activeScene === 1 && <CommissionScene key="commission" />}
              {activeScene === 2 && <PayoutScene key="payout" />}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}

function CurrencyScene() {
  const currencies = [
    { symbol: '₹', amount: '4,200', region: 'INR', hue: 40 },
    { symbol: '€', amount: '48', region: 'EUR', hue: 145 },
    { symbol: '$', amount: '52', region: 'USD', hue: 250 },
    { symbol: '£', amount: '41', region: 'GBP', hue: 290 },
  ]

  return (
    <motion.div className="kt-scene kt-scene-currency"
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.3 }}
      transition={{ duration: 0.7, ease: EASE }}
    >
      <div className="kt-currency-card">
        <motion.div className="kt-currency-label"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
        >Product price</motion.div>
        <div className="kt-currency-row">
          {currencies.map((c, i) => (
            <motion.div key={c.region} className="kt-currency-item"
              initial={{ opacity: 0, x: i === 0 ? 0 : 40, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: i === 0 ? 0 : -40, scale: 0.8 }}
              transition={{ duration: 0.4, delay: 0.3 + i * 0.12, ease: EASE }}
            >
              <div className="kt-currency-symbol" style={{ color: `oklch(0.78 0.06 ${c.hue})` }}>{c.symbol}</div>
              <div className="kt-currency-amount">{c.amount}</div>
              <div className="kt-currency-region">{c.region}</div>
            </motion.div>
          ))}
        </div>
        <div className="kt-currency-ticker">
          <motion.span className="kt-currency-ticker-label"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
          >FX auto-converted · settled in INR</motion.span>
          <div className="kt-currency-ticker-bar">
            <motion.div className="kt-currency-ticker-fill"
              initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.4, ease: EASE }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function CommissionScene() {
  const yourPct = useMotionValue(20)
  const artisanAmount = useMotionValue(2730)
  const yourAmount = useMotionValue(840)
  const platformAmount = useMotionValue(420)

  useEffect(() => {
    const t1 = setTimeout(() => animate(yourPct, 35, { duration: 1.2, ease: EASE }), 400)
    const t2 = setTimeout(() => animate(artisanAmount, 2100, { duration: 1.2, ease: EASE }), 400)
    const t3 = setTimeout(() => animate(yourAmount, 1470, { duration: 1.2, ease: EASE }), 400)
    const t4 = setTimeout(() => animate(platformAmount, 630, { duration: 1.2, ease: EASE }), 400)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4) }
  }, [])

  return (
    <motion.div className="kt-scene kt-scene-commission"
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.3 }}
      transition={{ duration: 0.7, ease: EASE }}
    >
      <div className="kt-commission-card">
        <div className="kt-commission-header">
          <span className="kt-commission-label">Your commission</span>
          <motion.span className="kt-commission-pct"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          >
            <MotionText value={yourPct} />%
          </motion.span>
        </div>
        <div className="kt-commission-slider">
          <div className="kt-commission-track" />
          <motion.div className="kt-commission-fill"
            initial={{ width: '15%' }} animate={{ width: '75%' }}
            transition={{ duration: 1.2, delay: 0.4, ease: EASE }}
          />
          <motion.div className="kt-commission-knob"
            initial={{ left: '15%' }} animate={{ left: '75%' }}
            transition={{ duration: 1.2, delay: 0.4, ease: EASE }}
          >
            <div className="kt-commission-knob-inner" />
          </motion.div>
        </div>
        <div className="kt-commission-split">
          <motion.div className="kt-commission-split-row"
            initial={{ width: '65%', opacity: 0 }} animate={{ width: '50%', opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.4, ease: EASE }}
          >
            <div className="kt-commission-split-bar kt-commission-split-artisan" />
            <div className="kt-commission-split-info">
              <span className="kt-commission-split-label">Artisan</span>
              <span className="kt-commission-split-amount">₹<MotionText value={artisanAmount} /></span>
            </div>
          </motion.div>
          <motion.div className="kt-commission-split-row"
            initial={{ width: '20%', opacity: 0 }} animate={{ width: '35%', opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.5, ease: EASE }}
          >
            <div className="kt-commission-split-bar kt-commission-split-you" />
            <div className="kt-commission-split-info">
              <span className="kt-commission-split-label">You</span>
              <span className="kt-commission-split-amount">₹<MotionText value={yourAmount} /></span>
            </div>
          </motion.div>
          <motion.div className="kt-commission-split-row"
            initial={{ width: '15%', opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.6 }}
          >
            <div className="kt-commission-split-bar kt-commission-split-platform" />
            <div className="kt-commission-split-info">
              <span className="kt-commission-split-label">Platform</span>
              <span className="kt-commission-split-amount">₹<MotionText value={platformAmount} /></span>
            </div>
          </motion.div>
        </div>
        <div className="kt-commission-total">
          <span>Order total</span><span>₹4,200</span>
        </div>
      </div>
    </motion.div>
  )
}

function PayoutScene() {
  const balance = useMotionValue(0)

  useEffect(() => {
    const t = setTimeout(() => animate(balance, 4200, { duration: 1.5, ease: EASE }), 600)
    return () => clearTimeout(t)
  }, [])

  return (
    <motion.div className="kt-scene kt-scene-payout"
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.3 }}
      transition={{ duration: 0.7, ease: EASE }}
    >
      <div className="kt-payout-card">
        <div className="kt-payout-header">
          <span className="kt-payout-bank">HDFC Bank</span>
          <span className="kt-payout-type">Payout received</span>
        </div>
        <div className="kt-payout-balance">
          <span className="kt-payout-balance-label">Available balance</span>
          <span className="kt-payout-balance-amount">₹<MotionText value={balance} /></span>
        </div>
        <div className="kt-payout-coins">
          <motion.div className="kt-payout-coin"
            initial={{ y: -60, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5, ease: EASE_OUT }}
          >₹</motion.div>
          <motion.div className="kt-payout-coin"
            initial={{ y: -80, opacity: 0 }} animate={{ y: 20, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7, ease: EASE_OUT }}
          >₹</motion.div>
          <motion.div className="kt-payout-coin"
            initial={{ y: -100, opacity: 0 }} animate={{ y: 40, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.9, ease: EASE_OUT }}
          >₹</motion.div>
        </div>
        <motion.div className="kt-payout-check"
          initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.4, ease: EASE }}
        >
          <svg viewBox="0 0 40 40" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
            <motion.path d="M10 20L17 27L30 14"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
              transition={{ duration: 0.4, delay: 1.6, ease: EASE }}
            />
          </svg>
          <span>Instant payout · Order #2261</span>
        </motion.div>
      </div>
    </motion.div>
  )
}

// ─── Phone twin section ───

function PhoneTwin() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px 0px' })

  return (
    <section className="kt-phones" ref={ref}>
      <div className="container">
        <motion.div className="kt-phones-head" initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}>
          <span className="kt-create-tag">Beyond the store</span>
          <h2 className="kt-bento-title">Sell where they scroll.<br />Bring them back for more.</h2>
        </motion.div>

        <div className="kt-phones-grid">
          {/* Phone 1: Social commerce */}
          <motion.div className="kt-phones-col" initial={{ opacity: 0, x: -40 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.7, delay: 0.1 }}>
            <div className="kt-phones-label">
              <span className="kt-phones-label-num">01</span>
              <span className="kt-phones-label-text">Social commerce</span>
            </div>
            <SocialPhone />
            <p className="kt-phones-desc">Tag products in posts and stories. Customers tap to buy without leaving the app.</p>
          </motion.div>

          {/* Phone 2: Loyalty */}
          <motion.div className="kt-phones-col" initial={{ opacity: 0, x: 40 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.7, delay: 0.2 }}>
            <div className="kt-phones-label">
              <span className="kt-phones-label-num">02</span>
              <span className="kt-phones-label-text">Keep them coming back</span>
            </div>
            <LoyaltyPhone />
            <p className="kt-phones-desc">Points, streaks, and rewards. Turn one-time buyers into repeat customers.</p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function SocialPhone() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px 0px' })

  return (
    <div className="kt-phone kt-phone-sm" ref={ref}>
      <div className="kt-phone-frame">
        <div className="kt-phone-notch" />
        <motion.div className="kt-phone-screen" initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 0.5 }}>
          {/* Instagram-style header */}
          <div className="kt-social-header">
            <div className="kt-social-avatar" style={{ backgroundImage: `url(${INDIAN_ART[7]})` }} />
            <div className="kt-social-user">
              <div className="kt-social-handle">@jyt.atelier</div>
              <div className="kt-social-location">Bagru, Rajasthan</div>
            </div>
            <div className="kt-social-more">···</div>
          </div>

          {/* Feed image with product tags */}
          <div className="kt-social-feed">
            <div className="kt-social-feed-img" style={{ backgroundImage: `url(${INDIAN_ART[3]})` }} />
            <motion.div className="kt-social-tag" initial={{ opacity: 0, scale: 0.8 }} animate={inView ? { opacity: 1, scale: 1 } : {}} transition={{ duration: 0.4, delay: 0.6 }}>
              <span className="kt-social-tag-dot" />
              <span className="kt-social-tag-label">Pashmina Shawl · ₹4,200</span>
            </motion.div>
            <motion.div className="kt-social-tag kt-social-tag-2" initial={{ opacity: 0, scale: 0.8 }} animate={inView ? { opacity: 1, scale: 1 } : {}} transition={{ duration: 0.4, delay: 0.8 }}>
              <span className="kt-social-tag-dot" />
              <span className="kt-social-tag-label">Shop now</span>
            </motion.div>
          </div>

          {/* Action bar */}
          <div className="kt-social-actions">
            <div className="kt-social-icon">♥</div>
            <div className="kt-social-icon">💬</div>
            <div className="kt-social-icon">↗</div>
            <div className="kt-social-spacer" />
            <div className="kt-social-icon">⌑</div>
          </div>
          <div className="kt-social-likes">2,847 likes</div>
          <div className="kt-social-caption"><b>@jyt.atelier</b> New collection — handwoven in Bagru ✨</div>

          {/* Shop bar */}
          <motion.div className="kt-social-shop" initial={{ y: 40, opacity: 0 }} animate={inView ? { y: 0, opacity: 1 } : {}} transition={{ duration: 0.5, delay: 1 }}>
            <div className="kt-social-shop-img" style={{ backgroundImage: `url(${INDIAN_ART[3]})` }} />
            <div className="kt-social-shop-info">
              <div className="kt-social-shop-name">Pashmina Shawl</div>
              <div className="kt-social-shop-price">₹4,200</div>
            </div>
            <div className="kt-social-shop-btn">Add to Cart</div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

function LoyaltyPhone() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px 0px' })

  return (
    <div className="kt-phone kt-phone-sm" ref={ref}>
      <div className="kt-phone-frame">
        <div className="kt-phone-notch" />
        <motion.div className="kt-phone-screen" initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 0.5 }}>
          {/* Loyalty header */}
          <div className="kt-loyalty-header">
            <div className="kt-loyalty-title">Your rewards</div>
            <div className="kt-loyalty-tier">Gold member</div>
          </div>

          {/* Points circle */}
          <motion.div className="kt-loyalty-points" initial={{ scale: 0.8, opacity: 0 }} animate={inView ? { scale: 1, opacity: 1 } : {}} transition={{ duration: 0.6, delay: 0.2 }}>
            <svg viewBox="0 0 120 120" width="100" height="100">
              <circle cx="60" cy="60" r="52" fill="none" stroke="oklch(0.9 0.005 40)" strokeWidth="8" />
              <motion.circle cx="60" cy="60" r="52" fill="none" stroke="oklch(0.78 0.06 145)" strokeWidth="8" strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 52}
                initial={{ strokeDashoffset: 2 * Math.PI * 52 }}
                animate={inView ? { strokeDashoffset: 2 * Math.PI * 52 * 0.3 } : {}}
                transition={{ duration: 1.2, delay: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
                transform="rotate(-90 60 60)" />
            </svg>
            <div className="kt-loyalty-points-inner">
              <div className="kt-loyalty-points-num">1,240</div>
              <div className="kt-loyalty-points-label">points</div>
            </div>
          </motion.div>

          {/* Streak */}
          <motion.div className="kt-loyalty-streak" initial={{ opacity: 0, y: 10 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.6 }}>
            <span className="kt-loyalty-streak-flame">🔥</span>
            <span className="kt-loyalty-streak-text">7 day streak · +50 pts today</span>
          </motion.div>

          {/* Rewards list */}
          <div className="kt-loyalty-rewards">
            <motion.div className="kt-loyalty-reward" initial={{ opacity: 0, x: -20 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.4, delay: 0.7 }}>
              <div className="kt-loyalty-reward-icon">₹</div>
              <div className="kt-loyalty-reward-info">
                <div className="kt-loyalty-reward-name">₹500 off next order</div>
                <div className="kt-loyalty-reward-cost">1,000 points</div>
              </div>
              <div className="kt-loyalty-reward-btn">Redeem</div>
            </motion.div>
            <motion.div className="kt-loyalty-reward" initial={{ opacity: 0, x: -20 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.4, delay: 0.8 }}>
              <div className="kt-loyalty-reward-icon">✦</div>
              <div className="kt-loyalty-reward-info">
                <div className="kt-loyalty-reward-name">Free shipping · 30 days</div>
                <div className="kt-loyalty-reward-cost">500 points</div>
              </div>
              <div className="kt-loyalty-reward-btn kt-loyalty-reward-btn-done">Used</div>
            </motion.div>
            <motion.div className="kt-loyalty-reward" initial={{ opacity: 0, x: -20 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.4, delay: 0.9 }}>
              <div className="kt-loyalty-reward-icon">◈</div>
              <div className="kt-loyalty-reward-info">
                <div className="kt-loyalty-reward-name">Early access · new drops</div>
                <div className="kt-loyalty-reward-cost">2,000 points</div>
              </div>
              <div className="kt-loyalty-reward-btn kt-loyalty-reward-btn-locked">1,240 / 2,000</div>
            </motion.div>
          </div>

          {/* Come back notification */}
          <motion.div className="kt-loyalty-notif" initial={{ y: 30, opacity: 0 }} animate={inView ? { y: 0, opacity: 1 } : {}} transition={{ duration: 0.5, delay: 1 }}>
            <div className="kt-loyalty-notif-icon">✉</div>
            <div className="kt-loyalty-notif-text">
              <div className="kt-loyalty-notif-title">We miss you! 🌿</div>
              <div className="kt-loyalty-notif-desc">Your favourite shawl is back in stock</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default function CreateClient({ content }: Props) {
  const { hero, cta } = content
  const [activeStage, setActiveStage] = useState(0)
  const holdMs = [4200, 4200, 4600, 4200, 4600]
  useEffect(() => {
    const t = setTimeout(() => setActiveStage(n => (n + 1) % STAGES.length), holdMs[activeStage])
    return () => clearTimeout(t)
  }, [activeStage])

  return (
    <>
      <section className="kt-create-hero">
        <motion.div className="kt-create-hero-glow" animate={{ background: `radial-gradient(circle, oklch(0.78 0.06 ${STAGE_HUES[activeStage]} / 0.10), transparent 70%)` }} transition={{ duration: 1.2 }} />
        <div className="container">
          <div className="kt-create-hero-inner">
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <motion.div className="kt-create-hero-eyebrow" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>{hero.eyebrow}</motion.div>
              <h1 className="kt-create-hero-title"><WordReveal text={hero.title} /></h1>
              <motion.p className="kt-create-hero-sub" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.6 }}>{hero.subtitle}</motion.p>
              <motion.div className="kt-create-hero-actions" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.75 }}>
                <MagneticBtn href={hero.primaryCta.href}>{hero.primaryCta.label}</MagneticBtn>
                <Link className="kt-link" href={hero.secondaryCta.href}>{hero.secondaryCta.label}</Link>
              </motion.div>
            </motion.div>
            <motion.div className="kt-create-hero-visual" initial={{ opacity: 0, scale: 0.88 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.2, delay: 0.3 }}>
              <StoryArena activeStage={activeStage} />
            </motion.div>
          </div>
        </div>
      </section>

      <ScrollJourney />

      <GetPaid />

      <PhoneTwin />

      <section className="kt-create-cta">
        <div className="kt-create-cta-glow" />
        <div className="container">
          <motion.div className="kt-create-cta-inner" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px 0px' }} transition={{ duration: 0.7 }}>
            <div><h2>{cta.title}</h2><p>{cta.body}</p></div>
            <div className="kt-create-cta-actions">
              <MagneticBtn href={cta.primaryCta.href}>{cta.primaryCta.label}</MagneticBtn>
              <Link className="kt-link" href={cta.secondaryCta.href}>{cta.secondaryCta.label}</Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
