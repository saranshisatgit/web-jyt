'use client'

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import Map, {
  Marker,
  NavigationControl,
  type MapRef,
} from 'react-map-gl/mapbox'
import 'mapbox-gl/dist/mapbox-gl.css'
import {
  getPersons,
  getWeavers,
  submitPersonContact,
  type MapPerson,
  type MapWeaver,
} from './actions'

const MAPBOX_TOKEN =
  process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || 'YOUR_MAPBOX_ACCESS_TOKEN'

type Bucket = 'all' | 'partner' | 'tailor' | 'designer' | 'weaver' | 'other'
type ItemBucket = Exclude<Bucket, 'all'>

const BUCKET_LABELS: Record<Bucket, string> = {
  all: 'All',
  partner: 'Partners',
  tailor: 'Tailors',
  designer: 'Designers',
  weaver: 'Weavers',
  other: 'Other',
}

const BUCKET_COLORS: Record<Bucket, string> = {
  all: 'var(--accent-deep)',
  partner: 'var(--accent-deep)',
  tailor: 'oklch(0.55 0.10 35)',
  designer: 'oklch(0.50 0.10 280)',
  weaver: 'oklch(0.55 0.13 150)',
  other: 'oklch(0.50 0.02 210)',
}

/**
 * Unified display record for the map. Persons (from the Medusa persons
 * API) and weavers (from the masked census P2P core) are normalized into
 * this shape so the list, markers, and side panel can treat them
 * uniformly. `kind` drives the few behavioural differences (contact form
 * only for persons; meta keys differ).
 */
interface MapItem {
  id: string
  kind: 'person' | 'weaver'
  personId?: string
  name: string
  latitude: number | null
  longitude: number | null
  city: string | null
  bucket: ItemBucket
  meta: Array<[string, string | number | boolean]>
}

// Classify a person into one of the four person buckets. Reads from
// person_type.name first (the typed field) and falls back to
// public_metadata.tags / public_metadata.person_types — the data is
// inconsistent because rows were created over a long time across
// multiple flows.
const bucketForPerson = (person: MapPerson): ItemBucket => {
  const tokens: string[] = []
  if (person.person_type?.name) tokens.push(person.person_type.name)
  const meta = person.public_metadata
  if (meta) {
    for (const key of ['tags', 'person_types', 'level']) {
      const v = meta[key]
      if (typeof v === 'string') tokens.push(v)
    }
  }
  const joined = tokens.join(' ').toLowerCase()
  if (!joined) return 'other'
  if (joined.includes('partner')) return 'partner'
  if (joined.includes('tailor')) return 'tailor'
  if (joined.includes('designer')) return 'designer'
  return 'other'
}

const fullName = (p: MapPerson) =>
  `${p.first_name} ${p.last_name && p.last_name !== 'null' ? p.last_name : ''}`.trim()

// Fields surfaced in the side panel for a census weaver. Pulled from the
// masked record bag; absent/blank values are skipped at render time.
const WEAVER_META_KEYS = [
  'census_id', 'village', 'block', 'district', 'state', 'gender', 'age',
  'religion', 'social_group', 'education', 'rural_urban', 'household_type',
  'dwelling_type', 'ownership_type', 'electricity', 'own_looms',
  'total_looms_owned', 'pit_loom_count', 'frame_loom_count', 'natural_dye_used',
  'monthly_income', 'handloom_income', 'avg_production_meters',
  'intricacy_level',
] as const

const personToItem = (p: MapPerson): MapItem => {
  const a = p.addresses?.[0]
  const hasCoords =
    !!a && Number.isFinite(a.latitude) && Number.isFinite(a.longitude)
  const meta: Array<[string, string | number | boolean]> = []
  if (p.public_metadata) {
    for (const [k, v] of Object.entries(p.public_metadata)) {
      if (
        v != null &&
        String(v).trim() !== '' &&
        !['first_name', 'last_name'].includes(k)
      ) {
        meta.push([k, v])
      }
    }
  }
  return {
    id: `person:${p.id}`,
    kind: 'person',
    personId: p.id,
    name: fullName(p) || 'Untitled',
    latitude: hasCoords ? (a!.latitude as number) : null,
    longitude: hasCoords ? (a!.longitude as number) : null,
    city: a?.city ?? null,
    bucket: bucketForPerson(p),
    meta,
  }
}

