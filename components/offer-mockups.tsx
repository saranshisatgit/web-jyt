'use client'

import { Btn, Card, CardBody, CardHead, Check, Row, ScenePlayer, StaggerItem, Swatch, Tag, serif } from './mockup-kit'
import type { CSSProperties } from 'react'

const muted: CSSProperties = { color: 'var(--ink-soft)', fontSize: 13 }

// ─────────────────────────── 01 · Apply & Get Vetted ───────────────────────────

function FormField({ label, hint }: { label: string; hint?: string }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-mute)', marginBottom: 4 }}>
        {label}
      </div>
      <div style={{ height: 32, borderRadius: 'var(--r-md)', border: '1px solid var(--rule)', background: 'var(--bg)', padding: '0 10px', display: 'flex', alignItems: 'center', fontSize: 13, color: 'var(--ink-soft)' }}>
        {hint || '—'}
      </div>
    </div>
  )
}

export function PartnerApply() {
  return (
    <ScenePlayer
      holdMs={[2800, 2600, 3000]}
      scenes={[
        {
          label: 'Apply',
          render: () => (
            <Card>
              <CardHead eyebrow="Partner application" title="Tell us about your workshop" right={<Tag kind="navy">Step 1 of 3</Tag>} />
              <CardBody>
                <FormField label="Workshop name" hint="e.g. Rukmini Handloom" />
                <FormField label="Location" hint="Bagru, Rajasthan, IN" />
                <FormField label="Equipment" hint="Handloom, indigo dye vat, finishing table" />
                <FormField label="Monthly capacity" hint="~40 pieces / month" />
                <Btn>Submit application →</Btn>
              </CardBody>
            </Card>
          ),
        },
        {
          label: 'Review',
          render: () => (
            <Card>
              <CardHead eyebrow="Application · SUB-4421" title="Under review" right={<Tag kind="orange">In progress</Tag>} />
              <CardBody>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 0' }}>
                  <span style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--accent-pale)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🔍</span>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 500 }}>Verification in progress</div>
                    <div style={muted}>Our team is reviewing your details</div>
                  </div>
                </div>
                <StaggerItem i={0}><Check size={15} /> Workshop details submitted</StaggerItem>
                <StaggerItem i={1}><Check size={15} /> Portfolio attached</StaggerItem>
                <StaggerItem i={2}>Reference check — pending</StaggerItem>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ink-mute)', marginTop: 14, textAlign: 'center' }}>
                  Typically reviewed within 5 business days
                </div>
              </CardBody>
            </Card>
          ),
        },
        {
          label: 'Verified',
          render: () => (
            <Card>
              <CardHead eyebrow="Welcome!" title="You're verified" right={<Tag kind="green"><Check size={13} /> Approved</Tag>} />
              <CardBody>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 0' }}>
                  <span style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--accent-pale)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>✓</span>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 600 }}>Rukmini Handloom</div>
                    <div style={muted}>Bagru, Rajasthan — Handweaving</div>
                  </div>
                  <Tag kind="green">Verified</Tag>
                </div>
                <div style={{ marginTop: 8 }}>
                  <StaggerItem i={0}><Check size={15} /> Profile live on the network</StaggerItem>
                  <StaggerItem i={1}><Check size={15} /> Matching brands notified</StaggerItem>
                  <StaggerItem i={2}><Check size={15} /> Next: set your terms</StaggerItem>
                </div>
                <Btn accent>Set your terms →</Btn>
              </CardBody>
            </Card>
          ),
        },
      ]}
    />
  )
}

// ─────────────────────────── 02 · Set Your Terms ───────────────────────────

