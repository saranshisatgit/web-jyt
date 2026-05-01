'use client'

import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/react'
import { Bars2Icon } from '@heroicons/react/24/solid'
import { motion } from 'framer-motion'
import { Link } from './link'
import { Logo } from './logo'
import { Spinner } from './spinner'
import { useSiteData } from '@/app/context/site-data-context'

import { ButtonLink, PlainButtonLink } from './button'

interface NavBlock {
  content: {
    navigation: {
      link: string;
      text: string;
    }[];
    announcement?: string;
  };
}

function DesktopNav({ navBlock }: { navBlock: NavBlock }) {
  return (
    <nav className="hidden lg:flex lg:gap-7">
      {navBlock.content.navigation.map(({ link, text }) => (
        <Link
          key={link}
          href={link}
          className="relative text-sm font-medium text-olive-700 transition-colors hover:text-olive-950"
        >
          <span>{text}</span>
          <span
            aria-hidden="true"
            className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-clay-500 transition-transform duration-300 hover:scale-x-100"
          />
        </Link>
      ))}
    </nav>
  )
}

function MobileNavButton() {
  return (
    <DisclosureButton
      className="inline-flex rounded-full p-1.5 text-olive-950 hover:bg-olive-950/10 lg:hidden"
      aria-label="Open main menu"
    >
      <Bars2Icon className="size-6" />
    </DisclosureButton>
  )
}

function MobileNav({ navBlock }: { navBlock: NavBlock }) {
  return (
    <DisclosurePanel className="lg:hidden">
      <div className="mt-6 flex flex-col gap-6">
        {navBlock.content.navigation.map(({ link, text }, linkIndex) => (
          <motion.div
            initial={{ opacity: 0, rotateX: -90 }}
            animate={{ opacity: 1, rotateX: 0 }}
            transition={{
              duration: 0.15,
              ease: 'easeInOut',
              rotateX: { duration: 0.3, delay: linkIndex * 0.1 },
            }}
            key={link}
          >
            <Link
              href={link}
              className="group inline-flex items-center justify-between gap-2 text-3xl/10 font-medium text-olive-950"
            >
              {text}
              <span className="inline-flex p-1.5 opacity-0 group-hover:opacity-100" aria-hidden="true">
                <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </DisclosurePanel>
  )
}

export function Navbar({ banner }: { banner?: React.ReactNode }) {
  const { navBlock } = useSiteData()

  if (!navBlock) {
    return (
      <header className="relative border-b border-olive-200/60">
        <div className="mx-auto flex h-16 max-w-7xl items-center px-6 lg:px-10">
          <div className="flex flex-1 items-center justify-center py-4">
            <Spinner size="lg" />
          </div>
        </div>
      </header>
    );
  }

  const typedNavBlock = navBlock as unknown as NavBlock

  return (
    <Disclosure
      as="header"
      className="relative border-b border-olive-200/60"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-6 lg:px-10">
        <div className="flex flex-1 items-center gap-10">
          <div className="flex items-center">
            <Link href="/" title="Home" className="inline-flex items-center">
              <Logo className="h-7" />
            </Link>
          </div>
          <DesktopNav navBlock={typedNavBlock} />
        </div>

        <div className="flex flex-1 items-center justify-end gap-3">
          <div className="flex shrink-0 items-center gap-3">
            {banner && (
              <div className="hidden lg:flex">{banner}</div>
            )}
            <PlainButtonLink href="/login" className="max-sm:hidden">
              Log in
            </PlainButtonLink>
            <ButtonLink href="/contact" color="accent" className="max-sm:hidden px-4 py-1.5">
              Get started
            </ButtonLink>
          </div>
          <MobileNavButton />
        </div>
      </div>

      <MobileNav navBlock={typedNavBlock} />
    </Disclosure>
  )
}
