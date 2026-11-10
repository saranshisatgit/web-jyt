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
import grievance from '@/data/grievance.json'

export const metadata: Metadata = {
  title: 'Grievance procedure',
  description:
    'The public grievance procedure of Kind Health Tech SIA under B Corp PSG 3.1 — how any stakeholder raises a grievance, the grounds, steps and deadlines, protection from retaliation, and the commitment that every grievance gets an answer.',
}

type SideStat = {
  label: string
  value: string
  animatedValue?: { start: number; end: number; decimals?: number }
}

const heroSide = grievance.hero.side as SideStat[]

export default async function GrievanceHubPage() {
  const h = await headers()
  const brand = brandFromKey(h.get('x-brand'))

  return (
    <main>
      <Navbar />
      <Suspense fallback={<SectionLoading />}>
        <GrievanceHero />
      </Suspense>
      <Suspense fallback={<SectionLoading />}>
        <HowToRaise />
      </Suspense>
      <Suspense fallback={<SectionLoading />}>
        <Procedure />
      </Suspense>
      <Suspense fallback={<SectionLoading />}>
        <RetaliationProtection />
      </Suspense>
      <Suspense fallback={<SectionLoading />}>
        <ResponseCommitment />
      </Suspense>
      <Suspense fallback={<SectionLoading />}>
        <CriteriaRecord email={brand.emails.primary} />
      </Suspense>
    </main>
  )
}

/* ---------------- HERO ---------------- */

