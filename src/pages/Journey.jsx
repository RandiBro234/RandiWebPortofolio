import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageHeader from '../components/PageHeader';
import { EntryFade } from '../components/EntryReveal';
import { ArrowIcon } from '../components/icons';
import { timeline, profile, pages } from '../data/content';
import { usePageMeta } from '../hooks';
import { cn } from '../utils';

function Entry({ item, index, open, onToggle }) {
  const left = index % 2 === 0;
  const isEdu = item.type === 'education';
  const isCurrent = item.type === 'current';

  return (
    <motion.li
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5 }}
      className={cn(
        'relative md:grid md:grid-cols-2 md:gap-8',
        isCurrent && 'md:grid-cols-1',
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          'absolute left-4 top-3 z-10 h-3.5 w-3.5 -translate-x-1/2 rounded-full ring-4 ring-paper md:left-1/2',
          isEdu ? 'bg-ink' : 'bg-accent',
          isCurrent && 'animate-pulse',
        )}
      />

      <div
        className={cn(
          'ml-9 md:ml-0',
          !isCurrent && (left ? 'md:col-start-1 md:pr-4 md:text-right' : 'md:col-start-2 md:pl-4'),
          isCurrent && 'md:ml-auto md:mr-auto md:max-w-xl md:text-center',
        )}
      >
        <div className="rounded-card border border-line bg-white p-4 shadow-sm">
          <button
            type="button"
            onClick={onToggle}
            aria-expanded={open}
            data-cursor="lihat"
            className={cn('w-full', !isCurrent && left && 'md:text-right', 'text-left')}
          >
            <div className={cn('flex items-center gap-2', !isCurrent && left ? 'md:justify-end' : '')}>
              <p className="text-[13px] font-semibold uppercase tracking-wide text-accent">
                {item.period}
              </p>
              {item.badge && (
                <span className="rounded-pill bg-ink px-2 py-0.5 text-[11px] font-semibold text-white">
                  {item.badge}
                </span>
              )}
            </div>
            <h2 className="mt-1 flex items-center gap-2 font-display text-[18px] font-extrabold md:inline-flex">
              {item.title}
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                className={cn('shrink-0 text-muted transition-transform', open && 'rotate-180')}
                aria-hidden="true"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </h2>
            <p className="mt-0.5 text-[14px] font-semibold text-ink">{item.subtitle}</p>
            <p className="mt-1.5 text-[13px] leading-[1.6] text-muted">{item.desc}</p>
          </button>

          {open && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="overflow-hidden"
            >
              <p className="mt-3 border-t border-line pt-3 text-[14px] leading-[1.65] text-ink">
                {item.detail}
              </p>
              {item.projectSlug && (
                <Link
                  to={`/proyek/${item.projectSlug}`}
                  data-cursor="buka"
                  className="mt-3 inline-flex items-center gap-1.5 rounded-pill bg-ink px-3.5 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-accent"
                >
                  Lihat proyek
                  <ArrowIcon size={14} />
                </Link>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </motion.li>
  );
}

export default function Journey() {
  usePageMeta(pages.journey.title, pages.journey.description);
  const containerRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [openIndex, setOpenIndex] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight * 0.5;
      const scrolled = Math.min(Math.max(window.innerHeight * 0.4 - rect.top, 0), Math.max(total, 1));
      setProgress(total > 0 ? scrolled / total : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="section px-5 pt-28 md:px-8 md:pt-32">
      <PageHeader
        eyebrow={timeline.eyebrow}
        title="Journey"
        subtitle={timeline.subtitle}
      />

      <EntryFade delay={0.1}>
      <div ref={containerRef} className="relative mx-auto mt-10 max-w-4xl">
        <div aria-hidden="true" className="absolute left-4 top-0 h-full w-[2px] bg-line md:left-1/2 md:-translate-x-1/2">
          <div className="w-full bg-accent transition-[height] duration-150 ease-out" style={{ height: `${progress * 100}%` }} />
        </div>
        <ol className="space-y-6">
          {timeline.items.map((item, i) => (
            <Entry
              key={`${item.title}-${i}`}
              item={item}
              index={i}
              open={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
            />
          ))}
        </ol>
      </div>
      </EntryFade>

      <div className="mx-auto mt-10 flex max-w-4xl justify-center">
        <a
          href={profile.cvUrl}
          download={profile.cvDownloadName}
          data-cursor="unduh"
          className="inline-flex items-center gap-2 rounded-pill bg-accent px-6 py-3 text-[15px] font-semibold text-white transition-all hover:-translate-y-px hover:bg-[#e63f16]"
        >
          Unduh CV
          <ArrowIcon size={16} />
        </a>
      </div>
    </div>
  );
}
