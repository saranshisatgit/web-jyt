#!/usr/bin/env node
/**
 * push-home-blocks.mjs — write data/home-blocks.json to the website CMS.
 *
 * The home page renders every section from data/home-blocks.json. This
 * script pushes those same blocks to the backend CMS so the two copies
 * never drift:
 *
 *   1. GET  /admin/websites                      -> find the website by domain
 *   2. GET  /admin/websites/:wid/pages           -> find the Home page
 *   3. GET  /admin/websites/:wid/pages/:pid/blocks
 *   4. For each block in home-blocks.json:
 *        - an existing block of the same type  -> PUT  .../blocks/:bid  (update)
 *        - otherwise                           -> POST .../blocks      (create, { blocks: [...] })
 *      Blocks whose type is NOT owned by the file (Footer, Header, Feature…)
 *      are left untouched.
 *
 * Auth: Medusa secret API keys go via HTTP Basic (the backend rejects
 * Bearer for sk_ keys): `Authorization: Basic base64(key)`.
 *
 * Usage:
 *   node scripts/push-home-blocks.mjs             # push to the CMS
 *   node scripts/push-home-blocks.mjs --dry-run    # print the plan, write nothing
 *   node scripts/push-home-blocks.mjs --fetch      # print what the CMS serves now
 *
 * Env (falls back to .env / .env.local values):
 *   API_URL | NEXT_PUBLIC_API_URL   backend base URL (a trailing /web is fine)
 *   ADMIN_API_TOKEN                 secret API key (sk_...)
 *   BRAND_DOMAIN                    website domain (default: jaalyantra.com)
 *   PAGE_SLUG                       CMS page slug  (default: home)
 */

import { readFileSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const DRY = process.argv.includes('--dry-run')
const FETCH = process.argv.includes('--fetch')

// ---- tiny .env loader (no dependency) ----------------------------------------
function loadEnv() {
  for (const f of ['.env.local', '.env']) {
    const p = resolve(ROOT, f)
    if (!existsSync(p)) continue
    for (const line of readFileSync(p, 'utf8').split('\n')) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
      if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '')
    }
  }
}
loadEnv()

// Admin lives at the root; the public site under /web. Accept either base.
const RAW = (process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || '').replace(/\/$/, '')
const BASE = RAW.replace(/\/web$/, '')
const DOMAIN = process.env.BRAND_DOMAIN || 'jaalyantra.com'
const PAGE_SLUG = process.env.PAGE_SLUG || 'home'

function authHeaders() {
  const token = process.env.ADMIN_API_TOKEN
  if (!token) throw new Error('ADMIN_API_TOKEN is not set — nothing to authenticate with.')
  const mode = (process.env.CMS_AUTH_MODE || 'basic').toLowerCase()
  if (mode === 'bearer') return { authorization: `Bearer ${token}` }
  return { authorization: `Basic ${Buffer.from(token).toString('base64')}` } // Medusa secret keys: HTTP Basic
}
const AUTH = authHeaders()

async function api(path, opts = {}) {
  const res = await fetch(`${BASE}${path}`, { ...opts, headers: { 'content-type': 'application/json', ...AUTH, ...(opts.headers || {}) } })
  if (!res.ok) throw new Error(`${opts.method || 'GET'} ${path} -> ${res.status} ${(await res.text()).slice(0, 300)}`)
  return res.status === 204 ? null : res.json()
}

// ---- map home-blocks.json -> CMS blocks --------------------------------------
// The CMS only accepts registered block types (Hero, Testimonial, Feature…).
// Custom sections ride the generic "Feature" type, distinguished by name —
// the same pattern the page already uses ("BentoSection", "DarkBentoSection").
const FEATURE = 'Feature'

const home = JSON.parse(readFileSync(resolve(ROOT, 'data/home-blocks.json'), 'utf8'))

const OURS = [
  { type: 'Hero', name: 'Hero Section', cmsType: 'Hero', content: home.hero },
  { type: 'Trace', name: 'Trace Section', cmsType: FEATURE, content: home.trace },
  { type: 'HowItWorks', name: 'HowItWorks Section', cmsType: FEATURE, content: home.how },
  { type: 'Bento', name: 'Bento Section', cmsType: FEATURE, content: home.bento },
  // 'Testimonial' matches the type the existing reader expects
  // (app/api/home-testimonials/route.ts) so the CMS copy serves too.
  {
    type: 'Testimonial',
    name: 'Testimonials Section',
    cmsType: 'Testimonial',
    content: {
      title: home.brands.title,
      testimonials: home.brands.testimonials.map((t) => ({
        name: t.brand,
        quote: t.quote,
        subtitle: t.role,
      })),
    },
  },
  { type: 'Pricing', name: 'Pricing Section', cmsType: FEATURE, content: home.pricing },
  { type: 'Capture', name: 'Capture Section', cmsType: FEATURE, content: home.capture },
  { type: 'Faq', name: 'Faq Section', cmsType: FEATURE, content: home.faq },
  { type: 'Plate', name: 'Plate Section', cmsType: FEATURE, content: home.plate },
  { type: 'Journey', name: 'Journey Section', cmsType: FEATURE, content: { steps: home.journey } },
  { type: 'MegaMenu', name: 'MegaMenu Section', cmsType: FEATURE, content: { items: home.megaMenu } },
  { type: 'AboutMenu', name: 'AboutMenu Section', cmsType: FEATURE, content: { items: home.aboutMenu } },
  { type: 'Pixelation', name: 'Pixelation Section', cmsType: FEATURE, content: home.pixelation },
]

