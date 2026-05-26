import { type Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Navbar } from '@/components/navbar'
import { fetchPagefromAPI } from '@/app/actions'
import { getBlockByName, type Block } from '@/medu/queries'
import { getContentFallback } from '@/lib/content-fallbacks'

export const dynamic = 'force-dynamic'

type PageParams = Promise<{ slug: string }>

type MainContentBlockShape = { content: { content?: string } }

// Resolve the page's title/subtitle/html from either the CMS or the
// built-in fallback registry. Used by both generateMetadata and the
// page component so the two stay in sync.
async function resolveContent(slug: string) {
  const page = await fetchPagefromAPI(slug).catch(() => null)
  const headerBlock = getBlockByName(page?.blocks, 'Header') as Block | undefined
  const mainBlock = getBlockByName(page?.blocks, 'MainContent') as
    | (Block & MainContentBlockShape)
    | undefined

  const cmsTitle = headerBlock?.content?.title as string | undefined
  const cmsSubtitle = headerBlock?.content?.subtitle as string | undefined
  const cmsHtml = mainBlock?.content?.content

  if (cmsHtml || cmsTitle) {
    const fallback = getContentFallback(slug)
    return {
      title: cmsTitle || fallback?.title || 'Content',
      subtitle: cmsSubtitle || fallback?.subtitle || '',
      html: cmsHtml || fallback?.html || '',
      source: 'cms' as const,
    }
  }

  const fallback = getContentFallback(slug)
  if (fallback) return { ...fallback, source: 'fallback' as const }

  return null
}

export async function generateMetadata({ params }: { params: PageParams }): Promise<Metadata> {
  const { slug } = await params
  const data = await resolveContent(slug)
  if (!data) {
    return { title: 'Page not found' }
  }
  return {
    title: data.title.replace(/\.$/, ''),
    description: data.subtitle || undefined,
  }
}

export default async function ContentPage({ params }: { params: PageParams }) {
  const { slug } = await params
  const data = await resolveContent(slug)
  if (!data) notFound()

  return (
    <main>
      <Navbar />
      <section className="kt-hero compact">
        <div className="container">
          <span className="kt-eyebrow">
            <span className="dot" aria-hidden />
            {/* "Legal" is right for privacy/terms; generic CMS pages get
                the slug itself, which is at worst neutral. */}
            {slug === 'privacy-policy' || slug === 'terms-of-service' ? 'Legal' : slug}
          </span>
          <h1 className="kt-display l" style={{ marginTop: '20px', marginBottom: '16px' }}>
            {data.title}
          </h1>
          {data.subtitle && (
            <p
              className="muted"
              style={{ fontSize: '18px', maxWidth: '620px', lineHeight: 1.4, margin: 0 }}
            >
              {data.subtitle}
            </p>
          )}
        </div>
      </section>
      <section className="kt-section">
        <div className="container">
          <article
            className="prose prose-navy"
            style={{ maxWidth: '720px', margin: '0 auto' }}
            dangerouslySetInnerHTML={{ __html: data.html }}
          />
        </div>
      </section>
    </main>
  )
}
