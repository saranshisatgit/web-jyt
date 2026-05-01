import { ChevronRightIcon } from '@heroicons/react/16/solid'
import { Link } from './link'

/**
 * Slim full-width release / announcement bar that sits ABOVE the nav.
 * Mirrors medusajs.com's release strip — quiet, monochrome, with an
 * arrow-link affordance on the right. Renders only if `announcement`
 * is non-empty so the CMS controls visibility.
 */
export function ReleaseBanner({
  announcement,
  href = '/blog',
  cta = 'Read more',
}: {
  announcement?: string
  href?: string
  cta?: string
}) {
  if (!announcement) return null
  return (
    <div className="relative z-10 border-b border-olive-200/60 bg-olive-50">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-3 px-6 py-2 text-xs lg:px-10">
        <span
          aria-hidden="true"
          className="inline-block size-1.5 rounded-full bg-clay-500"
        />
        <span className="truncate font-medium text-olive-700">{announcement}</span>
        <Link
          href={href}
          className="inline-flex items-center gap-1 font-semibold text-olive-950 transition-colors hover:text-clay-700"
        >
          {cta}
          <ChevronRightIcon className="size-3.5" />
        </Link>
      </div>
    </div>
  )
}
