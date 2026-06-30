'use client'

import type { CSSProperties, ReactNode } from 'react'
import { Btn, Card, CardBody, CardHead, Check, Row, ScenePlayer, StaggerItem, Swatch, Tag, serif } from './mockup-kit'

/**
 * Live-React animated product mockups (replacing the baked gif/webm reels).
 * One component per /solutions feature block, plus the flagship design→cart
 * reel. All themed with the kt-* tokens via the shared mockup-kit primitives.
 */

const muted: CSSProperties = { color: 'var(--ink-soft)', fontSize: 13 }
const price = (n: number): CSSProperties => ({ fontFamily: 'var(--font-serif)', fontSize: n })

function Bar({ pct, tone = 'accent' }: { pct: number; tone?: 'accent' | 'rule' }) {
  return (
    <div style={{ height: 6, borderRadius: 'var(--r-pill)', background: 'var(--rule-soft)', overflow: 'hidden' }}>
      <div style={{ width: `${pct}%`, height: '100%', background: tone === 'accent' ? 'var(--accent)' : 'var(--ink-mute)' }} />
    </div>
  )
}

// ─────────────────────────── FLAGSHIP: design → sold ───────────────────────────

export function DesignToCart() {
  return (
    <ScenePlayer
      holdMs={[2400, 2300, 2600, 3200]}
      scenes={[
        {
          label: 'Design',
          render: () => (
            <Card>
              <CardHead eyebrow="Design · DSG-2261" title="Pashmina Shawl — AW26" right={<Tag kind="green"><Check size={13} /> Design ready</Tag>} />
              <CardBody>
                <div style={{ display: 'flex', gap: 12 }}>
                  <Swatch h={64} w={64} hue={40} />
                  <div style={{ flex: 1 }}>
                    <Row k="Fabric" v="Cashmere 80 / Silk 20" />
                    <Row k="Artisan" v="Rukmini · Bagru, IN" />
                    <Row k="Material lot" v="LOT-CSH-0098" last />
                  </div>
                </div>
                <Btn>Publish to storefront →</Btn>
              </CardBody>
            </Card>
          ),
        },
        {
          label: 'Publish',
          render: () => (
            <Card>
              <CardHead eyebrow="Publishing" title="From design to live product" right={<Tag kind="green">Live</Tag>} />
              <CardBody>
                {['Product created from design', 'Variants & region pricing set', 'Digital Product Passport minted', 'Live on your branded storefront'].map((t, i) => (
                  <StaggerItem key={t} i={i}><Check /> {t}</StaggerItem>
                ))}
                <Btn>View on storefront →</Btn>
              </CardBody>
            </Card>
          ),
        },
        {
          label: 'Storefront',
          render: () => (
            <Card>
              <CardHead eyebrow="leatelier.com" title="LeAtelier" right={<Tag kind="orange">In stock</Tag>} />
              <CardBody>
                <Swatch h={56} label="Handwoven · Bagru" hue={40} />
                <div style={{ ...serif, fontSize: 23, marginTop: 14 }}>Pashmina Shawl</div>
                <div style={muted}>Handwoven in Bagru · full provenance on the passport</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 }}>
                  <span style={price(28)}>€420</span>
                </div>
                <Btn>Add to cart</Btn>
              </CardBody>
            </Card>
          ),
        },
        {
          label: 'Sold',
          render: () => (
            <Card>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '16px 20px', background: 'var(--accent-pale)', borderBottom: '1px solid var(--rule-soft)' }}>
                <Check /> <span style={{ fontSize: 14, fontWeight: 500 }}>Added to cart</span>
              </div>
              <div style={{ display: 'flex', gap: 14, alignItems: 'center', padding: '18px 20px' }}>
                <Swatch h={56} w={56} hue={40} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>Pashmina Shawl</div>
                  <div style={{ ...muted, fontSize: 12 }}>Cashmere 80 / Silk 20 · Qty 1</div>
                  <div style={{ ...muted, fontSize: 12, marginTop: 4 }}>— Made by Rukmini · Passport DPP-2261</div>
                </div>
                <span style={price(21)}>€420</span>
              </div>
              <div style={{ padding: '0 20px 20px' }}>
                <Btn accent>Checkout →</Btn>
              </div>
            </Card>
          ),
        },
      ]}
    />
  )
}

