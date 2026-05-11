'use client'

import type { BlogBlock } from '@/types/blog'

interface PostMetadataSidebarProps {
  authorsBlock?: BlogBlock
  category?: string
}

export function PostMetadataSidebar({ authorsBlock, category }: PostMetadataSidebarProps) {
  const authors = ((authorsBlock?.content?.authors as string[]) || []).filter(Boolean)
  if (authors.length === 0 && !category) return null

  return (
    <aside style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {authors.length > 0 && (
        <div>
          <div className="kt-meta" style={{ marginBottom: '8px' }}>Written by</div>
          <div style={{ fontSize: '15px', color: 'var(--ink)' }}>
            {authors.join(', ')}
          </div>
        </div>
      )}
      {category && (
        <div>
          <div className="kt-meta" style={{ marginBottom: '8px' }}>Category</div>
          <span className="kt-pill">{category}</span>
        </div>
      )}
    </aside>
  )
}
