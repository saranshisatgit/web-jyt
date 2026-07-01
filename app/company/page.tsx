import { Suspense } from 'react'
import { Navbar } from '@/components/navbar'
import { HeroArt } from '@/components/hero-art'
import { SectionLoading } from '@/components/section-loading'
import { fetchPagefromAPI } from '@/app/actions'
import { getBlockByName } from '@/medu/queries'
import CompanyContent from './company-content'

interface HeaderBlockContent {
  title: string
  subtitle: string
}

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

interface CompanyDataBlockContent {
  regions: Record<string, RegionData>
}

export default async function CompanyPage() {
  const page = await fetchPagefromAPI('company')

  const headerBlock = getBlockByName(page?.blocks ?? [], 'Header')
  const companyBlock = getBlockByName(page?.blocks ?? [], 'CompanyData')

  const header = headerBlock?.content as unknown as HeaderBlockContent | undefined
  const company = companyBlock?.content as unknown as CompanyDataBlockContent | undefined

  return (
    <main>
      <Navbar />
      <Suspense fallback={<SectionLoading />}>
        <CompanyHero header={header} />
      </Suspense>
      <Suspense fallback={<SectionLoading />}>
        <CompanyContent regions={company?.regions} />
      </Suspense>
    </main>
  )
}

function CompanyHero({ header }: { header?: HeaderBlockContent }) {
  return (
    <section className="kt-hero relative isolate">
      <HeroArt />
      <div className="container kt-hero-content" style={{ paddingBottom: 0 }}>
        <div className="kt-eyebrow">Legal</div>
        <h1 className="kt-display l" style={{ marginTop: '16px' }}>
          {header?.title ?? 'Company & Compliance'}
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
          {header?.subtitle}
        </p>
      </div>
    </section>
  )
}
