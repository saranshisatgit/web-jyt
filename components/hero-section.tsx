'use client';

import { Container } from './container';
import { Gradient } from './gradient';
import { Button } from './button';
import { Navbar } from './navbar';
import { Link } from './link';
import { ChevronRightIcon } from '@heroicons/react/16/solid';

export interface ButtonDef {
  text: string;
  link: string;
  variant?: 'primary' | 'secondary' | undefined;
}

interface HeaderBlock {
  content: {
    title: string;
    subtitle: string;
    announcement: string;
    buttons: ButtonDef[];
  };
}

export interface AnnouncementBlock {
  content: {
    announcement: string;
  };
}

export function HeroSection({ headerBlock, announcementBlock }: { headerBlock: HeaderBlock, announcementBlock: AnnouncementBlock }) {
  console.log(headerBlock.content.buttons)
  return (
    <div className="relative">
      <Gradient className="absolute inset-2 bottom-0 rounded-4xl ring-1 ring-black/5 ring-inset" />
      <Container className="relative">
        <Navbar
          banner={
            <Link
              href="/blog"
              className="flex items-center gap-1 rounded-full bg-fuchsia-950/35 px-3 py-0.5 text-sm/6 font-medium text-white data-hover:bg-fuchsia-950/30"
            >
              {announcementBlock?.content?.announcement}
              <ChevronRightIcon className="size-4" />
            </Link>
          }
        />
        <div className="pt-16 pb-24 sm:pt-24 sm:pb-32 md:pt-32 md:pb-48">
          <h1 className="font-display text-6xl/[0.9] font-medium tracking-tight text-balance text-gray-950 sm:text-8xl/[0.8] md:text-9xl/[0.8]">
            {headerBlock.content.title}
          </h1>
          <p className="mt-8 max-w-lg text-xl/7 font-medium text-gray-950/75 sm:text-2xl/8">
            {headerBlock.content.subtitle}
          </p>
          <div className="mt-12 flex flex-col gap-x-6 gap-y-4 sm:flex-row">
            {headerBlock.content.buttons.map((btn) => (
              <Button key={btn.text} href={btn.link} variant={btn.variant}>
                {btn.text}
              </Button>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}
