/**
 * Centralized Blog Type Definitions
 * Based on actual API response from v3.jaalyantra.com
 */

// TipTap JSON structure for rich text content
export interface TipTapNode {
  type: string;
  attrs?: Record<string, unknown>;
  content?: TipTapNode[];
  text?: string;
  marks?: Array<Record<string, unknown>>;
  [key: string]: unknown;
}

export interface TipTapJsonStructure {
  type: 'doc';
  content: TipTapNode[];
}

// Blog block structure from API
export interface BlogBlock {
  id: string;
  type: string;
  content: {
    text?: TipTapJsonStructure;
    type?: string;
    image?: {
      type: string;
      content?: string; // Image URL or empty string
    };
    layout?: string;
    authors?: string[]; // Array of author names
    [key: string]: unknown;
  };
  order: number;
}

// Main blog post structure from API
export interface BlogPost {
  title: string;
  slug: string;
  content: string; // Plain text excerpt/summary
  status: 'Published' | 'Draft';
  page_type: 'Blog';
  published_at: string; // ISO date string
  public_metadata: {
    authors?: string; // Single author name as string
    category?: string;
    is_featured?: boolean;
    [key: string]: unknown;
  };
  blocks: BlogBlock[];
}

// Helper type for author display
export interface Author {
  name: string;
  role?: string;
  image?: {
    content?: string;
  };
}

/**
 * Helper Functions
 */

/**
 * Extract the main content block (contains TipTap JSON)
 */
export function getContentBlock(post: BlogPost): BlogBlock | undefined {
  return post.blocks?.find(
    (block) => block.content && typeof block.content.text === 'object'
  );
}

/**
 * Extract the main image URL from blocks
 * Checks both block.content.image.content and the first image in TipTap content
 */
export function getMainImageUrl(post: BlogPost): string | undefined {
  // First, try to get from block.content.image.content
  const imageBlock = post.blocks?.find(
    (block) => block.content?.image?.content && block.content.image.content !== ''
  );
  
  if (imageBlock?.content?.image?.content) {
    return imageBlock.content.image.content;
  }
  
  // If not found, try to get the first image from TipTap content
  const contentBlock = getContentBlock(post);
  if (contentBlock?.content?.text?.content) {
    const firstImageNode = contentBlock.content.text.content.find(
      (node: TipTapNode) => node.type === 'image'
    );
    
    if (firstImageNode?.attrs && typeof firstImageNode.attrs.src === 'string') {
      return firstImageNode.attrs.src;
    }
  }
  
  return undefined;
}

/**
 * Extract authors array from blocks
 */
export function getAuthors(post: BlogPost): string[] {
  const authorsBlock = post.blocks?.find(
    (block) => block.content?.authors && Array.isArray(block.content.authors)
  );
  return authorsBlock?.content?.authors || [];
}

/**
 * Get category from public_metadata
 */
export function getCategory(post: BlogPost): string | undefined {
  return post.public_metadata?.category;
}

/**
 * Check if post is featured
 */
export function isFeatured(post: BlogPost): boolean {
  return post.public_metadata?.is_featured === true;
}

/**
 * Get formatted date string
 */
export function getFormattedDate(post: BlogPost): string {
  return new Date(post.published_at).toLocaleDateString();
}
