import { clsx } from 'clsx'
import Image from 'next/image'

interface LogoBlock {
  id: string
  alt?: string
  src?: string
}

interface LogoCloudProps extends React.ComponentPropsWithoutRef<'div'> {
  logoBlocks?: LogoBlock[]
  /** Optional kicker shown above the logo row, like "Trusted by". */
  label?: string
}

/**
 * Monochrome scrolling logo strip — saleor.io style.
 * Logos are desaturated to ~50% opacity, lift to full on hover, and
 * the entire row drifts horizontally on a long loop. Edge gradients
 * fade the row in/out so it doesn't fight the side rails.
 */
export function LogoCloud({
  logoBlocks,
  className,
  label = 'Powering bespoke production for',
}: LogoCloudProps) {
  if (!logoBlocks || logoBlocks.length === 0) return null

  // Duplicate the row so the marquee loops seamlessly.
  const reel = [...logoBlocks, ...logoBlocks]

  return (
    <div className={clsx('relative', className)}>
      {label && (
        <p className="mb-8 text-center text-xs font-semibold tracking-[0.18em] uppercase text-olive-500">
          {label}
        </p>
      )}

      <div
        className="relative overflow-hidden"
        style={{
          maskImage:
            'linear-gradient(to right, transparent 0, black 8%, black 92%, transparent 100%)',
          WebkitMaskImage:
            'linear-gradient(to right, transparent 0, black 8%, black 92%, transparent 100%)',
        }}
      >
        <div className="flex w-max animate-[logo-marquee_40s_linear_infinite] items-center gap-16 py-2">
          {reel.map((block, idx) => (
            <Image
              key={`${block.id}-${idx}`}
              alt={(block.alt as string) || 'Logo'}
              src={block.src || '/logo-cloud/savvycal.svg'}
              className="h-7 w-auto opacity-50 grayscale transition-[opacity,filter] duration-300 hover:opacity-100 hover:grayscale-0 sm:h-8"
              width={140}
              height={36}
            />
          ))}
        </div>
      </div>

      {/* Marquee keyframes — local so we don't need to touch tailwind config. */}
      <style>{`
        @keyframes logo-marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  )
}
