import s from './house-of-hands.module.css'

export type Hub = { place: string; craft: string }

/** Two-column list of places and what is made there, on dotted rules. */
export function HubsList({ hubs }: { hubs: Hub[] }) {
  return (
    <div className={s.hubs}>
      {hubs.map((h) => (
        <div key={h.place} className={s.hub}>
          <b>{h.place}</b>
          <span>{h.craft}</span>
        </div>
      ))}
    </div>
  )
}
