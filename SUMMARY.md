## Goal
- Replace dummy page-content JSONs with real data shapes from the production API and create the missing solution pages in the backend

## Constraints & Preferences
- Data shapes must match the backend's Block schema: `name`, `type` (Hero|Header|Footer|MainContent|ContactForm|Feature|Gallery|Testimonial|Product|Section|Custom), `content` (Record), `settings`, `order`, `status`
- Pages follow `pageSchema`: `title`, `slug`, `content` (string), `page_type`, `status`, `meta_title`, `meta_description`, `published_at`, `metadata`, `public_metadata`
- Auth uses `Authorization: Basic <key>` with the raw key (no base64 encoding)
- Block creation API requires a `blocks` array wrapper: `{ "blocks": [...] }`

## Progress
### Done
- Explored backend validator schemas at `apps/backend/src/api/admin/websites/[id]/pages/validators.ts` and `blocks/validators.ts`
- Found public API route `GET /web/website/{domain}/{page}` returning pages with blocks; route at `apps/backend/src/api/web/website/[domain]/[page]/route.ts`
- Queried production `v3.jaalyantra.com` for existing pages — `compare` page exists with real Hero, Custom, Feature, Gallery, Testimonial blocks; `home` page for additional block type shapes
- Queried `solutions` and `wholesale` pages — both exist in production with full block sets
- Explored auth: admin routes accept `sk_` keys via `Authorization: Basic sk_…` (raw key)
- API route `app/api/page-content/[slug]/route.ts` updated to use `getPageContent()` helper
- All 5 solution pages updated to be async server components reading `x-locale` header and calling `getPageContent()`
- **Created `ecommerce` page** (`01KWET79G0FX5XQJ7F0WVKQNY2`) with 8 blocks: hero (Hero), shift/steps/benefits/starter/admin/integrations (Custom), cta (Section)
- **Created `sell-on-ai` page** (`01KWETDC2TC53DSD1X66Q01N93`) with 6 blocks: hero (Hero), shift/steps/benefits/clients (Custom), cta (Section)
- Verified `solutions` page already published with 5 blocks, `wholesale` page already published with 5 blocks, `compare` page already published with 6 blocks

### Blocked
- (none)

## Key Decisions
- Auth header format: `Authorization: Basic sk_…` — raw key, NOT `base64(username:password)` as HTTP Basic normally requires
- Block CRUD uses `POST /admin/websites/{id}/pages/{pageId}/blocks` with `{ "blocks": [...] }` wrapper
- Page content comes from local JSON fallback; backend pages now mirror the same data

## Created Pages Summary
| Slug | Page ID | Status | Blocks |
|------|---------|--------|--------|
| `solutions` | `01KVV30V4HEY2TT995A9PPHN3C` | Published | 5 (Hero, audienceCallout, flagshipMockup, blocks, cta) |
| `wholesale` | `01KVTZP5N9PJZHXC67X34ZSZ5R` | Published | 5 (Hero, shift, steps, benefits, cta) |
| `compare` | `01KVTZP52TSYQ8S7KJTRDS40W5` | Published | 6 (Hero, lifecycle, comparison, pricing, differentiators, cta) |
| `ecommerce` | `01KWET79G0FX5XQJ7F0WVKQNY2` | Draft | 8 (Hero, shift, steps, benefits, starter, admin, integrations, cta) |
| `sell-on-ai` | `01KWETDC2TC53DSD1X66Q01N93` | Draft | 6 (Hero, shift, steps, benefits, clients, cta) |

## Next Steps
1. Publish `ecommerce` and `sell-on-ai` pages via `POST /admin/websites/{id}/pages/{pageId}/publish`
2. Validate the public API returns correct data for all pages
3. Build, commit, push

## Relevant Files
- `apps/backend/src/api/web/website/[domain]/[page]/route.ts`: public API returning page+blocks
- `apps/backend/src/api/admin/websites/[id]/pages/validators.ts`: page create/update schemas
- `lib/page-content.ts`: shared `getPageContent(slug, locale)` helper
- `app/api/page-content/[slug]/route.ts`: locale-aware content API
- `data/page-content/{locale}/` — 5 JSONs per locale with page content shapes
- `app/solutions/`, `app/solutions/ecommerce/`, `app/solutions/wholesale/`, `app/solutions/sell-on-ai/`, `app/compare/` — async locale-aware components
