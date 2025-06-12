// components/post-metadata-sidebar.tsx
'use client'

// TODO: Move BlogBlock to a shared types file (e.g., types/blog.ts)
export interface BlogBlock { // Added export
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
          <p className="text-sm font-medium text-gray-900">Written by</p>
          <div className="mt-1 text-sm text-gray-700">
            {authorsBlock.content.authors.join(', ')}
          </div>
        </div>
      )}
      {/* Display category if available */}
      {category && (
        <div>
          <p className="text-sm font-medium text-gray-900">Category</p>
          <div className="mt-1 inline-block rounded-full border border-dotted border-gray-300 bg-gray-50 px-2 py-0.5 text-sm font-medium text-gray-500">
            {category}
          </div>
        </div>
      )}
    </div>
  );
}
