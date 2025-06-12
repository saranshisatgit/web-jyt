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

  // Basic styling - can be enhanced to match your project's UI
  const inputStyle = "mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none";
  const buttonStyle = "mt-4 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50";
  const labelStyle = "block text-sm font-medium text-slate-700";

  return (
    <div className="my-8 w-full max-w-lg mx-auto text-center">
      <h3 className="text-3xl sm:text-4xl font-medium tracking-tight text-gray-950 mb-8">
        Subscribe to Our Stories and Updates
      </h3>
      <form onSubmit={handleSubmit} className="flex flex-col items-center">
        <div className="mb-4">
          <label htmlFor="firstName" className={labelStyle}>
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className={`${inputStyle} w-full sm:max-w-sm`}
            placeholder="Your first name"
            disabled={isLoading}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="lastName" className={labelStyle}>
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className={`${inputStyle} w-full sm:max-w-sm`}
            placeholder="Your last name"
            disabled={isLoading}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className={labelStyle}>
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`${inputStyle} w-full sm:max-w-sm`}
            placeholder="you@example.com"
            disabled={isLoading}
          />
        </div>
        <Button
          type="submit"
          variant='primary'
          className={`${buttonStyle} w-full sm:w-auto sm:max-w-sm`}
          disabled={isLoading}
        >
          {isLoading ? 'Subscribing...' : 'Subscribe'}
        </Button>
      </form>
      {message && (
        <p className={`mt-4 text-sm ${isError ? 'text-red-600' : 'text-green-600'}`}>
          {message}
        </p>
      )}
    </div>
  );
};

export default SubscribeForm;
