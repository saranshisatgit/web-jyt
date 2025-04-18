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
import { PlusGrid, PlusGridItem, PlusGridRow } from './plus-grid'
import { getBlockByType, usePageData } from '@/medu/queries'
import { Spinner } from './spinner'


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
    <nav className="relative hidden lg:flex">
      {navBlock.content.navigation.map(({ link, text }) => (
        <PlusGridItem key={link} className="relative flex">
          <Link
            href={link}
            className="flex items-center px-4 py-3 text-base font-medium text-gray-950 bg-blend-multiply data-hover:bg-black/[2.5%]"
          >
            {text}
          </Link>
        </PlusGridItem>
      ))}
    </nav>
  )
}

function MobileNavButton() {
  return (
    <DisclosureButton
      className="flex size-12 items-center justify-center self-center rounded-lg data-hover:bg-black/5 lg:hidden"
      aria-label="Open main menu"
    >
      <Bars2Icon className="size-6" />
    </DisclosureButton>
  )
}

function MobileNav({ navBlock }: { navBlock: NavBlock }) {
  return (
    <DisclosurePanel className="lg:hidden">
      <div className="flex flex-col gap-6 py-4">
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
            <Link href={link} className="text-base font-medium text-gray-950">
              {text}
            </Link>
          </motion.div>
        ))}
      </div>
      <div className="absolute left-1/2 w-screen -translate-x-1/2">
        <div className="absolute inset-x-0 top-0 border-t border-black/5" />
        <div className="absolute inset-x-0 top-2 border-t border-black/5" />
      </div>
    </DisclosurePanel>
  )
}

export function Navbar({ banner }: { banner?: React.ReactNode }) {
  const { data, isLoading } = usePageData('jaalyantra.com', "home");

  if (isLoading) {
    return (
      <header className="pt-12 sm:pt-16">
        <div className="flex justify-center py-4">
          <Spinner size="lg" />
        </div>
      </header>
    );
  }

  const navBlock = getBlockByType(data?.blocks, "Header") as unknown as NavBlock;
  if (!navBlock) return <div>No Nav block found</div>;

  return (
    <Disclosure as="header" className="pt-12 sm:pt-16">
      <PlusGrid>
        <PlusGridRow className="relative flex justify-between">
          <div className="relative flex gap-6">
            <PlusGridItem className="py-3">
              <Link href="/" title="Home">
                <Logo className="h-9" />
              </Link>
            </PlusGridItem>
            {banner && (
              <div className="relative hidden items-center py-3 lg:flex">
                {banner}
              </div>
            )}
          </div>
          <DesktopNav navBlock={navBlock} />
          <MobileNavButton />
        </PlusGridRow>
      </PlusGrid>
      <MobileNav navBlock={navBlock} />
    </Disclosure>
  )
}
