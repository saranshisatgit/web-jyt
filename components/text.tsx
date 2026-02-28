import { clsx } from 'clsx'

type HeadingProps = {
  as?: 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  dark?: boolean
  gradient?: boolean
} & React.ComponentPropsWithoutRef<
  'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
>

export function Heading({
  className,
  as: Element = 'h2',
  dark = false,
  gradient = false,
  ...props
}: HeadingProps) {
  return (
    <Element
      {...props}
      data-dark={dark ? 'true' : undefined}
      className={clsx(
        className,
        'text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl',
        gradient 
          ? 'bg-clip-text text-transparent bg-gradient-to-r from-violet-600 via-purple-600 to-violet-500'
          : 'text-[var(--color-text-primary)]',
        'data-dark:text-[var(--color-text-inverse)]',
      )}
    />
  )
}

export function Subheading({
  className,
  as: Element = 'h2',
  dark = false,
  ...props
}: HeadingProps) {
  return (
    <Element
      {...props}
      data-dark={dark ? 'true' : undefined}
      className={clsx(
        className,
        'font-mono text-xs/5 font-semibold tracking-widest uppercase',
        'text-violet-600',
        'data-dark:text-violet-400',
      )}
    />
  )
}

export function Lead({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'p'>) {
  return (
    <p
      className={clsx(
        className, 
        'text-xl sm:text-2xl font-medium leading-relaxed',
        'text-[var(--color-text-secondary)]'
      )}
      {...props}
    />
  )
}

export function Paragraph({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'p'>) {
  return (
    <p
      className={clsx(
        className, 
        'text-base/7 leading-relaxed',
        'text-[var(--color-text-secondary)]'
      )}
      {...props}
    />
  )
}

export function Small({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'span'>) {
  return (
    <span
      className={clsx(
        className, 
        'text-sm',
        'text-[var(--color-text-tertiary)]'
      )}
      {...props}
    />
  )
}

// New Label component
export function Label({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'span'>) {
  return (
    <span
      className={clsx(
        className,
        'inline-flex items-center px-3 py-1 rounded-full',
        'bg-violet-100 text-violet-700 text-sm font-medium',
        'dark:bg-violet-900/30 dark:text-violet-300'
      )}
      {...props}
    />
  )
}

// New Eyebrow component for section headers
export function Eyebrow({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'span'>) {
  return (
    <span
      className={clsx(
        className,
        'inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider',
        'text-violet-600',
        'dark:text-violet-400'
      )}
      {...props}
    />
  )
}
