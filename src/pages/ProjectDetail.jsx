import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowIcon, ArrowRight } from '../components/icons';
import { EntryTitle, EntryFade } from '../components/EntryReveal';
import { projects, pages } from '../data/content';
import { usePageMeta } from '../hooks';
import { cn } from '../utils';

const storyOrder = [
  { key: 'pertanyaan', label: 'Pertanyaan' },
  { key: 'data', label: 'Data' },
  { key: 'pendekatan', label: 'Pendekatan' },
  { key: 'hasil', label: 'Hasil' },
  { key: 'dampak', label: 'Dampak' },
];

const isPlaceholder = (v) =>
  typeof v === 'string' && (v.startsWith('[ISI:') || v.includes('[ISI:'));

function PlaceholderChip() {
  return (
    <span className="inline-flex rounded-pill border border-line bg-paper px-4 py-1 text-[14px] font-medium italic text-muted">
      Segera diisi
    </span>
  );
}

export default function ProjectDetail() {
  const { slug } = useParams();
  const project = useMemo(() => projects.find((p) => p.slug === slug), [slug]);
  const [activeKey, setActiveKey] = useState('pertanyaan');
  const barRef = useRef(null);
  const articleRef = useRef(null);

  const meta = project
    ? { title: `${project.name} — Studi Kasus`, description: project.summary }
    : { title: pages.notFound.title, description: pages.notFound.description };
  usePageMeta(meta.title, meta.description);

  // Progres baca: tulis transform lewat ref (tanpa setState per frame).
  useEffect(() => {
    let raf = 0;
    const update = () => {
      const el = articleRef.current;
      const bar = barRef.current;
      if (!el || !bar) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height;
      const read = Math.min(Math.max(-rect.top, 0), total);
      bar.style.transform = `scaleX(${total > 0 ? read / total : 0})`;
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(raf);
    };
  }, [slug]);

  // Bagian aktif: IntersectionObserver.
  useEffect(() => {
    const nodes = storyOrder
      .map(({ key }) => ({ key, node: document.getElementById(`story-${key}`) }))
      .filter((x) => x.node);
    if (!nodes.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const vis = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (!vis) return;
        const key = nodes.find((n) => n.node === vis.target)?.key;
        if (key) setActiveKey((prev) => (prev === key ? prev : key));
      },
      { rootMargin: '-35% 0px -60% 0px', threshold: 0 },
    );
    nodes.forEach((n) => observer.observe(n.node));
    return () => observer.disconnect();
  }, [slug]);

  if (!project) return <Navigate to="/proyek-tidak-ditemukan" replace />;

  const currentIndex = projects.findIndex((p) => p.slug === slug);
  const next = projects[(currentIndex + 1) % projects.length];

  return (
    <div className="relative pt-28 md:pt-32">
      {/* bar progres baca */}
      <div aria-hidden="true" className="fixed inset-x-0 top-0 z-[125] h-[3px] bg-transparent">
        <div ref={barRef} className="h-full origin-left bg-accent will-change-transform" style={{ transform: 'scaleX(0)' }} />
      </div>

      <div className="mx-auto max-w-6xl px-5 pb-16 md:px-8 md:pb-24">
        <motion.header
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Link to="/proyek" className="inline-flex items-center gap-1.5 text-[13px] font-medium text-muted hover:text-accent">
            <ArrowRight size={14} className="rotate-180" />
            Semua proyek
          </Link>
          <p className="mt-4 text-[12px] font-semibold uppercase tracking-wider text-muted">
            {project.categories.join(' · ')} · {project.period}
          </p>
          <EntryTitle>
            <h1 className="section-h2 mt-2">{project.name}</h1>
          </EntryTitle>
          <p className="mt-2 text-[15px] font-semibold text-accent">{project.role}</p>
          <p className="section-sub mt-4 text-muted">{project.summary}</p>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="buka"
                className="rounded-pill bg-ink px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-accent"
              >
                Kode di GitHub
              </a>
            )}
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="buka"
                className="rounded-pill border border-line px-4 py-2 text-[13px] font-semibold text-ink transition-colors hover:border-accent hover:text-accent"
              >
                Lihat Demo
              </a>
            )}
          </div>
        </motion.header>

        <EntryFade delay={0.1}>
        <div className="mt-12 grid gap-10 lg:grid-cols-[200px_1fr] lg:gap-14">
          {/* nav kiri sticky */}
          <nav aria-label="Bagian studi kasus" className="hidden lg:block">
            <ul className="sticky flex flex-col gap-1" style={{ top: 'calc(var(--nav-h) + 24px)' }}>
              {storyOrder.map(({ key, label }) => (
                <li key={key}>
                  <a
                    href={`#story-${key}`}
                    className={cn(
                      'flex items-center gap-2 rounded-pill px-3 py-2 text-[14px] font-medium transition-colors',
                      activeKey === key ? 'bg-accent text-white' : 'text-muted hover:text-ink',
                    )}
                  >
                    <span className={cn('h-1.5 w-1.5 rounded-full', activeKey === key ? 'bg-white' : 'bg-line')} />
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* artikel */}
          <article ref={articleRef} className="min-w-0">
            {storyOrder.map(({ key, label }) => {
              const value = project.story[key];
              const missing =
                key === 'data'
                  ? isPlaceholder(value)
                  : isPlaceholder(value) && value.startsWith('[ISI:');
              return (
                <section
                  key={key}
                  id={`story-${key}`}
                  className="scroll-mt-28 border-t border-line py-8 first:border-t-0 first:pt-0"
                >
                  <h2 className="text-[12px] font-semibold uppercase tracking-wider text-accent">
                    {label}
                  </h2>
                  <div className="mt-3">
                    {missing ? (
                      <PlaceholderChip />
                    ) : (
                      <p className="text-[16px] leading-[1.7] text-ink">{value}</p>
                    )}
                  </div>
                </section>
              );
            })}

            <div className="mt-8 border-t border-line pt-6">
              <p className="text-[12px] font-semibold uppercase tracking-wider text-muted">Tools</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {project.tools.map((t) => (
                  <span key={t} className="rounded-pill border border-line px-2.5 py-1 text-[13px] text-ink">
                    {isPlaceholder(t) ? 'Segera diisi' : t}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-12 border-t border-line pt-8">
              <p className="text-[13px] text-muted">Projek berikutnya</p>
              <Link
                to={`/proyek/${next.slug}`}
                data-cursor="buka"
                className="mt-2 inline-flex items-center gap-2 font-display text-2xl font-extrabold text-ink transition-colors hover:text-accent"
              >
                {next.name}
                <ArrowIcon size={22} />
              </Link>
            </div>
          </article>
        </div>
        </EntryFade>
      </div>
    </div>
  );
}
