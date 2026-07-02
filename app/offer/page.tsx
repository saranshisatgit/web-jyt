import type { Metadata } from 'next'
import Link from 'next/link'
import { headers } from 'next/headers'
import { Navbar } from '@/components/navbar'
import { HeroArt } from '@/components/hero-art'
import { getPageContent } from '@/lib/page-content'
import { DEFAULT_LOCALE } from '@/lib/i18n/config'

type Mockup = { webm?: string; gif?: string; alt: string }
type Step = { icon: string; title: string; body: string; mockup: Mockup }
type Benefit = { title: string; body: string }
type Section = { id: string; eyebrow: string; title: string; body: string; steps?: Step[]; benefits?: Benefit[] }
type CTA = { title: string; body: string; primaryCta: { label: string; href: string }; secondaryCta: { label: string; href: string } }
type Hero = { eyebrow: string; title: string; subtitle: string; primaryCta: { label: string; href: string }; secondaryCta: { label: string; href: string } }
type OfferContent = { hero: Hero; sections: Section[]; callout: CTA }

function MockupVideo({ mockup }: { mockup: Mockup }) {
  return (
    <video
      autoPlay
      loop
      muted
      playsInline
      poster={mockup.gif}
      style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 'var(--r-md)', border: '1px solid var(--rule)' }}
    >
      {mockup.webm && <source src={mockup.webm} type="video/webm" />}
      <img src={mockup.gif} alt={mockup.alt} style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 'var(--r-md)', border: '1px solid var(--rule)' }} />
    </video>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const h = await headers()
  const locale = h.get('x-locale') || DEFAULT_LOCALE
  const content = await getPageContent('offer', locale) as OfferContent
  return {
    title: content.hero.title,
    description: content.hero.subtitle,
  }
}

export default async function OfferPage() {
  const h = await headers()
  const locale = h.get('x-locale') || DEFAULT_LOCALE
  const content = await getPageContent('offer', locale) as OfferContent
  const { hero, sections, callout } = content

  return (
    <main>
      <Navbar />

      {/* Hero */}
      <section className="kt-hero relative isolate">
        <HeroArt />
        <div className="container kt-hero-content">
          <div className="kt-eyebrow">{hero.eyebrow}</div>
          <h1 className="kt-display l" style={{ marginTop: '16px' }}>{hero.title}</h1>
          <p className="muted" style={{ fontSize: '19px', lineHeight: 1.55, marginTop: '20px', maxWidth: '720px' }}>
            {hero.subtitle}
          </p>
          <div style={{ marginTop: '36px', display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
            <Link className="kt-btn" href={hero.primaryCta.href}>{hero.primaryCta.label}</Link>
            <Link className="kt-link" href={hero.secondaryCta.href}>{hero.secondaryCta.label}</Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      {sections.filter((s) => s.steps).map((section) => (
        <section key={section.id} className="kt-section" id={section.id}>
          <div className="container">
            <div className="kt-section-head">
              <div className="kt-eyebrow">{section.eyebrow}</div>
              <h2 className="kt-display m">{section.title}</h2>
            </div>
            <p className="muted" style={{ maxWidth: '680px', fontSize: '17px', lineHeight: 1.55 }}>
              {section.body}
            </p>
            <div style={{ marginTop: '48px', display: 'flex', flexDirection: 'column', gap: '64px' }}>
              {section.steps!.map((step, i) => (
                <article
                  key={step.icon}
                  className="kt-feature-row"
                  data-flip={i % 2 === 1 ? 'true' : undefined}
                >
                  <div className="kt-feature-copy">
                    <div className="kt-meta" style={{ color: 'var(--ink-mute)', fontFamily: 'var(--font-mono)', fontSize: '13px' }}>
                      Step {step.icon}
                    </div>
                    <h3 className="kt-display s" style={{ marginTop: '8px' }}>{step.title}</h3>
                    <p className="muted" style={{ fontSize: '17px', lineHeight: 1.55, marginTop: '12px' }}>
                      {step.body}
                    </p>
                  </div>
                  <div className="kt-feature-shot">
                    <MockupVideo mockup={step.mockup} />
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* Benefits */}
      {sections.filter((s) => s.benefits).map((section) => (
        <section key={section.id} className="kt-section">
          <div className="container">
            <div className="kt-section-head">
              <div className="kt-eyebrow">{section.eyebrow}</div>
              <h2 className="kt-display m">{section.title}</h2>
            </div>
            <p className="muted" style={{ maxWidth: '680px', fontSize: '17px', lineHeight: 1.55 }}>
              {section.body}
            </p>
            <div
              style={{
                marginTop: '40px',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '24px',
              }}
            >
              {section.benefits!.map((b) => (
                <div className="kt-card" key={b.title}>
                  <h4 className="serif" style={{ fontSize: '20px', fontWeight: 400, margin: 0 }}>{b.title}</h4>
                  <p className="muted" style={{ fontSize: '15px', marginTop: '10px', lineHeight: 1.55 }}>{b.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* Callout / Register CTA */}
      <section className="kt-section">
        <div className="container">
          <div className="kt-callout dark" style={{ padding: '56px 48px', borderRadius: 'var(--r-lg)' }}>
            <div style={{ maxWidth: '640px' }}>
              <h2 className="kt-display m" style={{ color: 'var(--cream)' }}>{callout.title}</h2>
              <p className="muted" style={{ fontSize: '17px', lineHeight: 1.55, marginTop: '16px', color: 'var(--cream-warm)', opacity: 0.85 }}>
                {callout.body}
              </p>
              <div style={{ marginTop: '32px', display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                <Link className="kt-btn" href={callout.primaryCta.href} style={{ background: 'var(--cream)', color: 'var(--ink-dark-bg)' }}>
                  {callout.primaryCta.label}
                </Link>
                <Link className="kt-link" href={callout.secondaryCta.href} style={{ color: 'var(--cream)' }}>
                  {callout.secondaryCta.label}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
