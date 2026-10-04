import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import PageHeader from '../components/PageHeader';
import { ArrowIcon } from '../components/icons';
import { projects, projectsSection, pages } from '../data/content';
import { usePageMeta, useReducedMotion } from '../hooks';
import { cn } from '../utils';

const filters = ['Semua', 'Machine Learning', 'Sistem Rekomendasi', 'NLP', 'Deployment', 'Monitoring'];

const isPlaceholder = (v) => typeof v === 'string' && v.startsWith('[ISI:');

function PlaceholderChip() {
  return (
    <span className="inline-flex rounded-pill border border-line bg-paper px-6 py-1.5 text-[13px] font-medium italic text-muted">
      Segera diisi
    </span>
  );
}

function ValueText({ value, className }) {
  if (isPlaceholder(value)) {
    return (
      <div className="flex items-center">
        <PlaceholderChip />
      </div>
    );
  }
  return <p className={className}>{value}</p>;
}

function ToolTag({ children }) {
  return (
    <span className="rounded-pill border border-line bg-white px-2.5 py-0.5 text-[12px] font-medium text-ink">
      {children}
    </span>
  );
}

// Preview bergaya CSS/SVG, tema berbeda tipis per proyek.
function ProjectPreview({ project, compact = false }) {
  const theme = {
    faultsense: 'from-accent-soft to-white',
    meddistrib: 'from-ink/5 to-white',
    'australia-rain-prediction': 'from-accent/10 to-white',
    jobifyai: 'from-ink/5 to-white',
    airwise: 'from-accent-soft to-white',
  }[project.id] || 'from-paper to-white';

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-card border border-line bg-gradient-to-br',
        theme,
        compact ? 'h-[140px]' : 'h-[180px]',
      )}
      aria-hidden="true"
    >
      <svg viewBox="0 0 320 160" className="h-full w-full" preserveAspectRatio="none">
        <circle cx="250" cy="30" r="46" fill="#FF4B1F" opacity="0.14" />
        <rect x="24" y="30" width="120" height="10" rx="5" fill="#111" opacity="0.14" />
        {project.id === 'meddistrib' &&
          [0, 1, 2, 3, 4].map((i) => (
            <rect key={i} x={24 + i * 54} y={150 - (24 + i * 12)} width="34" height={24 + i * 12} rx="6" fill={i === 4 ? '#FF4B1F' : '#111'} opacity={i === 4 ? 1 : 0.14} />
          ))}
        {project.id !== 'meddistrib' && (
          <>
            <polyline points="24,120 90,90 150,104 214,60 290,40" fill="none" stroke="#FF4B1F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            {[[24,120],[90,90],[150,104],[214,60],[290,40]].map(([x,y],i)=>(
              <circle key={i} cx={x} cy={y} r="4" fill="#FF4B1F" />
            ))}
          </>
        )}
      </svg>

      {project.demoUrl && (
        <a
          href={project.demoUrl}
          target="_blank"
          rel="noopener noreferrer"
          data-cursor="buka"
          className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-pill bg-ink px-3 py-1.5 text-[12px] font-semibold text-white transition-colors hover:bg-accent"
        >
          Lihat Demo
          <ArrowIcon size={12} />
        </a>
      )}
    </div>
  );
}

