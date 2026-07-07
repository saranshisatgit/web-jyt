import type { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@medusajs/ui'
import { headers } from 'next/headers'
import { Navbar } from '@/components/navbar'
import { HeroArt } from '@/components/hero-art'
import { SolutionBlock, FeaturedMockup } from '@/components/solution-block'
import { getPageContent } from '@/lib/page-content'
import { DEFAULT_LOCALE } from '@/lib/i18n/config'
import type { SolutionBlock as SolutionBlockData } from '@/data/solutions'

export const metadata: Metadata = {
  title: 'One OS for your atelier — design, produce, supply, sell',
  description:
    'Design, produce, supply, and sell on a single rail — from the first sketch to a branded storefront, with every artisan, material lot, and SKU accounted for.',
}

export default async function SolutionsPage() {
  const h = await headers()
  const locale = h.get('x-locale') || DEFAULT_LOCALE
  const content = await getPageContent('solutions', locale) as any
  const { hero: SOLUTIONS_HERO, audienceCallout: AUDIENCE_CALLOUT, blocks: SOLUTION_BLOCKS, cta: SOLUTIONS_CTA } = content
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
            <Button asChild>
              <Link href={SOLUTIONS_HERO.primaryCta.href}>{SOLUTIONS_HERO.primaryCta.label}</Link>
            </Button>
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
            {(AUDIENCE_CALLOUT.audiences as any[]).map((a) => (
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
            {(SOLUTION_BLOCKS as any[]).map((b, i) => (
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
            <Button asChild>
              <Link href={SOLUTIONS_CTA.primaryCta.href}>{SOLUTIONS_CTA.primaryCta.label}</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href={SOLUTIONS_CTA.secondaryCta.href}>{SOLUTIONS_CTA.secondaryCta.label}</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}