// ─────────────────────────── 01 · product-create ───────────────────────────

function Choice({ title, desc, time, on }: { title: string; desc: string; time: string; on?: boolean }) {
  return (
    <div
      style={{
        border: `1px solid ${on ? 'var(--accent)' : 'var(--rule-soft)'}`,
        background: on ? 'var(--accent-pale)' : 'var(--bg)',
        borderRadius: 'var(--r-lg)',
        padding: 16,
      }}
    >
      <div style={{ fontSize: 14, fontWeight: 600 }}>{title}</div>
      <div style={{ ...muted, fontSize: 12, marginTop: 4 }}>{desc}</div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ink-mute)', marginTop: 10 }}>{time}</div>
    </div>
  )
}

export function ProductCreate() {
  return (
    <ScenePlayer
      holdMs={[2800, 2800, 2800]}
      scenes={[
        {
          label: 'New product',
          render: () => (
            <Card>
              <CardHead eyebrow="Create" title="Start a new piece" />
              <CardBody>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <Choice title="Quick add" desc="One variant, default currency" time="~30 sec" on />
                  <Choice title="Advanced" desc="Variants, pricing, SEO" time="Full control" />
                </div>
              </CardBody>
            </Card>
          ),
        },
        {
          label: 'Quick add',
          render: () => (
            <Card>
              <CardHead eyebrow="Quick add" title="Pashmina Shawl" right={<Tag kind="navy">Draft</Tag>} />
              <CardBody>
                <Row k="Title" v="Pashmina Shawl — AW26" />
                <Row k="Price" v="€420.00" />
                <Row k="Stock" v="12" last />
                <Btn>Create product →</Btn>
              </CardBody>
            </Card>
          ),
        },
        {
          label: 'Brief',
          render: () => (
            <Card>
              <CardHead eyebrow="Design board" title="Mood & references" right={<Tag kind="green">Attached</Tag>} />
              <CardBody>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                  <Swatch h={72} hue={40} />
                  <Swatch h={72} hue={150} />
                  <Swatch h={72} hue={250} />
                </div>
                <div style={{ marginTop: 14 }}>
                  {['Describe-from-image → draft copy', 'SEO title & handle set', 'Organised into AW26 collection'].map((t, i) => (
                    <StaggerItem key={t} i={i}><Check size={15} /> {t}</StaggerItem>
                  ))}
                </div>
              </CardBody>
            </Card>
          ),
        },
      ]}
    />
  )
}

// ─────────────────────────── 02 · production-run ───────────────────────────

function Task({ name, state }: { name: string; state: 'done' | 'active' | 'todo' }) {
  const dot = state === 'done' ? 'var(--accent)' : state === 'active' ? 'var(--ink)' : 'var(--rule)'
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 0', fontSize: 13 }}>
      {state === 'done' ? <Check size={16} /> : <span style={{ width: 16, height: 16, borderRadius: '50%', border: `2px solid ${dot}`, flexShrink: 0 }} />}
      <span style={{ color: state === 'todo' ? 'var(--ink-mute)' : 'var(--ink)' }}>{name}</span>
      {state === 'active' && <Tag kind="navy">In progress</Tag>}
    </div>
  )
}

export function ProductionRun() {
  return (
    <ScenePlayer
      holdMs={[2800, 2800, 3000]}
      scenes={[
        {
          label: 'Run',
          render: () => (
            <Card>
              <CardHead eyebrow="Run · RUN-0442" title="Pashmina Shawl ×12" right={<Tag kind="navy">Rukmini</Tag>} />
              <CardBody>
                <Task name="Cut & prep" state="done" />
                <Task name="Dye — indigo" state="done" />
                <Task name="Handweave" state="active" />
                <Task name="Finish & QC" state="todo" />
              </CardBody>
            </Card>
          ),
        },
        {
          label: 'Lifecycle',
          render: () => (
            <Card>
              <CardHead eyebrow="Progress" title="Accept → start → finish" right={<Tag kind="green">On track</Tag>} />
              <CardBody>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ink-mute)', marginBottom: 8 }}>
                  <span>Accepted</span><span>Started</span><span>Finished</span>
                </div>
                <Bar pct={68} />
                <div style={{ marginTop: 16 }}>
                  {['Partner accepted on WhatsApp', 'Live progress from the portal', 'Output & cost captured per run'].map((t, i) => (
                    <StaggerItem key={t} i={i}><Check size={15} /> {t}</StaggerItem>
                  ))}
                </div>
              </CardBody>
            </Card>
          ),
        },
        {
          label: 'Run cost',
          render: () => (
            <Card>
              <CardHead eyebrow="Cost / run" title="Rolled up per piece" />
              <CardBody>
                <Row k="Materials" v="€186.00" />
                <Row k="Labour" v="€92.00" />
                <Row k="Overhead" v="€28.00" />
                <Row k="Partner fee" v="€44.00" />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, marginTop: 6, borderTop: '1px solid var(--rule)' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink)' }}>Total / piece</span>
                  <span style={price(22)}>€350.00</span>
                </div>
              </CardBody>
            </Card>
          ),
        },
      ]}
    />
  )
}