const weaverToItem = (w: MapWeaver): MapItem | null => {
  const lat = Number(w.latitude)
  const lng = Number(w.longitude)
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null
  const meta: Array<[string, string | number | boolean]> = []
  for (const k of WEAVER_META_KEYS) {
    const v = w[k]
    if (v != null && String(v).trim() !== '') meta.push([k, v as string | number | boolean])
  }
  const city = w.village || w.block || w.district || w.state || null
  return {
    id: `weaver:${w.census_id}`,
    kind: 'weaver',
    name: (w.name && String(w.name).trim()) || 'Unknown weaver',
    latitude: lat,
    longitude: lng,
    city,
    bucket: 'weaver',
    meta,
  }
}

// Census weavers have no backend text search, so the loaded set is
// filtered client-side across the human-readable location/name fields.
const weaverMatchesSearch = (w: MapWeaver, q: string): boolean => {
  if (!q.trim()) return true
  const hay =
    [w.name, w.village, w.block, w.district, w.state, String(w.census_id ?? '')]
      .filter((x) => x != null && String(x).trim() !== '')
      .join(' ')
      .toLowerCase()
  return hay.includes(q.trim().toLowerCase())
}

type ContactState =
  | { phase: 'idle' }
  | { phase: 'submitting' }
  | { phase: 'error'; message: string }
  | {
      phase: 'done'
      contact: { name: string; email: string | null; phone: string | null }
    }

interface MapViewProps {
  initialPersons: MapPerson[]
  initialWeavers?: MapWeaver[]
}

