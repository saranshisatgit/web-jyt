'use server';

import { countryToCurrency, getFxRate } from './currency';

export type TourSegmentLink = {
  label?: string;
  url: string;
};

export type TourSegmentLocation = {
  /** Human-readable address line shown to the customer. */
  address?: string;
  /** Optional precise coordinates so we can build map-app deep links. */
  lat?: number;
  lng?: number;
};

export type TourSegment = {
  id: string;
  title?: string;
  description?: string | null;
  image_url?: string | null;
  duration_minutes?: number | null;
  time_slot?: string | null;
  base_price?: number;
  currency?: string;
  required?: boolean;
  optional?: boolean;
  depends_on?: string[];
  links?: TourSegmentLink[];
  gallery?: string[];
  location?: TourSegmentLocation;
};

export type TourGuide = {
  id?: string;
  name: string;
  role?: string | null;
  bio?: string | null;
  photo_url?: string | null;
  languages?: string[] | null;
  instagram?: string | null;
  /**
   * "available" — real guide, can be booked.
   * "na" — placeholder profile, not yet onboarded; we tag these so the
   *        customer knows the day will be hosted by someone else.
   */
  availability?: 'available' | 'na' | null;
};

export type TourStory = {
  headline?: string | null;
  body?: string | null;
};

/**
 * Practical day-of guidance — dress code, what we provide, what to bring,
 * meeting point notes. Operators configure each line via Form.settings.
 * Empty/missing entries are skipped on the UI.
 */
export type TourPracticalGuidance = {
  what_to_wear?: string | null;
  what_we_provide?: string | null;
  what_to_bring?: string | null;
  meeting_point?: string | null;
};

/**
 * High-trust signals lifted from the source listing (e.g. GYG): duration,
 * cancellation window, wheelchair access. Surfaced as chips on the
 * welcome step so the customer sees them upfront.
 */
export type TourTrustSignals = {
  duration?: string | null;
  group_cap?: number | null;
  languages?: string[] | null;
  wheelchair_accessible?: boolean;
  free_cancellation_hours?: number | null;
  pay_later?: boolean;
};

export type TourFormField = {
  id: string;
  name: string;
  label: string;
  type: string;
  required?: boolean;
  placeholder?: string | null;
  help_text?: string | null;
  options?: Record<string, unknown> | null;
  order?: number;
};

export type TourVisitPayload = {
  form: {
    id: string;
    handle: string;
    title: string;
    description: string | null;
    submit_label: string | null;
    success_message: string | null;
    settings: {
      story?: TourStory | null;
      guides?: TourGuide[];
      practical_guidance?: TourPracticalGuidance | null;
      excluded?: string[] | null;
      highlights?: string[] | null;
      trust_signals?: TourTrustSignals | null;
      [key: string]: unknown;
    } | null;
    fields: TourFormField[];
    itinerary_segments: TourSegment[];
  };
  response: {
    id: string;
    status: string;
    submitted_at: string;
    updated_at: string;
    answers: Record<string, unknown>;
    selected_segments: string[];
  };
  traveller: {
    first_name?: string | null;
    surname?: string | null;
    email?: string | null;
    phone?: string | null;
    city?: string | null;
    country?: string | null;
    language?: string | null;
  } | null;
  headcount: Record<string, number>;
  source: string | null;
  booking: {
    booking_ref: string | null;
    product: string | null;
    option: string | null;
    tour_date: string | null;
    original_price: string | null;
  };
  cost: {
    currency: string;
    total_pax: number;
    subtotal: number;
    by_segment: Array<{
      id: string;
      title?: string;
      base_price: number;
      pax: number;
      line_total: number;
    }>;
  };
  payment: {
    paid_via_source: {
      provider: string;
      amount: number;
      currency: string;
      raw: string | null;
    } | null;
    add_ons_due: number;
    add_ons_currency: string;
    total: number | null;
    total_currency: string | null;
    local_view?: {
      currency: string;
      paid_via_source: number | null;
      add_ons_due: number;
      total: number;
    } | null;
  };
  /**
   * Indicates whether the current token grants edit access.
   * `owner` — original visit token, full read/write.
   * `share` — sibling token, read-only.
   */
  access_mode?: 'owner' | 'share';
  /**
   * Active read-only share tokens minted by the owner. Owner sees the
   * full list (so the wizard can render Revoke buttons); share-mode
   * viewers always see an empty list.
   */
  shares: Array<{
    token: string;
    mode: string;
    created_at: string;
  }>;
};

const apiBase = (): string =>
  (process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') ||
    'http://localhost:9000/web') ?? 'http://localhost:9000/web';

/**
 * Augment a TourVisitPayload with a single local-currency view based on
 * the traveller's country. We convert each leg independently (the GYG
 * payment may be in INR, the add-ons in EUR) and present a clean total
 * in the traveller's home currency — that's what they actually want to see.
 */
