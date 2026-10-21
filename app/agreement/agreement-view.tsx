'use client';

import React, { useState, useEffect } from 'react';
import { getAgreement, submitAgreementResponse, type AgreementData } from './actions';
import { Navbar } from '@/components/navbar';

interface AgreementViewProps {
  responseId: string;
  accessToken: string;
}

const ISSUER = 'Jaal Yantra Textiles Private Limited';
const ISSUER_ADDRESS = 'Dharamshala, Himachal Pradesh, India';

const formatDate = (dateString: string | null, withTime = false) => {
  if (!dateString) return null;
  return new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...(withTime ? { hour: '2-digit', minute: '2-digit' } : {}),
  });
};

// Short, human-quotable reference for the document ("JYT-AGR-6JD6QR6Y").
const referenceFor = (responseId: string) =>
  `JYT-AGR-${responseId.replace(/^.*_/, '').slice(-8).toUpperCase()}`;

const STATUS_LABEL: Record<string, string> = {
  sent: 'Awaiting response',
  viewed: 'Awaiting response',
  agreed: 'Accepted',
  disagreed: 'Declined',
  expired: 'Expired',
};

const Shell = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-hero-wash">
    <Navbar />
    <div className="mx-auto w-full max-w-3xl px-4 pb-24 pt-28 sm:px-6 sm:pt-32">{children}</div>
  </div>
);

const Notice = ({ eyebrow, title, body }: { eyebrow: string; title: string; body: string }) => (
  <Shell>
    <div className="rounded-3xl border border-navy-200 bg-white p-10 text-center shadow-sm">
      <p className="font-serif text-sm italic text-orange-700">{eyebrow}</p>
      <h1 className="mt-3 font-display text-2xl font-medium text-navy-950">{title}</h1>
      <p className="mt-3 text-sm text-navy-600">{body}</p>
    </div>
  </Shell>
);

