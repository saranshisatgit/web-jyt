'use client'

// The page styles travel WITH the component — any route that renders
// VessaHome (home + /vessa) gets them, not just the page that first
// imported it.
import '@/styles/vessa-home.css'

import { useEffect, useRef, useState, type CSSProperties } from 'react'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { Button } from '@medusajs/ui'
import { ArrowRight, TriangleRightMini, CheckCircleMiniSolid } from '@medusajs/icons'
import { JourneyPixelDraw } from '@/components/journey-pixel-draw'
import { VessaNavbar, type VessaNavItem } from '@/components/vessa-navbar'
import { MobileNavDrawer, type NavTreeItem } from '@/components/mobile-nav-drawer'
import { MoonPhase } from '@/components/moon-phase'
import homeBlocks from '@/data/home-blocks.json'

/**
 * VESSA-STYLE HOME — a clean SaaS landing layout applied to the brand
 * content. Buttons are real Medusa UI <Button> (primary/secondary) and glyphs
 * come from @medusajs/icons. Layout, hairlines and the pixelated dither live
 * in styles/vessa-home.css (scoped under `.vh`). ALL section content —
 * hero, trace, how, bento, brands, pricing, capture, faq, plate, journey,
 * both mega menus and the pixelation imagery — is data from
 * data/home-blocks.json (push it to the CMS with scripts/push-home-blocks.mjs).
 */

type HeroVideo = { url: string; mime_type?: string; width?: number; height?: number; alt: string; credit: string | null }
type HeroMediaResponse = { videos: HeroVideo[] }

function useHeroVideos() {
  return useQuery<HeroMediaResponse>({
    queryKey: ['hero-media'],
    queryFn: async () => {
      const res = await fetch('/api/hero-media')
      if (!res.ok) return { videos: [] }
      return (await res.json()) as HeroMediaResponse
    },
    staleTime: 60_000,
  })
}

// Section content — straight from the JSON blocks.
const HERO = homeBlocks.hero
const TRACE_BLOCK = homeBlocks.trace
const TRACE = TRACE_BLOCK.items
const HOW = homeBlocks.how
const SURFACES = HOW.surfaces
const BENTO = homeBlocks.bento
const BRANDS_BLOCK = homeBlocks.brands
const BRANDS = BRANDS_BLOCK.testimonials
const PRICING = homeBlocks.pricing
const CAPTURE = homeBlocks.capture
const FAQ_BLOCK = homeBlocks.faq
const FAQS = FAQ_BLOCK.items
const PLATE = homeBlocks.plate

// Journey steps — the sketch → shipment strip, from the JSON blocks.
const STEPS = homeBlocks.journey

// /vessa navbar CTAs live in the shared VessaNavbar's right slot.

