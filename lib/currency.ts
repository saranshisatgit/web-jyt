// Geo-currency mapping for the marketing site. We don't need real exchange
// rates — these are *display* conversions for marketing pricing where the
// user picked "simplicity over precision". Real billing currency stays
// whatever Stripe/Razorpay settles in.

export type CurrencyCode = "INR" | "USD" | "EUR" | "GBP" | "AUD"

export type CurrencyConfig = {
  code: CurrencyCode
  symbol: string
  // Approximate fixed rate per 1 INR (e.g. 1 INR ≈ 0.012 USD). Round
  // numbers chosen to map ₹2000 → clean prices in each currency. Tweak
  // here when conversion drifts more than ~20%.
  per_inr: number
}

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  INR: { code: "INR", symbol: "₹", per_inr: 1 },
  USD: { code: "USD", symbol: "$", per_inr: 0.012 },     // 1 USD ≈ 83 INR
  EUR: { code: "EUR", symbol: "€", per_inr: 0.011 },     // 1 EUR ≈ 90 INR
  GBP: { code: "GBP", symbol: "£", per_inr: 0.0095 },    // 1 GBP ≈ 105 INR
  AUD: { code: "AUD", symbol: "A$", per_inr: 0.018 },    // 1 AUD ≈ 55 INR
}

// ISO 3166-1 alpha-2 → display currency. We pick the visitor's *local*
// currency, not their billing currency. Sparse on purpose: any country
// not listed falls through to USD.
const COUNTRY_TO_CURRENCY: Record<string, CurrencyCode> = {
  IN: "INR",
  GB: "GBP",
  AU: "AUD",
  NZ: "AUD",
  // Eurozone — keep this list close to actual members so we don't show
  // EUR to non-euro visitors and confuse them.
  AT: "EUR", BE: "EUR", BG: "EUR", CY: "EUR", DE: "EUR", EE: "EUR",
  ES: "EUR", FI: "EUR", FR: "EUR", GR: "EUR", HR: "EUR", IE: "EUR",
  IT: "EUR", LT: "EUR", LU: "EUR", LV: "EUR", MT: "EUR", NL: "EUR",
  PT: "EUR", SI: "EUR", SK: "EUR",
}

export function currencyFromCountry(country: string | null | undefined): CurrencyConfig {
  if (!country) return CURRENCIES.USD
  const code = COUNTRY_TO_CURRENCY[country.toUpperCase()]
  return code ? CURRENCIES[code] : CURRENCIES.USD
}

export function currencyFromCode(code: string | null | undefined): CurrencyConfig {
  if (!code) return CURRENCIES.USD
  const upper = code.toUpperCase() as CurrencyCode
  return CURRENCIES[upper] ?? CURRENCIES.USD
}

// Convert from INR base to target currency. Rounds to the nearest tier
// step so prices read like real prices (e.g. $24 not $24.13 — when
// pricing is marketing copy, ugly tails undermine the offer).
export function convertFromInr(amountInr: number, target: CurrencyConfig, step = 1): number {
  const raw = amountInr * target.per_inr
  return Math.round(raw / step) * step
}

// Formatted price for a tier card. `INR` keeps full integers; the rest
// round to nice 1-unit steps so we get $25/€22 not $24.13/€21.78.
export function formatPrice(amountInr: number, currency: CurrencyConfig): string {
  if (currency.code === "INR") {
    // Indian numbering: 2,00,000 reads better than 200,000 for INR.
    return `₹${amountInr.toLocaleString("en-IN")}`
  }
  const converted = convertFromInr(amountInr, currency, 1)
  return `${currency.symbol}${converted}`
}
