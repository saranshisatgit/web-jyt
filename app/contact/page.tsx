import type { Metadata } from 'next'
import { Suspense } from 'react'
import { headers } from 'next/headers'
import { Navbar } from '@/components/navbar'
import { fetchPagefromAPI } from '../actions'
import { type Block, getBlockByName } from '@/medu/queries'
import { SectionLoading } from '@/components/section-loading'
import ContactForm from '@/components/ContactForm'
import { brandFromKey } from '@/lib/brand'

interface LinkItem {
  text: string
  url: string
  target?: string
}

interface ContactInfoContent {
  title?: string
  introParagraph?: string
  links?: LinkItem[]
  wholesaleInquiryText?: string
  mainContentParagraph?: string
  address?: string
  phone?: string
  email?: string
}

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const h = await headers()
  const brand = brandFromKey(h.get('x-brand'))
  return {
    title: 'Contact',
    description: `Get in touch with the ${brand.seo.name} sales team — bespoke textiles, production runs, and platform demos.`,
  }
}

const DEFAULT_INFO: ContactInfoContent = {
  title: 'Contact our sales team',
  introParagraph:
    "We're here to help you find the right textile partner. Whether it's a custom quote, a bespoke run, or a platform demo — the team responds within one business day.",
  links: [{ text: 'cicilabel.com', url: 'https://cicilabel.com', target: '_blank' }],
  wholesaleInquiryText: 'For other wholesale inquiries please use the form.',
  mainContentParagraph:
    'Our team has extensive experience in the textile industry — trends, materials, production techniques, and routing tasks across global artisan partners.',
  address: '123 Textile Avenue, Weaverville, TX 75001, USA',
  phone: '+1 (555) 123-4567',
  email: 'sales@jaalyantra.com',
}

export default async function ContactPage() {
  const h = await headers()
  const brand = brandFromKey(h.get('x-brand'))
  const pageData = await fetchPagefromAPI('contact')
  if (!pageData) {
    return (
      <main>
        <Navbar />
        <section className="kt-section">
          <div className="container">
            <p className="muted">Loading…</p>
          </div>
        </section>
      </main>
    )
  }

  const cmsHeader = getBlockByName(pageData.blocks, 'Header') as Block | undefined
  const cmsContactInfo = getBlockByName(pageData.blocks, 'ContactInfo') as Block | undefined
  const cmsContent =
    (cmsContactInfo?.content as ContactInfoContent | undefined) || {}

  const info: ContactInfoContent = { ...DEFAULT_INFO, ...cmsContent, email: brand.emails.primary }
  const headerContent = cmsHeader?.content as
    | { title?: string; subtitle?: string }
    | undefined
  const heroTitle = headerContent?.title || 'Get in touch.'
  const heroSubtitle =
    headerContent?.subtitle || 'We typically respond within one business day.'

  const phoneHref = info.phone ? `tel:${info.phone.replace(/[\s()]/g, '')}` : '#'

  return (
    <main>
      <Navbar />

      <section className="kt-hero">
        <div className="container">
          <div className="kt-hero-grid">
            <div>
              <span className="kt-eyebrow">
                <span className="dot" aria-hidden />
                Contact
              </span>
              <h1
                className="kt-display xl"
                style={{ marginTop: '20px', marginBottom: '16px' }}
              >
                {heroTitle}
              </h1>
              <p
                className="muted"
                style={{
                  fontSize: '18px',
                  maxWidth: '620px',
                  lineHeight: 1.4,
                  margin: 0,
                }}
              >
                {heroSubtitle}
              </p>
            </div>
            <aside className="kt-hero-side">
              <div className="row"><span className="k">Response</span><span className="v">≤ 1 day</span></div>
              <div className="row"><span className="k">Languages</span><span className="v">EN · IT · HI</span></div>
              <div className="row"><span className="k">Hours</span><span className="v">Mon–Fri 9–18 CET</span></div>
              <div className="row">
                <span className="k">Email</span>
                <span className="v" style={{ fontSize: '20px' }}>{info.email}</span>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="kt-section">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <div className="kt-eyebrow">Talk to us</div>
              <h2 className="kt-display m" style={{ marginTop: '12px', marginBottom: '20px' }}>
                {info.title}
              </h2>
              <p className="muted" style={{ fontSize: '17px', lineHeight: 1.6, marginBottom: '24px' }}>
                {info.introParagraph}
              </p>

              {info.links && info.links.length > 0 && (
                <div style={{ marginBottom: '24px' }}>
                  {info.links.map((link, i) => (
                    <p key={i} className="muted" style={{ fontSize: '15px', margin: '8px 0' }}>
                      {link.url.includes('cicilabel.com')
                        ? 'Buy from our bespoke label: '
                        : ''}
                      <a
                        href={link.url}
                        target={link.target || '_self'}
                        rel={link.target === '_blank' ? 'noopener noreferrer' : undefined}
                        style={{ color: 'var(--accent-deep)', textDecoration: 'underline' }}
                      >
                        {link.text}
                      </a>
                    </p>
                  ))}
                </div>
              )}

              {info.wholesaleInquiryText && (
                <p className="muted" style={{ fontSize: '15px', margin: '0 0 16px' }}>
                  {info.wholesaleInquiryText}
                </p>
              )}

              {info.mainContentParagraph && (
                <p className="muted" style={{ fontSize: '15px', lineHeight: 1.6, marginBottom: '32px' }}>
                  {info.mainContentParagraph}
                </p>
              )}

              <address style={{ fontStyle: 'normal', marginBottom: '32px' }}>
                <div className="kt-meta" style={{ marginBottom: '8px' }}>HQ</div>
                {info.address?.split(',').map((line, i) => (
                  <span
                    key={i}
                    style={{ display: 'block', fontSize: '15px', color: 'var(--ink-soft)' }}
                  >
                    {line.trim()}
                  </span>
                ))}
              </address>

              <div style={{ borderTop: '1px solid var(--rule)', paddingTop: '24px' }}>
                <div className="kt-meta" style={{ marginBottom: '12px' }}>Reach out directly</div>
                <p style={{ fontSize: '16px', lineHeight: 1.55, margin: 0 }}>
                  <a
                    href={phoneHref}
                    style={{ color: 'var(--accent-deep)', textDecoration: 'none' }}
                  >
                    {info.phone}
                  </a>
                  <span style={{ color: 'var(--ink-mute)', margin: '0 8px' }}>·</span>
                  <a
                    href={`mailto:${info.email}`}
                    style={{ color: 'var(--accent-deep)', textDecoration: 'none' }}
                  >
                    {info.email}
                  </a>
                </p>
              </div>
            </div>

            <div>
              <Suspense fallback={<SectionLoading />}>
                <ContactForm />
              </Suspense>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
