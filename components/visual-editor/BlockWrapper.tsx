'use client'

import { useEffect, ReactNode } from 'react'
import { useVisualEditor } from '@/app/context/visual-editor-context'

interface BlockWrapperProps {
  blockId: string
  blockType: string
  blockName: string
  children: ReactNode
  className?: string
}

export function BlockWrapper({
  blockId,
  blockType,
  blockName,
  children,
  className = '',
}: BlockWrapperProps) {
  const {
    isEditMode,
    selectedBlockId,
    highlightedBlockId,
    handleBlockClick,
    handleBlockHover,
    registerBlock,
  } = useVisualEditor()

  useEffect(() => {
    if (blockId) {
      registerBlock(blockId, blockType, blockName)
    }
  }, [blockId, blockType, blockName, registerBlock])

  if (!isEditMode) {
    return <>{children}</>
  }

  const isSelected = selectedBlockId === blockId
  const isHighlighted = highlightedBlockId === blockId

  return (
    <div
      data-block-id={blockId}
      data-block-type={blockType}
      data-block-name={blockName}
      className={`relative transition-all duration-200 ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''} ${isHighlighted && !isSelected ? 'ring-2 ring-blue-300 ring-offset-1' : ''} ${isEditMode ? 'cursor-pointer' : ''} ${className}`}
      onClick={(e) => {
        if (isEditMode) {
          e.stopPropagation()
          handleBlockClick(blockId, blockType, blockName)
        }
      }}
      onMouseEnter={() => isEditMode && handleBlockHover(blockId)}
      onMouseLeave={() => isEditMode && handleBlockHover(null)}
    >
      {isEditMode && (isSelected || isHighlighted) && (
        <div className={`absolute -top-8 left-0 z-50 px-2 py-1 rounded-t-md text-xs font-medium text-white ${isSelected ? 'bg-blue-500' : 'bg-blue-400'} pointer-events-none`}>
          {blockType}: {blockName}
        </div>
      )}
      {children}
    </div>
  )
}