function GrievanceHero() {
  const { hero } = grievance
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

/* ---------------- 3.1.1 — HOW TO RAISE ---------------- */

function HowToRaise() {
  const { raise } = grievance
  return (
    <section className="kt-section">
      <div className="container">
        <SectionHead eyebrow={raise.eyebrow} criteriaPill={raise.criteriaPill} title={raise.title} />
        <SectionLede text={raise.lead} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" style={{ marginTop: 48 }}>
          {grievance.personas.map((persona) => (
            <article key={persona.slug} className="kt-card hover" style={{ padding: 28 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <RefChip>{persona.ref}</RefChip>
                <span className="kt-meta" style={{ color: 'var(--accent-deep)' }}>
                  {persona.name}
                </span>
              </div>
              <h3 className="kt-card-title" style={{ fontSize: 22, margin: '14px 0 8px' }}>
                {persona.name}
              </h3>
              <p className="kt-card-body" style={{ fontSize: 15, lineHeight: 1.55, minHeight: 66 }}>
                {persona.blurb} {persona.who}
              </p>
              <div style={{ marginTop: 'auto', paddingTop: 20 }}>
                <Link
                  href={`/stakeholders/grievance/${persona.slug}`}
                  className="kt-btn ghost"
                  style={{ width: '100%' }}
                >
                  Raise as {persona.name.toLowerCase()} →
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* Mail / post / officer channels */}
        <div className="kt-callout" style={{ marginTop: 32, flexDirection: 'column', alignItems: 'flex-start', gap: 10 }}>
          <div className="kt-eyebrow">
            <span className="dot" aria-hidden />
            Not a form person?
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            {raise.channels.map((channel) => (
              <div key={channel.label}>
                <div className="kt-meta" style={{ color: 'var(--accent-deep)', marginBottom: 6 }}>
                  {channel.label}
                </div>
                <p style={{ fontSize: 14, lineHeight: 1.55, margin: 0, color: 'var(--ink)' }}>
                  {channel.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---------------- 3.1.2 — THE PROCEDURE ---------------- */

function Procedure() {
  const { procedure } = grievance
  return (
    <section className="kt-section">
      <div className="container">
        <SectionHead
          eyebrow={procedure.eyebrow}
          criteriaPill={procedure.criteriaPill}
          title={procedure.title}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" style={{ marginTop: 48 }}>
          {/* Grounds — 3.1.2(a) */}
          <article className="kt-card" style={{ padding: 32 }}>
            <div className="kt-meta" style={{ color: 'var(--accent-deep)' }}>
              (a) · Grounds for accepting
            </div>
            <h3 className="kt-card-title" style={{ fontSize: 24, margin: '12px 0 8px' }}>
              {procedure.grounds.title}
            </h3>
            <p className="muted" style={{ fontSize: 15, lineHeight: 1.55, margin: '0 0 16px' }}>
              {procedure.grounds.lead}
            </p>
            <ul className="kt-dash-list">
              {procedure.grounds.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>

          {/* Resolution — 3.1.2(c) */}
          <article className="kt-card" style={{ padding: 32 }}>
            <div className="kt-meta" style={{ color: 'var(--accent-deep)' }}>
              (c) · How resolution is facilitated
            </div>
            <h3 className="kt-card-title" style={{ fontSize: 24, margin: '12px 0 8px' }}>
              {procedure.resolution.title}
            </h3>
            <p className="muted" style={{ fontSize: 15, lineHeight: 1.55, margin: '0 0 16px' }}>
              {procedure.resolution.lead}
            </p>
            <ul className="kt-dash-list">
              {procedure.resolution.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <hr className="kt-rule" style={{ margin: '18px 0 14px' }} />
            <p className="kt-meta" style={{ fontSize: 12, lineHeight: 1.6, margin: 0 }}>
              {procedure.resolution.note}
            </p>
          </article>
        </div>

        {/* Steps & deadlines — 3.1.2(b) */}
        <div style={{ marginTop: 32 }}>
          <div className="kt-meta" style={{ color: 'var(--accent-deep)', marginBottom: 16 }}>
            (b) · Process steps and targeted deadlines
          </div>
          <ul className="kt-list">
            {procedure.steps.items.map((step) => (
              <li key={step.n}>
                <span className="n">{step.n}</span>
                <div>
                  <b>
                    {step.title}{' '}
                    <span
                      className="kt-pill accent"
                      style={{ fontSize: 10, padding: '2px 10px', marginLeft: 8, whiteSpace: 'nowrap' }}
                    >
                      {step.deadline}
                    </span>
                  </b>
                  <span>{step.body}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

/* ---------------- 3.1.3 — PROTECTION FROM RETALIATION ---------------- */

function RetaliationProtection() {
  const { protection } = grievance
  return (
    <section className="kt-section" style={{ background: 'var(--ink-dark-bg)', padding: '96px 0' }}>
      <div className="container">
        <SectionHead
          eyebrow={protection.eyebrow}
          criteriaPill={protection.criteriaPill}
          title={protection.title}
          onDark
        />
        <SectionLede text={protection.lead} onDark />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" style={{ marginTop: 48 }}>
          {protection.items.map((item) => (
            <article key={item.title} className="kt-card dark" style={{ padding: 28 }}>
              <h3 className="serif" style={{ fontSize: 20, margin: '0 0 10px', color: 'var(--cream)' }}>
                {item.title}
              </h3>
              <p style={{ fontSize: 15, lineHeight: 1.55, margin: 0, color: ON_DARK_MUTE }}>
                {item.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---------------- 3.1.4 — RESPONSE COMMITMENT ---------------- */

function ResponseCommitment() {
  const { response } = grievance
  return (
    <section className="kt-section">
      <div className="container">
        <SectionHead
          eyebrow={response.eyebrow}
          criteriaPill={response.criteriaPill}
          title={response.title}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6" style={{ marginTop: 48 }}>
          <article className="kt-card hover" style={{ padding: 32 }}>
            <div className="kt-meta" style={{ color: 'var(--accent-deep)' }}>
              (a) · Accepted
            </div>
            <h3 className="kt-card-title" style={{ fontSize: 24, margin: '12px 0 12px' }}>
              {response.accepted.title}
            </h3>
            <ul className="kt-dash-list">
              {response.accepted.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
          <article className="kt-card hover" style={{ padding: 32 }}>
            <div className="kt-meta" style={{ color: 'var(--accent-deep)' }}>
              (b) · Not accepted
            </div>
            <h3 className="kt-card-title" style={{ fontSize: 24, margin: '12px 0 12px' }}>
              {response.declined.title}
            </h3>
            <p style={{ fontSize: 15, lineHeight: 1.6, margin: 0, color: 'var(--ink)' }}>
              {response.declined.body}
            </p>
          </article>
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
          rows={grievance.criteriaMap}
          footer={
            <p style={{ fontSize: 14, lineHeight: 1.55, color: 'var(--ink-soft)', margin: 0, maxWidth: 640 }}>
              Every grievance — named or anonymous, by form, mail or post — is logged, tracked to a
              written outcome, and reviewed by the Board quarterly.
            </p>
          }
        />

        <div className="text-center" style={{ marginTop: 56 }}>
          <p
            className="muted"
            style={{ fontSize: 13, maxWidth: 620, margin: '0 auto', lineHeight: 1.6 }}
          >
            {grievance.footnote}
          </p>
          <div
            className="kt-meta"
            style={{ marginTop: 24, display: 'flex', justifyContent: 'center', gap: 28, flexWrap: 'wrap' }}
          >
            <Link href="/stakeholders" style={{ color: 'var(--accent-deep)' }}>
              Stakeholder governance →
            </Link>
            <Link href="/purpose" style={{ color: 'var(--accent-deep)' }}>
              Purpose statement →
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
