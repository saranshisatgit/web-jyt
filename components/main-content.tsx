'use client'

import React from 'react'
import { Container } from './container'

// Type definitions for different content formats
export interface MainContentBlock {
  content: {
    content_type?: 'html' | 'markdown' | 'text'
    content: string
    max_width?: 'narrow' | 'medium' | 'wide' | 'full'
    show_toc?: boolean
  }
}

interface MainContentProps {
  block?: MainContentBlock
  className?: string
}

/**
 * MainContent Component
 * 
 * A reusable component for displaying textual content like privacy policies,
 * terms of service, and other static pages.
 * 
 * Features:
 * - Supports HTML content rendering
 * - Prose styling for beautiful typography
 * - Configurable max-width
 * - Responsive design
 * 
 * @example
 * ```tsx
 * <MainContent block={contentBlock} />
 * ```
 */
export function MainContent({ block, className = '' }: MainContentProps) {
  if (!block || !block.content) {
    return (
      <Container className="py-16 sm:py-24">
        <div className="text-center text-gray-500">
          <p>Content not available</p>
        </div>
      </Container>
    )
  }

  const { content, max_width = 'medium', content_type = 'html' } = block.content

  // Determine max-width class based on configuration
  const maxWidthClass = {
    narrow: 'max-w-2xl',
    medium: 'max-w-3xl',
    wide: 'max-w-5xl',
    full: 'max-w-none'
  }[max_width]

  // Render based on content type
  const renderContent = () => {
    switch (content_type) {
      case 'html':
        return (
          <div
            className={`prose prose-gray prose-sm sm:prose-base max-w-none ${className}`}
            dangerouslySetInnerHTML={{ __html: content }}
          />
        )
      case 'text':
        return (
          <div className={`prose prose-gray prose-sm sm:prose-base max-w-none ${className}`}>
            <p className="whitespace-pre-wrap">{content}</p>
          </div>
        )
      default:
        return (
          <div
            className={`prose prose-gray prose-sm sm:prose-base max-w-none ${className}`}
            dangerouslySetInnerHTML={{ __html: content }}
          />
        )
    }
  }

  return (
    <Container className="py-16 sm:py-24">
      <div className={`mx-auto ${maxWidthClass}`}>
        {renderContent()}
      </div>
    </Container>
  )
}

/**
 * SimpleMainContent Component
 * 
 * A simplified version that accepts raw HTML string directly
 * without requiring a block structure. Useful for quick implementations.
 * 
 * @example
 * ```tsx
 * <SimpleMainContent html={htmlString} />
 * ```
 */
export function SimpleMainContent({ 
  html, 
  maxWidth = 'medium',
  className = '' 
}: { 
  html: string
  maxWidth?: 'narrow' | 'medium' | 'wide' | 'full'
  className?: string
}) {
  const maxWidthClass = {
    narrow: 'max-w-2xl',
    medium: 'max-w-3xl',
    wide: 'max-w-5xl',
    full: 'max-w-none'
  }[maxWidth]

  return (
    <Container className="py-16 sm:py-24">
      <div className={`mx-auto ${maxWidthClass}`}>
        <div
          className={`prose prose-gray prose-sm sm:prose-base max-w-none ${className}`}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </Container>
  )
}