export function PartnerTerms() {
  return (
    <ScenePlayer
      holdMs={[2800, 2800, 2600]}
      scenes={[
        {
          label: 'Techniques',
          render: () => (
            <Card>
              <CardHead eyebrow="Pricing" title="Per-technique pricing" right={<Tag kind="navy">3 set</Tag>} />
              <CardBody>
                <Row k="Handweaving — plain" v="€180 / piece" />
                <Row k="Handweaving — pattern" v="€240 / piece" />
                <Row k="Natural dyeing" v="€60 / metre" last />
                <Btn>Add technique →</Btn>
              </CardBody>
            </Card>
          ),
        },
        {
          label: 'Capacity',
          render: () => (
            <Card>
              <CardHead eyebrow="Settings" title="Order parameters" right={<Tag kind="green">Set</Tag>} />
              <CardBody>
                <Row k="Min. order quantity" v="6 pieces" />
                <Row k="Lead time" v="14 business days" />
                <Row k="Shipping regions" v="IN, EU, AU" last />
                <div style={{ marginTop: 14 }}>
                  <StaggerItem i={0}><Check size={15} /> MOQ set to 6 pieces</StaggerItem>
                  <StaggerItem i={1}><Check size={15} /> Lead time confirmed</StaggerItem>
                  <StaggerItem i={2}><Check size={15} /> Regions published</StaggerItem>
                </div>
              </CardBody>
            </Card>
          ),
        },
        {
          label: 'Published',
          render: () => (
            <Card>
              <CardHead eyebrow="Capability card" title="Live to brands" right={<Tag kind="green"><Check size={13} /> Published</Tag>} />
              <CardBody>
                <Swatch h={56} label="Rukmini Handloom" hue={40} />
                <div style={{ marginTop: 14 }}>
                  <Row k="Techniques" v="3 listed" />
                  <Row k="Price range" v="€60 – €240" />
                  <Row k="Shipping" v="IN, EU, AU" last />
                </div>
                <div style={{ ...muted, fontSize: 12, marginTop: 14, textAlign: 'center' }}>
                  Brands can now find and order from you
                </div>
              </CardBody>
            </Card>
          ),
        },
      ]}
    />
  )
}

// ─────────────────────────── 03 · Receive Work & Deliver ───────────────────────────

function BriefRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 0', borderBottom: '1px solid var(--rule-soft)', fontSize: 13 }}>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-mute)', minWidth: 70 }}>{label}</span>
      <span style={{ fontWeight: 500 }}>{value}</span>
    </div>
  )
}

function StatusDot({ state, label }: { state: 'done' | 'active' | 'todo'; label: string }) {
  const dot = state === 'done' ? 'var(--accent)' : state === 'active' ? 'var(--ink)' : 'var(--rule)'
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 0', fontSize: 13 }}>
      <span style={{ width: 10, height: 10, borderRadius: '50%', background: dot, flexShrink: 0 }} />
      <span style={{ color: state === 'todo' ? 'var(--ink-mute)' : 'var(--ink)' }}>{label}</span>
      {state === 'active' && <Tag kind="navy">In progress</Tag>}
    </div>
  )
}

export function PartnerDeliver() {
  return (
    <ScenePlayer
      holdMs={[2800, 3000, 3000]}
      scenes={[
        {
          label: 'Brief',
          render: () => (
            <Card>
              <CardHead eyebrow="New order · ORD-1047" title="Brand: LeAtelier" right={<Tag kind="orange">New</Tag>} />
              <CardBody>
                <BriefRow label="Product" value="Indigo Pashmina × 12" />
                <BriefRow label="Deadline" value="28 Jul 2026" />
                <BriefRow label="Material" value="Cashmere 80/Silk 20 — provided" />
                <div style={{ ...muted, fontSize: 12, marginTop: 12, padding: 8, background: 'var(--accent-pale)', borderRadius: 'var(--r-md)' }}>
                  "Classic indigo shade, handwoven finish as discussed. Please confirm."
                </div>
                <Btn>Accept order →</Btn>
              </CardBody>
            </Card>
          ),
        },
        {
          label: 'Production',
          render: () => (
            <Card>
              <CardHead eyebrow="RUN-0442 · Progress" title="Pashmina Shawl ×12" right={<Tag kind="green">On track</Tag>} />
              <CardBody>
                <StatusDot label="Accepted" state="done" />
                <StatusDot label="Warp & prep" state="done" />
                <StatusDot label="Dye — indigo" state="active" />
                <StatusDot label="Weave" state="todo" />
                <StatusDot label="Finish & QC" state="todo" />
                <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
                  <Tag kind="white">📸 Photo update sent</Tag>
                  <Tag kind="white">⏱️ On schedule</Tag>
                </div>
              </CardBody>
            </Card>
          ),
        },
        {
          label: 'Delivered',
          render: () => (
            <Card>
              <CardHead eyebrow="ORD-1047 · Complete" title="Delivered & approved" right={<Tag kind="green">✓ Done</Tag>} />
              <CardBody>
                <StaggerItem i={0}><Check size={15} /> 12 pieces delivered on time</StaggerItem>
                <StaggerItem i={1}><Check size={15} /> QC passed — brand approved</StaggerItem>
                <StaggerItem i={2}><Check size={15} /> ★ 4.9 — reputation earned</StaggerItem>
                <StaggerItem i={3}><Check size={15} /> €2,880 added to earnings</StaggerItem>
                <div style={{ marginTop: 14, padding: 12, background: 'var(--accent-pale)', borderRadius: 'var(--r-md)', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 24 }}>⭐</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>4.9 · 12 completed orders</div>
                    <div style={muted}>Your reputation keeps growing</div>
                  </div>
                </div>
              </CardBody>
            </Card>
          ),
        },
      ]}
    />
  )
}

