'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Storefront, AgentCheckout, BrandStarter, AdminPanel } from '@/components/mockup-animations'
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
    const els = document.querySelectorAll('.kt-reveal, .kt-reveal-scale')
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

/* ───── Card grid ───── */

function CardGrid({ cards }: { cards: { title: string; body: string; tag?: string; dark?: boolean }[] }) {
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

/* ───── Demo strip ───── */

const DEMOS = [
  { name: 'Storefront', desc: 'Branded storefront with product passports', hue: 250, component: Storefront },
  { name: 'AI Checkout', desc: 'Agent-driven conversational purchase', hue: 280, component: AgentCheckout },
  { name: 'Brand Kit', desc: '1-click brand & domain setup', hue: 40, component: BrandStarter },
  { name: 'Admin Panel', desc: 'Orders, products, analytics at a glance', hue: 210, component: AdminPanel },
]

function DemoStrip() {
  return (
    <div className="kt-editions-demo-strip kt-reveal kt-reveal-d3">
      {DEMOS.map((demo) => (
        <div key={demo.name} className="kt-editions-demo-card">
          <div
            className="kt-editions-demo-card-img"
            style={{ background: `linear-gradient(135deg, oklch(0.92 0.03 ${demo.hue}), oklch(0.85 0.05 ${demo.hue - 20}))` }}
          >
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="oklch(0.4 0.08 145)" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="3" />
              <line x1="3" y1="9" x2="21" y2="9" />
              <line x1="9" y1="3" x2="9" y2="21" />
            </svg>
          </div>
          <h4>{demo.name}</h4>
          <p>{demo.desc}</p>
        </div>
      ))}
    </div>
  )
}

/* ───── Stats ───── */

const STATS = [
  { num: '40+', lbl: 'Updates in this edition' },
  { num: '8', lbl: 'Platform categories' },
  { num: '5', lbl: 'New AI channels' },
  { num: '∞', lbl: 'Threads to explore' },
]

function StatsRow() {
  return (
    <div className="kt-editions-stats kt-reveal">
      {STATS.map((s) => (
        <div key={s.lbl} className="kt-editions-stat kt-reveal-scale">
          <div className="kt-editions-stat-num">{s.num}</div>
          <div className="kt-editions-stat-lbl">{s.lbl}</div>
        </div>
      ))}
    </div>
  )
}

/* ───── Featured mockup ───── */

function FeaturedMockup() {
  return (
    <div className="kt-editions-feature kt-reveal kt-reveal-d2">
      <div className="kt-editions-feature-card">
        <div>
          <h3>Your products, woven for AI</h3>
          <p>Structured product data means every thread, colour, and weave is discoverable by AI agents. Syndicated data drives 2× more discovery in AI chats.</p>
        </div>
        <div className="kt-editions-feature-mockup">
          <AgentCheckout />
        </div>
      </div>
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
          <StatsRow />
        </div>
      </section>

      {/* ───── Sticky nav + sections ───── */}
      <div className="container kt-editions-layout">
        <SectionNav items={navItems} active={active} />

        <div>
          {sections.map((section, si) => (
            <section
              key={section.id}
              id={section.id}
              className="kt-editions-section"
            >
              <div className="kt-editions-header kt-reveal">
                <div className="kt-editions-eyebrow">{section.label}</div>
                <h2 className="kt-editions-section-heading">{section.heading}</h2>
              </div>

              {si === 0 && (
                <>
                  <FeaturedMockup />
                  <DemoStrip />
                </>
              )}

              <CardGrid cards={section.cards} />

              {si === sections.length - 1 && (
                <div className="kt-editions-feature-card" style={{ marginTop: '32px' }}>
                  <div>
                    <h3 style={{ margin: 0 }}>Every feature is an API call away</h3>
                    <p style={{ marginTop: '8px' }}>Build custom experiences on top of Jaal Yantra with our complete API surface. From catalog management to checkout, every capability is accessible programmatically.</p>
                    <Link className="kt-link" href="/solutions/integrations" style={{ marginTop: '16px', display: 'inline-flex' }}>
                      Explore API docs
                    </Link>
                  </div>
                  <div className="kt-editions-feature-mockup">
                    <AdminPanel />
                  </div>
                </div>
              )}
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