const MapView = ({ initialPersons, initialWeavers = [] }: MapViewProps) => {
  const [persons, setPersons] = useState<MapPerson[]>(initialPersons)
  const [weavers, setWeavers] = useState<MapWeaver[]>(initialWeavers)
  const [searchInput, setSearchInput] = useState('')
  const [activeBucket, setActiveBucket] = useState<Bucket>('all')
  const [isLoading, setIsLoading] = useState(false)
  const [selected, setSelected] = useState<MapItem | null>(null)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [contactOpen, setContactOpen] = useState(false)
  const [contact, setContact] = useState<ContactState>({ phase: 'idle' })
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })

  const mapRef = useRef<MapRef | null>(null)
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Debounced refetch for persons. Hits the backend `q` param so the
  // search runs server-side across all 600+ persons, not just the slice
  // we've already loaded into memory. Weavers have no server-side text
  // search, so they are filtered client-side from the loaded set (see
  // visibleItems).
  useEffect(() => {
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current)
    searchTimerRef.current = setTimeout(async () => {
      setIsLoading(true)
      const data = await getPersons({ limit: 100, offset: 0, q: searchInput })
      setPersons(data)
      setIsLoading(false)
    }, 300)
    return () => {
      if (searchTimerRef.current) clearTimeout(searchTimerRef.current)
    }
  }, [searchInput])

  // Load census weavers once on mount, in the background. The census
  // reader does a full keyspace scan per request and can be slow (or time
  // out / return 503), so it's kept off the SSR path — persons render
  // immediately and weavers layer in when this resolves. On failure
  // getWeavers returns [], leaving the persons-only map intact.
  useEffect(() => {
    if (initialWeavers.length > 0) return
    let cancelled = false
    getWeavers().then((data) => {
      if (!cancelled && data.length > 0) setWeavers(data)
    })
    return () => {
      cancelled = true
    }
  }, [initialWeavers])

  // Union of persons + weavers, narrowed by the active bucket and (for
  // weavers only) the search text. Persons are already narrowed by the
  // debounced server-side refetch above.
  const visibleItems = useMemo(() => {
    const personItems = persons.map(personToItem)
    const weaverItems = weavers
      .filter((w) => weaverMatchesSearch(w, searchInput))
      .map(weaverToItem)
      .filter((x): x is MapItem => x !== null)
    let items = [...personItems, ...weaverItems]
    if (activeBucket !== 'all') items = items.filter((i) => i.bucket === activeBucket)
    return items
  }, [persons, weavers, searchInput, activeBucket])

  const positioned = useMemo(
    () =>
      visibleItems.filter(
        (i) => i.latitude != null && i.longitude != null
      ) as MapItem[],
    [visibleItems]
  )

  // Fit-to-bounds whenever the visible set changes meaningfully. Skip
  // when a person is selected so we don't tug the viewport away from
  // the user's focus.
  useEffect(() => {
    if (selected) return
    const map = mapRef.current?.getMap()
    if (!map || positioned.length === 0) return

    if (positioned.length === 1) {
      map.easeTo({
        center: [positioned[0].longitude as number, positioned[0].latitude as number],
        zoom: 6,
        duration: 600,
      })
      return
    }

    let minLng = Infinity, maxLng = -Infinity, minLat = Infinity, maxLat = -Infinity
    for (const i of positioned) {
      const lng = i.longitude as number
      const lat = i.latitude as number
      if (lng < minLng) minLng = lng
      if (lng > maxLng) maxLng = lng
      if (lat < minLat) minLat = lat
      if (lat > maxLat) maxLat = lat
    }
    map.fitBounds(
      [
        [minLng, minLat],
        [maxLng, maxLat],
      ],
      { padding: { top: 60, bottom: 60, left: 360, right: 60 }, duration: 600, maxZoom: 7 }
    )
  }, [positioned, selected])

  // Fly-to on selection.
  const onSelect = useCallback((item: MapItem) => {
    setSelected(item)
    setContactOpen(false)
    setContact({ phase: 'idle' })
    const map = mapRef.current?.getMap()
    if (map && item.latitude != null && item.longitude != null) {
      map.flyTo({ center: [item.longitude, item.latitude], zoom: 8, duration: 700 })
    }
  }, [])

  const onCloseSelected = useCallback(() => {
    setSelected(null)
    setContactOpen(false)
    setContact({ phase: 'idle' })
    setForm({ name: '', email: '', phone: '', message: '' })
  }, [])

  const onSubmitContact = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selected || !selected.personId) return
    setContact({ phase: 'submitting' })
    const result = await submitPersonContact({
      personId: selected.personId,
      name: form.name,
      email: form.email,
      phone: form.phone,
      message: form.message,
    })
    if (result.ok && result.contact) {
      setContact({ phase: 'done', contact: result.contact })
    } else {
      setContact({ phase: 'error', message: result.error || 'Something went wrong' })
    }
  }

  const resultWord = (n: number) => (n === 1 ? 'result' : 'results')

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* Left rail: search, filter chips, item list */}
      <div style={leftRailStyle}>
        <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--rule)' }}>
          <input
            type="search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search makers & weavers…"
            aria-label="Search makers and weavers"
            style={searchInputStyle}
          />
          <div style={{ display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
            {(Object.keys(BUCKET_LABELS) as Bucket[]).map((b) => (
              <button
                key={b}
                type="button"
                onClick={() => setActiveBucket(b)}
                style={chipStyle(activeBucket === b, BUCKET_COLORS[b])}
              >
                <span style={{ ...dotStyle, background: BUCKET_COLORS[b] }} />
                {BUCKET_LABELS[b]}
              </button>
            ))}
          </div>
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            fontSize: 12, color: 'var(--ink-mute)', marginTop: 10,
          }}>
            <span>
              {isLoading
                ? 'Searching…'
                : `${visibleItems.length} ${resultWord(visibleItems.length)}`}
            </span>
            {(searchInput || activeBucket !== 'all') && (
              <button
                type="button"
                onClick={() => { setSearchInput(''); setActiveBucket('all') }}
                style={resetLinkStyle}
              >
                Reset
              </button>
            )}
          </div>
        </div>

        <ul style={listStyle}>
          {visibleItems.length === 0 && !isLoading && (
            <li style={{ padding: 16, color: 'var(--ink-mute)', fontSize: 13 }}>
              No matches. Try a different search.
            </li>
          )}
          {visibleItems.map((item) => {
            const isSelected = selected?.id === item.id
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => onSelect(item)}
                  onMouseEnter={() => setHoveredId(item.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  style={listItemStyle(isSelected)}
                >
                  <span style={{ ...dotStyle, background: BUCKET_COLORS[item.bucket], marginTop: 6 }} />
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <span style={{
                      display: 'block', fontWeight: 500,
                      color: 'var(--ink)', fontSize: 14,
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>{item.name}</span>
                    <span style={{ display: 'block', fontSize: 12, color: 'var(--ink-soft)' }}>
                      {item.city || 'Unknown location'}
                    </span>
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      </div>

      {/* Right side panel for selected item */}
      {selected && (
        <div style={rightPanelStyle}>
          <button
            type="button"
            onClick={onCloseSelected}
            aria-label="Close"
            style={closeBtnStyle}
          >
            ✕
          </button>
          <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid var(--rule)' }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em',
              color: 'var(--ink-soft)',
            }}>
              <span style={{ ...dotStyle, background: BUCKET_COLORS[selected.bucket] }} />
              {BUCKET_LABELS[selected.bucket]}
            </span>
            <h3 style={{
              fontSize: 22, fontWeight: 500,
              color: 'var(--ink-dark)', margin: '8px 0 4px',
            }}>
              {selected.name}
            </h3>
            {selected.city && (
              <p style={{ margin: 0, color: 'var(--ink-soft)', fontSize: 14 }}>
                {selected.city}
              </p>
            )}
          </div>

          <div style={{ padding: 20, overflowY: 'auto', flex: 1 }}>
            {selected.meta.map(([k, v]) => (
              <div key={k} style={metaRowStyle}>
                <span style={metaKeyStyle}>{k.replace(/_/g, ' ')}</span>
                <span style={metaValStyle}>{String(v)}</span>
              </div>
            ))}

            {selected.kind === 'person' && (
              <>
                {!contactOpen && contact.phase !== 'done' && (
                  <button
                    type="button"
                    onClick={() => setContactOpen(true)}
                    style={primaryBtnStyle}
                  >
                    Contact them
                  </button>
                )}

                {contactOpen && contact.phase !== 'done' && (
                  <form onSubmit={onSubmitContact} style={{ marginTop: 18 }}>
                    <p style={{
                      fontSize: 13, color: 'var(--ink-soft)',
                      margin: '0 0 12px', lineHeight: 1.5,
                    }}>
                      Share your details. We&apos;ll let {selected.name.split(' ')[0] || 'them'} know
                      you reached out — their direct line will show after you submit.
                    </p>
                    <input
                      required type="text" placeholder="Your name"
                      value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                      style={fieldStyle}
                    />
                    <input
                      required type="email" placeholder="Your email"
                      value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                      style={fieldStyle}
                    />
                    <input
                      type="tel" placeholder="Phone (optional)"
                      value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      style={fieldStyle}
                    />
                    <textarea
                      placeholder="Message (optional)"
                      value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                      rows={3}
                      style={{ ...fieldStyle, resize: 'vertical', minHeight: 70 }}
                    />
                    {contact.phase === 'error' && (
                      <div style={{ color: 'var(--accent-deep)', fontSize: 13, marginBottom: 10 }}>
                        {contact.message}
                      </div>
                    )}
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        type="submit"
                        disabled={contact.phase === 'submitting'}
                        style={{ ...primaryBtnStyle, marginTop: 0, flex: 1 }}
                      >
                        {contact.phase === 'submitting' ? 'Sending…' : 'Send'}
                      </button>
                      <button
                        type="button"
                        onClick={() => { setContactOpen(false); setContact({ phase: 'idle' }) }}
                        style={ghostBtnStyle}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                {contact.phase === 'done' && (
                  <div style={{
                    marginTop: 18, padding: 16,
                    background: 'var(--accent-pale)',
                    border: '1px solid var(--accent-soft)',
                    borderRadius: 'var(--r-md)',
                  }}>
                    <h4 style={{
                      margin: '0 0 8px', fontSize: 14, fontWeight: 600,
                      color: 'var(--ink-dark)',
                    }}>
                      Thanks — your note is on its way.
                    </h4>
                    {contact.contact.email || contact.contact.phone ? (
                      <>
                        <p style={{ fontSize: 13, color: 'var(--ink-soft)', margin: '0 0 10px' }}>
                          You can also reach {contact.contact.name.split(' ')[0]} directly:
                        </p>
                        {contact.contact.email && (
                          <div style={{ fontSize: 13, marginBottom: 4 }}>
                            <span style={{ color: 'var(--ink-mute)' }}>Email · </span>
                            <a href={`mailto:${contact.contact.email}`} style={linkStyle}>
                              {contact.contact.email}
                            </a>
                          </div>
                        )}
                        {contact.contact.phone && (
                          <div style={{ fontSize: 13 }}>
                            <span style={{ color: 'var(--ink-mute)' }}>Phone · </span>
                            <a href={`tel:${contact.contact.phone.replace(/\s/g, '')}`} style={linkStyle}>
                              {contact.contact.phone}
                            </a>
                          </div>
                        )}
                      </>
                    ) : (
                      <p style={{ fontSize: 13, color: 'var(--ink-soft)', margin: 0 }}>
                        We&apos;ll forward your message and circle back via email.
                      </p>
                    )}
                  </div>
                )}
              </>
            )}

            {selected.kind === 'weaver' && (
              <p style={{
                marginTop: 18, fontSize: 12, color: 'var(--ink-mute)',
                lineHeight: 1.5, margin: '18px 0 0',
              }}>
                Census record. Contact routing isn&apos;t available for weavers.
              </p>
            )}
          </div>
        </div>
      )}

      <Map
        ref={mapRef}
        initialViewState={{ latitude: 22, longitude: 78, zoom: 3 }}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/light-v11"
        mapboxAccessToken={MAPBOX_TOKEN}
      >
        <NavigationControl style={navControlStyle} />
        {positioned.map((item) => {
          const isHovered = hoveredId === item.id
          const isSelected = selected?.id === item.id
          const size = isSelected ? 18 : isHovered ? 16 : 12
          return (
            <Marker
              key={item.id}
              latitude={item.latitude as number}
              longitude={item.longitude as number}
              anchor="center"
            >
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onSelect(item) }}
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
                aria-label={item.name}
                style={{
                  width: size, height: size, borderRadius: '50%',
                  background: BUCKET_COLORS[item.bucket],
                  border: '2px solid white',
                  boxShadow: isSelected || isHovered
                    ? '0 0 0 4px rgba(0,0,0,0.08), 0 2px 6px rgba(0,0,0,0.15)'
                    : '0 1px 3px rgba(0,0,0,0.2)',
                  cursor: 'pointer',
                  padding: 0,
                  transition: 'width 120ms ease, height 120ms ease, box-shadow 120ms ease',
                }}
              />
            </Marker>
          )
        })}
      </Map>
    </div>
  )
}

export default MapView

// ---------- styles ----------

const leftRailStyle: React.CSSProperties = {
  position: 'absolute',
  top: 16,
  left: 16,
  zIndex: 10,
  width: 320,
  maxHeight: 'calc(100% - 32px)',
  display: 'flex',
  flexDirection: 'column',
  background: 'rgba(255,255,255,0.96)',
  backdropFilter: 'blur(8px)',
  border: '1px solid var(--rule)',
  borderRadius: 'var(--r-md)',
  boxShadow: '0 6px 24px rgba(0,0,0,0.08)',
  overflow: 'hidden',
}

const rightPanelStyle: React.CSSProperties = {
  position: 'absolute',
  top: 16,
  right: 16,
  zIndex: 10,
  width: 340,
  maxHeight: 'calc(100% - 32px)',
  display: 'flex',
  flexDirection: 'column',
  background: 'rgba(255,255,255,0.98)',
  backdropFilter: 'blur(8px)',
  border: '1px solid var(--rule)',
  borderRadius: 'var(--r-md)',
  boxShadow: '0 6px 24px rgba(0,0,0,0.10)',
  overflow: 'hidden',
}

const searchInputStyle: React.CSSProperties = {
  width: '100%',
  padding: '8px 10px',
  fontSize: 14,
  border: '1px solid var(--rule)',
  borderRadius: 6,
  background: 'white',
  color: 'var(--ink)',
  outline: 'none',
  boxSizing: 'border-box',
}

const chipStyle = (active: boolean, color: string): React.CSSProperties => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 5,
  padding: '4px 9px',
  fontSize: 12,
  fontWeight: active ? 600 : 400,
  background: active ? color : 'transparent',
  color: active ? 'white' : 'var(--ink-soft)',
  border: `1px solid ${active ? color : 'var(--rule)'}`,
  borderRadius: 999,
  cursor: 'pointer',
  transition: 'background 120ms ease, color 120ms ease',
})

