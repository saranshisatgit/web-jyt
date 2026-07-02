import type { Metadata } from "next"
import type { BrandConfig } from "@/lib/brand"

export function brandMetadata(brand: BrandConfig): Metadata {
  return {
    title: {
      template: `%s - ${brand.seo.name}`,
      default: `${brand.shortName} - ${brand.tagline}`,
    },
    description: brand.seo.description,
    openGraph: {
      type: "website",
      locale: "en_IN",
      siteName: brand.seo.name,
      title: `${brand.shortName} - ${brand.tagline}`,
      description: brand.seo.description,
      images: [{ url: `https://www.${brand.seo.domain}/opengraph-image`, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${brand.shortName} - ${brand.tagline}`,
      description: brand.seo.description,
      images: [`https://www.${brand.seo.domain}/opengraph-image`],
    },
  }
}
