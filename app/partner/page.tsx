import type { Metadata } from 'next'
import Image from 'next/image'
import { Navbar } from '@/components/navbar'
import { fetchPagefromAPI } from '../actions'
import { getBlockByName, getBlockByType, Block } from '@/medu/queries'

interface HeaderContent {
  title: string
  subtitle: string
  announcement?: string
  buttons?: { text: string; link: string }[]
}

interface LogoItem {
  id: string
  src: string
  alt: string
}

interface FeatureSlide {
  type?: string
  content?: { title?: string; description?: string }
}

interface FeatureContent {
  title?: string
  subtitle?: string
  screenshot?: { url?: string }
  slideblocks?: FeatureSlide[]
}

interface BentoItem {
  title: string
  description: string
}

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Partners',
  description:
    'Become a JaalYantra production partner — atelier, manufacturer, or solo artisan. Global orders, mobile-first.',
}

export default async function Partner() {
  const partnerPage = await fetchPagefromAPI('partner')
  if (!partnerPage) {
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

  const headerBlock = getBlockByType(partnerPage.blocks, 'Header') as Block | undefined
  const logoBlock = getBlockByName(partnerPage.blocks, 'Feature Section') as Block | undefined
  const featureBlock = getBlockByName(partnerPage.blocks, 'Partner Feature') as Block | undefined
  const bentoBlock = getBlockByName(partnerPage.blocks, 'Bento Section') as Block | undefined

  const header = (headerBlock?.content ?? {}) as unknown as HeaderContent
  const logoContent = logoBlock?.content as Record<string, unknown> | undefined
  const logos = ((logoContent?.logos as LogoItem[] | undefined) ?? []) as LogoItem[]
  const feature = (featureBlock?.content ?? {}) as unknown as FeatureContent
  const bentoRaw = bentoBlock?.content as Record<string, unknown> | undefined
  const bento = ((bentoRaw?.items ?? bentoRaw?.slideblocks ?? []) as BentoItem[])

  return (
    <main>
      <Navbar />

      <section className="kt-hero">
        <div className="container">
          <div className="kt-hero-grid">
            <div>
              <span className="kt-eyebrow">
                <span className="dot" aria-hidden />
                {header.announcement || 'For makers'}
              </span>
              <h1 className="kt-display xl" style={{ marginTop: '32px', marginBottom: '24px' }}>
                {header.title || 'Partner with us.'}
              </h1>
              <p
                className="muted"
                style={{ fontSize: '21px', maxWidth: '680px', lineHeight: 1.45, margin: 0 }}
              >
                {header.subtitle ||
                  'Run your atelier on the same rails fashion brands like LeAtelier and Cici Label already trust.'}
              </p>
              {header.buttons && header.buttons.length > 0 && (
                <div className="flex flex-wrap gap-4" style={{ marginTop: '40px' }}>
                  {header.buttons.map((btn, i) => (
                    <a key={i} href={btn.link} className={`kt-btn${i > 0 ? ' ghost' : ''}`}>
                      {btn.text}
                    </a>
                  ))}
                </div>
              )}
            </div>
            <aside className="kt-hero-side">
              <div className="row"><span className="k">Onboarding</span><span className="v">~7 days</span></div>
              <div className="row"><span className="k">Languages</span><span className="v">EN · HI · IT</span></div>
              <div className="row"><span className="k">Payouts</span><span className="v">Local currency</span></div>
              <div className="row"><span className="k">Stack</span><span className="v">Mobile-first</span></div>
            </aside>
          </div>
        </div>
      </section>

      {logos.length > 0 && (
        <section className="kt-section">
          <div className="container">
            <div className="kt-meta" style={{ marginBottom: '24px', textAlign: 'center' }}>
              Brands shipping with us
            </div>
            <div
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6"
              style={{ alignItems: 'center' }}
            >
              {logos.map((logo) => (
                <div key={logo.id} style={{ display: 'flex', justifyContent: 'center' }}>
                  <Image
                    src={logo.src}
                    alt={logo.alt}
                    width={120}
                    height={48}
                    style={{
                      objectFit: 'contain',
                      maxHeight: '48px',
                      width: 'auto',
                      opacity: 0.7,
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {(feature.title || feature.screenshot?.url) && (
        <section className="kt-section">
          <div className="container">
            <div className="kt-section-head">
              <div className="kt-eyebrow">Why partner</div>
              <h2 className="kt-display m">{feature.title || 'Same rails. Both ends.'}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12" style={{ alignItems: 'center' }}>
              <div>
                {feature.subtitle && (
                  <p className="muted" style={{ fontSize: '19px', lineHeight: 1.55, marginBottom: '24px' }}>
                    {feature.subtitle}
                  </p>
                )}
                {feature.slideblocks && feature.slideblocks.length > 0 && (
                  <ul className="kt-list">
                    {feature.slideblocks.map((slide, i) => {
                      const t = slide?.content?.title || `Feature ${i + 1}`
                      const d = slide?.content?.description || ''
                      return (
                        <li key={i}>
                          <span className="n">{String(i + 1).padStart(2, '0')}</span>
                          <div>
                            <b>{t}</b>
                            {d && <span>{d}</span>}
                          </div>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </div>
              <div>
                {feature.screenshot?.url ? (
                  <div
                    aria-hidden
                    style={{
                      aspectRatio: '4 / 3',
                      backgroundImage: `url('${feature.screenshot.url}')`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      borderRadius: 'var(--r-md)',
                      border: '1px solid var(--rule)',
                    }}
                  />
                ) : (
                  <div className="kt-card-img" style={{ height: '400px', margin: 0 }} />
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {bento.length > 0 && (
        <section className="kt-section">
          <div className="container">
            <div className="kt-section-head">
              <div className="kt-eyebrow">What you get</div>
              <h2 className="kt-display m">Everything to <em>run an atelier</em>.</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {bento.slice(0, 8).map((item, i) => (
                <article key={i} className="kt-card">
                  <div
                    className="kt-meta"
                    style={{ color: 'var(--accent-deep)', letterSpacing: '0.14em' }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <h3 className="kt-card-title" style={{ marginTop: '12px' }}>
                    {item.title}
                  </h3>
                  <p className="kt-card-body">{item.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="kt-section flush">
        <div className="container" style={{ paddingTop: '40px', paddingBottom: '80px' }}>
          <div
            className="kt-callout dark"
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr auto',
              gap: '40px',
              alignItems: 'center',
              padding: '48px',
              borderRadius: 'var(--r-lg)',
            }}
          >
            <div>
              <div className="kt-eyebrow on-dark">Apply</div>
              <h3 className="kt-display s" style={{ color: 'var(--cream)', marginTop: '16px' }}>
                Become a <em style={{ color: 'oklch(0.82 0.14 50)' }}>partner</em>.
              </h3>
              <p
                style={{
                  color: 'oklch(0.82 0.018 75)',
                  marginTop: '12px',
                  maxWidth: '520px',
                  fontSize: '17px',
                }}
              >
                Tell us about your craft. We&apos;ll get back within a week with an onboarding window.
              </p>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
              <a href="/contact" className="kt-btn">Get in touch →</a>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
