/* eslint-disable @next/next/no-img-element -- QR codes are static SVGs */
import { Heading } from './heading'
import { Kicker } from './kicker'
import { Lede } from './lede'
import s from './house-of-hands.module.css'

export type Contact = { label: string; value: string; href?: string }

/** The closing card: heading, contacts and a QR code. `ink` swaps teal-deep for near-black. */
export function QrCta({
  kicker,
  heading,
  accent,
  text,
  contacts,
  qr,
  tone = 'teal',
}: {
  kicker?: string
  heading: string
  accent?: string
  text?: string
  contacts: Contact[]
  qr?: { src: string; alt: string; caption?: string }
  tone?: 'teal' | 'ink'
}) {
  return (
    <div className={tone === 'ink' ? `${s.cta} ${s.ctaInk}` : s.cta}>
      <div>
        {kicker ? <Kicker>{kicker}</Kicker> : null}
        <Heading lead={heading} accent={accent} size="m" />
        {text ? <Lede text={text} /> : null}
        <div className={s.contacts}>
          {contacts.map((c) => (
            <div key={c.label}>
              <small>{c.label}</small>
              {c.href ? <a href={c.href}>{c.value}</a> : <span>{c.value}</span>}
            </div>
          ))}
        </div>
      </div>
      {qr ? (
        <div className={s.qr}>
          <img src={qr.src} alt={qr.alt} />
          {qr.caption ? <span>{qr.caption}</span> : null}
        </div>
      ) : null}
    </div>
  )
}
