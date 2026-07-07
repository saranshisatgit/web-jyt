'use client'

import React from 'react'
import { Button } from '@medusajs/ui'
import { Navbar } from '@/components/navbar'
import { CheckIcon, MinusIcon } from '@heroicons/react/16/solid'
import { useCurrency } from '@/app/context/currency-context'
import { formatPrice, CURRENCIES } from '@/lib/currency'

type FeatureValue = boolean | string

type Feature = {
  section: string
  name: string
  value: FeatureValue
}

type Tier = {
  name: string
  slug: string
  description: string
  // Anchor monthly price in INR. The featured "Professional" tier is the
  // real subscription cost (₹2000). Other tiers scale around it. Display
  // converts to the visitor's currency via lib/currency.
  priceMonthlyInr: number
  highlights: string[]
  featured?: boolean
  features: Feature[]
}

const TIERS: Tier[] = [
  {
    name: 'Marketplace',
    slug: 'marketplace',
    description: 'For artisans selling handcrafted pieces directly.',
    priceMonthlyInr: 999,
    highlights: [
      'Customers through our marketplace',
      'Checkout & payment integrations',
      'Modern storefront, no setup',
      'Basic inventory tracking',
    ],
    features: [
      { section: 'Commerce', name: 'Customer acquisition', value: true },
      { section: 'Commerce', name: 'Payment integrations', value: 'Stripe, PayPal' },
      { section: 'Commerce', name: 'Product listings', value: 'Up to 50' },
      { section: 'Commerce', name: 'Storefront customization', value: 'Basic' },
      { section: 'Inventory', name: 'Tracking', value: 'Basic' },
      { section: 'Inventory', name: 'Sourcing tracking', value: false },
      { section: 'Inventory', name: 'Partner network', value: false },
      { section: 'Design', name: 'Design platform', value: false },
      { section: 'Design', name: 'Production network', value: false },
      { section: 'Support', name: 'Email support', value: true },
      { section: 'Support', name: 'Priority support', value: false },
    ],
  },
  {
    name: 'Professional',
    slug: 'professional',
    description: 'For growing brands shipping with advanced ops.',
    priceMonthlyInr: 2000,
    featured: true,
    highlights: [
      'Everything in Marketplace',
      'Full sourced inventory tracking',
      'Advanced analytics',
      'Multi-channel selling',
      'Priority support',
    ],
    features: [
      { section: 'Commerce', name: 'Customer acquisition', value: true },
      { section: 'Commerce', name: 'Payment integrations', value: 'All major' },
      { section: 'Commerce', name: 'Product listings', value: 'Up to 500' },
      { section: 'Commerce', name: 'Storefront customization', value: 'Advanced' },
      { section: 'Inventory', name: 'Tracking', value: 'Advanced' },
      { section: 'Inventory', name: 'Sourcing tracking', value: 'Full' },
      { section: 'Inventory', name: 'Partner network', value: 'Limited' },
      { section: 'Design', name: 'Design platform', value: false },
      { section: 'Design', name: 'Production network', value: false },
      { section: 'Support', name: 'Email support', value: true },
      { section: 'Support', name: 'Priority support', value: true },
    ],
  },
  {
    name: 'Designer',
    slug: 'designer',
    description: 'End-to-end production OS for textile creators.',
    priceMonthlyInr: 6000,
    highlights: [
      'Everything in Professional',
      'End-to-end design platform',
      'Full partner production network',
      'Manufacturing coordination',
      'Dedicated account manager',
    ],
    features: [
      { section: 'Commerce', name: 'Customer acquisition', value: true },
      { section: 'Commerce', name: 'Payment integrations', value: 'All major' },
      { section: 'Commerce', name: 'Product listings', value: 'Unlimited' },
      { section: 'Commerce', name: 'Storefront customization', value: 'Full custom' },
      { section: 'Inventory', name: 'Tracking', value: 'Enterprise' },
      { section: 'Inventory', name: 'Sourcing tracking', value: 'Full' },
      { section: 'Inventory', name: 'Partner network', value: 'Full' },
      { section: 'Design', name: 'Design platform', value: 'Full' },
      { section: 'Design', name: 'Production network', value: 'Full' },
      { section: 'Support', name: 'Email support', value: true },
      { section: 'Support', name: 'Priority support', value: true },
    ],
  },
]

const FAQ: { q: string; a: string }[] = [
  {
    q: 'Can I switch tiers later?',
    a: 'Yes — upgrade or downgrade any time from the admin. We pro-rate the difference.',
  },
  {
    q: 'Do you take a cut of marketplace sales?',
    a: 'Marketplace plan: 3% transaction fee on top of the subscription. Professional and Designer: zero transaction cut.',
  },
  {
    q: 'What if I outgrow Designer?',
    a: 'We have an Enterprise tier with custom workflow, white-glove onboarding, and on-prem options. Talk to us.',
  },
  {
    q: 'Is there a free trial?',
    a: 'Marketplace and Professional both have a 14-day free trial. Designer is by invite — book a demo.',
  },
  {
    q: 'How does billing work?',
    a: 'Monthly or annual. Annual gets you 2 months free. We bill in INR, USD, EUR, GBP, and AUD — your prices above are shown in your local currency automatically.',
  },
]

const SECTIONS_ORDER = ['Commerce', 'Inventory', 'Design', 'Support'] as const

export default function Pricing() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Tiers />
      <Compare />
      <Faq />
    </main>
  )
}

