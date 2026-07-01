import { DEFAULT_LOCALE, LOCALES } from "@/lib/i18n/config"

export const CONTENT_SLUGS = ["solutions", "ecommerce", "wholesale", "sell-on-ai", "compare"] as const
export type ContentSlug = (typeof CONTENT_SLUGS)[number]

async function loadContent(slug: ContentSlug, locale: string) {
  try {
    return (await import(`@/data/page-content/${locale}/${slug}.json`)).default
  } catch {
    return (await import(`@/data/page-content/${DEFAULT_LOCALE}/${slug}.json`)).default
  }
}

export async function getPageContent(slug: ContentSlug, locale: string) {
  if (!LOCALES.some((l) => l.code === locale)) {
    return loadContent(slug, DEFAULT_LOCALE)
  }
  return loadContent(slug, locale)
}
