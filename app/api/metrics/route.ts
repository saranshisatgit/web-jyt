import { NextRequest, NextResponse } from "next/server"

const BRAND_DOMAINS: Record<string, string> = {
  jaalyantra: "jaalyantra.com",
  kindhealth: "kindhealth.com",
}

// Investor-facing additions (the /investors pitch page consumes these).
// Backend contract — add these fields to `GET /website/{domain}/marketing/metrics`:
//   orders.processed        → total orders processed to date (demand side)
//   orders.trailing_30d     → completed orders in trailing window
//   commission.accrued      → total commission accrued (transaction revenue)
//   commission.trailing_30d → commission accrued in trailing window
//   arr.amount              → annualized revenue run-rate (subscription + commission)
//   aov.amount              → average order value
//   subscription.mrr        → monthly recurring revenue from artisan subscriptions
//   subscription.paying_artisans → count of paying artisans
// Every field is optional: older deploys without them still satisfy the
// contract because the shapes below always exist (zeros win on absence).
const EMPTY = {
  artisans: 0,
  brands_live: 0,
  hubs: 0,
  lead_time: { avg_days: null as number | null, sample_size: 0, window_days: 90 },
  gmv: { amount: 0, currency: "USD", window_days: 90 },
  orders: { processed: 0, trailing_30d: 0, window_days: 30 },
  commission: { accrued: 0, trailing_30d: 0, currency: "EUR", window_days: 30 },
  arr: { amount: 0, currency: "EUR" },
  aov: { amount: 0, currency: "EUR" },
  subscription: { paying_artisans: 0, mrr: 0, currency: "EUR" },
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
      orders: { ...EMPTY.orders, ...((data && data.orders) || {}) },
      commission: { ...EMPTY.commission, ...((data && data.commission) || {}) },
      arr: { ...EMPTY.arr, ...((data && data.arr) || {}) },
      aov: { ...EMPTY.aov, ...((data && data.aov) || {}) },
      subscription: { ...EMPTY.subscription, ...((data && data.subscription) || {}) },
    }
    const response = NextResponse.json(normalized)
    response.headers.set("Cache-Control", "public, max-age=60, stale-while-revalidate=300")
    return response
  } catch {
    return NextResponse.json({ ...EMPTY, error: "network_error" }, { status: 503 })
  }
}
