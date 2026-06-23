import type { Metadata } from 'next'
import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { WholesaleFlow, Coordinate } from '@/components/mockup-animations'
import wholesale from '@/data/wholesale.json'

export const metadata: Metadata = {
  title: 'Wholesale — source verified inventory, sell sustainable | JYT',
  description:
    'Wholesalers enter sustainable markets with JYT: browse verified, traceable inventory, design your own pieces in the partner studio, and sell with a Digital Product Passport on every SKU.',
}

export default function WholesalePage() {
  const { hero, shift, steps, benefits, cta } = wholesale
  return (
    <main>
      <Navbar />

      {/* Hero */}
      <section className="kt-section">
        <div className="container">
          <div className="kt-eyebrow">{hero.eyebrow}</div>
          <h1 className="kt-display l" style={{ marginTop: '16px' }}>{hero.title}</h1>
          <p className="muted" style={{ fontSize: '19px', lineHeight: 1.55, marginTop: '20px', maxWidth: '760px' }}>
            {hero.subtitle}
          </p>
          <div style={{ marginTop: '36px', display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
            <Link className="kt-btn" href={hero.primaryCta.href}>{hero.primaryCta.label}</Link>
            <Link className="kt-link" href={hero.secondaryCta.href}>{hero.secondaryCta.label}</Link>
          </div>
          <div style={{ marginTop: '56px', maxWidth: '560px' }}>
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
            {steps.items.map((s) => (
              <div className="kt-card" key={s.n}>
                <div className="kt-meta" style={{ color: 'var(--accent-deep)' }}>{s.n}</div>
                <h3 className="kt-display s" style={{ marginTop: '10px', fontSize: '20px' }}>{s.title}</h3>
                <p className="muted" style={{ marginTop: '10px', lineHeight: 1.55 }}>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sell-side mockup */}
      <section className="kt-section">
        <div className="container">
          <div className="kt-section-head">
            <div className="kt-eyebrow">Sell &amp; coordinate</div>
            <h2 className="kt-display m">Branded, traceable, on every channel.</h2>
          </div>
          <div style={{ maxWidth: '560px' }}>
            <Coordinate />
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
            {benefits.items.map((b) => (
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
            <Link className="kt-btn" href={cta.primaryCta.href}>{cta.primaryCta.label}</Link>
            <Link className="kt-btn ghost" href={cta.secondaryCta.href}>{cta.secondaryCta.label}</Link>
          </div>
        </div>
      </section>
    </main>
  )
}
