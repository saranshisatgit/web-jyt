import type { LocaleCode } from "./config"
import type { Block } from "@/medu/queries"

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

/**
 * Generic resolver: deep-merges all `_i18n` fields into block content.
 *
 * For each key in content, if `{key}_i18n` exists:
 *  - string  → replaces the field
 *  - object  → deep-merges into the existing field
 *  - array   → merges by index (partial overrides per element)
 *
 * Strips `_i18n` keys from the output so components stay clean.
 */
export function resolveBlockContent(
  content: Record<string, unknown> | undefined,
  locale: string
): Record<string, unknown> | undefined {
  if (!content) return content

  const resolved: Record<string, unknown> = { ...content }

  for (const key of Object.keys(content)) {
    const i18nKey = `${key}_i18n`
    if (!(i18nKey in content)) continue

    const i18nMap = content[i18nKey] as Record<string, unknown> | undefined
    const localeValue = i18nMap?.[locale]
    if (localeValue === undefined) continue

    if (typeof localeValue === "string") {
      resolved[key] = localeValue
    } else if (Array.isArray(localeValue) && Array.isArray(resolved[key])) {
      resolved[key] = (resolved[key] as unknown[]).map((item, i) => {
        const override = localeValue[i]
        if (override && typeof override === "object" && item && typeof item === "object") {
          return { ...(item as object), ...(override as object) }
        }
        return override ?? item
      })
    } else if (typeof localeValue === "object" && localeValue !== null) {
      if (resolved[key] && typeof resolved[key] === "object") {
        resolved[key] = { ...(resolved[key] as object), ...(localeValue as object) }
      } else {
        resolved[key] = localeValue
      }
    }
  }

  for (const key of Object.keys(resolved)) {
    if (key.endsWith("_i18n")) delete resolved[key]
  }

  return resolved
}

/**
 * Resolve a full Block's content for a locale.
 * Returns a new Block with resolved content, or undefined.
 */
export function resolveBlock(
  block: Block | undefined,
  locale: string
): Block | undefined {
  if (!block) return block
  const resolved = resolveBlockContent(block.content, locale)
  return { ...block, content: resolved ?? block.content }
}
