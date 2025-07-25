import { Metadata } from 'next';
import AgreementView from '../agreement-view';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    token?: string;
  }>;
}

export const metadata: Metadata = {
  title: 'Agreement Review',
  description: 'Review and respond to agreement',
};

export default async function AgreementPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const { token } = await searchParams;

  // If no token is provided, show error message
  if (!token) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-lg shadow-lg animate-fade-in max-w-md text-center">
          <div className="text-red-500 text-5xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Token Required</h1>
          <p className="text-gray-600 mb-4">
            This agreement requires a valid access token to view.
          </p>
          <p className="text-sm text-gray-500">
            Please use the link provided in your email or contact the sender for assistance.
          </p>
        </div>
      </div>
    );
  }

  return <AgreementView responseId={id} accessToken={token} />;
}
