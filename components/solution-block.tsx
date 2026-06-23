'use client'

import { FLAGSHIP_MOCKUP } from '@/data/solutions'
import type { SolutionBlock as SolutionBlockData } from '@/data/solutions'
import { DesignToCart, MOCKUP_ANIMATIONS } from './mockup-animations'

/**
 * The flagship lead visual (design → publish → storefront → sold), as a LIVE
 * React animation (themed, crisp, theme-aware) — not the baked gif/webm. The
 * design-to-cart-mockup.html + public/mockups/* assets are kept as the
 * content source-of-truth / pipeline fallback.
 */
export function FeaturedMockup() {
  return (
    <figure style={{ margin: 0 }}>
      <DesignToCart />
      <figcaption className="kt-meta" style={{ marginTop: '14px', color: 'var(--ink-mute)' }}>
        {FLAGSHIP_MOCKUP.caption}
      </figcaption>
    </figure>
  )
}

export function SolutionBlock({ block, index }: { block: SolutionBlockData; index: number }) {
  const Animation = MOCKUP_ANIMATIONS[block.id]
  return (
    <article className="kt-feature-row" data-flip={index % 2 === 1 ? 'true' : undefined}>
      <div className="kt-feature-copy">
        <div className="kt-meta" style={{ color: 'var(--accent-deep)' }}>
          {block.stage}
        </div>
        <h3 className="kt-display s" style={{ marginTop: '12px' }}>{block.title}</h3>
        <p className="muted" style={{ fontSize: '17px', lineHeight: 1.55, marginTop: '16px' }}>
          {block.body}
        </p>
        <ul className="kt-dash-list" style={{ marginTop: '20px' }}>
          {block.features.map((f) => (<li key={f}>{f}</li>))}
        </ul>
      </div>
      {/* The live animation brings its own frame + step pips, so neutralise the
          .kt-feature-shot card styling (its overflow:hidden would clip the pips).
          Keep the class for the row's flip ordering. */}
      <div
        className="kt-feature-shot"
        style={Animation ? { background: 'transparent', boxShadow: 'none', overflow: 'visible', borderRadius: 0 } : undefined}
      >
        {Animation ? (
          <Animation />
        ) : (
          <video
            autoPlay
            loop
            muted
            playsInline
            poster={block.mockup.gif}
            style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 'var(--r-md)', border: '1px solid var(--rule)' }}
          >
            <source src={block.mockup.webm} type="video/webm" />
            <img src={block.mockup.gif} alt={block.mockup.alt} style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 'var(--r-md)', border: '1px solid var(--rule)' }} />
          </video>
        )}
      </div>
    </article>
  )
}
