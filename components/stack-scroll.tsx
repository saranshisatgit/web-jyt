'use client'

import { ProductCreate, ProductionRun, InventoryOrders, Storefront } from './mockup-animations'
import type { ReactNode } from 'react'

type StackStep = {
  stage: string
  title: string
  items: string[]
  mockup: ReactNode
}

const STEPS: StackStep[] = [
  { stage: '01 · Design', title: 'Sketch & brief the piece.', items: ['Design & mood boards', 'Pre-production assets', 'Partner assignment'], mockup: <ProductCreate /> },
  { stage: '02 · Produce', title: 'Route tasks to vetted artisans.', items: ['Task templates & dependencies', 'Mobile-first partner portal', 'Live progress updates'], mockup: <ProductionRun /> },
  { stage: '03 · Supply', title: 'Track raw materials end to end.', items: ['Inventory by location', 'Reorder alerts', 'Supplier notifications'], mockup: <InventoryOrders /> },
  { stage: '04 · Sell', title: 'Ship & publish, branded.', items: ['Headless storefront', 'Instagram & Facebook sync', 'Full traceability per SKU'], mockup: <Storefront /> },
]

const OFFSET = 80

function StackCard({ step, i }: { step: StackStep; i: number }) {
  return (
    <div
      style={{
        position: 'sticky',
        top: i * OFFSET,
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: 'var(--bg)',
        border: '1px solid var(--rule)',
        borderRadius: 16,
        padding: '32px 40px',
        boxShadow: `0 ${4 + i * 4}px ${12 + i * 8}px rgba(0,0,0,0.06)`,
        marginTop: i > 0 ? -100 * i + i * OFFSET : 0,
      }}
    >
      <div
        className="kt-stack-grid"
        style={{
          gap: 64,
          alignItems: 'center',
          width: '100%',
          maxWidth: 1280,
          margin: '0 auto',
        }}
      >
        <div>
          <div className="kt-meta" style={{ color: 'var(--accent-deep)' }}>{step.stage}</div>
          <h3 className="serif" style={{ fontSize: 28, margin: '12px 0 16px', lineHeight: 1.15, fontWeight: 400 }}>{step.title}</h3>
          <ul className="kt-dash-list">
            {step.items.map((it) => (
              <li key={it}>{it}</li>
            ))}
          </ul>
        </div>
        <div style={{ minHeight: 400 }}>{step.mockup}</div>
      </div>
    </div>
  )
}

export function StackScroll() {
  return (
    <section
      className="kt-section"
      id="how-it-works"
      style={{ position: 'relative', overflow: 'visible', padding: 0 }}
    >
      <div className="container" style={{ paddingTop: 'var(--s-10)', paddingBottom: 'var(--s-6)' }}>
        <div className="kt-section-head">
          <div className="kt-eyebrow">The stack · Medo</div>
          <h2 className="kt-display m">One system. <em>Sketch to shipment.</em></h2>
        </div>
      </div>
      <div style={{ height: `${(STEPS.length + 2) * 100}vh`, position: 'relative' }}>
        {STEPS.map((step, i) => (
          <StackCard key={step.stage} step={step} i={i} />
        ))}
      </div>
    </section>
  )
}
