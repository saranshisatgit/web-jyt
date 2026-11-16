import s from './house-of-hands.module.css'

export type CheckRow = { title: string; text: string }

/** Label + explanation rows, as in the booklet's "Why it is safe to source with us". */
export function CheckRows({ rows }: { rows: CheckRow[] }) {
  return (
    <div className={s.checks}>
      {rows.map((r) => (
        <div key={r.title} className={s.check}>
          <b>{r.title}</b>
          <span>{r.text}</span>
        </div>
      ))}
    </div>
  )
}
