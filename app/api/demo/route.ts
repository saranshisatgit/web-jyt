import { NextRequest, NextResponse } from "next/server"

const BRAND_DOMAINS: Record<string, string> = {
  jaalyantra: "jaalyantra.com",
  kindhealth: "kindhealth.com",
}

const FORM_HANDLE = "demo-request"

export async function POST(request: NextRequest) {
  let payload: { email?: unknown; mode?: unknown } = {}
  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 })
  }

  const email = typeof payload.email === "string" ? payload.email.trim() : ""
  if (!email || !/.+@.+\..+/.test(email)) {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 })
  }
  const mode = typeof payload.mode === "string" ? payload.mode : "platform"

  const brand = request.headers.get("x-brand") || "jaalyantra"
  const domain = BRAND_DOMAINS[brand] || BRAND_DOMAINS.jaalyantra
  const apiBase = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "")
  if (!apiBase) {
    return NextResponse.json({ error: "no_backend" }, { status: 503 })
  }

  const referrer = request.headers.get("referer")

  try {
    const upstream = await fetch(
      `${apiBase}/website/${encodeURIComponent(domain)}/forms/${FORM_HANDLE}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          data: { email, mode },
          referrer,
          metadata: { source: "marketing-homepage", brand },
        }),
      }
    )
    const body = await upstream.json().catch(() => null)
    if (!upstream.ok) {
      return NextResponse.json(
        { error: body?.error || "upstream_error", status: upstream.status },
        { status: upstream.status === 404 ? 503 : upstream.status }
      )
    }
    return NextResponse.json({ ok: true, id: body?.response?.id ?? null })
  } catch {
    return NextResponse.json({ error: "network_error" }, { status: 503 })
  }
}

export function GET() {
  return NextResponse.json({ error: "method_not_allowed" }, { status: 405 })
}
