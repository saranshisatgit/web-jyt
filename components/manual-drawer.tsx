'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Button } from './button'

// Define the structure of the drawer's attributes
export interface DrawerAttrs { // Added export
  src: string
  alt: string
  width: number
  height: number
  align: 'left' | 'center' | 'right'
  title?: string | null
}

interface ManualDrawerProps {
  attrs: DrawerAttrs
}

export function ManualDrawer({ attrs }: ManualDrawerProps) {
  const [isOpen, setIsOpen] = useState(true) // Default to open for drawings

  // Define alignment classes for the container
  const alignmentClasses = {
    left: 'mr-auto',
    center: 'mx-auto',
    right: 'ml-auto',
  }
  
  const containerClasses = `relative ${alignmentClasses[attrs.align] || 'mx-auto'}`

  return (
    <div className="my-6">
      <div className="flex justify-center mb-2">
        <Button
        variant='secondary'
          
          onClick={() => setIsOpen(!isOpen)}
          //className="bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-md shadow-md hover:bg-gray-300 transition-colors duration-200"
        >
          {isOpen ? 'Hide Drawing' : 'Show Drawing'}
        </Button>
      </div>
      {isOpen && attrs.src && (
        <div className={containerClasses} style={{ maxWidth: attrs.width }}>
            <Image
              src={attrs.src}
              alt={attrs.title || 'User-created drawing'}
              width={attrs.width}
              height={attrs.height}
              className="rounded-md border border-gray-200"
            />
        </div>
      )}
    </div>
  )
}
