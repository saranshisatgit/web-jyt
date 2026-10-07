'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import { useMode, type Mode } from '@/app/context/mode-context'
import { useT } from '@/lib/i18n/use-t'
import { ModeToggle } from './mode-toggle'
import { VessaNavbar, type VessaNavItem } from './vessa-navbar'

type NavLink = { href: string; key: string; children?: NavLink[] }

const NAV_LINKS: NavLink[] = [
  {
    href: '/solutions',
    key: 'nav.solutions',
    children: [
      { href: '/solutions', key: 'nav.overview' },
      { href: '/solutions/wholesale', key: 'nav.wholesale' },
      { href: '/solutions/ecommerce', key: 'nav.ecommerce' },
      { href: '/solutions/sell-on-ai', key: 'nav.sellOnAi' },
      { href: '/solutions/integrations', key: 'nav.integrations' },
    ],
  },
  { href: '/compare', key: 'nav.compare' },
  { href: '/blog', key: 'nav.journal' },
  {
    href: '/about',
    key: 'nav.about',
    children: [
      { href: '/company', key: 'nav.company' },
      { href: '/contact', key: 'nav.offices' },
      { href: '/map', key: 'nav.map' },
    ],
  },
]

const MODES: Mode[] = ['consumer', 'investor', 'platform']

export function Navbar() {
  const { t } = useT()
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

  // Desktop items — Solutions and About each open their own mega menu.
  const items: VessaNavItem[] = NAV_LINKS.map(({ href, key, children }) => ({
    href,
    label: t(key),
    mega: children ? (href === '/about' ? 'about' : 'solutions') : undefined,
  }))

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
        {NAV_LINKS.map(({ href, key, children }) => (
          <div key={href}>
            <Link href={href} onClick={() => setMenuOpen(false)}>
              {t(key)}
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
                    {t(c.key)}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
      <div className="kt-mobile-modes" aria-label="Audience mode">
        <span className="kt-eyebrow">{t("mode.label")}</span>
        <div className="kt-mobile-modes-list">
          {MODES.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => pickMode(m)}
              aria-pressed={mode === m}
              className={mode === m ? 'is-current' : undefined}
            >
              {t("mode." + m)}
            </button>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <>
      <VessaNavbar
        items={items}
        right={
          <>
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
          </>
        }
      />
      {mounted && createPortal(drawer, document.body)}
    </>
  )
}
