import type { CSSProperties } from 'react'
import s from './house-of-hands.module.css'

export type ChainLink = { role: string; name: string; place?: string }

/** Partners in order, joined by arrows (down arrows on a phone). Reads light or dark from its Section. */
export function PartnerChain({ links, caption }: { links: ChainLink[]; caption?: string }) {
  return (
    <>
      <div className={s.chain} style={{ '--cols': links.length } as CSSProperties}>
        {links.map((l) => (
          <div key={l.name} className={s.link}>
            <span className={s.linkRole}>{l.role}</span>
            <b className={s.linkName}>{l.name}</b>
            {l.place ? <i className={s.linkPlace}>{l.place}</i> : null}
          </div>
        ))}
      </div>
      {caption ? <p className={s.caption}>{caption}</p> : null}
    </>
  )
}
