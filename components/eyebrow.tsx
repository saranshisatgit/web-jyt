import { clsx } from 'clsx'
import type { ComponentProps } from 'react'

export function Eyebrow({ children, className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={clsx(
        'inline-flex items-center gap-3 text-xs font-semibold tracking-[0.18em] uppercase text-clay-700',
        'before:h-px before:w-8 before:bg-clay-500/60',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
