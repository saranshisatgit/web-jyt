'use client'

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { Button } from '@medusajs/ui'
import { useQuery } from '@tanstack/react-query'
import { Navbar } from '@/components/navbar'
import { useBrand } from '@/app/context/brand-context'

// ----- DATA -----------------------------------------------------------------
// Live metrics come from the same /api/metrics proxy the homepage uses. The
// investor-specific fields (orders, commission, arr, aov, subscription) are
// added by the backend to `GET /website/{domain}/marketing/metrics`. Every
// field is optional here so an older backend can't crash the page.

type InvestorMetrics = {
  artisans: number
  brands_live: number
  hubs: number
  gmv: { amount: number; currency: string; window_days: number; source?: string }
  orders: { processed: number; trailing_30d: number; window_days: number }
  commission: { accrued: number; trailing_30d: number; currency: string; window_days: number }
  arr: { amount: number; currency: string }
  aov: { amount: number; currency: string }
  subscription: { paying_artisans: number; mrr: number; currency: string }
  intent?: { carts_30d: number; carts_with_email_30d: number; window_days: number }
  traffic?: { unique_visitors_30d: number; pageviews_30d: number; window_days: number }
  last_updated: string | null
}

const EMPTY_METRICS: InvestorMetrics = {
  artisans: 0,
  brands_live: 0,
  hubs: 0,
  gmv: { amount: 0, currency: 'EUR', window_days: 90 },
  orders: { processed: 0, trailing_30d: 0, window_days: 30 },
  commission: { accrued: 0, trailing_30d: 0, currency: 'EUR', window_days: 30 },
  arr: { amount: 0, currency: 'EUR' },
  aov: { amount: 0, currency: 'EUR' },
  subscription: { paying_artisans: 0, mrr: 0, currency: 'EUR' },
  intent: { carts_30d: 0, carts_with_email_30d: 0, window_days: 30 },
  traffic: { unique_visitors_30d: 0, pageviews_30d: 0, window_days: 30 },
  last_updated: null,
}

function useInvestorMetrics() {
  return useQuery<InvestorMetrics>({
    queryKey: ['investor-metrics'],
    queryFn: async () => {
      const res = await fetch('/api/metrics')
      if (!res.ok) return EMPTY_METRICS
      const json = (await res.json()) as Partial<InvestorMetrics> | null
      return {
        ...EMPTY_METRICS,
        ...(json || {}),
        gmv: { ...EMPTY_METRICS.gmv, ...(json?.gmv || {}) },
        orders: { ...EMPTY_METRICS.orders, ...(json?.orders || {}) },
        commission: { ...EMPTY_METRICS.commission, ...(json?.commission || {}) },
        arr: { ...EMPTY_METRICS.arr, ...(json?.arr || {}) },
        aov: { ...EMPTY_METRICS.aov, ...(json?.aov || {}) },
        subscription: { ...EMPTY_METRICS.subscription, ...(json?.subscription || {}) },
        intent: { ...EMPTY_METRICS.intent!, ...(json?.intent || {}) },
        traffic: { ...EMPTY_METRICS.traffic!, ...(json?.traffic || {}) },
      }
    },
    staleTime: 60_000,
  })
}

const SYMBOL: Record<string, string> = { EUR: '€', USD: '$', GBP: '£', INR: '₹', AUD: 'A$' }
function sym(c: string) {
  return SYMBOL[c] ?? '€'
}
function money(amount: number, c: string): string {
  const s = sym(c)
  if (amount >= 1_000_000) return `${s}${(amount / 1_000_000).toFixed(1)}M`
  if (amount >= 1_000) return `${s}${(amount / 1_000).toFixed(1)}K`
  return `${s}${Math.round(amount)}`
}
function moneyFull(amount: number, c: string): string {
  try {
    return new Intl.NumberFormat('en', { style: 'currency', currency: c, maximumFractionDigits: 0 }).format(amount)
  } catch {
    return `${sym(c)}${amount.toLocaleString()}`
  }
}

// Static deck figures — used only as labelled fallbacks when the live
// metrics endpoint hasn't warmed up. Live always wins when non-zero.
const DECK = {
  artisans: 150,
  signupsMo: 10,
  ordersMo: 10,
  aov: 100,
  subscription: 18,
}

