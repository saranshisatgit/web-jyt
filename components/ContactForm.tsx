'use client'

import React, { useState } from 'react'
import { useFormState, useFormStatus } from 'react-dom'
import { useSearchParams } from 'next/navigation'
import { handleContactFormSubmission, handleVerifyCode } from '@/app/actions'

const initialFormState = {
  message: '',
  success: false,
  needsVerification: false,
  responseId: '',
}

const initialVerifyState = {
  message: '',
  success: false,
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      aria-disabled={pending}
      disabled={pending}
      className="kt-btn"
      style={{ width: '100%', justifyContent: 'center' }}
    >
      {pending ? 'Sending…' : 'Send message'}
    </button>
  )
}

function VerifyButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      aria-disabled={pending}
      disabled={pending}
      className="kt-btn"
      style={{ width: '100%', justifyContent: 'center' }}
    >
      {pending ? 'Verifying…' : 'Verify code'}
    </button>
  )
}

type StatusKind = 'ok' | 'err' | 'info'

function statusColor(kind: StatusKind): string {
  if (kind === 'ok') return 'oklch(0.55 0.15 145)'
  if (kind === 'err') return 'var(--accent-deep)'
  return 'var(--ink-soft)'
}

const cardStyle: React.CSSProperties = {
  padding: '32px',
  background: 'var(--cream)',
  border: '1px solid var(--rule)',
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
}

const ContactForm = () => {
  const [step, setStep] = useState<'form' | 'verify' | 'done'>('form')
  const [responseId, setResponseId] = useState('')
  const [formState, formAction] = useFormState(handleContactFormSubmission, initialFormState)
  const [verifyState, verifyAction] = useFormState(handleVerifyCode, initialVerifyState)
  const searchParams = useSearchParams()
  const prefilledMessage = searchParams?.get('prompt') ?? ''

  React.useEffect(() => {
    if (formState.success && formState.needsVerification && formState.responseId) {
      setResponseId(formState.responseId)
      setStep('verify')
    }
  }, [formState])

  React.useEffect(() => {
    if (verifyState.success) {
      setStep('done')
    }
  }, [verifyState])

  if (step === 'done') {
    return (
      <div style={cardStyle}>
        <div className="kt-meta" style={{ color: statusColor('ok') }}>
          Verified
        </div>
        <p className="serif" style={{ fontSize: '20px', lineHeight: 1.45, margin: 0 }}>
          {verifyState.message || 'Thanks. Your message has been verified — we will be in touch.'}
        </p>
      </div>
    )
  }

  if (step === 'verify') {
    return (
      <form action={verifyAction} style={cardStyle}>
        <input type="hidden" name="response_id" value={responseId} />
        <div className="kt-meta">Verify</div>
        <p style={{ fontSize: '16px', color: 'var(--ink)', margin: 0, lineHeight: 1.5 }}>
          We&apos;ve sent a 6-digit code to your email. Enter it below to verify.
        </p>

        <div className="kt-field">
          <label htmlFor="code" className="kt-label">Verification code</label>
          <input
            type="text"
            name="code"
            id="code"
            required
            maxLength={6}
            pattern="[0-9]{6}"
            inputMode="numeric"
            autoComplete="one-time-code"
            placeholder="000000"
            className="kt-input"
            style={{ textAlign: 'center', letterSpacing: '0.3em', fontFamily: 'var(--font-mono)' }}
          />
        </div>

        <VerifyButton />

        {verifyState?.message && !verifyState.success && (
          <p className="kt-meta" style={{ color: statusColor('err'), margin: 0 }}>
            {verifyState.message}
          </p>
        )}
      </form>
    )
  }

  return (
    <form action={formAction} style={cardStyle}>
      <div className="kt-field">
        <label htmlFor="name" className="kt-label">Full name</label>
        <input type="text" name="name" id="name" required className="kt-input" />
      </div>
      <div className="kt-field">
        <label htmlFor="email" className="kt-label">Email</label>
        <input type="email" name="email" id="email" required className="kt-input" />
      </div>
      <div className="kt-field">
        <label htmlFor="company" className="kt-label">Company</label>
        <input type="text" name="company" id="company" className="kt-input" />
      </div>
      <div className="kt-field">
        <label htmlFor="role" className="kt-label">Role</label>
        <input type="text" name="role" id="role" className="kt-input" />
      </div>
      <div className="kt-field">
        <label htmlFor="message" className="kt-label">Message</label>
        <textarea
          name="message"
          id="message"
          rows={4}
          required
          defaultValue={prefilledMessage}
          className="kt-textarea"
        />
      </div>

      <SubmitButton />

      {formState?.message && (
        <p
          className="kt-meta"
          style={{
            color: statusColor(
              formState.success && !formState.needsVerification
                ? 'ok'
                : formState.success
                  ? 'info'
                  : 'err'
            ),
            margin: 0,
          }}
        >
          {formState.message}
        </p>
      )}
    </form>
  )
}

export default ContactForm
