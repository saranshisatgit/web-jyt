import { FLAGSHIP_MOCKUP } from '@/data/solutions'
import type { SolutionBlock as SolutionBlockData } from '@/data/solutions'

/**
 * The flagship lead reel (design → publish → storefront → sold). Rendered wide,
 * with a caption, as the first important visual on the home and /solutions pages.
 */
export function FeaturedMockup() {
  return (
    <figure style={{ margin: 0 }}>
      <div className="kt-feature-shot">
        <video
          autoPlay
          loop
          muted
          playsInline
          poster={FLAGSHIP_MOCKUP.gif}
          aria-label={FLAGSHIP_MOCKUP.alt}
          style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 'var(--r-md)', border: '1px solid var(--rule)' }}
        >
          <source src={FLAGSHIP_MOCKUP.webm} type="video/webm" />
          <img src={FLAGSHIP_MOCKUP.gif} alt={FLAGSHIP_MOCKUP.alt} style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 'var(--r-md)', border: '1px solid var(--rule)' }} />
        </video>
      </div>
      <figcaption className="kt-meta" style={{ marginTop: '14px', color: 'var(--ink-mute)' }}>
        {FLAGSHIP_MOCKUP.caption}
      </figcaption>
    </figure>
  )
}

export function SolutionBlock({ block, index }: { block: SolutionBlockData; index: number }) {
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
      <div className="kt-feature-shot">
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
      </div>
    </article>
  )
}
