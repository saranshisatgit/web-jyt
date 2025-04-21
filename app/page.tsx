import { BentoCard } from '@/components/bento-card'
import { Container } from '@/components/container'
import { ButtonDef, HeroSection } from '@/components/hero-section'
import { Keyboard } from '@/components/keyboard'
import { LinkedAvatars } from '@/components/linked-avatars'
import { LogoCloud } from '@/components/logo-cloud'
import { LogoCluster } from '@/components/logo-cluster'
import { LogoTimeline } from '@/components/logo-timeline'
import { Map } from '@/components/map'
import { Testimonials } from '@/components/testimonials'
import { Heading, Subheading } from '@/components/text'
import type { Metadata } from 'next'
import { fetchPagefromAPI } from './actions'
import { getBlockByType, getBlockByName, Block } from '@/medu/queries'
import React, { Suspense } from 'react'
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
async function Hero()  {
const home = await fetchPagefromAPI('home')
const rawHeroBlock = getBlockByType(home.blocks, "Hero") as unknown as HeroBlock
const headerBlock = {
  content: {
    title: rawHeroBlock.content.title,
    subtitle: rawHeroBlock.content.subtitle,
    announcement: rawHeroBlock.content.announcement,
    buttons: rawHeroBlock.content.buttons
  },
}
const announcementBlock = getBlockByType(home.blocks, "Header") as unknown as HeaderBlock
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
  console.log(featureSection)
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

function BentoSection({ bentoSection }: { bentoSection?: BentoSectionBlock }) {
  return (
    <Container>
      <Subheading>Sales</Subheading>
      <Heading as="h3" className="mt-2 max-w-3xl">
        {bentoSection?.content?.title || "Know more about your customers than they do."}
      </Heading>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:mt-16 lg:grid-cols-6 lg:grid-rows-2">
        <BentoCard
          eyebrow="Insight"
          title="Get perfect clarity"
          description="Radiant uses social engineering to build a detailed financial picture of your leads. Know their budget, compensation package, social security number, and more."
          graphic={
            <div className="h-80 bg-[url(/screenshots/profile.png)] bg-[size:1000px_560px] bg-[left_-109px_top_-112px] bg-no-repeat" />
          }
          fade={['bottom']}
          className="max-lg:rounded-t-4xl lg:col-span-3 lg:rounded-tl-4xl"
        />
        <BentoCard
          eyebrow="Analysis"
          title="Undercut your competitors"
          description="With our advanced data mining, you’ll know which companies your leads are talking to and exactly how much they’re being charged."
          graphic={
            <div className="absolute inset-0 bg-[url(/screenshots/competitors.png)] bg-[size:1100px_650px] bg-[left_-38px_top_-73px] bg-no-repeat" />
          }
          fade={['bottom']}
          className="lg:col-span-3 lg:rounded-tr-4xl"
        />
        <BentoCard
          eyebrow="Speed"
          title="Built for power users"
          description="It’s never been faster to cold email your entire contact list using our streamlined keyboard shortcuts."
          graphic={
            <div className="flex size-full pt-10 pl-10">
              <Keyboard highlighted={['LeftCommand', 'LeftShift', 'D']} />
            </div>
          }
          className="lg:col-span-2 lg:rounded-bl-4xl"
        />
        <BentoCard
          eyebrow="Source"
          title="Get the furthest reach"
          description="Bypass those inconvenient privacy laws to source leads from the most unexpected places."
          graphic={<LogoCluster />}
          className="lg:col-span-2"
        />
        <BentoCard
          eyebrow="Limitless"
          title="Sell globally"
          description="Radiant helps you sell in locations currently under international embargo."
          graphic={<Map />}
          className="max-lg:rounded-b-4xl lg:col-span-2 lg:rounded-br-4xl"
        />
      </div>
    </Container>
  )
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

// Interface for bento section blocks
interface BentoSectionBlock {
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

// Interface for dark bento section blocks
interface DarkBentoSectionBlock {
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



// Loading component for sections
function SectionLoading() {
  return (
    <div className="flex items-center justify-center py-16">
      <Spinner size="lg" />
    </div>
  );
}



export default async function Home() {
  try {
    // Fetch home page data
    const home = await fetchPagefromAPI('home');
    
    // Get feature section data (with slideBlocks inside content)
    const featureSection = getBlockByName(home.blocks, "Feature Section") as unknown as FeatureSectionBlockWithSlides;
    
    // Get logo section data
    const logoSection = getBlockByName(home.blocks, "Logo Cloud") as unknown as LogoSectionBlock;
    
    return (
      <div className="overflow-hidden">
        <Suspense fallback={<SectionLoading />}>
          <Hero />
        </Suspense>
        
        <main>
          <Suspense fallback={<SectionLoading />}>
            <Container className="mt-10">
              {logoSection?.content?.logos ? (
                <LogoCloud logoBlocks={logoSection.content.logos} />
              ) : (
                <LogoCloud logoBlocks={[]} />
              )}
            </Container>
          </Suspense>
          
          <div className="bg-linear-to-b from-white from-50% to-gray-100 py-32">
            <Suspense fallback={<SectionLoading />}>
              {featureSection ? (
                <FeatureSection featureSection={featureSection} />
              ) : (
                <SectionLoading />
              )}
            </Suspense>
            
            <Suspense fallback={<SectionLoading />}>
              <BentoSection />
            </Suspense>
          </div>
          
          <Suspense fallback={<SectionLoading />}>
            <DarkBentoSection />
          </Suspense>
        </main>
        
        <Suspense fallback={<SectionLoading />}>
          <Testimonials />
        </Suspense>
      </div>
    );
  } catch (error) {
    console.error("Error fetching home page data:", error);
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
        <p>Were having trouble loading the page. Please try again later.</p>
      </div>
    );
  }
}