async function withLocalCurrency(data: TourVisitPayload): Promise<TourVisitPayload> {
  const country = data.traveller?.country;
  const localCurrency = countryToCurrency(country);
  if (!localCurrency) return data;

  const paid = data.payment.paid_via_source;
  const addOnsCurrency = data.payment.add_ons_currency;

  // Pull rates for each source currency in parallel (cached 24h).
  const [paidRate, addOnsRate] = await Promise.all([
    paid ? getFxRate(paid.currency, localCurrency) : Promise.resolve(null),
    addOnsCurrency
      ? getFxRate(addOnsCurrency, localCurrency)
      : Promise.resolve(null),
  ]);

  const round = (n: number) => Math.round(n);
  const paidLocal =
    paid && paidRate != null ? round(paid.amount * paidRate) : null;
  const addOnsLocal =
    addOnsRate != null ? round(data.payment.add_ons_due * addOnsRate) : null;

  // Need at least one converted leg to bother showing a local view.
  if (paidLocal == null && addOnsLocal == null) return data;

  const total = (paidLocal ?? 0) + (addOnsLocal ?? 0);

  return {
    ...data,
    payment: {
      ...data.payment,
      local_view: {
        currency: localCurrency,
        paid_via_source: paidLocal,
        add_ons_due: addOnsLocal ?? 0,
        total,
      },
    },
  };
}

export async function loadTourVisit(
  token: string
): Promise<{ ok: true; data: TourVisitPayload } | { ok: false; status: number; message: string }> {
  if (!token) {
    return { ok: false, status: 400, message: 'Missing visit token' };
  }
  try {
    const res = await fetch(`${apiBase()}/tour-visits/${encodeURIComponent(token)}`, {
      cache: 'no-store',
    });
    if (!res.ok) {
      const body = await res.json().catch(() => null);
      return {
        ok: false,
        status: res.status,
        message: body?.message || body?.error || 'Could not load your visit',
      };
    }
    const data = (await res.json()) as TourVisitPayload;
    const enriched = await withLocalCurrency(data);
    return { ok: true, data: enriched };
  } catch (err) {
    console.error('loadTourVisit failed', err);
    return { ok: false, status: 500, message: 'Could not reach the booking service' };
  }
}

export async function revokeShareLink(
  token: string,
  shareToken: string
): Promise<
  | { ok: true; data: { shares: Array<{ token: string; mode: string; created_at: string }> } }
  | { ok: false; status: number; message: string }
> {
  try {
    const res = await fetch(
      `${apiBase()}/tour-visits/${encodeURIComponent(token)}/share/${encodeURIComponent(shareToken)}`,
      {
        method: 'DELETE',
        cache: 'no-store',
      }
    );
    if (!res.ok) {
      const body = await res.json().catch(() => null);
      return {
        ok: false,
        status: res.status,
        message: body?.message || body?.error || 'Could not revoke share link',
      };
    }
    const body = (await res.json()) as {
      shares: Array<{ token: string; mode: string; created_at: string }>;
    };
    return { ok: true, data: { shares: body.shares } };
  } catch (err) {
    console.error('revokeShareLink failed', err);
    return { ok: false, status: 500, message: 'Could not reach the booking service' };
  }
}

export async function createShareLink(
  token: string
): Promise<
  | { ok: true; data: { share_token: string; visit_path: string } }
  | { ok: false; status: number; message: string }
> {
  try {
    const res = await fetch(
      `${apiBase()}/tour-visits/${encodeURIComponent(token)}/share`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
        body: JSON.stringify({}),
      }
    );
    if (!res.ok) {
      const body = await res.json().catch(() => null);
      return {
        ok: false,
        status: res.status,
        message: body?.message || body?.error || 'Could not create share link',
      };
    }
    const body = (await res.json()) as {
      share: { token: string };
      visit_path: string;
    };
    return {
      ok: true,
      data: { share_token: body.share.token, visit_path: body.visit_path },
    };
  } catch (err) {
    console.error('createShareLink failed', err);
    return { ok: false, status: 500, message: 'Could not reach the booking service' };
  }
}

export async function saveItinerary(
  token: string,
  payload: {
    selected_segments: string[];
    answers: Record<string, unknown>;
    confirm?: boolean;
  }
): Promise<{ ok: true; data: TourVisitPayload } | { ok: false; status: number; message: string }> {
  try {
    const res = await fetch(`${apiBase()}/tour-visits/${encodeURIComponent(token)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => null);
      return {
        ok: false,
        status: res.status,
        message: body?.message || body?.error || 'Could not save your itinerary',
      };
    }
    const data = (await res.json()) as TourVisitPayload;
    const enriched = await withLocalCurrency(data);
    return { ok: true, data: enriched };
  } catch (err) {
    console.error('saveItinerary failed', err);
    return { ok: false, status: 500, message: 'Could not save right now. Please try again.' };
  }
}
