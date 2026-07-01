"use client"

import { useCallback } from "react"
import { useLocale } from "@/app/context/locale-context"
import type { Messages } from "./translations"
import enMessages from "@/messages/en-IN.json"

let fallbackMessages: Messages = enMessages

function resolve(obj: Record<string, unknown>, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object") return (acc as Record<string, unknown>)[key]
    return undefined
  }, obj)
}

export function useT(messages?: Messages | null) {
  const { messages: ctxMessages } = useLocale()
  const active = messages ?? ctxMessages ?? fallbackMessages

  const t = useCallback(
    (key: string, params?: Record<string, string | number>) => {
      // First try the active locale messages
      let val = resolve(active as unknown as Record<string, unknown>, key)
      if (typeof val !== "string") {
        // Fall back to English
        val = resolve(fallbackMessages as unknown as Record<string, unknown>, key)
      }
      if (typeof val !== "string") return key
      if (!params) return val
      return val.replace(/\{(\w+)\}/g, (_, k) => String(params[k] ?? `{${k}}`))
    },
    [active],
  )

  return { t }
}
