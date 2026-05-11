'use client'

import { useEffect, useRef, useState } from 'react'
import { useMode, MODE_LABELS, type Mode } from '@/app/context/mode-context'

const MODES: Mode[] = ['consumer', 'investor', 'platform']

// One-line blurbs that explain what each mode reframes the site as. Kept
// short so the dropdown stays compact on narrow viewports.
const MODE_BLURBS: Record<Mode, string> = {
  consumer: 'For buyers — story, makers, storefronts',
  investor: 'For backers — thesis, traction, raise',
  platform: 'For builders — features, demo, GMV',
}

export function ModeToggle() {
  const { mode, setMode } = useMode()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Close on outside-click + Escape, mounted only while open so we don't
  // attach listeners we never use.
  useEffect(() => {
    if (!open) return
    const onPointer = (e: MouseEvent | TouchEvent) => {
      const node = ref.current
      if (node && !node.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onPointer)
    document.addEventListener('touchstart', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onPointer)
      document.removeEventListener('touchstart', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const pick = (m: Mode) => {
    setMode(m)
    setOpen(false)
  }

  return (
    <div className="kt-mode-menu" ref={ref}>
      <button
        type="button"
        className="kt-mode-trigger"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="dot" aria-hidden />
        <span>{MODE_LABELS[mode]}</span>
        <svg width="10" height="6" viewBox="0 0 10 6" aria-hidden fill="none" className="kt-mode-caret" data-open={open}>
          <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <div className="kt-mode-dropdown" role="menu">
          {MODES.map((m) => (
            <button
              key={m}
              type="button"
              role="menuitemradio"
              aria-checked={mode === m}
              onClick={() => pick(m)}
              className={mode === m ? 'is-current' : undefined}
            >
              <span className="kt-mode-dropdown-name">{MODE_LABELS[m]}</span>
              <span className="kt-mode-dropdown-blurb">{MODE_BLURBS[m]}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
