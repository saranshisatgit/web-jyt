'use client'

import { useState } from 'react'
import { useMode, type Mode } from '@/app/context/mode-context'
import { useT } from '@/lib/i18n/use-t'
import { ModeToggle } from './mode-toggle'
import { VessaNavbar, type VessaNavItem } from './vessa-navbar'
import { MobileNavDrawer, type NavTreeItem } from './mobile-nav-drawer'

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

  // Drawer items — the same tree, with subpages nested under their parent.
  const drawerItems: NavTreeItem[] = NAV_LINKS.map(({ href, key, children }) => ({
    href,
    label: t(key),
    children: children?.map((c) => ({ href: c.href, label: t(c.key) })),
  }))

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
      <MobileNavDrawer
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        items={drawerItems}
        footer={
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
        }
      />
    </>
  )
}