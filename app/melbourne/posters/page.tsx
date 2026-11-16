/* eslint-disable @next/next/no-img-element -- static print previews */
import type { Metadata } from 'next'
import Link from 'next/link'
import { DEFAULT_THEME, HEADER, POSTERS, POSTERS_PAGE } from '@/data/melbourne-posters'
import { posterDeva, posterSerif } from '@/components/melbourne-poster/fonts'
import { themeVars } from '@/components/melbourne-poster/poster'
import s from '@/components/melbourne-poster/posters-index.module.css'

export const metadata: Metadata = {
  title: POSTERS_PAGE.title,
  description: POSTERS_PAGE.description,
  openGraph: {
    title: POSTERS_PAGE.ogTitle,
    images: [POSTERS_PAGE.ogImage],
    url: 'https://jaalyantra.com/melbourne/posters',
  },
}

export default function MelbournePostersPage() {
  const { heading, booklet } = POSTERS_PAGE
  return (
    <div
      className={`${s.root} ${posterSerif.variable} ${posterDeva.variable}`}
      style={themeVars(DEFAULT_THEME)}
    >
      <div className={s.wrap}>
        <div className={s.head}>
          <span>
            {HEADER.brand}
            <span className={s.deva}>{HEADER.brandDeva}</span>
          </span>
          <span>
            {HEADER.event} · <span className={s.stand}>{HEADER.stand}</span> · {HEADER.dates}
          </span>
        </div>
        <h1 className={s.h1}>
          {heading.lead}
          <span>{heading.accent}</span>
        </h1>
        <p className={s.lede}>{POSTERS_PAGE.lede}</p>

        <div className={s.grid}>
          {POSTERS.map((p) => {
            const href = `/melbourne/posters/${p.slug}`
            return (
              <div key={p.slug} className={s.card}>
                <Link className={s.thumb} href={href}>
                  <img src={p.card.preview} alt={`Poster ${p.number}: ${p.card.heading}`} loading="lazy" />
                </Link>
                <div className={s.body}>
                  <div className={s.n}>Poster {p.number}</div>
                  <h2>{p.card.heading}</h2>
                  <p>{p.card.blurb}</p>
                  <div className={s.links}>
                    <Link className={s.primary} href={href}>
                      View
                    </Link>
                    <a href={p.card.pdf} download>
                      Print PDF
                    </a>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className={s.booklet}>
          <b>{booklet.heading}</b>
          <div className={s.links}>
            <a className={s.primary} href={booklet.read.href}>
              {booklet.read.label}
            </a>
            <a href={booklet.pdf.href} download={booklet.pdf.filename}>
              {booklet.pdf.label}
            </a>
          </div>
        </div>
        <p className={s.note}>{POSTERS_PAGE.note}</p>
      </div>
    </div>
  )
}
