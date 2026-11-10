'use client'

import React, { useState } from 'react'
import { Button } from '@medusajs/ui'
import { useFormState, useFormStatus } from 'react-dom'
import {
  handleGrievanceSubmission,
  handleGrievanceVerify,
  type GrievanceFormState,
} from '@/app/actions'

const initialFormState: GrievanceFormState = { message: '', success: false }
const initialVerifyState = { message: '', success: false }

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" isLoading={pending} style={{ width: '100%' }}>
      {label}
    </Button>
  )
}

type StatusKind = 'ok' | 'err' | 'info'

function statusColor(kind: StatusKind): string {
  if (kind === 'ok') return 'oklch(0.55 0.15 145)'
  if (kind === 'err') return 'var(--accent-deep)'
  return 'var(--ink-soft)'
}

/**
 * Grievance form (B Corp PSG 3.1.1). Persona is pre-tagged by the route.
 * Named submissions verify by email like the contact form; anonymous
 * submissions omit identity entirely and get their reference on completion.
 */
export function GrievanceForm({
  persona,
  personaName,
  categories,
  email,
}: {
  persona: string
  personaName: string
  categories: string[]
  email: string
}) {
  const [step, setStep] = useState<'form' | 'verify' | 'done'>('form')
  const [anonymous, setAnonymous] = useState(false)
  const [reference, setReference] = useState('')
  const [formState, formAction] = useFormState(handleGrievanceSubmission, initialFormState)
  const [verifyState, verifyAction] = useFormState(handleGrievanceVerify, initialVerifyState)

  React.useEffect(() => {
    if (formState.success && formState.needsVerification && formState.responseId) {
      setReference(formState.responseId)
      setStep('verify')
    } else if (formState.success) {
      setReference(formState.responseId ?? '')
      setStep('done')
    }
  }, [formState])

  React.useEffect(() => {
    if (verifyState.success) setStep('done')
  }, [verifyState])

  if (step === 'done') {
    return (
      <div className="kt-card" style={{ gap: 16 }}>
        <div className="kt-meta" style={{ color: statusColor('ok') }}>
          Logged
        </div>
        <p className="serif" style={{ fontSize: 20, lineHeight: 1.45, margin: 0 }}>
          {anonymous
            ? 'Your grievance has been logged anonymously.'
            : verifyState.message || formState.message || 'Your grievance has been logged.'}
        </p>
        {reference && (
          <div className="kt-field">
            <span className="kt-label">Your reference</span>
            <code
              className="font-mono"
              style={{
                display: 'inline-block',
                padding: '8px 14px',
                fontSize: 13,
                borderRadius: 'var(--r-md)',
                background: 'var(--surface-tint)',
                border: '1px solid var(--rule-soft)',
                color: 'var(--ink)',
                wordBreak: 'break-all',
              }}
            >
              {reference}
            </code>
          </div>
        )}
        <p className="muted" style={{ fontSize: 14, lineHeight: 1.55, margin: 0 }}>
          {anonymous
            ? 'We cannot send you updates without contact details — quote your reference to ask for status at any time.'
            : 'You will receive each step in the resolution process and the outcome at your email.'}{' '}
          Mail us any time at{' '}
          <a href={`mailto:${email}`} style={{ color: 'var(--accent-deep)' }}>
            {email}
          </a>
          .
        </p>
      </div>
    )
  }

  if (step === 'verify') {
    return (
      <form action={verifyAction} className="kt-card" style={{ gap: 20 }}>
        <input type="hidden" name="response_id" value={reference} />
        <div className="kt-meta">Verify</div>
        <p style={{ fontSize: 16, color: 'var(--ink)', margin: 0, lineHeight: 1.5 }}>
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
        <SubmitButton label="Verify code" />
        {verifyState?.message && !verifyState.success && (
          <p className="kt-meta" style={{ color: statusColor('err'), margin: 0 }}>
            {verifyState.message}
          </p>
        )}
      </form>
    )
  }

  return (
    <form action={formAction} className="kt-card" style={{ gap: 20 }}>
      <input type="hidden" name="persona" value={persona} />
      <input type="hidden" name="anonymous" value={anonymous ? 'true' : 'false'} />

      {/* Named / anonymous segmented control */}
      <div>
        <span className="kt-label" style={{ display: 'block', marginBottom: 8 }}>
          Submit as
        </span>
        <div
          className="inline-flex flex-wrap gap-1 p-1"
          style={{
            borderRadius: 'var(--r-md)',
            background: 'var(--bg-soft)',
            border: '1px solid var(--rule-soft)',
            width: 'fit-content',
          }}
        >
          {[
            { id: false, label: 'Named' },
            { id: true, label: 'Anonymous' },
          ].map((mode) => (
            <button
              key={mode.label}
              type="button"
              onClick={() => setAnonymous(mode.id)}
              className="px-4 py-2 text-sm cursor-pointer"
              style={{
                borderRadius: 'calc(var(--r-md) - 3px)',
                border: 'none',
                background: anonymous === mode.id ? 'var(--bg)' : 'transparent',
                color: anonymous === mode.id ? 'var(--ink)' : 'var(--ink-mute)',
                fontWeight: anonymous === mode.id ? 600 : 400,
                boxShadow: anonymous === mode.id ? '0 1px 3px oklch(0 0 0 / 0.08)' : 'none',
              }}
            >
              {mode.label}
            </button>
          ))}
        </div>
        <p className="muted" style={{ fontSize: 13, margin: '10px 0 0', lineHeight: 1.5 }}>
          {anonymous
            ? 'No name, no email — nothing that could identify you. You will get a reference number to check status.'
            : 'Named grievances get email verification, every step communicated, and the outcome in writing.'}
        </p>
      </div>

      {!anonymous && (
        <>
          <div className="kt-field">
            <label htmlFor="name" className="kt-label">Full name</label>
            <input type="text" name="name" id="name" required className="kt-input" />
          </div>
          <div className="kt-field">
            <label htmlFor="email" className="kt-label">Email</label>
            <input type="email" name="email" id="email" required className="kt-input" />
          </div>
        </>
      )}

      <div className="kt-field">
        <label htmlFor="category" className="kt-label">
          What is it about?
        </label>
        <select name="category" id="category" required className="kt-input" defaultValue="">
          <option value="" disabled>
            Choose a category —
          </option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="kt-field">
        <label htmlFor="description" className="kt-label">
          What happened?
        </label>
        <textarea
          name="description"
          id="description"
          rows={5}
          required
          className="kt-textarea"
          placeholder="A clear account is enough — you do not need proof to start."
        />
      </div>

      <div className="kt-field">
        <label htmlFor="desired_outcome" className="kt-label">
          What would resolve it for you? (optional)
        </label>
        <textarea name="desired_outcome" id="desired_outcome" rows={2} className="kt-textarea" />
      </div>

      <label
        htmlFor="consent"
        style={{ display: 'flex', gap: 10, fontSize: 13, lineHeight: 1.5, color: 'var(--ink-soft)', cursor: 'pointer' }}
      >
        <input type="checkbox" id="consent" name="consent" required style={{ marginTop: 3 }} />
        <span>
          I understand my grievance will be handled under the published procedure — 5 business
          days to acknowledge, 10 to accept or decline, a 30-day target to resolve — and that
          raising it in good faith can never be held against me{' '}
          {personaName ? `as a ${personaName.toLowerCase()}` : ''}.
        </span>
      </label>

      <SubmitButton label="Raise grievance" />

      {formState?.message && !formState.success && (
        <p className="kt-meta" style={{ color: statusColor('err'), margin: 0 }}>
          {formState.message}
        </p>
      )}
    </form>
  )
}
