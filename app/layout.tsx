import '@/styles/tailwind.css'
import type { Metadata } from 'next'
import { ApiQueryClientProvider } from './context/api-context'
import { getFooter } from './actions'
import { Footer } from '@/components/footer'


export const metadata: Metadata = {
  title: {
    template: '%s - Jaal Yantra Textiles',
    default: 'JYT - Close every gap',
  },
}


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const footerBlock = await getFooter()
  if (!footerBlock) return <div>No footer block found</div>
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
      </head>
      <body className="text-gray-950 antialiased">
        <main>{children}</main>
        <Footer data={footerBlock.content} />
      </body>
     
    </html>
    </ApiQueryClientProvider>
  )
}