const dotStyle: React.CSSProperties = {
  display: 'inline-block',
  width: 8,
  height: 8,
  borderRadius: '50%',
}

const listStyle: React.CSSProperties = {
  margin: 0,
  padding: 0,
  listStyle: 'none',
  overflowY: 'auto',
  flex: 1,
  minHeight: 0,
}

const listItemStyle = (selected: boolean): React.CSSProperties => ({
  display: 'flex',
  alignItems: 'flex-start',
  gap: 10,
  width: '100%',
  padding: '10px 14px',
  background: selected ? 'var(--accent-pale)' : 'transparent',
  border: 'none',
  borderBottom: '1px solid var(--rule-soft)',
  cursor: 'pointer',
  textAlign: 'left',
  transition: 'background 120ms ease',
})

const resetLinkStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  color: 'var(--accent-deep)',
  fontSize: 12,
  textDecoration: 'underline',
  cursor: 'pointer',
  padding: 0,
}

const closeBtnStyle: React.CSSProperties = {
  position: 'absolute',
  top: 10,
  right: 10,
  width: 26,
  height: 26,
  borderRadius: '50%',
  border: '1px solid var(--rule)',
  background: 'white',
  color: 'var(--ink-soft)',
  cursor: 'pointer',
  fontSize: 14,
  lineHeight: 1,
  zIndex: 1,
}

