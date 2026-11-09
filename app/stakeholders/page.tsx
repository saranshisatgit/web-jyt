import { Suspense } from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { headers } from 'next/headers'
import { CheckMini } from '@medusajs/icons'
import { Navbar } from '@/components/navbar'
import { HeroArt } from '@/components/hero-art'
import { SectionLoading } from '@/components/section-loading'
import { AnimatedNumber } from '@/components/animated-number'
import {
  SectionHead,
  SectionLede,
  CriteriaMapCard,
  RefChip,
  ON_DARK_MUTE,
} from '@/components/criteria-blocks'
import { brandFromKey } from '@/lib/brand'
import stakeholders from '@/data/stakeholders.json'

export const metadata: Metadata = {
  title: 'Stakeholders',
  description:
    'The stakeholder governance record of Kind Health Tech SIA under B Corp PSG 2.1 — six stakeholder groups identified, prioritized and engaged through 23 living mechanisms, with their interests in our decision-making.',
}

type SideStat = {
  label: string
  value: string
  animatedValue?: { start: number; end: number; decimals?: number }
}

const heroSide = stakeholders.hero.side as SideStat[]

export default async function StakeholdersPage() {
  const h = await headers()
  const brand = brandFromKey(h.get('x-brand'))

  return (
    <main>
      <Navbar />
      <Suspense fallback={<SectionLoading />}>
        <StakeholdersHero />
      </Suspense>
      <Suspense fallback={<SectionLoading />}>
        <StakeholderMap />
      </Suspense>
      <Suspense fallback={<SectionLoading />}>
        <EngagedDecisions />
      </Suspense>
      <Suspense fallback={<SectionLoading />}>
        <EngagementMechanisms />
      </Suspense>
      <Suspense fallback={<SectionLoading />}>
        <CriteriaRecord email={brand.emails.primary} />
      </Suspense>
    </main>
  )
}

/* ---------------- HERO ---------------- */

function StakeholdersHero() {
  const { hero } = stakeholders
  return (
    <section className="kt-hero relative isolate">
      <HeroArt />
      <div className="container kt-hero-content">
        <div className="kt-hero-grid">
          <div>
            <span className="kt-eyebrow">
              <span className="dot" aria-hidden />
              {hero.eyebrow}
            </span>
            <h1 className="kt-display xl" style={{ marginTop: '20px', marginBottom: '16px' }}>
              {hero.title}
            </h1>
            <p
              className="muted"
              style={{ fontSize: '18px', maxWidth: '560px', lineHeight: 1.55, margin: 0 }}
            >
              {hero.subtitle}
            </p>
            <div className="flex flex-wrap" style={{ gap: 8, marginTop: 28 }}>
              {hero.pills.map((pill) => (
                <span key={pill} className="kt-pill">
                  <CheckMini style={{ width: 12, height: 12, color: 'var(--accent-deep)' }} />
                  {pill}
                </span>
              ))}
            </div>
          </div>
          <aside className="kt-hero-side">
            {heroSide.map((stat) => {
              const unit = stat.animatedValue ? stat.value.replace(/[0-9.,]+/g, '').trim() : ''
              return (
                <div key={stat.label} className="row">
                  <span className="k">{stat.label}</span>
                  <span className="v">
                    {stat.animatedValue ? (
                      <>
                        <AnimatedNumber
                          start={stat.animatedValue.start}
                          end={stat.animatedValue.end}
                          decimals={stat.animatedValue.decimals}
                        />
                        {unit && <span>{unit}</span>}
                      </>
                    ) : (
                      stat.value
                    )}
                  </span>
                </div>
              )
            })}
          </aside>
        </div>
      </div>
    </section>
  )
}

/* ---------------- 2.1.1 — IDENTIFIED & PRIORITIZED ---------------- */

