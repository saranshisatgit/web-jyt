'use server'

type FilterValue = string | number | boolean | Record<string, string | number | boolean>

export interface GetPersonsParams {
  limit?: number
  offset?: number
  q?: string
  filters?: Record<string, FilterValue>
}

export interface MapAddress {
  latitude: number
  longitude: number
  city?: string | null
  postal_code?: string | null
  address_1?: string | null
}

export type MapMetadataValue = string | number | boolean

export interface MapPerson {
  id: string
  first_name: string
  last_name?: string | null
  bio?: string | null
  addresses: MapAddress[]
  person_type?: { name: string } | null
  public_metadata?: Record<string, MapMetadataValue> | null
}

/**
 * A masked (PII-free) census weaver record, returned as-is by
 * GET /web/census/weavers. Only a subset of weavers carry latitude/
 * longitude; the rest are dropped before plotting. The shape is loose
 * because the census module treats records as opaque bags.
 */
export interface MapWeaver {
  census_id: number | string
  name?: string | null
  latitude?: number | string | null
  longitude?: number | string | null
  village?: string | null
  block?: string | null
  district?: string | null
  state?: string | null
  gender?: string | null
  age?: number | string | null
  education?: string | null
  [key: string]: unknown
}

// NEXT_PUBLIC_API_URL on this app already includes the `/web` segment
// (set as `http://localhost:9000/web` in dev, same shape in prod), so
// route paths here are appended directly without re-prefixing /web.
const apiBase = () =>
  (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9000/web').replace(/\/$/, '')

export const getPersons = async (
  params: GetPersonsParams = {}
): Promise<MapPerson[]> => {
  const { limit = 50, offset = 0, q, filters = {} } = params
  const url = new URL(`${apiBase()}/persons`)
  url.searchParams.set('limit', String(limit))
  url.searchParams.set('offset', String(offset))
  if (q && q.trim()) url.searchParams.set('q', q.trim())

  for (const [key, value] of Object.entries(filters)) {
    if (value == null) continue
    if (
      key === 'public_metadata' &&
      typeof value === 'object' &&
      value !== null
    ) {
      for (const [metaKey, metaValue] of Object.entries(value)) {
        if (metaValue == null) continue
        url.searchParams.set(`public_metadata[${metaKey}]`, String(metaValue))
      }
    } else {
      url.searchParams.set(key, String(value))
    }
  }

  try {
    const res = await fetch(url.toString(), { next: { revalidate: 10 } })
    if (!res.ok) return []
    const data = await res.json()
    return (data.persons || []) as MapPerson[]
  } catch (err) {
    console.error('[map] getPersons failed', err)
    return []
  }
}

/**
 * Indexed facet filters for the weaver browse. These three (and their
 * state+district pairing) are the ONLY fields the census reader can query
 * at scale — they hit its secondary index (`idx/state|gender|sd/*`), giving
 * an O(page) range-scan, an exact `count` from the pre-computed `agg` cell,
 * and a re-consumable `next` cursor. Any other field would fall back to a
 * bounded full-record scan with no working cursor, so we don't expose them.
 */
export interface WeaverFacetFilters {
  state?: string
  district?: string
  gender?: string
}

export interface WeaverPage {
  weavers: MapWeaver[]
  /** Opaque forward cursor (last census_id of this page); pass as `after` to
   *  fetch the next page. Only present on the indexed facet path — null when
   *  the query fell back to the bounded unfiltered scan (no cursor support). */
  next: string | null
  /** Exact total for the filter (from the agg cell) unless `estimated`. */
  count: number
  /** True when count is a lower bound (unfiltered scan early-exited at the
   *  page window rather than draining the corpus). */
  estimated: boolean
}

const emptyPage: WeaverPage = { weavers: [], next: null, count: 0, estimated: false }

/**
 * Fetch a page of masked (PII-free) census weaver records from
 * GET /web/census/weavers.
 *
 * Two regimes, dictated by the reader:
 *   • With a facet filter (state / state+district / gender) → indexed range
 *     scan: fast, exact `count`, and a `next` cursor for O(page) "load more"
 *     that never degrades with depth.
 *   • Without a filter → bounded scan that returns the first page cheaply
 *     (early-exit) but yields no cursor and only a lower-bound count. Used
 *     for the initial "teaser" load; deep paging requires picking a facet.
 *
 * The endpoint caps `limit` at 100 and has no weaver text-search param (its
 * FILTERABLE whitelist is categorical), so free-text is filtered client-side
 * over the loaded set. Runs client-side (not during SSR) so a slow or
 * timed-out census scan never blocks the map — a non-connected reader
 * returns 503, which (like any error) we treat as an empty page.
 */
export const getWeavers = async (
  params: { limit?: number; after?: string | null; filters?: WeaverFacetFilters } = {}
): Promise<WeaverPage> => {
  const { limit = 100, after, filters = {} } = params
  const url = new URL(`${apiBase()}/census/weavers`)
  url.searchParams.set('limit', String(Math.min(Math.max(limit, 1), 100)))
  if (after) url.searchParams.set('after', after)
  else url.searchParams.set('offset', '0')
  if (filters.state) url.searchParams.set('state', filters.state)
  if (filters.district) url.searchParams.set('district', filters.district)
  if (filters.gender) url.searchParams.set('gender', filters.gender)

  try {
    const res = await fetch(url.toString(), { next: { revalidate: 60 } })
    if (!res.ok) return emptyPage
    const data = await res.json().catch(() => ({}))
    return {
      weavers: Array.isArray(data.weavers) ? (data.weavers as MapWeaver[]) : [],
      next: typeof data.next === 'string' && data.next ? data.next : null,
      count: typeof data.count === 'number' ? data.count : 0,
      estimated: data.estimated === true,
    }
  } catch (err) {
    console.error('[map] getWeavers fetch failed', err)
    return emptyPage
  }
}

/**
 * Pre-computed census aggregates from GET /web/census/stats — O(1) on the
 * reader (no per-record scan), k-anonymity suppressed. Used to populate the
 * weaver facet selectors with real, counted values (e.g. "HARYANA (12,340)")
 * that line up 1:1 with the indexed browse. Shape: { dim: { label: count } }.
 */
export type CensusStats = Record<string, Record<string, number | null>>

export const getCensusStats = async (): Promise<CensusStats> => {
  try {
    const res = await fetch(`${apiBase()}/census/stats`, { next: { revalidate: 3600 } })
    if (!res.ok) return {}
    const data = await res.json().catch(() => ({}))
    return (data.stats || {}) as CensusStats
  } catch (err) {
    console.error('[map] getCensusStats failed', err)
    return {}
  }
}

export interface ContactPersonInput {
  personId: string
  name: string
  email: string
  phone?: string
  message?: string
}

export interface ContactPersonResult {
  ok: boolean
  error?: string
  contact?: {
    name: string
    email: string | null
    phone: string | null
  }
}

export const submitPersonContact = async (
  input: ContactPersonInput
): Promise<ContactPersonResult> => {
  if (!input.personId) return { ok: false, error: 'missing person' }
  if (!input.name?.trim() || !input.email?.trim()) {
    return { ok: false, error: 'name and email are required' }
  }

  try {
    const res = await fetch(
      `${apiBase()}/persons/${encodeURIComponent(input.personId)}/contact`,
      {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          name: input.name.trim(),
          email: input.email.trim(),
          phone: input.phone?.trim() || null,
          message: input.message?.trim() || null,
          source: 'atlas-map',
        }),
        cache: 'no-store',
      }
    )
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      return { ok: false, error: body?.message || `HTTP ${res.status}` }
    }
    const body = await res.json()
    return { ok: true, contact: body.contact }
  } catch (err) {
    console.error('[map] submitPersonContact failed', err)
    return { ok: false, error: 'network error' }
  }
}
