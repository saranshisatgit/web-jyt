#!/usr/bin/env node
/**
 * One-shot Playwright script that captures a screenshot of every live
 * partner storefront, writes them to `public/storefront-previews/`, and
 * emits a JSON manifest the homepage reads from at build time.
 *
 * Why a script and not a runtime fetch:
 *   - Storefronts change rarely (themes are partner-controlled, not us)
 *   - Build-time captures = zero upstream dependency on a screenshot
 *     service in prod
 *   - Vercel builds carry the committed PNGs; no per-visit screenshot
 *     latency
 *
 * Run:
 *   node scripts/screenshot-storefronts.mjs
 *
 * Re-run periodically (e.g. quarterly, or whenever a partner redesigns)
 * and commit the new PNGs + updated manifest.
 *
 * Source of truth for which storefronts to capture: the marketing
 * partners endpoint. Filter is `is_live` + `storefront_url present`.
 */

import { chromium } from "playwright"
import { mkdir, writeFile } from "node:fs/promises"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, "..")
const OUT_DIR = join(ROOT, "public", "storefront-previews")
const MANIFEST = join(ROOT, "data", "storefront-previews.json")

// Storefronts to capture. Pulled from /web/website/jaalyantra.com/marketing/partners
// at script-time so it stays in sync with what's live without us
// hardcoding the list here.
const PARTNERS_ENDPOINT =
  "https://v3.jaalyantra.com/web/website/jaalyantra.com/marketing/partners"

const VIEWPORT = { width: 1440, height: 900 }
const WAIT_NETWORK_IDLE_MS = 4000
const CAPTURE_TIMEOUT_MS = 45_000

async function fetchPartners() {
  const res = await fetch(PARTNERS_ENDPOINT)
  if (!res.ok) {
    throw new Error(`marketing/partners returned ${res.status}`)
  }
  const data = await res.json()
  const brands = (data.brands || []).filter(
    (b) => b.is_live && b.storefront_url
  )
  return brands
}

function slugFromHandle(handle) {
  return String(handle || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

async function captureOne(browser, brand) {
  const slug = slugFromHandle(brand.handle) || brand.id
  const outPath = join(OUT_DIR, `${slug}.png`)
  const ctx = await browser.newContext({ viewport: VIEWPORT })
  const page = await ctx.newPage()
  try {
    await page.goto(brand.storefront_url, {
      waitUntil: "networkidle",
      timeout: CAPTURE_TIMEOUT_MS,
    })
    // Some storefronts run delayed splash / cookie banners / hero
    // animations. Pause briefly so the screenshot doesn't catch a
    // mid-anim frame.
    await page.waitForTimeout(WAIT_NETWORK_IDLE_MS)
    await page.screenshot({
      path: outPath,
      clip: { x: 0, y: 0, width: VIEWPORT.width, height: VIEWPORT.height },
    })
    return {
      partner_id: brand.id,
      name: String(brand.name || "").trim(),
      handle: brand.handle,
      storefront_url: brand.storefront_url,
      screenshot_path: `/storefront-previews/${slug}.png`,
      width: VIEWPORT.width,
      height: VIEWPORT.height,
      captured_at: new Date().toISOString(),
    }
  } finally {
    await ctx.close()
  }
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true })
  await mkdir(dirname(MANIFEST), { recursive: true })

  console.log(`Fetching partner list from ${PARTNERS_ENDPOINT}…`)
  const brands = await fetchPartners()
  console.log(`Capturing ${brands.length} storefront(s)`)

  const browser = await chromium.launch({ headless: true })
  const results = []
  for (const b of brands) {
    process.stdout.write(`  ${b.name?.trim() || b.handle} (${b.storefront_url})… `)
    try {
      const r = await captureOne(browser, b)
      results.push(r)
      process.stdout.write("✓\n")
    } catch (err) {
      process.stdout.write(`✗ ${err?.message || err}\n`)
      // Skip — manifest only includes successful captures so the UI
      // doesn't render a broken-image card.
    }
  }
  await browser.close()

  const manifest = {
    captured_at: new Date().toISOString(),
    source: PARTNERS_ENDPOINT,
    storefronts: results,
  }
  await writeFile(MANIFEST, JSON.stringify(manifest, null, 2) + "\n", "utf-8")
  console.log(
    `\nWrote ${results.length} screenshot(s) → ${OUT_DIR}\nManifest → ${MANIFEST}`
  )
}

main().catch((err) => {
  console.error("[screenshot-storefronts] failed:", err)
  process.exit(1)
})
