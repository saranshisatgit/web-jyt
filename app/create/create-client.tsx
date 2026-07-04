'use client'

import { useRef, type ReactNode } from 'react'
import Link from 'next/link'
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion'
import { Storefront, ProductCreate, DesignToCart } from '@/components/mockup-animations'
import { ScenePlayer, Check } from '@/components/mockup-kit'
import type { CreateContent } from './page'

type Props = { content: CreateContent }

/* ───── MET Indian art ───── */

const INDIAN_ART = [
  'https://images.metmuseum.org/CRDImages/as/original/DP356033.jpg',
  'https://images.metmuseum.org/CRDImages/as/original/DP334048.jpg',
  'https://images.metmuseum.org/CRDImages/as/original/DP152309.jpg',
  'https://images.metmuseum.org/CRDImages/as/original/DP154823.jpg',
  'https://images.metmuseum.org/CRDImages/as/original/DP154824.jpg',
  'https://images.metmuseum.org/CRDImages/as/original/DP334027.jpg',
  'https://images.metmuseum.org/CRDImages/as/original/CI41.10.5.jpg',
  'https://images.metmuseum.org/CRDImages/ep/original/DP-41223-001.jpg',
  'https://images.metmuseum.org/CRDImages/ep/original/DP-42549-001.jpg',
]

/* ───── Word reveal ───── */

function WordReveal({ text }: { text: string }) {
  const words = text.split(' ')
  return (
    <span style={{ display: 'inline-flex', flexWrap: 'wrap', gap: '0.18em' }}>
      {words.map((w, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 28, rotateX: 15 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 0.65, ease: [0.12, 0.74, 0.22, 1], delay: 0.1 + i * 0.07 }}
          style={{ display: 'inline-block', perspective: 600 }}
        >
          {w}{i < words.length - 1 ? '\u00A0' : ''}
        </motion.span>
      ))}
    </span>
  )
}

/* ───── Gallery wall ───── */

const FLOATS = [
  { x: '0%', y: '0%', w: '31%', r: -2.3, d: 3.0, dx: 0, s: 1.0 },
  { x: '34%', y: '-2%', w: '31%', r: 1.8, d: 3.8, dx: 1, s: 1.02 },
  { x: '68%', y: '1%', w: '31%', r: -1.1, d: 2.6, dx: 0, s: 0.98 },
  { x: '1%', y: '33%', w: '28%', r: 2.7, d: 4.2, dx: -1, s: 1.01 },
  { x: '32%', y: '34%', w: '34%', r: -0.5, d: 3.4, dx: 0, s: 1.0 },
  { x: '69%', y: '32%', w: '28%', r: 1.4, d: 2.8, dx: 1, s: 0.99 },
  { x: '-1%', y: '65%', w: '31%', r: -1.9, d: 3.6, dx: 0, s: 1.01 },
  { x: '34%', y: '66%', w: '31%', r: 2.2, d: 3.2, dx: -1, s: 0.97 },
  { x: '68%', y: '67%', w: '31%', r: -1.6, d: 4.0, dx: 1, s: 1.02 },
]

function GalleryWall() {
  return (
    <div className="kt-gallery-wall">
      {INDIAN_ART.map((src, i) => {
        const f = FLOATS[i]
        return (
          <motion.div
            key={src}
            className="kt-gallery-tile"
            style={{ left: f.x, top: f.y, width: f.w, rotate: `${f.r}deg` }}
            animate={{
              y: [0, -8, 0],
              x: [0, f.dx, 0],
              scale: [f.s, f.s + 0.02, f.s],
            }}
            transition={{
              duration: f.d,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.35,
            }}
          >
            <img src={src} alt="" loading="lazy" />
            <div className="kt-gallery-tile-shine" />
          </motion.div>
        )
      })}
    </div>
  )
}

/* ───── Hero Making Player ───── */

