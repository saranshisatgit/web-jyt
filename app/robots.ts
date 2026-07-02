import type { MetadataRoute } from 'next'
import { headers } from 'next/headers'
import { brandFromKey } from '@/lib/brand'

export default async function robots(): Promise<MetadataRoute.Robots> {
  const h = await headers()
  const brand = brandFromKey(h.get('x-brand'))

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/login/', '/agreement/', '/guides/', '/tours/'],
      },
    ],
    sitemap: `https://www.${brand.seo.domain}/sitemap.xml`,
  }
}
