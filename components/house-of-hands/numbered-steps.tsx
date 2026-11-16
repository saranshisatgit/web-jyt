import type { CSSProperties } from 'react'
import { Illustration, type IllustrationName } from './illustration'
import s from './house-of-hands.module.css'

export type Step = { title: string; text: string; illustration?: IllustrationName; chips?: string[] }

/**
 * Numbered steps (01, 02…). `list` is the booklet's ruled list; `cards` is the
 * supply-line poster's row of cards with the last one inverted.
 */
export function NumberedSteps({ steps, variant = 'list' }: { steps: Step[]; variant?: 'list' | 'cards' }) {
  return (
    <ol
      className={variant === 'cards' ? `${s.steps} ${s.stepsCards}` : s.steps}
      style={{ '--cols': steps.length } as CSSProperties}
    >
      {steps.map((st) => (
        <li key={st.title} className={s.step}>
          <div>
            <h3 className={s.stepTitle}>{st.title}</h3>
            <p className={s.stepText}>{st.text}</p>
            {st.chips?.length ? (
              <div className={s.chips}>
                {st.chips.map((c) => (
                  <span key={c}>{c}</span>
                ))}
              </div>
            ) : null}
          </div>
          {st.illustration ? <Illustration name={st.illustration} className={s.stepArt} width={112} /> : null}
        </li>
      ))}
    </ol>
  )
}
