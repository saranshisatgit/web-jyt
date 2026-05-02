'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import type { GuideDashboardPayload, GuideVisit } from './actions';

type Props = { initial: GuideDashboardPayload };

const formatDateLong = (iso: string | null): string => {
  if (!iso) return 'Date TBD';
  try {
    return new Date(iso).toLocaleString(undefined, {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
};

const formatDateShort = (iso: string | null): string => {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      day: 'numeric',
      month: 'short',
    });
  } catch {
    return iso;
  }
};

const formatMoney = (n: number, currency: string): string => {
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(n);
  } catch {
    return `${currency} ${n.toLocaleString()}`;
  }
};

const ANSWER_LABELS: Record<string, string> = {
  insurance: 'Insurance',
  insurance_provider: 'Insurance provider',
  arrival_mode: 'Arriving via',
  arrival_time: 'Arrival time',
  accommodation: 'Staying at',
  meeting_point_transport: 'Getting to first meeting',
  photo_permission: 'Photos',
  preferred_language: 'Preferred language',
  dietary: 'Dietary',
  access_needs: 'Access needs',
  emergency_contact_name: 'Emergency contact',
  emergency_contact_phone: 'Emergency phone',
  notes_for_guide: 'Notes',
  interests: 'Interests',
};

const formatAnswerValue = (val: unknown): string => {
  if (val == null || val === '') return '—';
  if (Array.isArray(val)) return val.join(', ');
  if (typeof val === 'string') return val;
  if (typeof val === 'number' || typeof val === 'boolean') return String(val);
  return JSON.stringify(val);
};

const traveller = (v: GuideVisit): string => {
  const t = v.traveller;
  if (!t) return 'Traveller TBD';
  return [t.first_name, t.surname].filter(Boolean).join(' ') || 'Traveller TBD';
};

const headcountSummary = (h: Record<string, number>): string => {
  const entries = Object.entries(h).filter(([, n]) => n > 0);
  if (!entries.length) return '—';
  return entries.map(([cat, n]) => `${n} ${cat}`).join(' · ');
};

