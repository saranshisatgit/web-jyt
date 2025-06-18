import { type Metadata } from 'next';
import { Container } from '@/components/container';
import { GradientBackground } from '@/components/gradient';
import { HeroSection, type HeaderBlock, type AnnouncementBlock, type ButtonDef } from '@/components/hero-section';
import { fetchPageAndFooter } from '../actions';
import { type Block, getBlockByName } from '@/medu/queries';
import { SectionLoading } from '@/components/section-loading';
import { Link } from '@/components/link';
import ContactForm from '@/components/ContactForm';

// Types for the new ContactInfoBlock
interface LinkItem {
  text: string;
  url: string;
  target?: string;
}

interface ContactInfoContent {
  title?: string;
  introParagraph?: string;
  links?: LinkItem[];
  wholesaleInquiryText?: string;
  mainContentParagraph?: string;
  address?: string;
  phone?: string;
  email?: string;
}

interface ContactInfoBlock extends Block {
  name: "ContactInfo"; // Ensure this matches the CMS block name
  content: Record<string, unknown>; // Use unknown for better type safety, cast when using
}

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with the Jaal Yantra Textiles sales team. We are here to help you with your textile and garment production needs.',
};


export default async function ContactPage() {
  const commonData = await fetchPageAndFooter('contact');

  if (!commonData || !commonData.page) {
    return (
      <div className="flex h-screen flex-col items-center justify-center">
        <p className="mb-4 text-xl">Could not load contact page information.</p>
        <SectionLoading />
      </div>
    );
  }

  const pageData = commonData.page;
  const cmsHeaderBlock = getBlockByName(pageData.blocks, 'Header') as Block | undefined;
  const cmsContactInfoBlock = getBlockByName(pageData.blocks, 'ContactInfo') as ContactInfoBlock | undefined;
  const specificContactContent = cmsContactInfoBlock?.content as ContactInfoContent | undefined;

  // Default content for ContactInfo section if CMS block is not found or fields are missing
  const contactInfoData: ContactInfoContent = {
    title: specificContactContent?.title || 'Contact Our Sales Team',
    introParagraph: specificContactContent?.introParagraph || 'We\'re here to help you find the perfect textile solutions for your business. Whether you have questions about our products, need a custom quote, or want to discuss a potential partnership, our expert sales team is ready to assist you.',
    links: specificContactContent?.links || [
      { text: 'cicilabel.com', url: 'https://cicilabel.com', target: '_blank' },
    ],
    wholesaleInquiryText: specificContactContent?.wholesaleInquiryText || 'For other wholesale inquiries please contact us using the form below.',
    mainContentParagraph: specificContactContent?.mainContentParagraph || 'Our team has extensive experience in the textile industry and can provide insights into the latest trends, materials, and production techniques. We are committed to understanding your unique needs and delivering exceptional service.',
    address: specificContactContent?.address || '123 Textile Avenue, Weaverville, TX 75001, USA',
    phone: specificContactContent?.phone || '+1 (555) 123-4567',
    email: specificContactContent?.email || 'sales@jaalyantra.com',
  };


  const heroHeaderBlock: HeaderBlock = {
    content: {
      title: (cmsHeaderBlock?.content?.title as string) || 'Contact Our Sales Team',
      subtitle: (cmsHeaderBlock?.content?.subtitle as string) || 'We are here to help you with your textile needs.',
      announcement: (cmsHeaderBlock?.content?.announcement as string) || '',
      buttons: (cmsHeaderBlock?.content?.buttons as ButtonDef[]) || [],
    },
  };

  const heroAnnouncementBlock: AnnouncementBlock = {
    content: {
      announcement: (cmsHeaderBlock?.content?.announcement as string) || '',
    },
  };

  return (
    <>
      <main className="overflow-hidden">
        <GradientBackground />
        {/* HeroSection includes Navbar and uses the fetched header data */}
        <HeroSection headerBlock={heroHeaderBlock} announcementBlock={heroAnnouncementBlock} />
        
        <Container className="py-16 sm:py-24">
          <div className="grid grid-cols-1 gap-x-12 gap-y-16 md:grid-cols-2">
            
            {/* Left Column: Dynamic Contact Information */}
            <div className="prose prose-lg max-w-none lg:prose-xl बनावट">
              <h2 className="text-3xl font-bold tracking-tight बनावट text-gray-900 sm:text-4xl">
                {contactInfoData.title}
              </h2>
              <p className="mt-4 text-lg leading-8 बनावट text-gray-600">
                {contactInfoData.introParagraph}
              </p>
              {contactInfoData.links && contactInfoData.links.map((link, index) => (
                <p key={index} className="mt-4 text-base text-gray-600 बनावट">
                  {/* Basic heuristic to add prefix for the cicilabel link, can be refined or made data-driven */}
                  {link.url.includes('cicilabel.com') ? 'Buy from our bespoke label: ' : ''}
                  <Link href={link.url} target={link.target || '_self'} rel={link.target === '_blank' ? 'noopener noreferrer' : undefined} className="text-pink-600 hover:text-pink-500">
                    {link.text} 
                  </Link>
                </p>
              ))}
              {contactInfoData.wholesaleInquiryText && (
                <p className="mt-4 text-base text-gray-600 बनावट">
                  {contactInfoData.wholesaleInquiryText}
                </p>
              )}
              {contactInfoData.mainContentParagraph && (
                <p className="mt-6 text-base text-gray-600 बनावट">
                  {contactInfoData.mainContentParagraph}
                </p>
              )}
              <address className="mt-6 not-italic">
                <strong className="block text-gray-900 बनावट">Jaal Yantra Textiles HQ</strong>
                {contactInfoData.address?.split(',').map((line, index) => (
                  <span key={index}>{line.trim()}<br /></span>
                ))}
              </address>
              <div className="mt-8">
                <h3 className="text-xl font-semibold बनावट text-gray-900">Why Choose Jaal Yantra?</h3>
                <ul className="mt-4 list-disc space-y-2 pl-5 बनावट text-gray-600">
                  <li>Innovative and sustainable textile solutions.</li>
                  <li>Commitment to quality and craftsmanship.</li>
                  <li>Global reach with personalized local support.</li>
                  <li>Competitive pricing and flexible MOQs.</li>
                </ul>
              </div>
              <div className="mt-8 border-t border-gray-200 pt-8">
                <h3 className="text-xl font-semibold बनावट text-gray-900">Get In Touch</h3>
                <p className="mt-1 text-base text-gray-600 बनावट">
                  For inquiries, please use the form or reach out to us via phone at <a href={`tel:${contactInfoData.phone?.replace(/\s|\(|\)/g, '')}`} className="text-pink-600 hover:text-pink-500">{contactInfoData.phone}</a> or email at <a href={`mailto:${contactInfoData.email}`} className="text-pink-600 hover:text-pink-500">{contactInfoData.email}</a>.
                </p>
              </div>
            </div>

            {/* Right Column: Contact Form */}
            <div>
              <ContactForm />
            </div>
          </div>
        </Container>
      </main>
    </>
  );
}
