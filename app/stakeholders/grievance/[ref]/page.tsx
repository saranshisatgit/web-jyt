import { Suspense } from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { headers } from 'next/headers'
import { Navbar } from '@/components/navbar'
import { HeroArt } from '@/components/hero-art'
import { SectionLoading } from '@/components/section-loading'
import { GrievanceForm } from '@/components/grievance-form'
import { RefChip } from '@/components/criteria-blocks'
import { brandFromKey } from '@/lib/brand'
import grievance from '@/data/grievance.json'

type Persona = (typeof grievance.personas)[number]

const personas = grievance.personas as Persona[]

export function generateStaticParams() {
  return personas.map((persona) => ({ ref: persona.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ ref: string }>
}): Promise<Metadata> {
  const { ref } = await params
  const persona = personas.find((p) => p.slug === ref)
  if (!persona) return { title: 'Grievance procedure' }
  return {
    title: `Raise a grievance — ${persona.name}`,
    description: `Raise a grievance as a ${persona.name.toLowerCase()} under the Kind Health Tech SIA grievance procedure (B Corp PSG 3.1).`,
  }
}

export default async function PersonaGrievancePage({
  params,
}: {
  params: Promise<{ ref: string }>
}) {
  const { ref } = await params
  const persona = personas.find((p) => p.slug === ref)
  if (!persona) notFound()

  const h = await headers()
  const brand = brandFromKey(h.get('x-brand'))
  const others = personas.filter((p) => p.slug !== persona.slug)

  return (
    <main>
      <Navbar />
      <Suspense fallback={<SectionLoading />}>
        <PersonaHero persona={persona} />
      </Suspense>
      <Suspense fallback={<SectionLoading />}>
        <PersonaFormSection persona={persona} others={others} email={brand.emails.primary} />
      </Suspense>
    </main>
  )
}

/* ---------------- HERO (compact) ---------------- */

function PersonaHero({ persona }: { persona: Persona }) {
  return (
    <section className="kt-hero compact relative isolate">
      <HeroArt />
      <div className="container kt-hero-content">
        <div className="kt-hero-grid">
          <div>
            <span className="kt-eyebrow">
              <span className="dot" aria-hidden />
              Grievance procedure · Stakeholder group ({persona.ref})
            </span>
            <h1 className="kt-display l" style={{ marginTop: '16px', marginBottom: '14px' }}>
              {persona.title}
            </h1>
            <p
              className="muted"
              style={{ fontSize: '17px', maxWidth: '560px', lineHeight: 1.55, margin: 0 }}
            >
              {persona.who} Anonymous or named — both are protected from any form of retaliation.
            </p>
          </div>
          <aside className="kt-hero-side">
            <div className="row">
              <span className="k">Acknowledged</span>
              <span className="v">5 days</span>
            </div>
            <div className="row">
              <span className="k">Accept / decline</span>
              <span className="v">10 days</span>
            </div>
            <div className="row">
              <span className="k">Resolve (target)</span>
              <span className="v">30 days</span>
            </div>
            <div className="row">
              <span className="k">Anonymous</span>
              <span className="v">Yes</span>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}

/* ---------------- GROUNDS + FORM ---------------- */

function PersonaFormSection({
  persona,
  others,
  email,
}: {
  persona: Persona
  others: Persona[]
  email: string
}) {
  return (
    <section className="kt-section">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-8 lg:gap-12">
          {/* Left rail — good grounds + protections */}
          <div>
            <div className="kt-meta" style={{ color: 'var(--accent-deep)' }}>
              Good grounds, from this group
            </div>
            <ul className="kt-dash-list" style={{ marginTop: 16 }}>
              {persona.examples.map((example) => (
                <li key={example}>{example}</li>
              ))}
            </ul>
            <hr className="kt-rule" style={{ margin: '24px 0' }} />
            <div className="kt-meta" style={{ color: 'var(--accent-deep)' }}>
              While it is open
            </div>
            <ul className="kt-dash-list" style={{ marginTop: 16 }}>
              <li>Acknowledgment with a reference number within 5 business days</li>
              <li>Acceptance or decline, in writing, within 10</li>
              <li>A status update at least every 10 business days while open</li>
              <li>The outcome and confirmation of closure, in writing</li>
            </ul>
            <div className="kt-callout" style={{ marginTop: 28, padding: '18px 22px' }}>
              <span className="kt-meta" style={{ color: 'var(--accent-deep)' }}>3.1.3</span>
              <p style={{ fontSize: 14, lineHeight: 1.55 }}>
                Raising this in good faith can never be held against you — no impact on payouts,
                orders, contracts or standing. Retaliation is itself grievable.
              </p>
            </div>
            <p className="muted" style={{ fontSize: 13, lineHeight: 1.6, marginTop: 24 }}>
              Full procedure, grounds and response commitments:{' '}
              <Link href="/stakeholders/grievance" style={{ color: 'var(--accent-deep)' }}>
                the grievance hub →
              </Link>
            </p>
          </div>

          {/* Right — the form */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
              <RefChip>{persona.ref}</RefChip>
              <span className="kt-meta">
                Grievance form — {persona.name.toLowerCase()}
              </span>
            </div>
            <GrievanceForm
              persona={persona.slug}
              personaName={persona.name}
              categories={grievance.categories as unknown as string[]}
              email={email}
            />
            <p className="muted" style={{ fontSize: 13, lineHeight: 1.6, marginTop: 18 }}>
              Prefer not to use the form? Mail{' '}
              <a href={`mailto:${email}`} style={{ color: 'var(--accent-deep)' }}>
                {email}
              </a>{' '}
              or write to the registered office in Riga, marked &ldquo;Grievance&rdquo;.
            </p>
          </div>
        </div>

        {/* Other personas */}
        <hr className="kt-rule" style={{ margin: '64px 0 40px' }} />
        <div className="kt-meta" style={{ marginBottom: 16 }}>Not your group? Raise as:</div>
        <div
          className="kt-meta"
          style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}
        >
          {others.map((other) => (
            <Link
              key={other.slug}
              href={`/stakeholders/grievance/${other.slug}`}
              style={{ color: 'var(--accent-deep)' }}
            >
              ({other.ref}) {other.name} →
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
