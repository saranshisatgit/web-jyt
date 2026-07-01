'use client'

import { useEffect, useState } from 'react'
import { Navbar } from '@/components/navbar'

type Field = { key: string; label: string; value: string }
type Section = { heading: string; fields: Field[] }
type RegionData = { label: string; sections: Record<string, Section> }
type CompanyData = Record<string, RegionData>

const REGIONS = [
  { id: 'india', label: 'India' },
  { id: 'eu', label: 'European Union' },
]

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {}
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="kt-btn ghost"
      style={{ padding: '4px 12px', fontSize: 12, minWidth: 64, justifyContent: 'center' }}
    >
      {copied ? 'Copied' : 'Copy'}
    </button>
  )
}

function FieldRow({ field }: { field: Field }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '10px 0',
        borderBottom: '1px solid var(--rule-soft)',
      }}
    >
      <span style={{ flex: '0 0 240px', fontSize: 14, color: 'var(--ink-mute)' }}>
        {field.label}
      </span>
      <code
        style={{
          flex: 1,
          fontFamily: 'var(--font-mono)',
          fontSize: 13,
          color: 'var(--ink)',
          wordBreak: 'break-all',
        }}
      >
        {field.value}
      </code>
      <CopyButton text={field.value} />
    </div>
  )
}

function SectionCard({ section }: { section: Section }) {
  return (
    <div
      className="kt-card"
      style={{ padding: '24px 28px', marginTop: 20 }}
    >
      <h3
        className="kt-display s"
        style={{ fontSize: 16, marginBottom: 4, color: 'var(--accent-deep)' }}
      >
        {section.heading}
      </h3>
      <div style={{ marginTop: 4 }}>
        {section.fields.map((f) => (
          <FieldRow key={f.key} field={f} />
        ))}
      </div>
    </div>
  )
}

export default function CompanyPage() {
  const [data, setData] = useState<CompanyData | null>(null)
  const [region, setRegion] = useState<string>('india')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch('/api/company')
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const regionData = data?.[region]

  return (
    <main>
      <Navbar />

      <section className="kt-hero relative isolate" style={{ background: 'var(--bg-soft)' }}>
        <div className="container kt-hero-content" style={{ paddingBottom: 0 }}>
          <div className="kt-eyebrow">Legal</div>
          <h1 className="kt-display l" style={{ marginTop: '16px' }}>
            Company & Compliance
          </h1>
          <p
            className="muted"
            style={{
              fontSize: '19px',
              lineHeight: 1.55,
              marginTop: '20px',
              maxWidth: '640px',
            }}
          >
            Regulatory and tax registration details for JYT entities across
            jurisdictions. Use the copy button to grab any value for compliance
            filings.
          </p>
        </div>
      </section>

      <section className="kt-section">
        <div className="container">
          {/* Region selector */}
          <div
            style={{
              display: 'inline-flex',
              gap: 4,
              padding: 4,
              borderRadius: 'var(--r-md)',
              background: 'var(--bg-soft)',
              border: '1px solid var(--rule-soft)',
            }}
          >
            {REGIONS.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setRegion(r.id)}
                style={{
                  padding: '8px 20px',
                  borderRadius: 'calc(var(--r-md) - 3px)',
                  border: 'none',
                  background: region === r.id ? 'var(--bg)' : 'transparent',
                  color: region === r.id ? 'var(--ink)' : 'var(--ink-mute)',
                  fontWeight: region === r.id ? 600 : 400,
                  fontSize: 14,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  boxShadow: region === r.id ? '0 1px 3px oklch(0 0 0 / 0.08)' : 'none',
                }}
              >
                {r.label}
              </button>
            ))}
          </div>

          {/* Content */}
          {loading && (
            <p className="muted" style={{ marginTop: 32, fontSize: 14 }}>
              Loading company data…
            </p>
          )}

          {!loading && regionData && (
            <div style={{ marginTop: 24 }}>
              {Object.values(regionData.sections).map((section) => (
                <SectionCard key={section.heading} section={section} />
              ))}
            </div>
          )}

          {!loading && !regionData && (
            <p className="muted" style={{ marginTop: 32, fontSize: 14 }}>
              Could not load company data.
            </p>
          )}
        </div>
      </section>

      <section className="kt-section">
        <div className="container" style={{ textAlign: 'center' }}>
          <p
            className="muted"
            style={{ fontSize: 13, maxWidth: 520, margin: '0 auto', lineHeight: 1.6 }}
          >
            Information provided for compliance and verification purposes only.
            For official copies, please contact{' '}
            <a
              href="mailto:legal@jaalyantra.com"
              style={{ color: 'var(--accent-deep)' }}
            >
              legal@jaalyantra.com
            </a>
            .
          </p>
        </div>
      </section>
    </main>
  )
}
