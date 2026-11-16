/* eslint-disable @next/next/no-img-element -- print artwork: exact mm sizing, no optimiser */
import { Fragment } from 'react'
import type { SupplyLinePoster } from '@/data/melbourne-posters'
import { PosterTop } from './poster-top'
import { Rich } from './rich'
import shared from './shared.module.css'
import s from './supply-line.module.css'

// The map panel is 542 x 285.2 mm (the sheet less 26 mm margins), so every position
// is computed here, in mm, rather than measured in the browser. The HTML original
// asked for 292 mm and flexbox squeezed it to 285.2 mm; its script measured that,
// so the printed threads, knots and labels are placed for 285.2. Keep this in step
// with .map's height in supply-line.module.css.
const W = 542
const H = 285.2
// India window: lon 68.5 to 90.5, lat 14.5 to 35.5, equirectangular with a cos(23°)
// squeeze. x, y: mm position of the window corner; s: mm per degree of latitude.
const BOX = { lon: 68.5, lat: 35.5, x: 236, y: 16, s: 12.8 }
const px = (lon: number) => BOX.x + (lon - BOX.lon) * Math.cos((23 * Math.PI) / 180) * BOX.s
const py = (lat: number) => BOX.y + (BOX.lat - lat) * BOX.s
// Each away thread leaves from a knot just right of its heading.
const AWAY_TOP = { top: 80, bottom: H - 76 }
const KNOT_X = 140

function curve(x1: number, y1: number, x2: number, y2: number, bend: number) {
  const mx = (x1 + x2) / 2
  const my = (y1 + y2) / 2
  const dx = x2 - x1
  const dy = y2 - y1
  return `M${x1} ${y1} Q${mx - dy * bend} ${my + dx * bend} ${x2} ${y2}`
}

export function SupplyLine({ poster: p }: { poster: SupplyLinePoster }) {
  const { map, how, app } = p
  const home = map.hubs.find((h) => h.home) ?? map.hubs[0]
  const hx = px(home.lon)
  const hy = py(home.lat)
  const lons = [70, 74, 78, 82, 86, 90]
  const lats = [16, 20, 24, 28, 32]

  return (
    <>
      <PosterTop kicker={p.kicker} headline={p.headline}>
        <div className={s.intro}>
          <p className={s.lede}>{p.lede}</p>
          <div className={s.facts}>
            {p.facts.map((f) => (
              <div key={f.value}>
                <b>{f.value}</b>
                {f.text}
              </div>
            ))}
          </div>
        </div>
      </PosterTop>

      <div className={s.map}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 ${W} ${H}`}>
          <g className={s.grid}>
            {lons.map((lon) => (
              <line key={`x${lon}`} x1={px(lon)} y1={py(35.5)} x2={px(lon)} y2={py(14.5)} />
            ))}
            {lats.map((lat) => (
              <line key={`y${lat}`} x1={px(68.5)} y1={py(lat)} x2={px(90.5)} y2={py(lat)} />
            ))}
          </g>
          {map.hubs
            .filter((h) => !h.home)
            .map((h) => (
              <path key={h.place} className={s.thread} d={curve(px(h.lon), py(h.lat), hx, hy, 0.18)} />
            ))}
          {map.away.map((a) => {
            const y = AWAY_TOP[a.id] + 13
            return (
              <g key={a.id}>
                <path
                  className={`${s.thread} ${s.threadOut}`}
                  d={curve(KNOT_X, y, hx, hy, a.id === 'top' ? -0.1 : -0.22)}
                />
                <circle cx={KNOT_X} cy={y} r="1.6" fill="#fff" />
              </g>
            )
          })}
        </svg>
        <div className={s.mapTitle}>
          <div className={`${shared.kicker} ${s.paleKicker}`}>{map.kicker}</div>
          <h2>
            {map.heading.map((line, i) => (
              <span key={line}>
                {i > 0 && <br />}
                {line}
              </span>
            ))}
          </h2>
        </div>
        {map.away.map((a) => (
          <div key={a.id} className={s.away} style={{ top: `${AWAY_TOP[a.id]}mm` }}>
            <div className={`${shared.kicker} ${s.awayKicker}`}>{a.kicker}</div>
            <h3>
              <i className={s.pin} />
              {a.place}
            </h3>
            <p>{a.text}</p>
          </div>
        ))}
        <div className={s.mapNote}>{map.note}</div>
        {map.hubs.map((h) => {
          const x = px(h.lon)
          const y = py(h.lat)
          return (
            <Fragment key={h.place}>
              <i className={`${s.dot} ${h.home ? s.home : ''}`} style={{ left: `${x}mm`, top: `${y}mm` }} />
              <div
                className={`${s.label} ${h.side === 'left' ? s.labelLeft : ''}`}
                style={{
                  top: `${y + (h.nudge ?? 0)}mm`,
                  ...(h.side === 'left' ? { right: `${W - x + 6}mm` } : { left: `${x + 6}mm` }),
                }}
              >
                <b>{h.place}</b>
                <span>{h.craft}</span>
              </div>
            </Fragment>
          )
        })}
      </div>

      <div className={s.how}>
        <div className={s.howHead}>
          <h2>{how.heading}</h2>
          <div className={shared.kicker}>{how.kicker}</div>
        </div>
        <ol className={s.steps}>
          {how.steps.map((step, i) => (
            <li key={step.title} className={i === how.steps.length - 1 ? s.last : undefined}>
              <div className={s.n}>{String(i + 1).padStart(2, '0')}</div>
              <img src={step.icon} alt="" />
              <b>{step.title}</b>
              <span className={s.stepText}>{step.text}</span>
              {step.chips && (
                <div className={s.chips}>
                  {step.chips.map((c) => (
                    <i key={c}>{c}</i>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ol>
        <div className={s.lead}>
          <div>
            <b>{how.lead.label}</b>
          </div>
          {how.lead.times.map((t) => (
            <div key={t.days}>
              <span className={s.days}>{t.days}</span> {t.text}
            </div>
          ))}
          <div className={s.fn}>{how.lead.footnote}</div>
        </div>
      </div>

      <div className={s.bottom}>
        <div className={s.phones}>
          {app.phones.map((ph) => (
            <figure key={ph.src}>
              <img src={ph.src} alt={ph.alt} />
              <figcaption>
                <b>{ph.title}</b>
                {ph.text}
              </figcaption>
            </figure>
          ))}
        </div>
        <div>
          <h3>{app.heading}</h3>
          <p className={s.appCopy}>
            <Rich text={app.text} />
          </p>
          <h3 className={s.mt}>{app.chainHeading}</h3>
          <div className={s.chain}>
            {app.chain.map((c) => (
              <div key={c.name}>
                <b>{c.name}</b>
                {c.role}
              </div>
            ))}
          </div>
          <p className={s.cap}>{app.chainCaption}</p>
        </div>
        <div className={s.qr}>
          <img src={p.qr.src} alt={p.qr.alt} />
          <span>{p.qr.caption}</span>
          {p.qr.note && <em>{p.qr.note}</em>}
        </div>
      </div>
    </>
  )
}
