'use client';

import { Container } from './container';
import { Eyebrow } from './eyebrow';
import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState, type FormEvent } from 'react';

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

/**
 * Splits the title so the LAST word renders in Instrument Serif italic.
 * That single accent gives the editorial Saleor flavor without changing
 * the whole font. Comma-trailing case ("Design,") still renders cleanly.
 */
function StyledTitle({ title }: { title: string }) {
  const trimmed = title.trim();
  const lastSpace = trimmed.lastIndexOf(' ');
  if (lastSpace === -1) {
    return <span>{trimmed}</span>;
  }
  const head = trimmed.slice(0, lastSpace);
  const tail = trimmed.slice(lastSpace + 1);
  return (
    <h1 className="font-display font-medium tracking-[-0.025em] text-balance text-olive-950 text-4xl/[1.05] sm:text-5xl/[1.05] lg:text-[5rem]/[0.98]">
      {head}{' '}
      <span className="font-serif font-normal italic tracking-[-0.01em] text-clay-700">
        {tail}
      </span>
    </h1>
  );
}

/**
 * HeroSearch — prompt-style input that captures intent and forwards it
 * to /contact?prompt=… so the contact form can pre-fill. The placeholder
 * cycles through example prompts with a typewriter rhythm to suggest
 * the breadth of what JYT can build.
 */
const PROMPT_EXAMPLES = [
  'Create a shop about sustainable textiles',
  'Source khadi from artisans across India',
  'Launch a vendor portal with WhatsApp routing',
  'Build a bespoke designer marketplace',
];