const makingScenes = [
  {
    label: 'Inspire',
    render: () => (
      <div className="kt-making-card">
        <div className="kt-making-label">01 · Inspire</div>
        <p className="kt-making-title">From the art that moves you</p>
        <div style={{ display: 'flex', gap: 8, margin: '12px 0 16px' }}>
          <span className="kt-making-chip">Miniature</span>
          <span className="kt-making-chip">Textile</span>
          <span className="kt-making-chip">Mughal</span>
        </div>
        <p className="kt-making-desc">AI reads palette, motif, and mood — drafts a product brief in seconds.</p>
      </div>
    ),
  },
  {
    label: 'Design',
    render: () => (
      <div className="kt-making-card">
        <div className="kt-making-label">02 · Design</div>
        <p className="kt-making-title">Your product takes shape</p>
        <div style={{ display: 'flex', gap: 12, margin: '14px 0' }}>
          <div className="kt-making-swatch" style={{ background: 'oklch(65% 0.12 35)' }} />
          <div className="kt-making-swatch" style={{ background: 'oklch(55% 0.1 250)' }} />
          <div className="kt-making-swatch" style={{ background: 'oklch(70% 0.08 145)' }} />
        </div>
        <p className="kt-making-desc">Palette extracted, motif adapted, dimensions and material lot assigned.</p>
      </div>
    ),
  },
  {
    label: 'Craft',
    render: () => (
      <div className="kt-making-card">
        <div className="kt-making-label">03 · Craft</div>
        <p className="kt-making-title">Handmade by master artisans</p>
        <div className="kt-making-dots">
          <span className="kt-making-dot fill" />
          <span className="kt-making-dot fill" />
          <span className="kt-making-dot fill" />
          <span className="kt-making-dot" />
        </div>
        <p className="kt-making-desc" style={{ marginTop: 8 }}>Dye → Weave → Finish → QC. Track every stage from loom to doorstep.</p>
      </div>
    ),
  },
  {
    label: 'Package',
    render: () => (
      <div className="kt-making-card">
        <div className="kt-making-label">04 · Package</div>
        <p className="kt-making-title">Wrapped with care</p>
        <div className="kt-making-box-row">
          <span className="kt-making-box-icon">▣</span>
          <div style={{ flex: 1 }}>
            <div className="kt-making-box-label">Custom packaging</div>
            <div className="kt-making-box-sub">FSC-certified · muslin wrap</div>
          </div>
          <Check size={16} />
        </div>
        <p className="kt-making-desc">Digital Product Passport included — materials, maker, journey in a tag.</p>
      </div>
    ),
  },
  {
    label: 'Ship',
    render: () => (
      <div className="kt-making-card">
        <div className="kt-making-label">05 · Ship</div>
        <p className="kt-making-title">On its way to you</p>
        <div className="kt-making-bar-track">
          <span>Artisan</span><span>Hub</span><span>You</span>
        </div>
        <div className="kt-making-bar">
          <motion.div
            className="kt-making-bar-fill"
            initial={{ width: '0%' }}
            animate={{ width: '72%' }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          />
        </div>
        <p className="kt-making-desc" style={{ marginTop: 8 }}>Carbon-neutral shipping. Full provenance on the receipt.</p>
      </div>
    ),
  },
]

function HeroMaking() {
  return (
    <div className="kt-hero-making">
      <ScenePlayer holdMs={[3200, 3200, 3600, 3200, 3600]} scenes={makingScenes} />
    </div>
  )
}

/* ───── Magnetic button ───── */

function MagneticBtn({ children, href, className = 'kt-btn kt-btn-lg' }: { children: ReactNode; href: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 300, damping: 18 })
  const springY = useSpring(y, { stiffness: 300, damping: 18 })

  function handleMouse(e: React.MouseEvent) {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    x.set((e.clientX - cx) * 0.18)
    y.set((e.clientY - cy) * 0.18)
  }

  function handleLeave() {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      style={{ x: springX, y: springY, display: 'inline-block' }}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
    >
      <Link href={href} className={className}>
        {children}
      </Link>
    </motion.div>
  )
}

/* ───── Bento Grid ───── */

const CAPABILITIES = [
  { title: 'Textile & Fabric', desc: 'Handwoven cotton, silk, pashmina — build products from artisan materials.', hue: 40 },
  { title: 'Home & Living', desc: 'Cushions, throws, tapestries. Extend handloom into every room.', hue: 150 },
  { title: 'Accessories', desc: 'Scarves, stoles, wraps. Small format, big detail — ideal for sampling motifs.', hue: 250 },
  { title: 'Bespoke', desc: 'Custom runs, private labels, B2B. Start from a painting, deliver in bulk.', hue: 20 },
]