const AgreementView = ({ responseId, accessToken }: AgreementViewProps) => {
  const [agreementData, setAgreementData] = useState<AgreementData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [responseNotes, setResponseNotes] = useState('');
  const [hasResponded, setHasResponded] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const [confirmed, setConfirmed] = useState(false);

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
    if (agreed && !confirmed) return;

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

  if (isLoading) {
    return (
      <Shell>
        <div className="flex items-center justify-center gap-3 rounded-3xl border border-navy-200 bg-white p-10 shadow-sm">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-navy-200 border-t-navy-900" />
          <span className="text-sm text-navy-700">Loading agreement…</span>
        </div>
      </Shell>
    );
  }

  if (error && !agreementData) {
    return (
      <Notice
        eyebrow="Agreement"
        title="This link could not be opened"
        body={`${error}. Please use the link in your email, or contact the sender for assistance.`}
      />
    );
  }

  if (!agreementData) {
    return (
      <Notice
        eyebrow="Agreement"
        title="Agreement not found"
        body="The requested agreement could not be found."
      />
    );
  }

  const { agreement, response, can_respond } = agreementData;
  const reference = referenceFor(response.id);
  const sentOn = formatDate(response.sent_at);
  const validUntil = formatDate(agreement.valid_until);
  const respondedOn = formatDate(response.responded_at, true);
  const statusLabel = STATUS_LABEL[response.status] ?? response.status;

  return (
    <Shell>
      {/* Page header */}
      <header className="mb-8">
        <p className="font-serif text-sm italic text-orange-700">Agreement for your review</p>
        <h1 className="mt-2 font-display text-3xl font-medium tracking-tight text-navy-950 sm:text-4xl">
          {agreement.title}
        </h1>
        {agreement.subject && agreement.subject !== agreement.title && (
          <p className="mt-2 text-navy-600">{agreement.subject}</p>
        )}
        <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-3 text-sm sm:grid-cols-4">
          <div>
            <dt className="font-mono text-[11px] uppercase tracking-wider text-navy-500">Reference</dt>
            <dd className="mt-0.5 text-navy-900">{reference}</dd>
          </div>
          <div>
            <dt className="font-mono text-[11px] uppercase tracking-wider text-navy-500">Sent to</dt>
            <dd className="mt-0.5 break-all text-navy-900">{response.email_sent_to}</dd>
          </div>
          <div>
            <dt className="font-mono text-[11px] uppercase tracking-wider text-navy-500">Sent on</dt>
            <dd className="mt-0.5 text-navy-900">{sentOn ?? '—'}</dd>
          </div>
          <div>
            <dt className="font-mono text-[11px] uppercase tracking-wider text-navy-500">Status</dt>
            <dd className="mt-0.5 text-navy-900">{statusLabel}</dd>
          </div>
        </dl>
      </header>

      {/* The document */}
      <article className="rounded-sm border border-navy-200 bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04),0_12px_32px_-12px_rgba(16,24,40,0.12)]">
        <div className="border-b-4 border-double border-navy-300 px-6 pb-6 pt-8 text-center sm:px-12">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-navy-900">{ISSUER}</p>
          <p className="mt-1 text-xs text-navy-500">{ISSUER_ADDRESS}</p>
        </div>

        <div
          className={[
            'agreement-document prose max-w-none px-6 py-10 sm:px-12',
            'font-serif text-[17px] leading-[1.75] text-navy-900 [font-variant-ligatures:none] [font-feature-settings:"calt"_0]',
            'prose-headings:font-display prose-headings:text-navy-950',
            'prose-h2:mb-8 prose-h2:mt-0 prose-h2:text-center prose-h2:text-base prose-h2:font-semibold prose-h2:uppercase prose-h2:tracking-[0.18em]',
            'prose-h3:mb-3 prose-h3:mt-9 prose-h3:text-[13px] prose-h3:font-semibold prose-h3:uppercase prose-h3:tracking-[0.12em]',
            'prose-p:my-4 sm:prose-p:text-justify prose-p:hyphens-auto prose-li:my-1.5 sm:prose-li:text-justify prose-strong:font-semibold',
            'prose-ul:pl-6',
          ].join(' ')}
          dangerouslySetInnerHTML={{ __html: agreement.content }}
        />

        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-navy-200 px-6 py-4 font-mono text-[11px] uppercase tracking-wider text-navy-500 sm:px-12">
          <span>Ref. {reference}</span>
          {validUntil && <span>Open for response until {validUntil}</span>}
        </div>
      </article>

      {/* Acceptance */}
      <section className="mt-8 rounded-sm border border-navy-200 bg-white px-6 py-8 sm:px-12">
        <h2 className="font-display text-[13px] font-semibold uppercase tracking-[0.12em] text-navy-950">
          Acceptance
        </h2>

        {hasResponded ? (
          <div className="mt-4">
            <p className="font-serif text-[17px] leading-relaxed text-navy-900">
              This agreement was{' '}
              <strong className="font-semibold">{response.agreed ? 'accepted' : 'declined'}</strong>
              {' '}by {response.email_sent_to}
              {respondedOn ? <> on {respondedOn}</> : null}.
            </p>
            <p className="mt-2 text-sm text-navy-600">
              The response is recorded against reference {reference}. A copy of these terms stays on
              file with {ISSUER}.
            </p>
            {responseMessage && (
              <p className="mt-4 rounded-md border border-navy-200 bg-navy-50 px-4 py-3 text-sm text-navy-800">
                {responseMessage}
              </p>
            )}
          </div>
        ) : can_respond ? (
          <div className="mt-4">
            {error && (
              <p className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                {error}
              </p>
            )}

            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                className="mt-1.5 h-4 w-4 shrink-0 rounded border-navy-400 text-navy-900 focus:ring-navy-900"
                checked={confirmed}
                onChange={(e) => setConfirmed(e.target.checked)}
                disabled={isSubmitting}
              />
              <span className="font-serif text-[17px] leading-relaxed text-navy-900">
                I have read and understood this agreement, and I accept its terms. I understand that
                selecting <em>Accept agreement</em> is my electronic acceptance.
              </span>
            </label>

            <div className="mt-6">
              <label htmlFor="response-notes" className="block font-mono text-[11px] uppercase tracking-wider text-navy-500">
                Notes for the sender (optional)
              </label>
              <textarea
                id="response-notes"
                rows={3}
                className="mt-2 w-full rounded-md border border-navy-300 bg-white px-3 py-2 text-sm text-navy-900 focus:border-navy-900 focus:outline-none focus:ring-1 focus:ring-navy-900"
                placeholder="Any questions or comments about these terms"
                value={responseNotes}
                onChange={(e) => setResponseNotes(e.target.value)}
                disabled={isSubmitting}
              />
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={() => handleResponse(false)}
                disabled={isSubmitting}
                className="rounded-full px-5 py-3 text-sm font-medium text-navy-600 underline-offset-4 hover:text-navy-950 hover:underline disabled:cursor-not-allowed disabled:opacity-50"
              >
                Decline agreement
              </button>
              <button
                type="button"
                onClick={() => handleResponse(true)}
                disabled={isSubmitting || !confirmed}
                className="rounded-full bg-navy-950 px-7 py-3 text-sm font-medium text-white transition-colors hover:bg-navy-800 focus:outline-none focus:ring-2 focus:ring-navy-900 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-navy-300"
              >
                {isSubmitting ? 'Submitting…' : 'Accept agreement'}
              </button>
            </div>
          </div>
        ) : (
          <p className="mt-4 text-sm text-navy-600">
            The response period for this agreement has ended. Please contact the sender if you still
            need to respond.
          </p>
        )}
      </section>
    </Shell>
  );
};

export default AgreementView;
