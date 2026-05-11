import { NextRequest, NextResponse } from "next/server";
import { brandFromHostOrOverride } from "@/lib/brand";

export function middleware(request: NextRequest) {
  const host = request.headers.get("host");
  const override = request.nextUrl.searchParams.get("brand");
  const brand = brandFromHostOrOverride(host, override);

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-brand", brand.key);

  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.svg$).*)",
  ],
};
