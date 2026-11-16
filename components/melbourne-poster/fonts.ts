import { Instrument_Serif, Tiro_Devanagari_Hindi } from 'next/font/google'

// The posters' own faces, scoped to the poster pages (the site's sans, Rethink
// Sans, comes from the root layout as --font-sans).
export const posterSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--p-serif',
  display: 'swap',
})

export const posterDeva = Tiro_Devanagari_Hindi({
  subsets: ['devanagari', 'latin'],
  weight: '400',
  variable: '--p-deva',
  display: 'swap',
})
