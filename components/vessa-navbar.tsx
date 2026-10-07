'use client'

import { useEffect, useState, type ReactNode } from 'react'
import Link from 'next/link'
import { useBrand } from '@/app/context/brand-context'
import { PixelMosaic } from '@/components/journey-pixel-draw'
import homeBlocks from '@/data/home-blocks.json'

/**
 * VESSA NAVBAR — the /vessa chrome, shared across routes.
 * Full-width sticky bar + full-width mega menus with a pixel-mosaic
 * preview that redraws itself per item. Menu content (routes, copy,
 * images) and the mosaic tuning live in data/home-blocks.json — the
 * editable backend blocks. Styling lives unscoped in
 * styles/vessa-chrome.css (vc-*) so it works inside `.vh` and on plain
 * kt-* pages alike.
 */

export type MegaKey = 'solutions' | 'about'

export type VessaNavItem = { href: string; label: string; mega?: MegaKey }

type MegaItem = { href: string; t: string; d: string; img: string }

// The mega menus, keyed by which nav trigger opens them — from the JSON.
const MENUS: Record<MegaKey, MegaItem[]> = {
  solutions: homeBlocks.megaMenu.map((m) => ({
    href: m.href,
    t: m.title,
    d: m.description,
    img: m.image,
  })),
  about: homeBlocks.aboutMenu.map((m) => ({
    href: m.href,
    t: m.title,
    d: m.description,
    img: m.image,
  })),
}

const megaKeys = Object.keys(MENUS) as MegaKey[]

export function VessaNavbar({ items, right }: { items: VessaNavItem[]; right?: ReactNode }) {
  const brand = useBrand()
  const [scrolled, setScrolled] = useState(false)
  const [openMenu, setOpenMenu] = useState<MegaKey | null>(null)
  const [menuIdx, setMenuIdx] = useState(0)

  // solidify the bar once the page has scrolled
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // mega menu: close on Escape
  useEffect(() => {
    if (!openMenu) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenMenu(null)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [openMenu])

  const open = (key: MegaKey) => {
    setMenuIdx(0)
    setOpenMenu(key)
  }

  const menu = openMenu ? MENUS[openMenu] : MENUS.solutions

  return (
    <header
      className={`vc-header${scrolled ? ' scrolled' : ''}`}
      onMouseLeave={() => setOpenMenu(null)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpenMenu(null)
      }}
    >
      <div className="vc-header-inner">
        <Link href="/" className="vc-brand" aria-label={`${brand.wordmark} home`}>
          <span className="dot" aria-hidden />
          {brand.wordmark}
        </Link>
        <nav className="vc-nav" aria-label="Primary">
          {items.map((it) =>
            it.mega && megaKeys.includes(it.mega) ? (
              <Link
                key={it.href}
                href={it.href}
                aria-haspopup="true"
                aria-expanded={openMenu === it.mega}
                onMouseEnter={() => open(it.mega as MegaKey)}
                onFocus={() => open(it.mega as MegaKey)}
                className={openMenu === it.mega ? 'open' : undefined}
              >
                {it.label}
                <svg className="vc-caret" width="10" height="7" viewBox="0 0 12 8" aria-hidden fill="none">
                  <path d="M2 2.5L6 6.5L10 2.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            ) : (
              <Link key={it.href} href={it.href} onMouseEnter={() => setOpenMenu(null)}>
                {it.label}
              </Link>
            )
          )}
        </nav>
        <div className="vc-actions">{right}</div>
      </div>

      {/* mega menu — full-width panel under the bar, content per trigger */}
      <div className="vc-mega" data-open={openMenu !== null} inert={openMenu === null}>
        <div className="vc-mega-inner">
          <div className="vc-mega-links">
            {menu.map((s, i) => (
              <Link
                key={s.href}
                href={s.href}
                className={`vc-mega-item${i === menuIdx ? ' active' : ''}`}
                onMouseEnter={() => setMenuIdx(i)}
                onClick={() => setOpenMenu(null)}
              >
                <span className="vc-mega-item-n">{String(i + 1).padStart(2, '0')}</span>
                <span className="vc-mega-item-copy">
                  <span className="vc-mega-item-t">{s.t}</span>
                  <span className="vc-mega-item-d">{s.d}</span>
                </span>
              </Link>
            ))}
          </div>
          <div className="vc-mega-visual" aria-hidden>
            <PixelMosaic
              key={`${openMenu}-${menuIdx}-${openMenu !== null}`}
              src={menu[menuIdx].img}
              cols={homeBlocks.pixelation.megaMenu.cols}
              duration={homeBlocks.pixelation.megaMenu.durationMs}
            />
            <span className="vc-mega-visual-tag">{menu[menuIdx].t}</span>
          </div>
        </div>
      </div>
    </header>
  )
}
