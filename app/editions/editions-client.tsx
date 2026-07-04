'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Storefront, AgentCheckout, BrandStarter, AdminPanel } from '@/components/mockup-animations'
import type { EditionsContent } from './page'

type Props = { content: EditionsContent }

/* ───── Scroll-reveal hook ───── */

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
    <div className="kt-editions-glyph kt-float" aria-hidden>
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

/* ───── Card mockup images (mapping section id → card index → mockup style) ───── */

const CARD_IMGS: Record<string, (string | undefined)[]> = {
  weave: [
    'oklch(0.80 0.06 145 / 0.15)', /* AI catalog */
    'oklch(0.85 0.08 60 / 0.12)',  /* checkout */
    undefined,
    undefined,
  ],
  studio: [
    'oklch(0.78 0.05 250 / 0.12)', /* design */
    undefined,
    undefined,
    undefined,
  ],
  storefront: [
    undefined,
    'oklch(0.82 0.04 60 / 0.10)',  /* storytelling */
    undefined,
    undefined,
  ],
  stories: [
    undefined,
    undefined,
    'oklch(0.75 0.06 145 / 0.10)', /* origin */
    undefined,
  ],
  supply: [
    'oklch(0.80 0.05 30 / 0.12)',  /* marketplace */
    undefined,
    undefined,
    undefined,
  ],
}

function getCardImg(sectionId: string, cardIndex: number): string | undefined {
  return CARD_IMGS[sectionId]?.[cardIndex]
}

function CardGrid({ cards, sectionId }: { cards: { title: string; body: string; tag?: string; dark?: boolean }[]; sectionId: string }) {
  return (
    <div className="kt-editions-grid">
      {cards.map((card, i) => {
        const img = getCardImg(sectionId, i)
        return (
          <article
            key={card.title}
            className={`kt-editions-card kt-reveal kt-reveal-d${(i % 4) + 1}${card.dark ? ' light-on-dark' : ''}${img ? ' with-img' : ''}`}
          >
            {img && (
              <div className="kt-editions-card-img" style={{ background: img }}>
                <div className="pattern" />
                <span className="label">{card.tag || 'Preview'}</span>
              </div>
            )}
            <div className="kt-editions-card-body" style={img ? {} : { padding: 0 }}>
              {card.tag && img ? null : card.tag && <span className="kt-editions-card-tag">{card.tag}</span>}
              <h3>{card.title}</h3>
              <p>{card.body}</p>
            </div>
          </article>
        )
      })}
    </div>
  )
}

/* ───── Demo floating cards strip ───── */

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
        <div key={demo.name} className="kt-editions-demo-card kt-float" style={{ animationDelay: `${DEMOS.indexOf(demo) * -0.8}s` }}>
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

/* ───── Featured mockup (first section) ───── */

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

          {/* Stats row */}
          <StatsRow />
        </div>
      </section>

      {/* ───── Sticky nav + sections ───── */}
      <div className="container" style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: '0' }}>
        <SectionNav items={navItems} active={active} />

        <div>
          {sections.map((section, si) => (
            <section
              key={section.id}
              id={section.id}
              className={`kt-editions-section${si % 2 === 0 ? ' kt-editions-section-bg' : ''}${section.dark ? '' : ''}`}
            >
              <div className="kt-editions-header kt-reveal">
                <div className="kt-editions-eyebrow">
                  <span className="dot" />
                  {section.label}
                </div>
                <h2 className="kt-display m">{section.heading}</h2>
              </div>

              {/* First section gets a featured mockup + demo strip */}
              {si === 0 && (
                <>
                  <FeaturedMockup />
                  <DemoStrip />
                </>
              )}

              <CardGrid cards={section.cards} sectionId={section.id} />

              {/* Last section (build) is dark with a special treatment */}
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
