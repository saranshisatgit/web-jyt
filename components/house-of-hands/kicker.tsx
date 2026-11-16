import type { ReactNode } from 'react'
import s from './house-of-hands.module.css'

/** The small uppercase label above a heading. */
export function Kicker({ children }: { children: ReactNode }) {
  return <div className={s.kicker}>{children}</div>
}
