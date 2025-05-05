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
//import Code from '@tiptap/extension-code'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'

import { useEffect, useCallback } from 'react'
import { Code } from 'reactjs-tiptap-editor/code'; 

interface TipTapRendererProps {
  content: Record<string, unknown>;
  className?: string;
  onHtmlGenerated?: (html: string) => void;
}

interface TipTapNode {
  type: string;
  attrs?: {
    src?: string;
    align?: 'left' | 'center' | 'right';
    width?: number;
    class?: string;
    [key: string]: unknown;
  };
  content?: TipTapNode[];
  [key: string]: unknown;
}

interface TipTapDoc {
  type: string;
  content?: TipTapNode[];
  [key: string]: unknown;
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
      Link,
      Code,
      Underline,
      TextAlign
    ],
    content,
    editable: false,
  })

  // Helper function to get Tailwind classes for alignment
  const getAlignmentClass = useCallback((align: string): string => {
    switch (align) {
      case 'center':
        return 'mx-auto block';
      case 'right':
        return 'ml-auto block';
      case 'left':
        return 'mr-auto block';
      default:
        return '';
    }
  }, []);

  // Helper function to find an image node by its src attribute
  const findImageNodeBySrc = useCallback((content: Record<string, unknown>, src: string): TipTapNode | null => {
    const findNode = (node: TipTapNode): TipTapNode | null => {
      if (!node) return null;
      
      // Check if this is the image node we're looking for
      if (node.type === 'image' && node.attrs && node.attrs.src === src) {
        return node;
      }
      
      // If this node has content, recursively search it
      if (node.content && Array.isArray(node.content)) {
        for (const child of node.content) {
          const result = findNode(child);
          if (result) return result;
        }
      }
      
      return null;
    };
    
    // Start the search from the root content
    const docContent = content as TipTapDoc;
    if (docContent.type === 'doc' && docContent.content && Array.isArray(docContent.content)) {
      for (const node of docContent.content) {
        const result = findNode(node);
        if (result) return result;
      }
    }
    
    return null;
  }, []);

  // Function to process image attributes and apply Tailwind classes
  const processImageAttributes = useCallback((html: string, content: Record<string, unknown>): string => {
    try {
      // Skip processing if we're not in a browser environment
      if (typeof window === 'undefined') return html;
      
      // Create a temporary DOM element to modify the HTML
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = html;
      
      // Find all images in the HTML
      const imgElements = tempDiv.querySelectorAll('img');
      
      // Process each image to add Tailwind classes based on alignment
      imgElements.forEach(img => {
        const src = img.getAttribute('src');
        if (!src) return;
        
        // Find the image in the content structure to get its attributes
        const imageNode = findImageNodeBySrc(content, src);
        if (!imageNode || !imageNode.attrs) return;
        
        // Apply alignment classes
        if (imageNode.attrs.align) {
          const alignClass = getAlignmentClass(imageNode.attrs.align);
          if (alignClass) {
            img.classList.add(...alignClass.split(' '));
          }
        }
        
        // Apply width if specified
        if (imageNode.attrs.width) {
          img.style.maxWidth = `${imageNode.attrs.width}px`;
        }
        
        // Apply any custom classes specified in the attrs
        if (imageNode.attrs.class) {
          img.classList.add(...(imageNode.attrs.class as string).split(' '));
        }
      });
      
      return tempDiv.innerHTML;
    } catch (error) {
      console.error('Error processing image attributes:', error);
      return html; // Return original HTML if there's an error
    }
  }, [findImageNodeBySrc, getAlignmentClass]);

  useEffect(() => {
    if (editor && content) {
      editor.commands.setContent(content)
      let html = editor.getHTML()
      
      // Process the HTML to add Tailwind classes based on image attributes
      html = processImageAttributes(html, content)
      
      // Call the callback with the processed HTML
      if (onHtmlGenerated) {
        onHtmlGenerated(html)
      }
    }
  }, [editor, content, onHtmlGenerated, processImageAttributes])
  
  // End of component functions

  return (
    <div className={className}>
      <EditorContent editor={editor}/>
    </div>
  )
}
