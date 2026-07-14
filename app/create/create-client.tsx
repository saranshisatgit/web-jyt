'use client'

import Link from 'next/link'
import { Button } from '@medusajs/ui'
import { motion } from 'framer-motion'
import { CreateCinematic } from '@/components/create-cinematic'
import { ArtisanCount } from '@/components/artisan-count'
import type { CreateContent } from './page'

type Props = { content: CreateContent }

export default function CreateClient({ content }: Props) {
  const { hero, cta } = content

  return (
    <>
      {/* The whole story is one scroll-scrubbed cinematic: the hero is its first
          beat and dissolves into the WebGL scene — inspire → design → fabric →
          sell → get paid. */}
      <CreateCinematic hero={hero} />

      <ArtisanCount />

      <section className="kt-create-cta">
        <div className="kt-create-cta-glow" />
        <div className="container">
          <motion.div className="kt-create-cta-inner" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px 0px' }} transition={{ duration: 0.7 }}>
            <div><h2>{cta.title}</h2><p>{cta.body}</p></div>
            <div className="kt-create-cta-actions">
              <Button asChild><Link href={cta.primaryCta.href}>{cta.primaryCta.label}</Link></Button>
              <Button asChild variant="secondary"><Link href={cta.secondaryCta.href}>{cta.secondaryCta.label}</Link></Button>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
