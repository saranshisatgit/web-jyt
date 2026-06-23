#!/usr/bin/env node
/**
 * Convert a static mockup HTML file into a looping animated GIF and a WebM.
 *
 * Captures sequential frames in a headless browser, advancing through step
 * controls (buttons, tabs, state toggles) between frames.  When no step
 * controls are detected it scrolls the page from top to bottom instead.
 * Frames are encoded with ffmpeg using a two-pass palette for the GIF and
 * libvpx-vp9 for the WebM.
 *
 * Usage
 *   node scripts/mockup-to-gif.mjs <mockup-html-path> [options]
 *
 * Options
 *   --out <path>     Output path prefix (default: public/mockups/<name>)
 *   --frames <num>   Number of frames to capture          (default: 28)
 *   --fps <num>      Frames per second in the output      (default: 8)
 *   --width <num>    Viewport width                       (default: 1280)
 *   --height <num>   Viewport height                      (default: 800)
 *
 * Dependencies
 *   playwright       npm install playwright && npx playwright install chromium
 *   ffmpeg           brew install ffmpeg / apt install ffmpeg
 */

import { chromium } from "playwright"
import { rmSync, existsSync, mkdirSync } from "node:fs"
import { join, dirname, basename, extname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { execFileSync } from "node:child_process"
import { tmpdir } from "node:os"

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, "..")

function parseArgs() {
  const args = process.argv.slice(2)
  if (!args.length || args[0].startsWith("--")) {
    console.error(
      "Usage: node scripts/mockup-to-gif.mjs <mockup-html-path> " +
      "[--out <path>] [--frames 28] [--fps 8] [--width 1280] [--height 800]"
    )
    process.exit(1)
  }

  const input = resolve(args[0])
  const opts = { frames: 28, fps: 8, width: 1280, height: 800, out: null }

  for (let i = 1; i < args.length; i++) {
    switch (args[i]) {
      case "--out":
        opts.out = resolve(args[++i])
        break
      case "--frames":
        opts.frames = parseInt(args[++i], 10)
        break
      case "--fps":
        opts.fps = parseInt(args[++i], 10)
        break
      case "--width":
        opts.width = parseInt(args[++i], 10)
        break
      case "--height":
        opts.height = parseInt(args[++i], 10)
        break
    }
  }

  if (!opts.out) {
    const name = basename(input, extname(input))
    const cleanName = name.endsWith("-mockup") ? name.slice(0, -7) : name
    opts.out = join(ROOT, "public", "mockups", cleanName)
  }

  return { input, ...opts }
}

function detectStepControls(page) {
  return page.evaluate(() => {
    function hasVisible(sel) {
      for (const el of document.querySelectorAll(sel)) {
        if (el.offsetParent !== null) return true
      }
      return false
    }

    const navTexts = [
      "Next", "Continue", "Publish", "Complete",
      "Start Processing", "Record Delivery", "Submit Payment",
      "Accept Run", "Mark Finished",
    ]
    for (const txt of navTexts) {
      for (const btn of document.querySelectorAll("button")) {
        if (btn.textContent.trim() === txt && btn.offsetParent !== null) {
          return true
        }
      }
    }

    if (hasVisible("[data-step]")) return true
    if (hasVisible('[role="tab"]')) return true

    const advFuncs = [
      "showScreen(", "goState(", "advNext(", "switchAdvTab(",
      "confirmStart(", "confirmFinish(", "confirmDeliver(",
      "confirmComp(", "compNext(", "openFinish(", "openComp(",
    ]
    for (const el of document.querySelectorAll("[onclick]")) {
      const oc = el.getAttribute("onclick") || ""
      if (advFuncs.some((f) => oc.includes(f)) && el.offsetParent !== null) {
        return true
      }
    }

    return false
  })
}

