'use client'

import Image from 'next/image'
import { useQuery } from '@tanstack/react-query'

/**
 * The brands that ship on our rails today. Pulled from the same
 * /api/partners endpoint the home page uses, filtered to live
 * storefronts. We prefer a wordmark tile over an image because most
 * brands haven't uploaded a logo to their partner record yet — when a
 * logo URL is present we fall back to that. Each tile links to the
 * brand's storefront.
 */

type PublicBrand = {
  id: string
  name: string
  handle: string
  logo: string | null
  storefront_url: string
  is_live: boolean
}

type PartnersResponse = { brands: PublicBrand[] }

function useLiveBrands() {
  return useQuery<PartnersResponse>({
    queryKey: ['partner-page-live-brands'],
    queryFn: async () => {
      const res = await fetch('/api/partners')
      if (!res.ok) return { brands: [] }
      return (await res.json()) as PartnersResponse
    },
    staleTime: 60_000,
  })
}

export function LiveBrandsStrip() {
  const { data, isLoading } = useLiveBrands()
  const brands = (data?.brands ?? []).filter((b) => b.is_live && b.storefront_url)

  if (isLoading) {
    return (
      <section className="kt-section">
        <div className="container">
          <div className="kt-meta" style={{ marginBottom: '24px', textAlign: 'center' }}>
            Brands shipping with us
          </div>
          <div className="kt-live-brands-skeleton" aria-hidden />
        </div>
      </section>
    )
  }

  if (brands.length === 0) return null

  return (
    <section className="kt-section" id="brands-shipping">
      <div className="container">
        <div className="kt-meta" style={{ marginBottom: '24px', textAlign: 'center' }}>
          Brands shipping with us
        </div>
        <div className="kt-live-brands-grid">
          {brands.map((b) => (
            <a
              key={b.id}
              href={b.storefront_url}
              target="_blank"
              rel="noopener noreferrer"
              className="kt-live-brand-tile"
              aria-label={`Visit ${b.name?.trim()} storefront`}
            >
              {b.logo ? (
                <Image
                  src={b.logo}
                  alt={b.name?.trim() || b.handle}
                  width={140}
                  height={56}
                  style={{ objectFit: 'contain', maxHeight: '56px', width: 'auto' }}
                />
              ) : (
                <span className="kt-live-brand-wordmark">{(b.name || b.handle).trim()}</span>
              )}
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
