'use client'

import * as Headless from '@headlessui/react'
import { ArrowLongRightIcon } from '@heroicons/react/20/solid'
import { clsx } from 'clsx'
import {
  MotionValue,
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  type HTMLMotionProps,
} from 'framer-motion'
import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import useMeasure, { type RectReadOnly } from 'react-use-measure'
import { Container } from './container'
import { Link } from './link'
import { Heading, Subheading } from './text'
import Image from 'next/image'

interface TestimonialItem {
  img: string;
  name: string;
  title: string;
  quote: string;
}

export interface TestimonialsData {
  content?: {
    title?: string;
    testimonials?: {
      quote: string;
      name: string;
      subtitle: string;
      company: string; // Kept for now, though not directly used in TestimonialItem mapping
      image_url: string;
    }[];
    callToAction?: {
      text: string;
      linkText: string;
      linkUrl: string;
    };
  };
}

// Default testimonials data
const defaultTestimonials: TestimonialItem[] = [
  {
    img: '/testimonials/tina-yards.jpg',
    name: 'Tina Yards',
    title: 'VP of Sales, Protocol',
    quote:
      'Thanks to Radiant, we’re finding new leads that we never would have found with legal methods.',
  },
  {
    img: '/testimonials/conor-neville.jpg',
    name: 'Conor Neville',
    title: 'Head of Customer Success, TaxPal',
    quote:
      'Radiant made undercutting all of our competitors an absolute breeze.',
  },
  {
    img: '/testimonials/amy-chase.jpg',
    name: 'Amy Chase',
    title: 'Head of GTM, Pocket',
    quote:
      'We closed a deal in literally a few minutes because we knew their exact budget.',
  },
  {
    img: '/testimonials/veronica-winton.jpg',
    name: 'Veronica Winton',
    title: 'CSO, Planeteria',
    quote:
      'We’ve managed to put two of our main competitors out of business in 6 months.',
  },
  {
    img: '/testimonials/dillon-lenora.jpg',
    name: 'Dillon Lenora',
    title: 'VP of Sales, Detax',
    quote: 'I was able to replace 80% of my team with RadiantAI bots.',
  },
  {
    img: '/testimonials/harriet-arron.jpg',
    name: 'Harriet Arron',
    title: 'Account Manager, Commit',
    quote:
      'I’ve smashed all my targets without having to speak to a lead in months.',
  },
]

function TestimonialCard({
  name,
  title,
  img,
  children,
  bounds,
  scrollX,
  ...props
}: {
  img: string
  name: string
  title: string
  children: React.ReactNode
  bounds: RectReadOnly
  scrollX: MotionValue<number>
} & HTMLMotionProps<'div'>) {
  const ref = useRef<HTMLDivElement | null>(null)

  const computeOpacity = useCallback(() => {
    const element = ref.current
    if (!element || bounds.width === 0) return 1

    const rect = element.getBoundingClientRect()

    if (rect.left < bounds.left) {
      const diff = bounds.left - rect.left
      const percent = diff / rect.width
      return Math.max(0.5, 1 - percent)
    } else if (rect.right > bounds.right) {
      const diff = rect.right - bounds.right
      const percent = diff / rect.width
      return Math.max(0.5, 1 - percent)
    } else {
      return 1
    }
  }, [ref, bounds.width, bounds.left, bounds.right])

  const opacity = useSpring(computeOpacity(), {
    stiffness: 154,
    damping: 23,
  })

  useLayoutEffect(() => {
    opacity.set(computeOpacity())
  }, [computeOpacity, opacity])

  useMotionValueEvent(scrollX, 'change', () => {
    opacity.set(computeOpacity())
  })

  return (
    <motion.div
      ref={ref}
      style={{ opacity }}
      {...props}
      className="relative flex aspect-9/16 w-72 shrink-0 snap-start scroll-ml-[var(--scroll-padding)] flex-col justify-end overflow-hidden rounded-3xl sm:aspect-3/4 sm:w-96"
    >
      <Image
        alt=""
        src={img}
        className="absolute inset-x-0 top-0 aspect-square w-full object-cover"
        width={100}
        height={100}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 rounded-3xl bg-linear-to-t from-black from-[calc(7/16*100%)] ring-1 ring-gray-950/10 ring-inset sm:from-25%"
      />
      <figure className="relative p-10">
        <blockquote>
          <p className="relative text-xl/7 text-white">
            <span aria-hidden="true" className="absolute -translate-x-full">
              “
            </span>
            {children}
            <span aria-hidden="true" className="absolute">
              ”
            </span>
          </p>
        </blockquote>
        <figcaption className="mt-6 border-t border-white/20 pt-6">
          <p className="text-sm/6 font-medium text-white">{name}</p>
          <p className="text-sm/6 font-medium">
            <span className="bg-linear-to-r from-[#fff1be] from-28% via-[#ee87cb] via-70% to-[#b060ff] bg-clip-text text-transparent">
              {title}
            </span>
          </p>
        </figcaption>
      </figure>
    </motion.div>
  )
}

