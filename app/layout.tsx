import '@/styles/globals.css'
import type { Metadata } from 'next'
import { Rethink_Sans, JetBrains_Mono } from 'next/font/google'
import localFont from 'next/font/local'
import { headers } from 'next/headers'
import { brandFromKey, type BrandConfig } from '@/lib/brand'
import { brandMetadata } from '@/lib/brand-metadata'
import { currencyFromCode } from '@/lib/currency'
import { DEFAULT_LOCALE, LOCALES, COOKIE_NAME } from '@/lib/i18n/config'
import { loadTranslations } from '@/lib/i18n/translations'
import type { LocaleCode } from '@/lib/i18n/config'
import { ApiQueryClientProvider } from './context/api-context'
import { BrandProvider } from './context/brand-context'
import { CurrencyProvider } from './context/currency-context'
import { ModeProvider } from './context/mode-context'
import { VisualEditorProvider } from './context/visual-editor-context'
import { LocaleProvider } from './context/locale-context'
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

// Display serif — "PS Times" (round.ai's face), self-hosted, Regular only.
// No italic weight exists: the "accent word" is rendered by COLOR, not italic.
const psTimes = localFont({
  src: '../public/fonts/PSTimesTrial-Regular.otf',
  weight: '400',
  style: 'normal',
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

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers()
  const brand = brandFromKey(headersList.get('x-brand'))
  return brandMetadata(brand)
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const headersList = await headers()
  const brandKey = headersList.get('x-brand')
  const brand = brandFromKey(brandKey)
  const currency = currencyFromCode(headersList.get('x-currency'))

  const locale = (headersList.get('x-locale') as LocaleCode) || DEFAULT_LOCALE
  const messages = await loadTranslations(locale)

  return (
    <ApiQueryClientProvider>
      <html
        lang={locale}
        className={`${rethinkSans.variable} ${psTimes.variable} ${jetbrainsMono.variable}`}
      >
        <head>
          <link
            rel="alternate"
            type="application/rss+xml"
            title={`The ${brand.shortName} Blog`}
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
                name: brand.seo.name,
                url: `https://www.${brand.seo.domain}`,
                logo: `https://www.${brand.seo.domain}/favicon.ico`,
                description: brand.seo.description,
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
              <LocaleProvider initialLocale={locale} initialMessages={messages}>
                <main className="relative">{children}</main>
                <Footer />
                <ForkOverlay />
                <BlueprintGrid />
                <InvestorPrintButton />
              </LocaleProvider>
              </VisualEditorProvider>
              </ModeProvider>
            </CurrencyProvider>
          </BrandProvider>
        </body>
      </html>
    </ApiQueryClientProvider>
  )
}
