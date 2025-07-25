'use client';

import React, { useState, useEffect } from 'react';
import { getAgreement, submitAgreementResponse, type AgreementData } from './actions';
import { Container } from '@/components/container';
import { HeroSection } from '@/components/hero-section';

interface AgreementViewProps {
  responseId: string;
  accessToken: string;
}

const AgreementView = ({ responseId, accessToken }: AgreementViewProps) => {
  const [agreementData, setAgreementData] = useState<AgreementData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [responseNotes, setResponseNotes] = useState('');
  const [hasResponded, setHasResponded] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');

  useEffect(() => {
    const fetchAgreement = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const data = await getAgreement(responseId, accessToken);
        if (data) {
          setAgreementData(data);
          setHasResponded(data.response.status === 'agreed' || data.response.status === 'disagreed');
        } else {
          setError('Agreement not found or access denied');
        }
      } catch (err) {
        setError('Failed to load agreement');
        console.error('Error loading agreement:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (responseId && accessToken) {
      fetchAgreement();
    }
  }, [responseId, accessToken]);

  const handleResponse = async (agreed: boolean) => {
    if (!agreementData || isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const result = await submitAgreementResponse(
        responseId,
        accessToken,
        agreed,
        responseNotes.trim() || undefined
      );

      if (result.success) {
        setHasResponded(true);
        setResponseMessage(result.message);
        // Update the agreement data to reflect the new status
        setAgreementData(prev => prev ? {
          ...prev,
          response: {
            ...prev.response,
            status: agreed ? 'agreed' : 'disagreed',
            agreed,
            responded_at: new Date().toISOString(),
          },
          can_respond: false
        } : null);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Failed to submit response');
      console.error('Error submitting response:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    const statusColors = {
      sent: 'bg-blue-100 text-blue-800',
      viewed: 'bg-yellow-100 text-yellow-800',
      agreed: 'bg-green-100 text-green-800',
      disagreed: 'bg-red-100 text-red-800',
      expired: 'bg-gray-100 text-gray-800'
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // Create default header block for loading/error states
  const defaultHeaderBlock = {
    content: {
      title: 'Agreement Review',
      subtitle: 'Please review the agreement details below and provide your response.',
      announcement: '',
      buttons: []
    }
  };
  const announcementBlock = { content: { announcement: '' } };

  if (isLoading) {
    return (
      <div className="overflow-hidden">
        <HeroSection headerBlock={defaultHeaderBlock} announcementBlock={announcementBlock} />
        <main>
          <Container>
            <section className="mt-8">
              <div className="bg-white/80 backdrop-blur-sm p-8 rounded-lg shadow-lg animate-fade-in text-center">
                <div className="flex items-center justify-center space-x-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  <span className="text-gray-700">Loading agreement...</span>
                </div>
              </div>
            </section>
          </Container>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="overflow-hidden">
        <HeroSection headerBlock={defaultHeaderBlock} announcementBlock={announcementBlock} />
        <main>
          <Container>
            <section className="mt-8">
              <div className="bg-white/80 backdrop-blur-sm p-8 rounded-lg shadow-lg animate-fade-in max-w-md mx-auto text-center">
                <div className="text-red-500 text-5xl mb-4">⚠️</div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
                <p className="text-gray-600 mb-4">{error}</p>
                <p className="text-sm text-gray-500">
                  Please check your access link or contact the sender for assistance.
                </p>
              </div>
            </section>
          </Container>
        </main>
      </div>
    );
  }

  if (!agreementData) {
    return (
      <div className="overflow-hidden">
        <HeroSection headerBlock={defaultHeaderBlock} announcementBlock={announcementBlock} />
        <main>
          <Container>
            <section className="mt-8">
              <div className="bg-white/80 backdrop-blur-sm p-8 rounded-lg shadow-lg animate-fade-in max-w-md mx-auto text-center">
                <div className="text-gray-400 text-5xl mb-4">📄</div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Agreement Not Found</h1>
                <p className="text-gray-600">The requested agreement could not be found.</p>
              </div>
            </section>
          </Container>
        </main>
      </div>
    );
  }

  const { agreement, response, can_respond } = agreementData;

  // Create dynamic header block with agreement data
  const statusText = response.status.charAt(0).toUpperCase() + response.status.slice(1);
  const headerBlock = {
    content: {
      title: agreement.title,
      subtitle: `${agreement.subject} • Status: ${statusText}`,
      announcement: '',
      buttons: []
    }
  };

  return (
    <div className="overflow-hidden">
      <HeroSection headerBlock={headerBlock} announcementBlock={announcementBlock} />
      <main>
        <Container>
          <section className="mt-8 mb-24 min-h-[60vh]">
            <div className="max-w-4xl mx-auto">
        {/* Agreement Info */}
        <div className="bg-white rounded-lg shadow-lg mb-6 animate-fade-in">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Agreement Details</h2>
              {getStatusBadge(response.status)}
            </div>
          </div>
          
          {/* Agreement Info */}
          <div className="px-6 py-4 bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Sent to:</span>
                <p className="text-gray-900">{response.email_sent_to}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Sent on:</span>
                <p className="text-gray-900">{formatDate(response.sent_at)}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Valid until:</span>
                <p className="text-gray-900">{formatDate(agreement.valid_until)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Agreement Content */}
        <div className="bg-white rounded-lg shadow-lg mb-6 animate-fade-in">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Agreement Content</h2>
          </div>
          <div className="px-6 py-6">
            <div 
              className="prose max-w-none text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: agreement.content }}
            />
          </div>
        </div>

        {/* Response Section */}
        {hasResponded ? (
          <div className="bg-white rounded-lg shadow-lg animate-fade-in">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Response Status</h2>
            </div>
            <div className="px-6 py-6">
              <div className="text-center py-8">
                <div className={`text-6xl mb-4 ${response.agreed ? '✅' : '❌'}`}>
                  {response.agreed ? '✅' : '❌'}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Agreement {response.agreed ? 'Accepted' : 'Declined'}
                </h3>
                <p className="text-lg text-gray-600 mb-4">
                  You {response.agreed ? 'accepted' : 'declined'} this agreement
                </p>
                <div className="bg-gray-50 rounded-lg p-4 inline-block">
                  <p className="text-sm font-medium text-gray-700">
                    Response submitted on:
                  </p>
                  <p className="text-sm text-gray-900">
                    {formatDate(response.responded_at)}
                  </p>
                </div>
              </div>
              {responseMessage && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-6">
                  <p className="text-green-800 text-center">{responseMessage}</p>
                </div>
              )}
            </div>
          </div>
        ) : can_respond ? (
          <div className="bg-white rounded-lg shadow-lg animate-fade-in">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Your Response</h2>
              <p className="text-sm text-gray-600 mt-1">
                Please review the agreement above and provide your response.
              </p>
            </div>
            <div className="px-6 py-6">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <p className="text-red-800">{error}</p>
                </div>
              )}
              
              <div className="mb-6">
                <label htmlFor="response-notes" className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Notes (Optional)
                </label>
                <textarea
                  id="response-notes"
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Add any comments or notes about your decision..."
                  value={responseNotes}
                  onChange={(e) => setResponseNotes(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => handleResponse(true)}
                  disabled={isSubmitting}
                  className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? 'Submitting...' : '✅ Accept Agreement'}
                </button>
                <button
                  onClick={() => handleResponse(false)}
                  disabled={isSubmitting}
                  className="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? 'Submitting...' : '❌ Decline Agreement'}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg animate-fade-in">
            <div className="px-6 py-6 text-center">
              <div className="text-gray-400 text-4xl mb-4">⏰</div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Response Period Ended</h2>
              <p className="text-gray-600">
                The response period for this agreement has ended or you have already responded.
              </p>
            </div>
          </div>
        )}
            </div>
          </section>
        </Container>
      </main>
    </div>
  );
};

export default AgreementView;
