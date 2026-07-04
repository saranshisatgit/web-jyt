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
          if (e.isIntersecting) {
            e.target.classList.add('visible')
            if (e.target.classList.contains('kt-editions-card')) {
              e.target.classList.add('burst')
            }
            if (e.target.closest('.kt-section-theme')) {
              e.target.closest('.kt-section-theme')!.classList.add('theme-visible')
            }
          }
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

/* ───── Woven grid pattern ───── */

const WOVEN_VARIANTS = ['kt-woven-rose', 'kt-woven-mint', 'kt-woven-amber', '']
function getWovenVariant(i: number) { return WOVEN_VARIANTS[i % WOVEN_VARIANTS.length] }

function WovenGrid({ variant = '', className = '' }: { variant?: string; className?: string }) {
  return (
    <div className={`kt-woven-pattern ${className}`} aria-hidden>
      <div className={`kt-woven-pattern-grid ${variant}`} />
    </div>
  )
}

/* ───── Firework particles ───── */
const PARTICLE_COLORS = [
  'oklch(0.75 0.20 60 / 0.7)',
  'oklch(0.70 0.18 30 / 0.6)',
  'oklch(0.65 0.16 145 / 0.6)',
  'oklch(0.55 0.14 250 / 0.5)',
  'oklch(0.80 0.18 50 / 0.7)',
  'oklch(0.90 0.12 80 / 0.5)',
]

