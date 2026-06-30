import React, { Suspense } from 'react'
import { AnimatedNumber } from '@/components/animated-number'
import { Navbar } from '@/components/navbar'
import { HeroArt } from '@/components/hero-art'
import type { Metadata } from 'next'
import Image from 'next/image'
import { fetchPagefromAPI } from '../actions'
import { getBlockByName, Block } from '@/medu/queries'
import { SectionLoading } from '@/components/section-loading'

interface StatItem {
  label: string
  value: string
  animatedValue: { start: number; end: number; decimals?: number }
}

interface HeaderBlockContent {
  title: string
  subtitle: string
  mission: { title: string; paragraphs: string[] }
  stats: StatItem[]
  images: string[]
}

interface TeamMember {
  name: string
  role: string
  image: string
}

interface TeamBlockContent {
  heading: string
  subheading: string
  description: string
  story: string[]
  teamImage: string
  members: TeamMember[]
  ctaButton?: { text: string; link: string }
}

interface InvestorGroup {
  name: string
  logo: string
}

interface InvestorsBlockContent {
  heading: string
  subheading: string
  description: string
  investorGroups: InvestorGroup[]
  testimonial: { quote: string; author: string; role: string; image: string }
}

interface JobPosition {
  title: string
  department: string
  location: string
  type: string
}

interface CareersBlockContent {
  heading: string
  subheading: string
  description: string
  perks: { title: string; description: string }[]
  openPositions: JobPosition[]
  ctaButton: { text: string; link: string }
}

export const metadata: Metadata = {
  title: 'About — We are on a mission',
  description: "We're on a mission to transform how textiles are designed, made, and sold.",
}

