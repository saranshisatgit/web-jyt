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
  ON_DARK_MUTE,
} from '@/components/criteria-blocks'
import { brandFromKey } from '@/lib/brand'
import purpose from '@/data/purpose.json'

export const metadata: Metadata = {
  title: 'Our Purpose',
  description:
    'The purpose statement of Kind Health Tech SIA — the specific impact we intend on society and the environment, integrated into our strategy, adopted by our board, and published here as the public record.',
}

// JSON casts — the governance rows carry an optional isPlaceholder flag on
// the value that must be confirmed against the signed board minute before
// B Lab submission.
type GovernanceRow = {
  key: string
  label: string
  value: string
  isPlaceholder?: boolean
}

type SideStat = {
  label: string
  value: string
  animatedValue?: { start: number; end: number; decimals?: number }
}

type ImpactGroup = {
  tag: string
  items: Array<{ title: string; body: string }>
}

const governanceRows = purpose.governance.rows as GovernanceRow[]
const heroSide = purpose.hero.side as SideStat[]
const society = purpose.impact.society as ImpactGroup
const environment = purpose.impact.environment as ImpactGroup

export default async function PurposePage() {
  const h = await headers()
  const brand = brandFromKey(h.get('x-brand'))
  const permalink = `https://www.${brand.seo.domain}/purpose`

  return (
    <main>
      <Navbar />
      <Suspense fallback={<SectionLoading />}>
        <PurposeHero />
      </Suspense>
      <Suspense fallback={<SectionLoading />}>
        <PurposeStatement />
      </Suspense>
      <Suspense fallback={<SectionLoading />}>
        <ImpactCommitments />
      </Suspense>
      <Suspense fallback={<SectionLoading />}>
        <StrategyIntegration />
      </Suspense>
      <Suspense fallback={<SectionLoading />}>
        <GovernanceRecord />
      </Suspense>
      <Suspense fallback={<SectionLoading />}>
        <PublicRecord permalink={permalink} email={brand.emails.primary} />
      </Suspense>
    </main>
  )
}

/* ---------------- HERO ---------------- */

