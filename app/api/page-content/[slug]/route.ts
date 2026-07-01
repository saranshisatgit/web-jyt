import { NextRequest, NextResponse } from "next/server"
import { DEFAULT_LOCALE, LOCALES } from "@/lib/i18n/config"
import { CONTENT_SLUGS, getPageContent } from "@/lib/page-content"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params

  if (!CONTENT_SLUGS.includes(slug as typeof CONTENT_SLUGS[number])) {
    return NextResponse.json({ error: "not_found" }, { status: 404 })
  }

  const { searchParams } = new URL(request.url)
  const locale =
    searchParams.get("locale") ||
    request.headers.get("x-locale") ||
    DEFAULT_LOCALE

  if (!LOCALES.some((l) => l.code === locale)) {
    return NextResponse.json({ error: "unsupported_locale" }, { status: 400 })
  }

  try {
    const data = await getPageContent(slug as typeof CONTENT_SLUGS[number], locale)
    const response = NextResponse.json(data)
    response.headers.set("Cache-Control", "public, max-age=3600, stale-while-revalidate=7200")
    return response
  } catch {
    return NextResponse.json({ error: "content_unavailable" }, { status: 503 })
  }
}
