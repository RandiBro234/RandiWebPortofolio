import { useEffect, useRef, useState } from 'react';
import { journey } from '../data/content';
import SectionHeading from '../components/SectionHeading';
import Reveal from '../components/Reveal';
import ExampleCards from '../components/ExampleCards';
import { cn, scrollToId } from '../utils';
import { visuals } from '../components/JourneyVisuals';

function StageVisual({ visual }) {
  const Visual = visuals[visual];
  return (
    <div className="relative overflow-hidden rounded-card border border-line bg-white p-4">
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
        <ExampleCards label={stage.exampleLabel} items={stage.examples} />
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
  const progressRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Bar progres: tulis transform lewat ref (tanpa setState per frame).
  useEffect(() => {
    let raf = 0;
    const update = () => {
      const el = containerRef.current;
      const bar = progressRef.current;
      if (!el || !bar) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const scrolled = Math.min(Math.max(-rect.top, 0), Math.max(total, 1));
      const p = total > 0 ? scrolled / total : 0;
      bar.style.transform = `scaleY(${p})`;
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
  }, []);

  // Tahap aktif: IntersectionObserver, setState hanya saat indeks berubah.
  useEffect(() => {
    const nodes = journey.stages
      .map((s, i) => ({ i, node: document.getElementById(`alur-${s.key}`) }))
      .filter((x) => x.node);
    if (!nodes.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const vis = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (!vis) return;
        const idx = nodes.find((n) => n.node === vis.target)?.i ?? 0;
        setActiveIndex((prev) => (prev === idx ? prev : idx));
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: 0 },
    );
    nodes.forEach((n) => observer.observe(n.node));
    return () => observer.disconnect();
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
              ref={progressRef}
              className="h-full w-full origin-top rounded-pill bg-accent will-change-transform"
              style={{ transform: 'scaleY(0)' }}
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
