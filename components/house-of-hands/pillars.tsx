import s from './house-of-hands.module.css'

export type Pillar = { title: string; text: string }

/** A 2 × 2 of serif titles over short lines; made for a dark Section. */
export function Pillars({ items }: { items: Pillar[] }) {
  return (
    <div className={s.pillars}>
      {items.map((p) => (
        <div key={p.title} className={s.pillar}>
          <b>{p.title}</b>
          <span>{p.text}</span>
        </div>
      ))}
    </div>
  )
}