function AboutHero({ data }: { data?: Block }) {
  const content = data?.content as unknown as HeaderBlockContent | undefined
  if (!content) return null

  return (
    <section className="kt-hero relative isolate">
      <HeroArt />
      <div className="container kt-hero-content">
        <div className="kt-hero-grid">
          <div>
            <span className="kt-eyebrow">
              <span className="dot" aria-hidden />
              About us
            </span>
            <h1 className="kt-display xl" style={{ marginTop: '20px', marginBottom: '16px' }}>
              {content.title}
            </h1>
            <p
              className="muted"
              style={{ fontSize: '18px', maxWidth: '620px', lineHeight: 1.4, margin: 0 }}
            >
              {content.subtitle}
            </p>
          </div>
          <aside className="kt-hero-side">
            {(content.stats || []).slice(0, 4).map((stat) => {
              const unit = stat.value.replace(/[0-9.,]+/, '').trim()
              return (
                <div key={stat.label} className="row">
                  <span className="k">{stat.label}</span>
                  <span className="v">
                    <AnimatedNumber
                      start={stat.animatedValue.start}
                      end={stat.animatedValue.end}
                      decimals={stat.animatedValue.decimals}
                    />
                    {unit && <span>{unit}</span>}
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

function Mission({ data }: { data?: Block }) {
  const content = data?.content as unknown as HeaderBlockContent | undefined
  if (!content?.mission) return null

  return (
    <section
      className="kt-section"
      style={{ background: 'var(--ink-dark-bg)', color: 'var(--cream)', padding: '100px 0' }}
    >
      <div className="container">
        <div className="kt-section-head">
          <div className="kt-eyebrow on-dark">Manifesto</div>
          <h2 className="kt-display m" style={{ color: 'var(--cream)' }}>
            {content.mission.title}
          </h2>
        </div>
        <ul className="kt-list" style={{ marginBottom: '48px' }}>
          {content.mission.paragraphs.map((p, i) => (
            <li key={i} style={{ borderBottomColor: 'oklch(0.36 0.06 145)' }}>
              <span className="n" style={{ color: 'var(--accent-soft)' }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <div>
                <span style={{ color: 'var(--cream-warm)', fontSize: '17px', lineHeight: 1.5 }}>
                  {p}
                </span>
              </div>
            </li>
          ))}
        </ul>
        {content.images?.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {content.images.map((img, i) => (
              <div
                key={i}
                aria-hidden
                style={{
                  backgroundImage: `url('${img}')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  aspectRatio: '1 / 1',
                  borderRadius: 'var(--r-md)',
                  border: '1px solid oklch(0.28 0.03 145)',
                }}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

function Team({ data }: { data?: Block }) {
  const content = data?.content as unknown as TeamBlockContent | undefined
  if (!content) return null

  return (
    <section className="kt-section">
      <div className="container">
        <div className="kt-section-head">
          <div className="kt-eyebrow">{content.subheading}</div>
          <h2 className="kt-display m">{content.heading}</h2>
        </div>
        {content.description && (
          <p
            className="muted"
            style={{ maxWidth: '720px', fontSize: '19px', lineHeight: 1.55, marginBottom: '48px' }}
          >
            {content.description}
          </p>
        )}
        {content.story?.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8" style={{ marginBottom: '64px' }}>
            {content.story.map((para, i) => (
              <p key={i} className="muted" style={{ fontSize: '17px', lineHeight: 1.6, margin: 0 }}>
                {para}
              </p>
            ))}
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {content.members?.map((m) => (
            <article key={m.name} className="kt-card">
              <div
                className="kt-card-img photo"
                style={{ backgroundImage: m.image ? `url('${m.image}')` : undefined }}
                data-label={m.role}
              />
              <h3 className="kt-card-title">{m.name}</h3>
              <p className="muted" style={{ fontSize: '14px', margin: 0 }}>
                {m.role}
              </p>
            </article>
          ))}
        </div>
        {content.ctaButton && (
          <div style={{ marginTop: '48px' }}>
            <a href={content.ctaButton.link} className="kt-btn ghost">
              {content.ctaButton.text}
            </a>
          </div>
        )}
      </div>
    </section>
  )
}

function Investors({ data }: { data?: Block }) {
  const content = data?.content as unknown as InvestorsBlockContent | undefined
  if (!content) return null

  return (
    <section className="kt-section">
      <div className="container">
        <div className="kt-section-head">
          <div className="kt-eyebrow">{content.subheading}</div>
          <h2 className="kt-display m">{content.heading}</h2>
        </div>
        {content.description && (
          <p
            className="muted"
            style={{ maxWidth: '720px', fontSize: '19px', marginBottom: '48px' }}
          >
            {content.description}
          </p>
        )}
        {content.investorGroups?.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6" style={{ marginBottom: '48px' }}>
            {content.investorGroups.map((inv) => (
              <div
                key={inv.name}
                className="kt-card"
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '120px',
                  padding: '24px',
                }}
              >
                {inv.logo ? (
                  <Image
                    src={inv.logo}
                    alt={inv.name}
                    width={140}
                    height={48}
                    style={{ objectFit: 'contain', maxHeight: '48px', width: 'auto' }}
                  />
                ) : (
                  <span className="kt-meta">{inv.name}</span>
                )}
              </div>
            ))}
          </div>
        )}
        {content.testimonial?.quote && (
          <div
            className="kt-callout dark"
            style={{
              display: 'grid',
              gridTemplateColumns: 'auto 1fr',
              gap: '32px',
              alignItems: 'center',
              padding: '40px 48px',
            }}
          >
            {content.testimonial.image && (
              <div
                aria-hidden
                style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '50%',
                  backgroundImage: `url('${content.testimonial.image}')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  flexShrink: 0,
                }}
              />
            )}
            <div>
              <p
                className="serif italic"
                style={{ fontSize: '24px', lineHeight: 1.4, color: 'var(--cream)', margin: 0 }}
              >
                &ldquo;{content.testimonial.quote}&rdquo;
              </p>
              <div
                className="kt-meta"
                style={{
                  marginTop: '16px',
                  color: 'oklch(0.8 0.04 145)',
                  letterSpacing: '0.1em',
                }}
              >
                {content.testimonial.author} · {content.testimonial.role}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

function Careers({ data }: { data?: Block }) {
  const content = data?.content as unknown as CareersBlockContent | undefined
  if (!content) return null

  const grouped = (content.openPositions || []).reduce(
    (acc: Record<string, JobPosition[]>, job) => {
      const dept = job.department || 'Other'
      if (!acc[dept]) acc[dept] = []
      acc[dept].push(job)
      return acc
    },
    {}
  )

  return (
    <section className="kt-section">
      <div className="container">
        <div className="kt-section-head">
          <div className="kt-eyebrow">{content.subheading}</div>
          <h2 className="kt-display m">{content.heading}</h2>
        </div>
        {content.description && (
          <p
            className="muted"
            style={{ maxWidth: '720px', fontSize: '19px', marginBottom: '48px' }}
          >
            {content.description}
          </p>
        )}
        {content.perks?.length > 0 && (
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            style={{ marginBottom: '64px' }}
          >
            {content.perks.map((perk) => (
              <div
                key={perk.title}
                style={{
                  borderTop: '1px solid var(--rule)',
                  paddingTop: '20px',
                }}
              >
                <h3
                  className="serif"
                  style={{ fontSize: '22px', fontWeight: 400, marginBottom: '8px', margin: 0 }}
                >
                  {perk.title}
                </h3>
                <p className="muted" style={{ fontSize: '15px', margin: '8px 0 0', lineHeight: 1.5 }}>
                  {perk.description}
                </p>
              </div>
            ))}
          </div>
        )}
        {Object.keys(grouped).length > 0 && (
          <div>
            <div className="kt-meta" style={{ marginBottom: '20px' }}>
              Open positions
            </div>
            {Object.entries(grouped).map(([dept, jobs]) => (
              <div key={dept} style={{ marginBottom: '32px' }}>
                <div
                  className="kt-eyebrow"
                  style={{ marginBottom: '12px', color: 'var(--ink-soft)' }}
                >
                  {dept}
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {jobs.map((job, i) => (
                    <li
                      key={`${job.title}-${i}`}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '2fr 1fr 1fr auto',
                        gap: '16px',
                        padding: '16px 0',
                        borderBottom: '1px solid var(--rule-soft)',
                        alignItems: 'baseline',
                      }}
                    >
                      <span className="serif" style={{ fontSize: '20px' }}>
                        {job.title}
                      </span>
                      <span className="muted" style={{ fontSize: '14px' }}>
                        {job.location}
                      </span>
                      <span className="kt-meta">{job.type}</span>
                      <a href={content.ctaButton.link} className="kt-meta" style={{ color: 'var(--accent-deep)' }}>
                        Apply →
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div style={{ marginTop: '32px' }}>
              <a href={content.ctaButton.link} className="kt-btn">
                {content.ctaButton.text}
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default async function Company() {
  const headerBlock = await fetchPagefromAPI('about-us')
  if (!headerBlock) {
    return (
      <main>
        <Navbar />
        <section className="kt-section">
          <div className="container">
            <p className="muted">Loading…</p>
          </div>
        </section>
      </main>
    )
  }

  const headerData = getBlockByName(headerBlock.blocks, 'Header')
  const teamData = getBlockByName(headerBlock.blocks, 'Team')
  const investorsData = getBlockByName(headerBlock.blocks, 'Investors')
  const careersData = getBlockByName(headerBlock.blocks, 'Careers')

  return (
    <main>
      <Navbar />
      <Suspense fallback={<SectionLoading />}>
        <AboutHero data={headerData} />
      </Suspense>
      <Suspense fallback={<SectionLoading />}>
        <Mission data={headerData} />
      </Suspense>
      <Suspense fallback={<SectionLoading />}>
        <Team data={teamData} />
      </Suspense>
      <Suspense fallback={<SectionLoading />}>
        <Investors data={investorsData} />
      </Suspense>
      <Suspense fallback={<SectionLoading />}>
        <Careers data={careersData} />
      </Suspense>
    </main>
  )
}
