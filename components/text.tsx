import { clsx } from 'clsx'
import type { ComponentProps } from 'react'

// Text component from template
export function Text({ children, className, size = 'md', ...props }: ComponentProps<'div'> & { size?: 'md' | 'lg' }) {
  return (
    <div
      className={clsx(
        size === 'md' && 'text-base/7',
        size === 'lg' && 'text-lg/8',
        'text-olive-700 dark:text-olive-400',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

// Lead component (large text)
export function Lead({ className, ...props }: ComponentProps<'p'>) {
  return (
    <p
      className={clsx(
        className,
        'text-lg/8 text-olive-700 dark:text-olive-400',
      )}
      {...props}
    />
  )
}

// Paragraph component
export function Paragraph({ className, ...props }: ComponentProps<'p'>) {
  return (
    <p
      className={clsx(
        className,
        'text-base/7 text-olive-700 dark:text-olive-400',
      )}
      {...props}
    />
  )
}

// Small text component
export function Small({ className, ...props }: ComponentProps<'span'>) {
  return (
    <span
      className={clsx(
        className,
        'text-sm text-olive-600 dark:text-olive-500',
      )}
      {...props}
    />
  )
}

// Heading component (using Instrument Serif)
export function Heading({ children, className, as: Component = 'h1', dark, ...props }: ComponentProps<'h1'> & { as?: 'h1' | 'h2' | 'h3' | 'div'; dark?: boolean }) {
  return (
    <Component
      data-dark={dark ? 'true' : undefined}
      className={clsx(
        'font-display text-5xl/12 tracking-tight text-balance sm:text-[5rem]/20 text-olive-950 dark:text-white',
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  )
}

// Subheading component
export function Subheading({ children, className, as: Component = 'h2', dark, ...props }: ComponentProps<'h2'> & { as?: 'h2' | 'h3' | 'div'; dark?: boolean }) {
  return (
    <Component
      data-dark={dark ? 'true' : undefined}
      className={clsx(
        'font-display text-[2rem]/10 tracking-tight text-pretty text-olive-950 sm:text-5xl/14 dark:text-white',
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  )
}

// Eyebrow component
export function Eyebrow({ children, className, ...props }: ComponentProps<'div'>) {
  return (
    <div className={clsx('text-sm/7 font-semibold text-olive-700 dark:text-olive-400', className)} {...props}>
      {children}
    </div>
  )
}
