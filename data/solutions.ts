/**
 * Seed content for the /solutions page + home SolutionsShowcase (#605 — Brand
 * Positioning). The content now lives in data/solutions.json (a CMS-liftable
 * block); this file is a thin, typed re-export so every consumer keeps its
 * existing imports (SOLUTIONS_HERO, AUDIENCE_CALLOUT, SOLUTION_BLOCKS,
 * FLAGSHIP_MOCKUP, SOLUTIONS_CTA) and the SolutionBlock type.
 */
import data from './solutions.json'

export type SolutionBlock = {
  /** Stable id — also the mockup key in public/mockups/<id>.{webm,gif}. */
  id: string
  stage: string
  title: string
  /** One-paragraph lead, brand-owner POV. */
  body: string
  /** Concrete capabilities shown in the block. */
  features: string[]
  /** Mockup header asset (webm primary, gif fallback) + the source mockup. */
  mockup: {
    webm: string
    gif: string
    /** Source HTML mockup, for the live-React version of the header. */
    source: string
    alt: string
  }
}

export const SOLUTIONS_HERO = data.hero
export const AUDIENCE_CALLOUT = data.audienceCallout
export const FLAGSHIP_MOCKUP = data.flagshipMockup
export const SOLUTION_BLOCKS = data.blocks as SolutionBlock[]
export const SOLUTIONS_CTA = data.cta
