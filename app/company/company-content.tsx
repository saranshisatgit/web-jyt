'use client'

import { useState } from 'react'
import { useBrand } from '@/app/context/brand-context'

interface Field {
  key: string
  label: string
  value: string
}

interface SectionData {
  heading: string
  fields: Field[]
}

interface RegionData {
  label: string
  sections: Record<string, SectionData>
}

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

function SectionCard({ section }: { section: SectionData }) {
  return (
    <div className="kt-card" style={{ padding: '24px 28px', marginTop: 20 }}>
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

export default function CompanyContent({ regions }: { regions?: Record<string, RegionData> }) {
  const brand = useBrand()
  const [region, setRegion] = useState<string>('india')
  const regionData = regions?.[region]

  return (
    <section className="kt-section">
      <div className="container">
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

        {regionData ? (
          <div style={{ marginTop: 24 }}>
            {Object.values(regionData.sections).map((section) => (
              <SectionCard key={section.heading} section={section} />
            ))}
          </div>
        ) : regions ? null : (
          <p className="muted" style={{ marginTop: 32, fontSize: 14 }}>
            Could not load company data.
          </p>
        )}

        <div style={{ textAlign: 'center', marginTop: 48 }}>
          <p
            className="muted"
            style={{ fontSize: 13, maxWidth: 520, margin: '0 auto', lineHeight: 1.6 }}
          >
            Information provided for compliance and verification purposes only.
            For official copies, please contact{' '}
            <a href={`mailto:${brand.emails.primary}`} style={{ color: 'var(--accent-deep)' }}>
              {brand.emails.primary}
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  )
}