// ─────────────────────────── 03 · inventory-orders ───────────────────────────

function StockRow({ name, where, qty, low }: { name: string; where: string; qty: string; low?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '9px 0', borderBottom: '1px solid var(--rule-soft)' }}>
      <div>
        <div style={{ fontSize: 13, fontWeight: 500 }}>{name}</div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ink-mute)' }}>{where}</div>
      </div>
      {low ? <Tag kind="orange">Low · {qty}</Tag> : <span style={{ fontSize: 13, fontWeight: 500 }}>{qty}</span>}
    </div>
  )
}

export function InventoryOrders() {
  return (
    <ScenePlayer
      holdMs={[2800, 2800, 2800]}
      scenes={[
        {
          label: 'By location',
          render: () => (
            <Card>
              <CardHead eyebrow="Inventory" title="Raw materials by location" />
              <CardBody>
                <StockRow name="Cashmere yarn" where="Bagru hub" qty="84 kg" />
                <StockRow name="Mulberry silk" where="Florence hub" qty="40 m" />
                <StockRow name="Indigo dye" where="Bagru hub" qty="6 kg" low />
              </CardBody>
            </Card>
          ),
        },
        {
          label: 'Reorder',
          render: () => (
            <Card>
              <CardHead eyebrow="Inbound order" title="Indigo dye · restock" right={<Tag kind="orange">Reorder</Tag>} />
              <CardBody>
                <Row k="Supplier" v="Bagru Naturals" />
                <Row k="Quantity" v="20 kg" />
                <Row k="ETA" v="6 days" last />
                <div style={{ marginTop: 14 }}>
                  {['Reorder alert fired automatically', 'Supplier notified', 'Receiving tracked on arrival'].map((t, i) => (
                    <StaggerItem key={t} i={i}><Check size={15} /> {t}</StaggerItem>
                  ))}
                </div>
              </CardBody>
            </Card>
          ),
        },
        {
          label: 'Cost flows',
          render: () => (
            <Card>
              <CardHead eyebrow="Unit cost" title="Flows into run economics" right={<Tag kind="green">Linked</Tag>} />
              <CardBody>
                <Row k="Cashmere yarn" v="€42.00 / kg" />
                <Row k="Last inbound" v="ORD-2208" />
                <Row k="Feeds" v="Run cost → margin" last />
                <Bar pct={82} />
              </CardBody>
            </Card>
          ),
        },
      ]}
    />
  )
}

// ─────────────────────────── 04 · whatsapp / coordinate ───────────────────────────

function Bubble({ side, children, time }: { side: 'in' | 'out'; children: ReactNode; time: string }) {
  const out = side === 'out'
  return (
    <div style={{ display: 'flex', justifyContent: out ? 'flex-end' : 'flex-start', marginBottom: 8 }}>
      <div
        style={{
          maxWidth: '78%',
          padding: '9px 13px',
          borderRadius: 14,
          borderBottomRightRadius: out ? 4 : 14,
          borderBottomLeftRadius: out ? 14 : 4,
          background: out ? 'oklch(90% 0.06 145)' : 'var(--bg)',
          border: out ? 'none' : '1px solid var(--rule-soft)',
          fontSize: 13,
        }}
      >
        {children}
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--ink-mute)', marginTop: 4, textAlign: 'right' }}>{time}</div>
      </div>
    </div>
  )
}

