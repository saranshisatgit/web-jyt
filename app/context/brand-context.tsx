'use client'

import React, { createContext, useContext } from "react"
import type { BrandConfig } from "@/lib/brand"

const BrandContext = createContext<BrandConfig | null>(null)

export const BrandProvider = ({
  value,
  children,
}: {
  value: BrandConfig
  children: React.ReactNode
}) => {
  return <BrandContext.Provider value={value}>{children}</BrandContext.Provider>
}

export const useBrand = (): BrandConfig => {
  const ctx = useContext(BrandContext)
  if (!ctx) throw new Error("useBrand must be used within BrandProvider")
  return ctx
}
