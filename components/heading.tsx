import { clsx } from 'clsx'
import type { ComponentProps } from 'react'

export function Heading({
  children,
  color = 'dark/light',
  className,
  ...props
}: { color?: 'dark/light' | 'light' } & ComponentProps<'h1'>) {
  return (
    <h1
      className={clsx(
        'font-display font-medium tracking-[-0.025em] text-balance',
        'text-4xl/[1.05] sm:text-5xl/[1.05] lg:text-[4.5rem]/[1.05]',
        color === 'dark/light' && 'text-olive-950',
        color === 'light' && 'text-white',
        className,
      )}
      {...props}
    >
      {children}
    </h1>
  )
}
