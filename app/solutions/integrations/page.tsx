import type { Metadata } from 'next'
import { Button } from '@medusajs/ui'
import { Navbar } from '@/components/navbar'
import { HeroArt } from '@/components/hero-art'
import { IntegrationsGrid } from '@/components/integrations-grid'
export const metadata: Metadata = {
  title: 'Integrations',
  description:
    'Browse and discover integrations and plugins for your Medusa storefront.',
}

const CATEGORY_KEYWORDS: Record<string, string> = {
  'medusa-plugin-payment': 'Payment',
  'medusa-plugin-notification': 'Notification',
  'medusa-plugin-fulfillment': 'Fulfillment',
  'medusa-plugin-search': 'Search',
  'medusa-plugin-cms': 'Content',
  'medusa-plugin-analytics': 'Analytics',
  'medusa-plugin-authentication': 'Authentication',
  'medusa-plugin-auth': 'Authentication',
  'medusa-plugin-erp': 'ERP',
  'medusa-plugin-file': 'File Providers',
  'medusa-plugin-other': 'Other',
  'medusa-plugin-shipping': 'Shipping',
  'medusa-plugin-automations': 'Automations',
  'medusa-plugin-discount': 'Promotions',
  'medusa-plugin-tax': 'Tax',
}

function categorize(keywords: string[]): string {
  for (const kw of keywords) {
    const cat = CATEGORY_KEYWORDS[kw]
    if (cat) return cat
    const m = kw.match(/^medusa-plugin-(.+)$/)
    if (m) return m[1].charAt(0).toUpperCase() + m[1].slice(1)
  }
  return 'Other'
}

export type NpmPackage = {
  name: string
  description: string
  version: string
  keywords: string[]
  links: { npm?: string; homepage?: string; repository?: string }
  publisher: { username?: string }
  downloads: { monthly: number }
  date: string
  category: string
}

async function fetchPackages(): Promise<NpmPackage[]> {
  try {
    const res = await fetch(
      'https://registry.npmjs.org/-/v1/search?text=keywords:medusa-plugin-integration,medusa-v2&size=250',
      { next: { revalidate: 300 } }
    )
    if (!res.ok) return []
    const data: { objects?: { package: any; downloads?: { monthly: number } }[] } =
      await res.json()
    return (data.objects ?? []).map((obj) => ({
      ...obj.package,
      downloads: obj.downloads ?? { monthly: 0 },
      category: categorize(obj.package.keywords ?? []),
    }))
  } catch {
    return []
  }
}

export default async function IntegrationsPage() {
  const packages = await fetchPackages()

  const categories = new Map<string, NpmPackage[]>()
  for (const pkg of packages) {
    const cat = pkg.category
    if (!categories.has(cat)) categories.set(cat, [])
    categories.get(cat)!.push(pkg)
  }

  const sortedCategories = [...categories.entries()].sort(([a], [b]) => {
    if (a === 'Other') return 1
    if (b === 'Other') return -1
    return (categories.get(b)?.length ?? 0) - (categories.get(a)?.length ?? 0)
  })

  return (
    <main>
      <Navbar />

      <section className="kt-hero relative isolate">
        <HeroArt />
        <div className="container kt-hero-content">
          <div className="kt-eyebrow">Integrations</div>
          <h1 className="kt-display l" style={{ marginTop: '16px' }}>
            Extend your store with plugins
          </h1>
          <p
            className="muted"
            style={{
              fontSize: '19px',
              lineHeight: 1.55,
              marginTop: '20px',
              maxWidth: '720px',
            }}
          >
            Medusa v2–compatible integrations and plugins for your JYT storefront.
            Browse the library, then install any package directly from your
            SaaS Cloud dashboard.
          </p>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              marginTop: '24px',
              padding: '8px 16px',
              borderRadius: 'var(--r-md)',
              background: 'var(--accent-pale)',
              fontSize: 13,
              color: 'var(--accent-deep)',
            }}
          >
            Available on JYT SaaS Cloud
          </div>
        </div>
      </section>

      <section className="kt-section">
        <div className="container">
          <IntegrationsGrid
            categories={sortedCategories}
            initialCount={packages.length}
          />
        </div>
      </section>

      <section className="kt-section">
        <div className="container">
          <h2 className="kt-display m">Publish your own</h2>
          <p className="muted" style={{ maxWidth: '640px' }}>
            Build your own custom integration with the Medusa API and publish it on
            npm to share with the community.
          </p>
          <div style={{ marginTop: '32px', display: 'flex', gap: '16px', alignItems: 'center' }}>
            <Button asChild>
              <a
                href="https://docs.medusajs.com/contributions/plugins"
                target="_blank"
                rel="noopener noreferrer"
              >
                Get started
              </a>
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}
