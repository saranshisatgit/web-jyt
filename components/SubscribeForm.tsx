'use client';

import React, { useState } from 'react';
import { subscribeToUpdates, SubscriptionPayload } from '@/medu/queries'; // Assuming @/ maps to ./
import { Button } from './button';

interface SubscribeFormProps {
  domainName: string; // To pass to the API call
}

const SubscribeForm: React.FC<SubscribeFormProps> = ({ domainName }) => {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(''); // For success or error messages
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setMessage('');
    setIsError(false);

    if (!email || !firstName || !lastName) {
      setMessage('Please fill in all fields.');
      setIsError(true);
      setIsLoading(false);
      return;
    }

    const payload: SubscriptionPayload = { email, first_name: firstName, last_name: lastName };

    try {
      const response = await subscribeToUpdates(domainName, payload);
      if (response.error) {
        setMessage(response.error);
        setIsError(true);
      } else {
        setMessage(response.message || 'Successfully subscribed!');
        setIsError(false);
        // Optionally clear fields
        setEmail('');
        setFirstName('');
        setLastName('');
      }
    } catch (error) {
      console.error('Subscription submission error:', error);
      setMessage('An unexpected error occurred. Please try again.');
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-0">
      {/* Header Section */}
      <div className="mb-6">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-950 mb-2">
          Subscribe to our newsletter
        </h3>
        <p className="text-sm text-gray-600 mb-1">
          Receive updates on our latest products and exclusive offers.
        </p>
        <p className="text-xs italic text-gray-500">
          We need your first name and last name to personalize the emails being sent.
        </p>
      </div>

      {/* Form Section */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Name Fields Row - Stack on mobile, side-by-side on tablet+ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* First Name Input */}
          <div className="w-full">
            <label htmlFor="firstName" className="block text-xs font-medium text-gray-700 mb-1.5">
              First name*
            </label>
            <input
              type="text"
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-3 py-2.5 text-sm bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-950 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
              placeholder="First name"
              disabled={isLoading}
              required
            />
          </div>

          {/* Last Name Input */}
          <div className="w-full">
            <label htmlFor="lastName" className="block text-xs font-medium text-gray-700 mb-1.5">
              Last name*
            </label>
            <input
              type="text"
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-3 py-2.5 text-sm bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-950 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
              placeholder="Last name"
              disabled={isLoading}
              required
            />
          </div>
        </div>

        {/* Email and Button Row */}
        <div className="flex flex-col sm:flex-row gap-3 sm:items-end">
          {/* Email Input */}
          <div className="flex-1">
            <label htmlFor="email" className="block text-xs font-medium text-gray-700 mb-1.5">
              Email*
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2.5 text-sm bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-950 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
              placeholder="your@email.com"
              disabled={isLoading}
              required
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full sm:w-auto px-6 py-2.5 bg-gray-950 text-white text-sm font-medium rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-950 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
            disabled={isLoading}
          >
            {isLoading ? 'Subscribing...' : 'Subscribe'}
          </Button>
        </div>
      </form>

      {/* Message Display */}
      {message && (
        <div className={`mt-4 p-3 rounded-md ${isError ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
          <p className="text-sm">{message}</p>
        </div>
      )}
    </div>
  );
};

export default SubscribeForm;
