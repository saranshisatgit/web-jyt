import type { Metadata } from 'next'

// page.tsx is "use client" (we read x-currency via context to render
// localized pricing). Metadata can't live on a client component, so the
// SEO title/description sits here in a passthrough layout instead.
export const metadata: Metadata = {
  title: 'Pricing',
  description:
    'Pricing for artisans, brands, and designers — from a marketplace seat to a full production OS. Live conversion to your local currency.',
}

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return children
}
