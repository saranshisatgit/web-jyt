import type { Metadata } from 'next'
import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { HeroArt } from '@/components/hero-art'
import { SolutionBlock, FeaturedMockup } from '@/components/solution-block'
import {
  SOLUTIONS_HERO,
  AUDIENCE_CALLOUT,
  SOLUTION_BLOCKS,
  SOLUTIONS_CTA,
} from '@/data/solutions'

export const metadata: Metadata = {
  title: SOLUTIONS_HERO.title,
  description: SOLUTIONS_HERO.subtitle,
}

export default function SolutionsPage() {
  return (
    <main>
      <Navbar />

      <section className="kt-hero relative isolate">
        <HeroArt />
        <div className="container kt-hero-content">
          <div className="kt-eyebrow">{SOLUTIONS_HERO.eyebrow}</div>
          <h1 className="kt-display l" style={{ marginTop: '16px' }}>
            {SOLUTIONS_HERO.title}
          </h1>
          <p
            className="muted"
            style={{
              fontSize: '19px',
              lineHeight: 1.55,
              marginTop: '20px',
              maxWidth: '720px',
            }}
          >
            {SOLUTIONS_HERO.subtitle}
          </p>
          <div style={{ marginTop: '40px', display: 'flex', gap: '16px', alignItems: 'center' }}>
            <Link className="kt-btn" href={SOLUTIONS_HERO.primaryCta.href}>
              {SOLUTIONS_HERO.primaryCta.label}
            </Link>
            <Link className="kt-link" href={SOLUTIONS_HERO.secondaryCta.href}>
              {SOLUTIONS_HERO.secondaryCta.label}
            </Link>
          </div>
          <div style={{ marginTop: '56px' }}>
            <FeaturedMockup />
          </div>
        </div>
      </section>

      <section className="kt-section">
        <div className="container">
          <div className="kt-section-head">
            <div className="kt-eyebrow">{AUDIENCE_CALLOUT.eyebrow}</div>
            <h2 className="kt-display m">{AUDIENCE_CALLOUT.title}</h2>
          </div>
          <p className="muted">{AUDIENCE_CALLOUT.body}</p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '24px',
              marginTop: '40px',
            }}
          >
            {AUDIENCE_CALLOUT.audiences.map((a) => (
              <div className="kt-card" key={a.tag}>
                <div className="kt-meta">{a.tag}</div>
                <p className="muted">{a.line}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="kt-section">
        <div className="container">
          <div className="kt-feature-tour">
            {SOLUTION_BLOCKS.map((b, i) => (
              <SolutionBlock key={b.id} block={b} index={i} />
            ))}
          </div>
        </div>
      </section>

      <section className="kt-section">
        <div className="container">
          <h2 className="kt-display m">{SOLUTIONS_CTA.title}</h2>
          <p className="muted">{SOLUTIONS_CTA.body}</p>
          <div style={{ marginTop: '32px', display: 'flex', gap: '16px', alignItems: 'center' }}>
            <Link className="kt-btn" href={SOLUTIONS_CTA.primaryCta.href}>
              {SOLUTIONS_CTA.primaryCta.label}
            </Link>
            <Link className="kt-btn ghost" href={SOLUTIONS_CTA.secondaryCta.href}>
              {SOLUTIONS_CTA.secondaryCta.label}
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
