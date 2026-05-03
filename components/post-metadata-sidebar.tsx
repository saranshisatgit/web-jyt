// components/post-metadata-sidebar.tsx
'use client'

import type { BlogBlock } from '@/types/blog'

interface PostMetadataSidebarProps {
  authorsBlock?: BlogBlock;
  category?: string;
}

export function PostMetadataSidebar({ authorsBlock, category }: PostMetadataSidebarProps) {
  return (
    <div className="flex flex-col gap-6 lg:items-start">
      {/* Display authors if available */}
      {authorsBlock && authorsBlock.content.authors && authorsBlock.content.authors.length > 0 && (
        <div>
          <p className="text-sm font-medium text-olive-900">Written by</p>
          <div className="mt-1 text-sm text-olive-700">
            {authorsBlock.content.authors.join(', ')}
          </div>
        </div>
      )}
      {/* Display category if available */}
      {category && (
        <div>
          <p className="text-sm font-medium text-olive-900">Category</p>
          <div className="mt-1 inline-block rounded-full border border-dotted border-olive-300 bg-olive-50 px-2 py-0.5 text-sm font-medium text-olive-500">
            {category}
          </div>
        </div>
      )}
    </div>
  );
}
