import { NextRequest, NextResponse } from "next/server"
import companyData from "@/data/company.json"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const region = searchParams.get("region")

  if (region && !["india", "eu"].includes(region)) {
    return NextResponse.json({ error: "invalid_region" }, { status: 400 })
  }

  const data = region
    ? { [region]: companyData[region as keyof typeof companyData] }
    : companyData

  const response = NextResponse.json(data)
  response.headers.set("Cache-Control", "public, max-age=3600, stale-while-revalidate=7200")
  return response
}
