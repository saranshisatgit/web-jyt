import { clsx } from 'clsx'

export function Gradient({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      {...props}
      className={clsx(
        className,
        'bg-linear-115 from-olive-200 from-28% via-olive-300 via-70% to-olive-400 sm:bg-linear-145 dark:from-olive-900 dark:via-olive-800/80 dark:to-olive-950',
      )}
    />
  )
}

export function GradientBackground() {
  return (
    <div className="relative mx-auto max-w-7xl">
      <div
        className={clsx(
          'absolute -top-44 -right-60 h-60 w-[36rem] transform-gpu md:right-0',
          'bg-linear-115 from-olive-200 from-28% via-olive-300 via-70% to-olive-400 dark:from-olive-900 dark:via-olive-800/80 dark:to-olive-950',
          'rotate-[-10deg] rounded-full blur-3xl',
        )}
      />
    </div>
  )
}
