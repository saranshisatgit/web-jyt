import { clsx } from 'clsx'
import type { ComponentProps } from 'react'

export function Container({ children, className, ...props }: ComponentProps<'div'>) {
  return (
    <div className={clsx('mx-auto w-full max-w-7xl px-6 lg:px-10', className)} {...props}>
      {children}
    </div>
  )
}
