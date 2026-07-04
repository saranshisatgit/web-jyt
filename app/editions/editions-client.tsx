'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Storefront } from '@/components/mockup-animations'
import type { EditionsContent } from './page'

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

/* ───── Card grid ───── */

const MET_PAINTINGS = [
  'https://images.metmuseum.org/CRDImages/ep/original/DP-41223-001.jpg',
  'https://images.metmuseum.org/CRDImages/ep/original/DP-42549-001.jpg',
  'https://images.metmuseum.org/CRDImages/ep/original/DT7098.jpg',
  'https://images.metmuseum.org/CRDImages/ep/original/DT47.jpg',
  'https://images.metmuseum.org/CRDImages/ep/original/DT1025.jpg',
  'https://images.metmuseum.org/CRDImages/ep/original/DP-20101-001.jpg',
  'https://images.metmuseum.org/CRDImages/ep/original/DP-14347-001.jpg',
  'https://images.metmuseum.org/CRDImages/ep/original/DP-31520-001.jpg',
  'https://images.metmuseum.org/CRDImages/ep/original/DP-16589-001.jpg',
  'https://images.metmuseum.org/CRDImages/ep/original/DT1396.jpg',
]

function CardGrid({ cards }: { cards: { title: string; body: string; tag?: string }[] }) {
  return (
    <div className="kt-editions-grid">
      {cards.map((card, i) => {
        const imgIdx = [...card.title].reduce((acc, c) => acc + c.charCodeAt(0), 0) % MET_PAINTINGS.length
        return (
          <article
            key={card.title}
            className={`kt-editions-card kt-reveal kt-reveal-d${(i % 4) + 1}`}
          >
            <div className="kt-editions-card-img-wrap">
              <img
                src={MET_PAINTINGS[imgIdx]}
                alt=""
                loading="lazy"
                className="kt-editions-card-img-src"
              />
            </div>
            <div className="kt-editions-card-body">
              {card.tag && <span className="kt-editions-card-tag">{card.tag}</span>}
              <h3>{card.title}</h3>
              <p className="kt-editions-card-desc">{card.body}</p>
            </div>
          </article>
        )
      })}
    </div>
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
        <div className="container">
          <div className="kt-editions-hero-inner">
            <div>
              <div className="kt-editions-hero-eyebrow">{hero.eyebrow}</div>
              <h1 className="kt-editions-hero-title">{hero.title}</h1>
              <p className="kt-editions-hero-sub">{hero.subtitle}</p>
              <div className="kt-editions-hero-actions">
                <Link className="kt-btn kt-btn-lg" href={hero.primaryCta.href}>
                  {hero.primaryCta.label}
                </Link>
                <Link className="kt-link" href={hero.secondaryCta.href}>
                  {hero.secondaryCta.label}
                </Link>
              </div>
            </div>
            <div className="kt-editions-hero-visual">
              <div className="kt-editions-hero-mockup">
                <Storefront />
              </div>
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
            <section
              key={section.id}
              id={section.id}
              className={`kt-editions-section${section.dark ? ' dark' : ''}`}
            >
              <div className="kt-editions-header kt-reveal">
                <div className="kt-editions-eyebrow">{section.label}</div>
                <h2 className="kt-editions-section-heading">{section.heading}</h2>
              </div>

              <CardGrid cards={section.cards} />
            </section>
          ))}
        </div>
      </div>

      {/* ───── Final CTA ───── */}
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