export function VessaHome() {
  const [active, setActive] = useState(0)
  const [traceIdx, setTraceIdx] = useState(0)
  const traceHover = useRef(false)
  const [journeyIdx, setJourneyIdx] = useState(0)
  const journeyHover = useRef(false)
  const [menuOpen, setMenuOpen] = useState(false)

  // navbar items for the home landing — Solutions scrolls to the how-it-works
  // section and opens the mega menu; Compare / Journal / About route to
  // their real pages, with About opening its own mega menu.
  const navItems: VessaNavItem[] = [
    { href: '#how', label: 'Solutions', mega: 'solutions' },
    { href: '/compare', label: 'Compare' },
    { href: '/blog', label: 'Journal' },
    { href: '/about', label: 'About', mega: 'about' },
  ]

  // Mobile drawer tree — same entries with the mega-menu pages nested
  // under Solutions / About, plus Sign in (hidden from the bar on phones).
  const mobileItems: NavTreeItem[] = [
    {
      href: '#how',
      label: 'Solutions',
      children: homeBlocks.megaMenu.map((m) => ({ href: m.href, label: m.title })),
    },
    { href: '/compare', label: 'Compare' },
    { href: '/blog', label: 'Journal' },
    {
      href: '/about',
      label: 'About',
      children: homeBlocks.aboutMenu.map((m) => ({ href: m.href, label: m.title })),
    },
    { href: '/login', label: 'Sign in' },
  ]

  // auto-cycle the who/where/how trace terms (pauses on hover)
  useEffect(() => {
    const id = setInterval(() => {
      if (!traceHover.current) setTraceIdx((i) => (i + 1) % TRACE.length)
    }, 3200)
    return () => clearInterval(id)
  }, [])

  // auto-cycle the journey steps in the bento (pauses on hover)
  useEffect(() => {
    const id = setInterval(() => {
      if (!journeyHover.current) setJourneyIdx((i) => (i + 1) % STEPS.length)
    }, 2600)
    return () => clearInterval(id)
  }, [])

  // Hero video (same /api/hero-media feed the current home page plays).
  const { data: heroMedia } = useHeroVideos()
  const videos = heroMedia?.videos ?? []
  const hasVideo = videos.length > 0
  const videoRef = useRef<HTMLVideoElement>(null)
  const [idx, setIdx] = useState(0)
  useEffect(() => setIdx(0), [videos.length])
  const current = videos[Math.min(idx, videos.length - 1)]
  const onEnded = () => {
    if (videos.length > 1) setIdx((i) => (i + 1) % videos.length)
  }
  const sourceType = (current?.mime_type || 'video/mp4').replace(/video\/(x-)?m4v$/i, 'video/mp4')

  // pixelated dither texture, injected once (client-only)
  useEffect(() => {
    const c = document.createElement('canvas')
    c.width = c.height = 64
    const ctx = c.getContext('2d')
    if (ctx) {
      const img = ctx.createImageData(64, 64)
      for (let i = 0; i < img.data.length; i += 4) {
        const v = (Math.random() * 255) | 0
        img.data[i] = img.data[i + 1] = img.data[i + 2] = v
        img.data[i + 3] = 255
      }
      ctx.putImageData(img, 0, 0)
      document.documentElement.style.setProperty('--vh-dither', `url(${c.toDataURL()})`)
    }
  }, [])

  const s = SURFACES[active]

  return (
    <div className="vh">
      <div className="top-glow" aria-hidden />
      <MoonPhase />

      {/* header — the shared vessa chrome (bar + Solutions mega menu) */}
      <VessaNavbar
        items={navItems}
        right={
          <>
            <Button asChild variant="transparent" size="small" className="vc-hide-mobile">
              <Link href="/login">Sign in</Link>
            </Button>
            <Button asChild variant="primary" size="small">
              <Link href="#demo">Get a demo</Link>
            </Button>
            <button
              type="button"
              className={menuOpen ? 'kt-hamburger is-open' : 'kt-hamburger'}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              aria-controls="kt-mobile-drawer"
              onClick={() => setMenuOpen((v) => !v)}
            >
              <span />
              <span />
              <span />
            </button>
          </>
        }
      />
      <MobileNavDrawer open={menuOpen} onClose={() => setMenuOpen(false)} items={mobileItems} />

      <div className="vh-main">
        {/* hero */}
        <section className={`hero${hasVideo ? ' has-video' : ''}`}>
          {hasVideo && current && (
            <>
              <video
                key={current.url}
                ref={videoRef}
                className="vh-hero-video"
                autoPlay
                muted
                playsInline
                loop={videos.length === 1}
                onEnded={onEnded}
                poster=""
                aria-hidden
              >
                <source src={current.url} type={sourceType} />
              </video>
              <div className="vh-hero-scrim" aria-hidden />
            </>
          )}
          <div className="wrap">
            <div className="hero-copy">
              <span className="hero-pill">
                <span className="live" aria-hidden />
                {HERO.pill}
              </span>
              <h1 className="hero-title">{HERO.title}</h1>
              <p className="hero-sub" dangerouslySetInnerHTML={{ __html: HERO.subtitleHtml }} />
              <div className="hero-cta">
                <Button asChild variant="primary" size="large">
                  <Link href={HERO.ctaPrimary.href}>{HERO.ctaPrimary.label}</Link>
                </Button>
                <Button asChild variant="secondary" size="large">
                  <Link href={HERO.ctaSecondary.href}>
                    {HERO.ctaSecondary.label}
                    <ArrowRight />
                  </Link>
                </Button>
              </div>
              <p className="hero-note">{HERO.note}</p>
              <div className="hero-proof">
                {HERO.proof.map((p) => (
                  <span className="pill" key={p.value}>
                    <b>{p.value}</b> {p.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* trace — who / where / how (also the /#makers anchor the footer links to) */}
        <section className="section trace wrap hairline" id="makers">
          <div className="trace-grid">
            <div className="trace-copy">
              <div className="eyebrow">{TRACE_BLOCK.eyebrow}</div>
              <h2 className="h2">{TRACE_BLOCK.title}</h2>
              <p className="lead">{TRACE_BLOCK.lead}</p>
              <div className="trace-list" onMouseLeave={() => { traceHover.current = false }}>
                {TRACE.map((item, i) => (
                  <button
                    key={item.term}
                    type="button"
                    className={`trace-item${i === traceIdx ? ' active' : ''}`}
                    onMouseEnter={() => { traceHover.current = true; setTraceIdx(i) }}
                    onFocus={() => { traceHover.current = true; setTraceIdx(i) }}
                    onBlur={() => { traceHover.current = false }}
                  >
                    <span className="trace-item-n">{String(i + 1).padStart(2, '0')}</span>
                    <span className="trace-item-body">
                      <span className="trace-item-head">
                        <span className="trace-item-term">{item.term}</span>
                        <span className="trace-item-badge">{item.badge}</span>
                      </span>
                      <span className="trace-item-line">{item.line}</span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
            <div className="trace-demo" style={{ '--trace-rot': `${traceIdx * 120}deg` } as CSSProperties} aria-hidden>
              <div className="trace-glow" />
              <div className="mock">
                <div className="mock-bar">
                  <i /><i /><i />
                  <span className="mock-bar-badge">{TRACE[traceIdx].badge}</span>
                </div>
                <div className="mock-body">
                  {TRACE[traceIdx].rows.map(([k, v]) => (
                    <div className="row" key={k}>
                      <span className="k">{k}</span>
                      <span className="v">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
              <p className="trace-demo-detail">{TRACE[traceIdx].detail}</p>
            </div>
          </div>
        </section>

        {/* how it works (tabs) */}
        <section className="section wrap hairline" id="how">
          {/* footer links to /#how-it-works — same section, legacy anchor */}
          <span id="how-it-works" aria-hidden />
          <div className="eyebrow">{HOW.eyebrow}</div>
          <h2 className="h2">{HOW.title}</h2>
          <p className="lead">{HOW.lead}</p>

          <div className="tabbar" role="tablist" aria-label="Surfaces">
            {SURFACES.map((surf, i) => (
              <button
                key={surf.stage}
                type="button"
                className={`tabbar-btn${i === active ? ' active' : ''}`}
                onClick={() => setActive(i)}
              >
                {surf.stage}
              </button>
            ))}
          </div>

          <div className="how-stage" style={{ '--how-rot': `${active * 120}deg` } as CSSProperties}>
            <div className="how-glow" aria-hidden />
            <div className="how-shot active" key={active}>
              <div className="how-text">
                <h3>{s.title}</h3>
                <p>{s.blurb}</p>
                <ul>
                  {s.items.map((it) => (
                    <li key={it}>{it}</li>
                  ))}
                </ul>
              </div>
              <div className="how-windows" aria-hidden>
                {s.windows.map((w) => (
                  <div className="mock" key={w.title}>
                    <div className="mock-bar"><i /><i /><i /><span className="mock-title">{w.title}</span></div>
                    <div className="mock-body">
                      {w.rows.map(([k, v], i) => (
                        <div className="row" key={k}>
                          <span className="k">{k}</span>
                          <span className={i === 0 ? 'chip ok' : 'v'}>{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* bento */}
        <section className="section wrap-wide hairline" id="compare">
          <div className="wrap center">
            <div className="eyebrow">{BENTO.eyebrow}</div>
            <h2 className="h2 center">{BENTO.title}</h2>
            <p className="lead" style={{ marginLeft: 'auto', marginRight: 'auto' }}>
              {BENTO.lead}
            </p>
          </div>

          <div className="bento-grid">
            {BENTO.cells.map((cell) => (
              <div className={`cell${cell.demo === 'journey' ? ' cell--wide' : ''}`} key={cell.demo}>
                <div className="cell-demo">
                  {cell.demo === 'journey' && (
                    <div className="jwrap">
                      <JourneyPixelDraw step={journeyIdx} />
                      <div className="journey" style={{ '--j-progress': journeyIdx / (STEPS.length - 1) } as CSSProperties} aria-hidden>
                        <div className="journey-rail" />
                        {STEPS.map((st, i) => (
                          <div
                            className={`jstep${i === journeyIdx ? ' active' : ''}${i < journeyIdx ? ' done' : ''}`}
                            key={st.n}
                            onMouseEnter={() => { journeyHover.current = true; setJourneyIdx(i) }}
                            onMouseLeave={() => { journeyHover.current = false }}
                          >
                            <div className="n">{i + 1}</div>
                            <div className="l">{st.t.replace(/\.$/, '')}</div>
                            <div className="s">{st.b}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {cell.demo === 'passport' && cell.passport && (
                    <div className="passport" aria-hidden>
                      <div className="passport-head">
                        <span>{cell.passport.id}</span>
                        <span className="chip ok">{cell.passport.badge}</span>
                      </div>
                      <div className="passport-body">
                        {cell.passport.rows.map(([k, v]) => (
                          <div className="pv" key={k}>
                            <span>{k}</span>
                            <span>{v}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {cell.demo && cell.demo !== 'journey' && cell.demo !== 'passport' && (
                    <div className="mock" aria-hidden style={{ maxWidth: 420 }}>
                      <div className="mock-bar"><i /><i /><i /></div>
                      <div className="mock-body">
                        {(cell.rows ?? []).map(([k, tone, v]) => (
                          <div className="row" key={k}>
                            <span className="k">{k}</span>
                            <span className={tone === 'ok' ? 'chip ok' : tone === 'warn' ? 'chip warn' : 'v'}>{v}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div className="cell-copy">
                  <h3>{cell.title}</h3>
                  <p>{cell.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* brands */}
        <section className="section wrap hairline" id="journal">
          <div className="eyebrow">{BRANDS_BLOCK.eyebrow}</div>
          <h2 className="h2">{BRANDS_BLOCK.title}</h2>
          <div className="brands-grid">
            {BRANDS.map((b) => (
              <div className="brand-card" key={b.brand}>
                <p className="q">&ldquo;{b.quote}&rdquo;</p>
                <div className="who"><b>{b.brand}</b><span>{b.role}</span></div>
              </div>
            ))}
          </div>
        </section>

        {/* pricing */}
        <section className="section wrap hairline" id="about">
          <div className="center">
            <div className="eyebrow">{PRICING.eyebrow}</div>
            <h2 className="h2 center">{PRICING.title}</h2>
            <p className="lead" style={{ marginLeft: 'auto', marginRight: 'auto' }}>{PRICING.lead}</p>
          </div>
          <div className="pricing-grid">
            {PRICING.plans.map((plan) => (
              <div className={`plan${plan.featured ? ' featured' : ''}`} key={plan.tag}>
                <span className="tag">{plan.tag}</span>
                <h3>{plan.name}</h3>
                <div className="price">{plan.price} <span>{plan.period}</span></div>
                <p className="desc">{plan.desc}</p>
                <ul>
                  {plan.features.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
                <div className="btn-wrap">
                  <Button asChild variant={plan.cta.variant === 'primary' ? 'primary' : 'secondary'}>
                    <Link href={plan.cta.href}>{plan.cta.label}</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <p className="pricing-note">{PRICING.note}</p>
        </section>

        {/* capture */}
        <section className="section capture wrap hairline" id="waitlist">
          <div className="center">
            <div className="eyebrow">{CAPTURE.eyebrow}</div>
            <h2 className="h2 center">{CAPTURE.title}</h2>
            <p className="lead" style={{ marginLeft: 'auto', marginRight: 'auto' }}>
              {CAPTURE.lead}
            </p>
          </div>
          <form className="capture-form" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder={CAPTURE.placeholder} required />
            <Button type="submit" variant="primary">{CAPTURE.submitLabel}</Button>
          </form>
          <p className="capture-note center">{CAPTURE.note}</p>
        </section>

        {/* faq */}
        <section className="section wrap hairline">
          <div className="faq">
            <div>
              <div className="eyebrow">{FAQ_BLOCK.eyebrow}</div>
              <h2 className="h2">{FAQ_BLOCK.title}</h2>
            </div>
            <div>
              {FAQS.map((f) => (
                <details key={f.q}>
                  <summary>{f.q}</summary>
                  <p className="a">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* close plate */}
        <section className="section wrap" id="demo">
          <div className="plate">
            <div className="dither" aria-hidden />
            <div className="inner">
              <div className="eyebrow">{PLATE.eyebrow}</div>
              <h2>{PLATE.title}</h2>
              <p>{PLATE.body}</p>
              <div className="hero-cta">
                <Button asChild variant="primary" size="large">
                  <Link href={PLATE.ctaPrimary.href}>
                    {PLATE.ctaPrimary.label}
                    <CheckCircleMiniSolid />
                  </Link>
                </Button>
                <Button asChild variant="secondary" size="large">
                  <Link href={PLATE.ctaSecondary.href}>
                    {PLATE.ctaSecondary.label}
                    <TriangleRightMini />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}