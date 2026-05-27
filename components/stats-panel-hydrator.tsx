'use client'

import { useEffect } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { StatsPanelHydrated } from './stats-panel'

/**
 * Client-side hydrator for embedded stats panels.
 *
 * The blog page architecture renders the TipTap document twice:
 *   1. A hidden `<TipTapRenderer>` whose only job is to emit static
 *      HTML via `editor.getHTML()` (post-main-content-area.tsx:54).
 *   2. A visible `<div dangerouslySetInnerHTML={...} />` displaying
 *      that static HTML (post-main-content-area.tsx:72).
 *
 * Static HTML doesn't carry React state, so pagination / search /
 * filtering on stats panels can't work in the visible copy. The
 * hidden React copy has them but is `display: none`.
 *
 * This component bridges the two. On mount it scans the visible
 * container for `[data-stats-panel]` divs that contain a JSON
 * `<script data-panel-payload>` (embedded by the renderHTML in
 * stats-panel.tsx), wipes each one, and mounts a real
 * `<StatsPanelHydrated />` React subtree in its place. Result: blog
 * readers get the full interactive panel surface.
 *
 * Scoped to a CSS selector (default: `.blog-content`) so the hidden
 * TipTap editor's panels aren't double-hydrated.
 */
export function StatsPanelHydrator({ rootSelector = '.blog-content' }: { rootSelector?: string }) {
  useEffect(() => {
    const roots: Root[] = []

    const container = document.querySelector(rootSelector)
    if (!container) return

    container.querySelectorAll<HTMLElement>('[data-stats-panel]').forEach((el) => {
      // Idempotent — skip already-hydrated elements (e.g. on re-render
      // when the parent state changes but the static HTML stays put).
      if (el.dataset.panelHydrated === '1') return

      const payloadScript = el.querySelector<HTMLScriptElement>(
        'script[data-panel-payload]'
      )
      if (!payloadScript || !payloadScript.textContent) return

      let payload: {
        panelType?: string | null
        title?: string | null
        data?: Record<string, unknown> | null
        display?: Record<string, unknown> | null
      }
      try {
        payload = JSON.parse(payloadScript.textContent)
      } catch (err) {
        console.warn('[stats-panel-hydrator] failed to parse payload', err)
        return
      }

      // Wipe the static body (table / list / etc.) and replace with the
      // React root. The container div itself stays so external styles
      // and the `data-panel-id` attribute remain stable.
      el.innerHTML = ''
      el.dataset.panelHydrated = '1'
      // Drop the outer "stats-panel my-6 border ..." styling from the
      // container because <StatsPanelHydrated /> renders its own; double
      // borders look bad otherwise.
      el.className = ''

      const root = createRoot(el)
      root.render(
        <StatsPanelHydrated
          panelType={payload.panelType as any}
          title={payload.title ?? null}
          data={payload.data as any}
          display={payload.display as any}
        />
      )
      roots.push(root)
    })

    return () => {
      // Defer unmount to the next tick — calling root.unmount() during
      // a parent re-render synchronously throws in React 19.
      for (const r of roots) {
        setTimeout(() => {
          try { r.unmount() } catch { /* already unmounted */ }
        }, 0)
      }
    }
  }, [rootSelector])

  return null
}
