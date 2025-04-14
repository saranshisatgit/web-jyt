import { getSinglePost } from '@/app/actions'
import { BlogPostContent } from '@/components/blog-post-content'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

// Define interfaces for blog post structure
interface BlogBlock {
  id: string;
  type: string;
  content: {
    authors?: string[];
    image?: {
      content?: string;
    };
    text?: Record<string, unknown>;
    [key: string]: unknown;
  };
  order: number;
}

interface BlogPost {
  title: string;
  slug: string;
  publishedAt: string;
  excerpt?: string;
  blocks?: BlogBlock[];
  [key: string]: unknown;
}

// Interface to match the Page type returned by getSinglePost
interface Page {
  title: string;
  slug: string;
  content: string;
  status: string;
  page_type: string;
  publishedAt: string;
  blocks: BlogBlock[];
}

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
  // Get the post and convert it to our BlogPost type
  const postData = await getSinglePost((await params).slug) as unknown as Page;
  if (!postData) notFound();
  
  // Convert to our BlogPost type
  const post: BlogPost = {
    title: postData.title,
    slug: postData.slug,
    publishedAt: postData.publishedAt,
    blocks: postData.blocks,
  };
  
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