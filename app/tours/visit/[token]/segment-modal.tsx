'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import type { TourSegment } from './actions';

type Props = {
  segment: TourSegment | null;
  onClose: () => void;
  onToggle: (id: string) => void;
  isSelected: boolean;
  isLocked: boolean;
  currency: string;
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

export function SegmentModal({ segment, onClose, onToggle, isSelected, isLocked, currency }: Props) {
  useEffect(() => {
    if (!segment) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [segment, onClose]);

  if (!segment) return null;

  const gallery = (segment.gallery ?? []).filter(Boolean);
  const links = (segment.links ?? []).filter((l) => l.url);
  const segCurrency = segment.currency || currency;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="segment-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-olive-950/40 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {segment.image_url ? (
          <div className="relative aspect-[16/9] w-full bg-olive-100">
            <Image
              src={segment.image_url}
              alt={segment.title || segment.id}
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
            />
          </div>
        ) : (
          <div className="aspect-[16/9] w-full bg-gradient-to-br from-olive-100 via-clay-100 to-olive-200" />
        )}

        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-olive-800 shadow-md ring-1 ring-olive-200 transition hover:bg-white"
        >
          <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M3 3l10 10M13 3L3 13" />
          </svg>
        </button>

        <div className="flex-1 overflow-y-auto px-6 py-6 sm:px-8 sm:py-8">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <h2 id="segment-modal-title" className="font-display text-2xl font-medium text-olive-950 sm:text-3xl">
              {segment.title || segment.id}
            </h2>
            {typeof segment.base_price === 'number' && segment.base_price > 0 ? (
              <span className="inline-flex items-baseline gap-1 rounded-full bg-clay-50 px-3 py-1 text-sm text-clay-800 ring-1 ring-clay-200">
                <span className="font-mono">{formatMoney(segment.base_price, segCurrency)}</span>
                <span className="text-xs text-clay-600">/ pax</span>
              </span>
            ) : null}
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-olive-500">
            {segment.duration_minutes ? <span>{formatDuration(segment.duration_minutes)}</span> : null}
            {segment.time_slot ? <span>{segment.time_slot}</span> : null}
            {isLocked ? (
              <span className="rounded bg-olive-100 px-2 py-0.5 text-olive-700">Always included</span>
            ) : null}
          </div>

          {segment.description ? (
            <p className="mt-5 whitespace-pre-line text-base leading-relaxed text-olive-800">
              {segment.description}
            </p>
          ) : null}

          {gallery.length > 0 ? (
            <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {gallery.map((src, i) => (
                <div key={i} className="relative aspect-square overflow-hidden rounded-xl bg-olive-100">
                  <Image
                    src={src}
                    alt={`${segment.title || 'Segment'} photo ${i + 1}`}
                    fill
                    sizes="(max-width: 640px) 50vw, 33vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          ) : null}

          {links.length > 0 ? (
            <div className="mt-6">
              <h3 className="font-display text-sm font-medium text-olive-900">Related</h3>
              <ul className="mt-2 flex flex-col gap-2">
                {links.map((l, i) => (
                  <li key={i}>
                    <a
                      href={l.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-clay-700 underline-offset-2 hover:underline"
                    >
                      {l.label || l.url}
                      <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 9l6-6M5 3h4v4" />
                      </svg>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-olive-200 bg-olive-50/50 px-6 py-4 sm:px-8">
          <button
            type="button"
            onClick={onClose}
            className="text-sm text-olive-700 hover:text-olive-900"
          >
            Close
          </button>
          <button
            type="button"
            onClick={() => {
              if (!isLocked) onToggle(segment.id);
              onClose();
            }}
            disabled={isLocked}
            className={[
              'inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition',
              isLocked
                ? 'cursor-default bg-olive-100 text-olive-500'
                : isSelected
                  ? 'bg-olive-900 text-white hover:bg-olive-700'
                  : 'bg-clay-600 text-white hover:bg-clay-500',
            ].join(' ')}
          >
            {isLocked ? 'Always included' : isSelected ? 'Remove from itinerary' : 'Add to itinerary'}
          </button>
        </div>
      </div>
    </div>
  );
}
