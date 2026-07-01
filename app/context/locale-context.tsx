"use client"

import React, { createContext, useContext, useState, useCallback } from "react"
import type { LocaleCode } from "@/lib/i18n/config"
import { DEFAULT_LOCALE, COOKIE_NAME } from "@/lib/i18n/config"
import type { Messages } from "@/lib/i18n/translations"

type LocaleContextValue = {
  locale: LocaleCode
  messages: Messages | null
  setLocale: (code: LocaleCode) => void
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

function setCookie(name: string, value: string) {
  document.cookie = `${name}=${value}; path=/; max-age=${365 * 24 * 60 * 60}; SameSite=Lax`
}

export function LocaleProvider({
  children,
  initialLocale,
  initialMessages,
}: {
  children: React.ReactNode
  initialLocale: LocaleCode
  initialMessages: Messages | null
}) {
  const [locale, setLocaleState] = useState<LocaleCode>(initialLocale)
  const [messages, setMessages] = useState<Messages | null>(initialMessages)

  const setLocale = useCallback(
    async (code: LocaleCode) => {
      setCookie(COOKIE_NAME, code)
      setLocaleState(code)
      // Load new translations
      try {
        const mod = await import(`@/messages/${code}.json`)
        setMessages(mod.default as Messages)
      } catch {
        // fallback to English
      }
      // Reload to apply server-rendered content
      window.location.reload()
    },
    [],
  )

  return (
    <LocaleContext.Provider value={{ locale, messages, setLocale }}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext)
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider")
  return ctx
}