function advanceStep(page) {
  return page.evaluate(() => {
    const openModal = document.querySelector(
      '.modal[style*="display: block"], .modal[style*="display:block"]'
    )

    function isUsable(el) {
      if (!el || !el.isConnected) return false
      if (el.offsetParent === null) return false
      const style = getComputedStyle(el)
      if (style.display === "none" || style.visibility === "hidden") return false
      return true
    }

    function isInsideFixedHeader(el) {
      while (el && el !== document.body) {
        if (getComputedStyle(el).position === "fixed") return true
        el = el.parentElement
      }
      return false
    }

    // 1 — Buttons with advancement text (scoped to open modal if one exists)
    const navTexts = [
      "Next", "Continue", "Publish", "Complete",
      "Confirm Finish", "Confirm Delivery",
      "Start Processing", "Record Delivery", "Submit Payment",
      "Accept Run", "Mark Finished",
    ]
    const root = openModal || document
    for (const txt of navTexts) {
      for (const btn of root.querySelectorAll("button")) {
        if (btn.textContent.trim() === txt && isUsable(btn)) {
          btn.click()
          return true
        }
      }
    }

    // 2 — State-changing onclick handlers (skip fixed headers)
    const advMatchers = [
      ["showScreen(", (oc) => {
        const m = oc.match(/showScreen\(['"](\w+)['"]\)/)
        if (!m) return false
        const target = document.getElementById("s-" + m[1])
        const current = document.querySelector(".screen.open")
        return target && current && target !== current
      }],
      ["goState(", (oc) => {
        const m = oc.match(/goState\(['"](\w+)['"]\)/)
        if (!m) return false
        const active = document.querySelector(".state-btn.active")
        if (active && active.textContent.toLowerCase().trim() === m[1]) return false
        return true
      }],
    ]
    for (const el of document.querySelectorAll("[onclick]")) {
      if (!isUsable(el) || isInsideFixedHeader(el)) continue
      const oc = el.getAttribute("onclick") || ""
      for (const [pattern, guard] of advMatchers) {
        if (oc.includes(pattern) && guard(oc)) {
          el.click()
          return true
        }
      }
      const unconditional = [
        "advNext(", "confirmStart(", "confirmFinish(",
        "confirmDeliver(", "confirmComp(", "compNext(",
        "openFinish(", "openComp(", "openStart(", "openDeliver(",
      ]
      if (unconditional.some((f) => oc.includes(f))) {
        el.click()
        return true
      }
    }

    // 3 — Tabs further along than the active one
    const activeTab = document.querySelector('.tab.active, [role="tab"][aria-selected="true"]')
    const curIdx = activeTab
      ? parseInt(activeTab.getAttribute("data-tab") || "-1", 10)
      : -1
    for (const tab of document.querySelectorAll('.tab, [role="tab"]')) {
      const idx = parseInt(tab.getAttribute("data-tab") || "-1", 10)
      if (idx > curIdx && isUsable(tab)) {
        tab.click()
        return true
      }
    }

    return false
  })
}

async function main() {
  const { input, out, frames, fps, width, height } = parseArgs()

  if (!existsSync(input)) {
    console.error(`Input file not found: ${input}`)
    process.exit(1)
  }

  mkdirSync(dirname(out), { recursive: true })

  const delayMs = Math.round(1000 / fps)

  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage({
    viewport: { width, height },
    deviceScaleFactor: 2,
  })

  await page.goto("file://" + resolve(input), { waitUntil: "networkidle" })

  const useScroll = !(await detectStepControls(page))

  const tmpDir = join(tmpdir(), `mockup-frames-${Date.now()}`)
  mkdirSync(tmpDir, { recursive: true })

  for (let i = 0; i < frames; i++) {
    if (i > 0) {
      if (useScroll) {
        await page.evaluate(({ i, frames }) => {
          const scrollH = document.documentElement.scrollHeight
          const vpH = window.innerHeight
          const maxScroll = Math.max(0, scrollH - vpH)
          if (maxScroll > 0) {
            window.scrollTo(0, Math.round((maxScroll / (frames - 1)) * i))
          }
        }, { i, frames })
      } else {
        await advanceStep(page)
      }
    }

    await page.waitForTimeout(delayMs)
    await page.screenshot({
      path: join(tmpDir, `frame-${String(i + 1).padStart(4, "0")}.png`),
      fullPage: true,
    })
  }

  await browser.close()

  // GIF: cap width (deviceScaleFactor 2 capture → huge frames; a tall mockup can
  // balloon to 10MB+). Scale down with lanczos before the palette pass so the GIF
  // stays a lean web asset; the WebM keeps full resolution.
  const GIF_MAX_WIDTH = 960
  execFileSync("ffmpeg", [
    "-y",
    "-framerate", String(fps),
    "-i", join(tmpDir, "frame-%04d.png"),
    "-vf", `scale=${GIF_MAX_WIDTH}:-1:flags=lanczos,split[s0][s1];[s0]palettegen=max_colors=256:stats_mode=diff[p];[s1][p]paletteuse=dither=bayer:bayer_scale=5`,
    "-loop", "0",
    `${out}.gif`,
  ])

  execFileSync("ffmpeg", [
    "-y",
    "-framerate", String(fps),
    "-i", join(tmpDir, "frame-%04d.png"),
    "-c:v", "libvpx-vp9",
    "-b:v", "0",
    "-crf", "30",
    "-pix_fmt", "yuv420p",
    "-an",
    `${out}.webm`,
  ])

  rmSync(tmpDir, { recursive: true, force: true })

  console.log(`${out}.gif`)
  console.log(`${out}.webm`)
}

main().catch((err) => {
  console.error("[mockup-to-gif] failed:", err)
  process.exit(1)
})
