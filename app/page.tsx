'use client'

import { useState, useEffect, useRef, type FormEvent } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useQuery } from '@tanstack/react-query'
import { Navbar } from '@/components/navbar'
import { SolutionBlock, FeaturedMockup } from '@/components/solution-block'
import { StackScroll } from '@/components/stack-scroll'
import { useBrand } from '@/app/context/brand-context'
import storefrontPreviews from '@/data/storefront-previews.json'
import { AUDIENCE_CALLOUT, SOLUTION_BLOCKS } from '@/data/solutions'

// ----- DATA -----------------------------------------------------------------

type Maker = { name: string; craft: string; location: string; story: string }
const MAKERS: Maker[] = [
  { name: 'Rukmini', craft: 'Block printing', location: 'Bagru, IN', story: 'Third-generation Dabu artist. Works in indigo and madder; hand-carves her own blocks.' },
  { name: 'Lorenzo', craft: 'Bespoke tailoring', location: 'Florence, IT', story: 'Trained at Fratelli Patané. Twenty-year jacket-maker, fluent in Tuscan wool houses.' },
  { name: 'Mei', craft: 'Hand embroidery', location: 'Sydney, AU', story: 'Goldwork specialist. Works on bridal couture and slow-fashion capsule collections.' },
]

type Benefit = { n: string; title: string; body: string }
const BENEFITS: Benefit[] = [
  { n: '01', title: 'Verifiable provenance', body: 'Artisan, village, material lot — auditable on the product page.' },
  { n: '02', title: 'Same rails, both ends', body: 'Maison or solo atelier — one production OS, both sides of the trade.' },
  { n: '03', title: 'Compliance by default', body: 'Digital Product Passport & EU ESPR built in, not bolted on.' },
  { n: '04', title: 'A storefront without a site', body: 'Headless commerce + custom domains. Publish without rebuilding.' },
]

type Stat = { num: string; unit?: string; label: string; sub: string }
// Fallback shown only when the live metrics endpoint returns all zeros —
// kept currency-neutral on purpose since we don't yet have the visitor's
// currency at this fallback point (the live branch handles formatting).
const STATS: Stat[] = [
  { num: '150', label: 'Artisans onboarded', sub: 'EU · IN · AU' },
  { num: '10', unit: '/ mo', label: 'Inbound signups', sub: '~20% curation rate' },
  { num: '10', unit: '/ mo', label: 'Client orders', sub: 'Avg order value tracked' },
  { num: '—', label: 'GMV this month', sub: 'Live metrics warming up' },
]

type Testimonial = { quote: string; brand: string; role: string }
const TESTIMONIALS: Testimonial[] = [
  { quote: 'From sample room to storefront on one rail. We stopped reconciling spreadsheets.', brand: 'LeAtelier', role: 'Founder' },
  { quote: 'Our partners get tasks on their phones. Production lead time dropped 40%.', brand: 'Cici Label', role: 'Production lead' },
  { quote: 'The product passport sells the garment for us. Buyers ask for the receipt.', brand: 'Atelier 03', role: 'Director' },
]

type Surface = { stage: string; title: string; items: string[] }
const SURFACES: Surface[] = [
  { stage: '01 · Admin', title: 'For the brand.', items: ['Design boards & collections', 'Production tasks & routing', 'Inventory by location', 'Orders, payments, fulfilment'] },
  { stage: '02 · Partners', title: 'For the makers.', items: ['Mobile-first portal', 'Task accept / decline', 'Live progress & chat', 'Payouts in their currency'] },
  { stage: '03 · Storefront', title: 'For the wearer.', items: ['Headless e-commerce', 'Product passport per SKU', 'Instagram & FB sync', 'Custom domains'] },
]

type HypoItem = { n: string; bold: string; body: string }
type HypoPane = { tag: string; name: string; sub: string; items: HypoItem[]; metric: string; caption: string }
const HYPO_LIGHT: HypoPane = {
  tag: 'Scenario A · The Maison',
  name: 'Gucci.',
  sub: 'Heritage house, global distribution, 100+ years of craft IP.',
  items: [
    { n: '01', bold: 'Verifiable provenance, per SKU.', body: 'Artisan, village, material lot — auditable on the product page.' },
    { n: '02', bold: 'A vetted Italian craft bench.', body: 'Capsules and made-to-order without in-house sourcing ops.' },
    { n: '03', bold: 'Compliance-ready by default.', body: 'Digital Product Passport & EU ESPR out of the box.' },
    { n: '04', bold: 'Story without slowdown.', body: 'Living narrative for marketing; ops keep their cadence.' },
  ],
  metric: '+18%',
  caption: 'Hypothesized lift on craft-led capsules.',
}
const HYPO_DARK: HypoPane = {
  tag: 'Scenario B · The Atelier of One',
  name: 'Rukmini.',
  sub: 'Solo block-printer, Bagru. Phone-first. Has never shipped outside India.',
  items: [
    { n: '01', bold: 'A storefront, without a website.', body: 'Profile, payments and shipping switched on day one.' },
    { n: '02', bold: 'Real buyers, not middlemen.', body: 'Margin stays with the maker, not a chain of agents.' },
    { n: '03', bold: 'Tasks in her pocket.', body: 'Partner app in her language; accept work, get paid, same phone.' },
    { n: '04', bold: 'A portfolio that compounds.', body: 'Each finished piece grows her discoverability.' },
  ],
  metric: '3×',
  caption: 'Hypothesized take-home per garment vs. local wholesaler.',
}

// ----- LIVE DATA HOOKS ------------------------------------------------------

type PublicPartner = {
  id: string
  name: string
  handle: string
  logo: string | null
  craft: string | null
  location: string | null
  story: string | null
  storefront_url: string | null
}

type PublicBrand = PublicPartner & {
  storefront_url: string
  is_live: boolean
}

