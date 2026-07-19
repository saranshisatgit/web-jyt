'use server'

// The census reader on prod can take >10s to return an unfiltered page (a
// bounded keyspace scan), which exceeds Vercel's default Server Action
// duration. Cap every outbound fetch with an AbortController so a slow
// reader returns an empty page cleanly instead of letting the platform kill
// the action. (maxDuration can't go here — it's a route-segment config and
// only belongs in page.tsx / route.ts / layout.tsx.)
//
// NOTE: this file is `'use server'`, so per Turbopack it may export ONLY
// async functions — no interfaces/types. Shared types live in ./types.ts.
import type {
  CensusStats,
  ContactPersonInput,
  ContactPersonResult,
  GetPersonsParams,
  MapPerson,
  MapWeaver,
  WeaverFacetFilters,
  WeaverPage,
} from './types'

const FETCH_TIMEOUT_MS = 8_000

// NEXT_PUBLIC_API_URL on this app already includes the `/web` segment
// (set as `http://localhost:9000/web` in dev, same shape in prod), so
// route paths here are appended directly without re-prefixing /web.
// Used for the Medusa-native routes (`/persons`, contact).
const apiBase = () =>
  (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9000/web').replace(/\/$/, '')

// Census weaver/stats data has its own base so the map can read from the
// dedicated durable reader node (census-node.jaalyantra.com — an always-on
// replica that keeps a fully-converged store, so unfiltered pages return in
// ~0.2s instead of the multi-second cold scan the in-Fargate embedded peer did
// after every deploy). Same `${base}/census/*` shape whether it points at the
// node directly or at the Medusa proxy (v3.jaalyantra.com/web). Mirrors the
// NEXT_PUBLIC_CENSUS_READER_URL knob used by <ArtisanCount>. Falls back to the
// general API base, then localhost.
const censusBase = () =>
  (
    process.env.NEXT_PUBLIC_CENSUS_READER_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    'http://localhost:9000/web'
  ).replace(/\/$/, '')

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
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)
    const res = await fetch(url.toString(), {
      next: { revalidate: 10 },
      signal: controller.signal,
    })
    clearTimeout(timer)
    if (!res.ok) return []
    const data = await res.json()
    return (data.persons || []) as MapPerson[]
  } catch (err) {
    console.error('[map] getPersons failed', err)
    return []
  }
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
  const url = new URL(`${censusBase()}/census/weavers`)
  url.searchParams.set('limit', String(Math.min(Math.max(limit, 1), 100)))
  if (after) url.searchParams.set('after', after)
  else url.searchParams.set('offset', '0')
  if (filters.state) url.searchParams.set('state', filters.state)
  if (filters.district) url.searchParams.set('district', filters.district)
  if (filters.gender) url.searchParams.set('gender', filters.gender)

  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)
    const res = await fetch(url.toString(), {
      next: { revalidate: 60 },
      signal: controller.signal,
    })
    clearTimeout(timer)
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
export const getCensusStats = async (): Promise<CensusStats> => {
  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)
    const res = await fetch(`${censusBase()}/census/stats`, {
      next: { revalidate: 3600 },
      signal: controller.signal,
    })
    clearTimeout(timer)
    if (!res.ok) return {}
    const data = await res.json().catch(() => ({}))
    return (data.stats || {}) as CensusStats
  } catch (err) {
    console.error('[map] getCensusStats failed', err)
    return {}
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
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)
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
        signal: controller.signal,
      }
    )
    clearTimeout(timer)
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