function HeroSearch() {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const [value, setValue] = useState('');
  const [placeholder, setPlaceholder] = useState(PROMPT_EXAMPLES[0]);
  const exampleIdxRef = useRef(0);

  useEffect(() => {
    if (reduceMotion) {
      setPlaceholder(PROMPT_EXAMPLES[0]);
      return;
    }
    if (value) return;

    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout>;
    let charIdx = 0;
    let phase: 'typing' | 'holding' | 'erasing' = 'typing';
    setPlaceholder('');

    const tick = () => {
      if (cancelled) return;
      const example = PROMPT_EXAMPLES[exampleIdxRef.current];
      if (phase === 'typing') {
        charIdx += 1;
        setPlaceholder(example.slice(0, charIdx));
        if (charIdx >= example.length) {
          phase = 'holding';
          timeoutId = setTimeout(tick, 1800);
        } else {
          timeoutId = setTimeout(tick, 55);
        }
      } else if (phase === 'holding') {
        phase = 'erasing';
        timeoutId = setTimeout(tick, 25);
      } else {
        charIdx -= 1;
        setPlaceholder(example.slice(0, Math.max(charIdx, 0)));
        if (charIdx <= 0) {
          exampleIdxRef.current = (exampleIdxRef.current + 1) % PROMPT_EXAMPLES.length;
          phase = 'typing';
          timeoutId = setTimeout(tick, 350);
        } else {
          timeoutId = setTimeout(tick, 22);
        }
      }
    };

    timeoutId = setTimeout(tick, 400);
    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [reduceMotion, value]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const prompt = value.trim();
    if (!prompt) return;
    router.push(`/contact?prompt=${encodeURIComponent(prompt)}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      role="search"
      aria-label="Tell us what to build"
      className="group relative flex w-full max-w-xl items-center gap-2 rounded-full bg-white p-1.5 pl-5 ring-1 ring-olive-200 shadow-sm transition focus-within:ring-2 focus-within:ring-clay-400/60 focus-within:shadow-md"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 20 20"
        fill="none"
        className="size-4 shrink-0 text-olive-500"
      >
        <path
          d="M9 17a8 8 0 1 1 0-16 8 8 0 0 1 0 16Zm0-2a6 6 0 1 0 0-12 6 6 0 0 0 0 12Zm5.3-1.3 4 4-1.4 1.4-4-4 1.4-1.4Z"
          fill="currentColor"
        />
      </svg>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder || PROMPT_EXAMPLES[0]}
        aria-label="What would you like to create?"
        className="min-w-0 flex-1 bg-transparent py-2 text-[15px] text-olive-950 placeholder:text-olive-500 focus:outline-none"
      />
      <button
        type="submit"
        className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-clay-600 px-4 py-2 text-sm font-medium text-white shadow-sm shadow-clay-900/20 transition hover:bg-clay-500 disabled:opacity-60"
        disabled={!value.trim()}
      >
        Build
        <svg
          aria-hidden="true"
          viewBox="0 0 12 12"
          fill="none"
          className="size-3 transition-transform group-focus-within:translate-x-0.5"
        >
          <path
            d="M2.5 6h7m0 0L6 2.5M9.5 6 6 9.5"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </form>
  );
}

/**
 * WovenGrid — animated textile-themed motif. A 12×12 grid of small
 * squares that ripple in a wave-like pattern, evoking woven cloth.
 */
function WovenGrid() {
  const cols = 12;
  const rows = 12;

  return (
    <div className="relative aspect-square w-full max-w-[520px]">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 rounded-full opacity-70 blur-3xl"
        style={{
          background:
            'radial-gradient(closest-side, color-mix(in oklch, var(--color-clay-300) 55%, transparent), transparent 70%)',
        }}
      />
      <div className="absolute inset-0 -z-10 rounded-2xl ring-1 ring-olive-200/60" />

      <div
        className="grid h-full w-full p-6"
        style={{
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, 1fr)`,
          gap: '6px',
        }}
      >
        {Array.from({ length: cols * rows }).map((_, i) => {
          const r = Math.floor(i / cols);
          const c = i % cols;
          const delay = ((r + c) % (cols + rows)) * 0.045;
          const isAccent = (r + c) % 7 === 0;
          const isWarp = (r * 3 + c) % 11 === 0;

          return (
            <motion.span
              key={i}
              initial={{ opacity: 0, scale: 0.6, rotate: -6 }}
              animate={{
                opacity: isAccent ? 0.9 : isWarp ? 0.6 : 0.35,
                scale: 1,
                rotate: 0,
              }}
              transition={{
                delay,
                duration: 0.6,
                ease: [0.16, 1, 0.3, 1],
              }}
              className={
                'rounded-[2px] ' +
                (isAccent
                  ? 'bg-clay-500/90'
                  : isWarp
                    ? 'bg-olive-700/40'
                    : 'bg-olive-300/60')
              }
            />
          );
        })}
      </div>

      {/* Crosshair ticks. */}
      <span className="absolute -left-2 top-1/2 h-px w-4 bg-olive-400/70" />
      <span className="absolute -right-2 top-1/2 h-px w-4 bg-olive-400/70" />
      <span className="absolute -top-2 left-1/2 h-4 w-px bg-olive-400/70" />
      <span className="absolute -bottom-2 left-1/2 h-4 w-px bg-olive-400/70" />
    </div>
  );
}

export function HeroSection({ headerBlock }: { headerBlock: HeaderBlock }) {
  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
      },
    },
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <section className="relative isolate overflow-hidden bg-hero-wash">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-dot-grid opacity-60 [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_85%)]"
      />

      <Container className="relative py-20 sm:py-24 lg:py-32">
        <div className="grid grid-cols-1 items-center gap-y-16 lg:grid-cols-12 lg:gap-x-12">
          <motion.div
            className="flex flex-col items-start gap-7 lg:col-span-7"
            variants={container}
            initial="hidden"
            animate="show"
          >
            <motion.div variants={item}>
              <Eyebrow>Welcome to Jaal Yantra</Eyebrow>
            </motion.div>

            <motion.div variants={item}>
              <StyledTitle title={headerBlock.content.title} />
            </motion.div>

            <motion.div variants={item} className="mt-2 w-full">
              <HeroSearch />
              <p className="mt-3 text-xs text-olive-500">
                Press <kbd className="rounded border border-olive-200 bg-white px-1.5 py-0.5 font-mono text-[10px] text-olive-700">Enter</kbd> to share your idea — we&apos;ll route it to the right team.
              </p>
            </motion.div>
          </motion.div>

          <motion.div
            className="relative flex justify-center lg:col-span-5 lg:justify-end"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          >
            <WovenGrid />
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
