import { clsx } from 'clsx'

type ContainerProps = {
  className?: string
  children: React.ReactNode
  size?: 'narrow' | 'default' | 'wide' | 'full'
}

const sizeClasses = {
  narrow: 'max-w-3xl',
  default: 'max-w-2xl lg:max-w-7xl',
  wide: 'max-w-2xl lg:max-w-[90rem]',
  full: 'max-w-none',
}

export function Container({
  className,
  children,
  size = 'default',
}: ContainerProps) {
  return (
    <div className={clsx(className, 'px-4 sm:px-6 lg:px-8')}>
      <div className={clsx('mx-auto', sizeClasses[size])}>{children}</div>
    </div>
  )
}
