import { Container } from "@/components/container";
import { ButtonDef, HeroSection } from "@/components/hero-section";
import { LogoCloud } from "@/components/logo-cloud";
import { FeatureSection } from "../page";
import { Metadata } from "next";
import { fetchPagefromAPI } from "../actions";
import { getBlockByName, getBlockByType } from "@/medu/queries";
import { Suspense } from "react";
import { SectionLoading } from "@/components/section-loading";

export const dynamic = 'force-dynamic'

interface HeaderBlock {
  content: {
    title: string;
    subtitle: string;
    announcement: string;
    buttons: ButtonDef[]
  };
}

interface LogoBlocks {
    content: {
        logos: {
            id: string
            src: string;
            alt: string;
        }[]
    }
    
}

interface FeatureSectionBlock {
    content: {
      title: string;
      subtitle: string;
      screenshot: {
        url: string;
      };
    };
  }

export const metadata: Metadata = {
    description:
      'JYT where find independent artisans and connect with designers to produce some bespoke designs.',
  }

export default async function Partner({
   
}) {

    const partnerPage = await fetchPagefromAPI('partner')
    const rawHeaderBlock = getBlockByType(partnerPage.blocks, "Header") as unknown as HeaderBlock
    const headerBlock = {
      content: {
        title: rawHeaderBlock.content.title,
        subtitle: rawHeaderBlock.content.subtitle,
        announcement: rawHeaderBlock.content.announcement,
        buttons: rawHeaderBlock.content.buttons,
      },
    }
    const announcementBlock = { content: { announcement: rawHeaderBlock.content.announcement } }
    const logoBlocks = getBlockByName(partnerPage.blocks, "Feature Section") as unknown as LogoBlocks
    const featureSection = getBlockByName(partnerPage.blocks, "Partner Feature") as unknown as FeatureSectionBlock;
  return (
    <div className="overflow-hidden">
      <HeroSection headerBlock={headerBlock} announcementBlock={announcementBlock} />
      <main>
        <Container className="mt-10">
          <LogoCloud logoBlocks={logoBlocks.content.logos} />
        </Container>
        <div className="bg-linear-to-b from-white from-50% to-gray-100 py-32">
         <Suspense fallback={<SectionLoading />}>
                       {featureSection ? (
                         <FeatureSection featureSection={featureSection} />
                       ) : (
                         <SectionLoading />
                       )}
                     </Suspense>
        </div>
        
      </main>
      
    </div>
  )
}