'use client'

import { useState, useMemo } from 'react'
import type { NpmPackage } from '@/app/solutions/integrations/page'

function formatDownloads(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M/mo`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K/mo`
  return `${n}/mo`
}

export function IntegrationsGrid({
  categories,
  initialCount,
}: {
  categories: [string, NpmPackage[]][]
  initialCount: number
}) {
  const allCategories = categories.map(([c]) => c)

  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const allPackages = useMemo(
    () => categories.flatMap(([, pkgs]) => pkgs),
    [categories]
  )

  const filtered = useMemo(() => {
    let list = activeCategory
      ? allPackages.filter((p) => p.category === activeCategory)
      : allPackages
    if (search) {
      const q = search.toLowerCase()
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      )
    }
    return list
  }, [allPackages, activeCategory, search])

  const grouped = useMemo(() => {
    const map = new Map<string, NpmPackage[]>()
    for (const pkg of filtered) {
      const cat = pkg.category
      if (!map.has(cat)) map.set(cat, [])
      map.get(cat)!.push(pkg)
    }
    return [...map.entries()].sort(([a], [b]) => {
      if (a === 'Other') return 1
      if (b === 'Other') return -1
      return (map.get(b)?.length ?? 0) - (map.get(a)?.length ?? 0)
    })
  }, [filtered])

  return (
    <div>
      <div
        style={{
          display: 'flex',
          gap: '16px',
          flexWrap: 'wrap',
          alignItems: 'center',
          marginBottom: '32px',
        }}
      >
        <input
          type="text"
          placeholder="Search integrations…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            flex: '1 1 280px',
            padding: '10px 16px',
            borderRadius: 'var(--r-md)',
            border: '1px solid var(--rule)',
            background: 'var(--bg)',
            color: 'var(--ink)',
            fontSize: 15,
            outline: 'none',
          }}
        />
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveCategory(null)}
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--r-sm)',
              border: activeCategory === null ? '2px solid var(--accent)' : '1px solid var(--rule)',
              background: activeCategory === null ? 'var(--accent-pale)' : 'transparent',
              color: 'var(--ink)',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: activeCategory === null ? 600 : 400,
            }}
          >
            All ({initialCount})
          </button>
          {allCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: '6px 14px',
                borderRadius: 'var(--r-sm)',
                border: activeCategory === cat ? '2px solid var(--accent)' : '1px solid var(--rule)',
                background: activeCategory === cat ? 'var(--accent-pale)' : 'transparent',
                color: 'var(--ink)',
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: activeCategory === cat ? 600 : 400,
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 && (
        <p className="muted" style={{ textAlign: 'center', padding: '48px 0' }}>
          No integrations match your search.
        </p>
      )}

      {grouped.map(([category, pkgs]) => (
        <div key={category} style={{ marginBottom: '48px' }}>
          <h2 className="kt-display s" style={{ marginBottom: '16px' }}>
            {category}
            <span style={{ fontSize: 14, fontWeight: 400, opacity: 0.5, marginLeft: 10 }}>
              {pkgs.length}
            </span>
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '16px',
            }}
          >
            {pkgs.map((pkg) => (
              <a
                key={pkg.name}
                href={pkg.links.npm ?? pkg.links.homepage ?? '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="kt-card"
                style={{
                  display: 'block',
                  padding: '20px',
                  textDecoration: 'none',
                  color: 'inherit',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '8px',
                  }}
                >
                  <span style={{ fontWeight: 600, fontSize: 15, wordBreak: 'break-all' }}>
                    {pkg.name.replace(/^@/, '').replace(/\//, ' / ')}
                  </span>
                  {pkg.downloads.monthly > 0 && (
                    <span
                      style={{
                        fontSize: 11,
                        whiteSpace: 'nowrap',
                        padding: '2px 8px',
                        borderRadius: 'var(--r-sm)',
                        background: 'var(--accent-pale)',
                        color: 'var(--accent-deep)',
                        marginLeft: 8,
                        flexShrink: 0,
                      }}
                    >
                      {formatDownloads(pkg.downloads.monthly)}
                    </span>
                  )}
                </div>
                <p
                  className="muted"
                  style={{ fontSize: 13, lineHeight: 1.5, margin: 0 }}
                >
                  {pkg.description || 'No description'}
                </p>
                {pkg.publisher?.username && (
                  <div
                    style={{
                      fontSize: 12,
                      opacity: 0.5,
                      marginTop: '10px',
                    }}
                  >
                    By {pkg.publisher.username}
                  </div>
                )}
              </a>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
