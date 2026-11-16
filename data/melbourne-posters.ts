// Global Sourcing Expo Melbourne 2026 — the three A1 stand posters, as data.
//
// Every word, number, colour, photo and the order of the posters lives here. The
// components in components/melbourne-poster/ only lay it out. Rendered at
// /melbourne/posters (index) and /melbourne/posters/<slug>.
//
// Inline formatting: wrap text in **double asterisks** to set it bold.
// Image paths are site-absolute (files live in public/).

export type PosterTheme = {
  paper: string
  paper2: string
  ink: string
  inkSoft: string
  inkMute: string
  teal: string
  tealDeep: string
  tealPale: string
  rule: string
}

export const DEFAULT_THEME: PosterTheme = {
  paper: '#f6f3ec',
  paper2: '#ece7dc',
  ink: '#15181d',
  inkSoft: '#3f434b',
  inkMute: '#6a6e76',
  teal: '#4f7f8c',
  tealDeep: '#2f5560',
  tealPale: '#dbe6e8',
  rule: '#cfc8b9',
}

/** The band across the top of every poster. */
export type PosterHeader = {
  brand: string
  brandDeva: string
  event: string
  stand: string
  dates: string
}

export const HEADER: PosterHeader = {
  brand: 'House of Hands',
  brandDeva: 'हाथ का काम',
  event: 'Global Sourcing Expo Melbourne',
  stand: 'Stand D14',
  dates: '17 to 19 November 2026',
}

export type Headline = { lead: string; accent: string }

export type Qr = {
  /** The QR image. Each encodes /contact?prompt=…&utm_content=<utmContent>. */
  src: string
  alt: string
  caption: string
  /** Shown under the caption (poster 2 only). */
  note?: string
  /** The utm_content the QR carries, for reading scans after the expo. */
  utmContent: string
}

type PosterBase = {
  slug: string
  number: number
  /** Browser tab / index card title. */
  title: string
  description: string
  /** The label in the on-screen bar above the sheet. */
  webbar: string
  /** Index card. */
  card: { heading: string; blurb: string; preview: string; pdf: string }
  theme?: Partial<PosterTheme>
  kicker: string
  headline: Headline
  qr: Qr
}

// ---------------------------------------------------------------- poster 1

export type LoomStrip = {
  src: string
  /** Crop focus, as CSS object-position. */
  pos: string
  /** Photo strips are wider than painting strips, like a warp with feature threads. */
  kind: 'look' | 'art'
}

export type HouseOfHandsPoster = PosterBase & {
  layout: 'house-of-hands'
  lede: string
  loom: {
    strips: LoomStrip[]
    /** Relative strip widths by kind. */
    widths: { look: number; art: number }
    /** Weft band centres, as a share of the panel height. */
    wefts: number[]
    credit: [string, string]
  }
  pills: { title: string; text: string }[]
  cta: {
    kicker: string
    heading: string
    text: string
    contacts: { label: string; value: string }[]
  }
  foot: { left: string; right: string }
}

// ---------------------------------------------------------------- poster 2

export type Hub = {
  lat: number
  lon: number
  place: string
  craft: string
  side: 'left' | 'right'
  home?: boolean
  /** Vertical nudge of the label, in mm. */
  nudge?: number
}

export type SupplyLinePoster = PosterBase & {
  layout: 'supply-line'
  lede: string
  facts: { value: string; text: string }[]
  map: {
    kicker: string
    heading: string[]
    note: string
    hubs: Hub[]
    away: { id: 'top' | 'bottom'; kicker: string; place: string; text: string }[]
  }
  how: {
    heading: string
    kicker: string
    steps: { icon: string; title: string; text: string; chips?: string[] }[]
    lead: { label: string; times: { days: string; text: string }[]; footnote: string }
  }
  app: {
    phones: { src: string; alt: string; title: string; text: string }[]
    heading: string
    text: string
    chainHeading: string
    chain: { name: string; role: string }[]
    chainCaption: string
  }
}

// ---------------------------------------------------------------- poster 3

export type SellAnywherePoster = PosterBase & {
  layout: 'sell-anywhere'
  lede: string
  proof: { label: string; labels: { name: string; place: string }[] }
  covered: {
    kicker: string
    heading: string
    pillars: { title: string; text: string }[]
    shot: { src: string; alt: string; caption: string }
    quote: { text: string; cite: string }
  }
  range: {
    heading: string
    kicker: string
    items: { src: string; pos: string; title: string; text: string }[]
    also: string
  }
  prices: {
    kicker: string
    heading: string
    columns: [string, string, string, string]
    rows: [string, string, string, string][]
    fine: string
    duty: string
  }
  climate: { kicker: string; heading: string; text: string; value: string; valueText: string }
  khadi: {
    kicker: string
    value: string
    unit: string
    text: string
    looms: string
    loomsText: string
  }
  blends: {
    heading: string
    swatches: { src: string; caption: string }[]
    chips: string[]
  }
  cta: { kicker: string; heading: string; text: string }
}

