import type { ReactNode } from 'react'
import s from './house-of-hands.module.css'

export type SectionTone = 'paper' | 'paper2' | 'dark' | 'ink'

const TONE: Record<SectionTone, string> = {
  paper: s['tone-paper'],
  paper2: s['tone-paper2'],
  dark: s['tone-dark'],
  ink: s['tone-ink'],
}

/** A full-width band. `dark` is the teal-deep page of the booklet; `ink` the near-black poster CTA. */
export function Section({
  tone = 'paper',
  id,
  narrow,
  children,
}: {
  tone?: SectionTone
  id?: string
  /** Keep the text column to ~820px. */
  narrow?: boolean
  children: ReactNode
}) {
  return (
    <section id={id} className={`${s.section} ${TONE[tone]}`}>
      <div className={narrow ? `${s.inner} ${s.narrow}` : s.inner}>{children}</div>
    </section>
  )
}
