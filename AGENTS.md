# AGENTS.md

Personal web portfolio for Randi Nandika Danendra. Multi-page SPA ("Dari Data Mentah ke Insight"). All site copy is Indonesian.

## Stack

React 19 + Vite 8 + Tailwind CSS v4 + Framer Motion + React Router v7. Tailwind v4 uses the official `@tailwindcss/vite` plugin — there is **no** `tailwind.config.js` or `postcss.config.js`. Theme tokens live in `@theme { ... }` in `src/index.css`.

## Commands

- `npm run dev` — dev server at http://localhost:5173
- `npm run build` — production build to `dist/`
- `npm run preview` — serve the built output
- `npm run lint` — oxlint (warnings only; `react(set-state-in-effect)` warnings are expected in `hooks.js`, `Counter.jsx`, `Typewriter.jsx`, `CustomCursor.jsx`, `Navbar.jsx`)

There are no tests.

## Routing

`main.jsx` wraps `<App/>` in `BrowserRouter`. Routes (in `src/App.jsx`): `/`, `/proyek`, `/proyek/:slug`, `/tools`, `/journey`, `/kontak`, `*` (404). Every page is `React.lazy` loaded. `vercel.json` rewrites all paths to `/index.html` (SPA refresh safety). `RootLayout` runs page transitions, scroll-to-top, navbar, command palette, cursor, progress bar, back-to-top, footer.

## Content is data-driven

Every string is in `src/data/content.js` — edit that file only, never hardcode text into pages/components. Placeholders use `[ISI: ...]`. `pages` holds per-route `{ title, description }` (used by `usePageMeta`). Project `id` is the URL slug (`/proyek/:id`). Journey stages carry `linkSlug` (→ project page). Tools derive "Dipakai di" from `projects[].tools`. To add a project: append to `projects` with `id`, `tools`, `githubUrl`, optional `demoUrl`, and `categories` (used by the Projects filter).

## Layout conventions

- `src/layouts/` = `RootLayout.jsx`.
- `src/pages/` = one file per route: Home, Projects, ProjectDetail, Tools, Journey, Contact, NotFound.
- `src/sections/` = Home-page blocks only: Hero, Journey (scrollytelling), Services.
- `src/components/` = shared UI. `icons.jsx` exports named (`ArrowIcon`, `ArrowRight`, `QuoteIcon`) — not default.
- `src/components/JourneyVisuals.jsx` = the 7 scrollytelling SVGs, keyed by `visual` in `content.js`. Labeled "Ilustrasi"; do not present their numbers as real project results.
- Size system: `.section` (py-16 md:py-24), `.section-h2` (clamp 1.75–2.75rem), `.section-sub`, `.section-h3` in `index.css`. Container `max-w-6xl px-5 md:px-8`. Do not add full-screen sections except the Hero.
- Tailwind tokens: `bg-ink`, `bg-ink-dark`, `bg-ink-soft`, `bg-accent`, `text-muted`, `border-line`, `rounded-pill`, `rounded-card`, `rounded-xl2`, `font-display` (Bricolage Grotesque), `font-sans`.

## Interaction

Custom cursor reads the `data-cursor="<Label>"` attribute for its contextual label. Press `Ctrl/Cmd+K` for the command palette. Respect `prefers-reduced-motion` (page transition falls back to a 150ms fade).

## Assets

- `public/assets/randi-cutout.png` — portrait. ~18 MB; compress before final deploy.
- `public/assets/CV_Randi_Nandika_Danendra.pdf` — linked by "Unduh CV" (Journey + Contact).
- `public/favicon.svg` — orange "R" badge.

## Constraints

- Custom cursor / magnetic buttons / parallax are desktop-only (check `pointer: fine`).
- Keep Lighthouse 90+; avoid heavy dependencies; icons are inline SVG.
- Do not fabricate numbers, clients, or testimonials. Use only verified facts in `content.js`; leave unknowns as `[ISI: ...]`.
