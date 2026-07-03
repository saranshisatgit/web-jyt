import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { brandFromHostOrOverride } from "@/lib/brand"
import { currencyFromCountry } from "@/lib/currency"
import { DEFAULT_LOCALE, LOCALES, COOKIE_NAME } from "@/lib/i18n/config"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/_vercel/") ||
    pathname.startsWith("/opengraph") ||
    pathname.startsWith("/robots") ||
    pathname.startsWith("/sitemap") ||
    /\.\w+$/.test(pathname)
  ) {
    return NextResponse.next()
  }

  // Resolve locale: query param → cookie → Accept-Language → default
  let locale = request.nextUrl.searchParams.get("locale")
  if (locale && LOCALES.some((l) => l.code === locale)) {
    const response = NextResponse.redirect(new URL(request.nextUrl.pathname, request.url))
    response.cookies.set(COOKIE_NAME, locale, { path: "/", maxAge: 365 * 24 * 60 * 60, sameSite: "lax" })
    return response
  }

  locale = request.cookies.get(COOKIE_NAME)?.value ?? null
  if (!locale || !LOCALES.some((l) => l.code === locale)) {
    const acceptLang = request.headers.get("Accept-Language") || ""
    const preferred = acceptLang
      .split(",")
      .map((s) => s.split(";")[0].trim())
      .find((a) => LOCALES.some((l) => a.startsWith(l.lang.split("-")[0])))
    locale = LOCALES.find((l) => l.lang.startsWith(preferred || "xx"))?.code ?? DEFAULT_LOCALE
  }

  // Brand
  const host = request.headers.get("host")
  const override = request.nextUrl.searchParams.get("brand")
  const brand = brandFromHostOrOverride(host, override)

  // Geo currency
  const headerCountry =
    request.headers.get("x-vercel-ip-country") ||
    request.headers.get("cf-ipcountry") ||
    null
  const countryOverride = request.nextUrl.searchParams.get("country")
  const country = countryOverride || headerCountry
  const currency = currencyFromCountry(country)

  const response = NextResponse.next()
  response.headers.set("x-locale", locale)
  response.headers.set("x-brand", brand.key)
  if (country) response.headers.set("x-country", country.toUpperCase())
  response.headers.set("x-currency", currency.code)
  return response
}

export const config = {
  matcher: ["/((?!api|_next|_vertex|.*\\..*).*)"],
}
