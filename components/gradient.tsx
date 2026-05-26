import { clsx } from 'clsx'

/* All-navy gradient (original). */
export function Gradient({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      {...props}
      className={clsx(
        className,
        'bg-linear-115 from-navy-200 from-28% via-navy-300 via-70% to-navy-400 sm:bg-linear-145',
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
          'bg-linear-115 from-navy-200 from-28% via-navy-300 via-70% to-navy-400',
          'rotate-[-10deg] rounded-full blur-3xl',
        )}
      />
    </div>
  )
}

/* Gradient 1 — Orange → Navy (matching brand "Orange gradient with shades of blue") */
export function GradientOrangeNavy({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      {...props}
      className={clsx(
        className,
        'bg-linear-135 from-orange-500 via-orange-300/60 via-40% to-navy-600 sm:bg-linear-150',
      )}
    />
  )
}

/* Gradient 2 — Navy → Orange (matching brand "Blue gradient with shades of orange") */
export function GradientNavyOrange({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      {...props}
      className={clsx(
        className,
        'bg-linear-135 from-navy-700 via-navy-400 via-40% to-orange-500 sm:bg-linear-150',
      )}
    />
  )
}

/* Orange wash — soft radial glow for accent surfaces (matching brand "Orange tones") */
export function GradientOrangeWash({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      {...props}
      className={clsx(
        className,
        'bg-radial from-orange-400/30 from-20% via-orange-300/10 via-50% to-transparent',
      )}
    />
  )
}

/* Navy wash — soft radial glow for cool surfaces (matching brand "Blue tones") */
export function GradientNavyWash({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      {...props}
      className={clsx(
        className,
        'bg-radial from-navy-400/25 from-20% via-navy-300/10 via-50% to-transparent',
      )}
    />
  )
}
