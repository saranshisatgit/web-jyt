import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { Navbar } from '@/components/navbar'
import { getPageContent } from '@/lib/page-content'
import { DEFAULT_LOCALE } from '@/lib/i18n/config'
import CreateClient from './create-client'

export type SectionData = { id: string; label: string; heading: string; body: string; tag: string }
export type HeroData = { eyebrow: string; title: string; subtitle: string; primaryCta: { label: string; href: string }; secondaryCta: { label: string; href: string } }
export type CTAData = { title: string; body: string; primaryCta: { label: string; href: string }; secondaryCta: { label: string; href: string } }
export type CreateContent = { hero: HeroData; sections: SectionData[]; cta: CTAData }

export async function generateMetadata(): Promise<Metadata> {
  const h = await headers()
  const locale = h.get('x-locale') || DEFAULT_LOCALE
  const content = await getPageContent('create', locale) as CreateContent
  return {
    title: `${content.hero.title} — Jaal Yantra`,
    description: content.hero.subtitle,
  }
}

export default async function CreatePage() {
  const h = await headers()
  const locale = h.get('x-locale') || DEFAULT_LOCALE
  const content = await getPageContent('create', locale) as CreateContent

  return (
    <main>
      <Navbar />
      <CreateClient content={content} />
    </main>
  )
}
