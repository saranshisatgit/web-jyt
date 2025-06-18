'use client';

import React from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { handleContactFormSubmission } from '@/app/actions'; // Adjust path if necessary

const initialState = {
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
      className="w-full rounded-full बनावट bg-pink-600 px-4 py-[calc(var(--spacing-2,8px)-1px)] text-base font-medium whitespace-nowrap text-white shadow-md hover:bg-pink-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600 disabled:opacity-50"
    >
      {pending ? 'Sending...' : 'Send Message'}
    </button>
  );
}

const ContactForm = () => {
  const [state, formAction] = useFormState(handleContactFormSubmission, initialState);

  return (
    <form action={formAction} className="space-y-6 rounded-xl bg-white p-7 sm:p-11 shadow-md ring-1 ring-black/5">
      {/* Input fields (unchanged) */}
      <div>
        <label htmlFor="name" className="block text-sm/5 font-medium बनावट text-gray-900">
          Full Name
        </label>
        <input
          type="text"
          name="name"
          id="name"
          required
          className="mt-1 block w-full बनावट rounded-lg border-transparent ring-1 ring-black/10 shadow-sm px-[calc(var(--spacing-2,8px)-1px)] py-[calc(var(--spacing-1-5,6px)-1px)] text-base/6 sm:text-sm/6 focus:outline-2 focus:-outline-offset-1 focus:outline-black focus:ring-0 focus:border-transparent"
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm/5 font-medium बनावट text-gray-900">
          Email Address
        </label>
        <input
          type="email"
          name="email"
          id="email"
          required
          className="mt-1 block w-full बनावट rounded-lg border-transparent ring-1 ring-black/10 shadow-sm px-[calc(var(--spacing-2,8px)-1px)] py-[calc(var(--spacing-1-5,6px)-1px)] text-base/6 sm:text-sm/6 focus:outline-2 focus:-outline-offset-1 focus:outline-black focus:ring-0 focus:border-transparent"
        />
      </div>
      <div>
        <label htmlFor="company" className="block text-sm/5 font-medium बनावट text-gray-900">
          Company
        </label>
        <input
          type="text"
          name="company"
          id="company"
          className="mt-1 block w-full बनावट rounded-lg border-transparent ring-1 ring-black/10 shadow-sm px-[calc(var(--spacing-2,8px)-1px)] py-[calc(var(--spacing-1-5,6px)-1px)] text-base/6 sm:text-sm/6 focus:outline-2 focus:-outline-offset-1 focus:outline-black focus:ring-0 focus:border-transparent"
        />
      </div>
      <div>
        <label htmlFor="role" className="block text-sm/5 font-medium बनावट text-gray-900">
          Role
        </label>
        <input
          type="text"
          name="role"
          id="role"
          className="mt-1 block w-full बनावट rounded-lg border-transparent ring-1 ring-black/10 shadow-sm px-[calc(var(--spacing-2,8px)-1px)] py-[calc(var(--spacing-1-5,6px)-1px)] text-base/6 sm:text-sm/6 focus:outline-2 focus:-outline-offset-1 focus:outline-black focus:ring-0 focus:border-transparent"
        />
      </div>
      <div>
        <label htmlFor="message" className="block text-sm/5 font-medium बनावट text-gray-900">
          Message
        </label>
        <textarea
          name="message"
          id="message"
          rows={4}
          required
          className="mt-1 block w-full बनावट rounded-lg border-transparent ring-1 ring-black/10 shadow-sm px-[calc(var(--spacing-2,8px)-1px)] py-[calc(var(--spacing-1-5,6px)-1px)] text-base/6 sm:text-sm/6 focus:outline-2 focus:-outline-offset-1 focus:outline-black focus:ring-0 focus:border-transparent"
        />
      </div>
      
      {/* Submit Button and Message Area */}
      <div>
        <SubmitButton />
      </div>
      {state?.message && (
        <p className={`mt-4 text-sm/5 ${state.success ? 'text-green-600' : 'text-red-600'}`}>
          {state.message}
        </p>
      )}
    </form>
  );
};

export default ContactForm;
