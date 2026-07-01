'use client'

import React, { createContext, useContext, useEffect, useState, useCallback } from "react"

export type Mode = "consumer" | "investor" | "platform"


const STORAGE_KEY = "kt.mode"
const VISITED_KEY = "kt.visited"

const REFERRER_INVESTOR = ["linkedin", "angellist", "crunchbase", "pitchbook", "tracxn"]
const REFERRER_CONSUMER = ["instagram", "tiktok", "pinterest", "facebook"]
const REFERRER_PLATFORM = ["github", "producthunt", "news.ycombinator", "medusajs", "shopify"]

type ModeContextValue = {
  mode: Mode
  setMode: (mode: Mode) => void
  showFork: boolean
  closeFork: () => void
  inferredBanner: { visible: boolean; mode: Mode | null }
  dismissBanner: () => void
}

const ModeContext = createContext<ModeContextValue | null>(null)

function isMode(value: unknown): value is Mode {
  return value === "consumer" || value === "investor" || value === "platform"
}

function inferFromReferrer(): Mode | null {
  if (typeof document === "undefined") return null
  const ref = (document.referrer || "").toLowerCase()
  if (!ref) return null
  if (REFERRER_INVESTOR.some((k) => ref.includes(k))) return "investor"
  if (REFERRER_PLATFORM.some((k) => ref.includes(k))) return "platform"
  if (REFERRER_CONSUMER.some((k) => ref.includes(k))) return "consumer"
  return null
}

function modeFromUrl(): Mode | null {
  if (typeof window === "undefined") return null
  const param = new URL(window.location.href).searchParams.get("mode")
  return isMode(param) ? param : null
}

export function ModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<Mode>("consumer")
  const [showFork, setShowFork] = useState(false)
  const [inferredBanner, setInferredBanner] = useState<{ visible: boolean; mode: Mode | null }>({
    visible: false,
    mode: null,
  })

  // Resolve mode on mount. Order: URL → localStorage → referrer → fork.
  useEffect(() => {
    const fromUrl = modeFromUrl()
    if (fromUrl) {
      setModeState(fromUrl)
      try { localStorage.setItem(STORAGE_KEY, fromUrl) } catch { /* storage blocked */ }
      return
    }
    let stored: string | null = null
    try { stored = localStorage.getItem(STORAGE_KEY) } catch { /* storage blocked */ }
    if (isMode(stored)) {
      setModeState(stored)
      return
    }
    const inferred = inferFromReferrer()
    let visited: string | null = null
    try { visited = localStorage.getItem(VISITED_KEY) } catch { /* storage blocked */ }
    if (inferred) {
      setModeState(inferred)
      if (!visited) setInferredBanner({ visible: true, mode: inferred })
    } else if (!visited) {
      setShowFork(true)
    }
  }, [])

  // Mirror mode onto body so CSS [data-aud] visibility rules can apply.
  useEffect(() => {
    if (typeof document === "undefined") return
    document.body.dataset.mode = mode
  }, [mode])

  const setMode = useCallback((next: Mode) => {
    setModeState(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
      localStorage.setItem(VISITED_KEY, "1")
    } catch { /* storage blocked */ }
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href)
      url.searchParams.set("mode", next)
      window.history.replaceState(null, "", url.toString())
    }
    setInferredBanner({ visible: false, mode: null })
  }, [])

  const closeFork = useCallback(() => {
    setShowFork(false)
    try { localStorage.setItem(VISITED_KEY, "1") } catch { /* storage blocked */ }
  }, [])

  const dismissBanner = useCallback(() => {
    setInferredBanner({ visible: false, mode: null })
    try { localStorage.setItem(VISITED_KEY, "1") } catch { /* storage blocked */ }
  }, [])

  return (
    <ModeContext.Provider value={{ mode, setMode, showFork, closeFork, inferredBanner, dismissBanner }}>
      {children}
    </ModeContext.Provider>
  )
}

export function useMode(): ModeContextValue {
  const ctx = useContext(ModeContext)
  if (!ctx) throw new Error("useMode must be used within ModeProvider")
  return ctx
}
