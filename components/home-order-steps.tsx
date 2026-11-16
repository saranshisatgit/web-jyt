import { POSTERS, type SupplyLinePoster } from '@/data/melbourne-posters'
import { HohScope, Section, Kicker, Heading, NumberedSteps, type IllustrationName } from '@/components/house-of-hands'

// The supply-line poster's "How an order runs on Luna" block, on the home page.
// One source: edit the steps in data/melbourne-posters.ts and both update.
const HOW = (POSTERS.find((p) => p.layout === 'supply-line') as SupplyLinePoster).how

const illustrationOf = (icon: string) =>
  icon.split('/').pop()?.replace(/\.svg$/, '') as IllustrationName

export function HomeOrderSteps() {
  return (
    <HohScope>
      <Section tone="paper2" id="order">
        <Kicker>{HOW.kicker}</Kicker>
        <Heading lead="How an order runs" accent="on Luna" />
        <NumberedSteps
          variant="cards"
          steps={HOW.steps.map((st) => ({
            title: st.title,
            text: st.text,
            chips: st.chips,
            illustration: illustrationOf(st.icon),
          }))}
        />
        <p style={{ margin: '1rem 0 0', fontSize: 13, color: 'var(--hoh-ink-mute, #6a6e76)' }}>{HOW.lead.footnote}</p>
      </Section>
    </HohScope>
  )
}
