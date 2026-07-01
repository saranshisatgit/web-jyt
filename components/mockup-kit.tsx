'use client'

import { useEffect, useState, type CSSProperties, type ReactNode } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'

/**
 * Shared kit for the live-React product mockups on the home + /solutions pages.
 * A small set of themed primitives (styled with the site's kt-* tokens, so they
 * stay crisp + theme-aware) plus ScenePlayer, which cycles a set of scenes with
 * a calm dwell, a crossfade, and clickable step pips. Replaces the baked
 * gif/webm reels.
 */

export const serif: CSSProperties = { fontFamily: 'var(--font-serif)', fontWeight: 400 }

export function Check({ size = 18 }: { size?: number }) {
  return (
    <span
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: 'var(--accent)',
        color: 'white',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size * 0.6,
        flexShrink: 0,
      }}
    >
      ✓
    </span>
  )
}

export function Swatch({ h = 64, w, label, hue = 60 }: { h?: number; w?: number; label?: string; hue?: number }) {
  return (
    <div
      style={{
        height: h,
        width: w,
        borderRadius: 'var(--r-md)',
        border: '1px solid var(--rule)',
        background: `linear-gradient(135deg, oklch(74% 0.045 ${hue}), oklch(55% 0.06 ${hue - 32}))`,
        flexShrink: 0,
        position: 'relative',
      }}
    >
      {label && (
        <span
          style={{
            position: 'absolute',
            left: 12,
            bottom: 10,
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'oklch(99% 0.01 60)',
          }}
        >
          {label}
        </span>
      )}
    </div>
  )
}

export function Card({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        background: 'var(--bg)',
        border: '1px solid var(--rule-soft)',
        borderRadius: 'var(--r-lg)',
        boxShadow: '0 18px 50px -30px oklch(0 0 0 / 0.35)',
      }}
    >
      {children}
    </div>
  )
}

export function CardHead({ eyebrow, title, right }: { eyebrow: string; title: ReactNode; right?: ReactNode }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 16px',
        borderBottom: '1px solid var(--rule-soft)',
        gap: 12,
      }}
    >
      <div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-mute)' }}>
          {eyebrow}
        </div>
        <div style={{ ...serif, fontSize: 18, marginTop: 2 }}>{title}</div>
      </div>
      {right}
    </div>
  )
}

export function CardBody({ children }: { children: ReactNode }) {
  return <div style={{ padding: 14 }}>{children}</div>
}

export function Row({ k, v, last }: { k: ReactNode; v: ReactNode; last?: boolean }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        padding: '9px 0',
        borderBottom: last ? 'none' : '1px solid var(--rule-soft)',
      }}
    >
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-mute)' }}>
        {k}
      </span>
      <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink)', textAlign: 'right' }}>{v}</span>
    </div>
  )
}

type TagKind = 'green' | 'orange' | 'white' | 'navy'
export function Tag({ kind = 'white', children }: { kind?: TagKind; children: ReactNode }) {
  const palette: Record<TagKind, CSSProperties> = {
    green: { background: 'oklch(93% 0.04 145)', color: 'var(--accent-deep)' },
    orange: { background: 'oklch(93% 0.06 60)', color: 'oklch(47% 0.165 60)' },
    white: { background: 'var(--bg)', color: 'var(--ink-soft)', border: '1px solid var(--rule)' },
    navy: { background: 'var(--cream)', color: 'var(--ink-soft)' },
  }
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        padding: '3px 11px',
        borderRadius: 'var(--r-pill)',
        fontFamily: 'var(--font-mono)',
        fontSize: 10,
        letterSpacing: '0.05em',
        whiteSpace: 'nowrap',
        ...palette[kind],
      }}
    >
      {children}
    </span>
  )
}

export function Btn({ accent, children }: { accent?: boolean; children: ReactNode }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        width: '100%',
        marginTop: 14,
        padding: '10px 20px',
        borderRadius: 'var(--r-pill)',
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: 'var(--cream)',
        background: accent ? 'var(--accent-deep)' : 'var(--ink)',
      }}
    >
      {children}
    </div>
  )
}

/** A staggered list item — fades in from the left in sequence. */
export function StaggerItem({ i, children }: { i: number; children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.15 + i * 0.18 }}
      style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', fontSize: 13 }}
    >
      {children}
    </motion.div>
  )
}

export type Scene = { label: string; render: () => ReactNode }

/** Cycles scenes with a calm dwell, crossfade, and clickable step pips. */
export function ScenePlayer({ scenes, holdMs = 3600 }: { scenes: Scene[]; holdMs?: number | number[] }) {
  const [i, setI] = useState(0)
  const reduce = useReducedMotion()
  const dwell = (n: number) => (Array.isArray(holdMs) ? holdMs[n] ?? 2800 : holdMs)

  useEffect(() => {
    const t = setTimeout(() => setI((n) => (n + 1) % scenes.length), dwell(i))
    return () => clearTimeout(t)
  }, [i, scenes.length])

  return (
    <div>
      <div
        style={{
          position: 'relative',
          background: 'var(--cream)',
          border: '1px solid var(--rule)',
          borderRadius: 'var(--r-md)',
          padding: 'clamp(20px, 2.5vw, 32px)',
          height: 500,
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          boxShadow: '0 24px 60px -40px oklch(0 0 0 / 0.30)',
        }}
      >
        <div style={{ width: '100%', maxWidth: 560, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 500, letterSpacing: '0.1em', color: 'var(--accent-deep)' }}>
              {String(i + 1).padStart(2, '0')} · {scenes[i].label.toUpperCase()}
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
              {scenes[i].render()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8, marginTop: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        {scenes.map((s, n) => (
          <button
            key={s.label}
            type="button"
            onClick={() => setI(n)}
            aria-label={`Show step ${n + 1}: ${s.label}`}
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
            {s.label}
          </button>
        ))}
      </div>
    </div>
  )
}
