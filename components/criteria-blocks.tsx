import { CheckCircleMiniSolid } from '@medusajs/icons'

/**
 * Shared building blocks for the B Corp compliance pages (/purpose,
 * /stakeholders, and future siblings). Server-safe — no client state.
 */

// Muted text on the dark slate panels — matches .kt-card.dark / about page.
export const ON_DARK_MUTE = 'oklch(0.8 0.04 264)'

/** Canonical 2-cell section head: eyebrow + criteria pill left, display title right. */
export function SectionHead({
  eyebrow,
  criteriaPill,
  title,
  onDark,
}: {
  eyebrow: string
  criteriaPill: string
  title: string
  onDark?: boolean
}) {
  return (
    <div className="kt-section-head">
      <div>
        <div className={`kt-eyebrow${onDark ? ' on-dark' : ''}`}>
          <span className="dot" aria-hidden />
          {eyebrow}
        </div>
        <div style={{ marginTop: 14 }}>
          <span className="kt-pill accent">{criteriaPill}</span>
        </div>
      </div>
      <h2 className="kt-display m" style={onDark ? { color: 'var(--cream)' } : undefined}>
        {title}
      </h2>
    </div>
  )
}

/** Section lede paragraph — muted on light, slate-blue on dark. */
export function SectionLede({ text, onDark }: { text: string; onDark?: boolean }) {
  return (
    <p
      className={onDark ? undefined : 'muted'}
      style={{
        fontSize: 19,
        maxWidth: 720,
        lineHeight: 1.55,
        margin: 0,
        color: onDark ? ON_DARK_MUTE : undefined,
      }}
    >
      {text}
    </p>
  )
}

export type CriteriaMapRow = {
  ref: string
  requirement: string
  where: string
}

/**
 * The accent criteria-map card: one row per sub-criterion — check icon,
 * reference chip, the verbatim requirement, and where on the page it is
 * satisfied. Used as the evaluator-facing summary at the bottom of each
 * compliance page.
 */
export function CriteriaMapCard({
  rows,
  footer,
}: {
  rows: CriteriaMapRow[]
  footer?: React.ReactNode
}) {
  return (
    <div className="kt-card accent" style={{ marginTop: 48, padding: '12px 32px 30px' }}>
      {rows.map((row, i) => (
        <div
          key={row.ref}
          style={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 14,
            padding: '20px 0',
            borderBottom: i < rows.length - 1 ? '1px solid rgba(66, 85, 148, 0.22)' : 'none',
          }}
        >
          <CheckCircleMiniSolid
            style={{
              width: 20,
              height: 20,
              color: 'var(--accent-deep)',
              flexShrink: 0,
            }}
          />
          <span className="kt-pill solid" style={{ padding: '3px 12px' }}>
            {row.ref}
          </span>
          <span
            style={{ flex: '1 1 300px', fontSize: 15, lineHeight: 1.5, color: 'var(--ink)' }}
          >
            {row.requirement}
          </span>
          <span className="kt-meta" style={{ color: 'var(--accent-deep)' }}>
            {row.where}
          </span>
        </div>
      ))}
      {footer && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 14,
            paddingTop: 24,
          }}
        >
          {footer}
        </div>
      )}
    </div>
  )
}

/** Small solid letter/number chip used for stakeholder & criterion references. */
export function RefChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="kt-pill solid" style={{ padding: '3px 12px' }}>
      {children}
    </span>
  )
}
