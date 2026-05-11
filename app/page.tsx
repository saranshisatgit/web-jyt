'use client'

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { Navbar } from '@/components/navbar'
import { useBrand } from '@/app/context/brand-context'

// ----- DATA -----------------------------------------------------------------

type Maker = { name: string; craft: string; location: string; story: string }
const MAKERS: Maker[] = [
  { name: 'Rukmini', craft: 'Block printing', location: 'Bagru, IN', story: 'Third-generation Dabu artist. Works in indigo and madder; hand-carves her own blocks.' },
  { name: 'Lorenzo', craft: 'Bespoke tailoring', location: 'Florence, IT', story: 'Trained at Fratelli Patané. Twenty-year jacket-maker, fluent in Tuscan wool houses.' },
  { name: 'Mei', craft: 'Hand embroidery', location: 'Sydney, AU', story: 'Goldwork specialist. Works on bridal couture and slow-fashion capsule collections.' },
]

type FlowStep = { stage: string; title: string; items: string[]; dark?: boolean }
const FLOW: FlowStep[] = [
  { stage: '01 · Design', title: 'Sketch & brief the piece.', items: ['Design & mood boards', 'Pre-production assets', 'Partner assignment'] },
  { stage: '02 · Produce', title: 'Route tasks to vetted artisans.', items: ['Task templates & dependencies', 'Mobile-first partner portal', 'Live progress updates'] },
  { stage: '03 · Supply', title: 'Track raw materials end to end.', items: ['Inventory by location', 'Reorder alerts', 'Supplier notifications'] },
  { stage: '04 · Sell', title: 'Ship & publish, branded.', items: ['Headless storefront', 'Instagram & Facebook sync', 'Full traceability per SKU'], dark: true },
]

type Benefit = { n: string; title: string; body: string }
const BENEFITS: Benefit[] = [
  { n: '01', title: 'Verifiable provenance', body: 'Artisan, village, material lot — auditable on the product page.' },
  { n: '02', title: 'Same rails, both ends', body: 'Maison or solo atelier — one production OS, both sides of the trade.' },
  { n: '03', title: 'Compliance by default', body: 'Digital Product Passport & EU ESPR built in, not bolted on.' },
  { n: '04', title: 'A storefront without a site', body: 'Headless commerce + custom domains. Publish without rebuilding.' },
]

type Stat = { num: string; unit?: string; label: string; sub: string }
const STATS: Stat[] = [
  { num: '150', label: 'Artisans onboarded', sub: 'EU · IN · AU' },
  { num: '10', unit: '/ mo', label: 'Inbound signups', sub: '~20% curation rate' },
  { num: '10', unit: '/ mo', label: 'Client orders', sub: '€100 avg order value' },
  { num: '€1K', label: 'GMV this month', sub: '+ €18 / mo per artisan' },
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
  last_updated: string | null
}

const EMPTY_PARTNERS: PartnersResponse = { artisans: [], brands: [] }
const EMPTY_METRICS: MetricsResponse = { artisans: 0, brands_live: 0, hubs: 0, last_updated: null }

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
      return (await res.json()) as MetricsResponse
    },
    staleTime: 60_000,
  })
}

// ----- ROOT -----------------------------------------------------------------

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Problem />
      <Thesis />
      <Surfaces />
      <Makers />
      <Flow />
      <Hypothesis />
      <Benefits />
      <Stats />
      <Testimonials />
      <Waitlist />
      <Raise />
      <Demo />
    </>
  )
}

// ----- HERO (mode-aware via data-aud spans) ---------------------------------