function StakeholderMap() {
  const { map } = stakeholders
  return (
    <section className="kt-section">
      <div className="container">
        <SectionHead
          eyebrow={map.eyebrow}
          criteriaPill={map.criteriaPill}
          title={map.title}
        />
        <SectionLede text={map.lead} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" style={{ marginTop: 48 }}>
          {map.groups.map((group) => (
            <article key={group.ref} className="kt-card hover" style={{ padding: 28 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                <RefChip>{group.ref}</RefChip>
                <span
                  className="kt-pill"
                  style={{
                    fontSize: 10,
                    color: group.priority.startsWith('Primary') ? 'var(--accent-deep)' : 'var(--ink-mute)',
                    borderColor: group.priority.startsWith('Primary') ? 'var(--accent-soft)' : 'var(--rule)',
                  }}
                >
                  {group.priority}
                </span>
              </div>
              <h3 className="kt-card-title" style={{ fontSize: 24, margin: '14px 0 10px' }}>
                {group.name}
              </h3>
              <p className="kt-card-body" style={{ fontSize: 15, lineHeight: 1.55, minHeight: 70 }}>
                {group.who}
              </p>
              <hr className="kt-rule" style={{ margin: '18px 0' }} />
              <div className="kt-meta" style={{ color: 'var(--ink-mute)', marginBottom: 8 }}>
                Interests
              </div>
              <ul className="kt-dash-list">
                {group.interests.map((interest) => (
                  <li key={interest}>{interest}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---------------- 2.1.2 — ENGAGED IN DECISION-MAKING ---------------- */

function EngagedDecisions() {
  const { decisions } = stakeholders
  return (
    <section className="kt-section" style={{ background: 'var(--ink-dark-bg)', padding: '96px 0' }}>
      <div className="container">
        <SectionHead
          eyebrow={decisions.eyebrow}
          criteriaPill={decisions.criteriaPill}
          title={decisions.title}
          onDark
        />
        <SectionLede text={decisions.lead} onDark />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6" style={{ marginTop: 48 }}>
          {decisions.cards.map((card) => (
            <article key={card.area} className="kt-card dark" style={{ padding: 28, minHeight: 240 }}>
              <div className="kt-meta" style={{ color: ON_DARK_MUTE }}>
                {card.area}
              </div>
              <p style={{ fontSize: 16, lineHeight: 1.6, margin: '14px 0 20px', color: 'var(--cream)' }}>
                {card.body}
              </p>
              <div style={{ marginTop: 'auto', display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {card.groups.map((g) => (
                  <span
                    key={g}
                    className="kt-pill"
                    style={{ fontSize: 10, color: ON_DARK_MUTE, borderColor: 'var(--rule-dark)' }}
                  >
                    {g}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---------------- 2.1.3 — ENGAGEMENT MECHANISMS ---------------- */

function EngagementMechanisms() {
  const { mechanisms } = stakeholders
  return (
    <section className="kt-section">
      <div className="container">
        <SectionHead
          eyebrow={mechanisms.eyebrow}
          criteriaPill={mechanisms.criteriaPill}
          title={mechanisms.title}
        />
        <SectionLede text={mechanisms.lead} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" style={{ marginTop: 48 }}>
          {mechanisms.groups.map((group) => (
            <article key={group.ref} className="kt-card hover" style={{ padding: 28 }}>
              <RefChip>{group.ref}</RefChip>
              <h3 className="kt-card-title" style={{ fontSize: 22, margin: '14px 0 12px' }}>
                {group.name}
              </h3>
              <ul className="kt-dash-list">
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---------------- CRITERIA RECORD & FOOTNOTE ---------------- */

function CriteriaRecord({ email }: { email: string }) {
  return (
    <section className="kt-section">
      <div className="container">
        <CriteriaMapCard
          rows={stakeholders.criteriaMap}
          footer={
            <p style={{ fontSize: 14, lineHeight: 1.55, color: 'var(--ink-soft)', margin: 0, maxWidth: 640 }}>
              Every mechanism listed on this page is live today. The inventory is reviewed
              alongside the annual purpose review by the board.
            </p>
          }
        />

        <div className="text-center" style={{ marginTop: 56 }}>
          <p
            className="muted"
            style={{ fontSize: 13, maxWidth: 620, margin: '0 auto', lineHeight: 1.6 }}
          >
            {stakeholders.footnote}
          </p>
          <div
            className="kt-meta"
            style={{ marginTop: 24, display: 'flex', justifyContent: 'center', gap: 28, flexWrap: 'wrap' }}
          >
            <Link href="/purpose" style={{ color: 'var(--accent-deep)' }}>
              Purpose statement →
            </Link>
            <Link href="/company" style={{ color: 'var(--accent-deep)' }}>
              Company &amp; registration →
            </Link>
            <a href={`mailto:${email}`} style={{ color: 'var(--accent-deep)' }}>
              {email}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
