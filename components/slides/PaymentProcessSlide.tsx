import React from 'react';
import { Bolt } from '@medusajs/icons';

// Slide props injected via FeatureCarousel
interface PaymentProcessSlideProps {
  title?: string;
  description?: string | string[];
}

/**
 * Slide 3: Payment Process Centered
 */
export default function PaymentProcessSlide({
  title = 'Secure Payment Process',
  description = 'Make secure payments with ease and confidence.',
}: PaymentProcessSlideProps) {
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
          <div className="rounded-3xl bg-white p-10 ring-1 shadow-2xl ring-black/5 flex flex-col items-center justify-center relative">
            <Bolt className="h-20 w-20 text-blue-500" />
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-12 w-12 text-blue-500 mt-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
            </svg>
            {/* Overlay for payment sent */}
            <div className="absolute inset-0 bg-white/80 rounded-3xl flex flex-col items-center justify-center z-10">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-20 w-20 text-green-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
              </svg>
              <span className="mt-4 text-2xl font-semibold text-green-600">Payment Sent</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