export function Coordinate() {
  return (
    <ScenePlayer
      holdMs={[2800, 3000, 2600]}
      scenes={[
        {
          label: 'Publish',
          render: () => (
            <Card>
              <CardHead eyebrow="leatelier.com" title="Branded storefront" right={<Tag kind="green">Live</Tag>} />
              <CardBody>
                <Swatch h={96} label="Pashmina Shawl" hue={40} />
                <div style={{ marginTop: 14 }}>
                  {['Headless storefront + custom domain', 'Digital Product Passport per SKU', 'EU ESPR-ready provenance'].map((t, i) => (
                    <StaggerItem key={t} i={i}><Check size={15} /> {t}</StaggerItem>
                  ))}
                </div>
              </CardBody>
            </Card>
          ),
        },
        {
          label: 'WhatsApp',
          render: () => (
            <Card>
              <CardHead eyebrow="WhatsApp" title="Rukmini · Bagru" right={<Tag kind="green">Online</Tag>} />
              <CardBody>
                <Bubble side="out" time="09:14">New run RUN-0442 — Pashmina ×12. Accept?</Bubble>
                <Bubble side="in" time="09:16">Accepted ✓ starting today</Bubble>
                <Bubble side="in" time="14:02">Handweave done — photos attached</Bubble>
              </CardBody>
            </Card>
          ),
        },
        {
          label: 'Sync',
          render: () => (
            <Card>
              <CardHead eyebrow="Channels" title="Sync where buyers are" />
              <CardBody>
                <Row k="Instagram" v="Product synced" />
                <Row k="Facebook" v="Catalog updated" />
                <Row k="Storefront" v="Custom domain live" last />
                <div style={{ marginTop: 14 }}>
                  <StaggerItem i={0}><Check size={15} /> Coordinate where makers already are</StaggerItem>
                </div>
              </CardBody>
            </Card>
          ),
        },
      ]}
    />
  )
}

// ─────────────────────────── wholesale: verified inventory → design → passport ───────────────────────────

export function WholesaleFlow() {
  return (
    <ScenePlayer
      holdMs={[2800, 2800, 3000]}
      scenes={[
        {
          label: 'Verified inventory',
          render: () => (
            <Card>
              <CardHead eyebrow="Source" title="Verified inventory" right={<Tag kind="green"><Check size={13} /> Traceable</Tag>} />
              <CardBody>
                <StockRow name="Cashmere 80 / Silk 20" where="Rukmini · Bagru, IN" qty="GOTS" />
                <StockRow name="Mulberry silk" where="Lorenzo · Florence, IT" qty="Verified" />
                <StockRow name="Natural indigo" where="Bagru cooperative" qty="Verified" />
                <Btn>Select for design →</Btn>
              </CardBody>
            </Card>
          ),
        },
        {
          label: 'Design in studio',
          render: () => (
            <Card>
              <CardHead eyebrow="Partner studio" title="New product from stock" right={<Tag kind="navy">Draft</Tag>} />
              <CardBody>
                <div style={{ display: 'flex', gap: 12 }}>
                  <Swatch h={64} w={64} hue={40} />
                  <div style={{ flex: 1 }}>
                <Row k="From lot" v="LOT-CSH-0098" />
                  <Row k="Product" v="Verified Pashmina" />
                  <Row k="Price" v="€420" last />
                  </div>
                </div>
                <Btn>Create from inventory →</Btn>
              </CardBody>
            </Card>
          ),
        },
        {
          label: 'Passport',
          render: () => (
            <Card>
              <CardHead eyebrow="DPP-2261" title="Digital Product Passport" right={<Tag kind="green">EU ESPR</Tag>} />
              <CardBody>
                {[
                  'Material: Cashmere 80 / Silk 20 — Bagru',
                  'Maker: Rukmini, third-generation artisan',
                  'Certification: GOTS verified',
                  'Provenance: traceable, on the product page',
                ].map((t, i) => (
                  <StaggerItem key={t} i={i}><Check size={15} /> {t}</StaggerItem>
                ))}
                <Btn accent>View passport →</Btn>
              </CardBody>
            </Card>
          ),
        },
      ]}
    />
  )
}

// ─────────────────────────── ecommerce: storefront + passport + channels ───────────────────────────

