import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { Navbar } from '@/components/navbar'
import { getPageContent } from '@/lib/page-content'
import { DEFAULT_LOCALE } from '@/lib/i18n/config'
import EditionsClient from './editions-client'

/* ───── Types ───── */

export type CardData = { title: string; body: string; tag?: string; dark?: boolean }
export type NavItemData = { id: string; label: string }
export type SectionData = { id: string; label: string; heading: string; cards: CardData[]; dark?: boolean }
export type HeroData = { eyebrow: string; title: string; subtitle: string; primaryCta: { label: string; href: string }; secondaryCta: { label: string; href: string } }
export type CTAData = { title: string; body: string; primaryCta: { label: string; href: string }; secondaryCta: { label: string; href: string } }
export type StatData = { value: string; label: string }
export type EditionsContent = { hero: HeroData; navItems: NavItemData[]; sections: SectionData[]; cta: CTAData; stats?: StatData[]; customers?: string[] }

/* ───── Fetch live partner brand names ───── */

async function fetchPartnerBrands(): Promise<string[]> {
  const apiBase = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '')
  if (!apiBase) return []
  try {
    const res = await fetch(
      `${apiBase}/website/jaalyantra.com/marketing/partners`,
      { next: { revalidate: 60 } },
    )
    if (!res.ok) return []
    const data = await res.json()
    const brands: { name: string; is_live: boolean }[] = data.brands ?? []
    return brands.filter((b) => b.is_live).map((b) => b.name)
  } catch {
    return []
  }
}

/* ───── Metadata ───── */

export async function generateMetadata(): Promise<Metadata> {
  const h = await headers()
  const locale = h.get('x-locale') || DEFAULT_LOCALE
  const content = await getPageContent('editions', locale) as EditionsContent
  return {
    title: `${content.hero.title} — Jaal Yantra Editions`,
    description: content.hero.subtitle,
  }
}

/* ───── Page ───── */

export default async function EditionsPage() {
  const h = await headers()
  const locale = h.get('x-locale') || DEFAULT_LOCALE
  const content = await getPageContent('editions', locale) as EditionsContent

  const partnerBrands = await fetchPartnerBrands()
  if (partnerBrands.length > 0) {
    content.customers = partnerBrands.slice(0, 12)
  }

  return (
    <main>
      <Navbar />
      <EditionsClient content={content} />
    </main>
  )
}
