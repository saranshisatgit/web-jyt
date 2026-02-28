import { clsx } from 'clsx'

type HeadingProps = {
  as?: 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  dark?: boolean
} & React.ComponentPropsWithoutRef<
  'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
>

export function Heading({
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
        'text-4xl font-medium tracking-tighter text-balance text-[var(--color-text-primary)] data-dark:text-[var(--color-text-inverse)] sm:text-5xl lg:text-6xl',
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
        'font-mono text-xs/5 font-semibold tracking-widest text-[var(--color-text-tertiary)] uppercase data-dark:text-[var(--color-text-muted)]',
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
      className={clsx(className, 'text-xl sm:text-2xl font-medium text-[var(--color-text-secondary)]')}
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
      className={clsx(className, 'text-base/7 text-[var(--color-text-secondary)]')}
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
      className={clsx(className, 'text-sm text-[var(--color-text-tertiary)]')}
      {...props}
    />
  )
}
