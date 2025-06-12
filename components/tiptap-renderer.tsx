'use client'

import {
  EditorProvider,
  EditorContent,
  useCurrentEditor,
} from '@tiptap/react'
import { useEffect, useCallback } from 'react'
import { Extension } from '@tiptap/core' 
import { Node as ProsemirrorNode } from 'prosemirror-model'

// Tiptap Extensions
import StarterKit from '@tiptap/starter-kit'
import { Text } from '@tiptap/extension-text'
import { Image } from '@tiptap/extension-image'
import { TextStyle } from '@tiptap/extension-text-style'
import { BulletList } from '@tiptap/extension-bullet-list'
import { FontFamily } from '@tiptap/extension-font-family'
import { Bold } from '@tiptap/extension-bold'
import { Document } from '@tiptap/extension-document'
import { ListItem } from '@tiptap/extension-list-item'
import { Paragraph } from '@tiptap/extension-paragraph'
import { OrderedList } from '@tiptap/extension-ordered-list'
import { Color } from '@tiptap/extension-color'
import { Heading } from '@tiptap/extension-heading'
import { Highlight } from '@tiptap/extension-highlight'
import { Link } from '@tiptap/extension-link'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import { TaskItem } from '@tiptap/extension-task-item'
import { TaskList } from '@tiptap/extension-task-list'
import { Code } from '@tiptap/extension-code'
import Superscript from '@tiptap/extension-superscript'
import Subscript from '@tiptap/extension-subscript'

// Define interfaces
interface TipTapRendererProps {
  content: TipTapJsonStructure | null;
  className?: string;
  onHtmlGenerated?: (html: string) => void;
}

interface TipTapNode {
  type: string
  attrs?: {
    src?: string
    align?: 'left' | 'center' | 'right'
    width?: number
    class?: string
    [key: string]: unknown
  }
  content?: TipTapNode[]
  [key: string]: unknown
}

// This is similar to TipTapJsonStructure. We should consolidate these later.
export interface TipTapJsonStructure { 
  type: 'doc'; 
  content: TipTapNode[]; 
}

// Custom extension to allow IDs on headings
const HeadingId = Extension.create({
  name: 'headingId',
  addGlobalAttributes() {
    return [
      {
        types: ['heading'],
        attributes: {
          id: {
            default: null,
          },
        },
      },
    ]
  },
})

// Helper component to contain all editor-dependent logic
const TiptapLogic = ({
  content,
  onHtmlGenerated,
}: {
  content: TipTapJsonStructure | null;
  onHtmlGenerated?: (html: string) => void;
}) => {
  const { editor } = useCurrentEditor()

  const getAlignmentClass = useCallback((align: string): string => {
    switch (align) {
      case 'center':
        return 'mx-auto block'
      case 'right':
        return 'ml-auto block'
      case 'left':
        return 'mr-auto block'
      default:
        return ''
    }
  }, [])

  const findImageNodeBySrc = useCallback(
    (nodes: TipTapNode[], src: string): TipTapNode | null => {
      for (const node of nodes) {
        if (node.type === 'image' && node.attrs?.src === src) {
          return node
        }
        if (node.content) {
          const found = findImageNodeBySrc(node.content, src)
          if (found) return found
        }
      }
      return null
    },
    []
  )

  const processImageAttributes = useCallback(
    (html: string, jsonContent: TipTapJsonStructure | null): string => {
      try {
        if (typeof window === 'undefined') return html
        const tempDiv = document.createElement('div')
        tempDiv.innerHTML = html
        const images = tempDiv.querySelectorAll('img')

        images.forEach((img) => {
          const src = img.getAttribute('src')
          if (!src) return

          const imageNode = findImageNodeBySrc(
            (jsonContent?.content) || [],
            src
          )
          if (!imageNode || !imageNode.attrs) return

          if (imageNode.attrs.align) {
            const alignClass = getAlignmentClass(imageNode.attrs.align as string)
            if (alignClass) {
              img.classList.add(...alignClass.split(' '))
            }
          }
          if (imageNode.attrs.width) {
            img.style.maxWidth = `${imageNode.attrs.width}px`
          }
          if (imageNode.attrs.class) {
            img.classList.add(...(imageNode.attrs.class as string).split(' '))
          }
        })

        return tempDiv.innerHTML
      } catch (error) {
        console.error('Error processing image attributes:', error)
        return html
      }
    },
    [findImageNodeBySrc, getAlignmentClass]
  )

  useEffect(() => {
    if (editor && content) {
      // Add unique IDs to headings before generating HTML
      const transaction = editor.state.tr
      const headings: { node: ProsemirrorNode; pos: number }[] = []
      editor.state.doc.descendants((node, pos) => {
        if (node.type.name === 'heading') {
          headings.push({ node, pos })
        }
      })

      headings.forEach(({ node, pos }, index) => {
        const id = `heading-${index + 1}`
        if (node.attrs.id !== id) {
          transaction.setNodeMarkup(pos, undefined, { ...node.attrs, id })
        }
      })

      if (transaction.docChanged) {
        editor.view.updateState(editor.state.apply(transaction))
      }

      const processAndEmitHtml = () => {
        let html = editor.getHTML()
        html = processImageAttributes(html, content)
        if (onHtmlGenerated) {
          onHtmlGenerated(html)
        }
      }

      processAndEmitHtml()

      editor.on('update', processAndEmitHtml)

      return () => {
        editor.off('update', processAndEmitHtml)
      }
    }
  }, [editor, content, onHtmlGenerated, processImageAttributes])

  return null
}

// Wrapper to fix TypeScript error
const EditorContentWrapper = () => {
  const { editor } = useCurrentEditor()
  if (!editor) {
    return null
  }
  return <EditorContent editor={editor} />
}

// Main component
export function TipTapRenderer({
  content,
  className = '',
  onHtmlGenerated,
}: TipTapRendererProps) {
  const extensions = [
    Text,
    Image,
    StarterKit,
    TextStyle,
    BulletList,
    FontFamily,
    Bold,
    Document,
    ListItem,
    Paragraph,
    OrderedList,
    Color,
    Heading,
    Highlight,
    Link,
    Code, // Using the official @tiptap/extension-code now
    Underline,
    TextAlign,
    TaskItem.configure({
      nested: true,
    }),
    TaskList,
    HeadingId, // Add our custom extension
    Superscript,
    Subscript,
  ]

  return (
    <div className={className}>
      <EditorProvider extensions={extensions} content={content} editable={false}>
        <EditorContentWrapper />
        <TiptapLogic content={content} onHtmlGenerated={onHtmlGenerated} />
      </EditorProvider>
    </div>
  )
}
