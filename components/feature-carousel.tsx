// components/feature-carousel.tsx
"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { AnimatePresence, motion, useMotionTemplate, useMotionValue } from "motion/react";
import clsx from "clsx";

interface FeatureCarouselProps {
  slides: React.ReactElement<unknown>[];
  steps?: string[];
  interval?: number;
  /** Additional classes for outer wrapper */
  wrapperClassName?: string;
  /** Optional props to inject into each slide element */
  slideProps?: Record<string, unknown>[];
}

/** Hook to manage cyclic index with auto-play */
function useNumberCycler(total: number, interval: number = 3000) {
  const [current, setCurrent] = useState(0);
  const timer = useRef<NodeJS.Timeout>(setTimeout(() => {}, 0));

  const setup = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCurrent((p) => (p + 1) % total), interval);
  }, [interval, total]);

  useEffect(() => {
    setup();
    return () => { if (timer.current) clearTimeout(timer.current) };
  }, [current, setup]);

  const advance = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    setCurrent((p) => (p + 1) % total);
  }, [total]);

  const goTo = useCallback((idx: number) => {
    if (timer.current) clearTimeout(timer.current);
    setCurrent(idx % total);
  }, [total]);

  return { current, advance, goTo };
}

const ANIMATION_PRESETS = {
  fadeInScale: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit:    { opacity: 0, scale: 0.95 },
    transition: { type: "spring", stiffness: 300, damping: 25, mass: 0.5 }
  }
} as const;

export default function FeatureCarousel({ slides, slideProps = [], steps, interval = 3000, wrapperClassName = "" }: FeatureCarouselProps) {
  const { current, advance, goTo } = useNumberCycler(slides.length, interval);
  const stepNames = steps ?? slides.map((_, i) => `Step ${i + 1}`);
  // Inject props into slide elements
  const slideElements = slides.map((slide, i) =>
    React.isValidElement(slide) ? React.cloneElement(slide, slideProps[i] || {}) : slide
  );
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouse = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  return (
    <motion.div
      className={clsx("animated-cards relative w-full rounded-lg sm:rounded-[16px] overflow-hidden", wrapperClassName)}
      onMouseMove={handleMouse}
      style={{ "--x": useMotionTemplate`${mouseX}px`, "--y": useMotionTemplate`${mouseY}px` } as React.CSSProperties}
    >
      <div className="group relative w-full overflow-hidden md:overflow-visible rounded-xl sm:rounded-3xl border border-black/10 bg-gray-50 dark:bg-neutral-900 backdrop-blur-sm text-gray-900 dark:text-white transition duration-300 md:hover:border-transparent">
        {/* Step indicator inside carousel */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 flex justify-center gap-4">
          {stepNames.map((title, idx) => (
            <button
              key={idx}
              onClick={() => goTo(idx)}
              className={clsx(
                "text-sm font-medium",
                idx === current
                  ? "text-lime-300 dark:text-lime-500"
                  : "text-neutral-500"
              )}
            >
              {title}
            </button>
          ))}
        </div>
        <div className="m-4 sm:m-10 min-h-[250px] sm:min-h-[450px] w-full h-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              {...ANIMATION_PRESETS.fadeInScale}
              className="w-full h-full"
            >
              {slideElements[current]}
            </motion.div>
          </AnimatePresence>
          <div className="absolute inset-0 z-50 cursor-pointer" onClick={advance} />
        </div>
      </div>
    </motion.div>
  );
}