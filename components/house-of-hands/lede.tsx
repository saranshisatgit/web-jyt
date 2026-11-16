import { Rich } from '@/components/melbourne-poster/rich'
import s from './house-of-hands.module.css'

/** The intro paragraph under a heading. Wrap words in **…** to bold them. */
export function Lede({ text }: { text: string }) {
  return (
    <p className={s.lede}>
      <Rich text={text} />
    </p>
  )
}
