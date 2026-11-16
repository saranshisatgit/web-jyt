/* eslint-disable @next/next/no-img-element -- small static SVGs, no optimiser needed */
import type { CSSProperties } from 'react'
import s from './house-of-hands.module.css'

/** The 11 teal line illustrations in public/booklet/illustrations. */
export const ILLUSTRATIONS = [
  'boxes-check',
  'dashboard',
  'deal',
  'delivery',
  'designer',
  'online-shop',
  'payment',
  'support-chat',
  'team-desk',
  'unboxing',
  'video-call',
] as const
export type IllustrationName = (typeof ILLUSTRATIONS)[number]

export const illustrationSrc = (name: IllustrationName) => `/booklet/illustrations/${name}.svg`

/** One illustration. Turns white on a dark section. Decorative by default (alt=""). */
export function Illustration({
  name,
  alt = '',
  width = 160,
  className,
}: {
  name: IllustrationName
  alt?: string
  width?: number
  className?: string
}) {
  return (
    <img
      src={illustrationSrc(name)}
      alt={alt}
      width={width}
      className={className ? `${s.ill} ${className}` : s.ill}
      style={{ width }}
    />
  )
}

/** A spaced row of illustrations, as at the foot of the booklet's buyer page. */
export function IllustrationRow({ names, width = 160 }: { names: IllustrationName[]; width?: number }) {
  return (
    <div className={s.illRow} style={{ '--ill-w': `${width}px` } as CSSProperties}>
      {names.map((n) => (
        <Illustration key={n} name={n} width={width} />
      ))}
    </div>
  )
}
