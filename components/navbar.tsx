'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useBrand } from '@/app/context/brand-context'
import { useMode, MODE_LABELS, type Mode } from '@/app/context/mode-context'
import { ModeToggle } from './mode-toggle'

type NavLink = { href: string; text: string }

const NAV_LINKS: NavLink[] = [
  { href: '/#makers', text: 'Makers' },
  { href: '/#how-it-works', text: 'How it works' },
  { href: '/blog', text: 'Journal' },
  { href: '/about', text: 'About' },
]

const MODES: Mode[] = ['consumer', 'investor', 'platform']

export function Navbar() {
  const brand = useBrand()
  const { mode, setMode } = useMode()
  const [menuOpen, setMenuOpen] = useState(false)

  const pickMode = (m: Mode) => {
    setMode(m)
    setMenuOpen(false)
  }

  // Lock body scroll while the drawer is open so the page underneath
  // doesn't jitter on touch. Unlocked on close + on unmount.
  useEffect(() => {
    if (menuOpen) {
      const prev = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = prev
      }
    }
  }, [menuOpen])

  return (
    <header className="kt-topbar">
      <div className="container kt-topbar-inner">
        <Link href="/" className="kt-brand" aria-label={`${brand.wordmark} home`}>
          <span className="dot" aria-hidden />
          <span>
            <strong>{brand.wordmark}</strong>
            <em>est. 2025</em>
          </span>
        </Link>
        <nav className="kt-nav" aria-label="Primary">
          {NAV_LINKS.map(({ href, text }) => (
            <Link key={href} href={href}>
              {text}
            </Link>
          ))}
        </nav>
        <div className="kt-topbar-actions">
          <ModeToggle />
          <button
            type="button"
            className="kt-hamburger"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="kt-mobile-drawer"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span data-open={menuOpen} />
            <span data-open={menuOpen} />
            <span data-open={menuOpen} />
          </button>
        </div>
      </div>

      <div
        id="kt-mobile-drawer"
        className="kt-mobile-drawer"
        data-open={menuOpen}
        role="dialog"
        aria-modal="true"
        aria-hidden={!menuOpen}
      >
        <nav className="kt-mobile-nav" aria-label="Mobile primary">
          {NAV_LINKS.map(({ href, text }) => (
            <Link key={href} href={href} onClick={() => setMenuOpen(false)}>
              {text}
            </Link>
          ))}
        </nav>
        <div className="kt-mobile-modes" aria-label="Audience mode">
          <span className="kt-eyebrow">You&apos;re</span>
          <div className="kt-mobile-modes-list">
            {MODES.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => pickMode(m)}
                aria-pressed={mode === m}
                className={mode === m ? 'is-current' : undefined}
              >
                {MODE_LABELS[m]}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  )
}