function ProductTile({ name, price, hue, dpp }: { name: string; price: string; hue: number; dpp?: boolean }) {
  return (
    <div style={{ border: '1px solid var(--rule-soft)', borderRadius: 'var(--r-md)', overflow: 'hidden', background: 'var(--bg)' }}>
      <Swatch h={72} hue={hue} label={dpp ? 'DPP' : undefined} />
      <div style={{ padding: '8px 10px' }}>
        <div style={{ fontSize: 12, fontWeight: 500 }}>{name}</div>
        <div style={{ ...muted, fontSize: 11, marginTop: 2 }}>{price}</div>
      </div>
    </div>
  )
}

export function Storefront() {
  return (
    <ScenePlayer
      holdMs={[2800, 3000, 2800]}
      scenes={[
        {
          label: 'Storefront',
          render: () => (
            <Card>
              <CardHead eyebrow="cicilabel.com" title="Cici Label" right={<Tag kind="green">Live</Tag>} />
              <CardBody>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <ProductTile name="Indigo Pashmina" price="€420" hue={250} dpp />
                  <ProductTile name="Tussar Stole" price="€180" hue={40} dpp />
                  <ProductTile name="Mulberry Scarf" price="€140" hue={150} dpp />
                  <ProductTile name="Wool Shawl" price="€260" hue={20} dpp />
                </div>
                <Btn>Visit storefront →</Btn>
              </CardBody>
            </Card>
          ),
        },
        {
          label: 'Passport on page',
          render: () => (
            <Card>
              <CardHead eyebrow="Product · DPP-2261" title="Indigo Pashmina Shawl" right={<Tag kind="green"><Check size={13} /> EU ESPR</Tag>} />
              <CardBody>
                <Swatch h={96} label="Handwoven · Bagru" hue={250} />
                <div style={{ ...serif, fontSize: 22, marginTop: 12 }}>€420</div>
                <div style={{ marginTop: 8 }}>
                  <Row k="Artisan" v="Rukmini · Bagru, IN" />
                  <Row k="Material lot" v="LOT-CSH-0098" />
                  <Row k="Certification" v="GOTS verified" last />
                </div>
                <Btn>Add to cart</Btn>
              </CardBody>
            </Card>
          ),
        },
        {
          label: 'Channels',
          render: () => (
            <Card>
              <CardHead eyebrow="Sync" title="Sell where buyers are" right={<Tag kind="navy">Custom domain</Tag>} />
              <CardBody>
                <Row k="Storefront" v="cicilabel.com · live" />
                <Row k="Instagram" v="Catalog synced" />
                <Row k="Facebook" v="Catalog synced" last />
                <div style={{ marginTop: 14 }}>
                  {['Headless storefront on your domain', 'Digital Product Passport per SKU', 'Channel sync, no re-keying'].map((t, i) => (
                    <StaggerItem key={t} i={i}><Check size={15} /> {t}</StaggerItem>
                  ))}
                </div>
              </CardBody>
            </Card>
          ),
        },
      ]}
    />
  )
}

// ─────────────────────────── sell-on-ai: agent checkout via MCP ───────────────────────────

// A tool-call bubble — monospace label + plain-English gist, so the
// transcript reads as an agent driving the store MCP server.
function ToolBubble({ tool, gist, side = 'out' }: { tool: string; gist: string; side?: 'in' | 'out' }) {
  const out = side === 'out'
  return (
    <div style={{ display: 'flex', justifyContent: out ? 'flex-end' : 'flex-start', marginBottom: 8 }}>
      <div
        style={{
          maxWidth: '86%',
          padding: '8px 12px',
          borderRadius: 14,
          borderBottomRightRadius: out ? 4 : 14,
          borderBottomLeftRadius: out ? 14 : 4,
          background: out ? 'oklch(90% 0.06 250)' : 'var(--bg)',
          border: out ? 'none' : '1px solid var(--rule-soft)',
          textAlign: 'left',
        }}
      >
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.04em', color: out ? 'oklch(42% 0.13 250)' : 'var(--ink-mute)' }}>{tool}</div>
        <div style={{ fontSize: 12.5, marginTop: 3, color: 'var(--ink)' }}>{gist}</div>
      </div>
    </div>
  )
}

