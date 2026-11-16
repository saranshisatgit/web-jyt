import s from './house-of-hands.module.css'

/** A pulled quote with a teal rule and a small uppercase citation. */
export function Quote({ text, cite }: { text: string; cite?: string }) {
  return (
    <blockquote className={s.quote}>
      {text}
      {cite ? <cite>{cite}</cite> : null}
    </blockquote>
  )
}
