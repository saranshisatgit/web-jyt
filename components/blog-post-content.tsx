'use client'

import { useState, useMemo, useCallback } from 'react'
import { Button } from '@/components/button'
import { Container } from '@/components/container'
import { GradientBackground } from '@/components/gradient'
import { Navbar } from '@/components/navbar'
import { Heading, Subheading } from '@/components/text'
// TipTapRenderer import removed (now used within PostMainContentArea)
// ManualDrawer import removed (now used within PostMainContentArea)
// ManualTableOfContents import removed, HeadingItem might be aliased from PostTableOfContents
import { type HeadingItem } from '@/components/manual-table-of-contents' // Keep for state type for now
import { PostTableOfContents, type HeadingItem as TocHeadingItem } from '@/components/PostTableOfContents'
import { PostMetadataSidebar, type BlogBlock } from '@/components/post-metadata-sidebar'
import { PostMainContentArea } from '@/components/post-main-content-area'; // Added import for PostMainContentArea
import SubscribeForm from '@/components/SubscribeForm'; // Added import for SubscribeForm
import { ChevronLeftIcon } from '@heroicons/react/16/solid'
import dayjs from 'dayjs'
// Image import removed as it's now used within PostMainContentArea

// Define interfaces for TipTap content structure
export interface TipTapNode {
  type: string;
  attrs?: Record<string, unknown>; // Changed any to unknown
  content?: TipTapNode[];
  text?: string;
  marks?: Array<Record<string, unknown>>; // Changed any to unknown
  [key: string]: unknown; // Changed any to unknown, Allow other properties specific to node types
}

export interface TipTapJsonStructure {
  type: 'doc';
  content: TipTapNode[];
}

// BlogBlock interface moved to PostMetadataSidebar temporarily
// TODO: Centralize type definitions (e.g., in types/blog.ts)

export interface BlogPost {
  title: string;
  slug: string;
  published_at: string;
  excerpt?: string;
  blocks?: BlogBlock[];
  content?: { // Made content optional
    json: TipTapJsonStructure;
  };
  public_metadata?: Record<string, unknown>; // Use public_metadata
  [key: string]: unknown;
}