// The types we own on the page: registered ones by type, Feature ones by name.
const isOurs = (b) => b.type === 'Hero' || b.type === 'Testimonial' || (b.type === FEATURE && OURS.some((o) => o.name === b.name))

async function main() {
  // 1. website by domain
  const { websites } = await api(`/admin/websites`)
  const site = websites.find((w) => w.domain === DOMAIN)
  if (!site) throw new Error(`no website with domain "${DOMAIN}" (have: ${websites.map((w) => w.domain).join(', ')})`)

  // 2. home page
  const { pages } = await api(`/admin/websites/${site.id}/pages`)
  const page =
    pages.find((p) => p.slug === PAGE_SLUG && p.page_type === 'Home') ||
    pages.find((p) => p.page_type === 'Home')
  if (!page) throw new Error(`no Home page (slug "${PAGE_SLUG}") on ${DOMAIN}`)

  // 3. current blocks — via the PUBLIC page read: the admin list route caps
  //    at 10 rows with no working offset param, while the public route
  //    returns the full set with the same id/name/type shape.
  const publicPage = await api(`/web/website/${encodeURIComponent(DOMAIN)}/${PAGE_SLUG}`)
  const remote = publicPage.blocks || []

  const blocksPath = `/admin/websites/${site.id}/pages/${page.id}/blocks`

  if (FETCH) {
    console.log(JSON.stringify({ website: site.domain, page: { id: page.id, slug: page.slug }, blocks: remote }, null, 2))
    return
  }

  console.log(`fetched ${remote.length} remote block(s)`)

  // 4. plan — registered types match by type, Feature sections match by
  //    name (so re-pushes update in place). Everything else is untouched.
  const claimed = new Set()
  const updates = [] // { block, existing }
  const creates = []
  for (const block of OURS) {
    const existing = remote.find(
      (b) => !claimed.has(b.id) && (block.cmsType === FEATURE ? b.type === FEATURE && b.name === block.name : b.type === block.cmsType),
    )
    if (existing) {
      claimed.add(existing.id)
      updates.push({ block, existing })
    } else {
      creates.push(block)
    }
  }
  const untouched = remote.filter((b) => !claimed.has(b.id) && !isOurs(b))

  console.log(`${DOMAIN} · page "${page.slug}" (${page.id})`)
  console.log(`— update: ${updates.map((u) => u.block.type).join(', ') || 'none'}`)
  console.log(`— create: ${creates.map((c) => c.type).join(', ') || 'none'}`)
  console.log(`— untouched: ${untouched.map((b) => b.type).join(', ') || 'none'}`)

  if (DRY) {
    console.log('\nDry run — no writes. Update payloads:')
    for (const { block } of updates) console.log(`  PUT  ${blocksPath}/<id>  type=${block.type}`)
    for (const { block, existing } of updates) console.log(JSON.stringify({ id: existing.id, name: block.name, type: block.type, content: block.content }))
    if (creates.length) console.log(`  POST ${blocksPath}  { blocks: [${creates.map((c) => c.type).join(', ')}] }`)
    return
  }

  // 5. execute
  for (const { block, existing } of updates) {
    await api(`${blocksPath}/${existing.id}`, {
      method: 'PUT',
      body: JSON.stringify({ name: block.name, type: block.cmsType, content: block.content }),
    })
    console.log(`✓ updated ${block.type} (${existing.id})`)
  }
  if (creates.length) {
    await api(blocksPath, {
      method: 'POST',
      body: JSON.stringify({
        blocks: creates.map((b) => ({ name: b.name, type: b.cmsType, content: b.content, status: 'Active' })),
      }),
    })
    console.log(`✓ created ${creates.length} block(s): ${creates.map((c) => c.type).join(', ')}`)
  }
}

main().catch((e) => {
  console.error(`✗ ${e.message}`)
  process.exit(1)
})
