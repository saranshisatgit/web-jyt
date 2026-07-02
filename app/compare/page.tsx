import type { Metadata } from 'next'
import Link from 'next/link'
import { headers } from 'next/headers'
import { Navbar } from '@/components/navbar'
import { HeroArt } from '@/components/hero-art'
import { FeaturedMockup } from '@/components/solution-block'
import { getPageContent } from '@/lib/page-content'
import { DEFAULT_LOCALE } from '@/lib/i18n/config'

export const metadata: Metadata = {
  title: 'Compare — vs wholesale, PLM & provenance tools',
  description:
    'Wholesale platforms only sell. PLMs only design. Provenance tools only track. Run design → produce → supply → sell on a single connected rail.',
}

type Mark = 'yes' | 'no' | 'partial'

function Cell({ v, highlight }: { v: string; highlight?: boolean }) {
  const mark = v as Mark
  const glyph = mark === 'yes' ? '✓' : mark === 'partial' ? '◑' : '–'
  const color =
    mark === 'yes'
      ? 'var(--accent-deep)'
      : mark === 'partial'
        ? 'var(--ink-mute)'
        : 'var(--rule)'
  return (
    <td
      style={{
        textAlign: 'center',
        padding: '14px 12px',
        borderTop: '1px solid var(--rule-soft)',
        background: highlight ? 'var(--accent-pale)' : undefined,
        fontSize: 18,
        color,
        fontWeight: mark === 'yes' ? 600 : 400,
      }}
    >
      {glyph}
    </td>
  )
}

const th: React.CSSProperties = {
  textAlign: 'center',
  padding: '12px',
  fontFamily: 'var(--font-mono)',
  fontSize: 11,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  color: 'var(--ink-soft)',
  whiteSpace: 'nowrap',
}
const thHi: React.CSSProperties = { ...th, color: 'var(--accent-deep)', background: 'var(--accent-pale)', borderTopLeftRadius: 'var(--r-md)', borderTopRightRadius: 'var(--r-md)' }
const featTd: React.CSSProperties = { padding: '14px 16px 14px 0', borderTop: '1px solid var(--rule-soft)', fontSize: 14, color: 'var(--ink)', minWidth: 220 }

export default async function ComparePage() {
  const h = await headers()
  const locale = h.get('x-locale') || DEFAULT_LOCALE
  const compare = await getPageContent('compare', locale) as any
  const { hero, lifecycle, comparison, pricing, differentiators, cta } = compare
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
            <Link className="kt-btn" href={hero.primaryCta.href}>{hero.primaryCta.label}</Link>
            <Link className="kt-link" href={hero.secondaryCta.href}>{hero.secondaryCta.label}</Link>
          </div>
          <div style={{ marginTop: '56px', maxWidth: '560px' }}>
            <FeaturedMockup />
          </div>
        </div>
      </section>

      {/* Lifecycle coverage */}
      <section className="kt-section">
        <div className="container">
          <div className="kt-section-head">
            <div className="kt-eyebrow">{lifecycle.eyebrow}</div>
            <h2 className="kt-display m">{lifecycle.title}</h2>
          </div>
          <p className="muted" style={{ maxWidth: '680px' }}>{lifecycle.subtitle}</p>
          <div style={{ overflowX: 'auto', marginTop: '32px' }}>
            <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 640 }}>
              <thead>
                <tr>
                  <th style={{ ...th, textAlign: 'left' }} />
                  {(lifecycle.stages as string[]).map((s) => (<th key={s} style={th}>{s}</th>))}
                  <th style={{ ...th, textAlign: 'left' }} />
                </tr>
              </thead>
              <tbody>
                {(lifecycle.rows as any[]).map((r) => (
                  <tr key={r.name}>
                    <td style={{ padding: '14px 16px 14px 0', borderTop: '1px solid var(--rule-soft)', fontWeight: r.highlight ? 600 : 500, color: r.highlight ? 'var(--accent-deep)' : 'var(--ink)', whiteSpace: 'nowrap' }}>
                      {r.name}
                    </td>
                    {(r.coverage as any[]).map((v, i) => (<Cell key={i} v={v} highlight={r.highlight} />))}
                    <td style={{ padding: '14px 0 14px 16px', borderTop: '1px solid var(--rule-soft)', fontSize: 13, color: 'var(--ink-mute)', whiteSpace: 'nowrap' }}>{r.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Feature comparison */}
      <section className="kt-section">
        <div className="container">
          <div className="kt-section-head">
            <div className="kt-eyebrow">{comparison.eyebrow}</div>
            <h2 className="kt-display m">{comparison.title}</h2>
          </div>
          <div style={{ overflowX: 'auto', marginTop: '32px' }}>
            <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 720 }}>
              <thead>
                <tr>
                  <th style={{ ...th, textAlign: 'left' }} />
                  {(comparison.columns as string[]).map((c, i) => (<th key={c} style={i === 0 ? thHi : th}>{c}</th>))}
                </tr>
              </thead>
              <tbody>
                {(comparison.rows as any[]).map((row) => (
                  <tr key={row.feature}>
                    <td style={featTd}>{row.feature}</td>
                    {(row.values as any[]).map((v, i) => (<Cell key={i} v={v} highlight={i === 0} />))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Pricing posture */}
      <section className="kt-section">
        <div className="container">
          <div className="kt-section-head">
            <div className="kt-eyebrow">{pricing.eyebrow}</div>
            <h2 className="kt-display m">{pricing.title}</h2>
          </div>
          <p className="muted" style={{ maxWidth: '720px' }}>{pricing.subtitle}</p>
          <div style={{ overflowX: 'auto', marginTop: '32px' }}>
            <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 640 }}>
              <thead>
                <tr>
                  {['', 'Model', 'Public price', ''].map((h, i) => (<th key={i} style={{ ...th, textAlign: i === 0 ? 'left' : i === 3 ? 'left' : 'center' }}>{h}</th>))}
                </tr>
              </thead>
              <tbody>
                {(pricing.rows as any[]).map((r) => (
                  <tr key={r.name} style={r.highlight ? { background: 'var(--accent-pale)' } : undefined}>
                    <td style={{ padding: '14px 16px', borderTop: '1px solid var(--rule-soft)', fontWeight: r.highlight ? 600 : 500, color: r.highlight ? 'var(--accent-deep)' : 'var(--ink)', whiteSpace: 'nowrap' }}>{r.name}</td>
                    <td style={{ padding: '14px 12px', borderTop: '1px solid var(--rule-soft)', textAlign: 'center', fontSize: 13, color: 'var(--ink-soft)' }}>{r.model}</td>
                    <td style={{ padding: '14px 12px', borderTop: '1px solid var(--rule-soft)', textAlign: 'center', fontSize: 13, fontWeight: 500, color: r.highlight ? 'var(--accent-deep)' : 'var(--ink)' }}>{r.price}</td>
                    <td style={{ padding: '14px 16px', borderTop: '1px solid var(--rule-soft)', fontSize: 13, color: 'var(--ink-mute)' }}>{r.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Differentiators */}
      <section className="kt-section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
            {(differentiators as any[]).map((d) => (
              <div className="kt-card" key={d.title}>
                <div className="kt-meta" style={{ color: 'var(--accent-deep)' }}>{d.title}</div>
                <p className="muted" style={{ marginTop: '10px', lineHeight: 1.55 }}>{d.body}</p>
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
