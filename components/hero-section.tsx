'use client';

import { Container } from './container';
import { ButtonLink } from './button';
import { Heading } from './heading';
import { Text } from './text';
import { Eyebrow } from './eyebrow';
import { motion } from 'framer-motion';

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
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <section className="relative min-h-screen flex flex-col justify-center bg-olive-50">
      <Container className="py-16 sm:py-24 lg:py-32">
        <motion.div
          className="flex flex-col items-start gap-6"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={item}>
            <Eyebrow>Welcome to Jaal Yantra</Eyebrow>
          </motion.div>

          <motion.div variants={item}>
            <Heading>{headerBlock.content.title}</Heading>
          </motion.div>

          <motion.div variants={item}>
            <Text size="lg" className="flex max-w-xl flex-col gap-4">
              {headerBlock.content.subtitle}
            </Text>
          </motion.div>

          {headerBlock.content.buttons?.length > 0 && (
            <motion.div variants={item} className="mt-6 flex flex-col gap-x-6 gap-y-4 sm:flex-row">
              {headerBlock.content.buttons.map((btn) => (
                btn.text && btn.link ? (
                  <ButtonLink key={btn.text} href={btn.link} color={btn.variant === 'secondary' ? 'light' : 'dark/light'}>
                    {btn.text}
                  </ButtonLink>
                ) : null
              ))}
            </motion.div>
          )}
        </motion.div>
      </Container>
    </section>
  );
}