function Hero() {
  const currency = useCurrency()
  // Build a "Yours · others" list so the visitor sees their currency first.
  const others = Object.values(CURRENCIES)
    .filter((c) => c.code !== currency.code)
    .map((c) => c.code)
    .join(' · ')
  return (
    <section className="kt-hero">
      <div className="container">
        <div className="kt-hero-grid">
          <div>
            <span className="kt-eyebrow">
              <span className="dot" aria-hidden />
              Pricing
            </span>
            <h1 className="kt-display xl" style={{ marginTop: '32px', marginBottom: '24px' }}>
              Pricing built for <em>ateliers and brands</em>.
            </h1>
            <p
              className="muted"
              style={{ fontSize: '21px', maxWidth: '680px', lineHeight: 1.45, margin: 0 }}
            >
              Start at the marketplace. Grow into a full production OS as you ship more. Switch tiers
              whenever you outgrow one.
            </p>
          </div>
          <aside className="kt-hero-side">
            <div className="row"><span className="k">Plans</span><span className="v">3</span></div>
            <div className="row"><span className="k">Yours</span><span className="v">{currency.symbol} {currency.code}</span></div>
            <div className="row"><span className="k">Also</span><span className="v" style={{ fontSize: '14px', fontFamily: 'var(--font-mono)' }}>{others}</span></div>
            <div className="row"><span className="k">Trial</span><span className="v">14 days</span></div>
          </aside>
        </div>
      </div>
    </section>
  )
}

function Tiers() {
  const currency = useCurrency()
  return (
    <section className="kt-section" id="tiers">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TIERS.map((tier) => (
            <article
              key={tier.slug}
              className={`kt-card${tier.featured ? ' accent' : ''}`}
              style={tier.featured ? undefined : { background: 'var(--cream)' }}
            >
              <div className="kt-meta" style={{ color: 'var(--accent-deep)', letterSpacing: '0.14em' }}>
                {tier.name}
              </div>
              <div
                className="serif"
                style={{
                  fontSize: '72px',
                  lineHeight: 0.95,
                  letterSpacing: '-0.02em',
                  margin: '16px 0 8px',
                }}
              >
                {formatPrice(tier.priceMonthlyInr, currency)}
                <span style={{ fontSize: '18px', color: 'var(--ink-soft)', fontFamily: 'var(--font-sans)', marginLeft: '8px' }}>
                  / mo
                </span>
              </div>
              <p className="muted" style={{ fontSize: '15px', margin: '0 0 24px' }}>
                {tier.description}
              </p>
              <ul className="kt-dash-list" style={{ marginBottom: '32px' }}>
                {tier.highlights.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
              <Button asChild variant={tier.featured ? 'primary' : 'secondary'}>
                <a href="/contact" style={{ marginTop: 'auto' }}>
                  {tier.featured ? 'Start free trial' : 'Talk to us'}
                </a>
              </Button>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function Compare() {
  return (
    <section className="kt-section" id="compare">
      <div className="container">
        <div className="kt-section-head">
          <div className="kt-eyebrow">Side by side</div>
          <h2 className="kt-display m">Every feature, <em>every tier</em>.</h2>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '720px' }}>
            <thead>
              <tr>
                <th style={cellStyle({ head: true, first: true })}> </th>
                {TIERS.map((t) => (
                  <th key={t.slug} style={cellStyle({ head: true })}>
                    <span className="kt-meta" style={{ color: 'var(--ink)' }}>{t.name}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SECTIONS_ORDER.map((section) => {
                const rows = TIERS[0].features.filter((f) => f.section === section)
                return (
                  <React.Fragment key={section}>
                    <tr>
                      <td colSpan={TIERS.length + 1} style={sectionRowStyle}>
                        {section}
                      </td>
                    </tr>
                    {rows.map((row) => (
                      <tr key={`${section}-${row.name}`}>
                        <td style={cellStyle({ first: true })}>{row.name}</td>
                        {TIERS.map((t) => {
                          const f = t.features.find((x) => x.section === section && x.name === row.name)
                          return (
                            <td key={`${t.slug}-${row.name}`} style={cellStyle()}>
                              <FeatureCell value={f?.value} />
                            </td>
                          )
                        })}
                      </tr>
                    ))}
                  </React.Fragment>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

function FeatureCell({ value }: { value: FeatureValue | undefined }) {
  if (value === undefined || value === false) {
    return <MinusIcon className="size-4" style={{ color: 'var(--ink-mute)', display: 'inline-block' }} />
  }
  if (value === true) {
    return <CheckIcon className="size-4" style={{ color: 'var(--accent-deep)', display: 'inline-block' }} />
  }
  return (
    <span className="muted" style={{ fontSize: '14px' }}>
      {value}
    </span>
  )
}

const cellStyle = (opts: { head?: boolean; first?: boolean } = {}): React.CSSProperties => ({
  padding: '16px 20px',
  textAlign: opts.first ? 'left' : 'center',
  borderBottom: '1px solid var(--rule-soft)',
  verticalAlign: 'middle',
  fontSize: '15px',
  ...(opts.head ? { borderBottom: '2px solid var(--ink)', paddingBottom: '20px' } : {}),
})

const sectionRowStyle: React.CSSProperties = {
  padding: '20px 0 8px',
  fontFamily: 'var(--font-mono)',
  fontSize: '11px',
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  color: 'var(--accent-deep)',
  borderTop: '1px solid var(--rule)',
  borderBottom: 'none',
}

function Faq() {
  return (
    <section className="kt-section" id="faq">
      <div className="container">
        <div className="kt-section-head">
          <div className="kt-eyebrow">Things people ask</div>
          <h2 className="kt-display m">Common <em>questions</em>.</h2>
        </div>
        <ul className="kt-list" style={{ maxWidth: '880px' }}>
          {FAQ.map((item, i) => (
            <li key={item.q}>
              <span className="n">{String(i + 1).padStart(2, '0')}</span>
              <div>
                <b style={{ fontSize: '19px' }}>{item.q}</b>
                <span style={{ fontSize: '16px', lineHeight: 1.55 }}>{item.a}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
