'use client'

import { useMode, MODE_LABELS, type Mode } from '@/app/context/mode-context'

const MODES: Mode[] = ['consumer', 'investor', 'platform']

export function ModeToggle() {
  const { mode, setMode } = useMode()
  return (
    <div className="kt-mode-toggle" role="group" aria-label="Audience mode">
      <span className="pill" aria-hidden />
      {MODES.map((m) => (
        <button
          key={m}
          type="button"
          onClick={() => setMode(m)}
          aria-pressed={mode === m}
        >
          {MODE_LABELS[m]}
        </button>
      ))}
    </div>
  )
}
