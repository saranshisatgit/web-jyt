import { NextRequest, NextResponse } from "next/server"

const BRAND_DOMAINS: Record<string, string> = {
  jaalyantra: "jaalyantra.com",
  kindhealth: "kindhealth.com",
}

const EMPTY = { websites: [] }

export async function GET(request: NextRequest) {
  const brand = request.headers.get("x-brand") || "jaalyantra"
  const domain = BRAND_DOMAINS[brand] || BRAND_DOMAINS.jaalyantra
  const apiBase = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "")
  if (!apiBase) {
    return NextResponse.json({ ...EMPTY, error: "no_backend" }, { status: 503 })
  }

  try {
    const upstream = await fetch(
      `${apiBase}/website/${encodeURIComponent(domain)}/marketing/websites`,
      { next: { revalidate: 300 } }
    )
    if (!upstream.ok) {
      return NextResponse.json(
        { ...EMPTY, error: "upstream_error", status: upstream.status },
        { status: 503 }
      )
    }
    const data = await upstream.json()
    const response = NextResponse.json(data)
    response.headers.set("Cache-Control", "public, max-age=300, stale-while-revalidate=900")
    return response
  } catch {
    return NextResponse.json({ ...EMPTY, error: "network_error" }, { status: 503 })
  }
}