export function AgentCheckout() {
  return (
    <ScenePlayer
      holdMs={[2600, 2800, 3000, 3200]}
      scenes={[
        {
          label: 'Discover',
          render: () => (
            <Card>
              <CardHead eyebrow="MCP · /mcp" title="Agent → store" right={<Tag kind="navy">Claude</Tag>} />
              <CardBody>
                <ToolBubble tool="list_stores" gist="resolves ‘cicilabel’ → cicilabel.com (default store)" />
                <ToolBubble tool="get_storefront_key" gist="publishable key resolved — ready to shop" side="in" />
                <Bubble side="out" time="14:01">Using cicilabel. What are you looking for?</Bubble>
              </CardBody>
            </Card>
          ),
        },
        {
          label: 'Search',
          render: () => (
            <Card>
              <CardHead eyebrow="Catalog" title="Semantic search" right={<Tag kind="green">3 matches</Tag>} />
              <CardBody>
                <Bubble side="in" time="14:01">A handwoven indigo scarf, under €500.</Bubble>
                <ToolBubble tool='semantic_search("handwoven indigo scarf")' gist="top: Indigo Pashmina Shawl · €420 · DPP-2261" />
                <ToolBubble tool="create_cart → add_line_item" gist="cart cart_c7af… · Indigo Pashmina ×1 · €420" side="in" />
              </CardBody>
            </Card>
          ),
        },
        {
          label: 'Onboard',
          render: () => (
            <Card>
              <CardHead eyebrow="Customer" title="Shopper onboarded" right={<Tag kind="green"><Check size={13} /> Details set</Tag>} />
              <CardBody>
                <ToolBubble tool="set_customer_details" gist="asks for name, email, address — fills missing fields" />
                <ToolBubble tool="add_shipping_method" gist="standard shipping · €12 · region IN detected" side="in" />
                <Bubble side="out" time="14:03">All set. Generating your payment link.</Bubble>
              </CardBody>
            </Card>
          ),
        },
        {
          label: 'Pay & confirm',
          render: () => (
            <Card>
              <CardHead eyebrow="Payment" title="PayU INR → order" right={<Tag kind="green">Paid</Tag>} />
              <CardBody>
                <ToolBubble tool="initialize_payment_session" gist="PayU link v.payu.in/…4g2k · UPI QR ready" />
                <ToolBubble tool="get_checkout_status" gist="cart → order order_01K… ✓ · passport DPP-2261 attached" side="in" />
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0 0' }}>
                  <Check /> <span style={{ fontSize: 13, fontWeight: 500 }}>Order confirmed — provenance on the receipt.</span>
                </div>
              </CardBody>
            </Card>
          ),
        },
      ]}
    />
  )
}

// ─────────────────────────── ecommerce: brand starter ───────────────────────────

function PaletteSwatch({ hue, on }: { hue: number; on?: boolean }) {
  return (
    <div
      style={{
        width: 56,
        height: 56,
        borderRadius: 'var(--r-md)',
        border: on ? '2px solid var(--accent)' : '1px solid var(--rule)',
        background: `linear-gradient(135deg, oklch(74% 0.045 ${hue}), oklch(55% 0.06 ${hue - 32}))`,
        cursor: 'pointer',
      }}
    />
  )
}

export function BrandStarter() {
  return (
    <ScenePlayer
      holdMs={[2800, 3000, 2800]}
      scenes={[
        {
          label: 'Your label',
          render: () => (
            <Card>
              <CardHead eyebrow="Starter · fashion" title="Start your brand" right={<Tag kind="green">1-click deploy</Tag>} />
              <CardBody>
                <Row k="Brand name" v="Cici Label" />
                <Row k="Domain" v="cicilabel.com" />
                <Row k="Currency" v="EUR · multi-region" last />
                <Btn>Connect domain →</Btn>
              </CardBody>
            </Card>
          ),
        },
        {
          label: 'Pick a palette',
          render: () => (
            <Card>
              <CardHead eyebrow="Theme" title="Choose your palette" right={<Tag kind="navy">Editable</Tag>} />
              <CardBody>
                <div style={{ display: 'flex', gap: 14, marginBottom: 18 }}>
                  <PaletteSwatch hue={250} on />
                  <PaletteSwatch hue={40} />
                  <PaletteSwatch hue={150} />
                  <PaletteSwatch hue={20} />
                </div>
                {['Storefront theme deployed', 'Logo & typography applied', 'Catalogue seeded from atelier'].map((t, i) => (
                  <StaggerItem key={t} i={i}><Check size={15} /> {t}</StaggerItem>
                ))}
                <Btn accent>Launch storefront →</Btn>
              </CardBody>
            </Card>
          ),
        },
        {
          label: 'Live',
          render: () => (
            <Card>
              <CardHead eyebrow="cicilabel.com" title="Cici Label — live" right={<Tag kind="green"><Check size={13} /> Deployed</Tag>} />
              <CardBody>
                <Swatch h={80} label="Your branded storefront" hue={250} />
                <div style={{ marginTop: 14 }}>
                  <Row k="Products" v="12 seeded" />
                  <Row k="Passports" v="12 minted" />
                  <Row k="Domain" v="cicilabel.com · live" last />
                </div>
                <Btn>Visit your store →</Btn>
              </CardBody>
            </Card>
          ),
        },
      ]}
    />
  )
}

