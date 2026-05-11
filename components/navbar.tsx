'use client'

import Link from 'next/link'
import { useBrand } from '@/app/context/brand-context'
import { ModeToggle } from './mode-toggle'

type NavLink = { href: string; text: string }

const NAV_LINKS: NavLink[] = [
  { href: '/#makers', text: 'Makers' },
  { href: '/#how-it-works', text: 'How it works' },
  { href: '/blog', text: 'Journal' },
  { href: '/about', text: 'About' },
]

export function Navbar() {
  const brand = useBrand()
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
        <ModeToggle />
      </div>
    </header>
  )
}
