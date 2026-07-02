# TagIt

An open-source, self-hosted batch price-tag tool for social media sellers.
Upload product photos, drop a draggable/resizable/rotatable price tag on
each one, batch-apply a style across the whole catalog, and export
flattened PNGs — sized for Instagram Feed, WhatsApp Status, or original
resolution.

No accounts. No database. No server. Your product photos and prices never
leave your browser.

## Why no backend

TagIt is built for vendors, not for us to operate as a service:

- **Your data stays yours.** Photos and prices are stored in your browser's
  IndexedDB, never uploaded anywhere.
- **Nothing to sign up for.** Open the page and start tagging.
- **Free to run.** It's a static site — host it yourself for the cost of
  nothing (Cloudflare Pages, GitHub Pages, Vercel all have generous free
  tiers for static sites).
- **Fork it.** Rebrand it, adapt the templates to your market, ship it
  under your own name. It's yours to change.

## Features

- Batch upload via drag-and-drop or file picker
- Canvas editor with a draggable, resizable, and rotatable price tag
  (pill / rect / ribbon / none backgrounds)
- Three starter style presets, plus one-click "apply style to all images"
- Quick price-entry table for fast bulk data entry without opening the
  canvas
- Optional watermark, positioned once and applied across the whole catalog
- Per-photo rotation (for sideways uploads) independent of tag rotation
- Export a single image or the whole catalog as a ZIP, in original size,
  Instagram Feed (1080×1080), or WhatsApp Status (1080×1920)
- Auto-saves to your browser as you work — reload the page without losing
  your catalog
- Responsive layout for editing on a phone

## Stack

- React + Vite + TypeScript
- Tailwind CSS v4
- react-konva / Konva for the canvas editor
- Zustand for app state
- idb-keyval (IndexedDB) for local persistence
- JSZip for batch exports

## Develop

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

Outputs a static `dist/` — no config needed to deploy to Vercel, Cloudflare
Pages, or any static host.

## Deploying your own instance

A GitHub Actions workflow (`.github/workflows/deploy.yml`) is included to
publish `dist/` to GitHub Pages automatically on every push to `main`. To
use it on your fork: **Settings → Pages → Build and deployment → Source →
GitHub Actions**.

## Data & privacy

Everything lives in your browser's IndexedDB, scoped to the device and
browser you're using — it isn't synced across devices and isn't sent to
any server. Clearing your browser's site data (or hitting "Clear project"
in the app) deletes it for good.

## Contributing

Issues and PRs welcome — new style presets, export presets, and
localization are all good places to start.

## License

MIT.
