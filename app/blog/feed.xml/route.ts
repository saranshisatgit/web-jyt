import { getAllBlogs } from '@/medu/queries'
import { Feed } from 'feed'
import assert from 'node:assert'
import type { BlogPost } from '@/types/blog'
import { getAuthors } from '@/types/blog'
import type { NextRequest } from 'next/server'
import { brandFromKey } from '@/lib/brand'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const brand = brandFromKey(request.headers.get('x-brand'))
  const siteUrl = `https://www.${brand.seo.domain}`

  const feed = new Feed({
    title: `${brand.seo.name} Blog`,
    description: `Latest articles from ${brand.seo.name}`,
    author: {
      name: 'Saransh Sharma',
      email: brand.emails.founder,
    },
    id: siteUrl,
    link: siteUrl,
    language: 'en',
    image: `${siteUrl}/images/logo.png`,
    favicon: `${siteUrl}/favicon.ico`,
    copyright: `All rights reserved ${new Date().getFullYear()}, ${brand.seo.name}`,
    generator: 'Next.js',
    feedLinks: {
      json: `${siteUrl}/feed.json`,
      atom: `${siteUrl}/atom.xml`,
      rss2: `${siteUrl}/feed.xml`,
    },
  })
  
  const posts: BlogPost[] = await getAllBlogs(brand.seo.domain,'')

  posts.forEach((post) => {
    try {
      assert(typeof post.title === 'string')
      assert(typeof post.slug === 'string')
      assert(typeof post.content === 'string')
      assert(typeof post.published_at === 'string')
    } catch (error) {
      console.log('Post is missing required fields for RSS feed:',error)
      return
    }

    const excerpt = post.content

    const authorNames = getAuthors(post);
    
    if (authorNames.length === 0) {
      authorNames.push(brand.seo.name);
    }
    
    feed.addItem({
      title: post.title,
      id: post.slug,
      link: `${siteUrl}/blog/${post.slug}`,
      description: excerpt,
      content: post.content,
      date: new Date(post.published_at),
      author: authorNames.map(name => ({ name })),
    })
  })

  return new Response(feed.rss2(), {
    status: 200,
    headers: {
      'content-type': 'application/xml',
      'cache-control': 's-maxage=31556952',
    },
  })
}
