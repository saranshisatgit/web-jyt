'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@medusajs/ui'
import { useSearchParams } from 'next/navigation'
import { Navbar } from '@/components/navbar'
import { useBrand } from '@/app/context/brand-context'
import { checkUnsubscribeStatus, unsubscribeByEmail } from '@/medu/queries'

type PageState =
  | { kind: 'loading' }
  | { kind: 'error'; msg: string }
  | { kind: 'confirm'; email: string; maskedEmail: string | null }
  | { kind: 'unsubscribed'; maskedEmail: string | null; alreadyOff: boolean }
  | { kind: 'staying' }

const DOMAIN = 'jaalyantra.com'

export default function UnsubscribePage() {
  const brand = useBrand()
  const searchParams = useSearchParams()
  const id = searchParams.get('id') || undefined
  const initialEmail = searchParams.get('email') || undefined

  const [state, setState] = useState<PageState>({ kind: 'loading' })
  const [emailInput, setEmailInput] = useState(initialEmail || '')

  useEffect(() => {
    if (!id && !initialEmail) {
      setState({ kind: 'confirm', email: '', maskedEmail: null })
      return
    }

    checkUnsubscribeStatus(DOMAIN, { id, email: initialEmail }).then((res) => {
      if (res.error) {
        setState({ kind: 'error', msg: res.error })
        return
      }
      if (res.found && res.email) {
        setState({ kind: 'confirm', email: res.email, maskedEmail: res.email })
      } else {
        setState({ kind: 'confirm', email: initialEmail || '', maskedEmail: null })
      }
    })
  }, [id, initialEmail])

  const handleUnsubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    setState({ kind: 'loading' })

    const res = await unsubscribeByEmail(DOMAIN, { id, email: emailInput || undefined })
    if (res.error) {
      setState({ kind: 'error', msg: res.error })
      return
    }
    setState({ kind: 'unsubscribed', maskedEmail: res.email ?? null, alreadyOff: !!res.already_off })
  }

  const handleStay = () => {
    setState({ kind: 'staying' })
  }

  if (state.kind === 'loading') {
    return (
      <main>
        <Navbar />
        <section className="kt-section" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center' }}>
          <div className="container" style={{ textAlign: 'center' }}>
            <div className="kt-eyebrow" style={{ justifyContent: 'center' }}>&nbsp;</div>
            <p className="muted" style={{ fontSize: '15px', marginTop: '20px' }}>One moment…</p>
          </div>
        </section>
      </main>
    )
  }

  if (state.kind === 'error') {
    return (
      <main>
        <Navbar />
        <section className="kt-section" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center' }}>
          <div className="container" style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto' }}>
            <div className="kt-eyebrow" style={{ justifyContent: 'center' }}>something went wrong</div>
            <p className="muted" style={{ fontSize: '17px', lineHeight: 1.55, marginTop: '16px' }}>
              {state.msg}
            </p>
            <div style={{ marginTop: '24px' }}>
              <Button asChild variant="secondary"><Link href="/">Back to the loom</Link></Button>
            </div>
          </div>
        </section>
      </main>
    )
  }

  if (state.kind === 'unsubscribed') {
    return (
      <main>
        <Navbar />
        <section className="kt-section" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center' }}>
          <div className="container" style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto' }}>
            <div className="kt-eyebrow" style={{ justifyContent: 'center' }}>unsubscribed</div>
            <h1 className="kt-display m" style={{ marginTop: '20px' }}>
              {state.alreadyOff ? 'Already off the list' : "You're off the list"}
            </h1>
            {state.maskedEmail && (
              <p className="muted" style={{ fontSize: '14px', marginTop: '12px' }}>
                {state.maskedEmail}
              </p>
            )}
            <p className="muted" style={{ fontSize: '17px', lineHeight: 1.55, marginTop: '16px' }}>
              {state.alreadyOff
                ? "You weren't on our list to begin with. No harm done."
                : "We'll miss having you. If you ever change your mind, the door's always open."}
            </p>
            <div style={{ marginTop: '36px' }}>
              <Button asChild variant="secondary"><Link href="/">Back to the loom</Link></Button>
            </div>
          </div>
        </section>
      </main>
    )
  }

  if (state.kind === 'staying') {
    return (
      <main>
        <Navbar />
        <section className="kt-section" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center' }}>
          <div className="container" style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto' }}>
            <div className="kt-eyebrow" style={{ justifyContent: 'center' }}>welcome back</div>
            <h1 className="kt-display m" style={{ marginTop: '20px' }}>You made the right choice</h1>
            <p className="muted" style={{ fontSize: '17px', lineHeight: 1.55, marginTop: '16px' }}>
              Your 50% discount code is waiting. Use <strong style={{ color: 'var(--ink)' }}>LOOM50</strong> at checkout on your next handloom piece.
            </p>
            <div style={{ marginTop: '36px', display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button asChild><Link href="/">Start shopping</Link></Button>
              <Button asChild variant="secondary"><Link href="/blog">Read our journal</Link></Button>
            </div>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main>
      <Navbar />
      <section className="kt-section" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center' }}>
        <div className="container">
          <div style={{ maxWidth: '640px', margin: '0 auto' }}>
            <div className="kt-eyebrow">unsubscribe</div>
            <h1 className="kt-display m" style={{ marginTop: '20px' }}>
              Are you sure?
            </h1>

            {state.maskedEmail && (
              <p className="kt-meta" style={{ marginTop: '12px' }}>
                {state.maskedEmail}
              </p>
            )}

            <div className="kt-callout" style={{ marginTop: '32px', flexDirection: 'column', alignItems: 'flex-start', gap: '16px' }}>
              <p style={{ fontSize: '15px', lineHeight: 1.6 }}>
                We send <strong>one email a month</strong>. No spam, no noise — just real stories
                from the makers behind the loom. Interviews, process notes, things we&apos;ve learned
                making textiles the slow way.
              </p>
              <p style={{ fontSize: '15px', lineHeight: 1.6 }}>
                The truth is — we&apos;re so quiet you&apos;d actually <em>miss</em> our email.
                It&apos;s the kind of read that makes you stop scrolling for five minutes.
              </p>
            </div>

            <div className="kt-callout dark" style={{ marginTop: '24px', flexDirection: 'column', alignItems: 'flex-start', gap: '16px' }}>
              <div className="kt-eyebrow on-dark">stay — get 50% off</div>
              <p style={{ fontSize: '15px', lineHeight: 1.6, color: 'var(--cream-warm)', opacity: 0.9 }}>
                Don&apos;t go. As a thank you for staying, here&apos;s <strong>50% off</strong> your
                next handloom piece. Use code <strong style={{ fontFamily: 'var(--font-mono)', letterSpacing: '0.05em' }}>LOOM50</strong> — no
                expiry, no strings.
              </p>
              <Button type="button" variant="secondary" onClick={handleStay}>
                I&apos;ll stay — claim my discount
              </Button>
            </div>

            <form onSubmit={handleUnsubscribe} style={{ marginTop: '40px' }}>
              <div className="kt-field">
                <label className="kt-label" htmlFor="email">Your email</label>
                <div className="kt-inline-form">
                  <input
                    id="email"
                    type="email"
                    required
                    className="kt-input"
                    placeholder="you@example.com"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                  />
                  <Button type="submit" variant="secondary" style={{ flexShrink: 0 }}>
                    Unsubscribe
                  </Button>
                </div>
              </div>
            </form>

            <div style={{ marginTop: '24px' }}>
              <Link className="kt-link" href="/">Back to {brand.wordmark}</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
