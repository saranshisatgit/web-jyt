import type { Metadata } from 'next';
import { Navbar } from '@/components/navbar';
import { loadGuideDashboard } from './actions';
import { GuideDashboard } from './guide-dashboard';

interface PageProps {
  params: Promise<{ token: string }>;
}

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Guide dashboard',
  description: "What's coming up — travellers, itinerary, customer notes.",
  robots: { index: false, follow: false },
};

export default async function GuideDashboardPage({ params }: PageProps) {
  const { token } = await params;
  const result = await loadGuideDashboard(token);

  if (!result.ok) {
    const isNotFound = result.status === 404;
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-hero-wash">
          <div className="mx-auto flex w-full max-w-2xl items-center justify-center px-6 py-16">
            <div className="rounded-3xl border border-olive-200 bg-white p-10 text-center shadow-sm">
              <p className="font-serif text-sm italic text-clay-700">
                {isNotFound ? "We don't recognise this token" : 'Something went wrong'}
              </p>
              <h1 className="mt-3 font-display text-2xl font-medium text-olive-950">
                {isNotFound ? 'Guide dashboard not found' : 'Unable to load your dashboard'}
              </h1>
              <p className="mt-3 text-sm text-olive-600">
                {isNotFound
                  ? "Double-check the link from the team — tokens can be regenerated, in which case the previous link is revoked."
                  : result.message}
              </p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <GuideDashboard initial={result.data} />
    </>
  );
}
