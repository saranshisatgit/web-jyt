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
  submitPersonContact,
  type MapPerson,
} from './actions'

const MAPBOX_TOKEN =
  process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || 'YOUR_MAPBOX_ACCESS_TOKEN'

type Bucket = 'all' | 'partner' | 'tailor' | 'designer' | 'other'

const BUCKET_LABELS: Record<Bucket, string> = {
  all: 'All',
  partner: 'Partners',
  tailor: 'Tailors',
  designer: 'Designers',
  other: 'Other',
}

const BUCKET_COLORS: Record<Bucket, string> = {
  all: 'var(--accent-deep)',
  partner: 'var(--accent-deep)',
  tailor: 'oklch(0.55 0.10 35)',
  designer: 'oklch(0.50 0.10 280)',
  other: 'oklch(0.50 0.02 210)',
}

// Classify a person into one of the four UI buckets. Reads from
// person_type.name first (the typed field) and falls back to
// public_metadata.tags / public_metadata.person_types — the data is
// inconsistent because rows were created over a long time across
// multiple flows.
const bucketFor = (person: MapPerson): Bucket => {
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

const firstAddress = (p: MapPerson) => p.addresses?.[0]

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
}

const MapView = ({ initialPersons }: MapViewProps) => {
  const [persons, setPersons] = useState<MapPerson[]>(initialPersons)
  const [searchInput, setSearchInput] = useState('')
  const [activeBucket, setActiveBucket] = useState<Bucket>('all')
  const [isLoading, setIsLoading] = useState(false)
  const [selected, setSelected] = useState<MapPerson | null>(null)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [contactOpen, setContactOpen] = useState(false)
  const [contact, setContact] = useState<ContactState>({ phase: 'idle' })
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })

  const mapRef = useRef<MapRef | null>(null)
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Debounced refetch. Hits the backend `q` param so the search runs
  // server-side across all 600+ persons, not just the slice we've
  // already loaded into memory.
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

  // Local bucket filter — cheap, runs after search has narrowed the set.
  const visiblePersons = useMemo(() => {
    if (activeBucket === 'all') return persons
    return persons.filter((p) => bucketFor(p) === activeBucket)
  }, [persons, activeBucket])

  const positioned = useMemo(
    () => visiblePersons.filter((p) => firstAddress(p)),
    [visiblePersons]
  )

  // Fit-to-bounds whenever the visible set changes meaningfully. Skip
  // when a person is selected so we don't tug the viewport away from
  // the user's focus.
  useEffect(() => {
    if (selected) return
    const map = mapRef.current?.getMap()
    if (!map || positioned.length === 0) return

    if (positioned.length === 1) {
      const a = firstAddress(positioned[0])!
      map.easeTo({ center: [a.longitude, a.latitude], zoom: 6, duration: 600 })
      return
    }

    let minLng = Infinity, maxLng = -Infinity, minLat = Infinity, maxLat = -Infinity
    for (const p of positioned) {
      const a = firstAddress(p)!
      if (a.longitude < minLng) minLng = a.longitude
      if (a.longitude > maxLng) maxLng = a.longitude
      if (a.latitude < minLat) minLat = a.latitude
      if (a.latitude > maxLat) maxLat = a.latitude
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
  const onSelect = useCallback((p: MapPerson) => {
    setSelected(p)
    setContactOpen(false)
    setContact({ phase: 'idle' })
    const a = firstAddress(p)
    const map = mapRef.current?.getMap()
    if (map && a) {
      map.flyTo({ center: [a.longitude, a.latitude], zoom: 8, duration: 700 })
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
    if (!selected) return
    setContact({ phase: 'submitting' })
    const result = await submitPersonContact({
      personId: selected.id,
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

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* Left rail: search, filter chips, person list */}
      <div style={leftRailStyle}>
        <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--rule)' }}>
          <input
            type="search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by name, city, craft…"
            aria-label="Search makers"
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
              {isLoading ? 'Searching…' : `${visiblePersons.length} maker${visiblePersons.length === 1 ? '' : 's'}`}
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
          {visiblePersons.length === 0 && !isLoading && (
            <li style={{ padding: 16, color: 'var(--ink-mute)', fontSize: 13 }}>
              No matches. Try a different search.
            </li>
          )}
          {visiblePersons.map((p) => {
            const a = firstAddress(p)
            const isSelected = selected?.id === p.id
            const bucket = bucketFor(p)
            return (
              <li key={p.id}>
                <button
                  type="button"
                  onClick={() => onSelect(p)}
                  onMouseEnter={() => setHoveredId(p.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  style={listItemStyle(isSelected)}
                >
                  <span style={{ ...dotStyle, background: BUCKET_COLORS[bucket], marginTop: 6 }} />
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <span style={{
                      display: 'block', fontWeight: 500,
                      color: 'var(--ink)', fontSize: 14,
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>{fullName(p) || 'Untitled'}</span>
                    <span style={{ display: 'block', fontSize: 12, color: 'var(--ink-soft)' }}>
                      {a?.city || 'Unknown location'}
                    </span>
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      </div>

      {/* Right side panel for selected person */}
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
              <span style={{ ...dotStyle, background: BUCKET_COLORS[bucketFor(selected)] }} />
              {BUCKET_LABELS[bucketFor(selected)]}
            </span>
            <h3 style={{
              fontSize: 22, fontWeight: 500,
              color: 'var(--ink-dark)', margin: '8px 0 4px',
            }}>
              {fullName(selected) || 'Untitled'}
            </h3>
            {firstAddress(selected)?.city && (
              <p style={{ margin: 0, color: 'var(--ink-soft)', fontSize: 14 }}>
                {firstAddress(selected)!.city}
              </p>
            )}
          </div>

          <div style={{ padding: 20, overflowY: 'auto', flex: 1 }}>
            {selected.public_metadata &&
              Object.entries(selected.public_metadata)
                .filter(([k, v]) =>
                  v != null &&
                  String(v).trim() !== '' &&
                  !['first_name', 'last_name'].includes(k)
                )
                .map(([k, v]) => (
                  <div key={k} style={metaRowStyle}>
                    <span style={metaKeyStyle}>{k.replace(/_/g, ' ')}</span>
                    <span style={metaValStyle}>{String(v)}</span>
                  </div>
                ))}

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
                  Share your details. We&apos;ll let {fullName(selected).split(' ')[0] || 'them'} know
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
        {positioned.map((p) => {
          const a = firstAddress(p)!
          const bucket = bucketFor(p)
          const isHovered = hoveredId === p.id
          const isSelected = selected?.id === p.id
          const size = isSelected ? 18 : isHovered ? 16 : 12
          return (
            <Marker
              key={p.id}
              latitude={a.latitude}
              longitude={a.longitude}
              anchor="center"
            >
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onSelect(p) }}
                onMouseEnter={() => setHoveredId(p.id)}
                onMouseLeave={() => setHoveredId(null)}
                aria-label={fullName(p)}
                style={{
                  width: size, height: size, borderRadius: '50%',
                  background: BUCKET_COLORS[bucket],
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