function BentoGrid() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px 0px' })

  return (
    <section className="kt-bento" ref={ref}>
      <div className="container">
        <motion.div
          className="kt-bento-head"
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <span className="kt-create-tag">What you can create</span>
          <h2 className="kt-bento-title">Everything starts with the&nbsp;loom</h2>
        </motion.div>
        <div className="kt-bento-grid">
          {CAPABILITIES.map((c, i) => (
            <motion.div
              key={c.title}
              className="kt-bento-card"
              initial={{ opacity: 0, y: 32 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.08, ease: [0.2, 0.8, 0.2, 1] }}
              whileHover={{ y: -6, scale: 1.02 }}
            >
              <div className="kt-bento-card-hue" style={{ background: `oklch(70% 0.08 ${c.hue})` }} />
              <h3 className="kt-bento-card-title">{c.title}</h3>
              <p className="kt-bento-card-desc">{c.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ───── Scroll section ───── */

function SectionBlock({
  section,
  mockup,
  artImage,
  reverse,
}: {
  section: CreateContent['sections'][0]
  index: number
  mockup: React.ReactNode
  artImage: string
  reverse?: boolean
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px 0px' })

  return (
    <section id={section.id} className="kt-create-block" ref={ref}>
      <div className="container">
        <div className={`kt-create-block-inner${reverse ? ' reverse' : ''}`}>
          <motion.div
            className="kt-create-block-text"
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <span className="kt-create-tag">{section.tag}</span>
            <h2 className="kt-create-heading">{section.heading}</h2>
            <p className="kt-create-body">{section.body}</p>
          </motion.div>

          <motion.div
            className="kt-create-block-visual"
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={inView ? { opacity: 1, scale: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1], delay: 0.15 }}
          >
            <div className="kt-create-frame">
              <motion.div
                className="kt-create-frame-img"
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              >
                <img src={artImage} alt="" loading="lazy" />
              </motion.div>
              <motion.div
                className="kt-create-frame-mockup"
                initial={{ y: 20, opacity: 0 }}
                animate={inView ? { y: 0, opacity: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
              >
                {mockup}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

/* ───── Page ───── */

export default function CreateClient({ content }: Props) {
  const { hero, sections, cta } = content

  return (
    <>
      {/* ───── Hero ───── */}
      <section className="kt-create-hero">
        <div className="kt-create-hero-glow" />
        <div className="container">
          <div className="kt-create-hero-inner">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
            >
              <motion.div
                className="kt-create-hero-eyebrow"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {hero.eyebrow}
              </motion.div>
              <h1 className="kt-create-hero-title">
                <WordReveal text={hero.title} />
              </h1>
              <motion.p
                className="kt-create-hero-sub"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                {hero.subtitle}
              </motion.p>
              <motion.div
                className="kt-create-hero-actions"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.65 }}
              >
                <MagneticBtn href={hero.primaryCta.href}>
                  {hero.primaryCta.label}
                </MagneticBtn>
                <Link className="kt-link" href={hero.secondaryCta.href}>
                  {hero.secondaryCta.label}
                </Link>
              </motion.div>
            </motion.div>

            <motion.div
              className="kt-create-hero-visual"
              initial={{ opacity: 0, scale: 0.88 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, ease: [0.12, 0.74, 0.22, 1], delay: 0.3 }}
            >
              <div className="kt-gallery-arena">
                <GalleryWall />
                <div className="kt-gallery-player-wrap">
                  <HeroMaking />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ───── Bento Grid ───── */}
      <BentoGrid />

      {/* ───── Sections ───── */}
      <SectionBlock
        section={sections[0]}
        index={0}
        mockup={<ProductCreate />}
        artImage={INDIAN_ART[0]}
      />

      <SectionBlock
        section={sections[1]}
        index={1}
        mockup={<Storefront />}
        artImage={INDIAN_ART[2]}
        reverse
      />

      <SectionBlock
        section={sections[2]}
        index={2}
        mockup={<DesignToCart />}
        artImage={INDIAN_ART[4]}
      />

      <SectionBlock
        section={sections[3]}
        index={3}
        mockup={<ProductCreate />}
        artImage={INDIAN_ART[6]}
        reverse
      />

      {/* ───── CTA ───── */}
      <section className="kt-create-cta">
        <div className="kt-create-cta-glow" />
        <div className="container">
          <motion.div
            className="kt-create-cta-inner"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px 0px' }}
            transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <div>
              <h2>{cta.title}</h2>
              <p>{cta.body}</p>
            </div>
            <div className="kt-create-cta-actions">
              <MagneticBtn href={cta.primaryCta.href}>
                {cta.primaryCta.label}
              </MagneticBtn>
              <Link className="kt-link" href={cta.secondaryCta.href}>
                {cta.secondaryCta.label}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