function Hero() {
  const brand = useBrand()
  const { data: metrics } = useMetrics()
  const artisanCount = metrics && metrics.artisans > 0 ? metrics.artisans : 150
  const hubCount = metrics && metrics.hubs > 0 ? metrics.hubs : brand.geographies.length
  const brandsCount = metrics && metrics.brands_live > 0 ? `${metrics.brands_live}+` : '3+'
  return (
    <section className="kt-hero">
      <div className="container">
        <div className="kt-hero-grid">
          <div>
            <span className="kt-eyebrow">
              <span className="dot pulse" aria-hidden />
              <span data-aud="consumer">{brand.geographies.join(' · ')} · live now</span>
              <span data-aud="investor">{brand.raise.round} · {brand.raise.year} · open round</span>
              <span data-aud="platform">{brand.platformBrandName} · Medo · v3 live</span>
            </span>
            <h1 className="kt-display xl" style={{ marginTop: '32px', marginBottom: '24px' }}>
              <span data-aud="consumer">A garment with <em>provenance</em>, made by hands you can name.</span>
              <span data-aud="investor">A confidence engine for <em>custom clothing</em>.</span>
              <span data-aud="platform">Three surfaces. <em>One source of truth.</em></span>
            </h1>
            <p className="muted" style={{ fontSize: '21px', maxWidth: '680px', lineHeight: 1.45, margin: '0 0 48px' }}>
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
              <div className="row"><span className="k">Avg lead time</span><span className="v">21 days</span></div>
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
              <div className="row"><span className="k">Customers</span><span className="v">15+</span></div>
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
    <section className="kt-section" data-aud="consumer" id="provenance">
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
            return (
              <article key={key || i} className="kt-card hover">
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
              </article>
            )
          })}
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
              First 100 <em style={{ color: 'oklch(0.82 0.14 50)' }}>get a fitting</em>.
            </h3>
            <p style={{ color: 'oklch(0.82 0.018 75)', marginTop: '20px', maxWidth: '420px', lineHeight: 1.5 }}>
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
    <section className="kt-section" data-aud="investor" id="thesis">
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
        <div className="serif" style={{ fontSize: '48px', lineHeight: 0.95, color: 'var(--accent-deep)' }}>{p.metric}</div>
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
      <div style={{ color: 'oklch(0.8 0.018 75)', marginBottom: '24px', fontSize: '16px' }}>{p.sub}</div>
      <ul className="kt-list">
        {p.items.map((it) => (
          <li key={it.n} style={{ borderBottomColor: 'oklch(0.32 0.02 55)' }}>
            <span className="n" style={{ color: 'oklch(0.8 0.1 50)' }}>{it.n}</span>
            <div>
              <b style={{ color: 'var(--cream)' }}>{it.bold}</b>
              <span style={{ color: 'oklch(0.78 0.018 75)' }}>{it.body}</span>
            </div>
          </li>
        ))}
      </ul>
      <div style={{ marginTop: 'auto', paddingTop: '24px', borderTop: '2px solid var(--cream)', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '20px' }}>
        <div className="serif" style={{ fontSize: '48px', lineHeight: 0.95, color: 'oklch(0.82 0.14 50)' }}>{p.metric}</div>
        <div className="kt-meta" style={{ textAlign: 'right', maxWidth: '220px', lineHeight: 1.4, color: 'oklch(0.78 0.018 75)' }}>{p.caption}</div>
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
              style={{ fontSize: 'clamp(96px, 14vw, 188px)', lineHeight: 0.85, letterSpacing: '-0.03em', color: 'oklch(0.85 0.16 50)', marginTop: '24px' }}
            >
              {brand.raise.amount}
            </div>
            <div className="kt-meta" style={{ color: 'oklch(0.8 0.1 50)', marginTop: '24px' }}>
              {brand.raise.round} · {brand.raise.year} · open round
            </div>
            <p style={{ color: 'oklch(0.82 0.018 75)', marginTop: '24px', maxWidth: '420px', lineHeight: 1.5 }}>
              Use of funds: dedicated sales team · artisan onboarding in EU/IN/AU · paid acquisition &amp; brand · connecting production hubs.
            </p>
          </div>
          <div>
            <h3 className="kt-display s" style={{ color: 'var(--cream)', marginBottom: '16px' }}>Want to talk?</h3>
            <p style={{ color: 'oklch(0.82 0.018 75)', marginBottom: '28px' }}>
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
              style={{ fontSize: 'clamp(80px, 9vw, 120px)', lineHeight: 0.85, letterSpacing: '-0.03em', color: 'oklch(0.85 0.16 50)', marginTop: '24px' }}
            >
              Run<br />your<br />atelier.
            </div>
            <div className="kt-meta" style={{ color: 'oklch(0.8 0.1 50)', marginTop: '24px' }}>
              JaalYantra · since 2025
            </div>
            <p style={{ color: 'oklch(0.82 0.018 75)', marginTop: '24px', maxWidth: '420px', lineHeight: 1.5 }}>
              15+ happy customers · 3+ brands shipping. Tell us what you&apos;re making and we&apos;ll show you the platform live.
            </p>
          </div>
          <div>
            <h3 className="kt-display s" style={{ color: 'var(--cream)', marginBottom: '16px' }}>See it on your collection.</h3>
            <p style={{ color: 'oklch(0.82 0.018 75)', marginBottom: '28px' }}>
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
                  <div>
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

