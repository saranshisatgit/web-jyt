import { BentoCard } from '@/components/bento-card'
import { Container } from '@/components/container'
import { ButtonDef, HeroSection } from '@/components/hero-section'
import { LinkedAvatars } from '@/components/linked-avatars'
import { LogoCloud } from '@/components/logo-cloud'
import { LogoTimeline } from '@/components/logo-timeline'
import { Testimonials } from '@/components/testimonials'
import { Heading, Subheading } from '@/components/text'
import type { Metadata } from 'next'
import { fetchPageAndFooter } from './actions'
import { getBlockByType, Block, Page } from '@/medu/queries'
import React, { Suspense, cache } from 'react'
import { Spinner } from '@/components/spinner'
import FeatureCarousel from '@/components/feature-carousel'
import SignUpAvailabilitySlide from '@/components/slides/SignUpAvailabilitySlide'
import TasksListSlide from '@/components/slides/TasksListSlide'
import PaymentProcessSlide from '@/components/slides/PaymentProcessSlide'

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

export function FeatureSection({ featureSection }: { featureSection: FeatureSectionBlockWithSlides }) {
  if(featureSection == undefined) {
    return <>Feature Section 404</>
  }
  const slideBlocks = featureSection.content.slideblocks;
  const sorted = [...slideBlocks].sort((a, b) => a.order - b.order);
  const stepNames = sorted.map((b) => (b.content as { title: string }).title);
  const slides = sorted.map((b) => {
    const compMap = { SignUpAvailabilitySlide, TasksListSlide, PaymentProcessSlide };
    const Comp = compMap[b.name as keyof typeof compMap]!;
    return <Comp key={b.id} />;
  });
  const slideProps = sorted.map((b) => b.content as Record<string, unknown>);

  return (
    <div className="overflow-hidden">
      <Container className="pb-24">
        <Heading as="h2" className="max-w-3xl">
          {featureSection.content.title}
        </Heading>
        <div className="mt-16 h-[36rem] w-full">
          <FeatureCarousel
            steps={stepNames}
            slides={slides}
            slideProps={slideProps}
            interval={3000}
          />
        </div>
      </Container>
    </div>
  )
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
    return <>Bento Section 404</>
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
      eyebrow: string;
      title: string;
      description: string;
      graphic_type: string;
      graphic_url?: string;
    }[];
  };
}

function DarkBentoSection({ darkBentoSection }: { darkBentoSection?: DarkBentoSectionBlock }) {
  return (
    <div className="mx-2 mt-2 rounded-4xl bg-gray-900 py-32">
      <Container>
        <Subheading dark>Outreach</Subheading>
        <Heading as="h3" dark className="mt-2 max-w-3xl">
          {darkBentoSection?.content?.title || "Customer outreach has never been easier."}
        </Heading>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:mt-16 lg:grid-cols-6 lg:grid-rows-2">
          <BentoCard
            dark
            eyebrow="Networking"
            title="Sell at the speed of light"
            description="Our RadiantAI chat assistants analyze the sentiment of your conversations in real time, ensuring you're always one step ahead."
            graphic={
              <div className="h-80 bg-[url(/screenshots/networking.png)] bg-[size:851px_344px] bg-no-repeat" />
            }
            fade={['top']}
            className="max-lg:rounded-t-4xl lg:col-span-4 lg:rounded-tl-4xl"
          />
          <BentoCard
            dark
            eyebrow="Integrations"
            title="Meet leads where they are"
            description="With thousands of integrations, no one will be able to escape your cold outreach."
            graphic={<LogoTimeline />}
            // `overflow-visible!` is needed to work around a Chrome bug that disables the mask on the graphic.
            className="z-10 overflow-visible! lg:col-span-2 lg:rounded-tr-4xl"
          />
          <BentoCard
            dark
            eyebrow="Meetings"
            title="Smart call scheduling"
            description="Automatically insert intro calls into your leads' calendars without their consent."
            graphic={<LinkedAvatars />}
            className="lg:col-span-2 lg:rounded-bl-4xl"
          />
          <BentoCard
            dark
            eyebrow="Engagement"
            title="Become a thought leader"
            description="RadiantAI automatically writes LinkedIn posts that relate current events to B2B sales, helping you build a reputation as a thought leader."
            graphic={
              <div className="h-80 bg-[url(/screenshots/engagement.png)] bg-[size:851px_344px] bg-no-repeat" />
            }
            fade={['top']}
            className="max-lg:rounded-b-4xl lg:col-span-4 lg:rounded-br-4xl"
          />
        </div>
      </Container>
    </div>
  )
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
  const featureSection = getBlockByType(homeData.page.blocks, "FeatureSection") as unknown as FeatureSectionBlockWithSlides;
  return <FeatureSection featureSection={featureSection} />;
}

async function BentoGridSectionComponent({ homeData }: { homeData: SharedPageData }) {
  const bentoSection = getBlockByType(homeData.page.blocks, "BentoSection") as unknown as BentoSectionBlock;
  return <BentoSection bentoSection={bentoSection} />;
}

async function DarkBentoGridSectionComponent({ homeData }: { homeData: SharedPageData }) {
  const darkBentoSection = getBlockByType(homeData.page.blocks, "DarkBentoSection") as unknown as DarkBentoSectionBlock;
  return <DarkBentoSection darkBentoSection={darkBentoSection} />;
}

async function TestimonialsSectionComponent({ homeData }: { homeData: SharedPageData }) {
  const testimonialsSection = getBlockByType(homeData.page.blocks, "TestimonialsSection");
  // Use proper type casting to avoid 'any'
  return <Testimonials testimonialsData={testimonialsSection?.content as Record<string, unknown>} />;
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
