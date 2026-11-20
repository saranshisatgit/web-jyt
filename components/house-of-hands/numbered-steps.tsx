import type { CSSProperties } from 'react'
import { Illustration, type IllustrationName } from './illustration'
import s from './house-of-hands.module.css'

export type Step = { title: string; text: string; illustration?: IllustrationName; chips?: string[] }

function StepBody({ st }: { st: Step }) {
  return (
    <>
      <h3 className={s.stepTitle}>{st.title}</h3>
      <p className={s.stepText}>{st.text}</p>
      {st.chips?.length ? (
        <div className={s.chips}>
          {st.chips.map((c) => (
            <span key={c}>{c}</span>
          ))}
        </div>
      ) : null}
    </>
  )
}

// Thread geometry, in a 1000 × 200 box stretched to the row's width: the
// stitch sits at y=150 and dips by LIFT under every other step.
const LIFT = 28
const threadPath = (n: number) => {
  const pts = Array.from({ length: n }, (_, i) => [((i + 0.5) / n) * 1000, 150 + (i % 2) * LIFT])
  const half = 500 / n
  let d = `M0,${pts[0][1]} L${pts[0][0]},${pts[0][1]}`
  for (let i = 1; i < n; i++) {
    const [x0, y0] = pts[i - 1]
    const [x1, y1] = pts[i]
    d += ` C${x0 + half},${y0} ${x1 - half},${y1} ${x1},${y1}`
  }
  const [xl, yl] = pts[n - 1]
  return `${d} L1000,${yl}`
}

/**
 * Numbered steps (01, 02…). `list` is the booklet's ruled list; `cards` is the
 * supply-line poster's row of cards with the last one inverted; `thread` hangs
 * each step as a garment tag off a dashed stitch, figure standing on the stitch.
 */
export function NumberedSteps({ steps, variant = 'list' }: { steps: Step[]; variant?: 'list' | 'cards' | 'thread' }) {
  if (variant === 'thread') {
    return (
      <ol className={`${s.steps} ${s.stepsThread}`} style={{ '--cols': steps.length } as CSSProperties}>
        <svg className={s.tThread} viewBox="0 0 1000 200" preserveAspectRatio="none" aria-hidden>
          <path d={threadPath(steps.length)} />
        </svg>
        {steps.map((st, i) => (
          <li
            key={st.title}
            className={s.tStep}
            style={{ '--i': i, '--lift': `${(i % 2) * LIFT}px`, '--tilt': `${i % 2 ? 1.4 : -1.2}deg` } as CSSProperties}
          >
            <div className={s.tFig}>
              {st.illustration ? <Illustration name={st.illustration} className={s.tArt} width={140} /> : null}
            </div>
            <span className={s.tString} aria-hidden />
            <div className={s.tTag}>
              <span className={s.tNum}>{String(i + 1).padStart(2, '0')}</span>
              <StepBody st={st} />
            </div>
          </li>
        ))}
      </ol>
    )
  }
  return (
    <ol
      className={variant === 'cards' ? `${s.steps} ${s.stepsCards}` : s.steps}
      style={{ '--cols': steps.length } as CSSProperties}
    >
      {steps.map((st) => (
        <li key={st.title} className={s.step}>
          <div>
            <StepBody st={st} />
          </div>
          {st.illustration ? <Illustration name={st.illustration} className={s.stepArt} width={112} /> : null}
        </li>
      ))}
    </ol>
  )
}
