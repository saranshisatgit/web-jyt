import React, { Suspense } from 'react'
import { AnimatedNumber } from '@/components/animated-number'
import { Button } from '@/components/button'
import { Container } from '@/components/container'
import { GradientBackground } from '@/components/gradient'
import { Navbar } from '@/components/navbar'
import { Heading, Lead, Subheading } from '@/components/text'
import type { Metadata } from 'next'
import Image from 'next/image'
import { fetchPagefromAPI } from '../actions'
import { getBlockByName, Block } from '@/medu/queries'
import { SectionLoading } from '@/components/section-loading'

// Interfaces for block content types
interface StatItem {
  label: string;
  value: string;
  animatedValue: {
    start: number;
    end: number;
    decimals?: number;
  };
}

interface HeaderBlockContent {
  title: string;
  subtitle: string;
  mission: {
    title: string;
    paragraphs: string[];
  };
  stats: StatItem[];
  images: string[];
}

interface TeamMember {
  name: string;
  role: string;
  image: string;
}

interface CtaButton {
  text: string;
  link: string;
}

interface TeamBlockContent {
  heading: string;
  subheading: string;
  description: string;
  story: string[];
  teamImage: string; // Ensure teamImage is preserved
  members: TeamMember[];
  ctaButton?: CtaButton; // Optional CTA button
}

interface InvestorGroup {
  name: string;
  logo: string;
}

interface InvestorsBlockContent {
  heading: string;
  subheading: string;
  description: string;
  investorGroups: InvestorGroup[];
  testimonial: {
    quote: string;
    author: string;
    role: string;
    image: string;
  };
}

interface JobPosition {
  title: string;
  department: string;
  location: string;
  type: string;
}

interface Perk {
  title: string;
  description: string;
}

interface CareersBlockContent {
  heading: string;
  subheading: string;
  description: string;
  perks: Perk[];
  openPositions: JobPosition[];
  ctaButton: {
    text: string;
    link: string;
  };
}

export const metadata: Metadata = {
  title: 'Jaal Yantra Textiles - We are on a mission',
  description:
    'We’re on a mission to transform how textiles is desgined and sold.',
}

