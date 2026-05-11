'use client'

import Link from 'next/link'
import { useBrand } from '@/app/context/brand-context'
import { useWebsites } from '@/lib/marketing-data'

export function Footer() {
  const brand = useBrand()
  const year = new Date().getFullYear()
  const { data } = useWebsites()
  const websites = data?.websites ?? []

  return (
    <footer className="kt-footer">
      <div className="container">
        {websites.length > 0 && (
          <div className="kt-foot-ateliers">
            <span className="kt-eyebrow">Ateliers powered</span>
            <div className="kt-foot-ateliers-list">
              {websites.map((w) => (
                <a key={w.id} href={w.url} target="_blank" rel="noopener noreferrer">
                  {w.name}
                  <span className="kt-foot-ateliers-domain">{w.domain}</span>
                </a>
              ))}
            </div>
          </div>
        )}
        <div className="kt-foot-grid">
          <div>
            <Link href="/" className="kt-brand" aria-label={`${brand.wordmark} home`}>
              <span className="dot" aria-hidden />
              <span>
                <strong>{brand.wordmark}</strong>
              </span>
            </Link>
            <p className="muted" style={{ fontSize: '14px', maxWidth: '380px', lineHeight: 1.5, marginTop: '14px' }}>
              {brand.tagline} Made between {brand.geographies.join(', ')} — powered by Medo, an open-source production OS.
            </p>
          </div>
          <div>
            <h4>Makers</h4>
            <ul>
              <li><Link href="/#makers">Meet the makers</Link></li>
              <li><Link href="/#how-it-works">How it works</Link></li>
              <li><Link href="/blog">Journal</Link></li>
            </ul>
          </div>
          <div>
            <h4>Building</h4>
            <ul>
              <li><Link href="/about">About</Link></li>
              <li><Link href="/contact">Get a demo</Link></li>
              <li>
                <a href="https://github.com/Jaal-Yantra-Textiles/v2" target="_blank" rel="noopener noreferrer">
                  GitHub
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4>Reach</h4>
            <ul>
              <li><a href={`mailto:${brand.emails.primary}`}>{brand.emails.primary}</a></li>
              <li><a href={`mailto:${brand.emails.founder}`}>{brand.emails.founder}</a></li>
            </ul>
          </div>
        </div>
        <div className="kt-foot-bottom">
          <span>© {year} {brand.wordmark} · {brand.geographies.join(' · ')}</span>
          <span>Powered by Medo · open source</span>
        </div>
      </div>
    </footer>
  )
}
