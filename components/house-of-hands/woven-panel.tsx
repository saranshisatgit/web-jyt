/* eslint-disable @next/next/no-img-element -- strips crop by object-position */
import type { CSSProperties } from 'react'
import s from './house-of-hands.module.css'

export type WovenStrip = { src: string; pos?: string; kind: 'look' | 'art' }

/**
 * The House of Hands loom: photo and painting strips as the warp, paper bands
 * as the weft, each band passing over every other strip and shifting one strip
 * per row. Lifted from components/melbourne-poster/house-of-hands.tsx.
 */
export function WovenPanel({
  strips,
  widths = { look: 2.1, art: 1 },
  wefts = [0.36, 0.66, 0.93],
  credit,
  height,
}: {
  strips: WovenStrip[]
  /** Relative strip widths by kind. */
  widths?: { look: number; art: number }
  /** Band centres, as a share of the panel height. */
  wefts?: number[]
  credit?: [string, string]
  /** CSS height, e.g. '480px'. Defaults to a fluid clamp. */
  height?: string
}) {
  const columns = strips.map((st) => `${widths[st.kind]}fr`).join(' ')
  const top = (y: number) => `calc(${y * 100}% - var(--band) / 2)`
  return (
    <div>
      <div className={s.loom} style={height ? ({ '--loom-h': height } as CSSProperties) : undefined}>
        {wefts.map((y) => (
          <div key={y} className={s.weft} style={{ top: top(y) }} />
        ))}
        <div className={s.warp} style={{ gridTemplateColumns: columns }}>
          {strips.map((st) => (
            <div key={st.src} className={s.strip}>
              <img src={st.src} alt="" style={{ objectPosition: st.pos }} />
            </div>
          ))}
        </div>
        <div className={s.overGrid} style={{ gridTemplateColumns: columns }}>
          {strips.map((st, col) => (
            <div key={st.src} className={s.overCell}>
              {wefts.map((y, row) =>
                (col + row) % 2 ? null : <div key={y} className={s.over} style={{ top: top(y) }} />,
              )}
            </div>
          ))}
        </div>
      </div>
      {credit ? (
        <div className={s.credit}>
          <span>{credit[0]}</span>
          <span>{credit[1]}</span>
        </div>
      ) : null}
    </div>
  )
}
