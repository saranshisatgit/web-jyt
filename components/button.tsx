import * as Headless from '@headlessui/react'
import { clsx } from 'clsx'
import { Link } from './link'

const variants = {
  primary: clsx(
    'inline-flex items-center justify-center px-4 py-2.5',
    'rounded-full border border-transparent bg-[var(--color-text-primary)] shadow-md',
    'text-base font-medium whitespace-nowrap text-[var(--color-text-inverse)]',
    'transition-all duration-fast',
    'data-disabled:opacity-40 data-hover:bg-[var(--color-text-secondary)]',
    'focus-ring btn-press',
  ),
  secondary: clsx(
    'relative inline-flex items-center justify-center px-4 py-2.5',
    'rounded-full border border-transparent bg-[var(--color-bg-tertiary)] ring-1 shadow-md ring-[var(--color-border-primary)]',
    'text-base font-medium whitespace-nowrap text-[var(--color-text-primary)]',
    'transition-all duration-fast',
    'data-disabled:opacity-40 data-hover:bg-[var(--color-bg-secondary)]',
    'focus-ring btn-press',
  ),
  outline: clsx(
    'inline-flex items-center justify-center px-3 py-1.5',
    'rounded-lg border border-transparent ring-1 shadow-sm ring-[var(--color-border-primary)]',
    'text-sm font-medium whitespace-nowrap text-[var(--color-text-primary)]',
    'transition-all duration-fast',
    'data-disabled:opacity-40 data-hover:bg-[var(--color-bg-secondary)]',
    'focus-ring btn-press',
  ),
  ghost: clsx(
    'inline-flex items-center justify-center px-3 py-1.5',
    'rounded-lg border border-transparent',
    'text-sm font-medium whitespace-nowrap text-[var(--color-text-secondary)]',
    'transition-all duration-fast',
    'data-disabled:opacity-40 data-hover:bg-[var(--color-bg-secondary)] data-hover:text-[var(--color-text-primary)]',
    'focus-ring btn-press',
  ),
  link: clsx(
    'inline-flex items-center justify-center',
    'text-sm font-medium whitespace-nowrap text-[var(--color-link)]',
    'transition-colors duration-fast',
    'data-disabled:opacity-40 data-hover:text-[var(--color-link-hover)]',
    'focus-ring',
  ),
}

type ButtonProps = {
  variant?: keyof typeof variants
} & (
  | React.ComponentPropsWithoutRef<typeof Link>
  | (Headless.ButtonProps & { href?: undefined })
)

export function Button({
  variant = 'primary',
  className,
  ...props
}: ButtonProps) {
  className = clsx(className, variants[variant])

  if (typeof props.href === 'undefined') {
    return <Headless.Button {...props} className={className} />
  }

  return <Link {...props} className={className} />
}