export type Poster = HouseOfHandsPoster | SupplyLinePoster | SellAnywherePoster

export const POSTERS_PAGE = {
  title: 'Melbourne Stand Posters',
  description:
    'JYT at Global Sourcing Expo Melbourne, stand D14, 17 to 19 November 2026. The three stand posters and the booklet, to view or print.',
  ogTitle: 'House of Hands · Global Sourcing Expo Melbourne 2026',
  ogImage: 'https://jaalyantra.com/booklet/house-of-hands.jpg',
  heading: { lead: 'Our stand posters, ', accent: 'to view or print.' },
  lede: 'Three A1 posters from the JYT stand. Open one to see it full size, or download the print file.',
  booklet: {
    heading: 'The House of Hands booklet',
    read: { label: 'Read the booklet', href: '/booklet/melbourne-2026.html' },
    pdf: {
      label: 'Booklet PDF',
      href: '/booklet/melbourne-2026.pdf',
      filename: 'JYT-House-of-Hands-Melbourne-2026.pdf',
    },
  },
  note: 'Print files are A1 (594 × 841 mm) with a 3 mm bleed on every side, so each PDF page is 600 × 847 mm. Print at 100%, no scaling.',
}

/** Order here is the order on the index page. */
export const POSTERS: Poster[] = [
  {
    layout: 'house-of-hands',
    slug: 'house-of-hands',
    number: 1,
    title: 'House of Hands Poster',
    description: 'JYT at Global Sourcing Expo Melbourne, 17 to 19 November 2026. A1 stand poster.',
    webbar: 'A1 stand poster · 594 × 841 mm',
    card: {
      heading: 'Start with one piece, not a thousand.',
      blurb: 'Cloth from our makers, woven together with paintings from our moodboard.',
      preview: '/booklet/print/JYT-Melbourne-2026-poster-1-house-of-hands-A1.png',
      pdf: '/booklet/print/JYT-Melbourne-2026-poster-1-house-of-hands-A1.pdf',
    },
    kicker: 'Jaal Yantra Textiles · Luna by JYT',
    headline: { lead: 'Start with one piece,', accent: 'not a thousand.' },
    lede: 'Source handmade textiles from many hands across India, with a price you can predict, line by line.',
    loom: {
      strips: [
        { src: '/booklet/poster/look-red-coat.jpg', pos: '50% 30%', kind: 'look' },
        { src: '/booklet/poster/art-wave.jpg', pos: '24% 50%', kind: 'art' },
        { src: '/booklet/poster/look-embroidered-back.jpg', pos: '50% 40%', kind: 'look' },
        { src: '/booklet/poster/art-valley.jpg', pos: '70% 50%', kind: 'art' },
        { src: '/booklet/poster/look-green-robe.jpg', pos: '50% 35%', kind: 'look' },
        { src: '/booklet/poster/art-garden.jpg', pos: '40% 50%', kind: 'art' },
        { src: '/booklet/poster/look-black-embroidery.jpg', pos: '45% 30%', kind: 'look' },
      ],
      widths: { look: 2.1, art: 1 },
      wefts: [0.36, 0.66, 0.93],
      credit: [
        'Handmade in India · Made to order',
        'Paintings from our moodboard, public museum collections',
      ],
    },
    pills: [
      { title: 'No MOQ', text: 'start from one piece' },
      { title: 'Price first', text: 'a quote before anything is booked' },
      { title: 'Quality checked', text: 'you approve the sample, we review the finished work' },
    ],
    cta: {
      kicker: 'Stand D14 · Melbourne · 17 to 19 November 2026',
      heading: "Let's make something together.",
      text: 'Come and touch the cloth at stand D14, or write to us. Tell us what you are looking for and we will tell you honestly who can make it.',
      contacts: [
        { label: 'Write to us', value: 'hi@jaalyantra.com' },
        { label: 'Web', value: 'jaalyantra.com' },
      ],
    },
    qr: {
      src: '/booklet/qr-brief-poster-1.svg',
      alt: 'QR code to send JYT a brief',
      caption: 'Scan to send us a brief',
      utmContent: 'poster-1',
    },
    foot: {
      left: 'Jaal Yantra Textiles Private Limited · Dharamshala, Himachal Pradesh, India · Jaal Yantra Textiles SIA · Riga, Latvia',
      right: 'हाथ का काम · House of Hands',
    },
  },
  {
    layout: 'supply-line',
    slug: 'supply-line',
    number: 2,
    title: 'Supply Line Poster',
    description:
      'JYT at Global Sourcing Expo Melbourne, 17 to 19 November 2026. A1 stand poster: the supply line across India and Italy, and how an order runs on Luna.',
    webbar: 'A1 stand poster 2 · the supply line · 594 × 841 mm',
    card: {
      heading: 'We bring the makers out of the back room.',
      blurb: 'The supply line across India and Italy, and how an order runs on Luna.',
      preview: '/booklet/print/JYT-Melbourne-2026-poster-2-supply-line-A1.png',
      pdf: '/booklet/print/JYT-Melbourne-2026-poster-2-supply-line-A1.pdf',
    },
    kicker: 'Not tied to one workshop',
    headline: { lead: 'We bring the makers', accent: 'out of the back room.' },
    lede: 'One order can be split by stage, each with its own partner, so it never rests on a single workshop. Every hand-off is on record.',
    facts: [
      { value: '35', text: 'partners producing on Luna today' },
      { value: '15', text: 'online stores running on Luna' },
      { value: '3.5M+', text: "handloom weavers mapped from India's Handloom Census" },
    ],
    map: {
      kicker: 'The supply line',
      heading: ['Partners next to', 'the weaving hubs'],
      note: 'Hubs placed by latitude and longitude · not to scale outside India',
      // Partner stock locations on Luna, booklet page 4 wording.
      hubs: [
        { lat: 34.08, lon: 74.8, place: 'Srinagar & Pulwama', craft: 'Pashmina and wool', side: 'right' },
        { lat: 31.96, lon: 77.11, place: 'Kullu, Himachal', craft: 'wool weaving · Bhuttico', side: 'right' },
        { lat: 32.22, lon: 76.32, place: 'Dharamshala, Himachal', craft: 'embroidery, stitching · JYT home', side: 'left', home: true },
        { lat: 28.61, lon: 77.21, place: 'New Delhi', craft: 'JYT office', side: 'right' },
        { lat: 25.83, lon: 72.24, place: 'Balotara, Rajasthan', craft: 'weaving in the desert · Ielo craft', side: 'left' },
        { lat: 23.22, lon: 69.73, place: 'Bhujodi, Kutch', craft: 'kala cotton · HR Handloom', side: 'left' },
        { lat: 22.73, lon: 71.64, place: 'Surendranagar, Gujarat', craft: 'Tangaliya weave', side: 'right', nudge: 5 },
        { lat: 23.84, lon: 78.74, place: 'Sagar, Madhya Pradesh', craft: 'handloom denim · Shramdaan', side: 'left' },
        { lat: 25.24, lon: 86.97, place: 'Bhagalpur, Bihar', craft: 'silk', side: 'left' },
        { lat: 23.7, lon: 88.4, place: 'Murshidabad & Phulia', craft: 'linen, cotton, silk, Jamdani', side: 'left', nudge: 4 },
        { lat: 20.3, lon: 85.82, place: 'Bhubaneswar, Odisha', craft: 'silk, linen, hand painting', side: 'right' },
        { lat: 16.12, lon: 80.93, place: 'Challapalli, Andhra Pradesh', craft: 'handloom weaving', side: 'right' },
      ],
      away: [
        { id: 'top', kicker: 'Italy', place: 'Greve in Chianti, Tuscany', text: 'Le Ciricotte · handwoven wool, made in their own shop' },
        { id: 'bottom', kicker: 'Australia', place: 'Cobargo, New South Wales', text: 'Woven Futures · a label with roots in the handweaving of India and Italy, making on Luna' },
      ],
    },
    how: {
      heading: 'How an order runs on Luna',
      kicker: 'From a brief to a piece ready to sell',
      steps: [
        { icon: '/booklet/illustrations/designer.svg', title: 'Send a brief', text: 'A sketch, a photo, a swatch or one line about what you want, and how many, even if it is one.' },
        { icon: '/booklet/illustrations/team-desk.svg', title: 'Choose by role', text: 'Pick the cloth with the name of who made it, then the hands for each stage. One partner or several.', chips: ['Fabric', 'Designer', 'Weaver', 'Dyer', 'Embroidery', 'Stitching'] },
        { icon: '/booklet/illustrations/payment.svg', title: 'Get an instant quote', text: 'Real fabric prices with the making in it, every line shown, as a quote link your team can accept. Nothing starts until you do.' },
        { icon: '/booklet/illustrations/dashboard.svg', title: 'Approve a sample, follow it live', text: "Every stage is a task on the maker's phone, with photos as it goes. You follow it in your account." },
        { icon: '/booklet/illustrations/unboxing.svg', title: 'Receive it ready to sell', text: 'Every piece arrives with what you need to list it, its story and provenance attached.', chips: ['Makers', 'Fabric supplier', 'Craft story', 'Photos', 'Energy & water*'] },
      ],
      lead: {
        label: 'Typical lead time',
        times: [
          { days: '20 to 30 days', text: 'from sample approval when the cloth is ready' },
          { days: '30+ days', text: 'when the cloth is woven for your order' },
        ],
        footnote: '* where we measured it',
      },
    },
    app: {
      phones: [
        { src: '/booklet/poster/app/1-list.png', alt: "Partner app: the partner's orders", title: 'Every order', text: "on the maker's phone" },
        { src: '/booklet/poster/app/5-shipment.png', alt: 'Partner app: book a courier', title: 'Sent', text: 'booked, tracked courier' },
        { src: '/booklet/poster/app/3-sheet.png', alt: 'Partner app: record a delivery', title: 'Counted in', text: 'by the next partner' },
      ],
      heading: 'Every partner works in the Luna partner app',
      text: 'On Android and iPhone, partners accept work, start and finish each stage, upload photos and video, book courier pickups and see what they are owed. Each partner is **paid for their own stage** once it is recorded and approved.',
      chainHeading: 'A real order, October 2026',
      chain: [
        { name: 'Shramdaan', role: 'handloom denim, Sagar' },
        { name: 'Embroprint', role: 'embroidery, Dharamshala' },
        { name: 'Sharlho', role: 'stitching, Dharamshala' },
      ],
      chainCaption: 'An embroidered apron, made across three partners on Luna.',
    },
    qr: {
      src: '/booklet/qr-brief-poster-2.svg',
      alt: 'QR code to send JYT a brief',
      caption: 'Scan to send us a brief',
      note: 'Stand D14',
      utmContent: 'poster-2',
    },
  },
  {
    layout: 'sell-anywhere',
    slug: 'sell-anywhere',
    number: 3,
    title: 'Sell Anywhere Poster',
    description:
      'JYT at Global Sourcing Expo Melbourne, 17 to 19 November 2026. A1 stand poster: design once, sell anywhere, with storefront, payments and infrastructure covered.',
    webbar: 'A1 stand poster 3 · sell anywhere · 594 × 841 mm',
    card: {
      heading: 'Design once. Sell it anywhere.',
      blurb: 'Storefront, payments and infrastructure covered, from home to garment.',
      preview: '/booklet/print/JYT-Melbourne-2026-poster-3-sell-anywhere-A1.png',
      pdf: '/booklet/print/JYT-Melbourne-2026-poster-3-sell-anywhere-A1.pdf',
    },
    kicker: 'One window to the makers of India',
    headline: { lead: 'Design once.', accent: 'Sell it anywhere.' },
    lede: 'Join an ecosystem of artisans and craft producers through a **single window**. Every piece arrives **passport ready**, with its story and provenance attached, and we can run the store, the payments and the infrastructure to sell it.',
    proof: {
      label: 'Already making for Australian labels',
      labels: [
        { name: 'Oshen', place: 'Bermagui, NSW' },
        { name: 'Woven Futures', place: 'Cobargo, NSW' },
      ],
    },
    covered: {
      kicker: 'Want to sell it? Everything is covered',
      heading: 'Your store, run on Luna',
      pillars: [
        { title: 'Storefront', text: 'Your own shop on your own domain, in your brand, built and run on Luna. 15 stores already run on it.' },
        { title: 'Payments', text: 'Checkout through Stripe and PayU. Partners are paid only for approved work.' },
        { title: 'Infrastructure', text: 'Hosting, catalogue, stock and orders run for you. No tech team needed.' },
        { title: 'Product passport', text: 'Each piece names its makers and fabric suppliers, with its craft story, ready to list.' },
      ],
      shot: { src: '/storefront-previews/gof-asia.png', alt: 'The gof.asia storefront', caption: 'gof.asia · built and run on Luna' },
      quote: {
        text: '"The platform lets us sell directly to the customer with made-to-order, makes life easy."',
        cite: 'Founder, GOF',
      },
    },
    range: {
      heading: 'Craft anything, from home to garment',
      kicker: 'Made to order · from one piece',
      items: [
        { src: '/booklet/poster/range-coat.jpg', pos: '50% 30%', title: 'Coats & jackets', text: 'handwoven, embroidered' },
        { src: '/booklet/poster/range-shirt.jpg', pos: '50% 25%', title: 'Shirts & tops', text: 'khadi, linen, cotton' },
        { src: '/booklet/poster/range-saree.jpg', pos: '45% 40%', title: 'Sarees', text: 'handloom silk, cotton' },
        { src: '/booklet/poster/range-shawl.jpg', pos: '50% 50%', title: 'Shawls & throws', text: 'wool, Pashmina' },
        { src: '/booklet/poster/range-pashmina.jpg', pos: '50% 30%', title: 'Embroidered stoles', text: 'hand embroidery' },
        { src: '/booklet/poster/range-cushion.jpg', pos: '48% 60%', title: 'Cushions', text: 'handwoven wool' },
        { src: '/booklet/poster/range-tea-towel.jpg', pos: '35% 50%', title: 'Tea towels', text: 'kitchen linen' },
      ],
      also: 'Also **robes, aprons, trousers, quilts, scarves** and cloth by the metre.',
    },
    prices: {
      kicker: 'Real orders, in AUD',
      heading: 'What pieces have cost',
      columns: ['Piece', 'Fabric', 'Making', 'Per piece'],
      rows: [
        ['Robe, kala cotton', 'A$13.30', 'A$15.05', 'A$28.35'],
        ['Robe, handwoven linen', 'A$37.79', 'A$15.05', 'A$52.84'],
        ['Robe, mulberry silk', 'A$59.49', 'A$15.05', 'A$74.54'],
        ['Striped cotton top', 'A$6.49', 'A$12.79', 'A$19.28'],
      ],
      fine: "Before JYT's 20%, tax and shipping. A$1 = ₹66.45 (ECB, 21 October 2026); your quote uses the rate on the day.",
      duty: '**Duty free into Australia** under the India–Australia trade agreement (ECTA). Australian GST still applies.',
    },
    climate: {
      kicker: 'Kala cotton · Bhujodi, Kutch',
      heading: 'The climate champion',
      text: 'An old cotton native to Kutch, grown on rain alone with no irrigation, then handspun and handwoven by HR Handloom.',
      value: '3.3 kWh',
      valueText: 'We measure the energy. Electricity per piece on a 9-piece run of cotton tops, Sharlho, Dharamshala.',
    },
    khadi: {
      kicker: 'Shramdaan · Sagar, MP',
      value: '15,000',
      unit: 'm',
      text: 'of **khadi a month**, woven by hand, for orders that need to grow.',
      looms: '1,080+',
      loomsText: 'handlooms in one partner',
    },
    blends: {
      heading: 'We work at the loom, so you choose the blend',
      swatches: [
        { src: '/booklet/poster/cloth-khadi.jpg', caption: 'Khadi stripe' },
        { src: '/booklet/poster/cloth-linen.jpg', caption: 'Handwoven linen' },
        { src: '/booklet/poster/cloth-cotton.jpg', caption: 'Cotton' },
        { src: '/booklet/poster/cloth-tangaliya.jpg', caption: 'Tangaliya' },
        { src: '/booklet/poster/cloth-wool.jpg', caption: 'Wool herringbone' },
      ],
      chips: ['Khadi', 'Kala cotton', 'Linen', 'Cotton linen', 'Cotton silk', 'Matka silk', 'Mulberry silk', 'Jamdani', 'Tangaliya', 'Handloom denim', 'Pashmina', 'Wool'],
    },
    cta: {
      kicker: 'Stand D14 · Melbourne · 17 to 19 November 2026',
      heading: 'Bring a design. Leave with a supply line.',
      text: 'Talk to us at **stand D14**, or write to **hi@jaalyantra.com**',
    },
    qr: {
      src: '/booklet/qr-brief-poster-3.svg',
      alt: 'QR code to send JYT a brief',
      caption: 'Scan to send us a brief',
      utmContent: 'poster-3',
    },
  },
]

export function posterBySlug(slug: string): Poster | undefined {
  return POSTERS.find((p) => p.slug === slug)
}

/** The poster's colours: defaults, with its own overrides on top. */
export function posterTheme(p: Poster): PosterTheme {
  return { ...DEFAULT_THEME, ...p.theme }
}
