'use client'

import { useState } from 'react'
import { Button } from '@medusajs/ui'
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
    <Button
      type="button"
      variant="secondary"
      onClick={copy}
      style={{ minWidth: 64 }}
    >
      {copied ? 'Copied' : 'Copy'}
    </Button>
  )
}

function FieldRow({ field }: { field: Field }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3 py-2.5 border-b border-[var(--rule-soft)]">
      <span className="md:flex-[0_0_240px] text-sm text-[var(--ink-mute)]">
        {field.label}
      </span>
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <code className="flex-1 font-mono text-xs md:text-[13px] text-[var(--ink)] break-all">
          {field.value}
        </code>
        <CopyButton text={field.value} />
      </div>
    </div>
  )
}

function SectionCard({ section }: { section: SectionData }) {
  return (
    <div className="kt-card p-4 sm:p-6 md:p-7 mt-5">
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
        <div className="inline-flex flex-wrap gap-1 p-1 rounded-[var(--r-md)] bg-[var(--bg-soft)] border border-[var(--rule-soft)]">
          {REGIONS.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => setRegion(r.id)}
              className="px-4 sm:px-5 py-2 text-sm cursor-pointer transition-all duration-150"
              style={{
                borderRadius: 'calc(var(--r-md) - 3px)',
                border: 'none',
                background: region === r.id ? 'var(--bg)' : 'transparent',
                color: region === r.id ? 'var(--ink)' : 'var(--ink-mute)',
                fontWeight: region === r.id ? 600 : 400,
                boxShadow: region === r.id ? '0 1px 3px oklch(0 0 0 / 0.08)' : 'none',
              }}
            >
              {r.label}
            </button>
          ))}
        </div>

        {regionData ? (
          <div className="mt-6">
            {Object.values(regionData.sections).map((section) => (
              <SectionCard key={section.heading} section={section} />
            ))}
          </div>
        ) : regions ? null : (
          <p className="muted" style={{ marginTop: 32, fontSize: 14 }}>
            Could not load company data.
          </p>
        )}

        <div className="text-center mt-10 md:mt-12">
          <p
            className="muted text-xs md:text-[13px] max-w-[520px] mx-auto leading-relaxed"
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
