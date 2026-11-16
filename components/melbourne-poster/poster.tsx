import type { CSSProperties } from 'react'
import { HEADER, posterTheme, type Poster, type PosterTheme } from '@/data/melbourne-posters'
import { posterDeva, posterSerif } from './fonts'
import { HouseOfHands } from './house-of-hands'
import { PosterStage } from './poster-stage'
import { SellAnywhere } from './sell-anywhere'
import { SupplyLine } from './supply-line'

export function themeVars(t: PosterTheme): CSSProperties {
  return {
    '--paper': t.paper,
    '--paper-2': t.paper2,
    '--ink': t.ink,
    '--ink-soft': t.inkSoft,
    '--ink-mute': t.inkMute,
    '--teal': t.teal,
    '--teal-deep': t.tealDeep,
    '--teal-pale': t.tealPale,
    '--rule': t.rule,
  } as CSSProperties
}

// Per-layout title sizing (layout, not content): gap above the kicker, headline size.
const TITLE: Record<Poster['layout'], { kickerGap: string; h1: string }> = {
  'house-of-hands': { kickerGap: '14mm', h1: '56mm' },
  'supply-line': { kickerGap: '13mm', h1: '48mm' },
  'sell-anywhere': { kickerGap: '11mm', h1: '48mm' },
}

function Sheet({ poster }: { poster: Poster }) {
  switch (poster.layout) {
    case 'house-of-hands':
      return <HouseOfHands poster={poster} />
    case 'supply-line':
      return <SupplyLine poster={poster} />
    case 'sell-anywhere':
      return <SellAnywhere poster={poster} />
  }
}

/** One A1 stand poster, framed for the screen and set up to print 1:1. */
export function MelbournePoster({ poster }: { poster: Poster }) {
  const title = TITLE[poster.layout]
  return (
    <>
      {/* A global rule: the printed page is the A1 sheet with no margin. */}
      <style>{`@page { size: 594mm 841mm; margin: 0; }`}</style>
      <PosterStage
        title={HEADER.brand}
        label={poster.webbar}
        pdf={poster.card.pdf}
        className={`${posterSerif.variable} ${posterDeva.variable}`}
        style={{
          ...themeVars(posterTheme(poster)),
          ['--kicker-gap' as string]: title.kickerGap,
          ['--h1-size' as string]: title.h1,
        }}
      >
        <Sheet poster={poster} />
      </PosterStage>
    </>
  )
}
