import '@/styles/globals.css'
import type { Metadata } from 'next'
import { ApiQueryClientProvider } from './context/api-context'
import { getFooter } from './actions'
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
const getCachedFooter = cache(async () => {
  return await getFooter();
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Use the cached function to fetch footer data
  const footerBlock = await getCachedFooter();
  if (!footerBlock) return <Spinner size="lg" />
  
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
          <script defer data-domain="jaalyantra.com" src="https://analytics.jaalyantra.com/js/script.file-downloads.hash.outbound-links.pageview-props.tagged-events.js"></script>
          <script dangerouslySetInnerHTML={{
            __html: 'window.plausible = window.plausible || function() { (window.plausible.q = window.plausible.q || []).push(arguments) }'
          }} />
        </head>
        <body className="text-gray-950 antialiased">
          <main>{children}</main>
          <Footer data={footerBlock.content} />
        </body>
      </html>
    </ApiQueryClientProvider>
  )
}
