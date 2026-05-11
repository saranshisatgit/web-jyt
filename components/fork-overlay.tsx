'use client'

import type { ReactNode } from 'react'
import { useMode, type Mode } from '@/app/context/mode-context'
import { useBrand } from '@/app/context/brand-context'

type ForkCard = {
  mode: Mode
  variant: 'consumer' | 'investor' | 'platform'
  eyebrow: string
  headline: ReactNode
  lede: string
  arrow: string
}

const CARDS: ForkCard[] = [
  {
    mode: 'consumer',
    variant: 'consumer',
    eyebrow: 'For people who wear it',
    headline: <><em>Wearing</em><br />it.</>,
    lede: 'Meet the hands behind your next garment. Custom clothing with a story you can verify, made by an atelier you can name.',
    arrow: 'Step inside the atelier',
  },
  {
    mode: 'investor',
    variant: 'investor',
    eyebrow: 'For people backing it',
    headline: <>Backing<br /><em>it.</em></>,
    lede: 'The thesis, the platform, the live numbers, and the raise. Everything in one place — and a calendar to talk if it lands.',
    arrow: 'See the deck, live',
  },
  {
    mode: 'platform',
    variant: 'platform',
    eyebrow: 'For brands building it',
    headline: <>Building<br /><em>it.</em></>,
    lede: 'Run your own atelier on the same rails — admin, partners and storefront in one. Powered by Medo, sold as JaalYantra.',
    arrow: 'See the platform',
  },
]

function Arrow() {
  return (
    <svg viewBox="0 0 24 12" width="24" height="12" aria-hidden>
      <line x1="0" y1="6" x2="22" y2="6" stroke="currentColor" strokeWidth="1.5" />
      <polyline points="16,1 22,6 16,11" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

export function ForkOverlay() {
  const { showFork, closeFork, setMode } = useMode()
  const brand = useBrand()

  const pick = (m: Mode) => {
    setMode(m)
    closeFork()
  }

  return (
    <div
      className="kt-fork"
      data-open={showFork}
      role="dialog"
      aria-modal={showFork ? 'true' : 'false'}
      aria-label="Choose your view"
    >
      <div className="kt-fork-head">
        <span className="kt-brand">
          <span className="dot" aria-hidden />
          <span>
            <strong>{brand.wordmark}</strong>
          </span>
        </span>
        <button className="kt-fork-skip" type="button" onClick={() => pick('consumer')}>
          Skip · view as consumer →
        </button>
      </div>
      <div className="kt-fork-body">
        {CARDS.map((c) => (
          <button
            key={c.mode}
            className={`kt-fork-card ${c.variant}`}
            type="button"
            onClick={() => pick(c.mode)}
          >
            <span className="kt-fork-eyebrow">{c.eyebrow}</span>
            <h2>{c.headline}</h2>
            <p>{c.lede}</p>
            <span className="arrow">
              {c.arrow}
              <Arrow />
            </span>
          </button>
        ))}
      </div>
      <div className="kt-fork-foot">
        <span>Same story. Three ways in.</span>
        <span>You can switch any time.</span>
      </div>
    </div>
  )
}
