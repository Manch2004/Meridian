# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Marketing site for Meridian, an AI-driven investment fund. React 19 + Vite + Tailwind CSS v4, with
English/Armenian/Russian i18n via i18next. No test suite exists in this repo.

## Commands

```bash
npm install      # install dependencies
npm run dev      # start the dev server (http://localhost:5173)
npm run build    # production build to dist/
npm run preview  # locally preview the production build
npm run lint      # run oxlint (rules: react/rules-of-hooks, react/only-export-components)
```

There is no test runner configured — do not assume `npm test` exists.

## Architecture

- **Routing**: `src/App.jsx` defines all routes with `react-router-dom`, all nested under a single
  `Layout` route element. `src/components/Layout.jsx` renders the persistent `Header` + `Footer`
  around an `<Outlet />`. `ScrollToTop` resets scroll position on route change.
- **Pages vs. components**: `src/pages/` holds one file per route (thin — assembled from
  components/data), `src/components/` holds the reusable/section building blocks (Header, Footer,
  Hero, FundChart, etc.). `Home.jsx` additionally defines small "preview" sections that summarize
  other pages and link out to them via `common.learnMore` / `common.seeDetails` strings.
- **i18n**: `src/i18n.js` initializes i18next with three inline JSON resource bundles
  (`src/locales/{en,hy,ru}/translation.json`), fallback `en`, and browser-language auto-detection.
  **The three translation files must keep the same key structure** — when adding a copy key, add it
  to all three. Components consume strings via `useTranslation()` / `t("namespace.key")`, never
  hardcoded text.
- **Static content as data**: content that isn't prose copy (FAQ items, roadmap phases, technology
  pillars, fund demo/chart data) lives as arrays/objects in `src/data/*.js` and is mapped over in
  components, keeping the JSX free of inline content lists.
- **Centralized external links**: `src/config/links.js` exports every outbound/action URL
  (Telegram, "Open App", currently placeholders). Components must import from here rather than
  hardcoding URLs, so real destinations can be filled in in one place.
- **Design tokens & the "gold card" system**: `src/styles/tailwind.css` defines the color/font/
  radius design tokens via Tailwind v4's `@theme` block (gold/dark premium palette — `gold-primary`,
  `bg-card`, `border-default`, etc.) plus shared component classes used site-wide: `.gold-card` (the
  card treatment used by About, Technology, Token Ecosystem, Fund, Roadmap, FAQ), `.gold-icon-glow`,
  `.gold-corner-dot`, and `.reveal`/`.reveal-visible` (scroll-reveal animation, paired with the
  `useScrollReveal` hook). Prefer reusing these classes over inventing new card/glow treatments.
- **Charts**: `FundChart.jsx` uses `recharts`, fed from `src/data/fundDemoData.js` (placeholder
  data — flagged as such in the README).
- **Hooks**: `useScrollReveal` (IntersectionObserver-driven reveal-on-scroll, pairs with the
  `.reveal` CSS classes above) and `useCountUp` (animated number counting), both in `src/hooks/`.

## Content/asset placeholders to be aware of

Several things in this repo are intentionally temporary and are called out in code comments/README
— don't "fix" them without checking with the user first:
- `src/config/links.js`: Telegram URL and "Open App" URL are placeholders.
- `src/assets/logo.svg` and `public/favicon.svg`/`favicon.ico`: placeholder marks; `Header.jsx`
  deliberately renders a text wordmark instead of the logo until a real one exists.
- `index.html`: Open Graph/Twitter meta tags reference `/og-image.png`, which doesn't exist yet.
- `src/data/fundDemoData.js`: placeholder fund stats/chart data, not real fund performance.

## Deployment

Configured for Vercel via `vercel.json` (static Vite build, output in `dist/`); connecting the repo
is sufficient, no further config needed.
