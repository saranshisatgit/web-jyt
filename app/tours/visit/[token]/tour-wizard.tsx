'use client';

import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { saveItinerary, type TourSegment, type TourVisitPayload } from './actions';
import { SegmentModal } from './segment-modal';

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

const formatDate = (iso: string | null): string => {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleString(undefined, {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
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
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [saving, startSaving] = useTransition();
  const [openSegment, setOpenSegment] = useState<TourSegment | null>(null);

  const currentStepId: StepId = useMemo(() => {
    const raw = searchParams?.get('step');
    if (raw && STEPS.some((s) => s.id === raw)) return raw as StepId;
    return 'welcome';
  }, [searchParams]);

  const currentIndex = STEPS.findIndex((s) => s.id === currentStepId);

  const segments = data.form.itinerary_segments || [];
  const guides = data.form.settings?.guides || [];
  const story = data.form.settings?.story || null;
  const fields = (data.form.fields || []).slice().sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  const persistSelectionRef = useRef<{ selected: Set<string>; answers: Record<string, unknown> }>({
    selected,
    answers,
  });
  persistSelectionRef.current = { selected, answers };

  const persist = useCallback(
    async (
      override?: { selected?: Set<string>; answers?: Record<string, unknown> }
    ): Promise<boolean> => {
      const sel = override?.selected ?? persistSelectionRef.current.selected;
      const ans = override?.answers ?? persistSelectionRef.current.answers;
      const result = await saveItinerary(token, {
        selected_segments: Array.from(sel),
        answers: ans,
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
      if (!opts?.skipSave) {
        startSaving(async () => {
          await persist();
        });
      }
    },
    [router, searchParams, persist]
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
    if (locked) return;
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
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
    startSaving(async () => {
      const ok = await persist();
      if (ok) setSavedAt(Date.now());
    });
  };

  const setAnswer = (name: string, value: unknown) => {
    setAnswers((prev) => ({ ...prev, [name]: value }));
  };

  const toggleInterest = (value: string) => {
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
              {saving ? (
                <span className="inline-flex items-center gap-1.5 text-olive-600">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-olive-500" />
                  Saving…
                </span>
              ) : savedAt ? (
                <span className="inline-flex items-center gap-1.5 text-olive-700">
                  <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M2 6.5l2.5 2.5L10 3.5" />
                  </svg>
                  Saved
                </span>
              ) : null}
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
                {guides.map((g) => (
                  <article
                    key={g.id || g.name}
                    className="flex flex-col overflow-hidden rounded-2xl border border-olive-200 bg-white shadow-sm"
                  >
                    {g.photo_url ? (
                      <div className="relative aspect-[4/5] w-full bg-olive-100">
                        <Image
                          src={g.photo_url}
                          alt={g.name}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="aspect-[4/5] w-full bg-gradient-to-br from-clay-100 via-olive-100 to-clay-200" />
                    )}
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
                      {(Array.isArray(g.languages) && g.languages.length > 0) || g.instagram ? (
                        <div className="mt-auto flex flex-wrap gap-2 pt-2 text-xs text-olive-500">
                          {Array.isArray(g.languages) && g.languages.length > 0 ? (
                            <span className="rounded-full bg-olive-50 px-2.5 py-1">
                              {g.languages.join(' · ')}
                            </span>
                          ) : null}
                          {g.instagram ? (
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
                ))}
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
                title="Anything we should know about access, dietary needs, or pace?"
                help="Mobility, allergies, birthdays, anything at all — this goes only to the guide."
              >
                <textarea
                  rows={3}
                  className={fieldInputClass}
                  placeholder="A few words is plenty…"
                  value={(answers.notes_for_guide as string | undefined) ?? ''}
                  onChange={(e) => setAnswer('notes_for_guide', e.target.value)}
                />
              </QuestionCard>

              <QuestionCard
                title="Preferred language for the day"
                help="We will match you with a guide who speaks this comfortably."
              >
                <input
                  type="text"
                  placeholder={traveller?.language || 'English'}
                  className={fieldInputClass}
                  value={(answers.preferred_language as string | undefined) ?? ''}
                  onChange={(e) => setAnswer('preferred_language', e.target.value)}
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

        {currentStepId === 'review' ? (
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
                {!error && savedAt ? (
                  <span className="text-sm text-olive-500">Saved</span>
                ) : null}
                <button
                  type="button"
                  onClick={onSaveFinal}
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-full bg-clay-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-clay-500 disabled:opacity-60"
                >
                  {saving ? 'Saving…' : 'Confirm itinerary'}
                </button>
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