function DetailPanel({ project, compact = false }) {
  const reduced = useReducedMotion();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={project.id}
        role="region"
        aria-label={`Detail ${project.name}`}
        initial={reduced ? { opacity: 0 } : { opacity: 0, x: 16 }}
        animate={{ opacity: 1, x: 0 }}
        exit={reduced ? { opacity: 0 } : { opacity: 0, x: -16 }}
        transition={{ duration: reduced ? 0.12 : 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="rounded-card border border-line bg-white p-6 transition-all duration-[250ms] ease-out hover:-translate-y-1 hover:border-accent/40 hover:shadow-xl md:p-8"
      >
        <ProjectPreview project={project} compact={compact} />

        <h2 className="mt-5 font-display text-2xl font-extrabold">{project.name}</h2>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          {project.categories.map((c) => (
            <span key={c} className="rounded-pill bg-accent-soft px-2.5 py-0.5 text-[12px] font-medium text-accent">
              {c}
            </span>
          ))}
        </div>
        <p className="mt-2 text-[13px] font-medium text-muted">
          {project.role} · {project.period}
        </p>
        <p className="mt-4 text-[15px] leading-[1.65] text-ink">{project.summary}</p>

        <div className="mt-5">
          <p className="text-[12px] font-semibold uppercase tracking-wider text-muted">Pertanyaan</p>
          <ValueText value={project.question} className="mt-1 text-[15px] leading-[1.65] text-ink" />
        </div>

        <div className="mt-5">
          <p className="text-[12px] font-semibold uppercase tracking-wider text-muted">Pendekatan</p>
          <ol className="mt-2 flex flex-col gap-1.5">
            {project.approach.map((step, i) => (
              <li key={i} className="flex gap-2.5 text-[14px] leading-[1.6] text-ink">
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-ink text-[11px] font-bold text-white">
                  {i + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-5">
          <p className="text-[12px] font-semibold uppercase tracking-wider text-muted">Hasil</p>
          <div className="mt-2">
            {isPlaceholder(project.result) ? (
              <PlaceholderChip />
            ) : (
              <span className="inline-flex rounded-pill bg-accent px-4 py-1.5 text-[14px] font-bold text-white">
                {project.result}
              </span>
            )}
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-1.5">
          {project.tools.map((t) => (
            <ToolTag key={t}>{t}</ToolTag>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          <Link
            to={`/proyek/${project.slug}`}
            data-cursor="baca"
            className="group inline-flex items-center gap-2 rounded-pill bg-accent px-4 py-2.5 text-[14px] font-semibold text-white transition-all hover:-translate-y-px hover:bg-[#e63f16]"
          >
            Baca Studi Kasus
            <ArrowIcon size={15} className="dock-arrow" />
          </Link>
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="buka"
              className="rounded-pill border border-line px-4 py-2.5 text-[14px] font-semibold text-ink transition-colors hover:border-accent hover:text-accent"
            >
              GitHub
            </a>
          )}
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="buka"
              className="rounded-pill border border-line px-4 py-2.5 text-[14px] font-semibold text-ink transition-colors hover:border-accent hover:text-accent"
            >
              Lihat Demo
            </a>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function Projects() {
  usePageMeta(pages.projects.title, pages.projects.description);
  const [searchParams, setSearchParams] = useSearchParams();
  const [filter, setFilter] = useState('Semua');
  const listRef = useRef(null);

  const list = useMemo(
    () => (filter === 'Semua' ? projects : projects.filter((p) => p.categories.includes(filter))),
    [filter],
  );

  const urlSlug = searchParams.get('p');
  const [selected, setSelected] = useState(urlSlug || projects[0].slug);

  // Jika proyek terpilih tidak lolos filter, pilih proyek pertama yang lolos.
  useEffect(() => {
    if (list.length === 0) return;
    if (!list.some((p) => p.slug === selected)) {
      setSelected(list[0].slug);
    }
  }, [list, selected]);

  // Sinkronkan URL query (?p=slug).
  useEffect(() => {
    const current = searchParams.get('p');
    if (current !== selected) {
      const next = new URLSearchParams(searchParams);
      next.set('p', selected);
      setSearchParams(next, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  const select = useCallback((slug) => setSelected(slug), []);

  // Keyboard: panah atas/bawah pindah pilihan.
  useEffect(() => {
    const onKey = (e) => {
      if (!listRef.current?.contains(document.activeElement)) return;
      const idx = list.findIndex((p) => p.slug === selected);
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        select(list[Math.min(idx + 1, list.length - 1)]?.slug);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        select(list[Math.max(idx - 1, 0)]?.slug);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [list, selected, select]);

  const activeProject = projects.find((p) => p.slug === selected) || list[0];

  return (
    <div className="section px-5 pt-28 md:px-8 md:pt-32">
      <PageHeader
        eyebrow={projectsSection.eyebrow}
        title="Projek"
        titleAccent=""
        subtitle={projectsSection.subtitle}
      />

      {/* filter */}
      <div className="mx-auto mt-8 flex max-w-6xl flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            aria-pressed={filter === f}
            className={cn(
              'rounded-pill border px-4 py-1.5 text-[14px] font-medium transition-colors',
              filter === f
                ? 'border-accent bg-accent text-white'
                : 'border-line text-muted hover:border-accent hover:text-accent',
            )}
          >
            {f}
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <p className="mx-auto mt-16 max-w-6xl text-center text-muted">
          Belum ada proyek di kategori ini.
        </p>
      ) : (
        <div className="mx-auto mt-8 grid max-w-6xl gap-8 lg:grid-cols-[minmax(0,0.4fr)_minmax(0,0.6fr)]">
          {/* daftar kiri */}
          <div ref={listRef} className="lg:sticky lg:self-start" style={{ top: 'calc(var(--nav-h) + 24px)' }}>
            <ul role="listbox" aria-label="Daftar proyek" className="flex flex-col">
              {list.map((p, i) => {
                const active = p.slug === selected;
                return (
                  <li key={p.slug}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={active}
                      aria-controls="project-panel"
                      onClick={() => select(p.slug)}
                      data-cursor="lihat"
                      className={cn(
                        'group flex w-full items-center gap-3 border-b border-line py-3.5 text-left transition-transform lg:py-4',
                        active ? 'translate-x-0' : 'text-muted hover:translate-x-1.5',
                      )}
                    >
                      <span className="text-[12px] font-semibold tabular-nums text-muted">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className={cn('block truncate font-display text-[22px] font-extrabold lg:text-[26px]', active ? 'text-ink' : 'text-muted')}>
                          {p.name}
                        </span>
                        <span className="mt-0.5 block truncate text-[12px] text-muted">
                          {p.role} · {p.period}
                        </span>
                      </span>
                      {active && (
                        <motion.span
                          layoutId="project-active-bar"
                          className="h-8 w-1 shrink-0 rounded-pill bg-accent"
                          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                        />
                      )}
                      <ArrowIcon size={18} className={cn('shrink-0', active ? 'text-accent' : 'text-muted')} />
                    </button>
                  </li>
                );
              })}
            </ul>
            <p className="mt-4 hidden text-[12px] text-muted lg:block">Gunakan ↑ ↓ lalu Enter untuk membuka.</p>
            <p className="mt-3 text-[12px] text-muted lg:hidden">Ketuk proyek untuk melihat detail.</p>
          </div>

          {/* panel kanan (desktop) */}
          <div id="project-panel" className="hidden lg:block lg:sticky lg:self-start" style={{ top: 'calc(var(--nav-h) + 24px)' }}>
            {activeProject && <DetailPanel project={activeProject} />}
          </div>

          {/* accordion (mobile) */}
          <div className="lg:hidden">
            {list.map((p) => {
              const open = p.slug === selected;
              return (
                <div key={p.slug} id={`acc-${p.slug}`} className="border-b border-line">
                  <button
                    type="button"
                    aria-expanded={open}
                    aria-controls={`accpanel-${p.slug}`}
                    onClick={() => select(open ? '' : p.slug)}
                    className="flex min-h-[56px] w-full items-center justify-between gap-3 py-3 text-left"
                  >
                    <span>
                      <span className="font-display text-[18px] font-extrabold text-ink">{p.name}</span>
                      <span className="mt-0.5 block text-[12px] text-muted">{p.role} · {p.period}</span>
                    </span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" className={cn('shrink-0 text-muted transition-transform', open && 'rotate-180')} aria-hidden="true">
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </button>
                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div
                        id={`accpanel-${p.slug}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="pb-4">
                          <DetailPanel project={p} compact />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
