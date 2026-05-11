'use client'

import React, { createContext, useContext } from "react"
import type { CurrencyConfig } from "@/lib/currency"

const CurrencyContext = createContext<CurrencyConfig | null>(null)

export const CurrencyProvider = ({
  value,
  children,
}: {
  value: CurrencyConfig
  children: React.ReactNode
}) => {
  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>
}

export const useCurrency = (): CurrencyConfig => {
  const ctx = useContext(CurrencyContext)
  if (!ctx) throw new Error("useCurrency must be used within CurrencyProvider")
  return ctx
}
