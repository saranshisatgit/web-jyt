'use client';

import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  createShareLink,
  revokeShareLink,
  saveItinerary,
  type TourSegment,
  type TourVisitPayload,
} from './actions';
import { SegmentModal } from './segment-modal';
import { buildTourIcs, downloadIcs } from './ics';

type Props = {
  token: string;
  initial: TourVisitPayload;
};

type StepId = 'welcome' | 'guides' | 'itinerary' | 'details' | 'review';

const STEPS: { id: StepId; label: string }[] = [
  { id: 'welcome', label: 'Welcome' },
  { id: 'guides', label: 'Meet the guides' },
  { id: 'itinerary', label: 'Plan itinerary' },
  { id: 'details', label: 'A few details' },
  { id: 'review', label: 'Review' },
];

const ONBOARDING_INTERESTS = [
  { value: 'sustainability', label: 'Sustainability' },
  { value: 'craft', label: 'Craft & technique' },
  { value: 'art', label: 'Art & design' },
  { value: 'community', label: 'Community & people' },
  { value: 'story', label: 'The story behind the cloth' },
];

const INSURANCE_OPTIONS = [
  { value: 'yes', label: 'Yes — covered' },
  { value: 'no', label: 'No insurance' },
  { value: 'unsure', label: "I'm not sure" },
];

const ARRIVAL_MODE_OPTIONS = [
  { value: 'train', label: 'Train (Santa Maria Novella)' },
  { value: 'plane', label: 'Plane (Florence FLR or Pisa PSA)' },
  { value: 'car', label: 'Car / private transfer' },
  { value: 'bus', label: 'Bus / coach' },
  { value: 'already_in_city', label: 'Already in Florence' },
];

const MEETING_POINT_TRANSPORT_OPTIONS = [
  { value: 'walking', label: 'Walking — send me directions' },
  { value: 'public', label: 'Public transport — send me tickets/instructions' },
  { value: 'partner_taxi', label: 'Partner taxi (~€15)' },
  { value: 'self', label: "I'll arrange my own way" },
];

const PHOTO_PERMISSION_OPTIONS = [
  { value: 'yes', label: 'Yes, photos welcome' },
  { value: 'no_face', label: 'Yes, but please not my face' },
  { value: 'no', label: 'No photos of me, please' },
];

/**
 * Format the tour date in the venue's local timezone (Europe/Rome) so a
 * Sydney customer doesn't see "21:00 Tue" for an 11:00 Florence tour.
 * The "(Florence local time)" suffix makes the timezone explicit.
 */
