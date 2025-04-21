'use client'
import React, { useState } from 'react';
import { Switch } from '@headlessui/react';
import { UserIcon } from '@heroicons/react/24/outline';

// Slide props injected via FeatureCarousel
interface SignUpAvailabilitySlideProps {
  title?: string;
  description?: string | string[];
}

/**
 * Slide 1: Sign Up & Set Your Availability
 */
export default function SignUpAvailabilitySlide({
  title = 'Sign Up & Set Your Availability',
  description = 'Create your account and choose your available days for clients to book.',
}: SignUpAvailabilitySlideProps) {
  const today = new Date();
  const [isAvailable, setIsAvailable] = useState(true);

  return (
    <div className="flex flex-col md:flex-row items-start justify-center gap-8 h-full relative">
      <div className="w-full md:w-1/2 pt-16">
        <h3 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">{title}</h3>
        {Array.isArray(description) ? (
          <ul className="list-disc pl-5 mb-4 space-y-2">
            {description.map((d, idx) => (
              <li key={idx} className="text-base text-gray-600 dark:text-gray-300">{d}</li>
            ))}
          </ul>
        ) : (
          <p className="text-base text-gray-600 dark:text-gray-300 mb-2">{description}</p>
        )}
      </div>
      <div className="-m-2 grid grid-cols-1 rounded-4xl ring-1 shadow-[inset_0_0_2px_1px_#ffffff4d] ring-black/5 max-lg:mx-auto max-lg:max-w-md self-end relative mt-4 md:mt-16 overflow-visible">
        <div className="grid grid-cols-1 rounded-4xl p-2 shadow-md shadow-black/5">
          <div className="rounded-3xl bg-white p-10 pb-9 ring-1 shadow-2xl ring-black/5">
            {/* Mobile dashboard (PricingCard style) */}
            <div className="flex flex-col items-center w-full">
              <UserIcon className="h-10 w-10 text-gray-700 mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2 text-center">
                Availability Dashboard
              </h3>
              <p className="text-center text-gray-600 mb-4">
                {today.toLocaleString('en-US', { weekday: 'long', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' })}
              </p>
              <div className="grid grid-cols-3 gap-2 mb-4 w-full">
                {Array.from({ length: 14 }).map((_, i) => {
                  const date = new Date();
                  date.setDate(today.getDate() + i);
                  const label = date.toLocaleDateString('en-US', { day: 'numeric' });
                  return (
                    <div
                      key={i}
                      className={`py-2 rounded text-center ${isAvailable ? 'bg-gradient-to-r from-green-200 via-green-300 to-green-400 text-green-900' : 'bg-gradient-to-r from-red-200 via-red-300 to-red-400 text-red-900'}`}
                    >
                      {label}
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-between items-center w-full">
                <span className="text-gray-800 font-medium">Available</span>
                <Switch
                  checked={isAvailable}
                  onChange={setIsAvailable}
                  className={`${isAvailable ? 'bg-green-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full`}
                >
                  <span className="sr-only">Toggle Availability</span>
                  <span
                    className={`${isAvailable ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition`}
                  />
                </Switch>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
