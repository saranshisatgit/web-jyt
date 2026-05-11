import Link from 'next/link'
import { Mark } from '@/components/logo'
import { Checkbox, Field, Input, Label } from '@headlessui/react'
import { CheckIcon } from '@heroicons/react/16/solid'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Login',
  description: 'Sign in to your account to continue.',
}

export default function Login() {
  return (
    <main>
      <section
        className="kt-section"
        style={{ padding: '80px 0', minHeight: '100vh', display: 'flex', alignItems: 'center' }}
      >
        <div className="container">
          <div
            style={{
              maxWidth: '440px',
              margin: '0 auto',
              background: 'var(--cream)',
              border: '1px solid var(--rule)',
              padding: '40px',
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
            }}
          >
            <Link href="/" title="Home" style={{ alignSelf: 'flex-start', color: 'var(--ink)' }}>
              <Mark className="h-9" />
            </Link>
            <div>
              <h1 className="kt-display s" style={{ marginBottom: '8px' }}>
                Welcome back.
              </h1>
              <p className="muted" style={{ fontSize: '15px', margin: 0 }}>
                Sign in to your account to continue.
              </p>
            </div>
            <form
              action="#"
              method="POST"
              style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
            >
              <Field className="kt-field">
                <Label className="kt-label">Email</Label>
                <Input
                  required
                  autoFocus
                  type="email"
                  name="email"
                  className="kt-input"
                />
              </Field>
              <Field className="kt-field">
                <Label className="kt-label">Password</Label>
                <Input
                  required
                  type="password"
                  name="password"
                  className="kt-input"
                />
              </Field>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '14px',
                }}
              >
                <Field style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Checkbox
                    name="remember-me"
                    className="group block size-4 rounded-sm border border-transparent ring-1 shadow-sm ring-black/10 focus:outline-hidden data-checked:bg-black data-checked:ring-black data-focus:outline data-focus:outline-2 data-focus:outline-offset-2 data-focus:outline-black"
                  >
                    <CheckIcon className="fill-white opacity-0 group-data-checked:opacity-100" />
                  </Checkbox>
                  <Label style={{ color: 'var(--ink)' }}>Remember me</Label>
                </Field>
                <Link
                  href="#"
                  style={{ color: 'var(--accent-deep)', textDecoration: 'underline' }}
                >
                  Forgot password?
                </Link>
              </div>
              <button
                type="submit"
                className="kt-btn"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                Sign in
              </button>
            </form>
            <p
              className="kt-meta"
              style={{ textAlign: 'center', color: 'var(--ink-soft)' }}
            >
              Not a member?{' '}
              <Link
                href="#"
                style={{ color: 'var(--accent-deep)', textDecoration: 'underline' }}
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
