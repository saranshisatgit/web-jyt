import { BentoCard } from '@/components/bento-card'
import { Container } from '@/components/container'
import { ButtonDef, HeroSection } from '@/components/hero-section'

import { LogoCloud } from '@/components/logo-cloud'

import { Testimonials, TestimonialsData } from '@/components/testimonials'
import { Heading, Subheading } from '@/components/text'
import type { Metadata } from 'next'
import { fetchPageAndFooter } from './actions'
import { getBlockByType, Block, Page, getBlockByName } from '@/medu/queries'
import React, { Suspense, cache } from 'react'
import { Spinner } from '@/components/spinner'
import FeatureCarousel from '@/components/feature-carousel'
import SignUpAvailabilitySlide from '@/components/slides/SignUpAvailabilitySlide'
import TasksListSlide from '@/components/slides/TasksListSlide'
import PaymentProcessSlide from '@/components/slides/PaymentProcessSlide';
import { Screenshot } from '@/components/screenshot';

export const metadata: Metadata = {
  description:
    'JYT where find independent artisans and connect with designers to produce some bespoke designs.',
}

interface HeroBlock {
  content: {
    title: string;
    subtitle: string;
    announcement: string;
    buttons: ButtonDef[]
  };
}

interface HeaderBlock {
  content: {
    announcement: string;
  };
}
// Memoize data fetching with React cache
const getCachedPageData = cache(async (slug: string) => {
  return await fetchPageAndFooter(slug);
});

// Define the type for the shared data
interface SharedPageData {
  page: Page;
  footer: Block | undefined;
}

async function Hero({ homeData }: { homeData: Page })  {
  const rawHeroBlock = getBlockByType(homeData.blocks, "Hero") as unknown as HeroBlock
  const headerBlock = {
    content: {
      title: rawHeroBlock.content.title,
      subtitle: rawHeroBlock.content.subtitle,
      announcement: rawHeroBlock.content.announcement,
      buttons: rawHeroBlock.content.buttons
    },
  }
  const announcementBlock = getBlockByType(homeData.blocks, "Header") as unknown as HeaderBlock
  return (
     <HeroSection headerBlock={headerBlock} announcementBlock={announcementBlock} />
  )
}

interface FeatureSectionBlockWithSlides {
  content: {
    title: string;
    subtitle: string;
    screenshot: { url: string };
    slideblocks: Block[];
  };
}

// Sample JSON representation for a Block based on FeatureSection:
// {
//   "id": "unique_feature_section_id_123",
//   "name": "Feature Section with Screenshot",
//   "type": "feature_section",
//   "content": {
//     "heading": "A snapshot of your entire sales pipeline.",
//     "screenshot": {
//       "src": "/screenshots/app.png",
//       "width": 1216,
//       "height": 768,
//       "className": "mt-16 h-[36rem] sm:h-auto sm:w-[76rem]"
//     }
//   },
//   "order": 0 // Assuming this is the first block
// }

export function FeatureSection({ featureSection }: { featureSection: FeatureSectionBlockWithSlides }) {
  if (featureSection == undefined) {
    return <>Loading feature section</>;
  }

  const { title, screenshot, slideblocks } = featureSection.content;

  // Check if slideblocks exist and have content
  const hasSlideBlocks = slideblocks && slideblocks.length > 0;

  return (
    <div className="overflow-hidden">
      <Container className="pb-24">
        <Heading as="h2" className="max-w-3xl">
          {title}
        </Heading>
        {hasSlideBlocks ? (
          (() => { // IIFE to keep variable scope local for carousel logic
            const sorted = [...slideblocks].sort((a, b) => a.order - b.order);
            const stepNames = sorted.map((b) => (b.content as { title: string }).title);
            const slides = sorted.map((b) => {
              const compMap = { SignUpAvailabilitySlide, TasksListSlide, PaymentProcessSlide };
              const Comp = compMap[b.name as keyof typeof compMap]!;
              return <Comp key={b.id} />;
            });
            const slideProps = sorted.map((b) => b.content as Record<string, unknown>);
            return (
              <div className="mt-16 h-[36rem] w-full">
                <FeatureCarousel
                  steps={stepNames}
                  slides={slides}
                  slideProps={slideProps}
                  interval={3000}
                />
              </div>
            );
          })()
        ) : screenshot && screenshot.url ? (
          <Screenshot
            width={2784}
            height={1582}
            src={screenshot.url}
            className="mt-16 h-[36rem] sm:h-auto sm:w-[76rem]"
          />
        ) : (
          <div className="mt-16 text-center">
            <p>Feature content is not available.</p>
          </div>
        )}
      </Container>
    </div>
  );
}

