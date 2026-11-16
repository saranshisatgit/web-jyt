/* eslint-disable @next/next/no-img-element -- print artwork: exact mm sizing, no optimiser */
import { Fragment } from 'react'
import type { SellAnywherePoster } from '@/data/melbourne-posters'
import { PosterTop } from './poster-top'
import { Rich } from './rich'
import shared from './shared.module.css'
import s from './sell-anywhere.module.css'

export function SellAnywhere({ poster: p }: { poster: SellAnywherePoster }) {
  const { covered, range, prices, climate, khadi, blends, cta } = p

  return (
    <>
      <PosterTop kicker={p.kicker} headline={p.headline}>
        <p className={s.lede}>
          <Rich text={p.lede} />
        </p>
        <p className={s.proof}>
          <span>{p.proof.label}</span>
          {p.proof.labels.map((l, i) => (
            <Fragment key={l.name}>
              {i > 0 && <i />}
              <b>{l.name}</b> {l.place}
            </Fragment>
          ))}
        </p>
      </PosterTop>

      <div className={s.covered}>
        <div>
          <div className={`${shared.kicker} ${s.paleKicker}`}>{covered.kicker}</div>
          <h2 className={s.h2}>{covered.heading}</h2>
          <div className={s.pillars}>
            {covered.pillars.map((pl) => (
              <div key={pl.title} className={s.pillar}>
                <b>{pl.title}</b>
                <span>{pl.text}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <figure className={s.shot}>
            <img src={covered.shot.src} alt={covered.shot.alt} />
            <figcaption>{covered.shot.caption}</figcaption>
          </figure>
          <blockquote className={s.quote}>
            {covered.quote.text}
            <cite>{covered.quote.cite}</cite>
          </blockquote>
        </div>
      </div>

      <div className={s.range}>
        <div className={s.secHead}>
          <h2 className={s.h2}>{range.heading}</h2>
          <div className={shared.kicker}>{range.kicker}</div>
        </div>
        <div className={s.rangeGrid}>
          {range.items.map((it) => (
            <figure key={it.src}>
              <img src={it.src} alt="" style={{ objectPosition: it.pos }} />
              <figcaption>
                {it.title}
                <span>{it.text}</span>
              </figcaption>
            </figure>
          ))}
        </div>
        <p className={s.also}>
          <Rich text={range.also} />
        </p>
      </div>

      <div className={s.facts3}>
        <div className={`${s.card} ${s.prices}`}>
          <div className={shared.kicker}>{prices.kicker}</div>
          <h4>{prices.heading}</h4>
          <table>
            <tbody>
              <tr>
                {prices.columns.map((c) => (
                  <th key={c}>{c}</th>
                ))}
              </tr>
              {prices.rows.map((row) => (
                <tr key={row[0]}>
                  {row.map((cell, i) => (
                    <td key={i}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <p className={s.fine}>{prices.fine}</p>
          <p className={s.duty}>
            <Rich text={prices.duty} />
          </p>
        </div>
        <div className={`${s.card} ${s.climate}`}>
          <div className={`${shared.kicker} ${s.paleKicker}`}>{climate.kicker}</div>
          <h4>{climate.heading}</h4>
          <p>{climate.text}</p>
          <div className={s.kwh}>
            <b>{climate.value}</b>
            <span>{climate.valueText}</span>
          </div>
        </div>
        <div className={s.khadi}>
          <div className={shared.kicker}>{khadi.kicker}</div>
          <div>
            <div className={s.big}>
              {khadi.value} <small>{khadi.unit}</small>
            </div>
            <p>
              <Rich text={khadi.text} />
            </p>
          </div>
          <div className={s.looms}>
            <b>{khadi.looms}</b>
            <p>{khadi.loomsText}</p>
          </div>
        </div>
      </div>

      <div className={s.blends}>
        <h2 className={s.h2}>{blends.heading}</h2>
        <div className={s.blendRow}>
          <div className={s.swatches}>
            {blends.swatches.map((sw) => (
              <figure key={sw.src}>
                <img src={sw.src} alt="" />
                <figcaption>{sw.caption}</figcaption>
              </figure>
            ))}
          </div>
          <div className={s.chips}>
            {blends.chips.map((c) => (
              <i key={c}>{c}</i>
            ))}
          </div>
        </div>
      </div>

      <div className={s.cta}>
        <div>
          <div className={`${shared.kicker} ${s.paleKicker}`}>{cta.kicker}</div>
          <h2 className={s.h2}>{cta.heading}</h2>
          <p>
            <Rich text={cta.text} />
          </p>
        </div>
        <div className={s.qr}>
          <img src={p.qr.src} alt={p.qr.alt} />
          <span>{p.qr.caption}</span>
        </div>
      </div>
    </>
  )
}
