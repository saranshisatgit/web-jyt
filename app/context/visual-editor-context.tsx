'use client'

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react'

// Message types from admin to iframe
type AdminToIframeMessage =
  | { type: 'VISUAL_EDITOR_INIT'; editMode: true }
  | { type: 'SELECT_BLOCK'; blockId: string }
  | { type: 'HIGHLIGHT_BLOCK'; blockId: string | null }
  | { type: 'UPDATE_BLOCK_PREVIEW'; blockId: string; content: Record<string, unknown>; settings?: Record<string, unknown> }
  | { type: 'SCROLL_TO_BLOCK'; blockId: string }

// Message types from iframe to admin
type IframeToAdminMessage =
  | { type: 'VISUAL_EDITOR_READY'; blocks: BlockInfo[] }
  | { type: 'BLOCK_CLICKED'; blockId: string; blockType: string; blockName: string }
  | { type: 'BLOCK_HOVERED'; blockId: string | null }

interface BlockInfo {
  id: string
  type: string
  name: string
}

interface VisualEditorContextType {
  isEditMode: boolean
  selectedBlockId: string | null
  highlightedBlockId: string | null
  handleBlockClick: (blockId: string, blockType: string, blockName: string) => void
  handleBlockHover: (blockId: string | null) => void
  registerBlock: (blockId: string, blockType: string, blockName: string) => void
}

const VisualEditorContext = createContext<VisualEditorContextType | null>(null)

export function VisualEditorProvider({ children }: { children: ReactNode }) {
  const [isEditMode, setIsEditMode] = useState(false)
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null)
  const [highlightedBlockId, setHighlightedBlockId] = useState<string | null>(null)
  const [registeredBlocks, setRegisteredBlocks] = useState<BlockInfo[]>([])

  // Send message to parent window
  const sendMessage = useCallback((message: IframeToAdminMessage) => {
    if (typeof window !== 'undefined' && window.parent !== window) {
      window.parent.postMessage(message, '*')
    }
  }, [])

  // Check for edit mode on mount
  useEffect(() => {
    if (typeof window === 'undefined') return

    // Check URL params
    const params = new URLSearchParams(window.location.search)
    if (params.get('visual_editor') === 'true') {
      setIsEditMode(true)
    }

    // Listen for messages from parent
    const handleMessage = (event: MessageEvent<AdminToIframeMessage>) => {
      const data = event.data

      if (!data || typeof data !== 'object' || !('type' in data)) {
        return
      }

      switch (data.type) {
        case 'VISUAL_EDITOR_INIT':
          setIsEditMode(true)
          // Send ready signal with registered blocks
          setTimeout(() => {
            sendMessage({ type: 'VISUAL_EDITOR_READY', blocks: registeredBlocks })
          }, 500)
          break

        case 'SELECT_BLOCK':
          setSelectedBlockId(data.blockId)
          scrollToBlock(data.blockId)
          break

        case 'HIGHLIGHT_BLOCK':
          setHighlightedBlockId(data.blockId)
          break

        case 'SCROLL_TO_BLOCK':
          scrollToBlock(data.blockId)
          break
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [registeredBlocks, sendMessage])

  // Scroll to a specific block
  const scrollToBlock = (blockId: string) => {
    const element = document.querySelector(`[data-block-id="${blockId}"]`)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  // Handle block click
  const handleBlockClick = useCallback(
    (blockId: string, blockType: string, blockName: string) => {
      setSelectedBlockId(blockId)
      sendMessage({ type: 'BLOCK_CLICKED', blockId, blockType, blockName })
    },
    [sendMessage]
  )

  // Handle block hover
  const handleBlockHover = useCallback(
    (blockId: string | null) => {
      sendMessage({ type: 'BLOCK_HOVERED', blockId })
    },
    [sendMessage]
  )

  // Register a block
  const registerBlock = useCallback((blockId: string, blockType: string, blockName: string) => {
    setRegisteredBlocks((prev) => {
      if (prev.some((b) => b.id === blockId)) return prev
      return [...prev, { id: blockId, type: blockType, name: blockName }]
    })
  }, [])

  return (
    <VisualEditorContext.Provider
      value={{
        isEditMode,
        selectedBlockId,
        highlightedBlockId,
        handleBlockClick,
        handleBlockHover,
        registerBlock,
      }}
    >
      {children}
    </VisualEditorContext.Provider>
  )
}

export function useVisualEditor() {
  const context = useContext(VisualEditorContext)
  if (!context) {
    // Return default values if not wrapped in provider
    return {
      isEditMode: false,
      selectedBlockId: null,
      highlightedBlockId: null,
      handleBlockClick: () => {},
      handleBlockHover: () => {},
      registerBlock: () => {},
    }
  }
  return context
}
