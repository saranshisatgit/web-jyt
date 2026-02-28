import * as Headless from '@headlessui/react'
import { clsx } from 'clsx'
import { Link } from './link'

const variants = {
  primary: clsx(
    // Base styles
    'relative inline-flex items-center justify-center px-6 py-3',
    'rounded-full font-semibold text-base',
    // Mauve gradient background
    'bg-gradient-to-r from-violet-600 via-purple-600 to-violet-500',
    'text-white',
    // Shadow and glow
    'shadow-lg shadow-violet-500/30',
    // Transitions
    'transition-all duration-300 ease-out',
    // Hover effects
    'hover:shadow-xl hover:shadow-violet-500/40 hover:-translate-y-0.5',
    'hover:from-violet-700 hover:via-purple-700 hover:to-violet-600',
    // Active state
    'active:scale-95 active:translate-y-0',
    // Focus
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500',
    // Disabled
    'data-disabled:opacity-50 data-disabled:cursor-not-allowed data-disabled:hover:translate-y-0',
  ),
  secondary: clsx(
    // Base styles
    'relative inline-flex items-center justify-center px-6 py-3',
    'rounded-full font-semibold text-base',
    // Oatmeal background
    'bg-stone-100 text-stone-800',
    'border border-stone-200',
    // Transitions
    'transition-all duration-300 ease-out',
    // Hover effects
    'hover:bg-stone-200 hover:border-stone-300 hover:-translate-y-0.5',
    'hover:shadow-lg',
    // Active state
    'active:scale-95 active:translate-y-0',
    // Focus
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500',
    // Disabled
    'data-disabled:opacity-50 data-disabled:cursor-not-allowed data-disabled:hover:translate-y-0',
  ),
  outline: clsx(
    // Base styles
    'relative inline-flex items-center justify-center px-5 py-2.5',
    'rounded-full font-medium text-sm',
    // Transparent with border
    'bg-transparent text-stone-700',
    'border-2 border-stone-300',
    // Transitions
    'transition-all duration-300 ease-out',
    // Hover effects
    'hover:border-violet-400 hover:text-violet-600',
    'hover:bg-violet-50/50',
    // Active state
    'active:scale-95',
    // Focus
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500',
    // Disabled
    'data-disabled:opacity-50 data-disabled:cursor-not-allowed',
  ),
  ghost: clsx(
    // Base styles
    'relative inline-flex items-center justify-center px-4 py-2',
    'rounded-full font-medium text-sm',
    // Transparent
    'bg-transparent text-stone-600',
    // Transitions
    'transition-all duration-200 ease-out',
    // Hover effects
    'hover:bg-stone-100 hover:text-stone-900',
    // Active state
    'active:scale-95',
    // Focus
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500',
    // Disabled
    'data-disabled:opacity-50 data-disabled:cursor-not-allowed',
  ),
  link: clsx(
    // Base styles
    'inline-flex items-center justify-center',
    'font-semibold text-base',
    // Link color
    'text-violet-600',
    // Underline animation
    'relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0',
    'after:bg-violet-600 after:transition-all after:duration-300',
    // Hover effects
    'hover:text-violet-700 hover:after:w-full',
    // Focus
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500',
    // Disabled
    'data-disabled:opacity-50 data-disabled:cursor-not-allowed',
  ),
  // New flashy variant
  gradient: clsx(
    'relative inline-flex items-center justify-center px-8 py-4',
    'rounded-full font-bold text-lg',
    // Animated gradient
    'bg-gradient-to-r from-violet-600 via-purple-500 to-pink-500',
    'text-white',
    // Large shadow and glow
    'shadow-xl shadow-violet-500/40',
    // Transitions
    'transition-all duration-300 ease-out',
    // Hover effects - more dramatic
    'hover:shadow-2xl hover:shadow-violet-500/50 hover:-translate-y-1',
    'hover:from-violet-700 hover:via-purple-600 hover:to-pink-600',
    // Active state
    'active:scale-95 active:translate-y-0',
    // Focus
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500',
    // Shine effect
    'before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-r',
    'before:from-transparent before:via-white/20 before:to-transparent',
    'before:opacity-0 hover:before:opacity-100 before:transition-opacity',
  ),
  // Soft mauve variant
  soft: clsx(
    'relative inline-flex items-center justify-center px-6 py-3',
    'rounded-full font-semibold text-base',
    // Soft mauve background
    'bg-violet-100 text-violet-700',
    // Transitions
    'transition-all duration-300 ease-out',
    // Hover effects
    'hover:bg-violet-200 hover:text-violet-800 hover:-translate-y-0.5',
    // Active state
    'active:scale-95 active:translate-y-0',
    // Focus
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500',
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
