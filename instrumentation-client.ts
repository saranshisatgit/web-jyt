// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

// Configure Sentry only in production with sensible defaults via env
const tracesSampleRate = process.env.NODE_ENV === "production"
  ? parseFloat(process.env.NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE ?? "0.1")
  : 0;
const replaysSessionSampleRate = process.env.NODE_ENV === "production"
  ? parseFloat(process.env.NEXT_PUBLIC_SENTRY_REPLAYS_SESSION_SAMPLE_RATE ?? "0")
  : 0;
const replaysOnErrorSampleRate = process.env.NODE_ENV === "production"
  ? parseFloat(process.env.NEXT_PUBLIC_SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE ?? "0.5")
  : 0;
// Use a generic array for integrations; silencing explicit any lint
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const integrations: any[] = [];
if (replaysSessionSampleRate > 0) {
  integrations.push(Sentry.replayIntegration());
}

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN || "https://0f276401cba52626d2762efc1da815c7@o4509195964579840.ingest.de.sentry.io/4509195981881424",
  integrations,
  tracesSampleRate,
  replaysSessionSampleRate,
  replaysOnErrorSampleRate,
  debug: process.env.NODE_ENV !== "production",
});

// Removed onRouterTransitionStart to avoid flood of route transactions