// ----- TEAM -----------------------------------------------------------------

type Hire = { role: string; geo: string }
const HIRES: Hire[] = [
  { role: 'Sales lead', geo: 'EU' },
  { role: 'Production ops', geo: 'IN · AU' },
  { role: 'Partnerships', geo: 'IN · AU' },
]

function Team() {
  return (
    <section className="kt-section" id="team">
      <div className="container">
        <div className="kt-section-head">
          <div className="kt-eyebrow">Who is building this</div>
          <h2 className="kt-display m">One founder. <em>A live platform.</em></h2>
        </div>
        <div
          className="grid grid-cols-1 md:grid-cols-2"
          style={{ border: '1px solid var(--rule)', marginTop: '8px' }}
        >
          <div style={{ padding: '48px 44px', background: 'var(--cream)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div className="kt-avatar lg" aria-hidden />
              <div>
                <div className="serif" style={{ fontSize: '34px', lineHeight: 1, letterSpacing: '-0.02em' }}>
                  Saransh Sharma
                </div>
                <div className="kt-meta" style={{ marginTop: '6px' }}>Founder &amp; CEO</div>
              </div>
            </div>
            <p className="kt-card-body" style={{ fontSize: '17px', lineHeight: 1.55 }}>
              Built and shipped the platform end to end — artisan onboarding, production ops, payments
              and delivery — while anchoring the first hub in Florence. The tools for custom clothing,
              by someone who had to build them to make his own.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {HIRES.map((h) => (
                <span key={h.role} className="kt-pill">
                  {h.role} · {h.geo}
                </span>
              ))}
            </div>
          </div>
          <div style={{ padding: '48px 44px', background: 'var(--ink-dark-bg)', color: 'var(--cream)', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '12px' }}>
            <div className="kt-eyebrow on-dark">Why it compounds</div>
            <p style={{ color: 'oklch(0.8 0.04 264)', lineHeight: 1.55, fontSize: '17px' }}>
              A two-sided marketplace spanning Europe, India and Australia lives or dies on the person
              holding the rails. The founder has shipped both sides already — supply onboarding and
              demand checkout — which is exactly the operating muscle a seed-stage board underwrites.
            </p>
            <div className="kt-meta" style={{ color: 'oklch(0.78 0.06 264)' }}>
              Next hires from this raise → sales + production ops
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ----- MARKET ---------------------------------------------------------------

function Market() {
  const { data: metrics } = useInvestorMetrics()
  const m = metrics ?? EMPTY_METRICS

  const paying = m.subscription.paying_artisans > 0 ? m.subscription.paying_artisans : DECK.artisans
  const mrr = m.subscription.mrr > 0 ? m.subscription.mrr : paying * DECK.subscription
  const ordersMo = m.orders.trailing_30d > 0 ? m.orders.trailing_30d : DECK.ordersMo
  const aov = m.aov.amount > 0 ? m.aov.amount : DECK.aov
  const gmvMo = ordersMo * aov
  const commissionMo = m.commission.trailing_30d > 0 ? m.commission.trailing_30d : 0
  const arrLive = m.arr.amount > 0 ? m.arr.amount : mrr * 12 + commissionMo * 12
  const arrIsEstimate = m.arr.amount <= 0

  return (
    <section className="kt-section" id="market">
      <div className="container">
        <div className="kt-section-head">
          <div className="kt-eyebrow">The opportunity</div>
          <h2 className="kt-display m">Custom is the fastest-growing segment <em>of a giant market.</em></h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4" style={{ marginTop: '8px' }}>
          <article className="kt-card">
            <div className="kt-meta" style={{ color: 'var(--accent-deep)', letterSpacing: '0.14em' }}>TAM</div>
            <div className="serif" style={{ fontSize: '72px', lineHeight: 1, margin: '12px 0 4px' }}>€1.7T</div>
            <p className="kt-card-body">Global apparel market — total consumer spend on clothing worldwide.</p>
            <div className="kt-meta" style={{ marginTop: '12px' }}>↗ 5% CAGR</div>
          </article>
          <article className="kt-card">
            <div className="kt-meta" style={{ color: 'var(--accent-deep)', letterSpacing: '0.14em' }}>SAM</div>
            <div className="serif" style={{ fontSize: '72px', lineHeight: 1, margin: '12px 0 4px' }}>€70B</div>
            <p className="kt-card-body">Custom &amp; made-to-measure — buyers paying a premium for fit and provenance.</p>
            <div className="kt-meta" style={{ marginTop: '12px' }}>↗ 8–10% CAGR</div>
          </article>
        </div>

        <div className="kt-card dark" style={{ marginTop: '24px', padding: '40px 44px' }}>
          <div className="kt-eyebrow on-dark">Bottom-up build · live</div>
          <h3 className="kt-display s" style={{ color: 'var(--cream)', marginTop: '12px' }}>
            Supply × demand, <em>on our rails</em>.
          </h3>
          <div
            className="grid grid-cols-1 sm:grid-cols-3"
            style={{ marginTop: '24px', gap: '0', border: '1px solid var(--rule-dark)' }}
          >
            <BottomUpTerm label="Artisan subscription" value={`${paying} × €${DECK.subscription}/mo`} result={moneyFull(mrr, 'EUR')} note="supply-side MRR" />
            <BottomUpTerm label="Orders × AOV" value={`${ordersMo} × ${money(aov, m.aov.currency)}`} result={moneyFull(gmvMo, m.aov.currency)} note="demand-side GMV / mo" />
            <BottomUpTerm label="Annualized run-rate" value="MRR + commission × 12" result={moneyFull(arrLive, m.arr.currency)} note={arrIsEstimate ? 'estimate — live ARR pending' : 'live'} />
          </div>
        </div>
      </div>
    </section>
  )
}

function BottomUpTerm({ label, value, result, note }: { label: string; value: string; result: string; note: string }) {
  return (
    <div style={{ padding: '24px 28px', borderRight: '1px solid var(--rule-dark)' }}>
      <div className="kt-meta" style={{ color: 'oklch(0.78 0.06 264)' }}>{label}</div>
      <div className="kt-card-body" style={{ marginTop: '10px', color: 'oklch(0.72 0.04 264)' }}>{value}</div>
      <div style={{ fontSize: '30px', fontWeight: 600, marginTop: '10px', color: 'var(--cream)' }}>{result}</div>
      <div className="kt-meta" style={{ marginTop: '4px', color: 'oklch(0.72 0.04 264)' }}>{note}</div>
    </div>
  )
}

// ----- TRACTION (both sides, live) ------------------------------------------

function Traction() {
  const { data: metrics } = useInvestorMetrics()
  const m = metrics ?? EMPTY_METRICS
  const live = m.orders.processed > 0 || m.commission.accrued > 0 || m.arr.amount > 0

  const artisans = m.artisans > 0 ? m.artisans : DECK.artisans
  const paying = m.subscription.paying_artisans > 0 ? m.subscription.paying_artisans : artisans
  const mrr = m.subscription.mrr > 0 ? m.subscription.mrr : paying * DECK.subscription

  const supply: Stat[] = [
    { num: String(artisans), label: 'Artisans onboarded', sub: 'EU · IN · AU', live: m.artisans > 0 },
    { num: String(paying), label: 'Paying artisans', sub: `@ €${DECK.subscription}/mo`, live: m.subscription.paying_artisans > 0 },
    { num: moneyFull(mrr, m.subscription.currency), label: 'Subscription MRR', sub: 'supply side', live: m.subscription.mrr > 0 },
    { num: String(DECK.signupsMo), unit: '/ mo', label: 'Inbound signups', sub: '~20% curation', live: false },
  ]

  const demand: Stat[] = [
    { num: m.orders.processed > 0 ? String(m.orders.processed) : '—', label: 'Orders processed', sub: m.orders.processed > 0 ? 'demand side, live' : 'live metric warming up', live: m.orders.processed > 0 },
    { num: m.gmv.amount > 0 ? moneyFull(m.gmv.amount, m.gmv.currency) : '—', label: 'GMV', sub: `trailing ${m.gmv.window_days}d`, live: m.gmv.amount > 0 },
    { num: m.commission.accrued > 0 ? moneyFull(m.commission.accrued, m.commission.currency) : '—', label: 'Commission accrued', sub: m.commission.accrued > 0 ? 'transaction revenue' : 'live metric warming up', live: m.commission.accrued > 0 },
    { num: m.arr.amount > 0 ? moneyFull(m.arr.amount, m.arr.currency) : '—', label: 'ARR', sub: m.arr.amount > 0 ? 'recurring + run-rate' : 'live metric warming up', live: m.arr.amount > 0 },
  ]

  return (
    <section className="kt-section flush" id="traction" style={{ background: 'var(--ink-dark-bg)' }}>
      <div className="container" style={{ paddingTop: '80px', paddingBottom: '80px' }}>
        <div className="kt-section-head">
          <div className="kt-eyebrow on-dark">Where we stand · live</div>
          <h2 className="kt-display m" style={{ color: 'var(--cream)' }}>
            Both sides of the market, <em>generating revenue.</em>
          </h2>
          <p className="lede" style={{ color: 'oklch(0.78 0.04 264)' }}>
            {live
              ? `Live from the platform${m.last_updated ? ` · updated ${new Date(m.last_updated).toLocaleDateString()}` : ''}.`
              : 'Live metrics warming up — this section refreshes from the production backend.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: '24px', marginTop: '24px' }}>
          <StatColumn title="Supply side · artisans" stats={supply} />
          <StatColumn title="Demand side · buyers" stats={demand} />
        </div>
      </div>
    </section>
  )
}

type Stat = { num: string; unit?: string; label: string; sub: string; live: boolean }
function StatColumn({ title, stats }: { title: string; stats: Stat[] }) {
  return (
    <div style={{ border: '1px solid var(--rule-dark)', borderRadius: 'var(--r-lg)', overflow: 'hidden' }}>
      <div className="kt-meta" style={{ padding: '16px 24px', borderBottom: '1px solid var(--rule-dark)', color: 'oklch(0.78 0.06 264)' }}>
        {title}
      </div>
      <div className="grid grid-cols-2" style={{ border: 0 }}>
        {stats.map((s, i) => (
          <div
            key={s.label}
            className="kt-stat dark"
            style={{
              border: 0,
              borderRight: i % 2 === 0 ? '1px solid var(--rule-dark)' : 'none',
              borderBottom: i < stats.length - 2 ? '1px solid var(--rule-dark)' : 'none',
            }}
          >
            <div>
              <div className="num">
                {s.num}
                {s.unit && <span className="unit">{s.unit}</span>}
              </div>
              <div className="lbl">{s.label}</div>
            </div>
            <div className="lbl" style={{ opacity: s.live ? 0.85 : 0.5 }}>{s.sub}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ----- ACQUISITION ----------------------------------------------------------

const CHANNELS: { n: string; title: string; body: string }[] = [
  { n: '01', title: 'Artisan referrals', body: 'Every onboarded maker brings their own buyers — organic, zero-CAC demand.' },
  { n: '02', title: 'Paid acquisition', body: 'Meta + Google, aimed at premium custom and made-to-measure intenders.' },
  { n: '03', title: 'Wholesale & brands', body: 'Maisons buy production capacity; their storefront traffic is demand we host.' },
  { n: '04', title: 'Brand storefronts', body: 'Partner stores on their own domains compound audience per artisan.' },
]

function Acquisition() {
  const { data: metrics } = useInvestorMetrics()
  const carts = metrics?.intent?.carts_30d ?? 0
  const visitors = metrics?.traffic?.unique_visitors_30d ?? 0
  const hasIntent = carts > 0 || visitors > 0

  return (
    <section className="kt-section" id="acquisition">
      <div className="container">
        <div className="kt-section-head">
          <div className="kt-eyebrow">How buyers find us</div>
          <h2 className="kt-display m">The demand side, <em>by design.</em></h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2" style={{ marginTop: '8px', gap: '24px' }}>
          <ul className="kt-list">
            {CHANNELS.map((c) => (
              <li key={c.n}>
                <span className="n">{c.n}</span>
                <div>
                  <b>{c.title}</b>
                  <span>{c.body}</span>
                </div>
              </li>
            ))}
          </ul>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="kt-card">
              <div className="kt-meta" style={{ color: 'var(--accent-deep)', letterSpacing: '0.14em' }}>LAST 30 DAYS</div>
              <div style={{ fontSize: '36px', fontWeight: 600, marginTop: '8px' }}>
                {hasIntent ? carts.toLocaleString() : '—'}
              </div>
              <div className="kt-card-body" style={{ marginTop: '4px' }}>shopping carts started across partner storefronts</div>
            </div>
            <div className="kt-card">
              <div className="kt-meta" style={{ color: 'var(--accent-deep)', letterSpacing: '0.14em' }}>LAST 30 DAYS</div>
              <div style={{ fontSize: '36px', fontWeight: 600, marginTop: '8px' }}>
                {hasIntent ? visitors.toLocaleString() : '—'}
              </div>
              <div className="kt-card-body" style={{ marginTop: '4px' }}>unique visitors to partner storefronts</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ----- ASK ------------------------------------------------------------------

const ALLOCATION: { name: string; pct: number }[] = [
  { name: 'Dedicated sales team', pct: 40 },
  { name: 'Artisan onboarding · EU · IN · AU', pct: 25 },
  { name: 'Paid acquisition & brand', pct: 25 },
  { name: 'Connect production hubs', pct: 10 },
]

const MILESTONES: { phase: string; goal: string }[] = [
  { phase: 'M0–3', goal: 'Hire 2 sales leads; instrument the funnel and CAC; onboard 30 artisans.' },
  { phase: 'M3–6', goal: '3+ brands live on storefronts; commission revenue live; first GMV milestone.' },
  { phase: 'M6–9', goal: '400 artisans; 10 brands; ARR target hit; two production hubs connected.' },
  { phase: 'M9–12', goal: 'Series-A ready — repeatable CAC, documented unit economics, refreshed data room.' },
]

function Ask() {
  const brand = useBrand()
  return (
    <section className="kt-section" id="ask">
      <div className="container">
        <div className="kt-section-head">
          <div className="kt-eyebrow">The ask</div>
          <h2 className="kt-display m">{brand.raise.amount} <em>with a spine.</em></h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2" style={{ marginTop: '8px', gap: '24px' }}>
          <div className="kt-card" style={{ padding: '32px' }}>
            <div className="kt-meta" style={{ color: 'var(--accent-deep)', letterSpacing: '0.14em' }}>
              USE OF FUNDS · 12 MONTHS
            </div>
            <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {ALLOCATION.map((a) => (
                <div key={a.name}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span className="kt-card-title" style={{ fontSize: '15px', margin: 0 }}>{a.name}</span>
                    <span className="kt-meta">{a.pct}%</span>
                  </div>
                  <div style={{ height: '8px', background: 'var(--bg-muted, #f6f5f0)', borderRadius: '999px', overflow: 'hidden' }}>
                    <div style={{ width: `${a.pct}%`, height: '100%', background: 'var(--accent-deep)' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="kt-card" style={{ padding: '32px' }}>
            <div className="kt-meta" style={{ color: 'var(--accent-deep)', letterSpacing: '0.14em' }}>
              12-MONTH PLAN
            </div>
            <ul className="kt-list" style={{ marginTop: '12px' }}>
              {MILESTONES.map((m) => (
                <li key={m.phase}>
                  <span className="n">{m.phase}</span>
                  <div>
                    <b style={{ fontSize: '15px' }}>{m.goal}</b>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2" style={{ marginTop: '24px', border: '1px solid var(--rule)' }}>
          <div style={{ padding: '48px 44px', background: 'var(--cream)' }}>
            <div className="kt-eyebrow">Want to talk?</div>
            <p className="kt-card-body" style={{ marginTop: '16px', maxWidth: '420px', lineHeight: 1.5 }}>
              Drop your email and we&apos;ll send the data room and a calendar link.
            </p>
          </div>
          <div style={{ padding: '48px 44px', background: 'var(--ink-dark-bg)' }}>
            <CaptureForm />
          </div>
        </div>
      </div>
    </section>
  )
}

// ----- HYPOTHESIS -----------------------------------------------------------

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

function Hypothesis() {
  return (
    <section className="kt-section" id="hypothesis">
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
      <div className="serif" style={{ fontSize: '56px', lineHeight: 1, margin: '12px 0 4px', letterSpacing: '-0.02em' }}>{p.name}</div>
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
      <div className="serif" style={{ fontSize: '56px', lineHeight: 1, margin: '12px 0 4px', letterSpacing: '-0.02em', color: 'var(--cream)' }}>{p.name}</div>
      <div style={{ color: 'oklch(0.8 0.04 264)', marginBottom: '24px', fontSize: '16px' }}>{p.sub}</div>
      <ul className="kt-list">
        {p.items.map((it) => (
          <li key={it.n} style={{ borderBottomColor: 'oklch(0.28 0.03 264)' }}>
            <span className="n" style={{ color: 'oklch(0.78 0.06 264)' }}>{it.n}</span>
            <div>
              <b style={{ color: 'var(--cream)' }}>{it.bold}</b>
              <span style={{ color: 'oklch(0.72 0.04 264)' }}>{it.body}</span>
            </div>
          </li>
        ))}
      </ul>
      <div style={{ marginTop: 'auto', paddingTop: '24px', borderTop: '2px solid var(--cream)', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '20px' }}>
        <div className="serif" style={{ fontSize: '48px', lineHeight: 0.95, color: 'var(--cream)' }}>{p.metric}</div>
        <div className="kt-meta" style={{ textAlign: 'right', maxWidth: '220px', lineHeight: 1.4, color: 'oklch(0.72 0.04 264)' }}>{p.caption}</div>
      </div>
    </div>
  )
}

// ----- CAPTURE FORM ---------------------------------------------------------

function CaptureForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<{ kind: 'idle' | 'sending' | 'ok' | 'err'; msg?: string }>({ kind: 'idle' })

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (status.kind === 'sending') return
    setStatus({ kind: 'sending' })
    try {
      const res = await fetch('/api/intro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, fund: 'pitch-page' }),
      })
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null
        setStatus({ kind: 'err', msg: data?.error || 'Something went wrong.' })
        return
      }
      setStatus({ kind: 'ok', msg: 'Thanks. Data room incoming.' })
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
        : 'oklch(0.72 0.04 264)'

  return (
    <>
      <form className="kt-inline-form" onSubmit={onSubmit}>
        <input
          className="kt-input"
          type="email"
          name="email"
          placeholder="you@fund.com"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status.kind === 'sending'}
          style={{ background: 'transparent', borderColor: 'oklch(0.38 0.03 264)', color: 'var(--cream)' }}
        />
        <Button type="submit" isLoading={status.kind === 'sending'}>Send →</Button>
      </form>
      <p className="kt-meta" style={{ marginTop: '14px', color: statusColor, minHeight: '18px' }}>
        {status.msg || 'Data room + calendar link, no drip.'}
      </p>
    </>
  )
}

// ----- ROOT -----------------------------------------------------------------

export default function InvestorsPage() {
  const brand = useBrand()
  return (
    <main>
      <Navbar />

      <section className="kt-section flush" style={{ background: 'var(--ink-dark-bg)' }}>
        <div className="container" style={{ paddingTop: '72px', paddingBottom: '72px' }}>
          <div className="kt-eyebrow on-dark">Investor pitch · live data</div>
          <h1 className="kt-display l" style={{ color: 'var(--cream)', marginTop: '16px', maxWidth: '820px' }}>
            {brand.tagline}
          </h1>
          <div className="kt-meta" style={{ color: 'oklch(0.78 0.06 264)', marginTop: '24px' }}>
            Saransh Sharma · Founder — {brand.raise.round} round · {brand.raise.year}
          </div>
          <div style={{ marginTop: '40px', display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
            <Button asChild>
              <Link href="#ask">Request the data room →</Link>
            </Button>
            <Link className="kt-link" href="#traction" style={{ color: 'var(--cream)' }}>
              See live traction
            </Link>
          </div>
        </div>
      </section>

      <Team />
      <Market />
      <Traction />
      <Acquisition />
      <Hypothesis />
      <Ask />

      <section className="kt-section flush">
        <div className="container" style={{ paddingTop: '40px', paddingBottom: '80px' }}>
          <div className="kt-meta">
            Kind Thread · {brand.seo.domain} · {brand.emails.founder}
          </div>
        </div>
      </section>
    </main>
  )
}