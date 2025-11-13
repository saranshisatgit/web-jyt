// components/post-main-content-area.tsx
'use client'

import Image from 'next/image'
import { TipTapRenderer } from '@/components/tiptap-renderer'
import { ManualDrawer, type DrawerAttrs } from '@/components/manual-drawer'
import { Button } from '@/components/button' // For debug toggle

// Import shared types from centralized location
import type { BlogBlock, BlogPost, TipTapNode, TipTapJsonStructure } from '@/types/blog'
import React from 'react' // Ensure React is imported for JSX style block if needed

interface PostMainContentAreaProps {
  post: BlogPost;
  imageBlock?: BlogBlock;
  processedContent: TipTapJsonStructure | null; // From useMemo in parent
  drawerNode: TipTapNode | null; // From useMemo in parent
  onHtmlGenerated: (html: string) => void;
  showDebug: boolean;
  setShowDebug: (show: boolean) => void;
  isDevelopment: boolean;
  generatedHtml: string;
  initialContentForDebug?: TipTapJsonStructure | Record<string, unknown> | string | null; // Prop for raw content debug (can be object or raw JSON string)
}

export function PostMainContentArea({
  post,
  imageBlock,
  processedContent,
  drawerNode,
  onHtmlGenerated,
  showDebug,
  setShowDebug,
  isDevelopment,
  generatedHtml,
}: PostMainContentAreaProps) {
  return (
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
            className="mb-8 rounded-lg shadow-md"
          />
        )}

        {/* TipTapRenderer to generate HTML (kept non-visible as PostMainContentArea handles display) */}
        {processedContent && (
          <div style={{ display: 'none' }}>
            <TipTapRenderer content={processedContent} onHtmlGenerated={onHtmlGenerated} />
          </div>
        )}

        {/* Main Content Area: Handles TipTap rendering and final HTML display */}
        {!processedContent ? (
          <div className="py-4 text-center text-gray-500">
            Content not available or being processed...
          </div>
        ) : !generatedHtml ? (
          <div className="flex flex-col items-center justify-center py-10">
            <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4"></div>
            <p className="loading-text text-gray-500 text-lg">
              Loading content...
            </p>
          </div>
        ) : (
          <div 
            className="prose prose-gray prose-ol:list-decimal prose-ul:list-disc prose-li:my-1 max-w-none"
            dangerouslySetInnerHTML={{ __html: generatedHtml }}
          />
        )}

        {/* Display ManualDrawer if a drawer node exists AFTER main content */}
        {drawerNode && drawerNode.attrs && generatedHtml && (
          <div className="mt-8">
            <ManualDrawer attrs={drawerNode.attrs as unknown as DrawerAttrs} />
          </div>
        )}

        {/* CSS for loader and text animation */}
        <style jsx>{`
          .loader {
            border-top-color: #3498db; /* Blue */
            animation: spinner 1.5s linear infinite;
          }
          @keyframes spinner {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          .loading-text {
            opacity: 0;
            animation: fadeIn 1.2s ease-out forwards;
            animation-delay: 0.5s; /* Start after loader is visible */
          }
          @keyframes fadeIn {
            0% { opacity: 0; transform: translateY(10px); }
            100% { opacity: 1; transform: translateY(0); }
          }
        `}</style>

        {/* Debug section */}
        {isDevelopment && (
          <>
            <Button onClick={() => setShowDebug(!showDebug)} variant="outline" className="mt-8">
              {showDebug ? 'Hide' : 'Show'} Debug Info
            </Button>
            {showDebug && (
              <div className="mt-4 space-y-4 rounded-md border border-dashed border-gray-300 bg-gray-50 p-4 text-xs">
                <div>
                  <h4 className="mb-2 font-medium">Post Object:</h4>
                  <pre className="overflow-auto rounded-md bg-gray-100 p-4">
                    {JSON.stringify(post, null, 2)}
                  </pre>
                </div>
                <div>
                  <h4 className="mb-2 font-medium">Processed Content (JSON for TipTapRenderer):</h4>
                  <pre className="overflow-auto rounded-md bg-gray-100 p-4">
                    {JSON.stringify(processedContent, null, 2)}
                  </pre>
                </div>
                {drawerNode && (
                  <div>
                    <h4 className="mb-2 font-medium">Extracted Drawer Node:</h4>
                    <pre className="overflow-auto rounded-md bg-gray-100 p-4">
                      {JSON.stringify(drawerNode, null, 2)}
                    </pre>
                  </div>
                )}
                <div>
                  <h4 className="mb-2 font-medium">Generated HTML:</h4>
                  <pre className="overflow-auto rounded-md bg-gray-100 p-4 text-xs">
                    {generatedHtml}
                  </pre>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