type PartnersResponse = { artisans: PublicPartner[]; brands: PublicBrand[] }
type MetricsResponse = {
  artisans: number
  brands_live: number
  hubs: number
  lead_time?: {
    avg_days: number | null
    sample_size: number
    window_days: number
  }
  gmv: {
    amount: number
    currency: string
    window_days: number
    source?: 'actual' | 'projected'
  }
  // Conversion-intent signals — carts started but not yet completed
  // in the trailing window. Optional so an older backend without
  // these fields can't crash the renderer.
  intent?: {
    carts_30d: number
    carts_with_email_30d: number
    window_days: number
  }
  // Organic traffic from in-house analytics.
  traffic?: {
    unique_visitors_30d: number
    pageviews_30d: number
    window_days: number
  }
  last_updated: string | null
}

type HeroVideo = {
  url: string
  mime_type?: string
  width?: number
  height?: number
  alt: string
  credit: string | null
}
type HeroMediaResponse = { videos: HeroVideo[] }
const EMPTY_HERO_MEDIA: HeroMediaResponse = { videos: [] }

type HomeTestimonialsResponse = {
  title: string
  callToAction?: { text?: string; linkUrl?: string; linkText?: string }
  testimonials: Array<{
    name: string
    quote: string
    subtitle?: string
    image_url?: string
  }>
}

const EMPTY_PARTNERS: PartnersResponse = { artisans: [], brands: [] }
const EMPTY_METRICS: MetricsResponse = {
  artisans: 0,
  brands_live: 0,
  hubs: 0,
  lead_time: { avg_days: null, sample_size: 0, window_days: 90 },
  gmv: { amount: 0, currency: 'USD', window_days: 90, source: 'projected' },
  intent: { carts_30d: 0, carts_with_email_30d: 0, window_days: 30 },
  traffic: { unique_visitors_30d: 0, pageviews_30d: 0, window_days: 30 },
  last_updated: null,
}

const EMPTY_TESTIMONIALS: HomeTestimonialsResponse = {
  title: '',
  callToAction: undefined,
  testimonials: [],
}

function useHeroVideos() {
  return useQuery<HeroMediaResponse>({
    queryKey: ['hero-media'],
    queryFn: async () => {
      const res = await fetch('/api/hero-media')
      if (!res.ok) return EMPTY_HERO_MEDIA
      return (await res.json()) as HeroMediaResponse
    },
    staleTime: 60_000,
  })
}

function usePartners() {
  return useQuery<PartnersResponse>({
    queryKey: ['marketing-partners'],
    queryFn: async () => {
      const res = await fetch('/api/partners')
      if (!res.ok) return EMPTY_PARTNERS
      return (await res.json()) as PartnersResponse
    },
    staleTime: 60_000,
  })
}

function useMetrics() {
  return useQuery<MetricsResponse>({
    queryKey: ['marketing-metrics'],
    queryFn: async () => {
      const res = await fetch('/api/metrics')
      if (!res.ok) return EMPTY_METRICS
      // Normalize against EMPTY_METRICS so an older backend (without gmv
      // / intent / traffic) can't crash the page when components read
      // those fields.
      const json = (await res.json()) as Partial<MetricsResponse> | null
      return {
        ...EMPTY_METRICS,
        ...(json || {}),
        gmv: { ...EMPTY_METRICS.gmv, ...(json?.gmv || {}) },
        lead_time: { ...EMPTY_METRICS.lead_time!, ...(json?.lead_time || {}) },
        intent: { ...EMPTY_METRICS.intent!, ...(json?.intent || {}) },
        traffic: { ...EMPTY_METRICS.traffic!, ...(json?.traffic || {}) },
      }
    },
    staleTime: 60_000,
  })
}

function useHomeTestimonials() {
  return useQuery<HomeTestimonialsResponse>({
    queryKey: ['home-testimonials'],
    queryFn: async () => {
      const res = await fetch('/api/home-testimonials')
      if (!res.ok) return EMPTY_TESTIMONIALS
      return (await res.json()) as HomeTestimonialsResponse
    },
    staleTime: 60_000,
  })
}

// Compact GMV formatter — "€12.4K" / "$1.2M" — for stat tiles where space
// is tight. Currency code defaults to USD if unmapped.
function formatGmv(amount: number, currency: string): string {
  const symbol = currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : currency === 'INR' ? '₹' : '$'
  if (amount >= 1_000_000) return `${symbol}${(amount / 1_000_000).toFixed(1)}M`
  if (amount >= 1_000) return `${symbol}${(amount / 1_000).toFixed(1)}K`
  return `${symbol}${Math.round(amount)}`
}

// ----- ROOT -----------------------------------------------------------------

export default function Home() {
  return (
    <>
      <div>
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-dot-grid opacity-60 [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_85%)]"
          style={{ top: '-72px', height: 'calc(100% + 72px)' }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-20 bg-hero-wash"
          style={{ top: '-72px', height: 'calc(100% + 72px)' }}
        />
        <Navbar />
        <Hero />
      </div>
      <SolutionsShowcase />
      <Problem />
      <Thesis />
      <Surfaces />
      <Makers />
      <Brands />
      <BrandSites />
      <StackScroll />
      <Hypothesis />
      <Benefits />
      <UsingThePlatform />
      <Compare />
      <Stats />
      <GmvHeadline />
      <Testimonials />
      <Waitlist />
      <Raise />
      <Demo />
    </>
  )
}

// ----- SOLUTIONS SHOWCASE (brands-first audience callout + animated tour) ----
// Reuses data/solutions.ts and the SolutionBlock component so the home page and
// the /solutions page stay in lockstep. Surfaced high on the page so the
// animated product mockups are among the first things a visitor sees.

function SolutionsShowcase() {
  return (
    <section className="kt-section" id="solutions">
      <div className="container">
        <div className="kt-section-head">
          <div className="kt-eyebrow">{AUDIENCE_CALLOUT.eyebrow}</div>
          <h2 className="kt-display m">{AUDIENCE_CALLOUT.title}</h2>
        </div>
        <p className="muted" style={{ fontSize: '19px', lineHeight: 1.55, maxWidth: '720px' }}>
          {AUDIENCE_CALLOUT.body}
        </p>
        <div style={{ margin: '40px 0 72px' }}>
          <FeaturedMockup />
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '24px',
            marginBottom: '72px',
          }}
        >
          {AUDIENCE_CALLOUT.audiences.map((a) => (
            <div className="kt-card" key={a.tag}>
              <div className="kt-meta" style={{ color: 'var(--accent-deep)' }}>{a.tag}</div>
              <p className="muted" style={{ marginTop: '10px' }}>{a.line}</p>
            </div>
          ))}
        </div>
        <div className="kt-feature-tour">
          {SOLUTION_BLOCKS.map((b, i) => (
            <SolutionBlock key={b.id} block={b} index={i} />
          ))}
        </div>
        <div style={{ marginTop: '48px' }}>
          <Link className="kt-btn ghost" href="/solutions">
            See the full atelier OS →
          </Link>
        </div>
      </div>
    </section>
  )
}

