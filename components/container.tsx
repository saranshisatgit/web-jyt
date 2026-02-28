import { clsx } from 'clsx'

type ContainerProps = {
  className?: string
  children: React.ReactNode
  size?: 'narrow' | 'default' | 'wide' | 'full'
}

const sizeClasses = {
  narrow: 'max-w-3xl',
  default: 'max-w-7xl',
  wide: 'max-w-[90rem]',
  full: 'max-w-none',
}

export function Container({
  className,
  children,
  size = 'default',
}: ContainerProps) {
  return (
    <div className={clsx('mx-auto w-full px-6 md:px-10', sizeClasses[size], className)}>
      {children}
    </div>
  )
}
