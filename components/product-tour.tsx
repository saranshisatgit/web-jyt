'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Container } from './container'
import { Eyebrow } from './eyebrow'

type TourTab = {
  id: string
  label: string
  title: string
  description: string
  bullets: string[]
  screenshot: { src: string; alt: string }
  url: string
}

const tabs: TourTab[] = [
  {
    id: 'admin',
    label: 'Admin',
    title: 'Run the operation from a single dashboard.',
    description:
      'Inventory, orders, designs, production runs, partners, websites — every surface of the textile pipeline in one place.',
    bullets: [
      'Real-time production-run tracking',
      'Multi-language WhatsApp & email reminders',
      'Approve or push back partner submissions',
    ],
    screenshot: { src: '/screenshots/application.png', alt: 'JYT admin dashboard' },
    url: 'admin.jaalyantra.com',
  },
  {
    id: 'partner',
    label: 'Partners',
    title: 'A first-class portal for the artisans behind every order.',
    description:
      'Independent partners log in to their own UI to publish products, manage their websites, and receive notifications when orders roll in.',
    bullets: [
      'Per-partner storefront with custom domain & analytics',
      'Notification bell + WhatsApp routing',
      'Self-service plan upgrades via PayU',
    ],
    screenshot: { src: '/screenshots/people.png', alt: 'Partner portal' },
    url: 'partner.jaalyantra.com',
  },
  {
    id: 'storefront',
    label: 'Storefront',
    title: 'A storefront ready to sell on day one.',
    description:
      'Each partner gets a Vercel-deployed Next.js storefront pulling from the same backend — fast, SEO-friendly, and customizable.',
    bullets: [
      'Per-partner analytics provider (built-in or custom snippet)',
      'Block-driven CMS pages, edited live in the admin',
      'Automatic Vercel provisioning on partner signup',
    ],
    screenshot: { src: '/screenshots/store.png', alt: 'Partner storefront' },
    url: 'shop.partner.example',
  },
]

function BrowserFrame({
  url,
  children,
}: {
  url: string
  children: React.ReactNode
}) {
  return (
    <div className="overflow-hidden rounded-xl bg-white shadow-2xl shadow-olive-950/10 ring-1 ring-olive-200/80">
      <div className="flex items-center gap-3 border-b border-olive-200/70 bg-olive-100/60 px-4 py-2.5">
        <div className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-olive-300" />
          <span className="size-2.5 rounded-full bg-olive-300" />
          <span className="size-2.5 rounded-full bg-olive-300" />
        </div>
        <div className="mx-auto inline-flex max-w-[60%] items-center gap-2 truncate rounded-md bg-white px-3 py-1 text-[11px] font-medium text-olive-600 ring-1 ring-olive-200/70">
          <svg viewBox="0 0 12 12" fill="none" className="size-3 text-olive-400" aria-hidden="true">
            <path
              d="M3.5 5V3.5a2.5 2.5 0 0 1 5 0V5m-6 0h7v5h-7V5Z"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {url}
        </div>
      </div>
      <div className="relative aspect-[16/10] w-full bg-olive-50">{children}</div>
    </div>
  )
}

export function ProductTour() {
  const [active, setActive] = useState<string>(tabs[0].id)
  const current = tabs.find((t) => t.id === active) ?? tabs[0]

  return (
    <section className="relative py-24 sm:py-28 lg:py-32">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <Eyebrow className="mx-auto justify-center">A unified platform</Eyebrow>
          <h2 className="mt-5 font-display text-3xl/[1.05] font-medium tracking-[-0.02em] text-balance text-olive-950 sm:text-5xl/[1.05]">
            Three surfaces, <span className="font-serif font-normal italic text-clay-700">one source of truth</span>.
          </h2>
          <p className="mt-5 text-base/7 text-olive-600">
            From the admin who plans a production run, to the partner who weaves it,
            to the storefront where it sells — every workflow is built on the same data model.
          </p>
        </div>

        {/* Tabs */}
        <div
          role="tablist"
          aria-label="Platform surfaces"
          className="mx-auto mt-12 inline-flex w-full max-w-md items-center gap-1 rounded-full border border-olive-200/70 bg-white p-1 sm:flex"
        >
          {tabs.map((tab) => {
            const isActive = tab.id === active
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={isActive}
                aria-controls={`panel-${tab.id}`}
                id={`tab-${tab.id}`}
                onClick={() => setActive(tab.id)}
                className={
                  'relative flex-1 rounded-full px-4 py-2 text-sm font-medium transition-colors ' +
                  (isActive
                    ? 'text-olive-950'
                    : 'text-olive-600 hover:text-olive-900')
                }
              >
                {isActive && (
                  <motion.span
                    layoutId="tour-tab-pill"
                    className="absolute inset-0 -z-0 rounded-full bg-clay-100/80 ring-1 ring-clay-200"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* Panel */}
        <div className="mt-12 grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-16">
          <div
            id={`panel-${current.id}`}
            role="tabpanel"
            aria-labelledby={`tab-${current.id}`}
            className="lg:col-span-5"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                <h3 className="font-display text-2xl/[1.15] font-medium tracking-[-0.02em] text-balance text-olive-950 sm:text-3xl/[1.15]">
                  {current.title}
                </h3>
                <p className="mt-4 text-base/7 text-olive-600">{current.description}</p>
                <ul className="mt-6 space-y-3 text-sm/6 text-olive-700">
                  {current.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-3">
                      <span
                        aria-hidden="true"
                        className="mt-2 inline-block size-1.5 shrink-0 rounded-full bg-clay-500"
                      />
                      {b}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <BrowserFrame url={current.url}>
                  <Image
                    src={current.screenshot.src}
                    alt={current.screenshot.alt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 720px"
                    className="object-cover object-top"
                    priority={current.id === tabs[0].id}
                  />
                </BrowserFrame>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </Container>
    </section>
  )
}
