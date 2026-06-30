'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useBrand } from '@/app/context/brand-context'
import { useWebsites } from '@/lib/marketing-data'

const LOCATIONS: { label: string; lang: string }[] = [
  { label: 'India', lang: 'en-IN' },
  { label: 'Italy', lang: 'it-IT' },
  { label: 'Australia', lang: 'en-AU' },
  { label: 'US', lang: 'en-US' },
  { label: 'Latvia', lang: 'lv-LV' },
]

export function Footer() {
  const brand = useBrand()
  const year = new Date().getFullYear()
  const { data } = useWebsites()
  const websites = data?.websites ?? []
  const [location, setLocation] = useState(LOCATIONS[0])
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

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

  // Programs / councils JYT was part of. Text-only credibility badges —
  // no links (per design decision); swap for logos later if needed.
  const AFFILIATIONS = [
    'Digital Hatch',
    'is part of Startup India',
    '&  Startup Latvia',
    '& Indian Handloom Council',
  ]

  return (
    <footer className="kt-footer">
      <div className="container">
        {websites.length > 0 && (
          <div className="kt-foot-ateliers">
            <span className="kt-eyebrow">Ateliers powered</span>
            <div className="kt-foot-ateliers-list">
              {websites.map((w) => (
                <a key={w.id} href={w.url} target="_blank" rel="noopener noreferrer">
                  {w.name}
                  <span className="kt-foot-ateliers-domain">{w.domain}</span>
                </a>
              ))}
            </div>
          </div>
        )}
        <div className="kt-foot-grid">
          <div>
            <Link href="/" className="kt-brand" aria-label={`${brand.wordmark} home`}>
              <span className="dot" aria-hidden />
              <span>
                <strong>{brand.wordmark}</strong>
              </span>
            </Link>
            <p className="muted" style={{ fontSize: '14px', maxWidth: '380px', lineHeight: 1.5, marginTop: '14px' }}>
              {brand.tagline} Made between {brand.geographies.join(', ')} — powered by Medo, an open-source production OS.
            </p>
          </div>
          <div>
            <h4>Makers</h4>
            <ul>
              <li><Link href="/#makers">Meet the makers</Link></li>
              <li><Link href="/#how-it-works">How it works</Link></li>
              <li><Link href="/blog">Journal</Link></li>
            </ul>
          </div>
          <div>
            <h4>Building</h4>
            <ul>
              <li><Link href="/about">About</Link></li>
              <li><Link href="/contact">Get a demo</Link></li>
              <li>
                <a href="https://github.com/Jaal-Yantra-Textiles/v2" target="_blank" rel="noopener noreferrer">
                  GitHub
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4>Reach</h4>
            <ul>
              <li><a href={`mailto:${brand.emails.primary}`}>{brand.emails.primary}</a></li>
              <li><a href={`mailto:${brand.emails.founder}`}>{brand.emails.founder}</a></li>
            </ul>
          </div>
        </div>
        <div className="kt-foot-affil">
          <span className="kt-eyebrow">Was part of</span>
          <div className="kt-foot-badges">
            {AFFILIATIONS.map((a) => (
              <span key={a} className="kt-foot-badge">{a}</span>
            ))}
          </div>
        </div>
        <div className="kt-foot-bottom">
          <span>© {year} {brand.wordmark} · {brand.geographies.join(' · ')}</span>
          <div className="kt-mode-menu" ref={ref}>
            <button
              type="button"
              className="kt-mode-trigger"
              aria-haspopup="menu"
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              <span className="dot" aria-hidden />
              <span>{location.label} · {location.lang}</span>
              <svg width="10" height="6" viewBox="0 0 10 6" aria-hidden fill="none" className="kt-mode-caret" data-open={open}>
                <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            {open && (
              <div className="kt-mode-dropdown" role="menu" style={{ right: 0, left: 'auto', top: 'auto', bottom: 'calc(100% + 8px)' }}>
                {LOCATIONS.map((l) => (
                  <button
                    key={l.lang}
                    type="button"
                    role="menuitemradio"
                    aria-checked={location.label === l.label}
                    onClick={() => { setLocation(l); setOpen(false) }}
                    className={location.label === l.label ? 'is-current' : undefined}
                  >
                    <span className="kt-mode-dropdown-name">{l.label}</span>
                    <span className="kt-mode-dropdown-blurb">{l.lang}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <span>Powered by Medo · open source</span>
        </div>
      </div>
    </footer>
  )
}