export function GuideDashboard({ initial }: Props) {
  const [filter, setFilter] = useState<'upcoming' | 'all'>('upcoming');
  const [openId, setOpenId] = useState<string | null>(null);

  const visits = useMemo(() => {
    if (filter === 'all') return initial.visits;
    const now = Date.now();
    return initial.visits.filter((v) => {
      if (!v.tour_date) return true;
      return new Date(v.tour_date).getTime() >= now - 86_400_000; // include "today" liberally
    });
  }, [initial.visits, filter]);

  // Group by date for a more useful overview.
  const groupedByDate = useMemo(() => {
    const map = new Map<string, GuideVisit[]>();
    for (const v of visits) {
      const key = v.tour_date ? v.tour_date.slice(0, 10) : '__nodate__';
      const arr = map.get(key) || [];
      arr.push(v);
      map.set(key, arr);
    }
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [visits]);

  return (
    <div className="min-h-screen bg-hero-wash pb-24">
      <header className="border-b border-olive-200/70 bg-white/70 backdrop-blur-sm">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-6 py-8 lg:flex-row lg:items-end lg:justify-between lg:px-10">
          <div className="flex items-center gap-4">
            {initial.guide.photo_url ? (
              <div className="relative h-14 w-14 overflow-hidden rounded-full bg-olive-100">
                <Image
                  src={initial.guide.photo_url}
                  alt={initial.guide.name || ''}
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              </div>
            ) : null}
            <div>
              <p className="font-serif text-sm italic text-clay-700">Guide dashboard</p>
              <h1 className="font-display text-2xl font-medium text-olive-950 sm:text-3xl">
                {initial.guide.name || 'Welcome'}
              </h1>
              {initial.guide.role ? (
                <p className="text-sm text-olive-600">{initial.guide.role}</p>
              ) : null}
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="rounded-full bg-clay-50 px-3 py-1.5 text-clay-800 ring-1 ring-clay-200">
              <span className="font-medium">{initial.upcoming_count}</span> upcoming
            </div>
            <div className="inline-flex rounded-full bg-white p-1 ring-1 ring-olive-200">
              {(['upcoming', 'all'] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFilter(f)}
                  className={[
                    'rounded-full px-3 py-1 text-xs transition',
                    filter === f
                      ? 'bg-olive-900 text-white'
                      : 'text-olive-600 hover:text-olive-900',
                  ].join(' ')}
                >
                  {f === 'upcoming' ? 'Upcoming' : 'All'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-6 py-10 lg:px-10">
        {visits.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-olive-300 bg-white p-12 text-center">
            <p className="font-display text-xl font-medium text-olive-950">
              {filter === 'upcoming'
                ? 'Nothing on your calendar yet.'
                : 'No visits in the window.'}
            </p>
            <p className="mt-2 text-sm text-olive-600">
              When customers confirm a visit, it&apos;ll show up here with their answers and
              what they&apos;ve picked.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-y-8">
            {groupedByDate.map(([dateKey, dayVisits]) => {
              const isNoDate = dateKey === '__nodate__';
              const headerLabel = isNoDate
                ? 'No date set'
                : new Date(dateKey).toLocaleDateString(undefined, {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  });
              return (
                <section key={dateKey}>
                  <header className="flex items-baseline justify-between border-b border-olive-200 pb-2">
                    <h2 className="font-display text-lg font-medium text-olive-950">
                      {headerLabel}
                    </h2>
                    <span className="text-xs text-olive-500">
                      {dayVisits.length} visit{dayVisits.length === 1 ? '' : 's'}
                    </span>
                  </header>
                  <ul className="mt-4 flex flex-col gap-3">
                    {dayVisits.map((v) => {
                      const isOpen = openId === v.response_id;
                      return (
                        <li
                          key={v.response_id}
                          className="overflow-hidden rounded-2xl border border-olive-200 bg-white"
                        >
                          <button
                            type="button"
                            onClick={() => setOpenId(isOpen ? null : v.response_id)}
                            className="flex w-full items-start gap-4 px-5 py-4 text-left transition hover:bg-olive-50/40"
                          >
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                                <p className="font-display text-base font-medium text-olive-950">
                                  {traveller(v)}
                                </p>
                                <p className="text-sm text-olive-500">
                                  {headcountSummary(v.headcount)}
                                </p>
                                {v.booking_ref ? (
                                  <span className="font-mono text-xs text-olive-400">
                                    {v.booking_ref}
                                  </span>
                                ) : null}
                              </div>
                              <p className="mt-1 truncate text-sm text-olive-700">
                                {v.tour_form.title} · {formatDateLong(v.tour_date)}
                              </p>
                              <p className="mt-1 text-xs text-olive-500">
                                {v.selected_segments.length} segment
                                {v.selected_segments.length === 1 ? '' : 's'} selected
                                {v.payment?.add_ons_due
                                  ? ` · ${formatMoney(v.payment.add_ons_due, v.payment.add_ons_currency)} add-ons due on day`
                                  : ''}
                              </p>
                            </div>
                            <span className="ml-2 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-olive-50 text-olive-700">
                              <svg
                                viewBox="0 0 12 12"
                                className={`h-3 w-3 transition-transform ${
                                  isOpen ? 'rotate-180' : ''
                                }`}
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.6"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                aria-hidden="true"
                              >
                                <path d="M3 4.5l3 3 3-3" />
                              </svg>
                            </span>
                          </button>

                          {isOpen ? (
                            <div className="grid grid-cols-1 gap-6 border-t border-olive-100 bg-olive-50/30 px-5 py-5 lg:grid-cols-3">
                              {/* Traveller */}
                              <div>
                                <h3 className="text-xs uppercase tracking-wide text-olive-500">
                                  Traveller
                                </h3>
                                <dl className="mt-2 space-y-1.5 text-sm">
                                  {v.traveller?.country ? (
                                    <div className="flex justify-between gap-3">
                                      <dt className="text-olive-500">Country</dt>
                                      <dd className="text-olive-900">{v.traveller.country}</dd>
                                    </div>
                                  ) : null}
                                  {v.traveller?.email ? (
                                    <div className="flex justify-between gap-3">
                                      <dt className="text-olive-500">Email</dt>
                                      <dd className="truncate text-olive-900">
                                        <a
                                          href={`mailto:${v.traveller.email}`}
                                          className="text-clay-700 hover:underline"
                                        >
                                          {v.traveller.email}
                                        </a>
                                      </dd>
                                    </div>
                                  ) : null}
                                  {v.traveller?.phone ? (
                                    <div className="flex justify-between gap-3">
                                      <dt className="text-olive-500">Phone</dt>
                                      <dd className="text-olive-900">
                                        <a
                                          href={`tel:${v.traveller.phone}`}
                                          className="text-clay-700 hover:underline"
                                        >
                                          {v.traveller.phone}
                                        </a>
                                      </dd>
                                    </div>
                                  ) : null}
                                  {v.traveller?.language ? (
                                    <div className="flex justify-between gap-3">
                                      <dt className="text-olive-500">Language</dt>
                                      <dd className="text-olive-900">{v.traveller.language}</dd>
                                    </div>
                                  ) : null}
                                </dl>
                              </div>

                              {/* Itinerary */}
                              <div>
                                <h3 className="text-xs uppercase tracking-wide text-olive-500">
                                  Day plan
                                </h3>
                                {v.selected_segments.length === 0 ? (
                                  <p className="mt-2 text-sm text-olive-500">
                                    No segments selected yet.
                                  </p>
                                ) : (
                                  <ul className="mt-2 flex flex-col gap-1 text-sm">
                                    {v.selected_segments.map((s) => (
                                      <li key={s.id} className="flex items-baseline gap-2">
                                        <span
                                          className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${
                                            s.required ? 'bg-clay-500' : 'bg-olive-400'
                                          }`}
                                        />
                                        <span className="text-olive-900">
                                          {s.title}
                                          {s.required ? (
                                            <span className="ml-1 text-xs text-olive-500">
                                              · always included
                                            </span>
                                          ) : null}
                                        </span>
                                      </li>
                                    ))}
                                  </ul>
                                )}
                                {v.payment ? (
                                  <div className="mt-4 rounded-lg bg-white p-3 text-xs">
                                    {v.payment.paid_via_source ? (
                                      <p className="flex justify-between text-olive-700">
                                        <span>Paid via {v.payment.paid_via_source.provider}</span>
                                        <span className="font-mono">
                                          {formatMoney(
                                            v.payment.paid_via_source.amount,
                                            v.payment.paid_via_source.currency
                                          )}
                                        </span>
                                      </p>
                                    ) : null}
                                    <p className="mt-1 flex justify-between text-olive-900">
                                      <span className="font-medium">Add-ons due on day</span>
                                      <span className="font-mono font-medium">
                                        {formatMoney(
                                          v.payment.add_ons_due,
                                          v.payment.add_ons_currency
                                        )}
                                      </span>
                                    </p>
                                  </div>
                                ) : null}
                              </div>

                              {/* Customer answers */}
                              <div>
                                <h3 className="text-xs uppercase tracking-wide text-olive-500">
                                  From the customer
                                </h3>
                                {Object.keys(v.answers).length === 0 ? (
                                  <p className="mt-2 text-sm text-olive-500">
                                    They haven&apos;t left any notes yet.
                                  </p>
                                ) : (
                                  <dl className="mt-2 space-y-2 text-sm">
                                    {Object.entries(v.answers)
                                      .filter(([, val]) => {
                                        if (val == null || val === '') return false;
                                        if (Array.isArray(val) && val.length === 0)
                                          return false;
                                        return true;
                                      })
                                      .map(([key, val]) => (
                                        <div key={key} className="flex flex-col gap-0.5">
                                          <dt className="text-xs text-olive-500">
                                            {ANSWER_LABELS[key] || key}
                                          </dt>
                                          <dd className="whitespace-pre-line text-olive-900">
                                            {formatAnswerValue(val)}
                                          </dd>
                                        </div>
                                      ))}
                                  </dl>
                                )}
                              </div>
                            </div>
                          ) : null}
                        </li>
                      );
                    })}
                  </ul>
                </section>
              );
            })}
          </div>
        )}
        <p className="mt-12 text-center text-xs text-olive-500">
          Showing visits from the last 7 days through any future date · Sorted by tour date
        </p>
      </main>
    </div>
  );
}
