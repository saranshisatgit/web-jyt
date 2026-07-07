'use client'

import { useState, useMemo, useCallback } from 'react'
import Link from 'next/link'
import { Button } from '@medusajs/ui'
import { Navbar } from '@/components/navbar'
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
  const { processedContent, drawerNode, featuredImageUrl } = useMemo(() => {
    if (!contentBlock?.content.text) return { processedContent: null, drawerNode: null, featuredImageUrl: null };

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

    const findFirstImageSrc = (nodes: TipTapNode[]): string | null => {
      for (const node of nodes) {
        if (node?.type === 'image' && node.attrs?.src) {
          return node.attrs.src as string
        }
        if (Array.isArray(node?.content)) {
          const found = findFirstImageSrc(node.content)
          if (found) return found
        }
      }
      return null
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

      // Determine the featured image URL: explicit imageBlock takes priority,
      // otherwise the first image in the content is the featured photo.
      let resolvedFeaturedUrl: string | null = null;

      if (imageBlock?.content.image?.content) {
        resolvedFeaturedUrl = imageBlock.content.image.content;
        // Remove the featured image's first occurrence from rich text
        removeFirstImageNode(tipTapDoc.content, resolvedFeaturedUrl)
      } else {
        // No explicit imageBlock — first image in content IS the featured photo
        resolvedFeaturedUrl = findFirstImageSrc(tipTapDoc.content)
        if (resolvedFeaturedUrl) {
          removeFirstImageNode(tipTapDoc.content, resolvedFeaturedUrl)
        }
      }

      // Clean up empty paragraphs left after image removal
      tipTapDoc.content = tipTapDoc.content.filter((paragraph: TipTapNode) => {
        return !(paragraph.type === 'paragraph' && (!paragraph.content || paragraph.content.length === 0));
      })

      return { processedContent: processedText, drawerNode: foundDrawerNode, featuredImageUrl: resolvedFeaturedUrl };
    }

    return { processedContent: processedText, drawerNode: foundDrawerNode, featuredImageUrl: null };
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
    <main>
      <Navbar />

      <section className="kt-section">
        <div className="container">
          <div className="kt-meta" style={{ marginBottom: '12px' }}>
            {dayjs(post.published_at).format('dddd · MMM D, YYYY')}
          </div>
          <h1 className="kt-display l" style={{ marginBottom: '24px' }}>
            {post.title}
          </h1>

          <div
            style={{
              marginTop: '48px',
              display: 'grid',
              // minmax(0, …) kills the track's min-content floor — a wide
              // stats-panel table otherwise forces the whole column (and
              // every <p> in it) past the viewport on mobile.
              gridTemplateColumns: 'minmax(0, 1fr)',
              gap: '32px',
              paddingBottom: '64px',
            }}
            className="lg:grid-cols-[15rem_minmax(0,1fr)] xl:grid-cols-[15rem_minmax(0,1fr)_15rem]"
          >
            <PostMetadataSidebar
              authorsBlock={authorsBlock}
              category={(post.public_metadata as { category?: string })?.category}
            />
            <div className="min-w-0">
              <PostMainContentArea
                post={post}
                featuredImageUrl={featuredImageUrl}
                processedContent={processedContent}
                drawerNode={drawerNode}
                showDebug={showDebug}
                setShowDebug={setShowDebug}
                onHtmlGenerated={handleHtmlGenerated}
                isDevelopment={isDevelopment}
                initialContentForDebug={contentBlock?.content.text}
                generatedHtml={generatedHtml}
              />
            </div>
            <PostTableOfContents
              generatedHtml={generatedHtml}
              onHeadingsChange={handleHeadingsChange}
              hasOriginalTocNode={hasOriginalTocNode}
              tocHeadingsCount={tocHeadingsCount}
              headings={headings}
            />
          </div>

          <div style={{ paddingBottom: '64px' }}>
            <Button asChild variant="secondary">
              <Link href="/blog">
                <ChevronLeftIcon className="size-3" />
                Back to journal
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="kt-section flush" style={{ background: 'var(--bg-deep)' }}>
        <div className="container" style={{ padding: '64px var(--container-pad)' }}>
          <SubscribeForm domainName="jaalyantra.com" />
        </div>
      </section>
    </main>
  )
}