const formatDate = (iso: string | null): string => {
  if (!iso) return '';
  try {
    const formatted = new Date(iso).toLocaleString('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: false,
      timeZone: 'Europe/Rome',
    });
    return `${formatted} (Florence local time)`;
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

const formatDuration = (mins?: number | null): string => {
  if (!mins || mins <= 0) return '';
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
};

const sourceLabel = (s: string | null): string => {
  if (!s) return 'Direct booking';
  if (s.toLowerCase() === 'gyg') return 'GetYourGuide';
  return s;
};

/**
 * Fire a wizard event into the in-house analytics module
 * (window.jytAnalytics.track), defensively. The script is loaded by the
 * site-wide layout but may not be present in dev or on every host —
 * gracefully no-op when missing instead of throwing.
 */
const track = (name: string, metadata: Record<string, unknown> = {}) => {
  if (typeof window === 'undefined') return;
  const a = (window as unknown as {
    jytAnalytics?: { track?: (n: string, m: Record<string, unknown>) => void };
  }).jytAnalytics;
  try {
    a?.track?.(name, { surface: 'tour-visit-wizard', ...metadata });
  } catch (err) {
    // Analytics must never break the customer flow.
    console.debug('[wizard] analytics track failed', err);
  }
};

/**
 * Tight, friendly relative-time. Designed for the small "Last saved …"
 * label so it never goes stale-feeling: anything under a minute is "just
 * now", anything under an hour is "X min ago", under a day is "X h ago",
 * older than that is the literal date.
 */
const formatRelativeTime = (then: number, now: number): string => {
  const delta = Math.max(0, now - then);
  const sec = Math.floor(delta / 1000);
  if (sec < 30) return 'just now';
  if (sec < 60) return 'less than a minute ago';
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min} min${min === 1 ? '' : 's'} ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} h ago`;
  try {
    return new Date(then).toLocaleDateString(undefined, {
      day: 'numeric',
      month: 'short',
    });
  } catch {
    return 'a while ago';
  }
};

export function TourWizard({ token, initial }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [data, setData] = useState<TourVisitPayload>(initial);
  const [selected, setSelected] = useState<Set<string>>(
    new Set(initial.response.selected_segments)
  );
  const [answers, setAnswers] = useState<Record<string, unknown>>(
    initial.response.answers || {}
  );
  const [error, setError] = useState<string | null>(null);
  // savedAt = last successful PATCH (or initial load timestamp); persists
  // across step navigation so the "Last saved" line stays meaningful.
  const [savedAt, setSavedAt] = useState<number>(() =>
    initial.response.updated_at ? new Date(initial.response.updated_at).getTime() : Date.now()
  );
  const [saving, startSaving] = useTransition();
  const [openSegment, setOpenSegment] = useState<TourSegment | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [sharePending, setSharePending] = useState(false);

  // Share tokens render the page read-only — the partner can see the
  // itinerary but can't change anything.
  const isReadOnly = data.access_mode === 'share';

  // Tick the relative-time formatter every 30s so "Last saved 2 min ago"
  // updates without forcing the user to refresh.
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 30_000);
    return () => window.clearInterval(id);
  }, []);

  // Fire one funnel-entry event per page mount. The token is intentionally
  // not sent — the in-house analytics already correlates by visitor/session
  // ID and we don't want to leak tokens into event metadata.
  useEffect(() => {
    track('tour_visit_loaded', {
      access_mode: initial.access_mode,
      booking_ref: initial.booking?.booking_ref || null,
      country: initial.traveller?.country || null,
      add_ons_currency: initial.payment?.add_ons_currency || null,
    });
    // Run once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const currentStepId: StepId = useMemo(() => {
    const raw = searchParams?.get('step');
    if (raw && STEPS.some((s) => s.id === raw)) return raw as StepId;
    return 'welcome';
  }, [searchParams]);

  const currentIndex = STEPS.findIndex((s) => s.id === currentStepId);

  const segments = data.form.itinerary_segments || [];
  const guides = data.form.settings?.guides || [];
  const story = data.form.settings?.story || null;
  const practical = data.form.settings?.practical_guidance || null;
  const highlights = Array.isArray(data.form.settings?.highlights)
    ? (data.form.settings!.highlights as string[]).filter(Boolean)
    : [];
  const excluded = Array.isArray(data.form.settings?.excluded)
    ? (data.form.settings!.excluded as string[]).filter(Boolean)
    : [];
  const trust = data.form.settings?.trust_signals || null;
  // Field names the wizard already renders inline — exclude them from the
  // "A few more questions" admin-defined block to avoid duplication.
  const BUILT_IN_FIELD_NAMES = new Set([
    'interests',
    'notes_for_guide',
    'dietary',
    'access_needs',
    'preferred_language',
    'insurance',
    'insurance_provider',
    'arrival_mode',
    'arrival_time',
    'accommodation',
    'meeting_point_transport',
    'photo_permission',
    'emergency_contact_name',
    'emergency_contact_phone',
  ]);
  const fields = (data.form.fields || [])
    .slice()
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .filter((f) => !BUILT_IN_FIELD_NAMES.has(f.name));

  // Union of languages from guides marked Available — used to bound the
  // language picker. Falls back to a free-text input if guides aren't loaded.
  const guideLanguages = useMemo(() => {
    const set = new Set<string>();
    for (const g of guides) {
      if (g.availability === 'na') continue;
      for (const l of g.languages || []) {
        const trimmed = (l || '').trim();
        if (trimmed) set.add(trimmed);
      }
    }
    return Array.from(set).sort();
  }, [guides]);

  // Soft warning: when both far-apart add-ons are selected without the
  // private transfer, suggest adding it. Pure heuristic — operators can
  // tweak the segment IDs in settings if their tour topology changes.
  const showTransferHint = useMemo(() => {
    const hasFar = selected.has('seg_antico_setificio') && selected.has('seg_stefanie_dux');
    const hasTransfer = selected.has('seg_transport_private');
    return hasFar && !hasTransfer;
  }, [selected]);

  const persistSelectionRef = useRef<{ selected: Set<string>; answers: Record<string, unknown> }>({
    selected,
    answers,
  });
  persistSelectionRef.current = { selected, answers };

  const persist = useCallback(
    async (
      override?: {
        selected?: Set<string>;
        answers?: Record<string, unknown>;
        confirm?: boolean;
      }
    ): Promise<boolean> => {
      // Read-only viewers (share tokens) skip the network round-trip — the
      // backend would 403 anyway. Make it a soft no-op so the wizard's
      // step-navigation code can keep calling persist() without branching.
      if (isReadOnly) return true;
      const sel = override?.selected ?? persistSelectionRef.current.selected;
      const ans = override?.answers ?? persistSelectionRef.current.answers;
      const result = await saveItinerary(token, {
        selected_segments: Array.from(sel),
        answers: ans,
        confirm: !!override?.confirm,
      });
      if (!result.ok) {
        setError(result.message);
        return false;
      }
      setData(result.data);
      setSelected(new Set(result.data.response.selected_segments));
      setAnswers(result.data.response.answers || {});
      setSavedAt(Date.now());
      setError(null);
      return true;
    },
    [token]
  );

  const goToStep = useCallback(
    (id: StepId, opts?: { skipSave?: boolean }) => {
      const params = new URLSearchParams(searchParams?.toString() || '');
      params.set('step', id);
      router.replace(`?${params.toString()}`, { scroll: false });
      track('tour_visit_step', { from: currentStepId, to: id, skipped_save: !!opts?.skipSave });
      if (!opts?.skipSave) {
        startSaving(async () => {
          await persist();
        });
      }
    },
    [router, searchParams, persist, currentStepId]
  );

  const goNext = () => {
    const next = STEPS[Math.min(currentIndex + 1, STEPS.length - 1)];
    goToStep(next.id);
  };
  const goPrev = () => {
    const prev = STEPS[Math.max(currentIndex - 1, 0)];
    goToStep(prev.id, { skipSave: true });
  };

  const toggleSegment = (id: string, locked: boolean) => {
    if (locked || isReadOnly) return;
    setSelected((prev) => {
      const next = new Set(prev);
      const action = next.has(id) ? 'remove' : 'add';
      if (next.has(id)) next.delete(id);
      else next.add(id);
      track('tour_segment_toggle', { segment_id: id, action });
      return next;
    });
  };

  const segmentById = (id: string) => segments.find((s) => s.id === id);

  const projectedCost = useMemo(() => {
    const ids = new Set(selected);
    const pax = data.cost.total_pax || 1;
    const lines = segments
      .filter((s) => ids.has(s.id) || s.required)
      .map((s) => ({
        id: s.id,
        title: s.title ?? s.id,
        base_price: s.base_price ?? 0,
        pax,
        line_total: Math.round((s.base_price ?? 0) * pax * 100) / 100,
      }));
    const subtotal = Math.round(lines.reduce((acc, l) => acc + l.line_total, 0) * 100) / 100;
    return {
      currency: data.cost.currency,
      total_pax: data.cost.total_pax,
      subtotal,
      by_segment: lines,
    };
  }, [selected, segments, data.cost.total_pax, data.cost.currency]);

  const traveller = data.traveller;
  const greetingName = traveller?.first_name || 'there';
  const headcountList = Object.entries(data.headcount).filter(([, n]) => n > 0);

  const onSaveFinal = () => {
    setError(null);
    track('tour_visit_confirm_attempt', {
      selected_count: selected.size,
      add_ons_currency: data.payment?.add_ons_currency,
      add_ons_due: data.payment?.add_ons_due,
    });
    startSaving(async () => {
      const ok = await persist({ confirm: true });
      if (ok) {
        setSavedAt(Date.now());
        setConfirmed(true);
        track('tour_visit_confirmed');
      }
    });
  };

  const handleShare = async () => {
    if (isReadOnly) return;
    setSharePending(true);
    track('tour_visit_share_attempt');
    try {
      const res = await createShareLink(token);
      if (!res.ok) {
        setError(res.message);
        track('tour_visit_share_failed', { status: res.status });
        return;
      }
      track('tour_visit_share_created');
      const url =
        typeof window !== 'undefined'
          ? `${window.location.origin}${res.data.visit_path}`
          : res.data.visit_path;
      setShareUrl(url);
      // Optimistically add to the in-memory list so the Revoke button shows
      // up immediately. The next persist round-trip rehydrates from server.
      setData((prev) => ({
        ...prev,
        shares: [
          ...(prev.shares || []),
          { token: res.data.share_token, mode: 'read', created_at: new Date().toISOString() },
        ],
      }));
      setError(null);
      try {
        await navigator.clipboard.writeText(url);
      } catch {
        /* clipboard might be blocked — link is still rendered */
      }
    } finally {
      setSharePending(false);
    }
  };

  const handleRevokeShare = async (shareToken: string) => {
    if (isReadOnly) return;
    const res = await revokeShareLink(token, shareToken);
    if (!res.ok) {
      setError(res.message);
      return;
    }
    track('tour_visit_share_revoked');
    setData((prev) => ({ ...prev, shares: res.data.shares }));
    if (shareUrl?.includes(shareToken)) setShareUrl(null);
    setError(null);
  };

  const handleDownloadIcs = () => {
    if (!data.booking.tour_date) return;
    const includedSegments = segments.filter(
      (s) => selected.has(s.id) || s.required
    );
    const totalMinutes = includedSegments.reduce(
      (acc, s) => acc + (typeof s.duration_minutes === 'number' ? s.duration_minutes : 0),
      0
    );
    const description = [
      `Booking ref: ${data.booking.booking_ref ?? '—'}`,
      `Visit link: ${typeof window !== 'undefined' ? window.location.href : ''}`,
      '',
      'Itinerary:',
      ...includedSegments.map(
        (s) => `• ${s.title ?? s.id}${s.time_slot ? ` (${s.time_slot})` : ''}`
      ),
    ].join('\n');

    const ics = buildTourIcs({
      uid: `tour-${data.response.id}@jaalyantra.com`,
      title: data.booking.product || data.form.title || 'JYT visit',
      description,
      location: 'Florence, Italy',
      startsAt: data.booking.tour_date,
      durationMinutes: totalMinutes > 0 ? totalMinutes : 240,
    });
    downloadIcs(`jyt-${data.booking.booking_ref ?? 'visit'}.ics`, ics);
  };

  const setAnswer = (name: string, value: unknown) => {
    if (isReadOnly) return;
    setAnswers((prev) => ({ ...prev, [name]: value }));
  };

  const toggleInterest = (value: string) => {
    if (isReadOnly) return;
    setAnswers((prev) => {
      const cur = Array.isArray(prev.interests) ? (prev.interests as string[]) : [];
      const next = cur.includes(value) ? cur.filter((v) => v !== value) : [...cur, value];
      return { ...prev, interests: next };
    });
  };

  return (
    <div className="min-h-screen bg-hero-wash pb-16">
      <header className="border-b border-olive-200/70 bg-white/70 backdrop-blur-sm">
        <div className="mx-auto w-full max-w-7xl px-6 py-6 lg:px-10">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-serif text-sm italic text-clay-700">Plan your visit</p>
              <h1 className="mt-0.5 font-display text-xl font-medium text-olive-950 sm:text-2xl">
                {data.booking.product || data.form.title}
              </h1>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-olive-500">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-clay-50 px-3 py-1 text-clay-800 ring-1 ring-clay-200">
                Booked via {sourceLabel(data.source)}
              </span>
              {data.booking.tour_date ? (
                <span>{formatDate(data.booking.tour_date)}</span>
              ) : null}
              {isReadOnly ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-amber-900 ring-1 ring-amber-200">
                  <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M3 5.5V4a3 3 0 0 1 6 0v1.5 M2.5 5.5h7v5h-7z" />
                  </svg>
                  Read-only — shared with you
                </span>
              ) : saving ? (
                <span className="inline-flex items-center gap-1.5 text-olive-600">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-olive-500" />
                  Saving…
                </span>
              ) : (
                <span
                  className="inline-flex items-center gap-1.5 text-olive-600"
                  title={`Last saved ${new Date(savedAt).toLocaleString()}`}
                >
                  <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M2 6.5l2.5 2.5L10 3.5" />
                  </svg>
                  Saved {formatRelativeTime(savedAt, now)}
                </span>
              )}
              {currentStepId !== 'itinerary' ? (
                <button
                  type="button"
                  className="text-clay-700 underline-offset-2 hover:underline"
                  onClick={() => goToStep('itinerary', { skipSave: true })}
                >
                  Skip to itinerary →
                </button>
              ) : null}
            </div>
          </div>

          <ol className="mt-5 flex flex-wrap items-center gap-2 text-xs">
            {STEPS.map((s, idx) => {
              const active = s.id === currentStepId;
              const done = idx < currentIndex;
              return (
                <li key={s.id} className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => goToStep(s.id, { skipSave: true })}
                    className={[
                      'inline-flex items-center gap-2 rounded-full px-3 py-1.5 transition',
                      active
                        ? 'bg-olive-950 text-white'
                        : done
                          ? 'bg-olive-100 text-olive-800 hover:bg-olive-200'
                          : 'bg-white text-olive-500 ring-1 ring-olive-200 hover:bg-olive-50',
                    ].join(' ')}
                  >
                    <span
                      className={[
                        'flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-mono',
                        active ? 'bg-white text-olive-950' : done ? 'bg-olive-300 text-olive-900' : 'bg-olive-200 text-olive-600',
                      ].join(' ')}
                    >
                      {idx + 1}
                    </span>
                    {s.label}
                  </button>
                  {idx < STEPS.length - 1 ? (
                    <span className="h-px w-6 bg-olive-300/70" aria-hidden="true" />
                  ) : null}
                </li>
              );
            })}
          </ol>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-6 py-12 lg:px-10">
        {currentStepId === 'welcome' ? (
          <section className="mx-auto max-w-3xl">
            <p className="font-serif text-base italic text-clay-700">
              Hi {greetingName} — we&apos;re glad you&apos;re coming.
            </p>
            <h2 className="mt-3 font-display text-3xl font-medium tracking-tight text-olive-950 sm:text-4xl">
              {story?.headline || 'A craft journey, told at your pace.'}
            </h2>
            {story?.body ? (
              <p className="mt-5 whitespace-pre-line text-base leading-relaxed text-olive-700">
                {story.body}
              </p>
            ) : (
              <p className="mt-5 text-base leading-relaxed text-olive-700">
                JYT exists to put artisans at the centre of the story — weavers, dyers, and master craftspeople
                whose work normally disappears behind a label. This visit is yours to shape: we&apos;ll show you
                their workshops, their tools, and the cloth they&apos;ve given a lifetime to. Pick what you&apos;d
                like to see. Skip what you wouldn&apos;t. We adjust around you.
              </p>
            )}

            {trust ? (
              <ul className="mt-6 flex flex-wrap gap-2 text-xs">
                {trust.duration ? (
                  <li className="rounded-full bg-white px-3 py-1.5 text-olive-800 ring-1 ring-olive-200">
                    {trust.duration}
                  </li>
                ) : null}
                {typeof trust.group_cap === 'number' ? (
                  <li className="rounded-full bg-white px-3 py-1.5 text-olive-800 ring-1 ring-olive-200">
                    Capped at {trust.group_cap}
                  </li>
                ) : null}
                {Array.isArray(trust.languages) && trust.languages.length > 0 ? (
                  <li className="rounded-full bg-white px-3 py-1.5 text-olive-800 ring-1 ring-olive-200">
                    {trust.languages.join(' · ')}
                  </li>
                ) : null}
                {trust.wheelchair_accessible ? (
                  <li className="rounded-full bg-white px-3 py-1.5 text-olive-800 ring-1 ring-olive-200">
                    Wheelchair accessible
                  </li>
                ) : null}
                {typeof trust.free_cancellation_hours === 'number' ? (
                  <li className="rounded-full bg-emerald-50 px-3 py-1.5 text-emerald-800 ring-1 ring-emerald-200">
                    Free cancellation {trust.free_cancellation_hours}h ahead
                  </li>
                ) : null}
                {trust.pay_later ? (
                  <li className="rounded-full bg-emerald-50 px-3 py-1.5 text-emerald-800 ring-1 ring-emerald-200">
                    Reserve now, pay later
                  </li>
                ) : null}
              </ul>
            ) : null}

            {highlights.length > 0 ? (
              <div className="mt-8 rounded-2xl border border-olive-200 bg-white p-5">
                <h3 className="font-display text-sm font-medium uppercase tracking-wide text-olive-500">
                  Highlights
                </h3>
                <ul className="mt-3 space-y-2">
                  {highlights.map((h, i) => (
                    <li key={i} className="flex items-baseline gap-2 text-sm text-olive-800">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-clay-500" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <dl className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {data.booking.booking_ref ? (
                <div className="rounded-2xl border border-olive-200 bg-white p-4">
                  <dt className="text-xs uppercase tracking-wide text-olive-500">Booking ref</dt>
                  <dd className="mt-1 font-mono text-sm text-olive-900">{data.booking.booking_ref}</dd>
                </div>
              ) : null}
              {headcountList.length > 0 ? (
                <div className="rounded-2xl border border-olive-200 bg-white p-4">
                  <dt className="text-xs uppercase tracking-wide text-olive-500">Travellers</dt>
                  <dd className="mt-1 text-sm text-olive-900">
                    {headcountList.map(([cat, n]) => `${n} ${cat}`).join(' · ')}
                  </dd>
                </div>
              ) : null}
              {data.payment.paid_via_source ? (
                <div className="rounded-2xl border border-olive-200 bg-white p-4">
                  <dt className="text-xs uppercase tracking-wide text-olive-500">
                    Paid via {data.payment.paid_via_source.provider}
                  </dt>
                  <dd className="mt-1 font-mono text-sm text-olive-900">
                    {data.payment.local_view?.paid_via_source != null
                      ? formatMoney(
                          data.payment.local_view.paid_via_source,
                          data.payment.local_view.currency
                        )
                      : formatMoney(
                          data.payment.paid_via_source.amount,
                          data.payment.paid_via_source.currency
                        )}
                  </dd>
                  {data.payment.local_view?.paid_via_source != null ? (
                    <dd className="mt-0.5 text-xs text-olive-500">
                      Charged as{' '}
                      {formatMoney(
                        data.payment.paid_via_source.amount,
                        data.payment.paid_via_source.currency
                      )}
                    </dd>
                  ) : null}
                </div>
              ) : null}
            </dl>

            <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
              <span className="text-sm text-olive-500">Takes about 3 minutes.</span>
              <button
                type="button"
                onClick={goNext}
                className="inline-flex items-center gap-2 rounded-full bg-clay-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-clay-500"
              >
                Let&apos;s begin
                <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2.5 6h7m0 0L6 2.5M9.5 6 6 9.5" />
                </svg>
              </button>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-3 border-t border-olive-200 pt-6 text-xs text-olive-500 sm:grid-cols-2">
              <p>
                <span className="font-medium text-olive-700">Need to cancel?</span>{' '}
                Cancellations are managed via your GetYourGuide booking — log into{' '}
                <a
                  href="https://www.getyourguide.com/account/bookings"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-clay-700 underline-offset-2 hover:underline"
                >
                  your GYG bookings
                </a>{' '}
                to cancel or reschedule, free up to 24 hours ahead.
              </p>
              <p>
                <span className="font-medium text-olive-700">Your privacy:</span>{' '}
                We collect dietary preferences, access needs and emergency contact
                details only to host you well — they go to your guide and nowhere
                else. See our{' '}
                <a
                  href="/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-clay-700 underline-offset-2 hover:underline"
                >
                  privacy policy
                </a>{' '}
                for the full GDPR detail.
              </p>
            </div>
          </section>
        ) : null}

        {currentStepId === 'guides' ? (
          <section className="mx-auto max-w-5xl">
            <h2 className="font-display text-2xl font-medium text-olive-950 sm:text-3xl">
              Meet the people you&apos;ll spend time with
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-olive-600">
              Tell them what you&apos;re curious about — they&apos;ll tailor the day around it.
            </p>

            {guides.length === 0 ? (
              <div className="mt-8 rounded-2xl border border-dashed border-olive-300 bg-white p-10 text-center text-olive-500">
                Guide bios are being written — we&apos;ll introduce them on the day.
              </div>
            ) : (
              <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {guides.map((g) => {
                  const isPlaceholder = g.availability === 'na';
                  return (
                    <article
                      key={g.id || g.name}
                      className={[
                        'relative flex flex-col overflow-hidden rounded-2xl border bg-white shadow-sm transition',
                        isPlaceholder
                          ? 'border-olive-200/70 opacity-80'
                          : 'border-olive-200',
                      ].join(' ')}
                    >
                      {g.photo_url ? (
                        <div className="relative aspect-[4/5] w-full bg-olive-100">
                          <Image
                            src={g.photo_url}
                            alt={g.name}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className={[
                              'object-cover',
                              isPlaceholder ? 'grayscale' : '',
                            ].join(' ')}
                          />
                        </div>
                      ) : (
                        <div className="aspect-[4/5] w-full bg-gradient-to-br from-clay-100 via-olive-100 to-clay-200" />
                      )}

                      <span
                        className={[
                          'absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium shadow-sm backdrop-blur-sm',
                          isPlaceholder
                            ? 'bg-white/85 text-olive-700 ring-1 ring-olive-200'
                            : 'bg-emerald-600/90 text-white',
                        ].join(' ')}
                      >
                        <span
                          className={[
                            'h-1.5 w-1.5 rounded-full',
                            isPlaceholder ? 'bg-olive-400' : 'bg-white',
                          ].join(' ')}
                          aria-hidden="true"
                        />
                        {isPlaceholder ? 'Profile coming soon' : 'Available'}
                      </span>

                      <div className="flex flex-1 flex-col gap-y-4 px-6 py-6">
                        <div className="flex flex-col gap-y-1">
                          <h3 className="font-display text-lg font-medium leading-tight text-olive-950">
                            {g.name}
                          </h3>
                          {g.role ? (
                            <p className="font-serif text-sm italic leading-snug text-clay-700">
                              {g.role}
                            </p>
                          ) : null}
                        </div>
                        {g.bio ? (
                          <p className="text-sm leading-7 text-olive-700">{g.bio}</p>
                        ) : null}
                        {isPlaceholder ? (
                          <p className="rounded-lg bg-olive-50 px-3 py-2 text-xs leading-5 text-olive-600">
                            We&apos;re still finalising who will host this date — your
                            actual guide will be confirmed before the visit.
                          </p>
                        ) : null}
                        {(Array.isArray(g.languages) && g.languages.length > 0) ||
                        g.instagram ? (
                          <div className="mt-auto flex flex-wrap gap-2 pt-2 text-xs text-olive-500">
                            {Array.isArray(g.languages) && g.languages.length > 0 ? (
                              <span className="rounded-full bg-olive-50 px-2.5 py-1">
                                {g.languages.join(' · ')}
                              </span>
                            ) : null}
                            {g.instagram && !isPlaceholder ? (
                              <a
                                href={
                                  g.instagram.startsWith('http')
                                    ? g.instagram
                                    : `https://instagram.com/${g.instagram.replace(/^@/, '')}`
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                className="rounded-full bg-clay-50 px-2.5 py-1 text-clay-800 hover:bg-clay-100"
                              >
                                {g.instagram.startsWith('@') ? g.instagram : `@${g.instagram}`}
                              </a>
                            ) : null}
                          </div>
                        ) : null}
                      </div>
                    </article>
                  );
                })}
              </div>
            )}

            <NavButtons onBack={goPrev} onNext={goNext} saving={saving} />
          </section>
        ) : null}

        {currentStepId === 'itinerary' ? (
          <section>
            <h2 className="font-display text-2xl font-medium text-olive-950 sm:text-3xl">
              Pick your itinerary
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-olive-600">
              Click a card to add it. Tap &quot;Learn more&quot; for the full story, photos, and links.
              Your total updates as you go.
            </p>

            {showTransferHint ? (
              <div
                role="status"
                className="mt-6 flex flex-col gap-3 rounded-2xl border border-clay-200 bg-clay-50/70 p-4 text-sm sm:flex-row sm:items-start sm:gap-4 sm:p-5"
              >
                <span
                  className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-clay-100 text-clay-700"
                  aria-hidden="true"
                >
                  <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M8 1.5l6.5 11h-13l6.5-11Z M8 6.5v3 M8 11.5v0.1" />
                  </svg>
                </span>
                <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-clay-900">
                    Antico Setificio and Stefanie Dux are about 25 minutes apart by foot —
                    consider adding the private transfer so you don&apos;t lose the day to logistics.
                  </p>
                  <button
                    type="button"
                    onClick={() => toggleSegment('seg_transport_private', false)}
                    className="inline-flex shrink-0 items-center gap-2 rounded-full bg-clay-700 px-3.5 py-1.5 text-xs font-medium text-white shadow-sm transition hover:bg-clay-600"
                  >
                    Add transfer
                  </button>
                </div>
              </div>
            ) : null}

            {segments.length === 0 ? (
              <p className="mt-8 rounded-2xl border border-dashed border-olive-300 bg-white p-8 text-center text-olive-500">
                No itinerary parts have been set up yet. We&apos;ll be in touch directly.
              </p>
            ) : (
              <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {segments.map((s) => {
                  const isSelected = selected.has(s.id) || !!s.required;
                  const isLocked = !!s.required;
                  return (
                    <div
                      key={s.id}
                      className={[
                        'group relative flex flex-col overflow-hidden rounded-2xl border bg-white text-left transition',
                        isSelected
                          ? 'border-clay-500 ring-1 ring-clay-500/40 shadow-md'
                          : 'border-olive-200 hover:border-olive-400 hover:shadow-sm',
                      ].join(' ')}
                    >
                      <button
                        type="button"
                        aria-pressed={isSelected}
                        onClick={() => toggleSegment(s.id, isLocked)}
                        className="text-left"
                        disabled={isLocked}
                      >
                        {s.image_url ? (
                          <div className="relative aspect-[4/3] w-full overflow-hidden bg-olive-100">
                            <Image
                              src={s.image_url}
                              alt={s.title || s.id}
                              fill
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="aspect-[4/3] w-full bg-gradient-to-br from-olive-100 via-clay-100 to-olive-200" />
                        )}

                        <div className="flex flex-1 flex-col gap-2 p-4">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-display text-base font-medium text-olive-950">
                              {s.title || s.id}
                            </h3>
                            <span
                              className={[
                                'inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs',
                                isSelected
                                  ? 'border-clay-500 bg-clay-500 text-white'
                                  : 'border-olive-300 bg-white text-olive-400',
                              ].join(' ')}
                              aria-hidden="true"
                            >
                              {isSelected ? '✓' : '+'}
                            </span>
                          </div>

                          {s.description ? (
                            <p className="line-clamp-3 text-sm text-olive-600">{s.description}</p>
                          ) : null}

                          <div className="mt-auto flex flex-wrap items-center gap-3 pt-2 text-xs text-olive-500">
                            {s.duration_minutes ? <span>{formatDuration(s.duration_minutes)}</span> : null}
                            {s.time_slot ? <span>{s.time_slot}</span> : null}
                            {isLocked ? <span className="rounded bg-olive-100 px-2 py-0.5 text-olive-700">Included</span> : null}
                            {typeof s.base_price === 'number' && s.base_price > 0 ? (
                              <span className="ml-auto font-mono text-olive-800">
                                +{formatMoney(s.base_price, s.currency || data.cost.currency)} / pax
                              </span>
                            ) : null}
                          </div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setOpenSegment(s)}
                        className="border-t border-olive-100 px-4 py-2 text-left text-xs text-clay-700 transition hover:bg-clay-50"
                      >
                        Learn more →
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            <NavButtons onBack={goPrev} onNext={goNext} saving={saving} />
          </section>
        ) : null}

        {currentStepId === 'details' ? (
          <section className="mx-auto max-w-3xl">
            <h2 className="font-display text-2xl font-medium text-olive-950 sm:text-3xl">
              A few details before we host you
            </h2>
            <p className="mt-2 text-sm text-olive-600">
              Anything you tell us here goes only to the guide leading your day.
            </p>

            <div className="mt-8 flex flex-col gap-y-5">
              <QuestionCard
                title="What draws you to JYT?"
                help="Pick all that apply — helps us pace the day around what matters to you."
                asFieldset
              >
                <ChipRow
                  options={ONBOARDING_INTERESTS}
                  value={Array.isArray(answers.interests) ? (answers.interests as string[]) : []}
                  onChange={(next) => setAnswer('interests', next)}
                  multi
                />
              </QuestionCard>

              <QuestionCard
                title="Dietary preferences & allergies"
                help="Anything we should plan around at lunch or for snacks during the day."
              >
                <textarea
                  rows={2}
                  className={fieldInputClass}
                  placeholder="Vegetarian, gluten-free, nut allergy…"
                  value={(answers.dietary as string | undefined) ?? ''}
                  onChange={(e) => setAnswer('dietary', e.target.value)}
                />
              </QuestionCard>

              <QuestionCard
                title="Access needs & pace"
                help="Mobility, stairs, sensory considerations, energy level — anything we should plan around."
              >
                <textarea
                  rows={2}
                  className={fieldInputClass}
                  placeholder="A few words is plenty…"
                  value={(answers.access_needs as string | undefined) ?? ''}
                  onChange={(e) => setAnswer('access_needs', e.target.value)}
                />
              </QuestionCard>

              <QuestionCard
                title="Preferred language for the day"
                help={
                  guideLanguages.length > 0
                    ? `We can host in: ${guideLanguages.join(', ')}.`
                    : 'We will match you with a guide who speaks this comfortably.'
                }
              >
                {guideLanguages.length > 0 ? (
                  <select
                    className={fieldInputClass}
                    value={(answers.preferred_language as string | undefined) ?? ''}
                    onChange={(e) => setAnswer('preferred_language', e.target.value)}
                  >
                    <option value="">No preference</option>
                    {guideLanguages.map((lang) => (
                      <option key={lang} value={lang}>
                        {lang}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    placeholder={traveller?.language || 'English'}
                    className={fieldInputClass}
                    value={(answers.preferred_language as string | undefined) ?? ''}
                    onChange={(e) => setAnswer('preferred_language', e.target.value)}
                  />
                )}
              </QuestionCard>

              <QuestionCard
                title="Photos on the day"
                help="We sometimes share short workshop reels with our partners. Tell us your preference."
                asFieldset
              >
                <ChipRow
                  options={PHOTO_PERMISSION_OPTIONS}
                  value={(answers.photo_permission as string | undefined) ?? ''}
                  onChange={(next) => setAnswer('photo_permission', next)}
                />
              </QuestionCard>

              <QuestionCard
                title="Travel insurance"
                help="Some workshops involve sharp tools and dye baths. We strongly recommend a policy that covers minor incidents."
                asFieldset
              >
                <ChipRow
                  options={INSURANCE_OPTIONS}
                  value={(answers.insurance as string | undefined) ?? ''}
                  onChange={(next) => setAnswer('insurance', next)}
                />
                {answers.insurance === 'yes' ? (
                  <div className="mt-4">
                    <label className="flex flex-col gap-y-1.5">
                      <span className="text-xs text-olive-700">Insurance provider</span>
                      <input
                        type="text"
                        placeholder="Optional"
                        className={fieldInputClass}
                        value={(answers.insurance_provider as string | undefined) ?? ''}
                        onChange={(e) => setAnswer('insurance_provider', e.target.value)}
                      />
                    </label>
                  </div>
                ) : null}
              </QuestionCard>

              <QuestionCard
                title="How are you arriving in Florence?"
                help="Helps us plan the meet-up and tell you the closest pickup point."
                asFieldset
              >
                <ChipRow
                  options={ARRIVAL_MODE_OPTIONS}
                  value={(answers.arrival_mode as string | undefined) ?? ''}
                  onChange={(next) => setAnswer('arrival_mode', next)}
                />
                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <label className="flex flex-col gap-y-1.5">
                    <span className="text-xs text-olive-700">Arrival time (approx.)</span>
                    <input
                      type="text"
                      placeholder="14:30 on the 4th"
                      className={fieldInputClass}
                      value={(answers.arrival_time as string | undefined) ?? ''}
                      onChange={(e) => setAnswer('arrival_time', e.target.value)}
                    />
                  </label>
                  <label className="flex flex-col gap-y-1.5">
                    <span className="text-xs text-olive-700">Where you&apos;re staying</span>
                    <input
                      type="text"
                      placeholder="Hotel name / neighbourhood"
                      className={fieldInputClass}
                      value={(answers.accommodation as string | undefined) ?? ''}
                      onChange={(e) => setAnswer('accommodation', e.target.value)}
                    />
                  </label>
                </div>
              </QuestionCard>

              <QuestionCard
                title="Getting to the first meeting point"
                help="From your hotel/arrival point to Fondazione Lisio. We can help with each option."
                asFieldset
              >
                <ChipRow
                  options={MEETING_POINT_TRANSPORT_OPTIONS}
                  value={(answers.meeting_point_transport as string | undefined) ?? ''}
                  onChange={(next) => setAnswer('meeting_point_transport', next)}
                />
              </QuestionCard>

              <QuestionCard
                title="Emergency contact"
                help="Someone we can reach if anything happens during the day."
              >
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <label className="flex flex-col gap-y-1.5">
                    <span className="text-xs text-olive-700">Name</span>
                    <input
                      type="text"
                      className={fieldInputClass}
                      value={(answers.emergency_contact_name as string | undefined) ?? ''}
                      onChange={(e) => setAnswer('emergency_contact_name', e.target.value)}
                    />
                  </label>
                  <label className="flex flex-col gap-y-1.5">
                    <span className="text-xs text-olive-700">Phone</span>
                    <input
                      type="tel"
                      className={fieldInputClass}
                      placeholder="+1 555 123 4567"
                      value={(answers.emergency_contact_phone as string | undefined) ?? ''}
                      onChange={(e) => setAnswer('emergency_contact_phone', e.target.value)}
                    />
                  </label>
                </div>
              </QuestionCard>

              {fields.length > 0 ? (
                <QuestionCard
                  title="A few more questions"
                  help="Configured by the host for this specific tour."
                >
                  <div className="grid grid-cols-1 gap-4">
                    {fields.map((field) => {
                      const value = (answers[field.name] as string | undefined) ?? '';
                      const setValue = (v: string) => setAnswer(field.name, v);

                      return (
                        <label key={field.id} className="flex flex-col gap-y-1.5">
                          <span className="text-sm font-medium text-olive-900">
                            {field.label}
                            {field.required ? <span className="ml-1 text-clay-600">*</span> : null}
                          </span>
                          {field.type === 'textarea' ? (
                            <textarea
                              rows={3}
                              className={fieldInputClass}
                              placeholder={field.placeholder ?? undefined}
                              value={value}
                              onChange={(e) => setValue(e.target.value)}
                            />
                          ) : field.type === 'select' && Array.isArray(field.options) ? (
                            <select
                              className={fieldInputClass}
                              value={value}
                              onChange={(e) => setValue(e.target.value)}
                            >
                              <option value="">Select…</option>
                              {(field.options as Array<{ value: string; label?: string }>).map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                  {opt.label ?? opt.value}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <input
                              type={
                                field.type === 'email'
                                  ? 'email'
                                  : field.type === 'phone'
                                    ? 'tel'
                                    : 'text'
                              }
                              className={fieldInputClass}
                              placeholder={field.placeholder ?? undefined}
                              value={value}
                              onChange={(e) => setValue(e.target.value)}
                            />
                          )}
                          {field.help_text ? (
                            <span className="text-xs text-olive-500">{field.help_text}</span>
                          ) : null}
                        </label>
                      );
                    })}
                  </div>
                </QuestionCard>
              ) : null}
            </div>

            <NavButtons onBack={goPrev} onNext={goNext} saving={saving} />
          </section>
        ) : null}

        {currentStepId === 'review' && confirmed ? (
          <section className="mx-auto max-w-3xl">
            <div className="rounded-3xl border border-olive-200 bg-white p-8 text-center shadow-sm sm:p-12">
              <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200">
                <svg viewBox="0 0 16 16" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M3 8.5l3 3L13 4" />
                </svg>
              </div>
              <p className="mt-5 font-serif text-sm italic text-clay-700">Confirmed</p>
              <h2 className="mt-2 font-display text-3xl font-medium text-olive-950 sm:text-4xl">
                We&apos;ve got your day, {data.traveller?.first_name || 'there'}.
              </h2>
              <p className="mt-3 text-sm text-olive-600">
                Saved {formatRelativeTime(savedAt, now)} · You can come back to this link anytime to change your selections.
              </p>
            </div>

            <ol className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <li className="rounded-2xl border border-olive-200 bg-white p-5">
                <span className="font-mono text-xs text-olive-500">01</span>
                <p className="mt-2 font-display text-base font-medium text-olive-950">
                  We email your itinerary
                </p>
                <p className="mt-1 text-sm leading-6 text-olive-600">
                  A copy lands in your inbox so you can find this page later.
                </p>
              </li>
              <li className="rounded-2xl border border-olive-200 bg-white p-5">
                <span className="font-mono text-xs text-olive-500">02</span>
                <p className="mt-2 font-display text-base font-medium text-olive-950">
                  Your guide reaches out
                </p>
                <p className="mt-1 text-sm leading-6 text-olive-600">
                  About 48 hours before your visit — meeting point, what to bring, any last questions.
                </p>
              </li>
              <li className="rounded-2xl border border-olive-200 bg-white p-5">
                <span className="font-mono text-xs text-olive-500">03</span>
                <p className="mt-2 font-display text-base font-medium text-olive-950">
                  You show up & we host
                </p>
                <p className="mt-1 text-sm leading-6 text-olive-600">
                  Add-ons settle on the day with your guide — cash or card, whichever you prefer.
                </p>
              </li>
            </ol>

            <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-olive-200 pt-6">
              <button
                type="button"
                onClick={() => {
                  setConfirmed(false);
                  goToStep('itinerary', { skipSave: true });
                }}
                className="text-sm text-clay-700 underline-offset-2 hover:underline"
              >
                ← Change my itinerary
              </button>
              <div className="flex flex-wrap items-center gap-2">
                {data.booking.tour_date ? (
                  <button
                    type="button"
                    onClick={handleDownloadIcs}
                    className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-olive-800 ring-1 ring-olive-200 transition hover:bg-olive-50"
                  >
                    <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <rect x="2" y="3" width="12" height="11" rx="1.5" />
                      <path d="M2 6h12 M5 1.5v3 M11 1.5v3" />
                    </svg>
                    Add to calendar
                  </button>
                ) : null}
                <a
                  href="/"
                  className="inline-flex items-center gap-2 rounded-full bg-olive-50 px-4 py-2 text-sm font-medium text-olive-800 ring-1 ring-olive-200 transition hover:bg-olive-100"
                >
                  Back to JYT
                </a>
              </div>
            </div>
          </section>
        ) : null}

        {currentStepId === 'review' && !confirmed ? (
          <section className="mx-auto max-w-3xl">
            <h2 className="font-display text-2xl font-medium text-olive-950 sm:text-3xl">
              Last look — does this feel right?
            </h2>
            <p className="mt-2 text-sm text-olive-600">
              You can come back to this link anytime to change your selections.
            </p>

            <div className="mt-8 rounded-2xl border border-olive-200 bg-white">
              <div className="flex items-center justify-between border-b border-olive-100 px-5 py-4">
                <h3 className="font-display text-base font-medium text-olive-950">Your day</h3>
                <button
                  type="button"
                  onClick={() => goToStep('itinerary', { skipSave: true })}
                  className="text-xs text-clay-700 hover:underline"
                >
                  Edit
                </button>
              </div>
              <ul className="divide-y divide-olive-100">
                {projectedCost.by_segment.length === 0 ? (
                  <li className="px-5 py-4 text-sm text-olive-500">No itinerary parts selected yet.</li>
                ) : (
                  projectedCost.by_segment.map((line) => {
                    const seg = segmentById(line.id);
                    return (
                      <li key={line.id} className="flex items-center justify-between gap-4 px-5 py-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-olive-900">{line.title}</p>
                          <p className="text-xs text-olive-500">
                            {seg?.duration_minutes ? formatDuration(seg.duration_minutes) : ''}
                            {seg?.required ? ' · Always included' : ''}
                          </p>
                        </div>
                        <div className="text-right whitespace-nowrap">
                          <p className="font-mono text-sm text-olive-900">
                            {formatMoney(line.line_total, projectedCost.currency)}
                          </p>
                          <p className="text-xs text-olive-500">
                            {line.pax} × {formatMoney(line.base_price, projectedCost.currency)}
                          </p>
                        </div>
                      </li>
                    );
                  })
                )}
              </ul>
            </div>

            <div className="mt-6 rounded-2xl border border-olive-200 bg-white">
              <div className="flex items-center justify-between border-b border-olive-100 px-5 py-4">
                <h3 className="font-display text-base font-medium text-olive-950">Payment</h3>
                <span className="text-xs text-olive-500">via {sourceLabel(data.source)}</span>
              </div>
              {(() => {
                const lv = data.payment.local_view;
                const useLocal = !!lv;
                const paid = data.payment.paid_via_source;
                const addOnsCurrency = data.payment.add_ons_currency;

                // Primary numbers: prefer local view; fall back to per-leg native.
                const paidPrimary = useLocal
                  ? lv!.paid_via_source != null
                    ? { amount: lv!.paid_via_source, currency: lv!.currency }
                    : null
                  : paid
                    ? { amount: paid.amount, currency: paid.currency }
                    : null;
                const addOnsPrimary = useLocal
                  ? { amount: lv!.add_ons_due, currency: lv!.currency }
                  : { amount: projectedCost.subtotal, currency: projectedCost.currency };
                const totalPrimary = useLocal
                  ? { amount: lv!.total, currency: lv!.currency }
                  : data.payment.total != null && data.payment.total_currency
                    ? { amount: data.payment.total, currency: data.payment.total_currency }
                    : null;

                return (
                  <>
                    <dl className="divide-y divide-olive-100">
                      {paid ? (
                        <div className="flex items-start justify-between gap-3 px-5 py-3">
                          <dt className="text-sm text-olive-700">
                            Paid via {paid.provider}
                            <span className="ml-2 text-xs text-olive-500">
                              (covers Lisio &amp; Tessitura LAB Casini Guidotti)
                            </span>
                          </dt>
                          <dd className="text-right">
                            <div className="font-mono text-sm text-olive-900">
                              {paidPrimary
                                ? formatMoney(paidPrimary.amount, paidPrimary.currency)
                                : formatMoney(paid.amount, paid.currency)}
                            </div>
                            {useLocal ? (
                              <div className="text-xs text-olive-500">
                                Charged as {formatMoney(paid.amount, paid.currency)}
                              </div>
                            ) : null}
                          </dd>
                        </div>
                      ) : null}
                      <div className="flex items-start justify-between gap-3 px-5 py-3">
                        <dt className="text-sm text-olive-700">Add-ons today</dt>
                        <dd className="text-right">
                          <div className="font-mono text-sm text-olive-900">
                            {formatMoney(addOnsPrimary.amount, addOnsPrimary.currency)}
                          </div>
                          {useLocal && lv!.currency !== addOnsCurrency ? (
                            <div className="text-xs text-olive-500">
                              {formatMoney(projectedCost.subtotal, addOnsCurrency)} on the day
                            </div>
                          ) : null}
                        </dd>
                      </div>
                      {totalPrimary ? (
                        <div className="flex items-start justify-between gap-3 bg-olive-50/40 px-5 py-3">
                          <dt className="text-base font-medium text-olive-950">
                            Total for the day
                          </dt>
                          <dd className="text-right">
                            <div className="font-mono text-lg font-medium text-olive-950">
                              {formatMoney(totalPrimary.amount, totalPrimary.currency)}
                            </div>
                          </dd>
                        </div>
                      ) : null}
                    </dl>
                    <p className="px-5 py-3 text-xs text-olive-500">
                      {useLocal
                        ? `Shown in ${lv!.currency} based on today's rate. Add-ons settle on the day with your guide — cash or card.`
                        : 'Add-ons settle on the day with your guide — cash or card.'}
                    </p>
                  </>
                );
              })()}
            </div>

            {(() => {
              const sites = projectedCost.by_segment
                .map((line) => {
                  const seg = segmentById(line.id);
                  return seg && (seg.location?.address || seg.location?.lat) ? seg : null;
                })
                .filter((s): s is TourSegment => !!s);
              if (sites.length === 0) return null;
              const buildMapsUrl = (s: TourSegment): string => {
                const loc = s.location;
                if (!loc) return '#';
                if (typeof loc.lat === 'number' && typeof loc.lng === 'number') {
                  // Apple Maps + Google Maps both honour ?q=lat,lng — covers iOS/macOS
                  // (Apple Maps) and everything else (Google Maps).
                  return `https://www.google.com/maps/search/?api=1&query=${loc.lat},${loc.lng}`;
                }
                return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  loc.address || s.title || ''
                )}`;
              };
              return (
                <div className="mt-6 rounded-2xl border border-olive-200 bg-white">
                  <div className="border-b border-olive-100 px-5 py-4">
                    <h3 className="font-display text-base font-medium text-olive-950">
                      Where you&apos;ll be
                    </h3>
                    <p className="mt-1 text-xs text-olive-500">
                      Tap any site to open it in your maps app.
                    </p>
                  </div>
                  <ol className="divide-y divide-olive-100">
                    {sites.map((s, idx) => (
                      <li
                        key={s.id}
                        className="flex items-start gap-4 px-5 py-4"
                      >
                        <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-olive-100 font-mono text-xs text-olive-700">
                          {idx + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-olive-900">
                            {s.title || s.id}
                          </p>
                          {s.location?.address ? (
                            <p className="mt-0.5 text-sm text-olive-600">
                              {s.location.address}
                            </p>
                          ) : null}
                          <div className="mt-2 flex flex-wrap gap-2 text-xs">
                            <a
                              href={buildMapsUrl(s)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 rounded-full bg-olive-50 px-2.5 py-1 text-olive-800 ring-1 ring-olive-200 hover:bg-olive-100"
                            >
                              <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <path d="M6 1.5C3.8 1.5 2 3.3 2 5.5c0 3 4 5 4 5s4-2 4-5c0-2.2-1.8-4-4-4Z M6 4.5a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4Z" />
                              </svg>
                              Open in Maps
                            </a>
                            {s.time_slot ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-clay-50 px-2.5 py-1 text-clay-800 ring-1 ring-clay-200">
                                {s.time_slot}
                              </span>
                            ) : null}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              );
            })()}

            {excluded.length > 0 ? (
              <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50/50">
                <div className="flex items-start gap-3 px-5 py-4">
                  <span
                    aria-hidden="true"
                    className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-800"
                  >
                    <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="8" cy="8" r="6" />
                      <path d="M8 5v3.5M8 11v0.1" />
                    </svg>
                  </span>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display text-base font-medium text-olive-950">
                      Not included
                    </h3>
                    <p className="mt-1 text-xs text-olive-600">
                      Plan for these separately — they aren&apos;t covered by your booking.
                    </p>
                    <ul className="mt-3 flex flex-col gap-1.5 text-sm text-olive-800">
                      {excluded.map((line, i) => (
                        <li key={i} className="flex items-baseline gap-2">
                          <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-amber-600" />
                          <span>{line}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ) : null}

            {practical &&
            (practical.what_to_wear ||
              practical.what_we_provide ||
              practical.what_to_bring ||
              practical.meeting_point) ? (
              <div className="mt-6 rounded-2xl border border-olive-200 bg-white">
                <div className="border-b border-olive-100 px-5 py-4">
                  <h3 className="font-display text-base font-medium text-olive-950">
                    On the day
                  </h3>
                  <p className="mt-1 text-xs text-olive-500">
                    Practical notes so you arrive ready and at ease.
                  </p>
                </div>
                <dl className="grid grid-cols-1 divide-y divide-olive-100 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
                  {practical.meeting_point ? (
                    <div className="px-5 py-4 sm:py-5">
                      <dt className="text-xs uppercase tracking-wide text-olive-500">
                        Meeting point
                      </dt>
                      <dd className="mt-1.5 whitespace-pre-line text-sm leading-6 text-olive-800">
                        {practical.meeting_point}
                      </dd>
                    </div>
                  ) : null}
                  {practical.what_to_wear ? (
                    <div className="px-5 py-4 sm:py-5">
                      <dt className="text-xs uppercase tracking-wide text-olive-500">
                        What to wear
                      </dt>
                      <dd className="mt-1.5 whitespace-pre-line text-sm leading-6 text-olive-800">
                        {practical.what_to_wear}
                      </dd>
                    </div>
                  ) : null}
                  {practical.what_we_provide ? (
                    <div className="border-t border-olive-100 px-5 py-4 sm:py-5">
                      <dt className="text-xs uppercase tracking-wide text-olive-500">
                        We provide
                      </dt>
                      <dd className="mt-1.5 whitespace-pre-line text-sm leading-6 text-olive-800">
                        {practical.what_we_provide}
                      </dd>
                    </div>
                  ) : null}
                  {practical.what_to_bring ? (
                    <div className="border-t border-olive-100 px-5 py-4 sm:py-5">
                      <dt className="text-xs uppercase tracking-wide text-olive-500">
                        What to bring
                      </dt>
                      <dd className="mt-1.5 whitespace-pre-line text-sm leading-6 text-olive-800">
                        {practical.what_to_bring}
                      </dd>
                    </div>
                  ) : null}
                </dl>
              </div>
            ) : null}

            {!isReadOnly ? (
              <div className="mt-6 rounded-2xl border border-clay-200 bg-clay-50/50 px-5 py-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-olive-900">
                      Travelling with someone?
                    </p>
                    <p className="mt-0.5 text-xs text-olive-600">
                      Share a read-only copy so they can see the day without
                      changing your selections.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleShare}
                    disabled={sharePending}
                    className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-xs font-medium text-clay-800 ring-1 ring-clay-200 transition hover:bg-clay-100 disabled:opacity-60"
                  >
                    {sharePending ? 'Creating link…' : shareUrl ? 'New share link' : 'Share with partner'}
                  </button>
                </div>
                {shareUrl ? (
                  <div className="mt-3 flex flex-wrap items-center gap-2 rounded-xl bg-white px-3 py-2 text-xs">
                    <span className="text-olive-500 shrink-0">Copied:</span>
                    <code className="flex-1 min-w-0 truncate font-mono text-olive-800">
                      {shareUrl}
                    </code>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard?.writeText(shareUrl).catch(() => {});
                      }}
                      className="shrink-0 rounded-full bg-olive-50 px-2.5 py-1 text-olive-800 ring-1 ring-olive-200 hover:bg-olive-100"
                    >
                      Copy again
                    </button>
                  </div>
                ) : null}

                {(data.shares || []).length > 0 ? (
                  <div className="mt-3 flex flex-col gap-1.5">
                    <p className="text-xs font-medium text-olive-700">
                      Active share links ({(data.shares || []).length}/3)
                    </p>
                    <ul className="flex flex-col gap-1.5">
                      {(data.shares || []).map((share) => {
                        const url =
                          typeof window !== 'undefined'
                            ? `${window.location.origin}/tours/visit/${share.token}`
                            : `/tours/visit/${share.token}`;
                        const created = new Date(share.created_at);
                        return (
                          <li
                            key={share.token}
                            className="flex flex-wrap items-center gap-2 rounded-xl bg-white px-3 py-2 text-xs ring-1 ring-clay-200"
                          >
                            <code className="flex-1 min-w-0 truncate font-mono text-olive-700">
                              …/{share.token.slice(0, 12)}…
                            </code>
                            <span className="text-olive-500">
                              {isNaN(created.getTime())
                                ? ''
                                : created.toLocaleDateString(undefined, {
                                    day: 'numeric',
                                    month: 'short',
                                  })}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard?.writeText(url).catch(() => {});
                              }}
                              className="shrink-0 rounded-full bg-olive-50 px-2.5 py-1 text-olive-800 ring-1 ring-olive-200 hover:bg-olive-100"
                            >
                              Copy
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRevokeShare(share.token)}
                              className="shrink-0 rounded-full bg-white px-2.5 py-1 text-red-700 ring-1 ring-red-200 hover:bg-red-50"
                            >
                              Revoke
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ) : null}
              </div>
            ) : null}

            <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={goPrev}
                className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-olive-700 ring-1 ring-olive-200 transition hover:bg-olive-50"
              >
                ← Back
              </button>
              <div className="flex items-center gap-3">
                {error ? <span className="text-sm text-red-600">{error}</span> : null}
                {!error && savedAt && !isReadOnly ? (
                  <span className="text-sm text-olive-500">Saved</span>
                ) : null}
                {!isReadOnly ? (
                  <button
                    type="button"
                    onClick={onSaveFinal}
                    disabled={saving}
                    className="inline-flex items-center gap-2 rounded-full bg-clay-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-clay-500 disabled:opacity-60"
                  >
                    {saving ? 'Saving…' : 'Confirm itinerary'}
                  </button>
                ) : (
                  <span className="text-sm text-olive-500">
                    Read-only view — only the original recipient can confirm.
                  </span>
                )}
              </div>
            </div>
          </section>
        ) : null}
      </main>

      <SegmentModal
        segment={openSegment}
        onClose={() => setOpenSegment(null)}
        onToggle={(id) => toggleSegment(id, !!segmentById(id)?.required)}
        isSelected={openSegment ? selected.has(openSegment.id) || !!openSegment.required : false}
        isLocked={!!openSegment?.required}
        currency={data.cost.currency}
      />
    </div>
  );
}

const cardClass =
  'rounded-2xl border border-olive-200 bg-white p-5 sm:p-6';
const fieldInputClass =
  'w-full min-w-0 rounded-xl border border-olive-200 bg-white px-3 py-2.5 text-sm text-olive-950 placeholder:text-olive-400 focus:border-clay-400 focus:outline-none focus:ring-2 focus:ring-clay-400/40';

function QuestionCard({
  title,
  help,
  children,
  asFieldset,
}: {
  title: string;
  help?: string;
  children: React.ReactNode;
  asFieldset?: boolean;
}) {
  if (asFieldset) {
    return (
      <fieldset className={cardClass}>
        <legend className="px-2 text-sm font-medium text-olive-900">{title}</legend>
        {help ? <p className="mt-1.5 text-xs leading-5 text-olive-500">{help}</p> : null}
        <div className="mt-4">{children}</div>
      </fieldset>
    );
  }
  return (
    <div className={cardClass}>
      <p className="text-sm font-medium text-olive-900">{title}</p>
      {help ? <p className="mt-1.5 text-xs leading-5 text-olive-500">{help}</p> : null}
      <div className="mt-4">{children}</div>
    </div>
  );
}

type ChipOption = { value: string; label: string };
function ChipRow({
  options,
  value,
  onChange,
  multi,
}: {
  options: ChipOption[];
  value: string | string[] | undefined;
  onChange: (next: string | string[]) => void;
  multi?: boolean;
}) {
  const isActive = (v: string) => {
    if (multi) return Array.isArray(value) && value.includes(v);
    return value === v;
  };
  const handle = (v: string) => {
    if (multi) {
      const cur = Array.isArray(value) ? value : [];
      onChange(cur.includes(v) ? cur.filter((x) => x !== v) : [...cur, v]);
    } else {
      onChange(v);
    }
  };
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const active = isActive(opt.value);
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => handle(opt.value)}
            className={[
              'inline-flex max-w-full items-center gap-1.5 rounded-full px-3 py-1.5 text-sm leading-5 transition',
              active
                ? 'bg-olive-900 text-white'
                : 'bg-olive-50 text-olive-800 ring-1 ring-olive-200 hover:bg-olive-100',
            ].join(' ')}
          >
            {active ? (
              <svg
                viewBox="0 0 12 12"
                className="h-3 w-3 shrink-0"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M2.5 6.5l2.5 2.5L9.5 3.5" />
              </svg>
            ) : null}
            <span className="truncate">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function NavButtons({
  onBack,
  onNext,
  saving,
}: {
  onBack: () => void;
  onNext: () => void;
  saving: boolean;
}) {
  return (
    <div className="mt-12 flex flex-wrap items-center justify-between gap-3">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-olive-700 ring-1 ring-olive-200 transition hover:bg-olive-50"
      >
        ← Back
      </button>
      <button
        type="button"
        onClick={onNext}
        disabled={saving}
        className="inline-flex items-center gap-2 rounded-full bg-clay-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-clay-500 disabled:opacity-60"
      >
        {saving ? 'Saving…' : 'Continue'}
        <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2.5 6h7m0 0L6 2.5M9.5 6 6 9.5" />
        </svg>
      </button>
    </div>
  );
}
