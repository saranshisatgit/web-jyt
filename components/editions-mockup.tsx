/**
 * EDITIONS — one live product mockup per section.
 *
 * Each editions section pairs its feature cards with a small, on-brand UI
 * mockup that *shows* the idea (a checkout in Copilot, a payout, a product
 * passport…). Built from the shared mockup-kit primitives so they inherit the
 * Sky tokens and stay theme-aware. The parallax/entrance is handled by the
 * section wrapper in editions-client; this file just renders the right mockup
 * for a given section id.
 */
"use client"

import type { ReactNode } from "react"
import { Card, CardHead, CardBody, Row, Tag, Btn, Swatch, serif } from "./mockup-kit"

const mono = { fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.06em" } as const

function Surface({ name, live }: { name: string; live?: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid var(--rule-soft)" }}>
      <span style={{ fontSize: 13, fontWeight: 500, color: "var(--ink)" }}>{name}</span>
      <Tag kind={live ? "green" : "white"}>{live ? "● live" : "syncing"}</Tag>
    </div>
  )
}

/* ─── the eight section mockups ──────────────────────────────────────────── */

function WeaveMock() {
  return (
    <Card>
      <CardHead eyebrow="In Copilot" title="Handloom stole" right={<Tag kind="navy">UCP</Tag>} />
      <CardBody>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <Swatch h={64} w={64} hue={264} />
          <div style={{ minWidth: 0 }}>
            <div style={{ ...serif, fontSize: 17 }}>Bengal cotton, indigo</div>
            <div style={{ fontSize: 12, color: "var(--ink-mute)", marginTop: 2 }}>Woven in Fulia · ships in 6 days</div>
          </div>
        </div>
        <div style={{ marginTop: 12 }}>
          <Row k="Price" v="₹4,200" />
          <Row k="Origin" v="Verified passport" last />
        </div>
        <Btn accent>Buy with Shop Pay</Btn>
      </CardBody>
    </Card>
  )
}

function StudioMock() {
  return (
    <Card>
      <CardHead eyebrow="New piece" title="Design a colourway" />
      <CardBody>
        <div style={{ display: "flex", gap: 8 }}>
          {[264, 250, 285, 238].map((h) => <Swatch key={h} h={52} hue={h} />)}
        </div>
        <div style={{ marginTop: 12 }}>
          <Row k="Technique" v="Jamdani" />
          <Row k="Material" v="Handspun cotton" />
          <Row k="Sizes" v="S · M · L · XL" last />
        </div>
        <Btn>Generate techpack</Btn>
      </CardBody>
    </Card>
  )
}

function StorefrontMock() {
  return (
    <Card>
      <CardHead eyebrow="Publish" title="One store, every surface" />
      <CardBody>
        <Surface name="yourbrand.com" live />
        <Surface name="WhatsApp catalogue" live />
        <Surface name="Instagram shop" live />
        <Surface name="AI agents · UCP" />
        <Btn accent>Update once — live everywhere</Btn>
      </CardBody>
    </Card>
  )
}

function WorkshopMock() {
  return (
    <Card>
      <CardHead eyebrow="On the swatch" title="Scan to catalogue" />
      <CardBody>
        <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 3, width: 88, flexShrink: 0 }}>
            {Array.from({ length: 25 }).map((_, i) => (
              <span key={i} style={{ aspectRatio: "1", borderRadius: 2, background: [0, 1, 4, 5, 6, 8, 10, 12, 16, 18, 20, 23, 24].includes(i) ? "var(--ink)" : "transparent" }} />
            ))}
          </div>
          <div>
            <div style={{ ...serif, fontSize: 16 }}>Walk-ins → repeat buyers</div>
            <div style={{ fontSize: 12, color: "var(--ink-mute)", marginTop: 4 }}>Every swatch links to the full catalogue, reviews and re-order.</div>
          </div>
        </div>
        <div style={{ marginTop: 12 }}>
          <Row k="Pop-up checkout" v="Works offline" last />
        </div>
      </CardBody>
    </Card>
  )
}

function StoriesMock() {
  return (
    <Card>
      <CardHead eyebrow="Product passport" title="Who made this" right={<Tag kind="green">● verified</Tag>} />
      <CardBody>
        <div style={{ display: "grid", gap: 0 }}>
          <Row k="Cotton grown" v="Vidarbha · organic" />
          <Row k="Dyed" v="Bagru · natural indigo" />
          <Row k="Woven by" v="Rafiq, Fulia" />
          <Row k="Finished" v="Apr 2026" last />
        </div>
        <Btn>Open the full story</Btn>
      </CardBody>
    </Card>
  )
}

function SupplyMock() {
  return (
    <Card>
      <CardHead eyebrow="Inventory" title="Thinks ahead" right={<Tag kind="orange">reorder</Tag>} />
      <CardBody>
        <div style={{ display: "grid", gap: 0 }}>
          <Row k="Indigo yarn" v="4.2 kg left" />
          <Row k="Natural dye" v="Prepare 2 L" />
          <Row k="Next weave" v="Scheduled Tue" last />
        </div>
        <div style={{ marginTop: 12, padding: "10px 12px", borderRadius: "var(--r-md)", background: "var(--accent-pale)", color: "var(--accent-deep)", ...mono }}>
          Suggest: reorder handspun cotton before Fri
        </div>
      </CardBody>
    </Card>
  )
}

function FinanceMock() {
  return (
    <Card>
      <CardHead eyebrow="Payout" title="Paid on ship" right={<Tag kind="green">instant</Tag>} />
      <CardBody>
        <div style={{ ...serif, fontSize: 34, color: "var(--accent-deep)" }}>₹24,800</div>
        <div style={{ marginTop: 4, fontSize: 12, color: "var(--ink-mute)" }}>Order #JYT-2048 · you keep 90%</div>
        <div style={{ marginTop: 12 }}>
          <Row k="To" v="UPI · rafiq@okhdfc" />
          <Row k="Arrives" v="Seconds" last />
        </div>
        <Btn accent>Withdraw</Btn>
      </CardBody>
    </Card>
  )
}

function BuildMock() {
  const lines: Array<[string, string]> = [
    ["POST", "order.created"],
    ["200", "payout.paid → webhook"],
    ["GET", "catalog/products"],
  ]
  return (
    <Card>
      <CardHead eyebrow="Developers" title="Build on the loom" icon="table" />
      <div style={{ padding: 14, background: "#0b0f1c", borderBottomLeftRadius: "var(--r-lg)", borderBottomRightRadius: "var(--r-lg)" }}>
        <div style={{ display: "grid", gap: 8 }}>
          {lines.map(([m, path]) => (
            <div key={path} style={{ display: "flex", alignItems: "center", gap: 10, ...mono, color: "rgba(214,222,240,0.9)" }}>
              <span style={{ color: "#9cbaea", minWidth: 34 }}>{m}</span>
              <span>{path}</span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 12, ...mono, color: "#6f7fa6" }}>listening for events…</div>
      </div>
    </Card>
  )
}

const MOCKS: Record<string, () => ReactNode> = {
  weave: WeaveMock,
  studio: StudioMock,
  storefront: StorefrontMock,
  workshop: WorkshopMock,
  stories: StoriesMock,
  supply: SupplyMock,
  finance: FinanceMock,
  build: BuildMock,
}

export function EditionsMockup({ id }: { id: string }) {
  const Mock = MOCKS[id] ?? WeaveMock
  return <Mock />
}

export default EditionsMockup
