'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'

type HeroArtItem = {
  url: string
  type: 'image' | 'video'
  alt: string
}

type HeroArtResponse = {
  items: HeroArtItem[]
}

const EMPTY: HeroArtResponse = { items: [] }
const FOLDER_ID = '01KS74M4JABCFKHB4WTF90KQYS'

function buildPublicMediaUrl(filePath?: string | null): string | null {
  if (!filePath) return null
  if (/^https?:\/\//i.test(filePath)) return filePath
  const base =
    process.env.NEXT_PUBLIC_AWS_S3 ||
    process.env.NEXT_PUBLIC_API_URL ||
    ''
  if (!base) return filePath
  return `${base.replace(/\/$/, '')}/${filePath.replace(/^\//, '')}`
}

function useHeroArt() {
  const apiBase = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '')
  return useQuery<HeroArtResponse>({
    queryKey: ['hero-art'],
    queryFn: async () => {
      if (!apiBase) return EMPTY
      const params = new URLSearchParams({ limit: '20', album_id: FOLDER_ID })
      const res = await fetch(`${apiBase}/media?${params.toString()}`)
      if (!res.ok) return EMPTY
      const data = await res.json()
      const medias = data.medias ?? []
      const items: HeroArtItem[] = []
      for (const m of medias) {
        const url = buildPublicMediaUrl(m.file_path)
        if (!url) continue
        items.push({
          url,
          type: m.type === 'image' || m.mime_type?.startsWith('image/') ? 'image' : 'video',
          alt: m.alt_text || m.title || 'JYT',
        })
      }
      return { items }
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
