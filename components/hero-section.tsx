'use client';

import { Container } from './container';
import { ButtonLink } from './button';
import { Heading } from './heading';
import { Text } from './text';
import { Eyebrow } from './eyebrow';

export interface ButtonDef {
  text: string;
  link: string;
  variant?: 'primary' | 'secondary' | undefined;
}

export interface HeaderBlock {
  content: {
    title: string;
    subtitle: string;
    announcement: string;
    buttons: ButtonDef[];
  };
}

export function HeroSection({ headerBlock }: { headerBlock: HeaderBlock }) {
  return (
    <section className="py-16 sm:py-24 lg:py-32">
      <Container className="flex flex-col items-start gap-6">
        <Eyebrow>Welcome to Jaal Yantra</Eyebrow>
        
        <Heading>{headerBlock.content.title}</Heading>
        
        <Text size="lg" className="flex max-w-xl flex-col gap-4">
          {headerBlock.content.subtitle}
        </Text>
        
        {headerBlock.content.buttons?.length > 0 && (
          <div className="mt-6 flex flex-col gap-x-6 gap-y-4 sm:flex-row">
            {headerBlock.content.buttons.map((btn) => (
              btn.text && btn.link ? (
                <ButtonLink key={btn.text} href={btn.link} color={btn.variant === 'secondary' ? 'light' : 'dark/light'}>
                  {btn.text}
                </ButtonLink>
              ) : null
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
