'use client'

import { useState, useMemo, useCallback } from 'react'
import { Button } from '@/components/button'
import { Container } from '@/components/container'
import { GradientBackground } from '@/components/gradient'
import { Navbar } from '@/components/navbar'
import { Heading, Subheading } from '@/components/text'
import { type HeadingItem } from '@/components/manual-table-of-contents'
import { PostTableOfContents, type HeadingItem as TocHeadingItem } from '@/components/PostTableOfContents'
import { PostMetadataSidebar } from '@/components/post-metadata-sidebar'
import { PostMainContentArea } from '@/components/post-main-content-area'
import SubscribeForm from '@/components/SubscribeForm'
import { ChevronLeftIcon } from '@heroicons/react/16/solid'
import dayjs from 'dayjs'
import type { BlogPost, BlogBlock, TipTapNode } from '@/types/blog'

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
    if (!contentBlock?.content.text?.content) return false;
    return contentBlock.content.text.content.some((node: TipTapNode) => node.type === 'tableOfContents');
  }, [contentBlock?.content.text]);
  
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

    const countImageOccurrences = (nodes: TipTapNode[], matchSrc?: string): number => {
      let count = 0
      for (const node of nodes) {
        if (node?.type === 'image') {
          const src = node.attrs?.src as string | undefined
          if (!matchSrc || (src && src === matchSrc)) {
            count++
          }
        }

        if (Array.isArray(node?.content)) {
          count += countImageOccurrences(node.content, matchSrc)
        }
      }
      return count
    }

    const removeFirstImageNode = (nodes: TipTapNode[], matchSrc?: string): boolean => {
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i]
        if (node?.type === 'image') {
          const src = node.attrs?.src as string | undefined
          if (!matchSrc || (src && src === matchSrc)) {
            nodes.splice(i, 1)
            return true
          }
        }

        if (Array.isArray(node?.content)) {
          const removed = removeFirstImageNode(node.content, matchSrc)
          if (removed) {
            if (node.type === 'paragraph' && (!node.content || node.content.length === 0)) {
              nodes.splice(i, 1)
            }
            return true
          }
        }
      }

      return false
    }

    if (tipTapDoc.type === 'doc' && Array.isArray(tipTapDoc.content)) {
      // Find and extract the drawer node
      const drawer = tipTapDoc.content.find(node => node.type === 'drawer') as DrawerNode | undefined;
      if (drawer) {
        foundDrawerNode = drawer;
      }

      // Filter out both drawer and tableOfContents nodes
      tipTapDoc.content = tipTapDoc.content.filter(node => node.type !== 'drawer' && node.type !== 'tableOfContents');

      // Remove main image only if duplicated within the rich text content
      if (imageBlock?.content.image?.content) {
        const mainImageUrl = imageBlock.content.image.content

        const matchingCount = countImageOccurrences(tipTapDoc.content, mainImageUrl)

        if (matchingCount > 1) {
          removeFirstImageNode(tipTapDoc.content, mainImageUrl)
        }
        
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
