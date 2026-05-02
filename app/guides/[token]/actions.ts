'use server';

export type GuideTraveller = {
  first_name?: string | null;
  surname?: string | null;
  email?: string | null;
  phone?: string | null;
  city?: string | null;
  country?: string | null;
  language?: string | null;
};

export type GuideVisit = {
  response_id: string;
  booking_ref: string | null;
  tour_form: { id: string; title: string; handle: string };
  tour_date: string | null;
  status: string;
  traveller: GuideTraveller | null;
  headcount: Record<string, number>;
  selected_segments: Array<{ id: string; title: string; required: boolean }>;
  answers: Record<string, unknown>;
  payment: {
    paid_via_source: { provider: string; amount: number; currency: string } | null;
    add_ons_due: number;
    add_ons_currency: string;
  } | null;
};

export type GuideDashboardPayload = {
  guide: {
    id: string | null;
    name: string | null;
    role: string | null;
    photo_url: string | null;
  };
  visits: GuideVisit[];
  upcoming_count: number;
};

const apiBase = (): string =>
  (process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') ||
    'http://localhost:9000/web') ?? 'http://localhost:9000/web';

export async function loadGuideDashboard(
  token: string
): Promise<
  | { ok: true; data: GuideDashboardPayload }
  | { ok: false; status: number; message: string }
> {
  if (!token) {
    return { ok: false, status: 400, message: 'Missing guide token' };
  }
  try {
    const res = await fetch(
      `${apiBase()}/guide-visits/${encodeURIComponent(token)}`,
      { cache: 'no-store' }
    );
    if (!res.ok) {
      const body = await res.json().catch(() => null);
      return {
        ok: false,
        status: res.status,
        message: body?.message || body?.error || 'Could not load your dashboard',
      };
    }
    const data = (await res.json()) as GuideDashboardPayload;
    return { ok: true, data };
  } catch (err) {
    console.error('loadGuideDashboard failed', err);
    return { ok: false, status: 500, message: 'Could not reach the booking service' };
  }
}
