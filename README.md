# Portofolio — Randi Nandika Danendra

Website portofolio multi-halaman (SPA) bertema **"Dari Data Mentah ke Insight"**. Setiap halaman diberi transisi panel oranye, dan seluruh teks berbahasa Indonesia tersimpan di `src/data/content.js`.

Dibangun dengan **React + Vite + Tailwind CSS v4 + Framer Motion + React Router v7**.

## Setup

```bash
npm install
npm run dev        # http://localhost:5173
```

## Build & preview

```bash
npm run build
npm run preview
```

## Lint

```bash
npm run lint
```

## Struktur halaman

| Route | Halaman | Isi |
|---|---|---|
| `/` | Beranda | Hero + alur kerja 7 tahap + layanan |
| `/proyek` | Proyek | Daftar studi kasus + filter |
| `/proyek/:slug` | Detail | Cerita Pertanyaan → Data → Pendekatan → Hasil → Dampak |
| `/tools` | Tools | Keahlian teknis + tab + pencarian |
| `/journey` | Journey | Timeline interaktif |
| `/kontak` | Kontak | Banner magang, kartu kontak, form, terminal |
| `*` | 404 | Halaman tidak ditemukan |

Slug proyek: `faultsense`, `meddistrib`, `australia-rain-prediction`.

## Struktur folder

```
public/
  assets/
    randi-cutout.png
    CV_Randi_Nandika_Danendra.pdf
  favicon.svg
src/
  data/content.js          # SEMUA teks konten
  layouts/RootLayout.jsx    # navbar, transisi, footer, cursor, palette
  pages/                    # Home, Projects, ProjectDetail, Tools, Journey, Contact, NotFound
  sections/                 # Hero, Journey, Services (blok halaman Beranda)
  components/               # Navbar, Footer, Pill, Counter, Typewriter, dst.
  hooks.js                  # useReveal, useReducedMotion, usePageMeta
  utils.js
  index.css                 # token @theme Tailwind v4
  App.jsx                   # definisi route (lazy)
  main.jsx                  # BrowserRouter
vercel.json                 # rewrites semua path -> /index.html
```

## Menambah / mengubah proyek

Edit hanya `src/data/content.js`. Tambahkan objek ke array `projects`:

```js
{
  id: "slug-di-url",
  title: "Nama Proyek",
  role: "Data Scientist",
  context: "Machine Learning",
  period: "Jul 2026",
  summary: "Satu kalimat ringkas.",
  story: { pertanyaan, data, pendekatan, hasil, dampak },
  tools: ["Python", "..."],
  githubUrl: "https://github.com/...",
  demoUrl: "https://...",        // opsional; tombol Demo hanya muncul jika ada
  category: "Machine Learning",
  categories: ["Machine Learning", "Deployment"], // untuk filter
  accent: false,
}
```

Halaman detail, filter, dan panel "Dipakai di" pada halaman Tools otomatis mengikuti data ini.

## Deploy ke Vercel

1. Push repo ke GitHub.
2. Import di Vercel. Framework preset: **Vite**. Build `npm run build`, output `dist`.
3. `vercel.json` sudah mengarahkan semua path ke `/index.html`, jadi refresh di `/proyek` tidak 404.

## Deploy ke GitHub Pages

1. Set `base` di `vite.config.js` sesuai nama repo, lalu `npm run build`.
2. Deploy folder `dist`. Catatan: GitHub Pages tidak memakai `vercel.json`; SPA refresh butuh strategi 404 (mis. salin `index.html` ke `404.html`).

## Aksesibilitas & performa

- `prefers-reduced-motion` dihormati (transisi jadi fade 150ms, animasi berat mati).
- HTML semantik, `aria-current="page"` pada link aktif, fokus keyboard terlihat, alt text.
- Kursor kustom & tombol magnetik hanya di perangkat pointer presisi (desktop).
- Ikon SVG inline, tanpa library berat.
