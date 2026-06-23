/**
 * Seed content for the /solutions page (#605 — Brand Positioning).
 *
 * Positioning (operator, 2026-06-23): BRANDS-FIRST, structured BY WORKFLOW STAGE,
 * each block headed by its product mockup (live React over the *-mockup.html, with
 * the webm/gif in public/mockups/ as poster + fallback). Voice mirrors the home
 * page: premium, craft-literate, plain-spoken, B2B. Makers are the network the
 * brand plugs into — a supporting proof point, not the lead.
 *
 * This is local seed content (matches how the home page ships its blocks today);
 * it can be lifted into the CMS later without changing the components.
 */

export type SolutionBlock = {
  /** Stable id — also the mockup key in public/mockups/<id>.{webm,gif}. */
  id: string
  stage: string
  title: string
  /** One-paragraph lead, brand-owner POV. */
  body: string
  /** Concrete capabilities shown in the block. */
  features: string[]
  /** Mockup header asset (webm primary, gif fallback) + the source mockup. */
  mockup: {
    webm: string
    gif: string
    /** Source HTML mockup, for the live-React version of the header. */
    source: string
    alt: string
  }
}

export const SOLUTIONS_HERO = {
  eyebrow: "The atelier operating system",
  title: "One OS for your atelier.",
  subtitle:
    "Design, produce, supply, and sell on a single rail — from the first sketch to a branded storefront, with every artisan, material lot, and SKU accounted for.",
  primaryCta: { label: "Book a walkthrough", href: "/contact" },
  secondaryCta: { label: "See pricing", href: "/pricing" },
} as const

/** Brands-first "who it's for" callout — reused on the home page too. */
export const AUDIENCE_CALLOUT = {
  eyebrow: "Who it's for",
  title: "Built for fashion houses & independent ateliers.",
  body:
    "Whether you run a maison with a sample room or a solo atelier with a phone, JYT is the production OS behind the label — and the network of vetted artisans you produce with.",
  audiences: [
    { tag: "Maisons & brands", line: "Run design, production, inventory, and storefront on one system." },
    { tag: "Independent ateliers", line: "Start solo, route work to vetted makers, sell without building a site." },
    { tag: "The maker network", line: "150+ artisans across EU · IN · AU — the other side of your rail." },
  ],
} as const

export const SOLUTION_BLOCKS: SolutionBlock[] = [
  {
    id: "product-create",
    stage: "01 · Design",
    title: "Sketch, brief, and spin up the piece.",
    body:
      "Start a product the way you start a garment — fast or in full. Quick-add a single-variant piece in your default currency, or open the advanced flow for variants, region-based pricing, SEO, and organisation fields. Design boards and mood references keep the brief in one place.",
    features: [
      "Quick-add vs. advanced product creation",
      "Variants, region-based pricing, SEO fields",
      "Design boards & pre-production assets",
      "Describe-from-image to draft copy",
    ],
    mockup: {
      webm: "/mockups/product-create.webm",
      gif: "/mockups/product-create.gif",
      source: "product-create-mockup.html",
      alt: "Creating a new product — choosing quick-add vs advanced, then filling title, price, and stock.",
    },
  },
  {
    id: "production-run",
    stage: "02 · Produce",
    title: "Route tasks to vetted artisans, track every run.",
    body:
      "Turn a design order into a production run with task templates, dependencies, and a vetted partner assigned. Watch it move from accepted to finished, capture real output and cost per run, and see materials, labour, overhead, and partner fee roll up into one number.",
    features: [
      "Task templates & dependencies",
      "Per-run cost: materials · labour · overhead · partner fee",
      "Accept → start → finish lifecycle",
      "Live progress from the partner portal",
    ],
    mockup: {
      webm: "/mockups/production-run.webm",
      gif: "/mockups/production-run.gif",
      source: "production-run-mockup.html",
      alt: "A production run for a Pashmina shawl — completing the run with a per-piece cost breakdown and task checklist.",
    },
  },
  {
    id: "inventory-orders",
    stage: "03 · Supply",
    title: "Track raw materials end to end.",
    body:
      "Know what you have and what's on the way. Inventory by location, reorder alerts, and supplier notifications keep raw materials flowing into production — with unit costs that feed straight back into your run economics.",
    features: [
      "Inventory by location",
      "Reorder alerts & supplier notifications",
      "Unit costs flow into run cost",
      "Inbound orders & receiving",
    ],
    mockup: {
      webm: "/mockups/inventory-orders.webm",
      gif: "/mockups/inventory-orders.gif",
      source: "inventory-orders-mockup.html",
      alt: "Managing inventory orders — receiving raw materials and tracking stock by location.",
    },
  },
  {
    id: "whatsapp",
    stage: "04 · Sell & coordinate",
    title: "Publish branded, coordinate on the channels makers already use.",
    body:
      "Ship to a headless storefront with custom domains and a Digital Product Passport per SKU — publish without rebuilding a site. Behind it, partners get tasks and updates on WhatsApp and a mobile-first portal, so coordination happens where your makers already are.",
    features: [
      "Headless storefront + custom domains",
      "Digital Product Passport per SKU (EU ESPR-ready)",
      "WhatsApp + mobile-first partner portal",
      "Instagram & Facebook product sync",
    ],
    mockup: {
      webm: "/mockups/whatsapp.webm",
      gif: "/mockups/whatsapp.gif",
      source: "whatsapp-mockup.html",
      alt: "Coordinating with a partner over WhatsApp — task updates and confirmations on mobile.",
    },
  },
]

/**
 * Flagship "create → sell on one rail" reel — the lead visual. Walks one piece
 * from atelier design → publish → branded storefront → added to cart.
 * Source mockup: design-to-cart-mockup.html (→ public/mockups/design-to-cart.*).
 */
export const FLAGSHIP_MOCKUP = {
  webm: "/mockups/design-to-cart.webm",
  gif: "/mockups/design-to-cart.gif",
  caption: "One piece, one rail — designed in the atelier, published to a branded storefront, sold.",
  alt: "A Pashmina shawl moving from atelier design to a published storefront product and into the cart.",
} as const

export const SOLUTIONS_CTA = {
  title: "Same rails, both ends of the trade.",
  body:
    "Run your label on one production OS — and tap a vetted maker network while you're at it.",
  primaryCta: { label: "Book a walkthrough", href: "/contact" },
  secondaryCta: { label: "Talk to us", href: "/contact" },
} as const
