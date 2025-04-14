import { Block, getAllBlogs } from '@/medu/queries'
import { Feed } from 'feed'
import assert from 'node:assert'

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
  interface Author {
    name: string;
    [key: string]: unknown;
  }

  interface BlockContent {
    authors?: (string | Author)[];
    author?: string | { name: string; [key: string]: unknown };
    [key: string]: unknown;
  }

  interface BlogPost {
    title: string;
    slug: string;
    content: string;
    published_at: string;
    author: string;
    blocks: Block[];
  }
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

    // Add a default author if available in the post
    let authorNames: string[] = [];
    
    // First check if post has a direct author property
    if (post.author && typeof post.author === 'string' && post.author.trim() !== '') {
      authorNames.push(post.author);
    }
    
    // Then try to find authors in blocks
    if (authorNames.length === 0 && post.blocks) {
      // Log all blocks to debug
      console.log('Checking blocks for authors:', post.blocks.map(b => ({ name: b.name, type: b.type, content: b.content })));
      
      // Try to find authors block
      for (const block of post.blocks) {
        try {
          const content = block.content as BlockContent;
          
          // Check for authors array
          if (content && Array.isArray(content.authors) && content.authors.length > 0) {
            const blockAuthors = content.authors.map(author => 
              typeof author === 'string' ? author : (author.name || 'Unknown Author')
            );
            authorNames = [...authorNames, ...blockAuthors];
            break;
          }
          
          // Check for author field (singular)
          if (content && content.author) {
            if (typeof content.author === 'string') {
              authorNames.push(content.author);
            } else if (typeof content.author === 'object' && content.author.name) {
              authorNames.push(content.author.name);
            }
            break;
          }
        } catch (error) {
          console.log('Error processing block:', error);
        }
      }
    }
    
    // If still no authors found, add a default author
    if (authorNames.length === 0) {
      authorNames.push('Jaal Yantra Textiles');
    }
    
    console.log('Final author names:', authorNames)
    
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
