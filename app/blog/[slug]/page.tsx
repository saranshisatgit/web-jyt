import { getSinglePost } from '@/app/actions'
import { BlogPostContent } from '@/components/blog-post-content'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import type { BlogPost } from '@/types/blog'

type Params = Promise<{ slug: string }>

export async function generateMetadata({
  params,
}: {
  params: Params
}): Promise<Metadata> {
  const post = await getSinglePost((await params).slug)

  return post ? { title: post.title } : {}
}

// Server Component to fetch data
export default async function BlogPost({
  params,
}: {
  params: Params
}) {
  // Get the post - it already matches our BlogPost type from the API
  const post = await getSinglePost((await params).slug) as unknown as BlogPost;
  if (!post) notFound();
  
  // Find the first block with text content for the main content
  const contentBlock = post.blocks?.find(block => 
    block.content && typeof block.content.text === 'object'
  )
  
  // Find the first block with image content for the main image
  const imageBlock = post.blocks?.find(block => 
    block.content && block.content.image && block.content.image.content
  )
  
  // Find the first block with authors array
  const authorsBlock = post.blocks?.find(block => 
    block.content && Array.isArray(block.content.authors) && block.content.authors.length > 0
  )
  
  return (
    <BlogPostContent 
      post={post} 
      contentBlock={contentBlock} 
      imageBlock={imageBlock} 
      authorsBlock={authorsBlock} 
    />
  );
}