function FireworksField({ count = 24, ember = false }: { count?: number; ember?: boolean }) {
  const particles = Array.from({ length: count }, (_, i) => ({
    id: i,
    color: PARTICLE_COLORS[i % PARTICLE_COLORS.length],
    size: ember ? 3 : 4 + (i % 3) * 2,
    dur: 3 + (i % 5) * 0.8,
    delay: (i % 8) * 0.5,
    xStart: (i * 37) % 100,
    yStart: 40 + (i * 23) % 50,
    xEnd: (i * 53) % 80 - 40,
    yEnd: -(30 + (i % 6) * 15),
    driftX: (i * 29) % 60 - 30,
    driftY: -(60 + (i % 7) * 20),
  }))

  return (
    <div className="kt-fireworks-field" aria-hidden>
      {particles.map((p) => (
        <div
          key={p.id}
          className={`kt-firework-particle${ember ? ' ember' : ''}`}
          style={{
            left: `${p.xStart}%`,
            top: `${p.yStart}%`,
            width: p.size,
            height: p.size,
            background: p.color,
            '--particle-dur': `${p.dur}s`,
            '--particle-delay': `${p.delay}s`,
            '--x-start': '0px',
            '--y-start': '0px',
            '--x-end': `${p.xEnd}px`,
            '--y-end': `${p.yEnd}px`,
            '--drift-x': `${p.driftX}px`,
            '--drift-y': `${p.driftY}px`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  )
}

/* ───── Thread divider between sections ───── */
function ThreadDivider() {
  return (
    <div className="kt-thread-divider" aria-hidden>
      <svg viewBox="0 0 200 20" fill="none">
        <line className="thread-line" x1="0" y1="10" x2="200" y2="10" />
        <circle className="thread-float" cx="40" cy="5" r="2.5" fill="var(--accent-soft)" opacity="0.6" />
        <circle className="thread-float" cx="100" cy="14" r="2" fill="var(--accent)" opacity="0.5" style={{ animationDelay: '-1.5s' }} />
        <circle className="thread-float" cx="160" cy="7" r="1.5" fill="var(--accent-deep)" opacity="0.4" style={{ animationDelay: '-0.8s' }} />
        <circle className="thread-spark" cx="70" cy="10" r="1.5" />
        <circle className="thread-spark" cx="130" cy="10" r="1.5" style={{ animationDelay: '-1s' }} />
      </svg>
    </div>
  )
}

/* ───── Section color themes ───── */
const SECTION_THEMES: Record<string, { bg: string; dot: string }> = {
  weave:      { bg: 'linear-gradient(180deg, oklch(0.96 0.04 145 / 0.4) 0%, transparent 100%)', dot: 'oklch(0.65 0.16 145)' },
  studio:     { bg: 'linear-gradient(180deg, oklch(0.93 0.05 260 / 0.3) 0%, transparent 100%)', dot: 'oklch(0.50 0.12 250)' },
  storefront: { bg: 'linear-gradient(180deg, oklch(0.97 0.04 50 / 0.4) 0%, transparent 100%)',  dot: 'oklch(0.70 0.14 45)' },
  stories:    { bg: 'linear-gradient(180deg, oklch(0.94 0.04 30 / 0.3) 0%, transparent 100%)',  dot: 'oklch(0.60 0.15 30)' },
  supply:     { bg: 'linear-gradient(180deg, oklch(0.95 0.03 145 / 0.35) 0%, transparent 100%)', dot: 'oklch(0.55 0.14 145)' },
  channels:   { bg: 'linear-gradient(180deg, oklch(0.94 0.04 210 / 0.3) 0%, transparent 100%)', dot: 'oklch(0.50 0.12 210)' },
  insights:   { bg: 'linear-gradient(180deg, oklch(0.95 0.03 60 / 0.3) 0%, transparent 100%)',  dot: 'oklch(0.65 0.14 60)' },
  build:      { bg: 'linear-gradient(180deg, oklch(0.12 0.03 210 / 0.4) 0%, transparent 100%)', dot: 'oklch(0.80 0.10 145)' },
}

function getSectionTheme(id: string) {
  return SECTION_THEMES[id]
}

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
    'linear-gradient(135deg, oklch(0.55 0.18 145 / 0.2), oklch(0.60 0.14 180 / 0.08))',
    'linear-gradient(135deg, oklch(0.65 0.20 60 / 0.2), oklch(0.55 0.12 30 / 0.08))',
    undefined,
    undefined,
  ],
  studio: [
    'linear-gradient(135deg, oklch(0.50 0.16 250 / 0.2), oklch(0.55 0.10 280 / 0.08))',
    undefined,
    undefined,
    undefined,
  ],
  storefront: [
    undefined,
    'linear-gradient(135deg, oklch(0.60 0.16 45 / 0.18), oklch(0.55 0.10 20 / 0.06))',
    undefined,
    undefined,
  ],
  stories: [
    undefined,
    undefined,
    'linear-gradient(135deg, oklch(0.55 0.18 145 / 0.18), oklch(0.50 0.12 120 / 0.06))',
    undefined,
  ],
  supply: [
    'linear-gradient(135deg, oklch(0.60 0.16 35 / 0.20), oklch(0.55 0.10 10 / 0.08))',
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

/* ───── Cursor spotlight ───── */

function CursorSpotlight() {
  const [pos, setPos] = useState({ x: 50, y: 50 })
  const [hue, setHue] = useState(60)

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 100
      const y = (e.clientY / window.innerHeight) * 100
      setPos({ x, y })
      setHue((x + y) * 1.8)
    }
    window.addEventListener('mousemove', handleMouse)
    return () => window.removeEventListener('mousemove', handleMouse)
  }, [])

  return (
    <div
      className="kt-cursor-spotlight"
      style={{
        '--spot-x': `${pos.x}%`,
        '--spot-y': `${pos.y}%`,
        '--spot-hue': `${hue}`,
      } as React.CSSProperties}
      aria-hidden
    />
  )
}

/* ───── Page ───── */

export default function EditionsClient({ content }: Props) {
  useScrollReveal()
  const active = useActiveSection(content.navItems.map((n) => n.id))
  const { hero, navItems, sections, cta } = content

  return (
    <div className="kt-editions-page">
      <CursorSpotlight />
      {/* Page-wide woven backdrop */}
      <div className="kt-woven-pattern" style={{ position: 'fixed', zIndex: -1, opacity: 0.18 }} aria-hidden>
        <div className="kt-woven-pattern-grid" />
      </div>

      {/* ───── Hero ───── */}
      <section className="kt-editions-hero">
        <div className="kt-editions-hero-bg" />
        <WovenGrid />
        <FireworksField count={32} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
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
      <div className="container kt-editions-layout">
        <SectionNav items={navItems} active={active} />

        <div>
          {sections.map((section, si) => {
            const theme = getSectionTheme(section.id)
            return (
              <section
                key={section.id}
                id={section.id}
                className={`kt-editions-section kt-section-theme${si % 2 === 0 ? ' kt-editions-section-bg' : ''}`}
                style={theme ? { '--theme-dot': theme.dot } as React.CSSProperties : undefined}
              >
                {theme && <div className="theme-bg" style={{ background: theme.bg }} />}
                <WovenGrid variant={getWovenVariant(si)} className="kt-woven-section" />

                <div className="kt-editions-header kt-reveal">
                  <div className="kt-editions-eyebrow">
                    <span className="dot" style={theme ? { background: theme.dot } : undefined} />
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
            )
          })}
        </div>
      </div>

      {/* ───── Thread divider before CTA ───── */}
      <ThreadDivider />

      {/* ───── Final CTA (full-width, outside nav grid) ───── */}
      <section className="kt-editions-cta">
        <WovenGrid variant="kt-woven-amber" className="kt-woven-dark" />
        <FireworksField count={18} ember />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
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
    </div>
  )
}