export interface BentoSectionBlock {
  content: {
    title: string;
    subtitle: string;
    cards: {
      eyebrow: string;
      title: string;
      description: string;
      graphic_type: string;
      graphic_url?: string;
      fade?: ('top' | 'bottom')[];
      className?: string;
    }[];
  };
}

export function BentoSection({ bentoSection }: { bentoSection: BentoSectionBlock }) {

  if (bentoSection == undefined) {
    return <>Loading section</>
  }
  const { title, subtitle, cards } = bentoSection.content;
  // default grid spans and fades to mirror original layout
  const defaultClasses = [
    "max-lg:rounded-t-4xl lg:col-span-3 lg:rounded-tl-4xl",
    "lg:col-span-3 lg:rounded-tr-4xl",
    "lg:col-span-2 lg:rounded-bl-4xl",
    "lg:col-span-2",
    "max-lg:rounded-b-4xl lg:col-span-2 lg:rounded-br-4xl",
  ];
  const defaultFades: ('top' | 'bottom')[][] = [
    ['bottom'],
    ['bottom'],
    [],
    [],
    []
  ];
  return (
    <Container>
      <Subheading>{subtitle}</Subheading>
      <Heading as="h3" className="mt-2 max-w-3xl">{title}</Heading>
      <div className="mt-10 grid grid-cols-1 gap-4 sm:mt-16 lg:grid-cols-6 lg:grid-rows-2">
        {cards.map((card, idx) => (
          <BentoCard
            key={idx}
            eyebrow={card.eyebrow}
            title={card.title}
            description={card.description}
            graphic={
              card.graphic_type === 'image' && card.graphic_url
                ? <div className="h-80 bg-cover bg-center" style={{ backgroundImage: `url(${card.graphic_url})` }} />
                : null
            }
            fade={card.fade ?? defaultFades[idx]}
            className={card.className ?? defaultClasses[idx]}
          />
        ))}
      </div>
    </Container>
  )
}

export interface DarkBentoSectionBlock {
  content: {
    title: string;
    subtitle: string;
    cards: {
      id?: string;
      eyebrow: string;
      title: string;
      description: string;
      graphic_type: string;
      graphic_url?: string;
    }[];
  };
}

function DarkBentoSection({ darkBentoSection }: { darkBentoSection?: DarkBentoSectionBlock }) {
  const { content } = darkBentoSection || {};
  const { title, subtitle, cards } = content || {};

  // Define layout classes and fades here for a predictable layout
  const layoutClasses = [
    "max-lg:rounded-t-4xl lg:col-span-3 lg:rounded-tl-4xl", // Card 0: Top-left
    "lg:col-span-3 lg:rounded-tr-4xl",                     // Card 1: Top-right
    "max-lg:rounded-b-4xl lg:col-span-6 lg:rounded-b-4xl"  // Card 2: Bottom-full
  ];

  const fadeLayout: (('top' | 'bottom')[] | undefined)[] = [
    ['bottom'], // Card 0
    ['bottom'], // Card 1
    ['top']     // Card 2
  ];

  return (
    <div className="mx-2 mt-2 rounded-4xl bg-gray-900 py-32">
      <Container>
        <Subheading dark>{subtitle || "Default Subtitle"}</Subheading>
        <Heading as="h3" dark className="mt-2 max-w-3xl">
          {title || "Customer outreach has never been easier."}
        </Heading>

        {cards && cards.length > 0 ? (
          <div className="mt-10 grid grid-cols-1 gap-4 sm:mt-16 lg:grid-cols-6 lg:grid-rows-2">
            {cards.map((card, idx) => {
              let graphicElement = null;
              if (card.graphic_type === 'image' && card.graphic_url) {
                graphicElement = (
                  <div 
                    className="h-80 w-full bg-cover bg-center rounded-md"
                    style={{ backgroundImage: `url(${card.graphic_url})` }}
                  />
                );
              }
              // Add more conditions here for other graphic_types if needed

              return (
                <BentoCard
                  key={card.id || idx}
                  dark
                  eyebrow={card.eyebrow}
                  title={card.title}
                  description={card.description}
                  graphic={graphicElement}
                  fade={fadeLayout[idx]}
                  className={layoutClasses[idx] || ''}
                />
              );
            })}
          </div>
        ) : (
          <p className="mt-10 text-center text-gray-400">No cards to display for this section.</p>
        )}
      </Container>
    </div>
  );
}

