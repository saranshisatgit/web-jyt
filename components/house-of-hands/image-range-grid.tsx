/* eslint-disable @next/next/no-img-element -- local JPGs already sized for web */
import type { CSSProperties } from 'react'
import s from './house-of-hands.module.css'

export type RangeItem = { src: string; title: string; text?: string; pos?: string; alt?: string }

/** Photo grid with a bold title and a muted line under each picture. Two across on a phone. */
export function ImageRangeGrid({ items, columns = 4 }: { items: RangeItem[]; columns?: number }) {
  return (
    <div className={s.range} style={{ '--cols': columns } as CSSProperties}>
      {items.map((it) => (
        <figure key={it.src}>
          <img src={it.src} alt={it.alt ?? it.title} style={{ objectPosition: it.pos }} />
          <figcaption>
            {it.title}
            {it.text ? <span>{it.text}</span> : null}
          </figcaption>
        </figure>
      ))}
    </div>
  )
}