// ----- HERO (mode-aware via data-aud spans) ---------------------------------

function Hero() {
  const brand = useBrand()
  const { data: metrics } = useMetrics()
  const { data: heroMedia } = useHeroVideos()
  const videos = heroMedia?.videos ?? []
  const hasVideo = videos.length > 0
  const artisanCount = metrics && metrics.artisans > 0 ? metrics.artisans : 150
  const hubCount = metrics && metrics.hubs > 0 ? metrics.hubs : brand.geographies.length
  const brandsCount = metrics && metrics.brands_live > 0 ? String(metrics.brands_live) : '3+'
  const gmvCount = metrics && metrics.gmv.amount > 0 ? formatGmv(metrics.gmv.amount, metrics.gmv.currency) : null
  const leadDays = metrics?.lead_time?.avg_days ?? null

  // Cycle through the fetched videos one-by-one. Without `loop` the
  // `ended` event fires per clip, so we advance to the next; with a
  // single clip we let the browser loop it natively.
  const videoRef = useRef<HTMLVideoElement>(null)
  const [idx, setIdx] = useState(0)
  useEffect(() => {
    setIdx(0)
  }, [videos.length])
  const current = videos[Math.min(idx, videos.length - 1)]
  const onEnded = () => {
    if (videos.length > 1) setIdx((i) => (i + 1) % videos.length)
  }
  // .m4v (Apple Photos exports) is H.264 in an MP4 container — browsers
  // play it fine, but the `video/x-m4v` mime hint makes some refuse the
  // <source>. Coerce to video/mp4 so every browser accepts it.
  const sourceType = (current?.mime_type || 'video/mp4').replace(/video\/(x-)?m4v$/i, 'video/mp4')

  return (
    <section className={`kt-hero relative isolate${hasVideo ? ' has-video' : ''}`}>
      {hasVideo && current && (
        <>
          <video
            key={current.url}
            ref={videoRef}
            className="kt-hero-video"
            autoPlay
            muted
            playsInline
            loop={videos.length === 1}
            onEnded={onEnded}
            poster=""
            aria-hidden
          >
            <source src={current.url} type={sourceType} />
          </video>
          <div className="kt-hero-scrim" aria-hidden />
        </>
      )}
      <div className="container kt-hero-content">
        <div className="kt-hero-grid">
          <div>
            <span className="kt-eyebrow">
              <span className="dot pulse" aria-hidden />
              <span data-aud="consumer">{brand.geographies.join(' · ')} · live now</span>
              <span data-aud="investor">{brand.raise.round} · {brand.raise.year} · open round</span>
              <span data-aud="platform">{brand.platformBrandName} · Medo · v3 live</span>
            </span>
            <h1 className="kt-display l" style={{ marginTop: '20px', marginBottom: '16px' }}>
              <span data-aud="consumer">A garment with <em className="serif italic">provenance</em>, made by hands you can name.</span>
              <span data-aud="investor">A confidence engine for <em className="serif italic">custom clothing</em>.</span>
              <span data-aud="platform">Three surfaces. <em className="serif italic">One source of truth.</em></span>
            </h1>
            <p className="muted" style={{ fontSize: '18px', maxWidth: '620px', lineHeight: 1.4, margin: '0 0 28px' }}>
              <span data-aud="consumer">
                Design with vetted artisans. Track every stitch. Wear something that comes with its own story — and the receipts to prove it.
              </span>
              <span data-aud="investor">
                Marketplace + production OS that gives every garment verifiable provenance and gives every artisan a global storefront — same rails, both sides.
              </span>
              <span data-aud="platform">
                Design, source and sell your collections on the same rails fashion brands like LeAtelier and Cici Label already trust.
              </span>
            </p>
            <div className="flex flex-wrap gap-4">
              <span data-aud="consumer" className="flex flex-wrap gap-4">
                <Link href="#waitlist" className="kt-btn">Join the waitlist</Link>
                <Link href="#makers" className="kt-btn ghost">Meet the makers</Link>
              </span>
              <span data-aud="investor" className="flex flex-wrap gap-4">
                <Link href="#raise" className="kt-btn">View the raise →</Link>
                <Link href="#thesis" className="kt-btn ghost">Read the thesis</Link>
              </span>
              <span data-aud="platform" className="flex flex-wrap gap-4">
                <Link href="#demo" className="kt-btn">Get a demo →</Link>
                <Link href="#surfaces" className="kt-btn ghost">Tour the platform</Link>
              </span>
            </div>
          </div>
          <aside className="kt-hero-side">
            <div data-aud="consumer">
              <div className="row"><span className="k">Atelier</span><span className="v">{artisanCount}</span></div>
              <div className="row"><span className="k">Hubs</span><span className="v">{hubCount}</span></div>
              {leadDays !== null && (
                <div className="row"><span className="k">Avg lead time</span><span className="v">{leadDays} days</span></div>
              )}
              <div className="row"><span className="k">Made-to-measure</span><span className="v">Always</span></div>
            </div>
            <div data-aud="investor">
              <div className="row"><span className="k">Round</span><span className="v">{brand.raise.amount} {brand.raise.round}</span></div>
              <div className="row"><span className="k">Stage</span><span className="v">Live revenue</span></div>
              <div className="row"><span className="k">Geographies</span><span className="v">EU · IN · AU</span></div>
              <div className="row"><span className="k">Stack</span><span className="v">Medo · open source</span></div>
            </div>
            <div data-aud="platform">
              <div className="row"><span className="k">Surfaces</span><span className="v">Admin · Partners · Storefront</span></div>
              <div className="row"><span className="k">Brands shipping</span><span className="v">{brandsCount}</span></div>
              {gmvCount && <div className="row"><span className="k">GMV powered</span><span className="v">{gmvCount}</span></div>}
              <div className="row"><span className="k">Stack</span><span className="v">MedusaJS · OSS</span></div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}

// ----- CONSUMER SECTIONS ----------------------------------------------------

function Problem() {
  return (
    <section className="kt-section" id="provenance">
      <div className="container">
        <div className="kt-section-head">
          <div>
            <div className="kt-eyebrow">The problem we wear</div>
          </div>
          <p className="kt-quote">
            Today, even premium clothing comes with a blind spot: you don&apos;t know{' '}
            <s>who made it</s>, <s>where it came from</s>, or <s>how it was produced</s>.
            We&apos;re stitching the truth back in.
          </p>
        </div>
      </div>
    </section>
  )
}

function Makers() {
  const { data } = usePartners()
  const items: Array<Maker | PublicPartner> =
    data?.artisans && data.artisans.length > 0 ? data.artisans : MAKERS

  return (
    <section className="kt-section" data-aud="consumer" id="makers">
      <div className="container">
        <div className="kt-section-head">
          <div className="kt-eyebrow">Meet the makers</div>
          <h2 className="kt-display m">Hands you can <em>name</em>, ateliers you can visit.</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((m, i) => {
            const key = 'id' in m && m.id ? m.id : m.name
            const logo = 'logo' in m ? m.logo : null
            const url = 'storefront_url' in m ? m.storefront_url : null
            const card = (
              <article className="kt-card hover" style={url ? { cursor: 'pointer' } : undefined}>
                <div
                  className={`kt-card-img${logo ? ' photo' : ''}`}
                  data-label="portrait"
                  style={logo ? { backgroundImage: `url('${logo}')` } : undefined}
                />
                <h3 className="kt-card-title l">{m.name}</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {m.craft && <span className="kt-pill">{m.craft}</span>}
                  {m.location && <span className="kt-pill">{m.location}</span>}
                </div>
                {m.story && <p className="kt-card-body">{m.story}</p>}
                {url && <div className="kt-card-link">Visit storefront →</div>}
              </article>
            )
            return url ? (
              <a key={key || i} href={url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
                {card}
              </a>
            ) : (
              <div key={key || i}>{card}</div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// Consumer-facing rail of partner storefronts — same data as the platform
// `Testimonials` brand cards but reframed as "shop the ateliers" for buyers.
function Brands() {
  const { data } = usePartners()
  const brands = data?.brands ?? []
  if (brands.length === 0) return null
  return (
    <section className="kt-section" data-aud="consumer" id="shop">
      <div className="container">
        <div className="kt-section-head">
          <div className="kt-eyebrow">Shop the ateliers</div>
          <h2 className="kt-display m">Storefronts <em>powered by hands</em>.</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {brands.map((b) => {
            const external = b.storefront_url.startsWith('http')
            return (
              <a
                key={b.id}
                href={b.storefront_url}
                target={external ? '_blank' : undefined}
                rel={external ? 'noopener noreferrer' : undefined}
                className="kt-card hover"
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div
                  className={`kt-card-img${b.logo ? ' photo' : ''}`}
                  data-label={b.is_live ? 'live' : undefined}
                  style={b.logo ? { backgroundImage: `url('${b.logo}')` } : undefined}
                />
                <h3 className="kt-card-title l">{b.name}</h3>
                {(b.craft || b.location) && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {b.craft && <span className="kt-pill">{b.craft}</span>}
                    {b.location && <span className="kt-pill">{b.location}</span>}
                  </div>
                )}
                {b.story && <p className="kt-card-body">{b.story}</p>}
                <div className="kt-card-link">Visit storefront →</div>
              </a>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// Small strip cross-linking cicilabel.com — Jaal Yantra's own atelier storefront.
function BrandSites() {
  return (
    <section className="kt-section flush" data-aud="consumer">
      <div className="container" style={{ paddingTop: '40px', paddingBottom: '40px' }}>
        <div className="kt-brand-strip">
          <div className="kt-eyebrow">Also from us</div>
          <div className="kt-brand-strip-links">
            <a href="https://cicilabel.com" target="_blank" rel="noopener noreferrer" className="kt-brand-strip-link">
              <span>Cici Label</span>
              <span className="kt-brand-strip-domain">cicilabel.com</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

function Waitlist() {
  return (
    <section className="kt-section flush" data-aud="consumer" id="waitlist">
      <div className="container" style={{ paddingTop: '40px', paddingBottom: '80px' }}>
        <div
          className="kt-callout dark"
          style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr 1fr',
            gap: '60px',
            alignItems: 'center',
            padding: '60px',
            borderRadius: 'var(--r-lg)',
          }}
        >
          <div>
            <div className="kt-eyebrow on-dark">Be early</div>
            <h3 className="kt-display s" style={{ color: 'var(--cream)', marginTop: '16px' }}>
              First 100{' '}
              <em className="serif italic">get a fitting</em>.
            </h3>
            <p style={{ color: 'oklch(0.78 0.04 145)', marginTop: '20px', maxWidth: '420px', lineHeight: 1.5 }}>
              Join the waitlist and we&apos;ll pair you with an atelier and a piece — yours, made by name, made by hand.
            </p>
          </div>
          <div>
            <CaptureForm
              endpoint="/api/waitlist"
              payloadExtra={{ mode: 'consumer' }}
              placeholder="you@somewhere.com"
              submitLabel="Join →"
              successMessage="Got it. We'll be in touch."
              idleHint="One email per quarter — no marketing slop."
              theme="dark"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

// ----- INVESTOR SECTIONS ----------------------------------------------------

function Thesis() {
  return (
    <section className="kt-section" id="thesis">
      <div className="container">
        <div className="kt-section-head">
          <div className="kt-eyebrow">The thesis</div>
          <h2 className="kt-display m">
            Provenance is becoming <em>table stakes</em>. Custom is becoming the only way to prove it.
          </h2>
        </div>
        <p style={{ maxWidth: '920px', fontSize: '21px', color: 'var(--ink-soft)', lineHeight: 1.45 }}>
          Two regulatory and cultural shifts converge: EU ESPR / Digital Product Passport mandates verifiable supply chains by 2027,
          while a generation of buyers will pay 30%+ for a garment with a story. The cheapest way to deliver both is to build the rails
          directly between the maker and the wearer.
        </p>
      </div>
    </section>
  )
}

function Hypothesis() {
  return (
    <section className="kt-section" data-aud="investor">
      <div className="container">
        <div className="kt-section-head">
          <div className="kt-eyebrow">Two-sided hypothesis</div>
          <h2 className="kt-display m">Same rails. <em>Both ends.</em></h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2" style={{ border: '1px solid var(--rule)' }}>
          <HypoPaneLight />
          <HypoPaneDark />
        </div>
      </div>
    </section>
  )
}

function HypoPaneLight() {
  const p = HYPO_LIGHT
  return (
    <div style={{ padding: '48px 44px', background: 'var(--cream)', display: 'flex', flexDirection: 'column' }}>
      <div className="kt-eyebrow">{p.tag}</div>
      <div className="serif" style={{ fontSize: '56px', lineHeight: 1, margin: '12px 0 4px', letterSpacing: '-0.02em' }}>
        {p.name}
      </div>
      <div className="muted" style={{ marginBottom: '24px' }}>{p.sub}</div>
      <ul className="kt-list">
        {p.items.map((it) => (
          <li key={it.n}>
            <span className="n">{it.n}</span>
            <div><b>{it.bold}</b><span>{it.body}</span></div>
          </li>
        ))}
      </ul>
      <div style={{ marginTop: 'auto', paddingTop: '24px', borderTop: '2px solid var(--ink)', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '20px' }}>
        <div className="serif" style={{ fontSize: '48px', lineHeight: 0.95, color: 'var(--ink-dark)' }}>{p.metric}</div>
        <div className="kt-meta" style={{ textAlign: 'right', maxWidth: '220px', lineHeight: 1.4 }}>{p.caption}</div>
      </div>
    </div>
  )
}

function HypoPaneDark() {
  const p = HYPO_DARK
  return (
    <div style={{ padding: '48px 44px', background: 'var(--ink-dark-bg)', color: 'var(--cream)', display: 'flex', flexDirection: 'column' }}>
      <div className="kt-eyebrow on-dark">{p.tag}</div>
      <div className="serif" style={{ fontSize: '56px', lineHeight: 1, margin: '12px 0 4px', letterSpacing: '-0.02em', color: 'var(--cream)' }}>
        {p.name}
      </div>
      <div style={{ color: 'oklch(0.8 0.04 145)', marginBottom: '24px', fontSize: '16px' }}>{p.sub}</div>
      <ul className="kt-list">
        {p.items.map((it) => (
          <li key={it.n} style={{ borderBottomColor: 'oklch(0.28 0.03 145)' }}>
            <span className="n" style={{ color: 'oklch(0.78 0.06 145)' }}>{it.n}</span>
            <div>
              <b style={{ color: 'var(--cream)' }}>{it.bold}</b>
              <span style={{ color: 'oklch(0.72 0.04 145)' }}>{it.body}</span>
            </div>
          </li>
        ))}
      </ul>
      <div style={{ marginTop: 'auto', paddingTop: '24px', borderTop: '2px solid var(--cream)', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '20px' }}>
        <div className="serif" style={{ fontSize: '48px', lineHeight: 0.95, color: 'var(--cream)' }}>{p.metric}</div>
          <div className="kt-meta" style={{ textAlign: 'right', maxWidth: '220px', lineHeight: 1.4, color: 'oklch(0.72 0.04 145)' }}>{p.caption}</div>
      </div>
    </div>
  )
}

function Raise() {
  const brand = useBrand()
  return (
    <section className="kt-section flush" data-aud="investor" id="raise">
      <div className="container" style={{ paddingTop: '40px', paddingBottom: '80px' }}>
        <div
          className="grid grid-cols-1 md:grid-cols-2"
          style={{
            background: 'var(--ink-dark-bg)',
            color: 'var(--cream)',
            padding: '60px',
            gap: '60px',
            alignItems: 'center',
            borderRadius: 'var(--r-lg)',
          }}
        >
          <div>
            <div className="kt-eyebrow on-dark">The raise</div>
            <div
              className="serif"
              style={{ fontSize: 'clamp(96px, 14vw, 188px)', lineHeight: 0.85, letterSpacing: '-0.03em', marginTop: '24px', color: 'var(--cream)' }}
            >
              {brand.raise.amount}
            </div>
            <div className="kt-meta" style={{ color: 'oklch(0.78 0.06 145)', marginTop: '24px' }}>
              {brand.raise.round} · {brand.raise.year} · open round
            </div>
            <p style={{ color: 'oklch(0.78 0.04 145)', marginTop: '24px', maxWidth: '420px', lineHeight: 1.5 }}>
              Use of funds: dedicated sales team · artisan onboarding in EU/IN/AU · paid acquisition &amp; brand · connecting production hubs.
            </p>
          </div>
          <div>
            <h3 className="kt-display s" style={{ color: 'var(--cream)', marginBottom: '16px' }}>Want to talk?</h3>
            <p style={{ color: 'oklch(0.78 0.04 145)', marginBottom: '28px' }}>
              Drop your email and we&apos;ll send the data room and a calendar link.
            </p>
            <CaptureForm
              endpoint="/api/intro"
              payloadExtra={{ fund: 'unspecified' }}
              placeholder="you@fund.com"
              submitLabel="Send →"
              successMessage="Thanks. Data room incoming."
              theme="dark"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

// ----- PLATFORM SECTIONS ----------------------------------------------------

function Surfaces() {
  return (
    <section className="kt-section" data-aud="platform" id="surfaces">
      <div className="container">
        <div className="kt-section-head">
          <div className="kt-eyebrow">The platform</div>
          <h2 className="kt-display m">Three surfaces. <em>One source of truth.</em></h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3" style={{ border: '1px solid var(--rule)' }}>
          {SURFACES.map((s, i) => (
            <div
              key={s.stage}
              style={{
                padding: '28px 24px',
                background: 'var(--cream)',
                borderRight: i === SURFACES.length - 1 ? 'none' : '1px solid var(--rule)',
              }}
            >
              <div className="kt-meta" style={{ color: 'var(--accent-deep)' }}>{s.stage}</div>
              <h3 className="serif" style={{ fontSize: '26px', margin: '12px 0 16px', lineHeight: 1.1, fontWeight: 400 }}>
                {s.title}
              </h3>
              <ul className="kt-dash-list">
                {s.items.map((it) => <li key={it}>{it}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Side-by-side: traditional ops vs platform. Marketing pages call this a
// "compare table"; we keep the kt-compare CSS lighter — two columns of
// numbered rows, the right column on the dark accent so the contrast does
// the rhetorical work.
type ComparePair = { traditional: string; platform: string }
const COMPARE_ROWS: ComparePair[] = [
  { traditional: 'Spreadsheets in 4 tabs, two timezones out of date', platform: 'One source of truth, live across admin / partner / storefront' },
  { traditional: 'WhatsApp threads for production updates', platform: 'Mobile-first partner portal with task accept / decline / status' },
  { traditional: 'PDF lookbooks → manual product entry', platform: 'Design module feeds collection + storefront in one click' },
  { traditional: 'Provenance claims with no receipt', platform: 'Digital Product Passport per SKU, EU ESPR ready' },
  { traditional: 'Custom site rebuild for every brand', platform: 'Headless storefront on custom domains, switched on day one' },
]

function Compare() {
  return (
    <section className="kt-section" data-aud="platform" id="compare">
      <div className="container">
        <div className="kt-section-head">
          <div className="kt-eyebrow">Without us / with us</div>
          <h2 className="kt-display m">Stop reconciling. <em>Start shipping.</em></h2>
        </div>
        <div className="kt-compare">
          <div className="kt-compare-head">
            <div className="kt-compare-head-cell muted">The way most ateliers run</div>
            <div className="kt-compare-head-cell accent">On the platform</div>
          </div>
          {COMPARE_ROWS.map((row, i) => (
            <div key={i} className="kt-compare-row">
              <div className="kt-compare-cell traditional">
                <span className="n">{String(i + 1).padStart(2, '0')}</span>
                <span>{row.traditional}</span>
              </div>
              <div className="kt-compare-cell platform">
                <span className="n">{String(i + 1).padStart(2, '0')}</span>
                <span>{row.platform}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Single-number GMV headline scoped to the current brand. When the metric
// is projected (capacity model rather than actual conversion sum), the
// label and caption say so explicitly — investors and buyers respect the
// disclosure more than a thinly-veiled forecast presented as truth.
function GmvHeadline() {
  const brand = useBrand()
  const { data: metrics } = useMetrics()
  if (!metrics || metrics.gmv.amount === 0) return null
  const display = formatGmv(metrics.gmv.amount, metrics.gmv.currency)
  const isProjected = metrics.gmv.source === 'projected'
  const eyebrow = isProjected ? 'Projected GMV · capacity model' : 'GMV powered for ateliers'
  const caption = isProjected
    ? `Trailing ${metrics.gmv.window_days} days · ${brand.shortName} · projection from active brands + artisans`
    : `Trailing ${metrics.gmv.window_days} days · ${brand.shortName} · live from production`
  return (
    <section className="kt-section flush" data-aud="platform" id="gmv">
      <div className="container" style={{ paddingTop: '40px', paddingBottom: '40px' }}>
        <div className="kt-gmv-headline">
          <div className="kt-eyebrow">{eyebrow}</div>
          <div className="kt-gmv-number">{display}</div>
          <div className="kt-meta">{caption}</div>
        </div>
      </div>
    </section>
  )
}

function Demo() {
  return (
    <section className="kt-section flush" data-aud="platform" id="demo">
      <div className="container" style={{ paddingTop: '40px', paddingBottom: '80px' }}>
        <div
          className="grid grid-cols-1 md:grid-cols-2"
          style={{
            background: 'var(--ink-dark-bg)',
            color: 'var(--cream)',
            padding: '60px',
            gap: '60px',
            alignItems: 'center',
            borderRadius: 'var(--r-lg)',
          }}
        >
          <div>
            <div className="kt-eyebrow on-dark">Get a demo</div>
            <div
              className="serif"
              style={{ fontSize: 'clamp(80px, 9vw, 120px)', lineHeight: 0.85, letterSpacing: '-0.03em', marginTop: '24px', color: 'var(--cream)' }}
            >
              Run<br />your<br />atelier.
            </div>
            <div className="kt-meta" style={{ color: 'oklch(0.78 0.06 145)', marginTop: '24px' }}>
              JaalYantra · since 2025
            </div>
            <p style={{ color: 'oklch(0.78 0.04 145)', marginTop: '24px', maxWidth: '420px', lineHeight: 1.5 }}>
              15+ happy customers · 3+ brands shipping. Tell us what you&apos;re making and we&apos;ll show you the platform live.
            </p>
          </div>
          <div>
            <h3 className="kt-display s" style={{ color: 'var(--cream)', marginBottom: '16px' }}>See it on your collection.</h3>
            <p style={{ color: 'oklch(0.78 0.04 145)', marginBottom: '28px' }}>
              30-minute call. We&apos;ll spin up a sandbox with your products in it.
            </p>
            <CaptureForm
              endpoint="/api/demo"
              payloadExtra={{ mode: 'platform' }}
              placeholder="you@yourbrand.com"
              submitLabel="Book →"
              successMessage="On the way. Calendar link incoming."
              theme="dark"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

function Benefits() {
  return (
    <section className="kt-section" data-aud="platform" id="benefits">
      <div className="container">
        <div className="kt-section-head">
          <div className="kt-eyebrow">What&apos;s inside</div>
          <h2 className="kt-display m">Close every <em>gap</em>.</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {BENEFITS.map((b) => (
            <article key={b.n} className="kt-card">
              <div className="kt-meta" style={{ color: 'var(--accent-deep)', letterSpacing: '0.14em' }}>{b.n}</div>
              <h3 className="kt-card-title" style={{ marginTop: '12px' }}>{b.title}</h3>
              <p className="kt-card-body">{b.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

// `UsingThePlatform` lives between <Benefits /> and <Compare />, mode-gated
// to investor. Pulls quote cards from the CMS Testimonial block on the
// home page (admin can edit live) and the live "what's actually happening"
// numbers (carts + organic visitors in last 30d) from the marketing
// metrics endpoint. Hidden entirely if neither has content.
function UsingThePlatform() {
  const { data: testimonialsData } = useHomeTestimonials()
  const { data: metrics } = useMetrics()
  const testimonials = testimonialsData?.testimonials ?? []
  const title = testimonialsData?.title || 'Voices from the platform'
  const cta = testimonialsData?.callToAction

  const carts = metrics?.intent?.carts_30d ?? 0
  const visitors = metrics?.traffic?.unique_visitors_30d ?? 0
  const hasIntent = carts > 0 || visitors > 0
  const hasQuotes = testimonials.length > 0

  if (!hasQuotes && !hasIntent) return null

  return (
    <section className="kt-section" data-aud="investor" id="using-the-platform">
      <div className="container">
        <div className="kt-section-head">
          <div className="kt-eyebrow">Using the platform</div>
          <h2 className="kt-display m">
            What&apos;s <em>actually</em> happening.
          </h2>
        </div>

        {hasQuotes && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4" style={{ marginTop: '32px' }}>
            {testimonials.map((t, i) => (
              <article key={i} className="kt-card">
                <p className="kt-card-body serif italic" style={{ fontSize: '17px', lineHeight: 1.5 }}>
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {t.image_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={t.image_url}
                      alt={t.name}
                      width={40}
                      height={40}
                      style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
                    />
                  )}
                  <div>
                    <div className="kt-card-title" style={{ fontSize: '15px', margin: 0 }}>{t.name}</div>
                    {t.subtitle && (
                      <div className="kt-meta" style={{ marginTop: '2px' }}>{t.subtitle}</div>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {hasIntent && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" style={{ marginTop: '32px' }}>
            <div className="kt-card">
              <div className="kt-meta" style={{ color: 'var(--accent-deep)', letterSpacing: '0.14em' }}>
                LAST 30 DAYS
              </div>
              <div style={{ fontSize: '36px', fontWeight: 600, marginTop: '8px' }}>
                {carts.toLocaleString()}
              </div>
              <div className="kt-card-body" style={{ marginTop: '4px' }}>
                shopping carts started across partner storefronts
              </div>
            </div>
            <div className="kt-card">
              <div className="kt-meta" style={{ color: 'var(--accent-deep)', letterSpacing: '0.14em' }}>
                LAST 30 DAYS
              </div>
              <div style={{ fontSize: '36px', fontWeight: 600, marginTop: '8px' }}>
                {visitors.toLocaleString()}
              </div>
              <div className="kt-card-body" style={{ marginTop: '4px' }}>
                unique visitors to partner storefronts
              </div>
            </div>
          </div>
        )}

        {cta?.text && cta?.linkUrl && cta?.linkText && (
          <div style={{ marginTop: '32px' }}>
            <p className="kt-card-body" style={{ maxWidth: '600px', marginBottom: '16px' }}>
              {cta.text}
            </p>
            <a href={cta.linkUrl} className="kt-link">
              {cta.linkText} →
            </a>
          </div>
        )}

        <LiveStorefronts />
      </div>
    </section>
  )
}

// `LiveStorefronts` is the visual-proof row below the quote cards.
// Screenshots committed to /public/storefront-previews/{handle}.png +
// data/storefront-previews.json by scripts/screenshot-storefronts.mjs
// — re-run that script when partners redesign or when a new partner
// goes live. Stays in jyt-web's repo (no runtime screenshot service).
function LiveStorefronts() {
  const storefronts =
    (storefrontPreviews as { storefronts?: Array<{
      partner_id: string
      name: string
      handle: string
      storefront_url: string
      screenshot_path: string
      width: number
      height: number
    }> }).storefronts ?? []

  if (storefronts.length === 0) return null

  return (
    <div style={{ marginTop: '48px' }}>
      <div className="kt-eyebrow" style={{ marginBottom: '12px' }}>
        Live storefronts
      </div>
      <p className="kt-card-body" style={{ maxWidth: '600px', marginBottom: '20px' }}>
        Partner stores running on the platform today — each on their own
        domain, their own products, their own checkout.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {storefronts.map((s) => (
          <a
            key={s.partner_id}
            href={s.storefront_url}
            target="_blank"
            rel="noopener noreferrer"
            className="kt-card"
            style={{
              padding: 0,
              overflow: 'hidden',
              display: 'block',
              textDecoration: 'none',
              color: 'inherit',
            }}
          >
            <div
              style={{
                position: 'relative',
                width: '100%',
                aspectRatio: `${s.width} / ${s.height}`,
                background: 'var(--bg-muted, #f6f5f0)',
                overflow: 'hidden',
                borderBottom: '1px solid var(--rule, rgba(0,0,0,0.08))',
              }}
            >
              <Image
                src={s.screenshot_path}
                alt={`${s.name} storefront preview`}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                style={{ objectFit: 'cover', objectPosition: 'top' }}
              />
            </div>
            <div style={{ padding: '12px 16px' }}>
              <div className="kt-card-title" style={{ fontSize: '14px', margin: 0 }}>
                {s.name}
              </div>
              <div
                className="kt-meta"
                style={{
                  marginTop: '2px',
                  fontSize: '12px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: '8px',
                }}
              >
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {s.storefront_url.replace(/^https?:\/\//, '')}
                </span>
                <span style={{ color: 'var(--accent-deep, currentColor)', flexShrink: 0 }}>visit →</span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}

function Testimonials() {
  const { data } = usePartners()
  const brands = data?.brands ?? []
  return (
    <section className="kt-section" data-aud="platform" id="testimonials">
      <div className="container">
        <div className="kt-section-head">
          <div className="kt-eyebrow">Brands shipping on it</div>
          <h2 className="kt-display m">Same rails. <em>Their stories.</em></h2>
        </div>
        {brands.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {brands.map((b) => {
              const external = b.storefront_url.startsWith('http')
              return (
                <a
                  key={b.id}
                  href={b.storefront_url}
                  target={external ? '_blank' : undefined}
                  rel={external ? 'noopener noreferrer' : undefined}
                  className="kt-card hover"
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <div
                    className={`kt-card-img${b.logo ? ' photo' : ''}`}
                    data-label={b.is_live ? 'live' : undefined}
                    style={b.logo ? { backgroundImage: `url('${b.logo}')` } : undefined}
                  />
                  <h3 className="kt-card-title l">{b.name}</h3>
                  {(b.craft || b.location) && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {b.craft && <span className="kt-pill">{b.craft}</span>}
                      {b.location && <span className="kt-pill">{b.location}</span>}
                    </div>
                  )}
                  {b.story && <p className="kt-card-body">{b.story}</p>}
                  <div
                    style={{
                      marginTop: 'auto',
                      paddingTop: '24px',
                      fontFamily: 'var(--font-mono)',
                      fontSize: 'var(--t-caption)',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: 'var(--accent-deep)',
                    }}
                  >
                    Visit storefront →
                  </div>
                </a>
              )
            })}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <article key={t.brand} className="kt-card">
                <p className="serif italic" style={{ fontSize: '22px', lineHeight: 1.35, margin: 0 }}>
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="kt-byline" style={{ marginTop: 'auto', paddingTop: '24px' }}>
                  <div className="kt-avatar sm" aria-hidden />
      <div className="relative">
                    <div className="name">{t.brand}</div>
                    <div className="role">{t.role}</div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

// ----- SHARED SECTIONS ------------------------------------------------------

function Stats() {
  const brand = useBrand()
  const { data: metrics } = useMetrics()
  // Live data drives the row when any metric is non-zero. We don't gate on
  // artisans alone since GMV may be live before partner counts are seeded.
  const hasLive = !!metrics && (metrics.artisans > 0 || metrics.brands_live > 0 || metrics.gmv.amount > 0)
  const gmvNum = metrics ? formatGmv(metrics.gmv.amount, metrics.gmv.currency) : '€0'
  const isProjected = metrics?.gmv.source === 'projected'
  const gmvLabel = isProjected ? 'Projected GMV' : 'GMV processed'
  const gmvSub = metrics
    ? `trailing ${metrics.gmv.window_days}d · ${metrics.gmv.currency}${isProjected ? ' · capacity model' : ''}`
    : 'trailing 90d'
  const stats: Stat[] = hasLive
    ? [
        { num: String(metrics!.artisans), label: 'Artisans onboarded', sub: brand.geographies.join(' · ') },
        { num: String(metrics!.brands_live), label: 'Brands shipping', sub: `on ${brand.shortName}` },
        { num: gmvNum, label: gmvLabel, sub: gmvSub },
        { num: '10', unit: '/ mo', label: 'Inbound signups', sub: '~20% curation rate' },
      ]
    : STATS
  return (
    <section
      className="kt-section flush"
      data-aud="investor"
      id="stats"
      style={{ background: 'var(--ink-dark-bg)', padding: '80px 0' }}
    >
      <div className="container">
        <div className="kt-section-head">
          <div className="kt-eyebrow on-dark">Traction · live</div>
          <h2 className="kt-display m" style={{ color: 'var(--cream)' }}>
            Numbers from the platform,{' '}
              <em className="serif italic">not the slide</em>.
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4" style={{ border: '1px solid var(--rule-dark)' }}>
          {stats.map((s, i) => (
            <div
              key={s.label}
              className="kt-stat dark"
              style={{
                border: 0,
                borderRight: i === stats.length - 1 ? 'none' : '1px solid var(--rule-dark)',
              }}
            >
              <div>
                <div className="num">
                  {s.num}
                  {s.unit && <span className="unit">{s.unit}</span>}
                </div>
                <div className="lbl">{s.label}</div>
              </div>
              <div className="lbl" style={{ opacity: 0.6 }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ----- SHARED CAPTURE FORM --------------------------------------------------

type CaptureFormProps = {
  endpoint: string
  payloadExtra?: Record<string, unknown>
  placeholder: string
  submitLabel: string
  successMessage: string
  idleHint?: string
  theme?: 'dark' | 'light'
}

function CaptureForm({
  endpoint,
  payloadExtra,
  placeholder,
  submitLabel,
  successMessage,
  idleHint,
  theme = 'light',
}: CaptureFormProps) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<{ kind: 'idle' | 'sending' | 'ok' | 'err'; msg?: string }>({ kind: 'idle' })

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (status.kind === 'sending') return
    setStatus({ kind: 'sending' })
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, ...(payloadExtra || {}) }),
      })
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null
        setStatus({ kind: 'err', msg: data?.error || 'Something went wrong.' })
        return
      }
      setStatus({ kind: 'ok', msg: successMessage })
      setEmail('')
    } catch {
      setStatus({ kind: 'err', msg: 'Network error.' })
    }
  }

  const statusColor =
    status.kind === 'ok'
      ? 'oklch(0.75 0.18 145)'
      : status.kind === 'err'
        ? 'oklch(0.60 0.14 25)'
        : theme === 'dark'
          ? 'oklch(0.72 0.04 145)'
          : 'var(--ink-soft)'

  const inputStyle =
    theme === 'dark'
      ? { background: 'transparent', borderColor: 'oklch(0.38 0.03 145)', color: 'var(--cream)' }
      : undefined

  return (
    <>
      <form className="kt-inline-form" onSubmit={onSubmit}>
        <input
          className="kt-input"
          type="email"
          name="email"
          placeholder={placeholder}
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status.kind === 'sending'}
          style={inputStyle}
        />
        <button type="submit" className="kt-btn" disabled={status.kind === 'sending'}>
          {status.kind === 'sending' ? 'Sending…' : submitLabel}
        </button>
      </form>
      <p className="kt-meta" style={{ marginTop: '14px', color: statusColor, minHeight: '18px' }}>
        {status.msg || idleHint || ' '}
      </p>
    </>
  )
}
