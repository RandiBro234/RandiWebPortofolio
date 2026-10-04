import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import PageHeader from '../components/PageHeader';
import { toolkit, toolPipeline, projects, pages } from '../data/content';
import { usePageMeta } from '../hooks';
import { cn } from '../utils';

function initials(name) {
  return name
    .replace(/[()]/g, '')
    .split(/[\s/]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}

function usageFor(tool) {
  return projects.filter((p) => p.tools.includes(tool));
}

function ToolCard({ tool }) {
  const [open, setOpen] = useState(false);
  const usedIn = usageFor(tool);

  return (
    <div
      data-cursor="Buka"
      onClick={() => usedIn.length > 0 && setOpen((v) => !v)}
      className={cn(
        'relative rounded-card border border-line bg-white p-4 transition-transform duration-200',
        usedIn.length > 0 && 'cursor-pointer hover:-translate-y-0.5 hover:border-accent',
      )}
    >
      <div className="flex items-center gap-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-ink font-display text-[12px] font-extrabold text-white">
          {initials(tool)}
        </span>
        <span className="text-[14px] font-semibold text-ink">{tool}</span>
      </div>

      <AnimatePresence>
        {open && usedIn.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <p className="mt-3 text-[12px] font-semibold uppercase tracking-wider text-muted">
              Dipakai di:
            </p>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {usedIn.map((p) => (
                <Link
                  key={p.id}
                  to={`/proyek/${p.id}`}
                  onClick={(e) => e.stopPropagation()}
                  data-cursor="Buka"
                  className="rounded-pill bg-accent/10 px-2.5 py-0.5 text-[12px] font-medium text-accent hover:bg-accent hover:text-white"
                >
                  {p.title}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function PipelineFlow() {
  const [hover, setHover] = useState(null);
  return (
    <div className="rounded-card border border-line bg-white p-5">
      <p className="text-[12px] font-semibold uppercase tracking-wider text-muted">
        Alur toolkit
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        {toolPipeline.map((t, i) => (
          <div key={t} className="flex items-center gap-2">
            <button
              type="button"
              onMouseEnter={() => setHover(t)}
              onMouseLeave={() => setHover(null)}
              onFocus={() => setHover(t)}
              onBlur={() => setHover(null)}
              className={cn(
                'rounded-pill border px-3 py-1.5 text-[13px] font-medium transition-colors',
                hover === t
                  ? 'border-accent bg-accent text-white'
                  : 'border-line text-ink',
              )}
            >
              {t}
            </button>
            {i < toolPipeline.length - 1 && (
              <svg width="16" height="12" viewBox="0 0 24 12" fill="none" stroke="currentColor" strokeWidth="1.6" className="text-line" aria-hidden="true">
                <path d="M1 6h20M16 1l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Tools() {
  usePageMeta(pages.tools.title, pages.tools.description);
  const [tab, setTab] = useState(toolkit.groups[0].label);
  const [query, setQuery] = useState('');

  const activeGroup = useMemo(
    () => toolkit.groups.find((g) => g.label === tab),
    [tab],
  );

  const visibleItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q) {
      return toolkit.groups.flatMap((g) => g.items).filter((it) => it.toLowerCase().includes(q));
    }
    return activeGroup ? activeGroup.items : [];
  }, [activeGroup, query]);

  return (
    <div className="section px-5 pt-28 md:px-8 md:pt-32">
      <PageHeader
        eyebrow={toolkit.eyebrow}
        title="Tools &"
        titleAccent="Keahlian"
        subtitle="Alat yang saya pakai sehari-hari, dari mengolah data sampai mengirim model ke produksi."
      />

      <div className="mx-auto mt-8 max-w-6xl">
        <PipelineFlow />
      </div>

      {/* marquee */}
      <div className="relative mx-auto mt-6 max-w-6xl overflow-hidden rounded-pill border border-line bg-white py-2.5">
        <div className="flex w-max animate-marquee gap-3 will-change-transform">
          {[...toolkit.marquee, ...toolkit.marquee].map((t, i) => (
            <span
              key={`${t}-${i}`}
              className="grid h-9 place-items-center whitespace-nowrap rounded-pill bg-ink px-4 text-[13px] font-semibold text-white"
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* pencarian */}
      <div className="mx-auto mt-8 max-w-6xl">
        <label className="relative block max-w-md">
          <span className="sr-only">Cari tool</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari tool..."
            className="w-full rounded-pill border border-line bg-white px-5 py-2.5 text-[15px] outline-none focus:border-accent"
          />
        </label>
      </div>

      {/* tab kategori */}
      {!query && (
        <div className="mx-auto mt-6 flex max-w-6xl flex-wrap gap-2">
          {toolkit.groups.map((g) => (
            <button
              key={g.label}
              type="button"
              onClick={() => setTab(g.label)}
              aria-pressed={tab === g.label}
              className={cn(
                'rounded-pill border px-4 py-1.5 text-[14px] font-medium transition-colors',
                tab === g.label
                  ? 'border-accent bg-accent text-white'
                  : 'border-line text-muted hover:border-accent hover:text-accent',
              )}
            >
              {g.label}
            </button>
          ))}
        </div>
      )}

      {/* grid tool */}
      <motion.div
        layout
        className="mx-auto mt-6 grid max-w-6xl grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"
      >
        <AnimatePresence mode="popLayout">
          {visibleItems.map((tool) => (
            <motion.div
              key={tool}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <ToolCard tool={tool} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {visibleItems.length === 0 && (
        <p className="mx-auto mt-8 max-w-6xl text-center text-muted">
          Tidak ada tool yang cocok.
        </p>
      )}

      <p className="mx-auto mt-6 max-w-6xl text-[13px] text-muted">
        Klik tool untuk melihat di proyek mana tool itu dipakai.
      </p>
    </div>
  );
}
