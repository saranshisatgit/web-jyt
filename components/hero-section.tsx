'use client';

import { Container } from './container';
import { Button } from './button';
import { Navbar } from './navbar';
import { Link } from './link';
import { ChevronRightIcon } from '@heroicons/react/16/solid';
import { Eyebrow, Heading, Lead } from './text';

export interface ButtonDef {
  text: string;
  link: string;
  variant?: 'primary' | 'secondary' | 'soft' | undefined;
}

export interface HeaderBlock {
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
  return (
    <section className="py-16 sm:py-24 lg:py-32">
      <Container className="relative">
        <Navbar
          banner={
            <Link
              href="/blog"
              className="group relative inline-flex max-w-full gap-x-3 overflow-hidden rounded-md px-3.5 py-2 text-sm/6 max-sm:flex-col sm:items-center sm:rounded-full sm:px-3 sm:py-0.5 bg-olive-950/5 text-olive-950 hover:bg-olive-950/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
            >
              {announcementBlock?.content?.announcement}
              <ChevronRightIcon className="size-4" />
            </Link>
          }
        />
        <div className="pt-16 pb-24 sm:pt-24 sm:pb-32 md:pt-32 md:pb-48">
          <div className="flex flex-col items-center gap-6 text-center">
            <Eyebrow>Welcome to Jaal Yantra</Eyebrow>
            <Heading className="max-w-5xl">
              {headerBlock.content.title}
            </Heading>
            <Lead className="flex max-w-3xl flex-col gap-4">
              {headerBlock.content.subtitle}
            </Lead>
            {headerBlock.content.buttons?.length > 0 && (
              <div className="mt-12 flex flex-col gap-x-6 gap-y-4 sm:flex-row">
                {headerBlock.content.buttons.map((btn) => (
                  btn.text && btn.link ? (
                    <Button key={btn.text} href={btn.link} variant={btn.variant || 'primary'}>
                      {btn.text}
                    </Button>
                  ) : null
                ))}
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
