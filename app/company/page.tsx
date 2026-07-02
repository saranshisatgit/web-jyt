import { Suspense } from 'react'
import { headers } from 'next/headers'
import { Navbar } from '@/components/navbar'
import { HeroArt } from '@/components/hero-art'
import { SectionLoading } from '@/components/section-loading'
import { fetchPagefromAPI } from '@/app/actions'
import { getBlockByName } from '@/medu/queries'
import { DEFAULT_LOCALE } from '@/lib/i18n/config'
import { t } from '@/lib/i18n/blocks'
import CompanyContent from './company-content'

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

interface CompanyDataBlockContent extends Record<string, unknown> {
  regions: Record<string, RegionData>
}

export default async function CompanyPage() {
  const h = await headers()
  const locale = h.get('x-locale') || DEFAULT_LOCALE

  const page = await fetchPagefromAPI('company')

  const headerBlock = getBlockByName(page?.blocks ?? [], 'Header')
  const companyBlock = getBlockByName(page?.blocks ?? [], 'CompanyData')

  const company = companyBlock?.content as unknown as CompanyDataBlockContent | undefined

  const title = t(headerBlock?.content as Record<string, unknown>, 'title', locale)
  const subtitle = t(headerBlock?.content as Record<string, unknown>, 'subtitle', locale)

  const regions = resolveCompanyRegions(company, locale)

  return (
    <main>
      <Navbar />
      <Suspense fallback={<SectionLoading />}>
        <CompanyHero title={title} subtitle={subtitle} />
      </Suspense>
      <Suspense fallback={<SectionLoading />}>
        <CompanyContent regions={regions} />
      </Suspense>
    </main>
  )
}

function resolveCompanyRegions(
  content: CompanyDataBlockContent | undefined,
  locale: string
): Record<string, RegionData> | undefined {
  if (!content?.regions) return undefined

  const raw = content as unknown as Record<string, unknown>
  const regionsI18n = raw.regions_i18n as Record<string, Record<string, { label?: string }>> | undefined
  const sectionsI18n = raw.sections_i18n as Record<string, Record<string, { heading?: string }>> | undefined
  const fieldsI18n = raw.fields_i18n as Record<string, Record<string, { label?: string }>> | undefined

  const resolved: Record<string, RegionData> = {}

  for (const [regionKey, region] of Object.entries(content.regions)) {
    resolved[regionKey] = {
      label: regionsI18n?.[locale]?.[regionKey]?.label ?? region.label,
      sections: {},
    }

    for (const [sectionKey, section] of Object.entries(region.sections)) {
      resolved[regionKey].sections[sectionKey] = {
        heading: sectionsI18n?.[locale]?.[sectionKey]?.heading ?? section.heading,
        fields: section.fields.map((field) => ({
          ...field,
          label: fieldsI18n?.[locale]?.[field.key]?.label ?? field.label,
        })),
      }
    }
  }

  return resolved
}

function CompanyHero({ title, subtitle }: { title?: string; subtitle?: string }) {
  return (
    <section className="kt-hero relative isolate">
      <HeroArt />
      <div className="container kt-hero-content" style={{ paddingBottom: 0 }}>
        <div className="kt-eyebrow">Legal</div>
        <h1 className="kt-display l" style={{ marginTop: '16px' }}>
          {title ?? 'Company & Compliance'}
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
          {subtitle}
        </p>
      </div>
    </section>
  )
}
