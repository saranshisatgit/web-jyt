'use client'

import { useState, useMemo } from 'react'
import { Button } from '@/components/button'
import { Container } from '@/components/container'
import { GradientBackground } from '@/components/gradient'
import { Navbar } from '@/components/navbar'
import { Heading, Subheading } from '@/components/text'
import { TipTapRenderer } from '@/components/tiptap-renderer'
import { ChevronLeftIcon } from '@heroicons/react/16/solid'
import dayjs from 'dayjs'
import Image from 'next/image'

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
  
  // Check if running in development/local environment
  const isDevelopment = process.env.NODE_ENV === 'development'
  
  // Process the content to remove the main image if it's duplicated
  const processedContent = useMemo(() => {
    if (!contentBlock?.content.text) return null
    
    // Create a deep copy of the content to avoid mutating the original
    const processedText = JSON.parse(JSON.stringify(contentBlock.content.text))
    
    // Check if we have a main image to filter out
    if (imageBlock?.content.image?.content) {
      const mainImageUrl = imageBlock.content.image.content
      
      // Define interface for TipTap document structure
      interface TipTapNode {
        type: string;
        attrs?: {
          src?: string;
          [key: string]: unknown;
        };
        content?: TipTapNode[];
        [key: string]: unknown;
      }
      
      // For TipTap/ProseMirror document structure
      const tipTapDoc = processedText as { type: string; content: TipTapNode[] };
      if (tipTapDoc.type === 'doc' && Array.isArray(tipTapDoc.content)) {
        let foundMainImage = false
        
        // Process each paragraph in the document
        tipTapDoc.content = tipTapDoc.content.map((paragraph: TipTapNode) => {
          // Skip processing if we've already found and removed the main image
          if (foundMainImage) return paragraph
          
          // If this is a paragraph with content that might contain images
          if (paragraph.type === 'paragraph' && Array.isArray(paragraph.content)) {
            // Look for image nodes in this paragraph
            const newContent = paragraph.content.filter((node: TipTapNode) => {
              // If it's an image node with a src matching our main image
              if (!foundMainImage && 
                  node.type === 'image' && 
                  node.attrs?.src === mainImageUrl) {
                foundMainImage = true
                return false // Remove this image node
              }
              return true // Keep all other nodes
            })
            
            // Return the paragraph with filtered content
            return {
              ...paragraph,
              content: newContent
            }
          }
          
          return paragraph
        })
        
        // Filter out any empty paragraphs (that might have contained only the image)
        tipTapDoc.content = tipTapDoc.content.filter((paragraph: TipTapNode) => {
          if (paragraph.type === 'paragraph' && 
              (!paragraph.content || paragraph.content.length === 0)) {
            return false // Remove empty paragraphs
          }
          return true
        })
      }
    }
    
    return processedText
  }, [contentBlock?.content.text, imageBlock?.content.image?.content])
  
  // Handler for when HTML is generated
  const handleHtmlGenerated = (html: string) => {
    console.log('Received HTML from renderer:', html)
    setGeneratedHtml(html)
  }

  return (
    <main className="overflow-hidden">
      <GradientBackground />
      <Container>
        <Navbar />
        <Subheading className="mt-16">
          {dayjs(post.publishedAt).format('dddd, MMMM D, YYYY')}
        </Subheading>
        <Heading as="h1" className="mt-2">
          {post.title}
        </Heading>
        <div className="mt-16 grid grid-cols-1 gap-8 pb-24 lg:grid-cols-[15rem_1fr] xl:grid-cols-[15rem_1fr_15rem]">
          <div className="flex flex-wrap items-center gap-8 max-lg:justify-between lg:flex-col lg:items-start">
            {/* Display authors if available */}
            {authorsBlock && (
              <div className="flex items-center gap-3">
                <div className="text-sm/5 text-gray-700">
                  {authorsBlock.content.authors?.join(', ')}
                </div>
              </div>
            )}
          </div>
          <div className="text-gray-700">
            <div className="max-w-2xl xl:mx-auto">
              {/* Display main image if available */}
              {imageBlock && imageBlock.content.image?.content && (
                <Image
                  alt={post.title || ''}
                  src={imageBlock.content.image.content}
                  width={2016}
                  height={1344}
                  priority={true}
                  className="mb-10 aspect-3/2 w-full rounded-2xl object-cover shadow-xl"
                />
              )}
              
              {/* TipTap renderer to generate HTML - hidden by default */}
              {contentBlock && contentBlock.content.text && (
                <>
                  <div style={{ display: showDebug ? 'block' : 'none' }}>
                    <TipTapRenderer 
                      content={processedContent || contentBlock.content.text}
                      onHtmlGenerated={handleHtmlGenerated}
                      className="mb-8 border border-gray-200 p-4 rounded-md"
                    />
                  </div>
                  
                  {/* Render the generated HTML directly */}
                  {generatedHtml ? (
                    <>
                      <div 
                        className="prose prose-gray prose-ol:list-decimal prose-ul:list-disc prose-li:my-1 max-w-none"
                        dangerouslySetInnerHTML={{ __html: generatedHtml }}
                      />
                      
                      {/* Debug button - only shown in development environment */}
                      {isDevelopment && (
                        <div className="mt-8 flex justify-center">
                          <Button 
                            variant="secondary" 
                            onClick={() => setShowDebug(!showDebug)}
                          >
                            {showDebug ? 'Hide Debug Info' : 'Show Debug Info'}
                          </Button>
                        </div>
                      )}
                      
                      {/* Debug view - only shown in development environment */}
                      {isDevelopment && showDebug && (
                        <div className="mt-8 border-t border-gray-200 pt-8">
                          <h3 className="mb-4 text-lg font-semibold">Debug Information</h3>
                          
                          <div className="mb-8">
                            <h4 className="mb-2 font-medium">TipTap Editor Rendering:</h4>
                            <div className="border border-blue-200 bg-blue-50 p-4 rounded-md">
                              <p className="mb-2 text-xs text-blue-700">This is how TipTap renders the content directly:</p>
                              {/* TipTap renderer is now visible above */}
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                            <div>
                              <h4 className="mb-2 font-medium">Raw Editor Content:</h4>
                              <pre className="overflow-auto rounded-md bg-gray-100 p-4 text-xs">
                                {JSON.stringify(contentBlock?.content.text, null, 2)}
                              </pre>
                              <h4 className="mt-4 mb-2 font-medium">Processed Content (with main image removed):</h4>
                              <pre className="overflow-auto rounded-md bg-gray-100 p-4 text-xs">
                                {JSON.stringify(processedContent, null, 2)}
                              </pre>
                            </div>
                            
                            <div>
                              <h4 className="mb-2 font-medium">Generated HTML:</h4>
                              <pre className="overflow-auto rounded-md bg-gray-100 p-4 text-xs">
                                {generatedHtml}
                              </pre>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="py-4 text-center text-gray-500">
                      Loading content...
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
        <div className="pb-24">
          <Button href="/blog" variant="secondary" className="gap-1">
            <ChevronLeftIcon className="size-4" />
            Back to blog
          </Button>
        </div>
      </Container>
    </main>
  )
}