// Interface for logo blocks
interface LogoBlock {
  id: string;
  alt?: string;
  src?: string;
}

interface LogoSectionBlock {
  content: {
    logos: LogoBlock[];
  };
}

// Loading component for sections
function SectionLoading() {
  return (
    <div className="flex items-center justify-center py-16">
      <Spinner size="lg" />
    </div>
  );
}

// Define section components that use the shared data
async function FeaturesSectionComponent({ homeData }: { homeData: SharedPageData }) {
  const rawFeatureBlock = getBlockByName(homeData.page.blocks, "Feature Section");
  console.log(homeData);
  if (!rawFeatureBlock) {
    return <SectionLoading />; 
  }

  // Define supported names for FeatureSection blocks this component can render
  const supportedNames = ["FeatureSectionWithCarousel", "FeatureSectionWithScreenshot", "Feature Section"];

  if (!supportedNames.includes(rawFeatureBlock.name)) {
    // If the block's name isn't supported, log a warning and don't render it.
    // You could also choose to render nothing (return null) or a specific fallback UI.
    console.warn(`FeatureSection block named '${rawFeatureBlock.name}' is not supported by FeaturesSectionComponent and will not be rendered.`);
    return null; // Or <SectionLoading /> or some other fallback
  }

  // Prepare the prop for the FeatureSection component
  // This assumes rawFeatureBlock.content matches the expected structure for FeatureSectionBlockWithSlides.content
  const featureSectionProp: FeatureSectionBlockWithSlides = {
    content: rawFeatureBlock.content as {
      title: string;
      subtitle: string; // Make sure your backend provides this if it's always expected
      screenshot: { url: string }; // Ensure this structure is consistent or handled if optional
      slideblocks: Block[]; // Ensure this is an array, even if empty, or handle if optional
    }
  };

  return <FeatureSection featureSection={featureSectionProp} />;
}

async function BentoGridSectionComponent({ homeData }: { homeData: SharedPageData }) {
  const bentoSection = getBlockByName(homeData.page.blocks, "BentoSection") as unknown as BentoSectionBlock;
  return <BentoSection bentoSection={bentoSection} />;
}

async function DarkBentoGridSectionComponent({ homeData }: { homeData: SharedPageData }) {
  const darkBentoSection = getBlockByName(homeData.page.blocks, "DarkBentoSection") as unknown as DarkBentoSectionBlock;
  return <DarkBentoSection darkBentoSection={darkBentoSection} />;
}

async function TestimonialsSectionComponent({ homeData }: { homeData: SharedPageData }) {
  const testimonialsSection = getBlockByName(homeData.page.blocks, "TestimonialsSection");
  // Pass the entire block, as TestimonialsData expects an object with a 'content' property
  return <Testimonials testimonialsData={testimonialsSection as unknown as TestimonialsData} />;
}

async function LogoSectionComponent({ homeData }: { homeData: SharedPageData }) {
  const logoSection = getBlockByType(homeData.page.blocks, "LogoSection") as unknown as LogoSectionBlock;
  return <LogoCloud logoBlocks={logoSection?.content?.logos || []} />;
}

export default async function Home() {
  try {
    // Fetch data once at the root level using the cached function
    const homeData = await getCachedPageData('home');
    
    return (
      <div className="relative">
        <div className="relative">
          <Suspense fallback={<SectionLoading />}>
            <Hero homeData={homeData.page} />
          </Suspense>
        </div>

        <div className="mt-32 sm:mt-40 relative">
          <Suspense fallback={<SectionLoading />}>
            <FeaturesSectionComponent homeData={homeData} />
          </Suspense>
        </div>

        <div className="mt-32 sm:mt-40 relative">
          <Suspense fallback={<SectionLoading />}>
            <BentoGridSectionComponent homeData={homeData} />
          </Suspense>
        </div>

        <div className="mt-32 sm:mt-40 relative">
          <Suspense fallback={<SectionLoading />}>
            <DarkBentoGridSectionComponent homeData={homeData} />
          </Suspense>
        </div>

        <div className="mt-32 sm:mt-40 relative">
          <Suspense fallback={<SectionLoading />}>
            <TestimonialsSectionComponent homeData={homeData} />
          </Suspense>
        </div>

        <div className="mt-32 sm:mt-40 relative">
          <Suspense fallback={<SectionLoading />}>
            <LogoSectionComponent homeData={homeData} />
          </Suspense>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error in Home component:', error);
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
        <p>We&apos;re having trouble loading the page. Please try again later.</p>
      </div>
    );
  }
}
