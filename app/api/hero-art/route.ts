import { NextRequest, NextResponse } from "next/server"

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
  type?: string
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

export type HeroArtItem = {
  url: string
  type: "image" | "video"
  mime_type?: string
  width?: number
  height?: number
  alt: string
  credit: string | null
}

export type HeroArtResponse = {
  items: HeroArtItem[]
}

const EMPTY: HeroArtResponse = { items: [] }
const FOLDER_ID = "01KS74M4JABCFKHB4WTF90KQYS"

export async function GET(request: NextRequest) {
  const apiBase = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "")
  if (!apiBase) {
    return NextResponse.json({ ...EMPTY, error: "no_backend" }, { status: 503 })
  }

  const folderId = request.nextUrl.searchParams.get("folder_id") || FOLDER_ID

  try {
    // Same query-param pattern as hero-media – the folder endpoint
    // requires a share token, but ?folder_id= works without auth.
    const params = new URLSearchParams({ limit: "20", id: folderId })
    const res = await fetch(`${apiBase}/media?${params.toString()}`, {
      next: { revalidate: 60 },
    })

    if (!res.ok) {
      return NextResponse.json({ ...EMPTY, error: "upstream_error" }, { status: 502 })
    }

    const data = (await res.json()) as UpstreamResponse
    const medias = data.medias ?? []

    const items: HeroArtItem[] = []
    for (const m of medias) {
      const url = buildPublicMediaUrl(m.file_path)
      if (!url) continue
      const type = m.type === "image" || m.mime_type?.startsWith("image/") ? "image" : "video"
      items.push({
        url,
        type,
        alt: m.alt_text || m.title || "JYT",
        credit: m.caption || m.description || null,
        ...(m.mime_type ? { mime_type: m.mime_type } : {}),
        ...(m.width ? { width: m.width } : {}),
        ...(m.height ? { height: m.height } : {}),
      })
    }

    const response = NextResponse.json({ items })
    response.headers.set(
      "Cache-Control",
      "public, max-age=60, stale-while-revalidate=300"
    )
    return response
  } catch {
    return NextResponse.json({ ...EMPTY, error: "network_error" }, { status: 503 })
  }
}
