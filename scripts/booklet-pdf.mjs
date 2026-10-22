// Render the Melbourne 2026 expo booklet (public/booklet/melbourne-2026.html) to an A5 PDF
// and one PNG per page for review.
//
//   node scripts/booklet-pdf.mjs            -> public/booklet/melbourne-2026.pdf
//   node scripts/booklet-pdf.mjs --png      -> also public/booklet/preview/page-N.png
//
// Uses the Playwright that lives in the jyt monorepo (this repo has none) and the
// installed Google Chrome, so nothing new is added to package.json.
import { createRequire } from "node:module"
import { mkdirSync } from "node:fs"
import path from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"

const here = path.dirname(fileURLToPath(import.meta.url))
const bookletDir = path.resolve(here, "../public/booklet")
const htmlPath = path.join(bookletDir, "melbourne-2026.html")
const pdfPath = path.join(bookletDir, "melbourne-2026.pdf")

const playwrightFrom = process.env.PLAYWRIGHT_FROM || path.resolve(here, "../../../jyt/package.json")
const { chromium } = createRequire(playwrightFrom)("playwright")

const browser = await chromium.launch({ channel: "chrome" })
const page = await browser.newPage()
await page.goto(pathToFileURL(htmlPath).href, { waitUntil: "networkidle" })
await page.evaluate(() => document.fonts.ready)

await page.pdf({
  path: pdfPath,
  width: "148mm",
  height: "210mm",
  printBackground: true,
  preferCSSPageSize: true,
  margin: { top: 0, right: 0, bottom: 0, left: 0 },
})
console.log("pdf:", pdfPath)

if (process.argv.includes("--png")) {
  const out = path.join(bookletDir, "preview")
  mkdirSync(out, { recursive: true })
  await page.emulateMedia({ media: "print" })
  const pages = await page.$$(".page")
  for (const [i, el] of pages.entries()) {
    await el.screenshot({ path: path.join(out, `page-${i + 1}.png`) })
  }
  console.log("png:", pages.length, "pages ->", out)
}

await browser.close()