export function BlogPostContent({ 
  post, 
  contentBlock, 
  imageBlock, 
  authorsBlock 
}: { 
  post: BlogPost, 
  contentBlock?: BlogBlock, 
  imageBlock?: BlogBlock, 
  authorsBlock?: BlogBlock 
}) {

  // State to store the generated HTML
  const [generatedHtml, setGeneratedHtml] = useState<string>('')
  
  // State to toggle debug view
  const [showDebug, setShowDebug] = useState(false)
  const [tocHeadingsCount, setTocHeadingsCount] = useState(0)
  const [headings, setHeadings] = useState<HeadingItem[]>([]) // State for actual heading items

  const hasOriginalTocNode = useMemo(() => {
    if (!post.content?.json.content) return false;
    return post.content.json.content.some((node) => node.type === 'tableOfContents');
  }, [post.content?.json.content]);
  
  // Check if running in development/local environment
  const isDevelopment = process.env.NODE_ENV === 'development'
  
  // Process the content to remove the main image and extract the drawer
  const { processedContent, drawerNode } = useMemo(() => {
    if (!contentBlock?.content.text) return { processedContent: null, drawerNode: null };

    const processedText = JSON.parse(JSON.stringify(contentBlock.content.text));

    interface TipTapNode {
      type: string;
      attrs?: { [key: string]: unknown };
      content?: TipTapNode[];
      text?: string;
      marks?: Array<Record<string, unknown>>;
      [key: string]: unknown; // Add index signature to match exported type
    }
    
    interface DrawerAttrs {
      src: string;
      alt: string;
      width: number;
      height: number;
      align: 'left' | 'center' | 'right';
      title?: string | null;
      [key: string]: unknown; // Allow other properties to match base type
    }

    interface DrawerNode extends TipTapNode {
        type: 'drawer';
        attrs?: DrawerAttrs; // Make optional to match base interface
    }

    const tipTapDoc = processedText as { type: string; content: TipTapNode[] };
    let foundDrawerNode: DrawerNode | null = null;

    if (tipTapDoc.type === 'doc' && Array.isArray(tipTapDoc.content)) {
      // Find and extract the drawer node
      const drawer = tipTapDoc.content.find(node => node.type === 'drawer') as DrawerNode | undefined;
      if (drawer) {
        foundDrawerNode = drawer;
      }

      // Filter out both drawer and tableOfContents nodes
      tipTapDoc.content = tipTapDoc.content.filter(node => node.type !== 'drawer' && node.type !== 'tableOfContents');

      // Remove main image if duplicated
      if (imageBlock?.content.image?.content) {
        const mainImageUrl = imageBlock.content.image.content
        let foundMainImage = false
        
        tipTapDoc.content = tipTapDoc.content.map((paragraph: TipTapNode) => {
          if (foundMainImage) return paragraph
          
          if (paragraph.type === 'paragraph' && Array.isArray(paragraph.content)) {
            paragraph.content = paragraph.content.filter((node: TipTapNode) => {
              if (!foundMainImage && node.type === 'image' && (node.attrs?.src as string) === mainImageUrl) {
                foundMainImage = true
                return false
              }
              return true
            })
          }
          return paragraph
        })
        
        tipTapDoc.content = tipTapDoc.content.filter((paragraph: TipTapNode) => {
          return !(paragraph.type === 'paragraph' && (!paragraph.content || paragraph.content.length === 0));
        })
      }
    }
    
    return { processedContent: processedText, drawerNode: foundDrawerNode };
  }, [contentBlock?.content.text, imageBlock?.content.image?.content]);
  
  // Handler for when HTML is generated
  const handleHtmlGenerated = (html: string) => {
    setGeneratedHtml(html)
  }

  const handleHeadingsChange = useCallback((newHeadings: TocHeadingItem[], count: number) => {
    setHeadings(newHeadings as HeadingItem[]); // Cast if TocHeadingItem is structurally same as HeadingItem
    setTocHeadingsCount(count);
  }, []); // Dependencies setHeadings & setTocHeadingsCount are stable

  return (
    <main className="overflow-hidden">
      <GradientBackground />
      <Container>
        <Navbar />
        <Subheading className="mt-16">
          {dayjs(post.published_at).format('dddd, MMMM D, YYYY')}
        </Subheading>
        <Heading as="h1" className="mt-2">
          {post.title}
        </Heading>
        <div className="mt-16 grid grid-cols-1 gap-8 pb-24 lg:grid-cols-[15rem_1fr] xl:grid-cols-[15rem_1fr_15rem]">
          {/* Left sidebar for post metadata */}
          <PostMetadataSidebar 
            authorsBlock={authorsBlock} 
            category={(post.public_metadata as { category?: string })?.category} 
          />
          <div className="text-gray-700">
            <PostMainContentArea 
              post={post}
              imageBlock={imageBlock}
              processedContent={processedContent}
              drawerNode={drawerNode}
              showDebug={showDebug}
              setShowDebug={setShowDebug}
              onHtmlGenerated={handleHtmlGenerated}
              isDevelopment={isDevelopment}
              initialContentForDebug={contentBlock?.content.text}
              generatedHtml={generatedHtml} // Pass generatedHtml for debug view
            />
          </div> {/* Closes the center content's outer div (text-gray-700) */}

          {/* Right sidebar for Table of Contents - should be the third column of the main grid */}
          <PostTableOfContents 
            generatedHtml={generatedHtml}
            onHeadingsChange={handleHeadingsChange}
            hasOriginalTocNode={hasOriginalTocNode}
            tocHeadingsCount={tocHeadingsCount}
            headings={headings}
          />
        </div> {/* Closes the main three-column grid div (mt-16 grid...) */}

      <div className="pb-24">
        <Button href="/blog" variant="secondary" className="gap-1">
          <ChevronLeftIcon className="size-4" />
          Back to blog
        </Button>
      </div>

    </Container>

      {/* Subscription Form Section with Gradient Background */}
      <div className="relative py-16 sm:py-24">
        <div className="absolute inset-0">
          <GradientBackground />
        </div>
        <Container className="relative z-10">
          <SubscribeForm domainName="jaalyantra.com" />
        </Container>
      </div>

  </main>
)
}
