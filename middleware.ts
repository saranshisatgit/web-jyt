import { NextRequest, NextResponse } from "next/server";
import { brandFromHostOrOverride } from "@/lib/brand";
import { currencyFromCountry } from "@/lib/currency";

export function middleware(request: NextRequest) {
  const host = request.headers.get("host");
  const override = request.nextUrl.searchParams.get("brand");
  const brand = brandFromHostOrOverride(host, override);

  // Geo: Vercel sets x-vercel-ip-country, Cloudflare sets cf-ipcountry.
  // Local dev falls through to USD via the lib default. The `?country=`
  // override is useful for verifying the geo-currency flow without
  // spinning up a VPN.
  const headerCountry =
    request.headers.get("x-vercel-ip-country") ||
    request.headers.get("cf-ipcountry") ||
    null;
  const countryOverride = request.nextUrl.searchParams.get("country");
  const country = countryOverride || headerCountry;
  const currency = currencyFromCountry(country);

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-brand", brand.key);
  if (country) requestHeaders.set("x-country", country.toUpperCase());
  requestHeaders.set("x-currency", currency.code);

  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.svg$).*)",
  ],
};
