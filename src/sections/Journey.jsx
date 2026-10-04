import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { journey } from '../data/content';
import SectionHeading from '../components/SectionHeading';
import Reveal from '../components/Reveal';
import { cn, scrollToId } from '../utils';
import { visuals } from '../components/JourneyVisuals';

function IllustrationLabel() {
  return (
    <span className="absolute right-3 top-3 rounded-pill bg-ink/80 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-white">
      Ilustrasi
    </span>
  );
}

function StageVisual({ visual }) {
  const Visual = visuals[visual];
  return (
    <div className="relative overflow-hidden rounded-card border border-line bg-white p-4">
      <IllustrationLabel />
      <div className="mx-auto h-[220px] w-full max-w-md lg:h-[340px] lg:max-w-none">
        <Visual />
      </div>
    </div>
  );
}

function Stage({ stage, index, active }) {
  return (
    <div
      id={`alur-${stage.key}`}
      data-stage={index}
      className="grid items-center gap-6 border-t border-line py-8 first:border-t-0 lg:min-h-[62vh] lg:grid-cols-2 lg:gap-12 lg:py-10"
    >
      <div
        className="lg:sticky"
        style={{ top: 'calc(var(--nav-h) + 24px)' }}
      >
        <div className="flex items-center gap-3">
          <span
            className={cn(
              'grid h-9 w-9 shrink-0 place-items-center rounded-full font-display text-sm font-extrabold',
              active ? 'bg-accent text-white' : 'bg-ink text-white',
            )}
          >
            {stage.no}
          </span>
          <span className="h-px flex-1 bg-line" />
        </div>
        <h3 className="section-h3 mt-4 text-2xl">
          {stage.title}
        </h3>
        <p className="mt-3 max-w-md text-[15px] leading-[1.65] text-muted">
          {stage.narrative}
        </p>
        {stage.linkSlug ? (
          <Link
            to={`/proyek/${stage.linkSlug}`}
            data-cursor="Lihat"
            className="mt-3 inline-flex items-center gap-1.5 rounded-pill border border-line px-3 py-1.5 text-[13px] font-medium text-ink transition-colors hover:border-accent hover:text-accent"
          >
            {stage.project}
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M7 17 17 7" />
              <path d="M8 7h9v9" />
            </svg>
          </Link>
        ) : (
          <p className="mt-3 inline-flex rounded-pill border border-line px-3 py-1.5 text-[13px] font-medium text-ink">
            {stage.project}
          </p>
        )}
      </div>
      <Reveal delay={80}>
        <StageVisual visual={stage.visual} />
      </Reveal>
    </div>
  );
}

function StepNav({ activeIndex }) {
  return (
    <div className="mt-8 flex flex-wrap items-center gap-2">
      <span className="mr-1 text-xs font-semibold uppercase tracking-wider text-muted">
        Tahap
      </span>
      {journey.stages.map((s, i) => (
        <button
          key={s.key}
          type="button"
          onClick={() => scrollToId(`alur-${s.key}`)}
          aria-label={`Ke tahap ${s.no}: ${s.title}`}
          aria-current={activeIndex === i ? 'step' : undefined}
          className={cn(
            'grid h-7 w-7 place-items-center rounded-full border text-[11px] font-semibold transition-colors',
            activeIndex === i
              ? 'border-accent bg-accent text-white'
              : 'border-line text-muted hover:border-accent hover:text-accent',
          )}
        >
          {s.no}
        </button>
      ))}
    </div>
  );
}

export default function Journey() {
  const containerRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const scrolled = Math.min(Math.max(-rect.top, 0), Math.max(total, 1));
      setProgress(total > 0 ? scrolled / total : 0);

      const marker = window.innerHeight * 0.4;
      let idx = 0;
      journey.stages.forEach((s, i) => {
        const node = document.getElementById(`alur-${s.key}`);
        if (node && node.getBoundingClientRect().top <= marker) idx = i;
      });
      setActiveIndex(idx);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <section id="alur" className="section relative bg-paper px-5 md:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow={journey.eyebrow}
          title={journey.title}
          titleAccent={journey.titleAccent}
          subtitle={journey.subtitle}
        />

        <StepNav activeIndex={activeIndex} />

        <div ref={containerRef} className="relative mt-10">
          <div
            aria-hidden="true"
            className="absolute left-[17px] top-0 hidden h-full w-[3px] rounded-pill bg-line lg:block"
          >
            <div
              className="w-full rounded-pill bg-accent transition-[height] duration-150 ease-out"
              style={{ height: `${progress * 100}%` }}
            />
          </div>
          <div className="lg:pl-20">
            {journey.stages.map((stage, i) => (
              <Stage key={stage.key} stage={stage} index={i} active={activeIndex === i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
