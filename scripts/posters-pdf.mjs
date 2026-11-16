// Render the Global Sourcing Expo Melbourne 2026 stand posters (public/booklet/poster-*.html)
// to print-ready A1 PDFs with a 3 mm bleed, plus a PNG preview of each.
//
//   node scripts/posters-pdf.mjs   -> public/booklet/print/*.pdf and *.png
//
// Each PDF page is 600 x 847 mm: the 594 x 841 mm poster centred, with the colour at
// each edge carried 3 mm past the trim line. Uses the Playwright that lives in the jyt
// monorepo (this repo has none) and the installed Google Chrome, like booklet-pdf.mjs.
import { createRequire } from "node:module"
import { mkdirSync } from "node:fs"
import path from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"

const here = path.dirname(fileURLToPath(import.meta.url))
const bookletDir = path.resolve(here, "../public/booklet")
const outDir = path.join(bookletDir, "print")
mkdirSync(outDir, { recursive: true })

const POSTERS = [
  { html: "poster-melbourne-2026.html", out: "JYT-Melbourne-2026-poster-1-house-of-hands-A1" },
  { html: "poster-supply-line-2026.html", out: "JYT-Melbourne-2026-poster-2-supply-line-A1" },
  { html: "poster-sell-anywhere-2026.html", out: "JYT-Melbourne-2026-poster-3-sell-anywhere-A1" },
]
const BLEED = 3 // mm

const playwrightFrom = process.env.PLAYWRIGHT_FROM || path.resolve(here, "../../../jyt/package.json")
const { chromium } = createRequire(playwrightFrom)("playwright")

const browser = await chromium.launch({ channel: "chrome" })
for (const p of POSTERS) {
  const page = await browser.newPage({ viewport: { width: 1400, height: 2000 } })
  await page.goto(pathToFileURL(path.join(bookletDir, p.html)).href, { waitUntil: "networkidle" })
  await page.evaluate(() => document.fonts.ready)
  await page.emulateMedia({ media: "print" })

  // Bleed: pad the sheet by 3 mm and paint the pad with the poster's own edge colours.
  // The top edge is paper; the bottom band (the last block) carries its colour down and
  // out to the sides from where it starts.
  await page.evaluate((bleed) => {
    const poster = document.querySelector(".poster")
    const paper = getComputedStyle(poster).backgroundColor
    const band = getComputedStyle(poster.lastElementChild).backgroundColor
    // Walk up through the bottom blocks that share the band colour (poster 1's call to
    // action and its footer are both teal), so the side bleed starts where the band does.
    let last = poster.lastElementChild
    while (last.previousElementSibling && getComputedStyle(last.previousElementSibling).backgroundColor === band) last = last.previousElementSibling
    const mm = 96 / 25.4
    const split = (last.offsetTop / mm + bleed).toFixed(2)
    const style = document.createElement("style")
    style.textContent = `
      @page { size: ${594 + 2 * bleed}mm ${841 + 2 * bleed}mm; margin: 0; }
      html, body { background: none !important; }
      .frame { padding: ${bleed}mm; width: auto !important; height: auto !important;
        background: linear-gradient(to bottom, ${paper} ${split}mm, ${band} ${split}mm); }`
    document.head.appendChild(style)
  }, BLEED)
  // The woven panel on poster 1 places its paper bands from layout, so let it settle.
  await page.waitForTimeout(300)

  const pdf = path.join(outDir, `${p.out}.pdf`)
  await page.pdf({ path: pdf, preferCSSPageSize: true, printBackground: true, margin: { top: 0, right: 0, bottom: 0, left: 0 } })
  await page.locator(".poster").screenshot({ path: path.join(outDir, `${p.out}.png`) })
  console.log("pdf:", pdf)
  await page.close()
}
await browser.close()
