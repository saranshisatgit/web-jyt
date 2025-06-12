// components/PostTableOfContents.tsx
'use client'

import { useEffect } from 'react'
import { ManualTableOfContents, type HeadingItem } from '@/components/manual-table-of-contents'; // Import HeadingItem for local use
export type { HeadingItem }; // Re-export HeadingItem

interface PostTableOfContentsProps {
  generatedHtml: string;
  onHeadingsChange: (headings: HeadingItem[], count: number) => void;
  hasOriginalTocNode: boolean;
  tocHeadingsCount: number;
  headings: HeadingItem[];
}

export function PostTableOfContents({
  generatedHtml,
  onHeadingsChange,
  hasOriginalTocNode,
  tocHeadingsCount,
  headings,
}: PostTableOfContentsProps) {
  useEffect(() => {
    if (generatedHtml && hasOriginalTocNode) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(generatedHtml, 'text/html');
      const extractedHeadings = Array.from(doc.querySelectorAll('h2, h3, h4, h5, h6'))
        .map((h, index) => ({
          id: h.id || `heading-${index}`,
          level: parseInt(h.tagName.substring(1), 10),
          text: h.textContent || '',
        }));
      onHeadingsChange(extractedHeadings, extractedHeadings.length);
    } else {
      onHeadingsChange([], 0); // Clear headings if no HTML or TOC node
    }
  }, [generatedHtml, hasOriginalTocNode, onHeadingsChange]);

  if (!hasOriginalTocNode || tocHeadingsCount === 0) {
    return null; // Don't render TOC if no original TOC node or no headings found
  }

  return (
    <div className="sticky top-24 hidden xl:block">
      <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-500">
        On this page ({tocHeadingsCount})
      </h3>
      <ManualTableOfContents headings={headings} />
    </div>
  );
}
