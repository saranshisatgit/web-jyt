import type { Metadata } from 'next'
import Image from 'next/image'
import { headers } from 'next/headers'
import { Navbar } from '@/components/navbar'
import { fetchPagefromAPI } from '../actions'
import { getBlockByName, getBlockByType, Block } from '@/medu/queries'
import partnerUiPreviewsData from '@/data/partner-ui-previews.json'
import { LiveBrandsStrip } from '@/components/partner-page/live-brands-strip'
import { brandFromKey } from '@/lib/brand'

interface HeaderContent {
  title: string
  subtitle: string
  announcement?: string
  buttons?: { text: string; link: string }[]
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

interface PartnerUiCapture {
  slug: string
  route: string
  label: string
  headline: string
  caption: string
  path: string
  width: number
  height: number
}

const partnerUiPreviews = partnerUiPreviewsData as {
  captured_at: string
  source: string
  captures: PartnerUiCapture[]
}

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const h = await headers()
  const brand = brandFromKey(h.get('x-brand'))
  return {
    title: 'Partners',
    description: `Become a ${brand.seo.name} production partner — atelier, manufacturer, or solo artisan. Global orders, mobile-first.`,
  }
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
  const featureBlock = getBlockByName(partnerPage.blocks, 'Partner Feature') as Block | undefined
  const bentoBlock = getBlockByName(partnerPage.blocks, 'Bento Section') as Block | undefined

  const header = (headerBlock?.content ?? {}) as unknown as HeaderContent
  const feature = (featureBlock?.content ?? {}) as unknown as FeatureContent
  const bentoRaw = bentoBlock?.content as Record<string, unknown> | undefined
  const bento = ((bentoRaw?.items ?? bentoRaw?.slideblocks ?? []) as BentoItem[])

  const captures = partnerUiPreviews.captures
  // The order-detail capture is the centerpiece of the tracing section,
  // so we hold it back from the alternating tour so it isn't shown twice.
  const tourCaptures = captures.filter((c) => c.slug !== 'inventory-order-detail')
  const tracingCapture = captures.find((c) => c.slug === 'inventory-order-detail')

  // Bento grid: snap to a column count that divides items cleanly so we
  // don't get a ragged final row when CMS has 5 or 7 items.
  const bentoCols = bento.length >= 8 ? 'lg:grid-cols-4' : bento.length >= 6 ? 'lg:grid-cols-3' : 'lg:grid-cols-2'

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
              <h1 className="kt-display xl" style={{ marginTop: '20px', marginBottom: '16px' }}>
                {header.title || 'Partner with us.'}
              </h1>
              <p
                className="muted"
                style={{ fontSize: '18px', maxWidth: '620px', lineHeight: 1.4, margin: 0 }}
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

      <LiveBrandsStrip />

      {/* ── Why partner — alternating screenshots from the actual partner UI.
          Each row pairs one feature claim with a captured view. If the
          capture manifest is empty, we fall back to the CMS feature block
          so this page doesn't go blank when the seed/capture is stale. */}
      {tourCaptures.length > 0 ? (
        <section className="kt-section" id="why-partner">
          <div className="container">
            <div className="kt-section-head">
              <div className="kt-eyebrow">Why partner</div>
              <h2 className="kt-display m">
                {feature.title || 'Same rails. Both ends.'}
              </h2>
            </div>
            {feature.subtitle && (
              <p className="muted" style={{ fontSize: '19px', lineHeight: 1.55, maxWidth: '720px', marginBottom: '64px' }}>
                {feature.subtitle}
              </p>
            )}
            <div className="kt-feature-tour">
              {tourCaptures.map((c, i) => (
                <article key={c.slug} className="kt-feature-row" data-flip={i % 2 === 1 ? 'true' : undefined}>
                  <div className="kt-feature-copy">
                    <div className="kt-meta" style={{ color: 'var(--accent-deep)' }}>
                      {String(i + 1).padStart(2, '0')} · {c.label}
                    </div>
                    <h3 className="kt-display s" style={{ marginTop: '12px' }}>{c.headline}</h3>
                    <p className="muted" style={{ fontSize: '17px', lineHeight: 1.55, marginTop: '16px' }}>
                      {c.caption}
                    </p>
                  </div>
                  <div className="kt-feature-shot">
                    <Image
                      src={c.path}
                      alt={c.label}
                      width={c.width}
                      height={c.height}
                      sizes="(min-width: 960px) 56vw, 100vw"
                      style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 'var(--r-md)', border: '1px solid var(--rule)' }}
                    />
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : (
        (feature.title || feature.screenshot?.url) && (
          <section className="kt-section">
            <div className="container">
              <div className="kt-section-head">
                <div className="kt-eyebrow">Why partner</div>
                <h2 className="kt-display m">{feature.title || 'Same rails. Both ends.'}</h2>
              </div>
              {feature.screenshot?.url && (
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
              )}
            </div>
          </section>
        )
      )}

      {/* ── Full tracing — the partner's activity timeline on one side,
          the consumer storefront where the same trail surfaces back on
          the other. The pitch the rest of the page builds toward. */}
      {tracingCapture && (
        <section className="kt-section flush" id="tracing">
          <div className="container" style={{ paddingTop: '40px' }}>
            <div className="kt-tracing">
              <div className="kt-tracing-head">
                <div className="kt-eyebrow on-dark">Full tracing</div>
                <h2 className="kt-display m" style={{ color: 'var(--cream)', marginTop: '12px' }}>
                  Same trail, <em style={{ color: 'var(--accent-deep)' }}>both ends</em>.
                </h2>
                <p style={{ color: 'oklch(0.78 0.04 145)', marginTop: '20px', maxWidth: '640px', fontSize: '17px', lineHeight: 1.55 }}>
                  Every step you log against an order — <em>assigned</em>, <em>started</em>, <em>completed</em> — flows
                  back to the customer&rsquo;s order page. They see the loom move; you see what you ship against. Nothing in
                  between.
                </p>
              </div>
              <div className="kt-tracing-shot">
                <Image
                  src={tracingCapture.path}
                  alt="Inventory order detail showing the partner-side activity timeline"
                  width={tracingCapture.width}
                  height={tracingCapture.height}
                  sizes="(min-width: 960px) 70vw, 100vw"
                  style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 'var(--r-md)', border: '1px solid oklch(0.42 0.025 220)' }}
                />
                <div className="kt-tracing-caption">
                  Partner view, live. The activities log on the right is the source of truth that surfaces on the customer&rsquo;s tracking page.
                </div>
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
            <div className={`grid grid-cols-1 md:grid-cols-2 ${bentoCols} gap-4`}>
              {bento.slice(0, 12).map((item, i) => (
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
          <div className="kt-apply-callout">
            <div>
              <div className="kt-eyebrow on-dark">Apply</div>
              <h3 className="kt-display s" style={{ color: 'var(--cream)', marginTop: '16px' }}>
                Become a <em style={{ color: 'var(--accent-deep)' }}>partner</em>.
              </h3>
              <p
                style={{
                  color: 'var(--ink-soft)',
                  marginTop: '12px',
                  maxWidth: '520px',
                  fontSize: '17px',
                }}
              >
                Tell us about your craft. We&apos;ll get back within a week with an onboarding window.
              </p>
            </div>
            <div className="kt-apply-callout-cta">
              <a href="/contact" className="kt-btn">Get in touch →</a>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
