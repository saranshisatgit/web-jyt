'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'

export type NavTreeItem = {
  href: string
  label: string
  children?: { href: string; label: string }[]
}

/**
 * Shared mobile nav drawer — portalled to <body> so it escapes any
 * ancestor overflow-clip / overflow-hidden, and aligned under the sticky
 * header via --vc-header-h (set by VessaNavbar). Body scroll locks while
 * open so the page underneath doesn't jitter on touch.
 */
export function MobileNavDrawer({
  open,
  onClose,
  items,
  footer,
}: {
  open: boolean
  onClose: () => void
  items: NavTreeItem[]
  footer?: ReactNode
}) {
  const [mounted, setMounted] = useState(false)

  // Portal target only exists post-mount; defer rendering the drawer
  // until then so SSR doesn't try to attach to document.body.
  useEffect(() => {
    setMounted(true)
  }, [])

  // Lock body scroll while the drawer is open. Unlocked on close + unmount.
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  // Close on Escape, matching the mega menu behaviour.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const drawer = (
    <div
      id="kt-mobile-drawer"
      className={open ? 'kt-mobile-drawer is-open' : 'kt-mobile-drawer'}
      role="dialog"
      aria-modal="true"
      aria-hidden={!open}
    >
      <nav className="kt-mobile-nav" aria-label="Mobile primary">
        {items.map(({ href, label, children }) => (
          <div key={href}>
            <Link href={href} onClick={onClose}>
              {label}
            </Link>
            {children && (
              <div style={{ display: 'flex', flexDirection: 'column', paddingLeft: 18, marginTop: 4 }}>
                {children.map((c) => (
                  <Link
                    key={c.href}
                    href={c.href}
                    onClick={onClose}
                    style={{ fontSize: 15, opacity: 0.7 }}
                  >
                    {c.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
      {footer}
    </div>
  )

  if (!mounted) return null
  return createPortal(drawer, document.body)
}