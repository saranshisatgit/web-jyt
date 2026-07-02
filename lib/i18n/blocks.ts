import type { LocaleCode } from "./config"

/**
 * Resolve a top-level i18n field from CMS block content.
 * Looks for `{field}_i18n[locale]`, falls back to `content[field]`.
 */
export function t(
  content: Record<string, unknown> | undefined,
  field: string,
  locale: string
): string | undefined {
  if (!content) return undefined
  const i18nKey = `${field}_i18n`
  const i18nMap = content[i18nKey] as Record<string, string> | undefined
  if (i18nMap?.[locale]) return i18nMap[locale]
  return content[field] as string | undefined
}

/**
 * Resolve a nested i18n value from a lookup table on the block content.
 * e.g. tLookup(content, "fields_i18n", locale, "gst", "label", "GSTIN")
 * → content.fields_i18n[locale].gst.label ?? "GSTIN"
 */
export function tLookup(
  content: Record<string, unknown> | undefined,
  i18nKey: string,
  locale: string,
  itemKey: string,
  field: string,
  fallback: string
): string {
  if (!content) return fallback
  const i18nMap = content[i18nKey] as
    | Record<string, Record<string, Record<string, string>>>
    | undefined
  return i18nMap?.[locale]?.[itemKey]?.[field] ?? fallback
}
