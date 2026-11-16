/* eslint-disable @next/next/no-img-element -- print artwork: exact mm sizing, no optimiser */
import type { HouseOfHandsPoster } from '@/data/melbourne-posters'
import { PosterTop } from './poster-top'
import shared from './shared.module.css'
import s from './house-of-hands.module.css'

export function HouseOfHands({ poster: p }: { poster: HouseOfHandsPoster }) {
  const { strips, widths, wefts, credit } = p.loom
  const columns = strips.map((st) => `${widths[st.kind]}fr`).join(' ')
  const top = (y: number) => `calc(${y * 100}% - 3.5mm)`

  return (
    <>
      <PosterTop kicker={p.kicker} headline={p.headline}>
        <p className={s.lede}>{p.lede}</p>
      </PosterTop>

      <div className={s.loomWrap}>
        <div className={s.loom}>
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
          {/* Each band passes over every other strip, shifting one strip per row. */}
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
        <div className={s.credit}>
          <span>{credit[0]}</span>
          <span>{credit[1]}</span>
        </div>
      </div>

      <div className={s.pills}>
        {p.pills.map((pill) => (
          <div key={pill.title} className={s.pill}>
            <b>{pill.title}</b>
            <span>{pill.text}</span>
          </div>
        ))}
      </div>

      <div className={s.cta}>
        <div>
          <div className={`${shared.kicker} ${s.ctaKicker}`}>{p.cta.kicker}</div>
          <h2>{p.cta.heading}</h2>
          <p>{p.cta.text}</p>
          <div className={s.contact}>
            {p.cta.contacts.map((c) => (
              <div key={c.label}>
                <small>{c.label}</small>
                {c.value}
              </div>
            ))}
          </div>
        </div>
        <div className={s.qr}>
          <img src={p.qr.src} alt={p.qr.alt} />
          <span>{p.qr.caption}</span>
        </div>
      </div>
      <div className={s.foot}>
        <span>{p.foot.left}</span>
        <span className={s.footDeva}>{p.foot.right}</span>
      </div>
    </>
  )
}
