'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Text from '@tiptap/extension-text'

import TextStyle from '@tiptap/extension-text-style' 
import FontFamily from '@tiptap/extension-font-family'
import Bold from '@tiptap/extension-bold'

import BulletList from '@tiptap/extension-bullet-list'
import Document from '@tiptap/extension-document'
import ListItem from '@tiptap/extension-list-item'
import OrderedList from '@tiptap/extension-ordered-list'
import Paragraph from '@tiptap/extension-paragraph'
import { Color } from '@tiptap/extension-color'
import { Heading } from '@tiptap/extension-heading'
import { Highlight } from '@tiptap/extension-highlight'
import { Link } from '@tiptap/extension-link'

import { useEffect } from 'react'

interface TipTapRendererProps {
  content: Record<string, unknown>;
  className?: string;
  onHtmlGenerated?: (html: string) => void;
}

export function TipTapRenderer({ content, className = '', onHtmlGenerated }: TipTapRendererProps) {
  // Create a read-only editor instance
  const editor = useEditor({
    extensions: [
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
      Link
    ],
    content,
    editable: false,
  })

  // Update content when it changes
  useEffect(() => {
    if (editor && content) {
      editor.commands.setContent(content)
      const html = editor.getHTML()
      console.log('HTML:', html)
      
      // Call the callback with the generated HTML
      if (onHtmlGenerated) {
        onHtmlGenerated(html)
      }
    }
  }, [editor, content, onHtmlGenerated])

  return (
    <div className={className}>
      <EditorContent editor={editor}/>
    </div>
  )
}