function Flow() {
  return (
    <section className="kt-section" id="how-it-works">
      <div className="container">
        <div className="kt-section-head">
          <div className="kt-eyebrow">The stack · Medo</div>
          <h2 className="kt-display m">One system. <em>Sketch to shipment.</em></h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4" style={{ border: '1px solid var(--rule)' }}>
          {FLOW.map((step, i) => {
            const isDark = step.dark
            const isLast = i === FLOW.length - 1
            return (
              <div
                key={step.stage}
                style={{
                  padding: '28px 24px',
                  background: isDark ? 'var(--ink-dark-bg)' : 'var(--cream)',
                  color: isDark ? 'var(--cream)' : 'var(--ink)',
                  borderRight: isLast ? 'none' : '1px solid var(--rule)',
                }}
              >
                <div className="kt-meta" style={{ color: isDark ? 'oklch(0.8 0.1 50)' : 'var(--accent-deep)' }}>
                  {step.stage}
                </div>
                <h3 className="serif" style={{ fontSize: '26px', margin: '12px 0 16px', lineHeight: 1.1, fontWeight: 400 }}>
                  {step.title}
                </h3>
                <ul className="kt-dash-list">
                  {step.items.map((it) => (
                    <li key={it} style={isDark ? { color: 'oklch(0.78 0.018 75)' } : undefined}>
                      {it}
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function Stats() {
  const { data: metrics } = useMetrics()
  const stats: Stat[] =
    metrics && metrics.artisans > 0
      ? [
          { num: String(metrics.artisans), label: 'Artisans onboarded', sub: 'EU · IN · AU' },
          { num: String(metrics.brands_live || 0), label: 'Brands shipping', sub: 'on JaalYantra' },
          { num: '10', unit: '/ mo', label: 'Inbound signups', sub: '~20% curation rate' },
          { num: '€1K', label: 'GMV this month', sub: '+ €18 / mo per artisan' },
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
            Numbers from the platform, <em style={{ color: 'oklch(0.82 0.14 50)' }}>not the slide</em>.
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4" style={{ border: '1px solid var(--rule-dark)' }}>
          {stats.map((s, i) => (
            <div
              key={s.label}
              className="kt-stat dark"
              style={{
                border: 0,
                borderRight: i === STATS.length - 1 ? 'none' : '1px solid var(--rule-dark)',
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
        ? 'oklch(0.82 0.14 50)'
        : theme === 'dark'
          ? 'oklch(0.78 0.018 75)'
          : 'var(--ink-soft)'

  const inputStyle =
    theme === 'dark'
      ? { background: 'transparent', borderColor: 'oklch(0.4 0.02 55)', color: 'var(--cream)' }
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
