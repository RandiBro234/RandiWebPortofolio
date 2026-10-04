import { useEffect, useRef, useState } from 'react';
import { identity } from '../data/content';
import { useReducedMotion } from '../hooks';
import NeuralNetVisual from './NeuralNetVisual';
import { cn } from '../utils';

function MapPin({ className }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function Value({ row }) {
  if (row.type === 'name') {
    return (
      <span className="font-display text-lg font-semibold tracking-tight text-white md:text-xl">
        {row.value}
      </span>
    );
  }
  if (row.type === 'study') {
    return (
      <span className="flex flex-col gap-1">
        <span className="font-display text-lg text-white md:text-xl">{row.value}</span>
        <span className="text-sm text-neutral-400 md:text-base">{row.sub}</span>
      </span>
    );
  }
  if (row.type === 'location') {
    return (
      <span className="flex items-center gap-2 font-display text-lg text-white md:text-xl">
        <MapPin className="text-accent" />
        {row.value}
      </span>
    );
  }
  return (
    <span className="flex flex-wrap gap-2">
      {row.roles.map((role, i) => (
        <span
          key={role}
          className="inline-flex items-center gap-2 rounded-full border border-accent/50 bg-accent/10 px-3.5 py-1.5 font-mono text-sm text-white transition-colors duration-200 hover:bg-accent/20"
        >
          {i === 0 && <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />}
          {role}
        </span>
      ))}
    </span>
  );
}

export default function IdentityCard() {
  const reduced = useReducedMotion();
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const [canHover, setCanHover] = useState(false);

  useEffect(() => {
    const canHoverMq = window.matchMedia('(hover: hover) and (pointer: fine)');
    setCanHover(canHoverMq.matches);
  }, []);

  useEffect(() => {
    if (reduced) {
      setVisible(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [reduced]);

  return (
    <section className="bg-paper px-5 py-14 md:px-8 md:py-20">
      <div className="mx-auto max-w-6xl">
        <p className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted">
          <span className="h-2 w-2 rounded-full bg-accent" aria-hidden="true" />
          {identity.eyebrow}
        </p>

        <div
          ref={ref}
          className={cn(
            'relative overflow-hidden rounded-3xl border border-white/10 bg-ink-dark shadow-[0_24px_60px_rgba(0,0,0,0.18)] transition-all duration-[250ms]',
            canHover && 'hover:-translate-y-1 hover:border-accent/30',
          )}
        >
          {/* pola titik halus */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.06) 1px, transparent 0)',
              backgroundSize: '20px 20px',
            }}
          />
          {/* glow oranye pojok kanan atas */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(255,75,31,0.12) 0%, rgba(255,75,31,0) 70%)',
              filter: 'blur(40px)',
              animation: reduced ? 'none' : 'glow-pulse 4s ease-in-out infinite',
            }}
          />

          {/* header bar */}
          <div className="relative flex h-11 items-center gap-3 border-b border-white/10 px-5">
            <span className="flex gap-1.5" aria-hidden="true">
              <span className="h-2.5 w-2.5 rounded-full bg-neutral-600" />
              <span className="h-2.5 w-2.5 rounded-full bg-neutral-600" />
              <span className="h-2.5 w-2.5 rounded-full bg-neutral-600" />
            </span>
            <span className="font-mono text-xs text-neutral-400">{identity.filename}</span>
          </div>

          {/* body: 2 kolom di md ke atas */}
          <div className="relative grid md:grid-cols-[1.25fr_1fr]">
            {/* kiri: daftar key-value */}
            <dl className="flex flex-col justify-center px-5 py-6 md:px-7">
              {identity.rows.map((row, i) => (
                <div
                  key={row.key}
                  className={cn(
                    'flex flex-col gap-1 py-3 transition-all duration-500 ease-out md:grid md:grid-cols-[32px_120px_1fr] md:items-baseline md:gap-4',
                    i < identity.rows.length - 1 && 'border-b border-white/10',
                    visible ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0',
                  )}
                  style={{ transitionDelay: reduced ? '0ms' : `${i * 120}ms` }}
                >
                  <span className="hidden font-mono text-xs text-neutral-600 md:block" aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <dt className="font-mono text-sm text-accent md:text-base">{row.key}</dt>
                  <dd className="min-w-0">
                    <Value row={row} />
                  </dd>
                </div>
              ))}
            </dl>

            {/* kanan: panel visual */}
            <div className="relative border-t border-white/10 bg-[#1A1A1A] px-6 py-6 md:border-l md:border-t-0">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{
                  backgroundImage:
                    'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.06) 1px, transparent 0)',
                  backgroundSize: '20px 20px',
                }}
              />
              <div className="relative min-h-[260px] md:h-full">
                <NeuralNetVisual layers={[3, 5, 5, 2]} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
