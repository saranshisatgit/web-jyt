import { getAllBlogs } from '@/medu/queries'
import { Feed } from 'feed'
import assert from 'node:assert'
import type { BlogPost } from '@/types/blog'
import { getAuthors } from '@/types/blog'

export const dynamic = 'force-dynamic'

export async function GET() {
  const siteUrl = 'https://jaalyantra.com'

  const feed = new Feed({
    title: 'Jaal Yantra Textiles Blog',
    description: 'Latest articles from Jaal Yantra Textiles',
    author: {
      name: 'Saransh Sharma',
      email: 'saransh@jaalyantra.com',
    },
    id: siteUrl,
    link: siteUrl,
    language: 'en',
    image: `${siteUrl}/images/logo.png`,
    favicon: `${siteUrl}/favicon.ico`,
    copyright: `All rights reserved ${new Date().getFullYear()}, Jaal Yantra Textiles`,
    generator: 'Next.js',
    feedLinks: {
      json: `${siteUrl}/feed.json`,
      atom: `${siteUrl}/atom.xml`,
      rss2: `${siteUrl}/feed.xml`,
    },
  })
  
  const posts: BlogPost[] = await getAllBlogs('jaalyantra.com','')

 

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

    // Create a simple excerpt from the content if it doesn't exist
    const excerpt = post.content

    // Get authors using helper function
    const authorNames = getAuthors(post);
    
    // If no authors found, add a default author
    if (authorNames.length === 0) {
      authorNames.push('Jaal Yantra Textiles');
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
