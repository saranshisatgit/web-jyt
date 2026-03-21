'use client';

import React, { useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { handleContactFormSubmission, handleVerifyCode } from '@/app/actions';

const initialFormState = {
  message: '',
  success: false,
  needsVerification: false,
  responseId: '',
};

const initialVerifyState = {
  message: '',
  success: false,
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      aria-disabled={pending}
      disabled={pending}
      className="w-full rounded-full bg-olive-950 px-4 py-[calc(var(--spacing-2,8px)-1px)] text-base font-medium whitespace-nowrap text-white shadow-md hover:bg-olive-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-olive-950 disabled:opacity-50 dark:bg-olive-300 dark:text-olive-950 dark:hover:bg-olive-200"
    >
      {pending ? 'Sending...' : 'Send Message'}
    </button>
  );
}

function VerifyButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      aria-disabled={pending}
      disabled={pending}
      className="w-full rounded-full bg-olive-950 px-4 py-[calc(var(--spacing-2,8px)-1px)] text-base font-medium whitespace-nowrap text-white shadow-md hover:bg-olive-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-olive-950 disabled:opacity-50 dark:bg-olive-300 dark:text-olive-950 dark:hover:bg-olive-200"
    >
      {pending ? 'Verifying...' : 'Verify Code'}
    </button>
  );
}

const ContactForm = () => {
  const [step, setStep] = useState<'form' | 'verify' | 'done'>('form');
  const [responseId, setResponseId] = useState('');
  const [formState, formAction] = useFormState(handleContactFormSubmission, initialFormState);
  const [verifyState, verifyAction] = useFormState(handleVerifyCode, initialVerifyState);

  React.useEffect(() => {
    if (formState.success && formState.needsVerification && formState.responseId) {
      setResponseId(formState.responseId);
      setStep('verify');
    }
  }, [formState]);

  React.useEffect(() => {
    if (verifyState.success) {
      setStep('done');
    }
  }, [verifyState]);

  if (step === 'done') {
    return (
      <div className="rounded-xl bg-white p-7 sm:p-11 shadow-md ring-1 ring-black/5 dark:bg-olive-900 dark:ring-white/10">
        <p className="text-sm/5 text-green-600">
          {verifyState.message || 'Thank you! Your message has been verified.'}
        </p>
      </div>
    );
  }

  if (step === 'verify') {
    return (
      <form action={verifyAction} className="space-y-6 rounded-xl bg-white p-7 sm:p-11 shadow-md ring-1 ring-black/5 dark:bg-olive-900 dark:ring-white/10">
        <input type="hidden" name="response_id" value={responseId} />

        <p className="text-sm/5 text-olive-900">
          We&apos;ve sent a 6-digit code to your email. Please enter it below to verify your submission.
        </p>

        <div>
          <label htmlFor="code" className="block text-sm/5 font-medium text-olive-900 dark:text-white">
            Verification Code
          </label>
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
            className="mt-1 block w-full rounded-lg border-transparent ring-1 ring-black/10 shadow-sm px-[calc(var(--spacing-2,8px)-1px)] py-[calc(var(--spacing-1-5,6px)-1px)] text-base/6 sm:text-sm/6 text-center tracking-[0.3em] focus:outline-2 focus:-outline-offset-1 focus:outline-black focus:ring-0 focus:border-transparent"
          />
        </div>

        <div>
          <VerifyButton />
        </div>

        {verifyState?.message && !verifyState.success && (
          <p className="mt-4 text-sm/5 text-red-600">
            {verifyState.message}
          </p>
        )}
      </form>
    );
  }

  return (
    <form action={formAction} className="space-y-6 rounded-xl bg-white p-7 sm:p-11 shadow-md ring-1 ring-black/5 dark:bg-olive-900 dark:ring-white/10">
      <div>
        <label htmlFor="name" className="block text-sm/5 font-medium text-olive-900 dark:text-white">
          Full Name
        </label>
        <input
          type="text"
          name="name"
          id="name"
          required
          className="mt-1 block w-full rounded-lg border-transparent ring-1 ring-black/10 shadow-sm px-[calc(var(--spacing-2,8px)-1px)] py-[calc(var(--spacing-1-5,6px)-1px)] text-base/6 sm:text-sm/6 focus:outline-2 focus:-outline-offset-1 focus:outline-black focus:ring-0 focus:border-transparent dark:bg-olive-800 dark:text-white dark:ring-white/10 dark:focus:outline-white"
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm/5 font-medium text-olive-900 dark:text-white">
          Email Address
        </label>
        <input
          type="email"
          name="email"
          id="email"
          required
          className="mt-1 block w-full rounded-lg border-transparent ring-1 ring-black/10 shadow-sm px-[calc(var(--spacing-2,8px)-1px)] py-[calc(var(--spacing-1-5,6px)-1px)] text-base/6 sm:text-sm/6 focus:outline-2 focus:-outline-offset-1 focus:outline-black focus:ring-0 focus:border-transparent dark:bg-olive-800 dark:text-white dark:ring-white/10 dark:focus:outline-white"
        />
      </div>
      <div>
        <label htmlFor="company" className="block text-sm/5 font-medium text-olive-900 dark:text-white">
          Company
        </label>
        <input
          type="text"
          name="company"
          id="company"
          className="mt-1 block w-full rounded-lg border-transparent ring-1 ring-black/10 shadow-sm px-[calc(var(--spacing-2,8px)-1px)] py-[calc(var(--spacing-1-5,6px)-1px)] text-base/6 sm:text-sm/6 focus:outline-2 focus:-outline-offset-1 focus:outline-black focus:ring-0 focus:border-transparent dark:bg-olive-800 dark:text-white dark:ring-white/10 dark:focus:outline-white"
        />
      </div>
      <div>
        <label htmlFor="role" className="block text-sm/5 font-medium text-olive-900 dark:text-white">
          Role
        </label>
        <input
          type="text"
          name="role"
          id="role"
          className="mt-1 block w-full rounded-lg border-transparent ring-1 ring-black/10 shadow-sm px-[calc(var(--spacing-2,8px)-1px)] py-[calc(var(--spacing-1-5,6px)-1px)] text-base/6 sm:text-sm/6 focus:outline-2 focus:-outline-offset-1 focus:outline-black focus:ring-0 focus:border-transparent dark:bg-olive-800 dark:text-white dark:ring-white/10 dark:focus:outline-white"
        />
      </div>
      <div>
        <label htmlFor="message" className="block text-sm/5 font-medium text-olive-900 dark:text-white">
          Message
        </label>
        <textarea
          name="message"
          id="message"
          rows={4}
          required
          className="mt-1 block w-full rounded-lg border-transparent ring-1 ring-black/10 shadow-sm px-[calc(var(--spacing-2,8px)-1px)] py-[calc(var(--spacing-1-5,6px)-1px)] text-base/6 sm:text-sm/6 focus:outline-2 focus:-outline-offset-1 focus:outline-black focus:ring-0 focus:border-transparent dark:bg-olive-800 dark:text-white dark:ring-white/10 dark:focus:outline-white"
        />
      </div>

      <div>
        <SubmitButton />
      </div>
      {formState?.message && (
        <p className={`mt-4 text-sm/5 ${formState.success && !formState.needsVerification ? 'text-green-600' : formState.success ? 'text-olive-700' : 'text-red-600'}`}>
          {formState.message}
        </p>
      )}
    </form>
  );
};

export default ContactForm;
