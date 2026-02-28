import * as Headless from '@headlessui/react'
import { clsx } from 'clsx'
import { Link } from './link'

const sizes = {
  md: 'px-3 py-1',
  lg: 'px-4 py-2',
}

const variants = {
  primary: clsx(
    'inline-flex shrink-0 items-center justify-center gap-1 rounded-full text-sm/7 font-medium',
    'bg-olive-950 text-white hover:bg-olive-800',
    'dark:bg-olive-300 dark:text-olive-950 dark:hover:bg-olive-200',
    'transition-colors duration-200',
  ),
  secondary: clsx(
    'inline-flex shrink-0 items-center justify-center gap-1 rounded-full text-sm/7 font-medium',
    'bg-white text-olive-950 hover:bg-olive-100',
    'dark:bg-olive-100 dark:hover:bg-white',
    'transition-colors duration-200',
  ),
  soft: clsx(
    'inline-flex shrink-0 items-center justify-center gap-1 rounded-full text-sm/7 font-medium',
    'bg-olive-950/10 text-olive-950 hover:bg-olive-950/15',
    'dark:bg-white/10 dark:text-white dark:hover:bg-white/20',
    'transition-colors duration-200',
  ),
  plain: clsx(
    'inline-flex shrink-0 items-center justify-center gap-2 rounded-full text-sm/7 font-medium',
    'text-olive-950 hover:bg-olive-950/10',
    'dark:text-white dark:hover:bg-white/10',
    'transition-colors duration-200',
  ),
  outline: clsx(
    'inline-flex shrink-0 items-center justify-center gap-1 rounded-full text-sm/7 font-medium',
    'bg-transparent text-olive-950 border border-olive-300 hover:bg-olive-100',
    'dark:text-white dark:border-olive-700 dark:hover:bg-olive-900',
    'transition-colors duration-200',
  ),
}

type ButtonProps = {
  variant?: keyof typeof variants
  size?: keyof typeof sizes
} & (
  | React.ComponentPropsWithoutRef<typeof Link>
  | (Headless.ButtonProps & { href?: undefined })
)

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  ...props
}: ButtonProps) {
  className = clsx(className, variants[variant], sizes[size])

  if (typeof props.href === 'undefined') {
    return <Headless.Button {...props} className={className} />
  }

  return <Link {...props} className={className} />
}