// ─────────────────────────── 04 · Get Paid (International & Local Support) ───────────────────────────

export function PartnerPayment() {
  return (
    <ScenePlayer
      holdMs={[2600, 2800, 2800]}
      scenes={[
        {
          label: 'Earnings',
          render: () => (
            <Card>
              <CardHead eyebrow="Finance" title="Earnings summary" right={<Tag kind="green">€4,320 available</Tag>} />
              <CardBody>
                <Row k="ORD-1047" v="€2,880 — Paid" />
                <Row k="ORD-1042" v="€1,440 — Paid" />
                <Row k="ORD-1039" v="€960 — Processing" last />
                <div style={{ marginTop: 14, padding: 12, borderRadius: 'var(--r-md)', border: '1px solid var(--rule)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 14, fontWeight: 500 }}>Available for payout</span>
                  <span style={{ ...serif, fontSize: 22 }}>€4,320</span>
                </div>
              </CardBody>
            </Card>
          ),
        },
        {
          label: 'Payout',
          render: () => (
            <Card>
              <CardHead eyebrow="Withdraw" title="Choose your payout method" right={<Tag kind="navy">Secure</Tag>} />
              <CardBody>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, borderRadius: 'var(--r-md)', border: '2px solid var(--accent)', background: 'var(--accent-pale)' }}>
                    <Check size={18} />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>Local bank transfer (INR)</div>
                      <div style={muted}>ICICI Bank · ****4821 · 1–2 business days</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, borderRadius: 'var(--r-md)', border: '1px solid var(--rule-soft)' }}>
                    <span style={{ width: 18, height: 18, borderRadius: '50%', border: '2px solid var(--rule)' }} />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>International wire (EUR)</div>
                      <div style={muted}>SWIFT transfer · 3–5 business days</div>
                    </div>
                  </div>
                </div>
                <Btn accent>Withdraw →</Btn>
              </CardBody>
            </Card>
          ),
        },
        {
          label: 'Support',
          render: () => (
            <Card>
              <CardHead eyebrow="Reconciliation" title="Every run tracked" right={<Tag kind="green"><Check size={13} /> Audited</Tag>} />
              <CardBody>
                <StaggerItem i={0}><Check size={15} /> Materials cost: €186.00 / piece</StaggerItem>
                <StaggerItem i={1}><Check size={15} /> Labour: €92.00 / piece</StaggerItem>
                <StaggerItem i={2}><Check size={15} /> Partner fee: €44.00 / piece</StaggerItem>
                <div style={{ marginTop: 14, padding: 12, background: 'var(--cream)', borderRadius: 'var(--r-md)', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 20 }}>💬</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>Dedicated partner support</div>
                    <div style={muted}>Reach us on WhatsApp or email — we respond within 4 hours</div>
                  </div>
                </div>
              </CardBody>
            </Card>
          ),
        },
      ]}
    />
  )
}
