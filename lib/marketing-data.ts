'use client'

import { useQuery } from '@tanstack/react-query'

export type PublicWebsite = {
  id: string
  domain: string
  name: string
  description: string | null
  favicon_url: string | null
  url: string
}

export type WebsitesResponse = { websites: PublicWebsite[] }

const EMPTY_WEBSITES: WebsitesResponse = { websites: [] }

// Shared client hook — used by the homepage cross-brand strip and the
// footer "Ateliers powered" row. React Query dedupes the request to a
// single network call per page even with multiple consumers.
export function useWebsites() {
  return useQuery<WebsitesResponse>({
    queryKey: ['marketing-websites'],
    queryFn: async () => {
      const res = await fetch('/api/websites')
      if (!res.ok) return EMPTY_WEBSITES
      return (await res.json()) as WebsitesResponse
    },
    staleTime: 5 * 60_000,
  })
}
