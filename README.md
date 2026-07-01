# TagIt

Batch price-tag tool for social media sellers. Upload product photos, drop a
draggable/resizable price tag on each one, batch-apply a style across the
whole set, and export flattened PNGs (original size, or padded Instagram
Feed / WhatsApp Status presets).

Everything runs client-side — no backend, no accounts, no database. State
resets when you reload the page; that's intentional.

## Stack

- React + Vite + TypeScript
- Tailwind CSS v4
- react-konva / Konva for the canvas editor
- Zustand for app state
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

Outputs a static `dist/` — deploy as-is to Vercel, Cloudflare Pages, or any
static host, no config needed.
