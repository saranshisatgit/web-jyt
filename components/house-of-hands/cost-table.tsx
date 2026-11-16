import s from './house-of-hands.module.css'

/** A plain data table; the last column is the figure that matters and reads in teal. Scrolls sideways on a phone. */
export function CostTable({ columns, rows, note }: { columns: string[]; rows: string[][]; note?: string }) {
  return (
    <>
      <div className={s.tableWrap}>
        <table className={s.table}>
          <thead>
            <tr>
              {columns.map((c) => (
                <th key={c}>{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.join('|')}>
                {r.map((cell, i) => (
                  <td key={i}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {note ? <p className={s.note}>{note}</p> : null}
    </>
  )
}
