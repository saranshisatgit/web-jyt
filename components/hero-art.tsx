'use client'

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

  if (!current) return null

  return (
    <>
      <img
        src={current.url}
        alt=""
        className="kt-hero-video"
        aria-hidden
        style={{ objectFit: 'cover' }}
      />
      <div className="kt-hero-scrim" aria-hidden />
    </>
  )
}
