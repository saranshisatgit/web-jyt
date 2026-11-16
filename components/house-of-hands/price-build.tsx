import s from './house-of-hands.module.css'

export type BuildRow = { label: string; detail: string; value: string; kind?: 'sub' | 'total' }

/** A price built line by line: rows, a shaded subtotal, a serif total. */
export function PriceBuild({ rows }: { rows: BuildRow[] }) {
  return (
    <div className={s.build}>
      {rows.map((r) => (
        <div
          key={r.label}
          className={`${s.buildRow} ${r.kind === 'sub' ? s.buildSub : ''} ${r.kind === 'total' ? s.buildTotal : ''}`}
        >
          <span className={s.buildKey}>{r.label}</span>
          <span className={s.buildDetail}>{r.detail}</span>
          <span className={s.buildValue}>{r.value}</span>
        </div>
      ))}
    </div>
  )
}
