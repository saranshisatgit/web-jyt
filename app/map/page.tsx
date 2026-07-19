import React from 'react'
import { type Metadata } from 'next'
import { Navbar } from '@/components/navbar'
import MapView from './map-view'
import { getPersons } from './actions'

export const metadata: Metadata = {
  title: 'Artisan map',
  description:
    'Explore our network of artisans and technicians across the world.',
}

// The census reader (free-tier node) can take 10-30s to hydrate a filtered
// page, and the map's getWeavers/getCensusStats server actions run under this
// route's function budget. Give them headroom so a slow census page finishes
// instead of the platform killing the action mid-flight.
export const maxDuration = 30

const MapPage = async () => {
  // Only persons are fetched during SSR so the map paints fast. Census
  // weavers are loaded client-side on mount (see MapView) — the census
  // reader does a full keyspace scan per request and can be slow, so it
  // must never block the page render.
  const persons = await getPersons()

  return (
    <main>
      <Navbar />
      <section className="kt-hero compact">
        <div className="container">
          <span className="kt-eyebrow">
            <span className="dot pulse" aria-hidden />
            Atlas
          </span>
          <h1 className="kt-display l" style={{ marginTop: '20px', marginBottom: '16px' }}>
            Meet the <em>makers</em>.
          </h1>
          <p
            className="muted"
            style={{ fontSize: '18px', maxWidth: '620px', lineHeight: 1.4, margin: 0 }}
          >
            We work with a diverse, vetted network of artisans across three continents. The map shows
            where the hands are.
          </p>
        </div>
      </section>
      <section className="kt-section">
        <div className="container">
          <div
            style={{
              height: '600px',
              width: '100%',
              overflow: 'hidden',
              borderRadius: 'var(--r-md)',
              border: '1px solid var(--rule)',
            }}
          >
            <MapView initialPersons={persons} />
          </div>
        </div>
      </section>
    </main>
  )
}

export default MapPage

