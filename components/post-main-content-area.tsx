// components/post-main-content-area.tsx
'use client'

import Image from 'next/image'
import { TipTapRenderer } from '@/components/tiptap-renderer'
import { ManualDrawer, type DrawerAttrs } from '@/components/manual-drawer'
import { StatsPanelHydrator } from '@/components/stats-panel-hydrator'
import { Button } from '@/components/button' // For debug toggle

// Import shared types from centralized location
import type { BlogPost, TipTapNode, TipTapJsonStructure } from '@/types/blog'
import React from 'react' // Ensure React is imported for JSX style block if needed

interface PostMainContentAreaProps {
  post: BlogPost;
  featuredImageUrl?: string | null;
  processedContent: TipTapJsonStructure | null; // From useMemo in parent
  drawerNode: TipTapNode | null; // From useMemo in parent
  onHtmlGenerated: (html: string) => void;
  showDebug: boolean;
  setShowDebug: (show: boolean) => void;
  isDevelopment: boolean;
  generatedHtml: string;
  initialContentForDebug?: TipTapJsonStructure | Record<string, unknown> | string | null;
}

export function PostMainContentArea({
  post,
  featuredImageUrl,
  processedContent,
  drawerNode,
  onHtmlGenerated,
  showDebug,
  setShowDebug,
  isDevelopment,
  generatedHtml,
}: PostMainContentAreaProps) {
  return (
    <div className="text-navy-700">
      <div className="max-w-2xl xl:mx-auto">
        {/* Display featured image if available */}
        {featuredImageUrl && (
          <Image
            alt={post.title || ''}
            src={featuredImageUrl}
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
          <div className="py-4 text-center text-navy-500">
            Content not available or being processed...
          </div>
        ) : !generatedHtml ? (
          <div className="flex flex-col items-center justify-center py-10">
            <div className="loader ease-linear rounded-full border-4 border-t-4 border-navy-200 h-12 w-12 mb-4"></div>
            <p className="loading-text text-navy-500 text-lg">
              Loading content...
            </p>
          </div>
        ) : (
          <>
            <div
              className="blog-content prose prose-navy prose-ol:list-decimal prose-ul:list-[square] prose-li:my-1 prose-li:pl-2 prose-p:my-4 prose-headings:mt-8 prose-headings:mb-4 prose-headings:font-medium prose-img:my-6 prose-img:rounded-lg prose-a:font-semibold prose-a:underline-offset-4 max-w-none"
              dangerouslySetInnerHTML={{ __html: generatedHtml }}
            />
            {/* Replaces every <div data-stats-panel> inside .blog-content
                with the full React StatsPanelHydrated component (with
                pagination, search, etc.). Scoped via selector so the
                hidden TipTap editor's panels aren't double-mounted. */}
            <StatsPanelHydrator rootSelector=".blog-content" />
          </>
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
              <div className="mt-4 space-y-4 rounded-md border border-dashed border-navy-300 bg-navy-50 p-4 text-xs">
                <div>
                  <h4 className="mb-2 font-medium">Post Object:</h4>
                  <pre className="overflow-auto rounded-md bg-navy-100 p-4">
                    {JSON.stringify(post, null, 2)}
                  </pre>
                </div>
                <div>
                  <h4 className="mb-2 font-medium">Processed Content (JSON for TipTapRenderer):</h4>
                  <pre className="overflow-auto rounded-md bg-navy-100 p-4">
                    {JSON.stringify(processedContent, null, 2)}
                  </pre>
                </div>
                {drawerNode && (
                  <div>
                    <h4 className="mb-2 font-medium">Extracted Drawer Node:</h4>
                    <pre className="overflow-auto rounded-md bg-navy-100 p-4">
                      {JSON.stringify(drawerNode, null, 2)}
                    </pre>
                  </div>
                )}
                <div>
                  <h4 className="mb-2 font-medium">Generated HTML:</h4>
                  <pre className="overflow-auto rounded-md bg-navy-100 p-4 text-xs">
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
