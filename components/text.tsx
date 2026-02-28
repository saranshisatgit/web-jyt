import { clsx } from 'clsx'

type HeadingProps = {
  as?: 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  dark?: boolean
} & React.ComponentPropsWithoutRef<
  'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
>

// Display heading - Large serif style
export function Heading({
  className,
  as: Element = 'h1',
  dark = false,
  ...props
}: HeadingProps) {
  return (
    <Element
      {...props}
      data-dark={dark ? 'true' : undefined}
      className={clsx(
        className,
        'font-display text-5xl/12 tracking-tight text-balance sm:text-[5rem]/20',
        'text-olive-950 dark:text-white',
      )}
    />
  )
}

// Subheading - Medium serif style
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
        'font-display text-[2rem]/10 tracking-tight text-pretty sm:text-5xl/14',
        'text-olive-950 dark:text-white',
      )}
    />
  )
}

// Eyebrow - Small label text
export function Eyebrow({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      className={clsx(
        className,
        'text-sm/7 font-semibold text-olive-700 dark:text-olive-400',
      )}
      {...props}
    />
  )
}

// Lead text - Large body text
export function Lead({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'p'>) {
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

// Body text - Default size
export function Paragraph({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'p'>) {
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

// Small text
export function Small({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'span'>) {
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

// Text wrapper with size options
export function Text({
  className,
  size = 'md',
  ...props
}: React.ComponentPropsWithoutRef<'div'> & { size?: 'md' | 'lg' }) {
  return (
    <div
      className={clsx(
        className,
        size === 'md' && 'text-base/7',
        size === 'lg' && 'text-lg/8',
        'text-olive-700 dark:text-olive-400',
      )}
      {...props}
    />
  )
}
