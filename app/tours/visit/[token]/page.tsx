import type { Metadata } from 'next';
import { Suspense } from 'react';
import { loadTourVisit } from './actions';
import { TourWizard } from './tour-wizard';

interface PageProps {
  params: Promise<{ token: string }>;
}

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Plan your visit',
  description: 'Pick the parts of your tour and review your itinerary.',
};

export default async function TourVisitPage({ params }: PageProps) {
  const { token } = await params;
  const result = await loadTourVisit(token);

  if (!result.ok) {
    const isNotFound = result.status === 404;
    const isExpired = result.status === 403;
    return (
      <div className="min-h-screen bg-hero-wash">
        <div className="mx-auto flex min-h-screen w-full max-w-2xl items-center justify-center px-6 py-16">
          <div className="rounded-3xl border border-olive-200 bg-white p-10 text-center shadow-sm">
            <p className="font-serif text-sm italic text-clay-700">
              {isExpired ? 'Link expired' : isNotFound ? "We couldn't find this visit" : 'Something went wrong'}
            </p>
            <h1 className="mt-3 font-display text-2xl font-medium text-olive-950">
              {isExpired
                ? 'This visit link has expired'
                : isNotFound
                  ? 'Visit not found'
                  : 'Unable to load your visit'}
            </h1>
            <p className="mt-3 text-sm text-olive-600">
              {isExpired
                ? "Please reach out and we'll send you a fresh link."
                : isNotFound
                  ? 'Double-check the link from your email — it may be incomplete.'
                  : result.message}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Suspense fallback={null}>
      <TourWizard token={token} initial={result.data} />
    </Suspense>
  );
}
