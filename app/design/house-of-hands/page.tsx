import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import {
  CheckRows,
  CostTable,
  Heading,
  HohScope,
  HubsList,
  IllustrationRow,
  ILLUSTRATIONS,
  ImageRangeGrid,
  Kicker,
  Lede,
  NumberedSteps,
  PartnerChain,
  Pillars,
  PriceBuild,
  QrCta,
  Quote,
  RuledGrid,
  Section,
  StatRow,
  TileGrid,
  WovenPanel,
} from '@/components/house-of-hands'
import { POSTERS, type HouseOfHandsPoster, type SellAnywherePoster } from '@/data/melbourne-posters'
import s from './showcase.module.css'

// Internal reference for the House of Hands kit. Not for search engines.
export const metadata: Metadata = {
  title: 'House of Hands Kit',
  description: 'Responsive blocks from the Melbourne 2026 booklet and posters, with real copy.',
  robots: { index: false, follow: false },
}

const hoh = POSTERS.find((p): p is HouseOfHandsPoster => p.layout === 'house-of-hands')!
const sell = POSTERS.find((p): p is SellAnywherePoster => p.layout === 'sell-anywhere')!
const loom = hoh.loom

function Label({ name, props }: { name: string; props: string }) {
  return (
    <div className={s.label}>
      <b>{`<${name}>`}</b>
      <code>{props}</code>
    </div>
  )
}

function Demo({ name, props, children }: { name: string; props: string; children: ReactNode }) {
  return (
    <>
      <Label name={name} props={props} />
      {children}
    </>
  )
}

