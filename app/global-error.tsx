'use client'
import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";
import '../styles/globals.css'

 // Error boundaries must be Client Components
 
// Removed retry logic

export default function GlobalError({ error }: { error: Error & { digest?: string } }) {
  // Log server error once
  useEffect(() => { Sentry.captureException(error); }, [error]);

  return (
    // global-error must include html and body tags
    <html>
      <body>
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
            <p className="mb-4 text-gray-700">{error.message}</p>
            {/* Retry button removed */}
          </div>
        </div>
      </body>
    </html>
  )
}