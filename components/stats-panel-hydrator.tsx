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
 * This component bridges the two. It scans the visible container for
 * `[data-stats-panel]` divs that contain a JSON
 * `<script data-panel-payload>` (embedded by the renderHTML in
 * stats-panel.tsx), wipes each one, and mounts a real
 * `<StatsPanelHydrated />` React subtree in its place.
 *
 * Critical: a MutationObserver watches the container for childList
 * changes. When the parent re-renders, React re-applies
 * `dangerouslySetInnerHTML`, which removes our mounted React subtrees
 * and re-injects the original static HTML. The observer detects this
 * and re-runs the hydration on each affected panel. Without it the
 * panels render once then flicker back to static every time the parent
 * state changes (e.g. TipTap firing 'update' events).
 *
 * Scoped to a CSS selector (default: `.blog-content`) so the hidden
 * TipTap editor's panels aren't double-hydrated.
 */
export function StatsPanelHydrator({ rootSelector = '.blog-content' }: { rootSelector?: string }) {
  useEffect(() => {
    // Track which DOM element each Root is mounted into so we can
    // unmount the old root before re-mounting after a wipe.
    const rootByEl = new WeakMap<HTMLElement, Root>()

    const hydratePanel = (el: HTMLElement): void => {
      // Skip if the panel still has our React subtree intact.
      if (el.dataset.panelHydrated === '1' && el.firstElementChild?.classList?.contains('stats-panel')) {
        return
      }

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

      // Unmount any prior root before wiping + remounting.
      const prev = rootByEl.get(el)
      if (prev) {
        try { prev.unmount() } catch { /* already unmounted */ }
        rootByEl.delete(el)
      }

      el.innerHTML = ''
      el.dataset.panelHydrated = '1'
      // Drop the outer "stats-panel my-6 border ..." styling from the
      // container because <StatsPanelHydrated /> renders its own; double
      // borders look bad otherwise.
      el.className = ''

      try {
        const root = createRoot(el)
        root.render(
          <StatsPanelHydrated
            panelType={payload.panelType as any}
            title={payload.title ?? null}
            data={payload.data as any}
            display={payload.display as any}
          />
        )
        rootByEl.set(el, root)
      } catch (err: any) {
        console.error('[stats-panel-hydrator] createRoot threw:', err?.message || err)
      }
    }

    const hydrateAll = (container: Element) => {
      container.querySelectorAll<HTMLElement>('[data-stats-panel]').forEach(hydratePanel)
    }

    const container = document.querySelector(rootSelector)
    if (!container) return

    // Initial hydration pass.
    hydrateAll(container)

    // Re-hydrate whenever the parent rewrites the container (e.g.
    // dangerouslySetInnerHTML re-applies on every parent re-render).
    // Watching the container's direct children covers the case where
    // the entire panel set is replaced. Subtree=true is needed because
    // some renderers nest panels inside paragraph/list blocks.
    const observer = new MutationObserver((mutations) => {
      let needsRehydrate = false
      for (const m of mutations) {
        if (m.type !== 'childList') continue
        // Only react when nodes were added that look like our panels,
        // or when our hydrated panels got removed.
        for (const node of Array.from(m.addedNodes)) {
          if (node.nodeType === 1) {
            const el = node as Element
            if (el.matches?.('[data-stats-panel]') || el.querySelector?.('[data-stats-panel]')) {
              needsRehydrate = true
            }
          }
        }
      }
      if (needsRehydrate) hydrateAll(container)
    })
    observer.observe(container, { childList: true, subtree: true })

    return () => {
      observer.disconnect()
      // Defer unmounts to next tick — React 19 throws when unmount runs
      // synchronously during a parent re-render.
      container.querySelectorAll<HTMLElement>('[data-stats-panel]').forEach((el) => {
        const root = rootByEl.get(el)
        if (root) {
          setTimeout(() => {
            try { root.unmount() } catch { /* already unmounted */ }
          }, 0)
        }
      })
    }
  }, [rootSelector])

  return null
}
