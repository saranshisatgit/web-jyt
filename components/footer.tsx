'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import Link from 'next/link'
import { useBrand } from '@/app/context/brand-context'
import { useWebsites } from '@/lib/marketing-data'
import { useLocale } from '@/app/context/locale-context'
import { useT } from '@/lib/i18n/use-t'
import { LOCALES } from '@/lib/i18n/config'

export function Footer() {
  const brand = useBrand()
  const { t } = useT()
  const { locale, setLocale: setAppLocale } = useLocale()
  const year = new Date().getFullYear()
  const { data } = useWebsites()
  const websites = data?.websites ?? []
  const currentLocation = LOCALES.find((l) => l.code === locale) ?? LOCALES[0]
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Sky rises up behind the footer as it scrolls into view.
  const footerRef = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: footerRef, offset: ['start end', 'end end'] })
  const skyY = useTransform(scrollYProgress, [0, 1], ['42%', '0%'])
  const skyOpacity = useTransform(scrollYProgress, [0, 0.6, 1], [0, 0.85, 1])

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
    <footer className="kt-footer" ref={footerRef}>
      {/* Rising sky — a periwinkle dawn that lifts up behind the footer as you
          reach the bottom. Aurora blobs drift within it. Reduced-motion: static. */}
      <div className="kt-footer-sky-wrap" aria-hidden>
        <motion.div
          className="kt-footer-sky"
          style={reduce ? { y: '0%', opacity: 1 } : { y: skyY, opacity: skyOpacity }}
        >
          <div className="aurora">
            <span className="blob b1" />
            <span className="blob b2" />
            <span className="blob b3" />
          </div>
        </motion.div>
      </div>
      <div className="container">
        {websites.length > 0 && (
          <div className="kt-foot-ateliers">
            <span className="kt-eyebrow">{t("footer.ateliersPowered")}</span>
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
            <h4>{t("footer.makers")}</h4>
            <ul>
              <li><Link href="/#makers">{t("footer.meetTheMakers")}</Link></li>
              <li><Link href="/#how-it-works">{t("footer.howItWorks")}</Link></li>
              <li><Link href="/blog">{t("nav.journal")}</Link></li>
            </ul>
          </div>
          <div>
            <h4>{t("footer.building")}</h4>
            <ul>
              <li><Link href="/about">{t("nav.about")}</Link></li>
              <li><Link href="/company">{t("footer.company")}</Link></li>
              <li><Link href="/contact">{t("footer.getADemo")}</Link></li>
              <li>
                <a href="https://github.com/Jaal-Yantra-Textiles/v2" target="_blank" rel="noopener noreferrer">
                  GitHub
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4>{t("footer.reach")}</h4>
            <ul>
              <li><a href={`mailto:${brand.emails.primary}`}>{brand.emails.primary}</a></li>
              <li><a href={`mailto:${brand.emails.founder}`}>{brand.emails.founder}</a></li>
            </ul>
          </div>
        </div>
        <div className="kt-foot-affil">
          <span className="kt-eyebrow">{t("footer.wasPartOf")}</span>
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
              <span>{currentLocation.label} · {currentLocation.lang}</span>
              <svg width="10" height="6" viewBox="0 0 10 6" aria-hidden fill="none" className="kt-mode-caret" data-open={open}>
                <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            {open && (
              <div className="kt-mode-dropdown" role="menu" style={{ right: 0, left: 'auto', top: 'auto', bottom: 'calc(100% + 8px)' }}>
                {LOCALES.map((l) => (
                  <button
                    key={l.code}
                    type="button"
                    role="menuitemradio"
                    aria-checked={locale === l.code}
                    onClick={() => { setAppLocale(l.code); setOpen(false) }}
                    className={locale === l.code ? 'is-current' : undefined}
                  >
                    <span className="kt-mode-dropdown-name">{l.label}</span>
                    <span className="kt-mode-dropdown-blurb">{l.lang}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <span>{t("footer.poweredByMedo")}</span>
        </div>
      </div>
    </footer>
  )
}
