# #455 — Product mockups & GIFs using the web layout (chunk plan)

**Source issue:** Jaal-Yantra-Textiles/v2 **#455** ("Add and create product mockups
and gifs using the web layout"). Work lives in THIS repo (`web-jyt`).

**Goal:** turn the static admin/partner flow mockups into looping animated GIFs
(or webm) that showcase the most important product flows, and surface them in the
web marketing layout. Scope confirmed by operator 2026-06-23: **GIFs from the
existing `*-mockup.html` files**, plus capture of the high-value flows we don't
yet have (esp. **creating a design with inventory**).

## Assets already in the repo
- `product-create-mockup.html`, `production-run-mockup.html`,
  `inventory-orders-mockup.html`, `whatsapp-mockup.html` — static HTML mockups
  (the GIF sources).
- `public/mockup-sources/*.png` — 14 curated REAL admin-UI screenshots from prior
  Playwright runs (dashboard, analytics, data-plumbing, GST returns, fees,
  shipping/courier, order detail, AI edit, design/run drawers). Use as reference
  imagery and as frames for "real UI" gifs.

## Chunks (one PR each, off `main`, PR-only)

1. **GIF pipeline** — `scripts/mockup-to-gif.mjs`: render a `*-mockup.html` in
   Playwright, drive its built-in step animation (or scripted scroll/click
   sequence), capture a frame sequence, encode to looping `.gif` + `.webm` via
   `ffmpeg`. Output to `public/mockups/<flow>.gif`. Add an npm script
   `mockup:gif`. Deterministic (fixed viewport, seeded delays). Document ffmpeg
   as a dev dependency.
2. **Per-flow GIF — product create** (`product-create-mockup.html` → `public/mockups/product-create.gif`).
3. **Per-flow GIF — production run** (`production-run-mockup.html`).
4. **Per-flow GIF — inventory orders** (`inventory-orders-mockup.html`).
5. **Per-flow GIF — whatsapp** (`whatsapp-mockup.html`).
6. **NEW mockup — design + inventory** (operator's priority): build
   `design-create-mockup.html` (create a design, attach inventory/raw materials,
   cost rollup) in the same brand/style as the existing mockups, grounded in the
   real screenshots under `public/mockup-sources/` (`496-detail`, `568-detail`,
   production-run drawers). Then gif it via chunk 1's pipeline.
7. **Surface in the web layout** — a "See it in action" / product-showcase
   section that lazy-loads the gifs (webm `<video>` with gif fallback, poster
   frame, `prefers-reduced-motion` respected). Wire into the relevant
   marketing/home section.

## Conventions (web-jyt)
- Next.js App Router, branch off `main`, PR-only (no auto-merge — operator review).
- Match existing brand (navy/orange, serif italic accent, hero-wash) — see the
  existing mockup HTMLs + `docs/design_system_extension_plan.md`.
- Respect `prefers-reduced-motion`; gifs/webm must not autoplay sound; keep
  payloads lean (webm primary, gif fallback, lazy-load below the fold).

## Sequencing
Build chunk 1 (pipeline) first — chunks 2–6 depend on it. Chunk 6 (design+inventory)
is the operator's headline flow; prioritize it right after the pipeline if a real
capture of that admin flow becomes available (capture from live admin
`v3.jaalyantra.com`, or compose from `public/mockup-sources/`).