export default function HouseOfHandsKitPage() {
  return (
    <HohScope className={s.page}>
      <div className={s.intro}>
        <Kicker>Design system · House of Hands</Kicker>
        <Heading lead="The booklet and posters," accent="as web blocks." level={1} size="xl" />
        <Lede text="Every block below is a React component in **components/house-of-hands**, with the copy from the Melbourne booklet and stand posters. Wrap a page in HohScope, put blocks in a Section, and pass the content as props." />
      </div>

      <Demo name="Section + Kicker + Heading + Lede + StatRow" props="tone: paper | paper2 | dark | ink · Heading { lead, accent?, level?, size?, breakBefore? } · StatRow { items: {value, label}[] }">
        <Section tone="paper">
          <Kicker>Jaal Yantra Textiles</Kicker>
          <Heading lead="We bring the makers" accent="out of the back room." />
          <Lede text="The people who make a cloth or a garment are usually lost somewhere between the workshop and the shop. Our work is to bring them out, so the person buying knows where it comes from and who made it." />
          <StatRow
            items={[
              { value: '33', label: 'partners producing on Luna today' },
              { value: '15', label: 'online stores running on Luna' },
              { value: '3.5M+', label: "handloom weavers mapped from India's Handloom Census" },
            ]}
          />
        </Section>
      </Demo>

      <Demo name="RuledGrid" props="items: {title, who?, where?, text?}[] · columns? · accentRule?">
        <Section tone="paper2">
          <Kicker>The first artists</Kicker>
          <Heading lead="The hands" accent="behind the cloth." size="m" />
          <RuledGrid
            items={[
              { title: 'Tangaliya', who: 'Mukesh Bhai Parmar · Tangaliya House', where: 'Surendranagar, Gujarat', text: 'The dotted Tangaliya weave, where each dot is a small twist of yarn worked into the warp by hand.' },
              { title: 'Pashmina', who: 'Mustaq · Unique Pashmina', where: 'Srinagar, Kashmir', text: 'Pashmina shawls and stoles, woven in Srinagar.' },
              { title: 'Handwoven wool', who: 'Azmat Handloom', where: 'Pulwama, Kashmir', text: 'Handwoven wool fabric, made on the loom by hand.' },
              { title: 'Linen, cotton & silk', who: 'GOF · Ghosh & Organic Fashionary', where: 'Murshidabad, West Bengal', text: 'Handloom linen, cotton and silk by the metre and as finished pieces.' },
            ]}
          />
        </Section>
      </Demo>

      <Demo name="WovenPanel" props="strips: {src, pos?, kind: look | art}[] · widths? · wefts? · credit? · height?">
        <Section tone="paper">
          <Kicker>{hoh.kicker}</Kicker>
          <Heading lead={hoh.headline.lead} accent={hoh.headline.accent} breakBefore size="l" />
          <WovenPanel strips={loom.strips} widths={loom.widths} wefts={loom.wefts} credit={loom.credit} />
        </Section>
      </Demo>

      <Demo name="TileGrid + NumberedSteps (list) + IllustrationRow" props="TileGrid { tiles: {title, text}[], columns? } · NumberedSteps { steps: {title, text, illustration?, chips?}[], variant: list } · IllustrationRow { names }">
        <Section tone="paper">
          <Kicker>Artisan, not mass made</Kicker>
          <Heading lead="Start with one piece," accent="not a thousand." />
          <Lede text="If you are looking for the cheapest product, we are not the right place. We source and make artisan pieces, and each one carries its own story, so there is no minimum order. You can start with a single piece." />
          <TileGrid tiles={hoh.pills} />
          <NumberedSteps
            steps={[
              { title: 'Send a brief', text: 'A sketch, a photo, a swatch or one line about what you want, and how many, even if it is one.' },
              { title: 'Pick the cloth and the makers', text: 'Fabric options with the name of who made each one. Choose the partners yourself or let us help you choose: one partner or several, a different one for each stage if you like.' },
              { title: 'Know the cost before you book', text: 'Customisation is part of the work: embroidery, construction and finish are written into the design. You get an estimate from real fabric prices with the making in it, as a quote link your buying team can accept. Nothing starts until you do.' },
              { title: 'Approve a sample, then follow it live', text: "Every stage is a task in our partner app on the maker's phone, with photos as it goes. You follow the progress of your design and order live in your account." },
              { title: 'Receive it with its story', text: 'Who wove it, who stitched it, which supplier the fabric came from, and the energy and water used to make it, where we measured it.' },
            ]}
          />
          <IllustrationRow names={['deal', 'boxes-check', 'delivery']} />
        </Section>
      </Demo>

      <Demo name="NumberedSteps (cards)" props="variant: cards · illustration: one of the 11 names · chips?">
        <Section tone="paper2">
          <Kicker>From a brief to a piece ready to sell</Kicker>
          <Heading lead="How an order runs" accent="on Luna" size="m" />
          <NumberedSteps
            variant="cards"
            steps={[
              { illustration: 'designer', title: 'Send a brief', text: 'A sketch, a photo, a swatch or one line about what you want, and how many, even if it is one.' },
              { illustration: 'team-desk', title: 'Choose by role', text: 'Pick the cloth with the name of who made it, then the hands for each stage. One partner or several.', chips: ['Fabric', 'Designer', 'Weaver', 'Dyer', 'Embroidery', 'Stitching'] },
              { illustration: 'payment', title: 'Get an instant quote', text: 'Real fabric prices with the making in it, every line shown, as a quote link your team can accept. Nothing starts until you do.' },
              { illustration: 'dashboard', title: 'Approve a sample, follow it live', text: "Every stage is a task on the maker's phone, with photos as it goes. You follow it in your account." },
              { illustration: 'unboxing', title: 'Receive it ready to sell', text: 'Every piece arrives with what you need to list it, its story and provenance attached.' },
            ]}
          />
        </Section>
      </Demo>

      <Demo name="Section dark + PartnerChain + RuledGrid + HubsList" props="PartnerChain { links: {role, name, place?}[], caption? } · HubsList { hubs: {place, craft}[] }">
        <Section tone="dark">
          <Kicker>Not tied to one workshop</Kicker>
          <Heading lead="Choose more than" accent="one partner." />
          <Lede text="You are not limited to what one workshop can make. One order can be split by stage, each with its own partner, so it never rests on a single workshop. If one is busy or falls short, another can take that stage and the rest carries on." />
          <PartnerChain
            links={[
              { role: 'Handloom denim', name: 'Shramdaan', place: 'Sagar' },
              { role: 'Embroidery', name: 'Embroprint', place: 'Dharamshala' },
              { role: 'Stitching', name: 'Sharlho', place: 'Dharamshala' },
            ]}
            caption="A real order from October 2026: an embroidered apron, made across three partners on Luna."
          />
          <RuledGrid
            columns={3}
            items={[
              { title: 'Sent', text: 'The partner who finishes a stage sends the goods on with a booked, tracked courier.' },
              { title: 'Counted in', text: 'The next partner counts what arrived in their app. Only then is it received.' },
              { title: 'Paid', text: 'Each partner is paid for their own stage once it is recorded and approved.' },
            ]}
          />
          <HubsList
            hubs={[
              { place: 'Surendranagar, Gujarat', craft: 'Tangaliya weave' },
              { place: 'Balotara, Rajasthan', craft: 'weaving in the desert' },
              { place: 'Srinagar & Pulwama', craft: 'Pashmina and wool' },
              { place: 'Kullu, Himachal', craft: 'wool weaving cluster' },
              { place: 'Dharamshala, Himachal', craft: 'Sharlho, Tibetan collective; embroidery' },
              { place: 'Sagar, Madhya Pradesh', craft: 'Shramdaan workshop' },
              { place: 'Murshidabad & Phulia', craft: 'linen, cotton, silk, Jamdani' },
              { place: 'Bhagalpur, Bihar', craft: 'silk' },
            ]}
          />
        </Section>
      </Demo>

      <Demo name="PartnerChain (light)" props="same component; reads its tone from the Section">
        <Section tone="paper">
          <PartnerChain
            links={[
              { role: 'Handloom denim', name: 'Shramdaan', place: 'Sagar' },
              { role: 'Embroidery', name: 'Embroprint', place: 'Dharamshala' },
              { role: 'Stitching', name: 'Sharlho', place: 'Dharamshala' },
            ]}
          />
        </Section>
      </Demo>

      <Demo name="PriceBuild + TileGrid + CostTable" props="PriceBuild { rows: {label, detail, value, kind?: sub | total}[] } · CostTable { columns, rows: string[][], note? }">
        <Section tone="paper">
          <Kicker>How a price is built</Kicker>
          <Heading lead="A price you can predict," accent="line by line." />
          <Lede text="Every quote is worked out from what the cloth and the making actually cost on real orders. Here is one, start to finish: a robe in GOF mulberry silk, made by Ksaman." />
          <PriceBuild
            rows={[
              { label: 'Fabric', detail: "3.1 m × ₹1,275 per metre, GOF's purchase price", value: 'A$59.49' },
              { label: 'Making', detail: "Ksaman's agreed price per robe, ₹1,000", value: 'A$15.05' },
              { label: 'Cost', detail: "₹4,952.50 at the day's rate, A$1 = ₹66.45", value: 'A$74.54', kind: 'sub' },
              { label: 'JYT', detail: 'our standard 20%, shown on the quote', value: 'A$14.91' },
              { label: 'Your price', detail: 'per robe, before tax and shipping', value: 'A$89.45', kind: 'total' },
            ]}
          />
          <TileGrid
            tiles={[
              { title: 'No guesses', text: 'If a cost is only a guess, Luna will not turn it into a quote. We price it properly first.' },
              { title: "Today's rate", text: 'Converted at the live rate on the day. If the rate cannot be fetched, no quote goes out.' },
              { title: 'Every line shown', text: 'Fabric, making and our share are on the quote, and its prices are fixed when it is issued.' },
            ]}
          />
          <CostTable columns={sell.prices.columns} rows={sell.prices.rows} note={sell.prices.fine} />
        </Section>
      </Demo>

      <Demo name="ImageRangeGrid" props="items: {src, title, text?, pos?, alt?}[] · columns?">
        <Section tone="paper2">
          <Kicker>{sell.range.kicker}</Kicker>
          <Heading lead={sell.range.heading} size="m" />
          <ImageRangeGrid items={sell.range.items.slice(0, 4)} />
        </Section>
      </Demo>

      <Demo name="Section ink + Pillars + Quote" props="Pillars { items: {title, text}[] } · Quote { text, cite? }">
        <Section tone="ink">
          <Kicker>{sell.covered.kicker}</Kicker>
          <Heading lead={sell.covered.heading} size="m" />
          <Pillars items={sell.covered.pillars} />
          <Quote text={sell.covered.quote.text} cite={sell.covered.quote.cite} />
        </Section>
      </Demo>

      <Demo name="CheckRows" props="rows: {title, text}[]">
        <Section tone="paper">
          <Heading lead="Why it is safe" accent="to source with us" size="m" />
          <CheckRows
            rows={[
              { title: 'No single point of failure', text: 'Your order is split by stage across partners.' },
              { title: 'Price agreed first', text: 'You accept the quote before any work starts.' },
              { title: 'Quality checked', text: 'You approve the sample; finished work is reviewed before it is sent on.' },
              { title: 'Safe payments', text: 'Through Stripe and PayU. Partners are paid only for approved work.' },
              { title: 'Live progress', text: 'You follow every stage in your account as it happens.' },
              { title: 'Traceable to the hand', text: 'Each piece names its makers and fabric suppliers.' },
            ]}
          />
        </Section>
      </Demo>

      <Demo name="QrCta" props="kicker? · heading · accent? · text? · contacts: {label, value, href?}[] · qr? {src, alt, caption?} · tone: teal | ink">
        <Section tone="paper">
          <QrCta
            kicker="Melbourne · 17 to 19 November 2026"
            heading="Let's make something together."
            text="Come and touch the cloth at the stand, or write to us. Tell us what you are looking for and we will tell you honestly who can make it."
            contacts={[
              { label: 'Email', value: 'hi@jaalyantra.com', href: 'mailto:hi@jaalyantra.com' },
              { label: 'Web', value: 'jaalyantra.com', href: 'https://jaalyantra.com' },
              { label: 'Partners', value: 'partner.jaalyantra.com', href: 'https://partner.jaalyantra.com' },
            ]}
            qr={{ src: '/booklet/qr-jaalyantra.svg', alt: 'QR code to jaalyantra.com', caption: 'Scan for jaalyantra.com' }}
          />
        </Section>
      </Demo>

      <Demo name="Illustration / IllustrationRow" props={`name: ${ILLUSTRATIONS.join(' | ')} · alt? · width?`}>
        <Section tone="paper2">
          <IllustrationRow names={[...ILLUSTRATIONS]} width={120} />
        </Section>
      </Demo>
    </HohScope>
  )
}
