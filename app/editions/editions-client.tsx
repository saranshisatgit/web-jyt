'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { EditionsContent } from './page'

type Props = { content: EditionsContent }

/* ───── Scroll-reveal hook ───── */

function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.kt-reveal')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add('visible')
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' },
    )
    els.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])
}

/* ───── Active-section tracking ───── */

function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0])
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setActive(e.target.id)
          }
        }
      },
      { threshold: 0.3, rootMargin: '-80px 0px -50% 0px' },
    )
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [ids])
  return active
}

/* ───── Sub-components ───── */

function LoomGlyph() {
  return (
    <div className="kt-editions-glyph" aria-hidden>
      <svg viewBox="0 0 64 64" fill="none">
        <rect x="10" y="8" width="44" height="48" rx="3" stroke="var(--accent)" strokeWidth="1.2" fill="none" />
        <line x1="18" y1="20" x2="46" y2="20" stroke="var(--accent-soft)" strokeWidth="1" />
        <line x1="18" y1="28" x2="46" y2="28" stroke="var(--accent-soft)" strokeWidth="1" />
        <line x1="18" y1="36" x2="46" y2="36" stroke="var(--accent-soft)" strokeWidth="1" />
        <line x1="18" y1="44" x2="46" y2="44" stroke="var(--accent-soft)" strokeWidth="1" />
        <line x1="30" y1="20" x2="30" y2="44" stroke="var(--accent)" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.5" />
        <circle cx="32" cy="32" r="10" stroke="var(--accent-deep)" strokeWidth="0.8" strokeDasharray="2 3" opacity="0.25" />
      </svg>
    </div>
  )
}

function SectionNav({ items, active }: { items: { id: string; label: string }[]; active: string }) {
  return (
    <nav className="kt-editions-nav" aria-label="Sections">
      {items.map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          className={active === item.id ? 'active' : ''}
        >
          {item.label}
        </a>
      ))}
    </nav>
  )
}

function CardGrid({ cards, prefix }: { cards: { title: string; body: string; tag?: string; dark?: boolean }[]; prefix: string }) {
  return (
    <div className="kt-editions-grid">
      {cards.map((card, i) => (
        <article
          key={card.title}
          className={`kt-editions-card kt-reveal kt-reveal-d${(i % 4) + 1}${card.dark ? ' light-on-dark' : ''}`}
        >
          {card.tag && <span className="kt-editions-card-tag">{card.tag}</span>}
          <h3>{card.title}</h3>
          <p>{card.body}</p>
        </article>
      ))}
    </div>
  )
}

/* ───── Page ───── */

export default function EditionsClient({ content }: Props) {
  useScrollReveal()
  const active = useActiveSection(content.navItems.map((n) => n.id))
  const { hero, navItems, sections, cta } = content

  return (
    <>
      {/* ───── Hero ───── */}
      <section className="kt-editions-hero">
        <div className="kt-editions-hero-bg" />
        <div className="container">
          <LoomGlyph />
          <div className="kt-eyebrow">
            <span className="dot pulse" />
            {hero.eyebrow}
          </div>
          <h1 className="kt-display xl kt-gradient-text" style={{ marginTop: '16px' }}>
            {hero.title}
          </h1>
          <p className="kt-editions-hero-sub kt-reveal kt-reveal-d1">
            {hero.subtitle}
          </p>
          <div
            className="kt-reveal kt-reveal-d2"
            style={{ marginTop: '36px', display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}
          >
            <Link className="kt-btn kt-btn-lg" href={hero.primaryCta.href}>
              {hero.primaryCta.label}
            </Link>
            <Link className="kt-link" href={hero.secondaryCta.href}>
              {hero.secondaryCta.label}
            </Link>
          </div>
        </div>
      </section>

      {/* ───── Sticky nav + sections ───── */}
      <div className="container" style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: '0' }}>
        <SectionNav items={navItems} active={active} />

        <div>
          {sections.map((section) => (
            <section
              key={section.id}
              id={section.id}
              className="kt-editions-section"
              style={section.dark ? { background: 'var(--ink-dark-bg)', borderRadius: 'var(--r-lg)', padding: '80px 48px', marginBottom: '40px', color: 'var(--cream)' } : {}}
            >
              <div className="kt-editions-header kt-reveal">
                <div className="kt-editions-eyebrow" style={section.dark ? { color: 'oklch(0.78 0.06 145)' } : {}}>
                  <span className="dot" />
                  {section.label}
                </div>
                <h2
                  className="kt-display m"
                  style={section.dark ? { color: 'var(--cream)' } : {}}
                >
                  {section.heading}
                </h2>
              </div>

              <CardGrid cards={section.cards} prefix={section.id} />
            </section>
          ))}
        </div>
      </div>

      {/* ───── Final CTA (full-width, outside nav grid) ───── */}
      <section className="kt-editions-cta">
        <div className="container">
          <div className="kt-editions-cta-inner">
            <div>
              <h2 className="kt-reveal">{cta.title}</h2>
              <p className="kt-reveal kt-reveal-d1">{cta.body}</p>
            </div>
            <div className="kt-editions-cta-actions kt-reveal kt-reveal-d2">
              <Link className="kt-btn kt-btn-lg" href={cta.primaryCta.href}>
                {cta.primaryCta.label}
              </Link>
              <Link className="kt-link" href={cta.secondaryCta.href}>
                {cta.secondaryCta.label}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
