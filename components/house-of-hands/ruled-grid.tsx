import type { CSSProperties } from 'react'
import s from './house-of-hands.module.css'

export type RuledItem = { title: string; who?: string; where?: string; text?: string }

/**
 * Rule-topped text blocks in a grid: the booklet's network, the hands behind
 * the cloth, how the hands exchange. `accentRule` draws the top rule in teal.
 */
export function RuledGrid({
  items,
  columns = 2,
  accentRule,
}: {
  items: RuledItem[]
  columns?: number
  accentRule?: boolean
}) {
  return (
    <div className={accentRule ? `${s.ruled} ${s.ruledAccent}` : s.ruled} style={{ '--cols': columns } as CSSProperties}>
      {items.map((it) => (
        <div key={it.title + (it.who ?? '')} className={s.ruledItem}>
          <h3 className={s.ruledTitle}>{it.title}</h3>
          {it.who || it.where ? (
            <div className={s.ruledMeta}>
              {it.who}
              {it.where ? <span>{it.where}</span> : null}
            </div>
          ) : null}
          {it.text ? <p className={s.ruledText}>{it.text}</p> : null}
        </div>
      ))}
    </div>
  )
}
