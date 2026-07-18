// Shared types for the artisan map. Kept out of actions.ts because that file
// is `'use server'` and Turbopack requires such files to export ONLY async
// functions — type/interface exports would break the module resolution.

export type FilterValue = string | number | boolean | Record<string, string | number | boolean>

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

export type CensusStats = Record<string, Record<string, number | null>>

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
