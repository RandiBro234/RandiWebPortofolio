# AGENTS.md

Personal web portfolio for Randi Nandika Danendra. Multi-page SPA ("Dari Data Mentah Jadi Sebuah Insight"). All site copy is Indonesian.

## Stack

React 19 + Vite 8 + Tailwind CSS v4 + Framer Motion + React Router v7. Tailwind v4 uses the official `@tailwindcss/vite` plugin — there is **no** `tailwind.config.js` or `postcss.config.js`. Theme tokens live in `@theme { ... }` in `src/index.css`.

## Commands

- `npm run dev` — dev server at http://localhost:5173
- `npm run build` — production build to `dist/`
- `npm run preview` — serve the built output
- `npm run lint` — oxlint (warnings only; `react(set-state-in-effect)` warnings are expected in `hooks.js`, `Counter.jsx`, `Typewriter.jsx`, `CustomCursor.jsx`, `Navbar.jsx`, `Hero.jsx`)

There are no tests.

## Routing

`main.jsx` wraps `<App/>` in `BrowserRouter`. Routes (in `src/App.jsx`): `/`, `/proyek`, `/proyek/:slug`, `/tools`, `/journey`, `/kontak`, `*` (404). Every page is `React.lazy` loaded. `vercel.json` rewrites all paths to `/index.html` (SPA refresh safety). `RootLayout` renders navbar, page transitions, command palette, scroll progress, back-to-top, footer.

## Content is data-driven

Every string is in `src/data/content.js` — edit that file only, never hardcode text into pages/components. Placeholders use `[ISI: ...]`. `pages` holds per-route `{ title, description }` (used by `usePageMeta`). Project `slug` is the URL segment (`/proyek/:slug`). Journey stages carry `linkSlug` (→ project page). Tools derive "Dipakai di" from `projects[].tools`. To add a project: append to `projects` with `slug`, `role`, `period`, `categories` (Projects filter), `tools`, `githubUrl`, optional `demoUrl`.

## Layout conventions

- `src/layouts/` = `RootLayout.jsx`.
- `src/pages/` = one file per route: Home, Projects, ProjectDetail, Tools, Journey, Contact, NotFound.
- `src/sections/` = Home-page blocks only: Hero, Journey (scrollytelling), Services.
- `src/components/` = shared UI. `icons.jsx` exports named (`ArrowIcon`, `ArrowRight`, `QuoteIcon`) — not default.
- `src/components/JourneyVisuals.jsx` = the 7 scrollytelling SVGs, keyed by `visual` in `content.js`.
- Size system: `.section` (py-16 md:py-24), `.section-h2` (clamp 1.75–2.75rem), `.section-sub`, `.section-h3` in `index.css`. Container `max-w-6xl px-5 md:px-8`. Do not add full-screen sections except the Hero.
- Tailwind tokens: `bg-ink`, `bg-ink-dark`, `bg-ink-soft`, `bg-accent`, `text-muted`, `border-line`, `rounded-pill`, `rounded-card`, `rounded-xl2`, `font-display` (Bricolage Grotesque), `font-sans`.

## Hero

`src/sections/Hero.jsx` is a 2-column layout on `lg`+ (text left, cutout photo in a tilt-enabled polaroid card right); stacks on mobile. Giant lines use `.hero-giant` (clamp, uppercase, nowrap): `DATA SCIENTIST` solid orange, `RANDI NANDIKA` solid #1A1A1A. Data-driven text: `hero.lineSolid`, `hero.lineOutline`, `hero.anotasi[]`, `hero.peran`, `hero.chips[]`. Polaroid card tilts ±6° on mouse (perspective 1000px). Desktop-only extras gate on `pointer: fine` + `min-width: 1024px` + not reduced-motion.

## Custom cursor

`src/components/CustomCursor.jsx` = a single orange circle that follows the mouse with lerp 0.2 via `requestAnimationFrame` (positions in `useRef`). Over `a, button, [data-cursor]` it grows to 64px, fills solid `#FF4B1F`, and shows the contextual label **inside** the circle (`data-cursor` value, lowercase: `lihat`, `buka`, `kontak`, `salin`, `unduh`, `baca`). Only mounted/reacted on `(hover: hover) and (pointer: fine)`; native cursor hidden there via `* { cursor: none }` in `index.css`. Mounted once in `src/App.jsx`.

## Logo / favicon

`src/components/LogoMark.jsx` = the "R" SVG (`viewBox 0 0 368 402`, `fill="currentColor"`). Used inside an orange `rounded-full` circle in `Navbar.jsx` (40px mobile / 48px desktop) and `Footer.jsx`. `public/favicon.svg` is the matching orange rounded-square + white R. Keep the two in sync if the mark changes.

## Interaction

- `Magnetic` (`src/components/Magnetic.jsx`) pulls buttons up to 8px toward the cursor within an ~80px radius; used by hero CTAs and navbar "Kontak". Respects reduced-motion / touch.
- Project detail card lifts 4px + orange border on hover.
- Press `Ctrl/Cmd+K` for the command palette.
- Respect `prefers-reduced-motion` (page transition falls back to a short fade).

## Assets

- `public/assets/randi-cutout.webp` — portrait (WebP, ~356 KB, 1100px). Primary source in the hero/ID card `<picture>`.
- `public/assets/randi-cutout.png` — PNG fallback (downscaled 1100px, ~3 MB).
- `public/assets/CV_Randi_Nandika_Danendra_v2.pdf` — served URL. Download name is forced to `CV_Randi_Nandika_Danendra.pdf` via `profile.cvDownloadName`. Source of truth: `profile.cvUrl` / `profile.cvDownloadName` in `content.js`.
- `public/favicon.svg` — orange "R" badge.

## Performance rules

- Do NOT `setState` on scroll/mousemove. Scroll-driven UI (ScrollProgress, Journey progress bar, ProjectDetail read bar) writes `style.transform` via `ref` + `requestAnimationFrame`. Hero text parallax reads a `useRef` offset, applied in a rAF loop.
- Active-section detection uses `IntersectionObserver` with a change-guard (`setActiveIndex(prev => prev === idx ? prev : idx)`), never per-frame position reads.
- Repeated CSS animations pause when the tab is hidden via `document.documentElement.classList` `tab-hidden` (toggled in `RootLayout`).
- Only animate `transform`/`opacity`. Avoid permanent `will-change` except on continuously-moving elements.
- Images: explicit `width`/`height`, `decoding="async"`; LCP image uses `fetchpriority="high"` + `<link rel="preload">` in `index.html`.

## Constraints

- Custom cursor / magnetic buttons / parallax / tilt are desktop-only (check `pointer: fine`).
- Keep Lighthouse 90+; avoid heavy dependencies; icons are inline SVG.
- Do not fabricate numbers, clients, or testimonials. Use only verified facts in `content.js`; leave unknowns as `[ISI: ...]`.

## Note

The workspace file listing can be unreliable in this environment — it has repeatedly shown the repo as containing only the CV/PNG. Verify with `Test-Path src/App.jsx` / `git status` before assuming the repo is empty. Never overwrite `AGENTS.md` based on a partial listing.
