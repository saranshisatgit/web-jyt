/**
 * Country → ISO 4217 currency mapping for the GYG-style traveller fields.
 * GYG exports country names in English (e.g. "United States", "Australia").
 * We compare case-insensitively and tolerate a couple of common aliases.
 *
 * Anything not on the list falls back to no conversion (we just show the
 * canonical price in its native currency).
 */
const COUNTRY_TO_CURRENCY: Record<string, string> = {
  // Top GYG markets
  'united states': 'USD',
  'usa': 'USD',
  'us': 'USD',
  'united kingdom': 'GBP',
  'uk': 'GBP',
  'great britain': 'GBP',
  'australia': 'AUD',
  'new zealand': 'NZD',
  'canada': 'CAD',
  'india': 'INR',
  'japan': 'JPY',
  'china': 'CNY',
  'south korea': 'KRW',
  'singapore': 'SGD',
  'hong kong': 'HKD',
  'taiwan': 'TWD',
  'indonesia': 'IDR',
  'malaysia': 'MYR',
  'thailand': 'THB',
  'philippines': 'PHP',
  'vietnam': 'VND',
  'uae': 'AED',
  'united arab emirates': 'AED',
  'saudi arabia': 'SAR',
  'israel': 'ILS',
  'south africa': 'ZAR',
  'brazil': 'BRL',
  'mexico': 'MXN',
  'argentina': 'ARS',
  'chile': 'CLP',
  'colombia': 'COP',

  // Eurozone
  'italy': 'EUR',
  'france': 'EUR',
  'germany': 'EUR',
  'spain': 'EUR',
  'portugal': 'EUR',
  'netherlands': 'EUR',
  'belgium': 'EUR',
  'austria': 'EUR',
  'ireland': 'EUR',
  'finland': 'EUR',
  'greece': 'EUR',
  'estonia': 'EUR',
  'latvia': 'EUR',
  'lithuania': 'EUR',
  'luxembourg': 'EUR',
  'malta': 'EUR',
  'cyprus': 'EUR',
  'slovakia': 'EUR',
  'slovenia': 'EUR',

  // Non-EUR Europe
  'switzerland': 'CHF',
  'sweden': 'SEK',
  'norway': 'NOK',
  'denmark': 'DKK',
  'iceland': 'ISK',
  'poland': 'PLN',
  'czech republic': 'CZK',
  'czechia': 'CZK',
  'hungary': 'HUF',
  'romania': 'RON',
  'bulgaria': 'BGN',
  'croatia': 'EUR',
  'serbia': 'RSD',
  'turkey': 'TRY',
};

export function countryToCurrency(country: string | null | undefined): string | null {
  if (!country) return null;
  const key = country.trim().toLowerCase();
  return COUNTRY_TO_CURRENCY[key] ?? null;
}

type RateResponse = {
  result?: string;
  base_code?: string;
  rates?: Record<string, number>;
};

/**
 * Fetch FX rates from open.er-api.com (free, no API key) with Next.js
 * caching for 24h. Returns the multiplier to convert `from` → `to`,
 * or null on any error / unknown currency.
 *
 * https://www.exchangerate-api.com/docs/free
 */
export async function getFxRate(
  from: string,
  to: string
): Promise<number | null> {
  if (!from || !to) return null;
  if (from === to) return 1;

  try {
    const res = await fetch(
      `https://open.er-api.com/v6/latest/${encodeURIComponent(from)}`,
      { next: { revalidate: 86_400, tags: [`fx-${from}`] } }
    );
    if (!res.ok) return null;
    const body = (await res.json()) as RateResponse;
    if (body.result !== 'success' || !body.rates) return null;
    const rate = body.rates[to];
    return typeof rate === 'number' && Number.isFinite(rate) ? rate : null;
  } catch (err) {
    console.error('getFxRate failed', { from, to, err });
    return null;
  }
}
