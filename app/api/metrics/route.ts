import { NextRequest, NextResponse } from "next/server"

const BRAND_DOMAINS: Record<string, string> = {
  jaalyantra: "jaalyantra.com",
  kindhealth: "kindhealth.com",
}

const EMPTY = {
  artisans: 0,
  brands_live: 0,
  hubs: 0,
  lead_time: { avg_days: null as number | null, sample_size: 0, window_days: 90 },
  gmv: { amount: 0, currency: "USD", window_days: 90 },
  last_updated: null,
}

export async function GET(request: NextRequest) {
  const brand = request.headers.get("x-brand") || "jaalyantra"
  const domain = BRAND_DOMAINS[brand] || BRAND_DOMAINS.jaalyantra
  const apiBase = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "")
  if (!apiBase) {
    return NextResponse.json({ ...EMPTY, error: "no_backend" }, { status: 503 })
  }

  try {
    const upstream = await fetch(
      `${apiBase}/website/${encodeURIComponent(domain)}/marketing/metrics`,
      { next: { revalidate: 60 } }
    )
    if (!upstream.ok) {
      return NextResponse.json(
        { ...EMPTY, error: "upstream_error", status: upstream.status },
        { status: 503 }
      )
    }
    const data = await upstream.json()
    // Normalize against EMPTY so older backend deploys (pre-GMV) still
    // satisfy the MetricsResponse contract the homepage expects. Upstream
    // wins where it provides a value; the shape always exists.
    const normalized = {
      ...EMPTY,
      ...(data || {}),
      gmv: { ...EMPTY.gmv, ...((data && data.gmv) || {}) },
      lead_time: { ...EMPTY.lead_time, ...((data && data.lead_time) || {}) },
    }
    const response = NextResponse.json(normalized)
    response.headers.set("Cache-Control", "public, max-age=60, stale-while-revalidate=300")
    return response
  } catch {
    return NextResponse.json({ ...EMPTY, error: "network_error" }, { status: 503 })
  }
}
