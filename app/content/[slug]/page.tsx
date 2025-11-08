import { type Metadata } from 'next'
import { Container } from '@/components/container'
import { GradientBackground } from '@/components/gradient'
import { HeroSection, type HeaderBlock, type AnnouncementBlock } from '@/components/hero-section'
import { MainContent, type MainContentBlock } from '@/components/main-content'
import { fetchPageAndFooter } from '@/app/actions'
import { getBlockByName, type Block } from '@/medu/queries'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

type PageParams = Promise<{ slug: string }>

/**
 * Generate metadata for the content page
 */
export async function generateMetadata({ params }: { params: PageParams }): Promise<Metadata> {
  const { slug } = await params
  
  try {
    const pageData = await fetchPageAndFooter(slug)
    const headerBlock = getBlockByName(pageData.page?.blocks, 'Header') as Block | undefined

    const title = (headerBlock?.content?.title as string) || 'Content Page'
    const description = (headerBlock?.content?.subtitle as string) || 'Jaal Yantra Textiles content page'

    return {
      title,
      description,
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
    return {
      title: 'Content Page',
      description: 'Jaal Yantra Textiles content page',
    }
  }
}

/**
 * Generic Content Page Component
 * 
 * This component creates a reusable template for displaying textual content
 * like privacy policies, terms of service, and other static pages.
 * 
 * Features:
 * - Dynamic routing based on slug
 * - Fetches content from CMS
 * - Consistent header/footer design
 * - Responsive layout
 * - Prose styling for beautiful typography
 * 
 * CMS Block Structure Required:
 * 1. Header Block: Contains title, subtitle, announcement
 * 2. MainContent Block: Contains the actual content
 * 
 * @example
 * URL: /content/privacy-policy
 * Fetches: Page with slug "privacy-policy"
 * Renders: Header + MainContent + Footer
 */
export default async function ContentPage({ params }: { params: PageParams }) {
  const { slug } = await params

  try {
    // Fetch page data and footer in parallel
    const commonData = await fetchPageAndFooter(slug)

    if (!commonData || !commonData.page) {
      notFound()
    }

    const pageData = commonData.page

    // Extract blocks from CMS
    const cmsHeaderBlock = getBlockByName(pageData.blocks, 'Header') as Block | undefined
    const cmsMainContentBlock = getBlockByName(pageData.blocks, 'MainContent') as MainContentBlock | undefined

    // If no content block found, show error
    if (!cmsMainContentBlock) {
      return (
        <main className="overflow-hidden">
          <GradientBackground />
          <Container className="py-16">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900">Content Not Found</h1>
              <p className="mt-4 text-gray-600">
                The content for this page is not available. Please check back later.
              </p>
            </div>
          </Container>
        </main>
      )
    }

    // Prepare header block for HeroSection
    const heroHeaderBlock: HeaderBlock = {
      content: {
        title: (cmsHeaderBlock?.content?.title as string) || 'Content Page',
        subtitle: (cmsHeaderBlock?.content?.subtitle as string) || '',
        announcement: (cmsHeaderBlock?.content?.announcement as string) || '',
        buttons: [], // No buttons for content pages
      },
    }

    const heroAnnouncementBlock: AnnouncementBlock = {
      content: {
        announcement: (cmsHeaderBlock?.content?.announcement as string) || '',
      },
    }

    return (
      <main className="overflow-hidden">
        <GradientBackground />
        
        {/* Hero Section with Navbar */}
        <HeroSection 
          headerBlock={heroHeaderBlock} 
          announcementBlock={heroAnnouncementBlock} 
        />

        {/* Main Content Section */}
        <MainContent block={cmsMainContentBlock} />
      </main>
    )
  } catch (error) {
    console.error('Error loading content page:', error)
    
    return (
      <main className="overflow-hidden">
        <GradientBackground />
        <Container className="py-16">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Error Loading Page</h1>
            <p className="mt-4 text-gray-600">
              We encountered an error while loading this page. Please try again later.
            </p>
          </div>
        </Container>
      </main>
    )
  }
}
