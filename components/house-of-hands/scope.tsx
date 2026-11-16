import type { CSSProperties, ReactNode } from 'react'
import s from './house-of-hands.module.css'

/** The House of Hands colour + type scope. Wrap a page (or any part of one) so the blocks read their tokens. */
export function HohScope({
  children,
  className,
  style,
}: {
  children: ReactNode
  className?: string
  style?: CSSProperties
}) {
  return (
    <div className={className ? `${s.hoh} ${className}` : s.hoh} style={style}>
      {children}
    </div>
  )
}
