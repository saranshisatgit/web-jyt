# Mockup Animations

Render static mockup HTML files into looping animated GIFs and WebMs for use on the marketing site, documentation, and social media.

## Prerequisites

- **Playwright** — `npm install playwright && npx playwright install chromium`
- **ffmpeg** — macOS: `brew install ffmpeg` · Ubuntu: `sudo apt install ffmpeg`

## Usage

```bash
node scripts/mockup-to-gif.mjs <mockup-html-path> [options]
```

### Options

| Flag          | Default                          | Description                  |
|---------------|----------------------------------|------------------------------|
| `--out`       | `public/mockups/<basename>`      | Output path prefix (no ext)  |
| `--frames`    | `28`                             | Number of frames             |
| `--fps`       | `8`                              | Frames per second            |
| `--width`     | `1280`                           | Viewport width               |
| `--height`    | `800`                            | Viewport height              |

### Examples

```bash
node scripts/mockup-to-gif.mjs product-create-mockup.html
node scripts/mockup-to-gif.mjs production-run-mockup.html --out public/mockups/prod-run --frames 20 --fps 6
node scripts/mockup-to-gif.mjs inventory-orders-mockup.html --width 1440 --height 900
node scripts/mockup-to-gif.mjs whatsapp-mockup.html --width 480 --height 900
```

## Source Mockups

These are the 4 mockup HTML files in the repo root:

| File                            | Description                              |
|---------------------------------|------------------------------------------|
| `product-create-mockup.html`    | Product creation flow (choice / quick / advanced with 4 tabs) |
| `production-run-mockup.html`    | Production run lifecycle (started → finished → completed)      |
| `inventory-orders-mockup.html`  | Inventory order workflow (pending → processing → delivered)    |
| `whatsapp-mockup.html`          | WhatsApp-style product creation chat       |

## Output

Files are written to `public/mockups/` by default:

```
public/mockups/
  product-create.gif
  product-create.webm
  production-run.gif
  production-run.webm
  inventory-orders.gif
  inventory-orders.webm
  whatsapp.gif
  whatsapp.webm
```

The GIF loops forever. The WebM uses VP9 video codec (no audio).
