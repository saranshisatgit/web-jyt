'use client'

import React from 'react' // Keep React for JSX if still needed, or remove if not.

export interface HeadingItem {
  id: string
  text: string | null
  level: number
}

interface ManualTableOfContentsProps {
  headings: HeadingItem[];
}

export function ManualTableOfContents({ headings }: ManualTableOfContentsProps) {

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      // Optional: Update URL hash without page reload
      window.history.pushState(null, '', `#${id}`)
    }
  }

  if (headings.length === 0) {
    return null
  }

  return (
    <nav>
      <ul className="space-y-2 text-sm">
        {headings.map((heading) => (
          <li key={heading.id}>
            <a
              href={`#${heading.id}`}
              onClick={(e) => handleClick(e, heading.id)}
              className="block text-gray-500 transition-colors hover:text-gray-900"
              style={{ paddingLeft: `${(heading.level - 1) * 1}rem` }}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