function Header({ data }: { data?: Block }) {
  const content = data?.content as unknown as HeaderBlockContent;
  // If no data is provided, return null or a fallback UI
  if (!content) {
    return (
      <Container className="mt-16">
        <Heading as="h1">Loading header content...</Heading>
      </Container>
    );
  }

  return (
    <Container className="mt-16">
      <Heading as="h1">{content.title}</Heading>
      <Lead className="mt-6 max-w-3xl">
        {content.subtitle}
      </Lead>
      <section className="mt-16 grid grid-cols-1 lg:grid-cols-2 lg:gap-12">
        <div className="max-w-lg">
          <h2 className="text-2xl font-medium tracking-tight">{content.mission.title}</h2>
          {content.mission.paragraphs.map((paragraph, index) => (
            <p key={index} className={`mt-${index === 0 ? '6' : '8'} text-sm/6 text-gray-600`}>
              {paragraph}
            </p>
          ))}
        </div>
        <div className="pt-20 lg:row-span-2">
          <div className="-mx-8 grid grid-cols-2 gap-4 sm:-mx-16 sm:grid-cols-4 lg:mx-0 lg:grid-cols-2 lg:gap-4 xl:gap-8">
            {content.images.map((image, index) => (
              <div 
                key={index} 
                className={`${index % 2 === 1 ? '-mt-8 lg:-mt-32' : ''} relative aspect-square overflow-hidden rounded-xl shadow-xl outline-1 -outline-offset-1 outline-black/10`}
              >
                <Image
                  alt="An image from the Jaal Yantra Textiles company gallery"
                  src={image}
                  className="object-cover"
                  fill
                  sizes="(min-width: 640px) 25vw, 50vw"
                />
              </div>
            ))}
          </div>
        </div>
        <div className="max-lg:mt-12 lg:col-span-1">
          <dl className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:grid-cols-2">
            {content.stats.map((stat, index) => (
              <div key={index} className={`flex flex-col gap-y-2 ${index < content.stats.length - 1 && index < 3 ? 'max-sm:border-b max-sm:border-dotted max-sm:border-gray-200 max-sm:pb-4' : ''}`}>
                <dt className="text-sm/6 text-gray-600">{stat.label}</dt>
                <dd className="order-first text-6xl font-medium tracking-tight">
                  <AnimatedNumber 
                    start={stat.animatedValue.start} 
                    end={stat.animatedValue.end} 
                    decimals={stat.animatedValue.decimals} 
                  />
                  {stat.value.replace(/[0-9.]+/, '')}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </Container>
  )
}

function Person({
  name,
  description,
  img,
}: {
  name: string
  description: string
  img: string
}) {
  return (
    <li className="flex items-center gap-4">
      <Image alt="" src={img} className="size-12 rounded-full" width={100} height={100} />
      <div className="text-sm/6">
        <h3 className="font-medium">{name}</h3>
        <p className="text-gray-500">{description}</p>
      </div>
    </li>
  )
}

function Team({ data }: { data?: Block }) {
  const content = data?.content as unknown as TeamBlockContent;

  // If no data is provided, return null or a fallback UI
  if (!content) {
    return (
      <Container className="mt-32">
        <Subheading>Loading team information...</Subheading>
      </Container>
    );
  }

  return (
    <Container className="mt-32">
      <Subheading>{content.heading}</Subheading>
      <Heading as="h3" className="mt-2">
        {content.subheading}
      </Heading>
      <Lead className="mt-6 max-w-3xl">
        {content.description}
      </Lead>
      <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-2">
        <div className="max-w-lg">
          {content.story.map((paragraph, index) => (
            <p key={index} className={`${index > 0 ? 'mt-8 ' : ''}text-sm/6 text-gray-600`}>
              {paragraph}
            </p>
          ))}
          {content.ctaButton && content.ctaButton.link && content.ctaButton.text && (
            <div className="mt-8">
              <Button className="w-full sm:w-auto" href={content.ctaButton.link}>
                {content.ctaButton.text}
              </Button>
            </div>
          )}
        </div>
        <div className="max-lg:order-first max-lg:max-w-lg">
          <div className="aspect-3/2 overflow-hidden rounded-xl shadow-xl outline-1 -outline-offset-1 outline-black/10">
            <Image
              alt="Team photo"
              src={content.teamImage}
              className="block size-full object-cover"
              width={450}
              height={100}
            />
          </div>
        </div>
      </div>
      <Subheading as="h3" className="mt-24">
        The team
      </Subheading>
      <hr className="mt-6 border-t border-gray-200" />
      <ul
        role="list"
        className="mx-auto mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
      >
        {content.members.map((member, index) => (
          <Person
            key={index}
            name={member.name}
            description={member.role}
            img={member.image}
          />
        ))}
      </ul>
    </Container>
  )
}

function Investors({ data }: { data?: Block }) {
  const content = data?.content as unknown as InvestorsBlockContent;

  // If no data is provided, return null or a fallback UI
  if (!content) {
    return (
      <Container className="mt-32">
        <Subheading>Loading investor information...</Subheading>
      </Container>
    );
  }
  
  return (
    <Container className="mt-32">
      <Subheading>{content.heading}</Subheading>
      <Heading as="h3" className="mt-2">
        {content.subheading}
      </Heading>
      <Lead className="mt-6 max-w-3xl">
        {content.description}
      </Lead>
      <div className="mt-16 grid grid-cols-2 gap-x-12 gap-y-16 sm:grid-cols-3 lg:grid-cols-6">
        {content.investorGroups.map((investor, index) => (
          <div key={index} className="flex flex-col gap-y-6">
            {investor.logo && (
              <Image
                alt={investor.name}
                src={investor.logo}
                className="h-14 w-auto"
                width={100}
                height={100}
              />
            )}
            <div className="text-sm/6 text-gray-600">{investor.name}</div>
          </div>
        ))}
      </div>
      
      <div className="mt-16 rounded-4xl bg-gray-950 py-20 sm:mt-32 sm:py-32 lg:mt-56">
        <Container>
          <div className="mx-auto max-w-2xl lg:max-w-none">
            <div className="flex flex-col items-center text-center">
              <p className="font-display text-base font-semibold text-white">
                What our investors are saying
              </p>
              <figure className="mt-6">
                <blockquote className="text-xl/8 text-white sm:text-2xl/9">
                  <p>
                    &ldquo;{content.testimonial.quote}&rdquo;
                  </p>
                </blockquote>
                <figcaption className="mt-6 flex flex-col gap-x-4 gap-y-1">
                  <div className="font-semibold text-white">{content.testimonial.author}</div>
                  <div className="text-sm text-gray-400">
                    {content.testimonial.role}
                  </div>
                </figcaption>
              </figure>
            </div>
          </div>
        </Container>
      </div>
    </Container>
  )
}

function Careers({ data }: { data?: Block }) {
  const content = data?.content as unknown as CareersBlockContent;
  
  // If no data is provided, return null or a fallback UI
  if (!content) {
    return (
      <Container className="my-32">
        <Subheading>Loading career information...or probably no career section created yet</Subheading>
      </Container>
    );
  }
  
  return (
    <Container className="my-32">
      <Subheading>{content.heading}</Subheading>
      <Heading as="h3" className="mt-2">
        {content.subheading}
      </Heading>
      <Lead className="mt-6 max-w-3xl">
        {content.description}
      </Lead>
      <div className="mt-24 grid grid-cols-1 gap-16 lg:grid-cols-[1fr_24rem]">
        <div className="lg:max-w-2xl">
          <Subheading as="h3">Open positions</Subheading>
          <div>
            <table className="w-full text-left">
              <colgroup>
                <col className="w-2/3" />
                <col className="w-1/3" />
                <col className="w-0" />
              </colgroup>
              <thead className="sr-only">
                <tr>
                  <th scope="col">Title</th>
                  <th scope="col">Location</th>
                  <th scope="col">Read more</th>
                </tr>
              </thead>
              <tbody>
                {/* Group positions by department */}
                {(() => {
                  // Get unique departments
                  const departments = [...new Set(content.openPositions.map(position => position.department))];
                  
                  return departments.map((department, deptIndex) => {
                    const departmentPositions = content.openPositions.filter(
                      position => position.department === department
                    );
                    
                    return (
                      <React.Fragment key={deptIndex}>
                        <tr>
                          <th scope="colgroup" colSpan={3} className="px-0 pt-10 pb-0">
                            <div className="-mx-4 rounded-lg bg-gray-50 px-4 py-3 text-sm/6 font-semibold">
                              {department}
                            </div>
                          </th>
                        </tr>
                        {departmentPositions.map((position, posIndex) => {
                          const isLast = posIndex === departmentPositions.length - 1;
                          return (
                            <tr 
                              key={posIndex} 
                              className={`text-sm/6 font-normal ${!isLast ? 'border-b border-dotted border-gray-200' : ''}`}
                            >
                              <td className="px-0 py-4">{position.title}</td>
                              <td className="px-0 py-4 text-gray-600">{position.location}</td>
                              <td className="px-0 py-4 text-right">
                                <Button variant="outline" href="#">
                                  View listing
                                </Button>
                              </td>
                            </tr>
                          );
                        })}
                      </React.Fragment>
                    );
                  });
                })()}
              </tbody>
            </table>
          </div>
          <div className="mt-12">
            <Button className="w-full sm:w-auto" href={content.ctaButton.link}>
              {content.ctaButton.text}
            </Button>
          </div>
        </div>
        <div>
          <Subheading as="h3">Perks</Subheading>
          <dl className="mt-6 grid grid-cols-1 gap-8">
            {content.perks.map((perk, index) => (
              <div key={index}>
                <dt className="font-semibold">{perk.title}</dt>
                <dd className="mt-2 text-sm/6 text-gray-600">{perk.description}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </Container>
  )
}

export default async function Company() {
  const headerBlock = await fetchPagefromAPI('about-us')
  if (!headerBlock) return null
  // We will then get the block type 
  const headerType = getBlockByName(headerBlock.blocks, "Header");
  const team = getBlockByName(headerBlock.blocks, "Team");
  const investors = getBlockByName(headerBlock.blocks, "Investors");
  const careers = getBlockByName(headerBlock.blocks, "Careers");
  return (
    <main className="overflow-hidden">
      <GradientBackground />
      <Container>
        <Navbar />
      </Container>
      <Suspense fallback={<SectionLoading />}>
        <Header data={headerType} />
      </Suspense>
      <Suspense fallback={<SectionLoading />}>
        <Team data={team}/>
      </Suspense>
      <Suspense fallback={<SectionLoading />}>  
        <Investors data={investors} />
      </Suspense>
      <Suspense fallback={<SectionLoading />}>  
      <Careers data={careers} />
      </Suspense>
    </main>
  )
}
