export type LocaleCode = (typeof LOCALES)[number]["code"]

export const LOCALES = [
  { code: "en-IN", label: "India", lang: "en-IN" },
  { code: "it-IT", label: "Italy", lang: "it-IT" },
  { code: "en-AU", label: "Australia", lang: "en-AU" },
  { code: "en-US", label: "US", lang: "en-US" },
  { code: "lv-LV", label: "Latvia", lang: "lv-LV" },
] as const

export const DEFAULT_LOCALE: LocaleCode = "en-IN"

export const COOKIE_NAME = "NEXT_LOCALE"
