import { NextResponse } from "next/server"

// Mirrors buildPublicMediaUrl() from apps/storefront — file_path is stored
// as the full S3 URL on upload, but we guard for relative keys too.
function buildPublicMediaUrl(filePath?: string | null): string | null {
  if (!filePath) return null
  if (/^https?:\/\//i.test(filePath)) return filePath
  const base =
    process.env.NEXT_PUBLIC_AWS_S3 ||
    process.env.S3_FILE_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    ""
  if (!base) return filePath
  return `${base.replace(/\/$/, "")}/${filePath.replace(/^\//, "")}`
}

type UpstreamMedia = {
  id: string
  file_path?: string
  file_type?: string
  mime_type?: string
  width?: number
  height?: number
  title?: string | null
  alt_text?: string | null
  caption?: string | null
  description?: string | null
}

type UpstreamResponse = { medias?: UpstreamMedia[]; count?: number; total?: number }

export type HeroVideo = {
  url: string
  mime_type?: string
  width?: number
  height?: number
  alt: string
  credit: string | null
}

export type HeroMediaResponse = {
  videos: HeroVideo[]
}

const EMPTY: HeroMediaResponse = { videos: [] }

export async function GET() {
  const apiBase = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "")
  if (!apiBase) {
    return NextResponse.json({ ...EMPTY, error: "no_backend" }, { status: 503 })
  }

  const albumId = process.env.NEXT_PUBLIC_HERO_VIDEO_ALBUM_ID
  const limit = 20

  const fetchVideos = async (withAlbum: boolean): Promise<UpstreamMedia[]> => {
    const params = new URLSearchParams({
      type: "video",
      limit: String(limit),
      random: "true",
    })
    if (withAlbum && albumId) params.set("album_id", albumId)
    const res = await fetch(`${apiBase}/media?${params.toString()}`, {
      next: { revalidate: 60 },
    })
    if (!res.ok) return []
    const data = (await res.json()) as UpstreamResponse
    return data.medias ?? []
  }

  try {
    // Album-scoped first (curated hero set); fall back to the random
    // public video pool if the album is empty or unset — same pattern
    // the storefront image hero uses, so editors can rotate the set
    // without a redeploy.
    let medias = albumId ? await fetchVideos(true) : []
    if (!medias.length) medias = await fetchVideos(false)

    const videos: HeroVideo[] = []
    for (const m of medias) {
      const url = buildPublicMediaUrl(m.file_path)
      if (!url) continue
      videos.push({
        url,
        alt: m.alt_text || m.title || 'JYT',
        credit: m.caption || m.description || null,
        ...(m.mime_type ? { mime_type: m.mime_type } : {}),
        ...(m.width ? { width: m.width } : {}),
        ...(m.height ? { height: m.height } : {}),
      })
    }

    const response = NextResponse.json({ videos })
    response.headers.set(
      "Cache-Control",
      "public, max-age=60, stale-while-revalidate=300"
    )
    return response
  } catch {
    return NextResponse.json({ ...EMPTY, error: "network_error" }, { status: 503 })
  }
}
