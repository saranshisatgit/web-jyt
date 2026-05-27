import { NextRequest, NextResponse } from "next/server"

/**
 * GET /api/home-testimonials
 *
 * Server-side fetch of the home page's CMS `Testimonial` block content
 * so the marketing page can render quote cards without exposing the
 * full backend website endpoint to the browser.
 *
 * Shape mirrors what `<UsingThePlatform />` needs:
 *   { title, callToAction: {text, linkUrl, linkText},
 *     testimonials: [{name, quote, subtitle, image_url}] }
 *
 * Empty arrays returned on any failure so the consumer's UI degrades
 * cleanly (renders nothing rather than blowing up).
 */

const BRAND_DOMAINS: Record<string, string> = {
  jaalyantra: "jaalyantra.com",
  kindhealth: "kindhealth.com",
}

type Testimonial = {
  name: string
  quote: string
  subtitle?: string
  image_url?: string
}

type HomeTestimonialsResponse = {
  title: string
  callToAction?: {
    text?: string
    linkUrl?: string
    linkText?: string
  }
  testimonials: Testimonial[]
}

const EMPTY: HomeTestimonialsResponse = {
  title: "",
  callToAction: undefined,
  testimonials: [],
}

export async function GET(request: NextRequest) {
  const brand = request.headers.get("x-brand") || "jaalyantra"
  const domain = BRAND_DOMAINS[brand] || BRAND_DOMAINS.jaalyantra
  const apiBase = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "")
  if (!apiBase) {
    return NextResponse.json(EMPTY, { status: 503 })
  }

  try {
    const upstream = await fetch(
      `${apiBase}/website/${encodeURIComponent(domain)}/home`,
      { next: { revalidate: 60 } }
    )
    if (!upstream.ok) return NextResponse.json(EMPTY, { status: 503 })

    const data = await upstream.json()
    const block = (data?.blocks || []).find(
      (b: any) => b?.type === "Testimonial"
    )
    if (!block) return NextResponse.json(EMPTY)

    const content = block.content || {}
    const out: HomeTestimonialsResponse = {
      title: typeof content.title === "string" ? content.title : "",
      callToAction:
        content.callToAction && typeof content.callToAction === "object"
          ? {
              text: content.callToAction.text,
              linkUrl: content.callToAction.linkUrl,
              linkText: content.callToAction.linkText,
            }
          : undefined,
      testimonials: Array.isArray(content.testimonials)
        ? (content.testimonials as any[])
            .filter((t) => t && typeof t === "object" && t.quote)
            .map((t) => ({
              name: String(t.name ?? ""),
              quote: String(t.quote ?? ""),
              subtitle: t.subtitle ? String(t.subtitle) : undefined,
              image_url: t.image_url ? String(t.image_url) : undefined,
            }))
        : [],
    }

    const response = NextResponse.json(out)
    response.headers.set(
      "Cache-Control",
      "public, max-age=60, stale-while-revalidate=300"
    )
    return response
  } catch {
    return NextResponse.json(EMPTY, { status: 503 })
  }
}
