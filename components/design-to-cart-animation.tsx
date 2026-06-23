'use client'

import { useEffect, useState, type CSSProperties } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'

/**
 * The flagship "create → sell on one rail" reel, as a LIVE React animation
 * (not a baked gif/webm). Cycles one piece through four scenes — atelier
 * Design → Publish → Storefront → Added to cart — using the site's kt-* design
 * tokens, so it stays crisp, responsive, and theme-aware. Mirrors the content of
 * design-to-cart-mockup.html, kept for the gif pipeline / fallback.
 */

const SCENES = ['Design', 'Publish', 'Storefront', 'Sold'] as const
const HOLD_MS = [2400, 2200, 2600, 3200] // per-scene dwell before advancing

const swatch = (h: number): CSSProperties => ({
  height: h,
  borderRadius: 'var(--r-md)',
  border: '1px solid var(--rule)',
  background: 'linear-gradient(135deg, oklch(74% 0.045 60), oklch(55% 0.06 28))',
  flexShrink: 0,
})

const card: CSSProperties = {
  background: 'var(--bg)',
  border: '1px solid var(--rule-soft)',
  borderRadius: 'var(--r-lg)',
  overflow: 'hidden',
  boxShadow: '0 18px 50px -30px oklch(0 0 0 / 0.35)',
}
const cardHead: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '16px 20px',
  borderBottom: '1px solid var(--rule-soft)',
}
const cardBody: CSSProperties = { padding: 20 }
const row: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 12,
  padding: '9px 0',
  borderBottom: '1px solid var(--rule-soft)',
}
const k: CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: 10,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: 'var(--ink-mute)',
}
const v: CSSProperties = { fontSize: 13, fontWeight: 500, color: 'var(--ink)' }
const btn = (accent = false): CSSProperties => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
  width: '100%',
  marginTop: 18,
  padding: '12px 24px',
  borderRadius: 'var(--r-pill)',
  fontFamily: 'var(--font-mono)',
  fontSize: 11,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: 'var(--cream)',
  background: accent ? 'var(--accent-deep)' : 'var(--ink)',
})
const tag = (kind: 'green' | 'orange' | 'white'): CSSProperties => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 5,
  padding: '3px 11px',
  borderRadius: 'var(--r-pill)',
  fontFamily: 'var(--font-mono)',
  fontSize: 10,
  letterSpacing: '0.05em',
  ...(kind === 'green' && { background: 'oklch(93% 0.04 145)', color: 'var(--accent-deep)' }),
  ...(kind === 'orange' && { background: 'oklch(93% 0.06 60)', color: 'oklch(47% 0.165 60)' }),
  ...(kind === 'white' && { background: 'var(--bg)', color: 'var(--ink-soft)', border: '1px solid var(--rule)' }),
})
const serif: CSSProperties = { fontFamily: 'var(--font-serif)', fontWeight: 400 }

function Check() {
  return (
    <span
      style={{
        width: 18,
        height: 18,
        borderRadius: '50%',
        background: 'var(--accent)',
        color: 'white',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 11,
        flexShrink: 0,
      }}
    >
      ✓
    </span>
  )
}

function SceneDesign() {
  return (
    <div style={card}>
      <div style={cardHead}>
        <div>
          <div style={k}>Design · DSG-2261</div>
          <div style={{ ...serif, fontSize: 21, marginTop: 2 }}>Pashmina Shawl — AW26</div>
        </div>
        <span style={tag('green')}>
          <Check /> Design ready
        </span>
      </div>
      <div style={cardBody}>
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ ...swatch(64), width: 64 }} />
          <div style={{ flex: 1 }}>
            <div style={row}>
              <span style={k}>Fabric</span>
              <span style={v}>Cashmere 80 / Silk 20</span>
            </div>
            <div style={row}>
              <span style={k}>Artisan</span>
              <span style={v}>Rukmini · Bagru, IN</span>
            </div>
            <div style={{ ...row, borderBottom: 'none' }}>
              <span style={k}>Material lot</span>
              <span style={v}>LOT-CSH-0098</span>
            </div>
          </div>
        </div>
        <div style={btn()}>Publish to storefront →</div>
      </div>
    </div>
  )
}

function ScenePublish() {
  const items = [
    'Product created from design',
    'Variants & region pricing set',
    'Digital Product Passport minted',
    'Live on your branded storefront',
  ]
  return (
    <div style={card}>
      <div style={cardHead}>
        <div>
          <div style={k}>Publishing</div>
          <div style={{ ...serif, fontSize: 21, marginTop: 2 }}>From design to live product</div>
        </div>
        <span style={tag('green')}>Live</span>
      </div>
      <div style={cardBody}>
        {items.map((t, i) => (
          <motion.div
            key={t}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 + i * 0.22 }}
            style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', fontSize: 13 }}
          >
            <Check /> {t}
          </motion.div>
        ))}
        <div style={btn()}>View on storefront →</div>
      </div>
    </div>
  )
}

