'use client'

import { useLayoutEffect, useState, type CSSProperties, type ReactNode } from 'react'
import s from './shared.module.css'

const MM = 96 / 25.4

/**
 * The on-screen frame around an A1 sheet: a bar with the safe-area toggle, and the
 * sheet scaled to fit the window. Print ignores all of it and prints the sheet 1:1.
 */
export function PosterStage({
  title,
  label,
  pdf,
  style,
  className,
  children,
}: {
  title: string
  label: string
  pdf: string
  style: CSSProperties
  className: string
  children: ReactNode
}) {
  const [fit, setFit] = useState(0.3)
  const [trim, setTrim] = useState(false)

  useLayoutEffect(() => {
    const update = () =>
      setFit(Math.min(1, (innerWidth - 32) / (594 * MM), (innerHeight - 110) / (841 * MM)))
    update()
    addEventListener('resize', update)
    return () => removeEventListener('resize', update)
  }, [])

  return (
    <div
      className={`${s.root} ${trim ? s.trim : ''} ${className}`}
      style={{ ...style, ['--fit' as string]: fit }}
    >
      <div className={s.webbar}>
        <span>
          <b>{title}</b> &nbsp; {label}
        </span>
        <span className={s.webbarLinks}>
          <a href="/melbourne/posters">All posters</a>
          <a href={pdf} download>
            Print PDF
          </a>
          <label>
            <input type="checkbox" checked={trim} onChange={(e) => setTrim(e.target.checked)} /> show 10 mm
            safe area
          </label>
        </span>
      </div>
      <div className={s.stage}>
        <div className={s.frame}>
          <div className={s.poster}>{children}</div>
        </div>
      </div>
    </div>
  )
}
