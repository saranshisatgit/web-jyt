'use client'

import React, { createContext, useContext } from "react"

import type { Block } from "@/medu/queries"

export interface SiteDataContextValue {
  navBlock?: Block
}

const SiteDataContext = createContext<SiteDataContextValue>({})

export const SiteDataProvider = ({
  value,
  children,
}: {
  value: SiteDataContextValue
  children: React.ReactNode
}) => {
  return <SiteDataContext.Provider value={value}>{children}</SiteDataContext.Provider>
}

export const useSiteData = () => useContext(SiteDataContext)
