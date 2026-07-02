# i18n Guide: Adding Locale Support to Pages

## Overview

There are **two translation systems** in this codebase:

| System | Used by | How it works |
|--------|---------|-------------|
| **CMS `_i18n` fields** | company, about-us, partner, contact | Translations stored inline on each CMS block's `content` as `{field}_i18n` |
| **Local JSON files** | solutions, compare, ecommerce, wholesale, sell-on-ai | Full content copy per locale at `data/page-content/{locale}/{slug}.json` |

The language selector sets a `NEXT_LOCALE` cookie → middleware reads it → sets the `x-locale` request header → server components read it.

## Supported Locales

Defined in `lib/i18n/config.ts`:

| Code | Label |
|------|-------|
| `en-IN` | India (default) |
| `en-US` | US |
| `en-AU` | Australia |
| `it-IT` | Italy |
| `lv-LV` | Latvia |

English locales (`en-IN`, `en-US`, `en-AU`) share the same content. Only `it-IT` and `lv-LV` need explicit translations.

---

## Option A: CMS Pages (company, about-us, partner, contact)

Use this when the page fetches blocks from the CMS via `fetchPagefromAPI(slug)`.

### Step 1: Add `_i18n` fields to CMS blocks

For each translatable string in a block's `content`, add a `{field}_i18n` sibling:

```json
{
  "title": "Company & Compliance",
  "title_i18n": {
    "it-IT": "Azienda e Conformità",
    "lv-LV": "Uzņēmums un atbilstība"
  },
  "subtitle": "Regulatory details...",
  "subtitle_i18n": {
    "it-IT": "Dettagli normativi...",
    "lv-LV": "Regulatīvi dati..."
  }
}
```

**For nested/array structures** (e.g. fields with `label`/`value`), use lookup tables:

```json
{
  "fields_i18n": {
    "it-IT": {
      "gst": { "label": "Partita IVA (GSTIN)" },
      "cin": { "label": "CIN" }
    }
  }
}
```

Patch via the admin API:
```bash
curl -X PUT \
  -H "Authorization: Basic sk_..." \
  -H "Content-Type: application/json" \
  -d '{"content": { ...content with _i18n fields... }}' \
  "https://v3.jaalyantra.com/admin/websites/{WEBSITE_ID}/pages/{PAGE_ID}/blocks/{BLOCK_ID}"
```

Or use the dry-run script: `node scripts/i18n-dry-run.mjs`

### Step 2: Read locale in the server component

```tsx
import { headers } from 'next/headers'
import { DEFAULT_LOCALE } from '@/lib/i18n/config'
import { resolveBlock } from '@/lib/i18n/blocks'

export default async function MyPage() {
  const h = await headers()
  const locale = h.get('x-locale') || DEFAULT_LOCALE

  const page = await fetchPagefromAPI('my-slug')

  // Resolve _i18n fields — components receive already-translated content
  const headerBlock = resolveBlock(getBlockByName(page?.blocks ?? [], 'Header'), locale)
  const featureBlock = resolveBlock(getBlockByName(page?.blocks ?? [], 'Feature'), locale)

  return (
    <main>
      <Navbar />
      <MyHero data={headerBlock} />
      <MyFeature data={featureBlock} />
    </main>
  )
}
```

### Step 3: Components stay unchanged

The `resolveBlock()` function strips `_i18n` keys and merges translated values into the base fields. Components receive clean content and don't need any i18n logic.

### What `resolveBlock` does

- **String fields**: `title_i18n[locale]` replaces `title`
- **Object fields**: deep-merges `mission_i18n[locale]` into `mission`
- **Array fields**: merges by index (`stats_i18n[locale][0]` into `stats[0]`)
- **Strips all `_i18n` keys** from the output

### Special case: CompanyData block

The company page has a custom resolver (`resolveCompanyRegions`) because its i18n uses lookup tables (`regions_i18n`, `sections_i18n`, `fields_i18n`) keyed by field `key` rather than direct field overrides. See `app/company/page.tsx` for the pattern.

---

## Option B: Local JSON Pages (solutions, compare, etc.)

Use this when content is stored as local JSON files.

### Step 1: Create locale directories

```
data/page-content/
  en-IN/solutions.json    ← default
  it-IT/solutions.json    ← Italian translation
  lv-LV/solutions.json    ← Latvian translation
```

Each file is a **full copy** of the content with translated values. Same structure, different language.

### Step 2: Read locale and load content

```tsx
import { headers } from 'next/headers'
import { getPageContent } from '@/lib/page-content'
import { DEFAULT_LOCALE } from '@/lib/i18n/config'

export default async function SolutionsPage() {
  const h = await headers()
  const locale = h.get('x-locale') || DEFAULT_LOCALE
  const content = await getPageContent('solutions', locale)
  // content is already the right locale
}
```

`getPageContent()` automatically falls back to `DEFAULT_LOCALE` if the locale file doesn't exist.

### Step 3: Register the slug

Add the slug to `CONTENT_SLUGS` in `lib/page-content.ts`:

```ts
export const CONTENT_SLUGS = ["solutions", "ecommerce", "wholesale", "sell-on-ai", "compare", "my-new-page"] as const
```

---

## Option C: Hardcoded pages (home, blog)

Pages with inline data (not from CMS or JSON files) use the i18n message system.

### Step 1: Add translation keys to message files

```
messages/
  en-IN.json    ← { "nav.solutions": "Solutions", ... }
  it-IT.json    ← { "nav.solutions": "Soluzioni", ... }
  lv-LV.json    ← { "nav.solutions": "Risinājumi", ... }
```

### Step 2: Use the `useT()` hook in client components

```tsx
import { useT } from '@/lib/i18n/use-t'

function MyComponent() {
  const t = useT()
  return <h1>{t('nav.solutions')}</h1>
}
```

---

## How the locale selector works

1. User picks a locale in the UI → sets `NEXT_LOCALE` cookie
2. `middleware.ts` reads the cookie → sets `x-locale` header on the request
3. Server components read `x-locale` via `headers()`
4. Client components get locale via `LocaleProvider` context

## Quick reference: Files

| File | Purpose |
|------|---------|
| `lib/i18n/config.ts` | Locale list, default locale, cookie name |
| `lib/i18n/blocks.ts` | `resolveBlock()`, `t()`, `tLookup()` for CMS blocks |
| `lib/i18n/translations.ts` | Loads message JSON files for client-side i18n |
| `lib/i18n/use-t.ts` | `useT()` hook for client components |
| `lib/page-content.ts` | `getPageContent(slug, locale)` for local JSON pages |
| `middleware.ts` | Sets `x-locale` header from cookie |
| `scripts/i18n-dry-run.mjs` | Dry-run script for patching CMS blocks with translations |

## Checklist for a new page

1. [ ] Decide: CMS blocks, local JSON, or hardcoded?
2. [ ] If CMS: add `_i18n` fields to blocks via admin API
3. [ ] If local JSON: create `data/page-content/{locale}/{slug}.json` files
4. [ ] Read `x-locale` header in the server component
5. [ ] Call `resolveBlock()` (CMS) or `getPageContent()` (JSON) with the locale
6. [ ] Test with `curl -b "NEXT_LOCALE=it-IT" https://www.jaalyantra.com/{slug}`
7. [ ] Verify English still works (no `_i18n` = falls back to base value)