const metaRowStyle: React.CSSProperties = {
  display: 'flex',
  gap: 10,
  padding: '6px 0',
  borderBottom: '1px solid var(--rule-soft)',
  fontSize: 13,
}

const metaKeyStyle: React.CSSProperties = {
  flexShrink: 0,
  width: 90,
  color: 'var(--ink-mute)',
  textTransform: 'capitalize',
}

const metaValStyle: React.CSSProperties = {
  flex: 1,
  color: 'var(--ink)',
  wordBreak: 'break-word',
}

const primaryBtnStyle: React.CSSProperties = {
  display: 'inline-block',
  width: '100%',
  marginTop: 16,
  padding: '9px 14px',
  fontSize: 14,
  fontWeight: 500,
  color: 'white',
  background: 'var(--accent-deep)',
  border: '1px solid var(--accent-deep)',
  borderRadius: 6,
  cursor: 'pointer',
}

const ghostBtnStyle: React.CSSProperties = {
  padding: '9px 14px',
  fontSize: 14,
  color: 'var(--ink-soft)',
  background: 'transparent',
  border: '1px solid var(--rule)',
  borderRadius: 6,
  cursor: 'pointer',
}

const fieldStyle: React.CSSProperties = {
  display: 'block',
  width: '100%',
  padding: '8px 10px',
  marginBottom: 8,
  fontSize: 14,
  border: '1px solid var(--rule)',
  borderRadius: 6,
  background: 'white',
  color: 'var(--ink)',
  outline: 'none',
  boxSizing: 'border-box',
  fontFamily: 'inherit',
}

const linkStyle: React.CSSProperties = {
  color: 'var(--accent-deep)',
  textDecoration: 'none',
  borderBottom: '1px solid var(--accent-soft)',
}

const navControlStyle: React.CSSProperties = {
  position: 'absolute',
  bottom: 20,
  right: 20,
  padding: 5,
  background: 'white',
  borderRadius: 8,
  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
}
