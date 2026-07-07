'use client'

import React, { useState } from 'react'
import { Button } from '@medusajs/ui'
import { subscribeToUpdates, SubscriptionPayload } from '@/medu/queries'

interface SubscribeFormProps {
  domainName: string
}

const SubscribeForm: React.FC<SubscribeFormProps> = ({ domainName }) => {
  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState<{ kind: 'idle' | 'ok' | 'err'; msg?: string }>({
    kind: 'idle',
  })

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (isLoading) return
    if (!email || !firstName || !lastName) {
      setStatus({ kind: 'err', msg: 'Please fill in all fields.' })
      return
    }
    setIsLoading(true)
    setStatus({ kind: 'idle' })

    const payload: SubscriptionPayload = {
      email,
      first_name: firstName,
      last_name: lastName,
    }
    try {
      const response = await subscribeToUpdates(domainName, payload)
      if (response.error) {
        setStatus({ kind: 'err', msg: response.error })
      } else {
        setStatus({ kind: 'ok', msg: response.message || 'Subscribed.' })
        setEmail('')
        setFirstName('')
        setLastName('')
      }
    } catch (err) {
      console.error('Subscription error:', err)
      setStatus({ kind: 'err', msg: 'An unexpected error occurred. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  const statusColor =
    status.kind === 'ok'
      ? 'oklch(0.55 0.15 145)'
      : status.kind === 'err'
        ? 'var(--accent-deep)'
        : 'var(--ink-soft)'

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12" style={{ alignItems: 'center' }}>
      <div>
        <div className="kt-eyebrow">Subscribe</div>
        <h3 className="kt-display s" style={{ marginTop: '12px', marginBottom: '16px' }}>
          Stories from <em>the workshop</em>.
        </h3>
        <p className="muted" style={{ fontSize: '17px', lineHeight: 1.55, margin: 0 }}>
          One letter per quarter — field notes, product updates, and how we&apos;re thinking about
          provenance, production, and platform.
        </p>
      </div>
      <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div className="grid grid-cols-2 gap-3">
          <div className="kt-field">
            <label htmlFor="firstName" className="kt-label">First name</label>
            <input
              id="firstName"
              type="text"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              disabled={isLoading}
              className="kt-input"
              placeholder="First"
            />
          </div>
          <div className="kt-field">
            <label htmlFor="lastName" className="kt-label">Last name</label>
            <input
              id="lastName"
              type="text"
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              disabled={isLoading}
              className="kt-input"
              placeholder="Last"
            />
          </div>
        </div>
        <div className="kt-field">
          <label htmlFor="email" className="kt-label">Email</label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            className="kt-input"
            placeholder="you@somewhere.com"
          />
        </div>
        <Button
          type="submit"
          isLoading={isLoading}
          style={{ width: '100%' }}
        >
          Subscribe →
        </Button>
        {status.msg && (
          <p className="kt-meta" style={{ color: statusColor, margin: 0, minHeight: '18px' }}>
            {status.msg}
          </p>
        )}
      </form>
    </div>
  )
}

export default SubscribeForm
