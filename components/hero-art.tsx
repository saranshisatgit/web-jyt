'use client'

'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import type { HeroArtResponse } from '@/app/api/hero-art/route'

const EMPTY: HeroArtResponse = { items: [] }

function useHeroArt() {
  return useQuery<HeroArtResponse>({
    queryKey: ['hero-art'],
    queryFn: async () => {
      const res = await fetch('/api/hero-art')
      if (!res.ok) return EMPTY
      return (await res.json()) as HeroArtResponse
    },
    staleTime: 60_000,
  })
}

export function HeroArt() {
  const { data } = useHeroArt()
  const images = (data?.items ?? []).filter((i) => i.type === 'image')
  const current = images[0]
  const [loaded, setLoaded] = useState(false)

  if (!current) return null

  return (
    <>
      {!loaded && <div className="kt-hero-placeholder" aria-hidden />}
      <img
        src={current.url}
        alt=""
        className={`kt-hero-video${loaded ? ' kt-hero-video--loaded' : ''}`}
        aria-hidden
        style={{ objectFit: 'cover' }}
        onLoad={() => setLoaded(true)}
      />
      <div className="kt-hero-scrim" aria-hidden />
    </>
  )
}
