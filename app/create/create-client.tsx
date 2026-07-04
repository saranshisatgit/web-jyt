'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { Storefront, ProductCreate, DesignToCart } from '@/components/mockup-animations'
import type { CreateContent } from './page'

type Props = { content: CreateContent }

/* ───── MET Indian art images ───── */

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

function artFor(label: string) {
  const idx = [...label].reduce((a, c) => a + c.charCodeAt(0), 0) % INDIAN_ART.length
  return INDIAN_ART[idx]
}

/* ───── Section block ───── */

function SectionBlock({
  section,
  index,
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
      <div className={`kt-create-block-inner${reverse ? ' reverse' : ''}`}>
        <motion.div
          className="kt-create-block-text"
          initial={{ opacity: 0, x: reverse ? 40 : -40 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <span className="kt-create-tag">{section.tag}</span>
          <h2 className="kt-create-heading">{section.heading}</h2>
          <p className="kt-create-body">{section.body}</p>
        </motion.div>

        <motion.div
          className="kt-create-block-visual"
          initial={{ opacity: 0, scale: 0.92 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1], delay: 0.15 }}
        >
          <div className="kt-create-frame">
            <div className="kt-create-frame-img">
              <img src={artImage} alt="" loading="lazy" />
            </div>
            <div className="kt-create-frame-mockup">
              {mockup}
            </div>
          </div>
        </motion.div>
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
        <div className="container">
          <div className="kt-create-hero-inner">
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
            >
              <div className="kt-create-hero-eyebrow">{hero.eyebrow}</div>
              <h1 className="kt-create-hero-title">{hero.title}</h1>
              <p className="kt-create-hero-sub">{hero.subtitle}</p>
              <div className="kt-create-hero-actions">
                <Link className="kt-btn kt-btn-lg" href={hero.primaryCta.href}>
                  {hero.primaryCta.label}
                </Link>
                <Link className="kt-link" href={hero.secondaryCta.href}>
                  {hero.secondaryCta.label}
                </Link>
              </div>
            </motion.div>

            <motion.div
              className="kt-create-hero-visual"
              initial={{ opacity: 0, scale: 0.88 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1], delay: 0.2 }}
            >
              <div className="kt-create-hero-mockup">
                <DesignToCart />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ───── Sections ───── */}
      <SectionBlock
        section={sections[0]}
        index={0}
        mockup={<ProductCreate />}
        artImage={artFor(sections[0].heading)}
      />

      <SectionBlock
        section={sections[1]}
        index={1}
        mockup={<Storefront />}
        artImage={artFor(sections[1].heading)}
        reverse
      />

      <SectionBlock
        section={sections[2]}
        index={2}
        mockup={<DesignToCart />}
        artImage={artFor(sections[2].heading)}
      />

      <SectionBlock
        section={sections[3]}
        index={3}
        mockup={<ProductCreate />}
        artImage={artFor(sections[3].heading)}
        reverse
      />

      {/* ───── CTA ───── */}
      <section className="kt-create-cta">
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
              <Link className="kt-btn kt-btn-lg" href={cta.primaryCta.href}>
                {cta.primaryCta.label}
              </Link>
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
