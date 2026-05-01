/**
 * Site-wide "blueprint" grid overlay — the faint graph-paper rails
 * that medusajs.com runs across the page. Vertical hairlines bracket
 * the max-width content column, plus an inner pair of thirds rails;
 * horizontal hairlines stride the viewport at fixed intervals so the
 * page reads like architectural plan paper.
 *
 * Pointer-events-none, fixed, z-50 — sits above section backgrounds
 * but never intercepts clicks. Lines are intentionally faint
 * (~6% opacity) so they're texture, not chrome.
 */

export function BlueprintGrid() {
  // Horizontal rails at fixed viewport-relative positions.
  // 12.5%, 37.5%, 62.5%, 87.5% — quarter ticks offset by half a quarter
  // so they don't clash with section centers.
  const horizontalPercents = [12.5, 37.5, 62.5, 87.5];

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-50"
    >
      {/* Vertical rails — aligned to the centered max-w-7xl column. */}
      <div className="absolute inset-0 flex justify-center">
        <div className="relative h-full w-full max-w-[80rem] px-6 lg:px-10">
          <span className="absolute inset-y-0 left-6 w-px bg-olive-950/[0.07] lg:left-10" />
          <span className="absolute inset-y-0 right-6 w-px bg-olive-950/[0.07] lg:right-10" />
          <span className="absolute inset-y-0 left-1/3 hidden w-px bg-olive-950/[0.04] lg:block" />
          <span className="absolute inset-y-0 left-2/3 hidden w-px bg-olive-950/[0.04] lg:block" />
        </div>
      </div>

      {/* Horizontal rails — full viewport width. */}
      {horizontalPercents.map((p) => (
        <span
          key={p}
          className="absolute inset-x-0 h-px bg-olive-950/[0.05]"
          style={{ top: `${p}%` }}
        />
      ))}
    </div>
  )
}
