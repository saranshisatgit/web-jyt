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
