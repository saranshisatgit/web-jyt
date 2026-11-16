import type { CSSProperties } from 'react'
import s from './house-of-hands.module.css'

export type Stat = { value: string; label: string }

/** A row of big serif numbers under a heavy rule. */
export function StatRow({ items }: { items: Stat[] }) {
  return (
    <div className={s.stats} style={{ '--cols': items.length } as CSSProperties}>
      {items.map((it) => (
        <div key={it.label}>
          <div className={s.statValue}>{it.value}</div>
          <div className={s.statLabel}>{it.label}</div>
        </div>
      ))}
    </div>
  )
}
