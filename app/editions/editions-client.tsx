'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Button } from '@medusajs/ui'
import { motion, useScroll, useTransform } from 'framer-motion'
import { EditionsGlyph } from '@/components/editions-glyph'
import { EditionsMockup } from '@/components/editions-mockup'
import type { EditionsContent, SectionData } from './page'

type Props = { content: EditionsContent }

function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add('visible')
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' },
    )
    const els = document.querySelectorAll('.kt-reveal')
    els.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])
}

function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0])
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(e.target.id)
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

/* ───── Nav ───── */

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

/* ───── Stats ───── */

function StatsRow({ stats }: { stats: { value: string; label: string }[] }) {
  return (
    <div className="kt-editions-stats">
      {stats.map((s) => (
        <div key={s.label} className="kt-editions-stat kt-reveal">
          <span className="kt-editions-stat-value">{s.value}</span>
          <span className="kt-editions-stat-label">{s.label}</span>
        </div>
      ))}
    </div>
  )
}

/* ───── Customer logos ───── */

function CustomersStrip({ names }: { names: string[] }) {
  return (
    <div className="kt-editions-customers">
      <span className="kt-editions-customers-label">Trusted by</span>
      <div className="kt-editions-customers-track">
        {names.map((name) => (
          <span key={name} className="kt-editions-customers-logo">{name}</span>
        ))}
      </div>
    </div>
  )
}

/* ───── Feature list (text cards beside the live mockup) ───── */

function FeatureList({ cards }: { cards: { title: string; body: string; tag?: string }[] }) {
  return (
    <div className="kt-ed-features">
      {cards.map((card, i) => (
        <article key={card.title} className={`kt-ed-feature kt-reveal kt-reveal-d${(i % 4) + 1}`}>
          <div className="kt-ed-feature-head">
            <h3>{card.title}</h3>
            {card.tag && <span className="kt-ed-feature-tag">{card.tag}</span>}
          </div>
          <p>{card.body}</p>
        </article>
      ))}
    </div>
  )
}

/* ───── Section — the mockup drifts up through the screen as you scroll ───── */

function EditionsSection({ section, index }: { section: SectionData; index: number }) {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  // the mockup travels through the viewport while its section is in view
  const mockY = useTransform(scrollYProgress, [0, 1], [90, -90])
  const mockOpacity = useTransform(scrollYProgress, [0, 0.16, 0.82, 1], [0, 1, 1, 0.65])
  const mockRotate = useTransform(scrollYProgress, [0, 1], [2.5, -2.5])
  // the glyph reforms/scales with scroll — deeper morph than a static spin
  const glyphScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1.08, 0.92])
  const glyphRotate = useTransform(scrollYProgress, [0, 1], [-24, 30])

  return (
    <section ref={ref} id={section.id} className={`kt-ed-sec${section.dark ? ' dark' : ''}`}>
      <div className="kt-ed-head kt-reveal">
        <div>
          <div className="kt-editions-eyebrow">{section.label}</div>
          <h2 className="kt-editions-section-heading">{section.heading}</h2>
        </div>
        <motion.div className="kt-ed-glyph" style={{ scale: glyphScale, rotate: glyphRotate }}>
          <EditionsGlyph variant={index + 1} size={116} />
        </motion.div>
      </div>

      <div className="kt-ed-grid">
        <FeatureList cards={section.cards} />
        <div className="kt-ed-mockcol">
          <motion.div className="kt-ed-mock" style={{ y: mockY, opacity: mockOpacity, rotate: mockRotate }}>
            <EditionsMockup id={section.id} />
          </motion.div>
        </div>
      </div>
    </section>
  )
}

/* ───── Page ───── */

export default function EditionsClient({ content }: Props) {
  useScrollReveal()
  const active = useActiveSection(content.navItems.map((n) => n.id))
  const { hero, navItems, sections, cta, stats, customers } = content

  return (
    <>
      {/* ───── Hero ───── */}
      <section className="kt-editions-hero">
        <div className="aurora" aria-hidden>
          <span className="blob b1" />
          <span className="blob b2" />
          <span className="blob b3" />
        </div>
        <div className="container">
          <div className="kt-editions-hero-inner">
            <div>
              <div className="kt-editions-hero-eyebrow">{hero.eyebrow}</div>
              <h1 className="kt-editions-hero-title">{hero.title}</h1>
              <p className="kt-editions-hero-sub">{hero.subtitle}</p>
              <div className="kt-editions-hero-actions">
                <Button asChild>
                  <Link href={hero.primaryCta.href}>{hero.primaryCta.label}</Link>
                </Button>
                <Button asChild variant="secondary">
                  <Link href={hero.secondaryCta.href}>{hero.secondaryCta.label}</Link>
                </Button>
              </div>
            </div>
            <div className="kt-editions-hero-visual">
              <EditionsGlyph variant={0} size={360} />
            </div>
          </div>
        </div>
      </section>

      {/* ───── Stats ───── */}
      {stats && stats.length > 0 && (
        <section className="kt-editions-stats-section">
          <div className="container">
            <StatsRow stats={stats} />
          </div>
        </section>
      )}

      {/* ───── Customers ───── */}
      {customers && customers.length > 0 && (
        <section className="kt-editions-customers-section">
          <div className="container">
            <CustomersStrip names={customers} />
          </div>
        </section>
      )}

      {/* ───── Sticky nav + sections ───── */}
      <div className="container kt-editions-layout">
        <SectionNav items={navItems} active={active} />

        <div>
          {sections.map((section, si) => (
            <EditionsSection key={section.id} section={section} index={si} />
          ))}
        </div>
      </div>

      {/* ───── Final CTA — sky rises behind it ───── */}
      <section className="kt-editions-cta">
        <div className="kt-editions-cta-sky" aria-hidden>
          <div className="aurora">
            <span className="blob b1" />
            <span className="blob b2" />
            <span className="blob b3" />
          </div>
        </div>
        <div className="container">
          <div className="kt-editions-cta-inner">
            <div>
              <h2 className="kt-reveal">{cta.title}</h2>
              <p className="kt-reveal kt-reveal-d1">{cta.body}</p>
            </div>
            <div className="kt-editions-cta-actions kt-reveal kt-reveal-d2">
              <Button asChild>
                <Link href={cta.primaryCta.href}>{cta.primaryCta.label}</Link>
              </Button>
              <Button asChild variant="secondary">
                <Link href={cta.secondaryCta.href}>{cta.secondaryCta.label}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