function PurposeHero() {
  const { hero } = purpose
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
                  <CheckMini
                    style={{ width: 12, height: 12, color: 'var(--accent-deep)' }}
                  />
                  {pill}
                </span>
              ))}
            </div>
          </div>
          <aside className="kt-hero-side">
            {heroSide.map((stat) => {
              const unit = stat.animatedValue
                ? stat.value.replace(/[0-9.,]+/, '').trim()
                : ''
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

/* ---------------- THE STATEMENT — criterion (a) ---------------- */

function PurposeStatement() {
  const { statement } = purpose
  return (
    <section
      className="kt-section flush"
      style={{ background: 'var(--ink-dark-bg)', color: 'var(--cream)', padding: '96px 0' }}
    >
      <div className="container">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 14,
            marginBottom: 44,
          }}
        >
          <div className="kt-eyebrow on-dark">
            <span className="dot" aria-hidden />
            {statement.eyebrow}
          </div>
          <span className="kt-pill accent">{statement.criteriaPill}</span>
        </div>
        <blockquote
          className="kt-quote"
          style={{
            color: 'var(--cream)',
            fontSize: 'clamp(24px, 3.2vw, 34px)',
            lineHeight: 1.3,
            maxWidth: 960,
          }}
        >
          {statement.quote}
        </blockquote>
        <div className="kt-quote-attr" style={{ color: ON_DARK_MUTE }}>
          {statement.attribution}
        </div>
      </div>
    </section>
  )
}

/* ---------------- IMPACT COMMITMENTS — criterion (a) ---------------- */

function ImpactCard({
  group,
  index,
  item,
}: {
  group: ImpactGroup
  index: number
  item: { title: string; body: string }
}) {
  return (
    <article className="kt-card hover" style={{ padding: 28 }}>
      <div
        className="kt-meta"
        style={{ color: group.tag === 'Society' ? 'var(--accent-deep)' : 'var(--ink-mute)' }}
      >
        {group.tag} · {String(index + 1).padStart(2, '0')}
      </div>
      <h3 className="kt-card-title" style={{ fontSize: 24, margin: '14px 0 10px' }}>
        {item.title}
      </h3>
      <p className="kt-card-body" style={{ fontSize: 15, lineHeight: 1.55 }}>
        {item.body}
      </p>
    </article>
  )
}

function ImpactCommitments() {
  const { impact } = purpose
  return (
    <section className="kt-section">
      <div className="container">
        <SectionHead
          eyebrow={impact.eyebrow}
          criteriaPill={impact.criteriaPill}
          title={impact.title}
        />
        <SectionLede text={impact.lead} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6" style={{ marginTop: 48 }}>
          {society.items.map((item, i) => (
            <ImpactCard key={item.title} group={society} index={i} item={item} />
          ))}
          {environment.items.map((item, i) => (
            <ImpactCard key={item.title} group={environment} index={i} item={item} />
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---------------- STRATEGY INTEGRATION — criterion (b) ---------------- */

function StrategyIntegration() {
  const { strategy } = purpose
  return (
    <section className="kt-section">
      <div className="container">
        <SectionHead
          eyebrow={strategy.eyebrow}
          criteriaPill={strategy.criteriaPill}
          title={strategy.title}
        />
        <SectionLede text={strategy.lead} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6" style={{ marginTop: 48 }}>
          {strategy.pillars.map((pillar, i) => (
            <article
              key={pillar.pillar}
              className="kt-card hover"
              style={{ padding: 28, minHeight: 260 }}
            >
              <div className="kt-meta" style={{ color: 'var(--accent-deep)' }}>
                {String(i + 1).padStart(2, '0')}
              </div>
              <h3 className="kt-card-title" style={{ fontSize: 24, margin: '14px 0 10px' }}>
                {pillar.pillar}
              </h3>
              <p className="kt-card-body" style={{ fontSize: 15, lineHeight: 1.55 }}>
                {pillar.practice}
              </p>
              <hr className="kt-rule" style={{ margin: '20px 0' }} />
              <div style={{ marginTop: 'auto' }}>
                <div className="kt-meta" style={{ color: 'var(--ink-mute)', marginBottom: 8 }}>
                  Business relevance
                </div>
                <p style={{ fontSize: 15, lineHeight: 1.55, margin: 0, color: 'var(--ink)' }}>
                  {pillar.relevance}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---------------- GOVERNANCE — criterion (d) ---------------- */

function GovernanceRecord() {
  const { governance } = purpose
  return (
    <section className="kt-section" style={{ background: 'var(--ink-dark-bg)', padding: '96px 0' }}>
      <div className="container">
        <SectionHead
          eyebrow={governance.eyebrow}
          criteriaPill={governance.criteriaPill}
          title={governance.title}
          onDark
        />
        <SectionLede text={governance.lead} onDark />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6" style={{ marginTop: 48 }}>
          {governanceRows.map((row) => (
            <div key={row.key} className="kt-card dark" style={{ padding: 28 }}>
              <div className="kt-meta">{row.label}</div>
              <div style={{ marginTop: 12 }}>
                {row.isPlaceholder ? (
                  <span
                    className="font-mono"
                    style={{
                      display: 'inline-block',
                      padding: '6px 14px',
                      fontSize: 13,
                      borderRadius: 'var(--r-md)',
                      border: `1px dashed ${ON_DARK_MUTE}`,
                      color: ON_DARK_MUTE,
                      letterSpacing: '0.04em',
                    }}
                  >
                    {row.value}
                  </span>
                ) : (
                  <span
                    className="serif"
                    style={{ fontSize: 19, lineHeight: 1.35, color: 'var(--cream)' }}
                  >
                    {row.value}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---------------- PUBLIC AVAILABILITY — criterion (c) ---------------- */

function PublicRecord({ permalink, email }: { permalink: string; email: string }) {
  const { availability } = purpose
  return (
    <section className="kt-section">
      <div className="container">
        <SectionHead
          eyebrow={availability.eyebrow}
          criteriaPill={availability.criteriaPill}
          title={availability.title}
        />
        <SectionLede text={availability.lead} />

        <CriteriaMapCard
          rows={availability.criteriaMap.map((row) => ({
            ref: row.letter,
            requirement: row.requirement,
            where: row.where,
          }))}
          footer={
            <>
              <p
                style={{
                  fontSize: 14,
                  lineHeight: 1.55,
                  color: 'var(--ink-soft)',
                  margin: 0,
                  maxWidth: 520,
                }}
              >
                {availability.body}
              </p>
              <code
              className="font-mono"
              style={{
                display: 'inline-block',
                padding: '8px 16px',
                fontSize: 13,
                borderRadius: 'var(--r-md)',
                background: 'var(--bg)',
                border: '1px solid var(--rule-soft)',
                color: 'var(--ink)',
              }}
            >
              {permalink}
            </code>
            </>
          }
        />

        <div className="text-center" style={{ marginTop: 56 }}>
          <p
            className="muted"
            style={{ fontSize: 13, maxWidth: 560, margin: '0 auto', lineHeight: 1.6 }}
          >
            {purpose.footnote}
          </p>
          <div
            className="kt-meta"
            style={{ marginTop: 24, display: 'flex', justifyContent: 'center', gap: 28, flexWrap: 'wrap' }}
          >
            <Link href="/company" style={{ color: 'var(--accent-deep)' }}>
              Company &amp; registration →
            </Link>
            <Link href="/stakeholders" style={{ color: 'var(--accent-deep)' }}>
              Stakeholder governance →
            </Link>
            <Link href="/about" style={{ color: 'var(--accent-deep)' }}>
              Mission &amp; team →
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
