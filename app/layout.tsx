import '@/styles/globals.css'
import type { Metadata } from 'next'
import { ApiQueryClientProvider } from './context/api-context'
import { SiteDataProvider } from './context/site-data-context'
import { getSiteData } from './site-data'
import { Footer } from '@/components/footer'
import { Spinner } from '@/components/spinner'
import { cache } from 'react'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: {
    template: '%s - Jaal Yantra Textiles',
    default: 'JYT - Close every gap',
  },
}

// Create a cached version of the data fetching function
const getCachedSiteData = cache(async () => {
  return await getSiteData()
})

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const siteData = await getCachedSiteData()
  if (!siteData.footerBlock) return <Spinner size="lg" />
  
  return (
    <ApiQueryClientProvider>
      <html lang="en">
        <head>
          <link
            rel="stylesheet"
            href="https://api.fontshare.com/css?f%5B%5D=switzer@400,500,600,700&amp;display=swap"
          />
          <link
            rel="alternate"
            type="application/rss+xml"
            title="The JYT Blog"
            href="/blog/feed.xml"
          />
          {/* JYT Analytics - Production */}
          <script 
            src="https://automatic.jaalyantra.com/analytics.min.js" 
            data-website-id="01JRTP1DETZ58GHJGMZ604PREH"
            defer
          />
        </head>
        <body className="text-gray-950 antialiased">
          <SiteDataProvider value={{ navBlock: siteData.navBlock }}>
            <main>{children}</main>
            <Footer data={siteData.footerBlock.content} />
          </SiteDataProvider>
        </body>
      </html>
    </ApiQueryClientProvider>
  )
}