// ─────────────────────────── ecommerce: admin panel ───────────────────────────

function AdminProductRow({ name, status, stock }: { name: string; status: 'live' | 'draft'; stock: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--rule-soft)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Swatch h={36} w={36} hue={status === 'live' ? 250 : 40} />
        <span style={{ fontSize: 13, fontWeight: 500 }}>{name}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: 12, color: 'var(--ink-mute)' }}>{stock}</span>
        {status === 'live' ? <Tag kind="green">Live</Tag> : <Tag kind="navy">Draft</Tag>}
      </div>
    </div>
  )
}

function VariantRow({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '9px 0', borderBottom: last ? 'none' : '1px solid var(--rule-soft)' }}>
      <span style={{ fontSize: 13, fontWeight: 500 }}>{label}</span>
      <span style={{ fontSize: 13, color: 'var(--ink-soft)' }}>{value}</span>
    </div>
  )
}

export function AdminPanel() {
  return (
    <ScenePlayer
      holdMs={[2800, 3000, 2800]}
      scenes={[
        {
          label: 'Products',
          render: () => (
            <Card>
              <CardHead eyebrow="Admin · Products" title="Manage your catalogue" right={<Tag kind="green">12 products</Tag>} />
              <CardBody>
                <AdminProductRow name="Indigo Pashmina" status="live" stock="12" />
                <AdminProductRow name="Tussar Stole" status="live" stock="8" />
                <AdminProductRow name="Mulberry Scarf" status="draft" stock="—" />
                <Btn>New product →</Btn>
              </CardBody>
            </Card>
          ),
        },
        {
          label: 'Variants & passport',
          render: () => (
            <Card>
              <CardHead eyebrow="Edit · DPP-2261" title="Indigo Pashmina Shawl" right={<Tag kind="green"><Check size={13} /> EU ESPR</Tag>} />
              <CardBody>
                <VariantRow label="Colour — Indigo" value="€420" />
                <VariantRow label="Colour — Natural" value="€400" />
                <VariantRow label="Size — One size" value="Stock: 12" last />
                <div style={{ marginTop: 14 }}>
                  {['Artisan: Rukmini · Bagru', 'Material lot: LOT-CSH-0098', 'Certification: GOTS verified'].map((t, i) => (
                    <StaggerItem key={t} i={i}><Check size={15} /> {t}</StaggerItem>
                  ))}
                </div>
                <Btn accent>Save changes →</Btn>
              </CardBody>
            </Card>
          ),
        },
        {
          label: 'Orders',
          render: () => (
            <Card>
              <CardHead eyebrow="Admin · Orders" title="Recent orders" right={<Tag kind="green">3 new</Tag>} />
              <CardBody>
                <Row k="#ORD-1042" v="€420 · Paid" />
                <Row k="#ORD-1041" v="€180 · Fulfilled" />
                <Row k="#ORD-1040" v="€260 · Paid" last />
                <Btn>View all orders →</Btn>
              </CardBody>
            </Card>
          ),
        },
      ]}
    />
  )
}

// ─────────────────────────── registry ───────────────────────────

/** Map a SolutionBlock id → its live animation (undefined for ids without one). */
export const MOCKUP_ANIMATIONS: Record<string, (() => ReactNode) | undefined> = {
  'product-create': ProductCreate,
  'production-run': ProductionRun,
  'inventory-orders': InventoryOrders,
  whatsapp: Coordinate,
}
