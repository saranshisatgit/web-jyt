import type { ReactNode } from 'react'
import { HEADER, type Headline } from '@/data/melbourne-posters'
import s from './shared.module.css'

/** The head band, kicker and two-line headline every poster opens with. */
export function PosterTop({
  kicker,
  headline,
  children,
}: {
  kicker: string
  headline: Headline
  children?: ReactNode
}) {
  return (
    <div className={s.top}>
      <div className={s.head}>
        <span>
          {HEADER.brand}
          <span className={s.deva}>{HEADER.brandDeva}</span>
        </span>
        <span>
          {HEADER.event} · <b className={s.stand}>{HEADER.stand}</b> · {HEADER.dates}
        </span>
      </div>
      <div className={`${s.kicker} ${s.topKicker}`}>{kicker}</div>
      <h1 className={s.h1}>
        {headline.lead}
        <br />
        <span className={s.accent}>{headline.accent}</span>
      </h1>
      {children}
    </div>
  )
}
