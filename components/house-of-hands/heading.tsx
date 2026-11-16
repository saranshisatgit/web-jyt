import s from './house-of-hands.module.css'

export type HeadingSize = 'xl' | 'l' | 'm' | 's'

const SIZE: Record<HeadingSize, string> = { xl: s['h-xl'], l: s['h-l'], m: s['h-m'], s: s['h-s'] }

/**
 * Serif heading: `lead` then the `accent` words in italic teal with a stitched
 * underline. `breakBefore` puts the accent on its own line, as on the posters.
 */
export function Heading({
  lead,
  accent,
  level = 2,
  size = 'l',
  breakBefore,
}: {
  lead: string
  accent?: string
  level?: 1 | 2 | 3
  size?: HeadingSize
  breakBefore?: boolean
}) {
  const Tag = `h${level}` as 'h1' | 'h2' | 'h3'
  return (
    <Tag className={`${s.heading} ${SIZE[size]}`}>
      {lead}
      {accent ? (
        <>
          {breakBefore ? <br /> : ' '}
          <em>{accent}</em>
        </>
      ) : null}
    </Tag>
  )
}
