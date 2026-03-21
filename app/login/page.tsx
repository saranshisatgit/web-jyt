import { Button } from '@/components/button'
import { GradientBackground } from '@/components/gradient'
import { Link } from '@/components/link'
import { Mark } from '@/components/logo'
import { Checkbox, Field, Input, Label } from '@headlessui/react'
import { CheckIcon } from '@heroicons/react/16/solid'
import { clsx } from 'clsx'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Login',
  description: 'Sign in to your account to continue.',
}

export default function Login() {
  return (
    <main className="bg-olive-50 dark:bg-olive-950">
      <GradientBackground />
      <div className="isolate flex min-h-dvh items-center justify-center p-6 lg:p-8">
        <div className="w-full max-w-md rounded-xl bg-white ring-1 shadow-md ring-black/5 dark:bg-olive-900 dark:ring-white/10">
          <form action="#" method="POST" className="p-7 sm:p-11">
            <div className="flex items-start">
              <Link href="/" title="Home">
                <Mark className="h-9 fill-black dark:fill-white" />
              </Link>
            </div>
            <h1 className="mt-8 text-base/6 font-medium text-olive-950 dark:text-white">Welcome back!</h1>
            <p className="mt-1 text-sm/5 text-olive-600 dark:text-olive-400">
              Sign in to your account to continue.
            </p>
            <Field className="mt-8 space-y-3">
              <Label className="text-sm/5 font-medium text-olive-950 dark:text-white">Email</Label>
              <Input
                required
                autoFocus
                type="email"
                name="email"
                className={clsx(
                  'block w-full rounded-lg border border-transparent ring-1 shadow-sm ring-black/10 dark:ring-white/10 dark:bg-olive-800 dark:text-white',
                  'px-[calc(--spacing(2)-1px)] py-[calc(--spacing(1.5)-1px)] text-base/6 sm:text-sm/6',
                  'data-focus:outline data-focus:outline-2 data-focus:-outline-offset-1 data-focus:outline-black dark:data-focus:outline-white',
                )}
              />
            </Field>
            <Field className="mt-8 space-y-3">
              <Label className="text-sm/5 font-medium text-olive-950 dark:text-white">Password</Label>
              <Input
                required
                type="password"
                name="password"
                className={clsx(
                  'block w-full rounded-lg border border-transparent ring-1 shadow-sm ring-black/10 dark:ring-white/10 dark:bg-olive-800 dark:text-white',
                  'px-[calc(--spacing(2)-1px)] py-[calc(--spacing(1.5)-1px)] text-base/6 sm:text-sm/6',
                  'data-focus:outline data-focus:outline-2 data-focus:-outline-offset-1 data-focus:outline-black dark:data-focus:outline-white',
                )}
              />
            </Field>
            <div className="mt-8 flex items-center justify-between text-sm/5">
              <Field className="flex items-center gap-3">
                <Checkbox
                  name="remember-me"
                  className={clsx(
                    'group block size-4 rounded-sm border border-transparent ring-1 shadow-sm ring-black/10 focus:outline-hidden dark:ring-white/10',
                    'data-checked:bg-black data-checked:ring-black dark:data-checked:bg-white dark:data-checked:ring-white',
                    'data-focus:outline data-focus:outline-2 data-focus:outline-offset-2 data-focus:outline-black dark:data-focus:outline-white',
                  )}
                >
                  <CheckIcon className="fill-white opacity-0 group-data-checked:opacity-100 dark:fill-olive-950" />
                </Checkbox>
                <Label className="text-olive-950 dark:text-white">Remember me</Label>
              </Field>
              <Link href="#" className="font-medium text-olive-950 hover:text-olive-600 dark:text-white dark:hover:text-olive-300">
                Forgot password?
              </Link>
            </div>
            <div className="mt-8">
              <Button type="submit" className="w-full">
                Sign in
              </Button>
            </div>
          </form>
          <div className="m-1.5 rounded-lg bg-olive-50 py-4 text-center text-sm/5 ring-1 ring-black/5 dark:bg-olive-800 dark:ring-white/5 dark:text-white">
            Not a member?{' '}
            <Link href="#" className="font-medium hover:text-olive-600 dark:hover:text-olive-300">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
