import type { LocaleCode } from "./config"

export type Messages = Record<string, unknown>

const cache = new Map<LocaleCode, Messages>()

export async function loadTranslations(locale: LocaleCode): Promise<Messages> {
  if (cache.has(locale)) return cache.get(locale)!

  try {
    const mod = await import(`@/messages/${locale}.json`)
    const msgs = mod.default as Messages
    cache.set(locale, msgs)
    return msgs
  } catch {
    const fallback = await import(`@/messages/en-IN.json`)
    const msgs = fallback.default as Messages
    cache.set(locale, msgs)
    return msgs
  }
}
