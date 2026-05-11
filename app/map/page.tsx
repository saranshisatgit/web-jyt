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

const MapPage = async () => {
  const persons = await getPersons()

  return (
    <main>
      <Navbar />
      <section className="kt-hero">
        <div className="container">
          <span className="kt-eyebrow">
            <span className="dot pulse" aria-hidden />
            Atlas
          </span>
          <h1 className="kt-display xl" style={{ marginTop: '32px', marginBottom: '24px' }}>
            Meet the <em>makers</em>.
          </h1>
          <p
            className="muted"
            style={{ fontSize: '21px', maxWidth: '680px', lineHeight: 1.45, margin: 0 }}
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

