import { clsx } from 'clsx'
import Image from 'next/image'

interface LogoBlock {

  id: string
  alt?: string
  src?: string
 
}

interface LogoCloudProps extends React.ComponentPropsWithoutRef<'div'> {
  logoBlocks?: LogoBlock[]
}

export function LogoCloud({
  logoBlocks,
  className,
}: LogoCloudProps) {
  return (
    <div
      className={clsx(
        className,
        'flex justify-between max-sm:mx-auto max-sm:max-w-md max-sm:flex-wrap max-sm:justify-evenly max-sm:gap-x-4 max-sm:gap-y-4',
      )}
    >
      {logoBlocks?.map((block: LogoBlock) => (
        <Image
          key={block.id}
          alt={block.alt as string || 'Logo'}
          src={block.src || '/logo-cloud/savvycal.svg'}
          className="h-9 max-sm:mx-auto sm:h-8 lg:h-12"
          width={100}
          height={100}
        />
      ))}
    </div>
  )
}
