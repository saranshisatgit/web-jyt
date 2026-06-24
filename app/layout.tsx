import '@/styles/globals.css'
import type { Metadata } from 'next'
import { Rethink_Sans, Instrument_Serif, JetBrains_Mono } from 'next/font/google'
import { headers } from 'next/headers'
import { brandFromKey } from '@/lib/brand'
import { currencyFromCode } from '@/lib/currency'
import { ApiQueryClientProvider } from './context/api-context'
import { BrandProvider } from './context/brand-context'
import { CurrencyProvider } from './context/currency-context'
import { ModeProvider } from './context/mode-context'
import { VisualEditorProvider } from './context/visual-editor-context'
import { Footer } from '@/components/footer'
import { ForkOverlay } from '@/components/fork-overlay'
import { BlueprintGrid } from '@/components/blueprint-grid'
import { InvestorPrintButton } from '@/components/investor-print-button'

const rethinkSans = Rethink_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
})

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
})

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: {
    template: '%s - Jaal Yantra Textiles',
    default: 'JYT - Close every gap',
  },
  description:
    'A garment with provenance, made by hands you can name. JYT is the production OS for fashion — design, produce, and sell with verifiable traceability.',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    siteName: 'Jaal Yantra Textiles',
    title: 'JYT - Close every gap',
    description:
      'A garment with provenance, made by hands you can name. JYT is the production OS for fashion — design, produce, and sell with verifiable traceability.',
    images: [{ url: 'https://www.jaalyantra.com/opengraph-image', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JYT - Close every gap',
    description:
      'A garment with provenance, made by hands you can name. JYT is the production OS for fashion — design, produce, and sell with verifiable traceability.',
    images: ['https://www.jaalyantra.com/opengraph-image'],
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const headersList = await headers()
  const brand = brandFromKey(headersList.get('x-brand'))
  const currency = currencyFromCode(headersList.get('x-currency'))

  return (
    <ApiQueryClientProvider>
      <html
        lang="en"
        className={`${rethinkSans.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable}`}
      >
        <head>
          <link
            rel="alternate"
            type="application/rss+xml"
            title="The JYT Blog"
            href="/blog/feed.xml"
          />
          <link rel="icon" href="/favicon.ico" sizes="any" />
          {/* JYT Analytics - Production */}
          <script
            src="https://automatic.jaalyantra.com/analytics.min.js"
            data-website-id="01JRTP1DETZ58GHJGMZ604PREH"
            defer
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'Organization',
                name: 'Jaal Yantra Textiles',
                url: 'https://www.jaalyantra.com',
                logo: 'https://www.jaalyantra.com/favicon.ico',
                description:
                  'A garment with provenance, made by hands you can name. Production OS for fashion — design, produce, and sell with verifiable traceability.',
                foundingYear: '2025',
                location: { '@type': 'Place', address: { '@type': 'PostalAddress', addressLocality: 'Dharamshala', addressRegion: 'HP', addressCountry: 'IN' } },
                sameAs: [],
              }),
            }}
          />
        </head>
        <body className="antialiased" data-mode="consumer">
          <BrandProvider value={brand}>
            <CurrencyProvider value={currency}>
              <ModeProvider>
              <VisualEditorProvider>
                <main className="relative">{children}</main>
                <Footer />
                <ForkOverlay />
                <BlueprintGrid />
                <InvestorPrintButton />
              </VisualEditorProvider>
              </ModeProvider>
            </CurrencyProvider>
          </BrandProvider>
        </body>
      </html>
    </ApiQueryClientProvider>
  )
}
