import { clsx } from 'clsx'
import type { ComponentProps } from 'react'
import { Link } from './link'

const sizes = {
  md: 'px-3 py-1',
  lg: 'px-4 py-2',
}

type ButtonProps = {
  size?: keyof typeof sizes
  color?: 'dark/light' | 'light' | 'outline'
  variant?: 'primary' | 'secondary' | 'outline'
  href?: string
} & Omit<ComponentProps<'button'>, 'href' | 'color' | 'variant'>

export function Button({
  size = 'md',
  color,
  variant,
  href,
  className,
  ...props
}: ButtonProps) {
  // Map variant to color for backwards compatibility
  const buttonColor = color || (variant === 'secondary' ? 'light' : variant === 'outline' ? 'outline' : 'dark/light')
  const classes = clsx(
    'inline-flex shrink-0 items-center justify-center gap-1 rounded-full text-sm/7 font-medium',
    buttonColor === 'dark/light' &&
      'bg-olive-950 text-white hover:bg-olive-800 dark:bg-olive-300 dark:text-olive-950 dark:hover:bg-olive-200',
    buttonColor === 'light' && 'bg-white text-olive-950 hover:bg-olive-100 dark:bg-olive-100 dark:hover:bg-white',
    buttonColor === 'outline' && 'bg-transparent text-olive-950 border border-olive-300 hover:bg-olive-100 dark:text-white dark:border-olive-700 dark:hover:bg-olive-900',
    sizes[size],
    className,
  )

  if (href) {
    return (
      <Link
        href={href}
        className={classes}
        {...props as any}
      />
    )
  }

  return (
    <button
      type="button"
      className={classes}
      {...props}
    />
  )
}

export function ButtonLink({
  size = 'md',
  color = 'dark/light',
  className,
  href,
  ...props
}: {
  href: string
  size?: keyof typeof sizes
  color?: 'dark/light' | 'light'
} & Omit<ComponentProps<'a'>, 'href'>) {
  return (
    <a
      href={href}
      className={clsx(
        'inline-flex shrink-0 items-center justify-center gap-1 rounded-full text-sm/7 font-medium',
        color === 'dark/light' &&
          'bg-olive-950 text-white hover:bg-olive-800 dark:bg-olive-300 dark:text-olive-950 dark:hover:bg-olive-200',
        color === 'light' && 'hover bg-white text-olive-950 hover:bg-olive-100 dark:bg-olive-100 dark:hover:bg-white',
        sizes[size],
        className,
      )}
      {...props}
    />
  )
}

export function SoftButton({
  size = 'md',
  className,
  ...props
}: {
  size?: keyof typeof sizes
} & ComponentProps<'button'>) {
  return (
    <button
      type="button"
      className={clsx(
        'inline-flex shrink-0 items-center justify-center gap-1 rounded-full bg-olive-950/10 text-sm/7 font-medium text-olive-950 hover:bg-olive-950/15 dark:bg-white/10 dark:text-white dark:hover:bg-white/20',
        sizes[size],
        className,
      )}
      {...props}
    />
  )
}

export function SoftButtonLink({
  size = 'md',
  href,
  className,
  ...props
}: {
  href: string
  size?: keyof typeof sizes
} & Omit<ComponentProps<'a'>, 'href'>) {
  return (
    <a
      href={href}
      className={clsx(
        'inline-flex shrink-0 items-center justify-center gap-1 rounded-full bg-olive-950/10 text-sm/7 font-medium text-olive-950 hover:bg-olive-950/15 dark:bg-white/10 dark:text-white dark:hover:bg-white/20',
        sizes[size],
        className,
      )}
      {...props}
    />
  )
}

export function PlainButton({
  size = 'md',
  color = 'dark/light',
  className,
  ...props
}: {
  size?: keyof typeof sizes
  color?: 'dark/light' | 'light'
} & ComponentProps<'button'>) {
  return (
    <button
      type="button"
      className={clsx(
        'inline-flex shrink-0 items-center justify-center gap-2 rounded-full text-sm/7 font-medium',
        color === 'dark/light' && 'text-olive-950 hover:bg-olive-950/10 dark:text-white dark:hover:bg-white/10',
        color === 'light' && 'text-white hover:bg-white/15 dark:hover:bg-white/10',
        sizes[size],
        className,
      )}
      {...props}
    />
  )
}

export function PlainButtonLink({
  size = 'md',
  color = 'dark/light',
  href,
  className,
  ...props
}: {
  href: string
  size?: keyof typeof sizes
  color?: 'dark/light' | 'light'
} & Omit<ComponentProps<'a'>, 'href'>) {
  return (
    <a
      href={href}
      className={clsx(
        'inline-flex shrink-0 items-center justify-center gap-2 rounded-full text-sm/7 font-medium',
        color === 'dark/light' && 'text-olive-950 hover:bg-olive-950/10 dark:text-white dark:hover:bg-white/10',
        color === 'light' && 'text-white hover:bg-white/15 dark:hover:bg-white/10',
        sizes[size],
        className,
      )}
      {...props}
    />
  )
}
