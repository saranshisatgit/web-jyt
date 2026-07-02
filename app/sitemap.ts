import type { MetadataRoute } from 'next'
import { headers } from 'next/headers'
import { brandFromKey } from '@/lib/brand'
import { getAllBlogs } from '@/medu/queries'

const staticPages: Array<{ path: string; priority: number; changeFrequency: 'monthly' | 'weekly' | 'yearly' }> = [
  { path: '', priority: 1.0, changeFrequency: 'monthly' },
  { path: '/about', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/blog', priority: 0.9, changeFrequency: 'weekly' },
  { path: '/contact', priority: 0.7, changeFrequency: 'yearly' },
  { path: '/map', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/partner', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/pricing', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/solutions', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/login', priority: 0.3, changeFrequency: 'yearly' },
  { path: '/privacy-policy', priority: 0.3, changeFrequency: 'yearly' },
  { path: '/terms-of-service', priority: 0.3, changeFrequency: 'yearly' },
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const h = await headers()
  const brand = brandFromKey(h.get('x-brand'))
  const baseUrl = `https://www.${brand.seo.domain}`

  const entries: MetadataRoute.Sitemap = staticPages.map((page) => ({
    url: `${baseUrl}${page.path}`,
    lastModified: new Date(),
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }))

  try {
    const blogs = await getAllBlogs(brand.seo.domain, '')
    if (Array.isArray(blogs) && blogs.length > 0) {
      for (const blog of blogs) {
        entries.push({
          url: `${baseUrl}/blog/${blog.slug}`,
          lastModified: blog.published_at ? new Date(blog.published_at) : new Date(),
          changeFrequency: 'monthly',
          priority: 0.6,
        })
      }
    }
  } catch {
    console.warn('Failed to fetch blogs for sitemap — skipping dynamic entries')
  }

  return entries
}