function SceneStorefront() {
  return (
    <div style={card}>
      <div style={cardHead}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 9, height: 9, borderRadius: '50%', background: 'var(--accent)' }} />
          <span style={{ ...serif, fontSize: 16 }}>LeAtelier</span>
        </div>
        <span style={tag('white')}>leatelier.com</span>
      </div>
      <div style={cardBody}>
        <div style={{ ...swatch(150), position: 'relative' }}>
          <span
            style={{
              position: 'absolute',
              left: 14,
              bottom: 12,
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'oklch(99% 0.01 60)',
            }}
          >
            Handwoven · Bagru
          </span>
        </div>
        <div style={{ ...serif, fontSize: 23, marginTop: 14 }}>Pashmina Shawl</div>
        <div className="muted" style={{ marginTop: 2, fontSize: 13 }}>
          Handwoven in Bagru · full provenance on the passport
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 }}>
          <span style={{ ...serif, fontSize: 28 }}>€420</span>
          <span style={tag('orange')}>In stock</span>
        </div>
        <div style={btn()}>Add to cart</div>
      </div>
    </div>
  )
}

function SceneSold() {
  return (
    <div style={card}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '16px 20px',
          background: 'var(--accent-pale)',
          borderBottom: '1px solid var(--rule-soft)',
        }}
      >
        <Check />
        <span style={{ ...v, fontSize: 14 }}>Added to cart</span>
      </div>
      <div style={{ display: 'flex', gap: 14, alignItems: 'center', padding: '18px 20px' }}>
        <div style={{ ...swatch(56), width: 56 }} />
        <div style={{ flex: 1 }}>
          <div style={v}>Pashmina Shawl</div>
          <div className="muted" style={{ fontSize: 12 }}>
            Cashmere 80 / Silk 20 · Qty 1
          </div>
          <div className="muted" style={{ fontSize: 12, marginTop: 4 }}>
            — Made by Rukmini · Passport DPP-2261
          </div>
        </div>
        <span style={{ ...serif, fontSize: 21 }}>€420</span>
      </div>
      <div style={{ padding: '0 20px 20px' }}>
        <div style={btn(true)}>Checkout →</div>
        <div style={{ ...k, textAlign: 'center', marginTop: 12 }}>Design → sale on one rail</div>
      </div>
    </div>
  )
}

const RENDERERS = [SceneDesign, ScenePublish, SceneStorefront, SceneSold]

export function DesignToCartAnimation() {
  const [i, setI] = useState(0)
  const reduce = useReducedMotion()

  useEffect(() => {
    const t = setTimeout(() => setI((n) => (n + 1) % SCENES.length), HOLD_MS[i])
    return () => clearTimeout(t)
  }, [i])

  const Scene = RENDERERS[i]

  return (
    <div>
      <div
        style={{
          position: 'relative',
          background: 'var(--cream)',
          border: '1px solid var(--rule)',
          borderRadius: 'var(--r-md)',
          padding: 'clamp(20px, 4vw, 48px)',
          minHeight: 360,
          display: 'flex',
          alignItems: 'center',
          boxShadow: '0 24px 60px -40px oklch(0 0 0 / 0.30)',
        }}
      >
        <div style={{ width: '100%', maxWidth: 460, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                fontWeight: 500,
                letterSpacing: '0.1em',
                color: 'var(--accent-deep)',
              }}
            >
              {String(i + 1).padStart(2, '0')} · {SCENES[i].toUpperCase()}
            </span>
            <span style={{ flex: 1, height: 1, background: 'var(--rule-soft)' }} />
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={i}
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
              animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: -12 }}
              transition={{ duration: 0.45, ease: 'easeInOut' }}
            >
              <Scene />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      {/* Step pips */}
      <div style={{ display: 'flex', gap: 8, marginTop: 16, alignItems: 'center', flexWrap: 'wrap' }}>
        {SCENES.map((s, n) => (
          <button
            key={s}
            type="button"
            onClick={() => setI(n)}
            aria-label={`Show step ${n + 1}: ${s}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              padding: 0,
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: n === i ? 'var(--accent-deep)' : 'var(--ink-mute)',
              opacity: n === i ? 1 : 0.6,
            }}
          >
            <span
              style={{
                width: n === i ? 18 : 8,
                height: 8,
                borderRadius: 'var(--r-pill)',
                background: n === i ? 'var(--accent)' : 'var(--rule)',
                transition: 'width 0.3s ease, background 0.3s ease',
              }}
            />
            {s}
          </button>
        ))}
      </div>
    </div>
  )
}
