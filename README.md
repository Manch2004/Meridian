# Meridian

Marketing site for Meridian, an AI-driven investment fund. React + Vite + Tailwind CSS, with English/Armenian/Russian i18n via i18next.

## Commands

```bash
npm install      # install dependencies
npm run dev      # start the dev server (http://localhost:5173)
npm run build    # production build to dist/
npm run preview  # locally preview the production build
npm run lint     # run oxlint
```

## Folder structure

```
public/                  Static files served as-is (favicon.svg, favicon.ico)
src/
  assets/                Static brand assets (logo.svg placeholder)
  components/            One component per section (Header, Hero, About, ...)
  config/                Centralized config, e.g. links.js
  data/                  Static content arrays consumed by components (fund
                          demo data, FAQ items, roadmap phases, ...)
  hooks/                 Shared hooks (useScrollReveal, useCountUp)
  locales/<lang>/        i18n translation files (en / hy / ru)
  styles/                Tailwind entry point + design tokens
  i18n.js                i18next setup; also keeps <html lang> in sync
  main.jsx, App.jsx      App entry point and top-level section layout
```

## Where to update things

- **External / action links** (Telegram, "Open App"): [`src/config/links.js`](src/config/links.js).
  Every component reads from here — update the URLs in one place once they're known.
- **Copy, in all three languages**: [`src/locales/en/translation.json`](src/locales/en/translation.json),
  [`src/locales/hy/translation.json`](src/locales/hy/translation.json),
  [`src/locales/ru/translation.json`](src/locales/ru/translation.json).
  The three files must keep the same key structure — when adding a key, add it to all three.
- **Fund stats / chart data** (currently placeholder demo data):
  [`src/data/fundDemoData.js`](src/data/fundDemoData.js).
- **Logo**: replace [`src/assets/logo.svg`](src/assets/logo.svg) with the real brand asset. The
  header currently renders a plain text wordmark by design (see `Header.jsx`) until a real logo
  exists; swap it in there once available. The favicon (`public/favicon.svg` /
  `public/favicon.ico`) is also a placeholder "M" mark and should be replaced at the same time.
- **SEO / social preview**: meta tags live directly in [`index.html`](index.html). The Open Graph
  / Twitter card tags reference `/og-image.png`, which doesn't exist yet — add a real 1200x630
  image at `public/og-image.png` when available, and update `og:url` to the real domain.

## Deployment

Configured for [Vercel](https://vercel.com) via [`vercel.json`](vercel.json) (static Vite build,
output in `dist/`). Connect the repo and deploy — no further configuration required.
