'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import { useBrand } from '@/app/context/brand-context'
import { useMode, MODE_LABELS, type Mode } from '@/app/context/mode-context'
import { ModeToggle } from './mode-toggle'

type NavLink = { href: string; text: string; children?: NavLink[] }

const NAV_LINKS: NavLink[] = [
  {
    href: '/solutions',
    text: 'Solutions',
    children: [
      { href: '/solutions', text: 'Overview' },
      { href: '/solutions/wholesale', text: 'Wholesale' },
      { href: '/solutions/ecommerce', text: 'Ecommerce' },
      { href: '/solutions/sell-on-ai', text: 'Sell on AI' },
    ],
  },
  { href: '/compare', text: 'Compare' },
  { href: '/#makers', text: 'Makers' },
  { href: '/#how-it-works', text: 'How it works' },
  { href: '/blog', text: 'Journal' },
  { href: '/about', text: 'About' },
]

/** Desktop nav item with an optional hover/focus dropdown of use-case sub-pages. */
function NavItem({ item }: { item: NavLink }) {
  const [open, setOpen] = useState(false)
  if (!item.children) {
    return <Link href={item.href}>{item.text}</Link>
  }
  return (
    <div
      style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false) }}
    >
      <Link href={item.href} aria-haspopup="true" aria-expanded={open} style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
        {item.text}
        <span aria-hidden style={{ fontSize: 8, opacity: 0.55, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▾</span>
      </Link>
      {open && (
        <div style={{ position: 'absolute', top: '100%', left: 0, paddingTop: 12, zIndex: 60 }}>
          <div
            style={{
              background: 'var(--bg)',
              border: '1px solid var(--rule-soft)',
              borderRadius: 'var(--r-md)',
              boxShadow: '0 16px 44px -22px oklch(0 0 0 / 0.32)',
              padding: 6,
              minWidth: 200,
            }}
          >
            {item.children.map((c) => (
              <Link
                key={c.href}
                href={c.href}
                style={{ display: 'block', padding: '9px 12px', borderRadius: 'var(--r-sm)', whiteSpace: 'nowrap', fontSize: 14, color: 'var(--ink)' }}
              >
                {c.text}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

const MODES: Mode[] = ['consumer', 'investor', 'platform']

export function Navbar() {
  const brand = useBrand()
  const { mode, setMode } = useMode()
  const [menuOpen, setMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Portal target only exists post-mount; defer rendering the drawer
  // until then so SSR doesn't try to attach to document.body.
  useEffect(() => {
    setMounted(true)
  }, [])

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

  const pickMode = (m: Mode) => {
    setMode(m)
    setMenuOpen(false)
  }

  // Drawer JSX — portalled to <body> so it escapes the ancestor
  // <main className="relative overflow-clip"> which was painting-clipping
  // the fixed drawer on small screens. Uses a plain class toggle
  // ('is-open') rather than data-open to avoid any boolean stringification
  // quirks in the production build.
  const drawer = (
    <div
      id="kt-mobile-drawer"
      className={menuOpen ? 'kt-mobile-drawer is-open' : 'kt-mobile-drawer'}
      role="dialog"
      aria-modal="true"
      aria-hidden={!menuOpen}
    >
      <nav className="kt-mobile-nav" aria-label="Mobile primary">
        {NAV_LINKS.map(({ href, text, children }) => (
          <div key={href}>
            <Link href={href} onClick={() => setMenuOpen(false)}>
              {text}
            </Link>
            {children && (
              <div style={{ display: 'flex', flexDirection: 'column', paddingLeft: 18, marginTop: 4 }}>
                {children.map((c) => (
                  <Link
                    key={c.href}
                    href={c.href}
                    onClick={() => setMenuOpen(false)}
                    style={{ fontSize: 15, opacity: 0.7 }}
                  >
                    {c.text}
                  </Link>
                ))}
              </div>
            )}
          </div>
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
  )

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
          {NAV_LINKS.map((item) => (
            <NavItem key={item.href} item={item} />
          ))}
        </nav>
        <div className="kt-topbar-actions">
          <ModeToggle />
          <button
            type="button"
            className={menuOpen ? 'kt-hamburger is-open' : 'kt-hamburger'}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="kt-mobile-drawer"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>

        {mounted && createPortal(drawer, document.body)}
      </div>
    </header>
  )
}
