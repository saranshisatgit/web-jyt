import type { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@medusajs/ui'
import { headers } from 'next/headers'
import { Navbar } from '@/components/navbar'
import { HeroArt } from '@/components/hero-art'
import { WholesaleFlow, Coordinate } from '@/components/mockup-animations'
import { getPageContent } from '@/lib/page-content'
import { DEFAULT_LOCALE } from '@/lib/i18n/config'

export const metadata: Metadata = {
  title: 'Wholesale — source verified inventory, sell sustainable',
  description:
    'Wholesalers enter sustainable markets — verify provenance, simplify compliance, and sell to conscious buyers at scale.',
}

export default async function WholesalePage() {
  const h = await headers()
  const locale = h.get('x-locale') || DEFAULT_LOCALE
  const wholesale = await getPageContent('wholesale', locale) as any
  const { hero, shift, steps, sell, benefits, cta } = wholesale
  return (
    <main>
      <Navbar />

      {/* Hero */}
      <section className="kt-hero relative isolate">
        <HeroArt />
        <div className="container kt-hero-content">
          <div className="kt-eyebrow">{hero.eyebrow}</div>
          <h1 className="kt-display l" style={{ marginTop: '16px' }}>{hero.title}</h1>
          <p className="muted" style={{ fontSize: '19px', lineHeight: 1.55, marginTop: '20px', maxWidth: '760px' }}>
            {hero.subtitle}
          </p>
          <div style={{ marginTop: '36px', display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
            <Button asChild><Link href={hero.primaryCta.href}>{hero.primaryCta.label}</Link></Button>
            <Link className="kt-link" href={hero.secondaryCta.href}>{hero.secondaryCta.label}</Link>
          </div>
          <div style={{ marginTop: '56px' }}>
            <WholesaleFlow />
          </div>
        </div>
      </section>

      {/* The shift */}
      <section className="kt-section">
        <div className="container">
          <div className="kt-section-head">
            <div className="kt-eyebrow">{shift.eyebrow}</div>
            <h2 className="kt-display m">{shift.title}</h2>
          </div>
          <p className="muted" style={{ fontSize: '18px', lineHeight: 1.6, maxWidth: '760px' }}>{shift.body}</p>
        </div>
      </section>

      {/* Steps */}
      <section className="kt-section">
        <div className="container">
          <div className="kt-section-head">
            <div className="kt-eyebrow">{steps.eyebrow}</div>
            <h2 className="kt-display m">{steps.title}</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px', marginTop: '8px' }}>
            {(steps.items as any[]).map((s) => (
              <div className="kt-card" key={s.n}>
                <div className="kt-meta" style={{ color: 'var(--accent-deep)' }}>{s.n}</div>
                <h3 className="kt-display s" style={{ marginTop: '10px', fontSize: '20px' }}>{s.title}</h3>
                <p className="muted" style={{ marginTop: '10px', lineHeight: 1.55 }}>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sell & coordinate */}
      <section className="kt-section">
        <div className="container">
          <div className="kt-section-head">
            <div className="kt-eyebrow">{sell.eyebrow}</div>
            <h2 className="kt-display m">{sell.title}</h2>
          </div>
          <p className="muted" style={{ fontSize: '18px', lineHeight: 1.6, maxWidth: '760px', marginTop: '12px' }}>{sell.subtitle}</p>
          <div className="kt-mockup-split">
            <div style={{ display: 'grid', gap: '28px', alignContent: 'center' }}>
              {(sell.items as any[]).map((s) => (
                <div key={s.title}>
                  <h3 className="kt-display s" style={{ fontSize: '20px' }}>{s.title}</h3>
                  <p className="muted" style={{ marginTop: '8px', lineHeight: 1.55 }}>{s.body}</p>
                </div>
              ))}
            </div>
            <div>
              <Coordinate />
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="kt-section">
        <div className="container">
          <div className="kt-section-head">
            <div className="kt-eyebrow">{benefits.eyebrow}</div>
            <h2 className="kt-display m">{benefits.title}</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
            {(benefits.items as any[]).map((b) => (
              <div className="kt-card" key={b.title}>
                <div className="kt-meta" style={{ color: 'var(--accent-deep)' }}>{b.title}</div>
                <p className="muted" style={{ marginTop: '10px', lineHeight: 1.55 }}>{b.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="kt-section">
        <div className="container">
          <h2 className="kt-display m">{cta.title}</h2>
          <p className="muted" style={{ maxWidth: '640px' }}>{cta.body}</p>
          <div style={{ marginTop: '32px', display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
            <Button asChild><Link href={cta.primaryCta.href}>{cta.primaryCta.label}</Link></Button>
            <Button asChild variant="secondary"><Link href={cta.secondaryCta.href}>{cta.secondaryCta.label}</Link></Button>
          </div>
        </div>
      </section>
    </main>
  )
}
