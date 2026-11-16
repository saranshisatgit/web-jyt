import type { CSSProperties } from 'react'
import s from './house-of-hands.module.css'

export type Tile = { title: string; text: string }

/** Teal-pale tiles: a serif title and a short line ("No MOQ · start from one piece"). */
export function TileGrid({ tiles, columns }: { tiles: Tile[]; columns?: number }) {
  return (
    <div className={s.tiles} style={{ '--cols': columns ?? tiles.length } as CSSProperties}>
      {tiles.map((t) => (
        <div key={t.title} className={s.tile}>
          <b>{t.title}</b>
          <span>{t.text}</span>
        </div>
      ))}
    </div>
  )
}