interface CallToActionProps {
  text: string;
  linkText: string;
  linkUrl: string;
}

function CallToAction({ text, linkText, linkUrl }: CallToActionProps) {
  return (
    <div>
      <p className="max-w-sm text-sm/6 text-gray-600">{text}</p>
      <div className="mt-2">
        <Link
          href={linkUrl}
          className="inline-flex items-center gap-2 text-sm/6 font-medium text-pink-600"
        >
          {linkText}
          <ArrowLongRightIcon className="size-5" />
        </Link>
      </div>
    </div>
  )
}

export function Testimonials({ testimonialsData }: { testimonialsData?: TestimonialsData }) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const { scrollX } = useScroll({ container: scrollRef })
  const referenceWindowRef = useRef<HTMLDivElement>(null)
  const [measureRef, bounds] = useMeasure()
  const [activeIndex, setActiveIndex] = useState(0)
  
  // Convert backend data format to component format if available
  const testimonials: TestimonialItem[] = testimonialsData?.content?.testimonials 
    ? testimonialsData.content.testimonials.map(item => ({
        img: item.image_url,
        name: item.name,
        title: `${item.subtitle}`,
        quote: item.quote
      }))
    : defaultTestimonials
  
  // Calculate the card width and gap once to ensure consistency
  const cardWidth = useRef(0)
  const cardGap = 32 // gap-8 in Tailwind = 2rem = 32px
  const [visibleCardsAtOnce, setVisibleCardsAtOnce] = useState(3)
  
  // Calculate number of scroll pages based on visible cards
  const totalScrollPages = Math.max(1, testimonials.length - visibleCardsAtOnce + 1)
  
  // Map testimonial index to scroll page for dot navigation
  const getScrollPage = (index: number) => {
    // Each scroll position is one page
    return Math.min(index, totalScrollPages - 1)
  }
  
  // More accurate index calculation based on scroll position
  useMotionValueEvent(scrollX, 'change', (x) => {
    if (scrollRef.current && scrollRef.current.children.length > 0) {
      // Get the actual width of a testimonial card
      const firstCard = scrollRef.current.children[0] as HTMLElement
      const cardFullWidth = firstCard.offsetWidth + cardGap
      cardWidth.current = cardFullWidth
      
      // Calculate how many cards are visible in the viewport
      const containerWidth = scrollRef.current.offsetWidth
      const calculatedVisibleCards = Math.floor(containerWidth / cardFullWidth)
      if (calculatedVisibleCards !== visibleCardsAtOnce) {
        setVisibleCardsAtOnce(calculatedVisibleCards)
      }
      
      // Calculate index based on scroll position with proper rounding
      // Add half a card width to center the calculation
      const scrollWithOffset = x + (cardFullWidth / 2)
      const calculatedIndex = Math.floor(scrollWithOffset / cardFullWidth)
      
      // Clamp the index to valid range
      const clampedIndex = Math.max(0, Math.min(calculatedIndex, testimonials.length - 1))
      
      // Only update if the index has actually changed
      if (clampedIndex !== activeIndex) {
        setActiveIndex(clampedIndex)
      }
    }
  })

  // Scroll to the active testimonial when activeIndex changes
  useLayoutEffect(() => {
    if (!scrollRef.current || !scrollRef.current.children[0]) return
    
    // Use the stored card width or calculate it if not available
    const width = cardWidth.current || (scrollRef.current.children[0] as HTMLElement).offsetWidth + cardGap
    
    // Scroll to the exact position for the active index
    scrollRef.current.scrollLeft = activeIndex * width
  }, [activeIndex])

  // Function to handle dot navigation
  function scrollTo(index: number) {
    if (!scrollRef.current || !scrollRef.current.children[0]) return
    
    // Use the stored card width or calculate it
    const width = cardWidth.current || (scrollRef.current.children[0] as HTMLElement).offsetWidth + cardGap
    
    // Set the active index first to ensure state consistency
    setActiveIndex(index)
    
    // Then scroll to the position with smooth behavior
    scrollRef.current.scrollTo({ 
      left: index * width, 
      behavior: 'smooth' 
    })
  }

  return (
    <div className="overflow-hidden py-32">
      <Container>
        <div ref={(el) => {
          // Assign to both refs
          referenceWindowRef.current = el
          measureRef(el)
        }}>
          <Subheading>What everyone is saying</Subheading>
          <Heading as="h3" className="mt-2">
            {testimonialsData?.content?.title}
          </Heading>
        </div>
      </Container>
      <div className="relative">
        <div
          ref={scrollRef}
          className={clsx([
            'mt-16 flex gap-8 px-[var(--scroll-padding)]',
            '[scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
            'snap-x snap-proximity overflow-x-auto overscroll-x-contain scroll-smooth',
            'touch-pan-x',
            '[--scroll-padding:max(--spacing(6),calc((100vw-(var(--container-2xl)))/2))] lg:[--scroll-padding:max(--spacing(8),calc((100vw-(var(--container-7xl)))/2))]',
          ])}
        >
          {testimonials.map(({ img, name, title, quote }, testimonialIndex) => (
            <TestimonialCard
              key={testimonialIndex}
              name={name}
              title={title}
              img={img}
              bounds={bounds}
              scrollX={scrollX}
              onClick={() => scrollTo(testimonialIndex)}
            >
              {quote}
            </TestimonialCard>
          ))}
          {/* Fixed-width spacer to ensure proper scrolling without movement */}
          <div className="w-[var(--scroll-padding)] shrink-0" aria-hidden="true" />
        </div>
      </div>
      <Container className="mt-16">
        <div className="flex justify-between">
          <CallToAction 
            text={testimonialsData?.content?.callToAction?.text || "Join the best sellers in the business and start using Radiant to hit your targets today."}
            linkText={testimonialsData?.content?.callToAction?.linkText || "Get started"}
            linkUrl={testimonialsData?.content?.callToAction?.linkUrl || "#"}
          />
          <div className="hidden sm:flex sm:gap-2">
            {Array.from({ length: totalScrollPages }).map((_, pageIndex) => {
              // Each page represents one scroll position
              const targetIndex = pageIndex
              const currentPage = getScrollPage(activeIndex)
              
              return (
                <Headless.Button
                  key={pageIndex}
                  onClick={() => scrollTo(targetIndex)}
                  data-active={
                    currentPage === pageIndex ? true : undefined
                  }
                  aria-label={`Scroll to page ${pageIndex + 1}`}
                  className={clsx(
                    'size-2.5 rounded-full border border-transparent bg-gray-300 transition',
                    'data-active:bg-gray-400 data-hover:bg-gray-400',
                    'forced-colors:data-active:bg-[Highlight] forced-colors:data-focus:outline-offset-4',
                  )}
                />
              )
            })}
          </div>
        </div>
      </Container>
    </div>
  )
}
