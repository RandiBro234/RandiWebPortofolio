import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { hero, profile, rotatingPhrases } from '../data/content';
import { ArrowIcon, ArrowRight, QuoteIcon } from '../components/icons';
import Counter from '../components/Counter';
import Typewriter from '../components/Typewriter';
import Pill from '../components/Pill';
import Magnetic from '../components/Magnetic';
import { useReducedMotion } from '../hooks';

// Chip data menimpa tepi arch, tetap di dalam container.
const heroChips = [
  { text: 'F1 80%', pos: 'top-[24%] left-0', style: { marginLeft: '-26%' }, depth: 16, delay: '0s' },
  { text: 'df.head()', pos: 'top-[50%] right-0', style: { marginRight: '-18%' }, depth: 22, delay: '1.1s' },
  { text: 'SELECT *', pos: 'bottom-[18%] left-0', style: { marginLeft: '-20%' }, depth: 28, delay: '2.2s' },
];

function HandUnderline() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 240 24"
      preserveAspectRatio="none"
      className="hero-underline pointer-events-none absolute -bottom-[0.12em] left-0 h-[0.3em] w-full text-accent"
    >
      <path d="M4 15c46-6 118-9 232-6" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
      <path d="M12 20c40-4 108-6 208-3" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity="0.55" />
    </svg>
  );
}

function Spark({ className, size = 22 }) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 1c.6 4.7 2.3 7.4 3.4 8.6C16.6 10.7 19.3 11.4 23 12c-3.7.6-6.4 1.3-7.6 2.4C14.3 15.6 12.6 18.3 12 23c-.6-4.7-2.3-7.4-3.4-8.6C7.4 13.3 4.7 12.6 1 12c3.7-.6 6.4-1.3 7.6-2.4C9.7 8.4 11.4 5.7 12 1z" />
    </svg>
  );
}

function Portrait({ parallax }) {
  return (
    <div className="relative mx-auto w-full max-w-[22rem]">
      <motion.div style={parallax.depth(8)} className="hero-arch-group relative mx-auto w-fit">
        <div
          aria-hidden="true"
          className="animate-spin-slow absolute left-1/2 top-1/2 -z-10 hidden h-[24rem] w-[24rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-ink/12 sm:block"
        />
        <div
          aria-hidden="true"
          className="hero-dots absolute -left-8 top-10 -z-10 hidden h-20 w-20 opacity-60 sm:block"
        />

        <div aria-hidden="true" className="hero-arch-frame -z-10" />

        <div className="hero-arch">
          <img
            src={profile.portrait}
            alt={`Foto ${profile.name}`}
            width="480"
            height="640"
            loading="eager"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.parentElement?.nextElementSibling?.removeAttribute('hidden');
            }}
          />
        </div>

        <div hidden className="hero-arch grid place-items-center bg-ink/5 text-center text-sm font-medium text-muted">
          Taruh potret di
          <br />
          <code className="text-accent">/assets/randi-cutout.png</code>
        </div>

        <span
          aria-hidden="true"
          className="absolute -right-4 -top-4 z-20 grid h-11 w-11 place-items-center rounded-full bg-accent text-white shadow-md"
        >
          <Spark size={20} />
        </span>
      </motion.div>
    </div>
  );
}

function FloatingChips({ parallax }) {
  const reduced = useReducedMotion();
  if (reduced) return null;
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-30 hidden sm:block">
      {heroChips.map((chip) => (
        <motion.span
          key={chip.text}
          style={{ ...chip.style, ...parallax.depth(chip.depth) }}
          className={`absolute ${chip.pos}`}
        >
          <span
            className="hero-chip-float block whitespace-nowrap rounded-pill border border-line bg-white/90 px-3 py-1 font-mono text-[11px] font-medium text-ink shadow-md backdrop-blur"
            style={{ animationDelay: chip.delay }}
          >
            {chip.text}
          </span>
        </motion.span>
      ))}
    </div>
  );
}

function useParallax(strength = 1) {
  const reduced = useReducedMotion();
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (reduced) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;
    let raf;
    const onMove = (e) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        setOffset({
          x: e.clientX / window.innerWidth - 0.5,
          y: e.clientY / window.innerHeight - 0.5,
        });
      });
    };
    window.addEventListener('mousemove', onMove);
    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, [reduced]);

  return { x: offset.x * strength, y: offset.y * strength };
}

export default function Hero() {
  const [statProjects, statF1] = hero.stats;
  const mouse = useParallax();
  const navigate = useNavigate();
  const reduced = useReducedMotion();

  const parallax = {
    depth: (px) => ({
      transform: `translate3d(${mouse.x * px}px, ${mouse.y * px}px, 0)`,
      transition: 'transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
    }),
  };

  return (
    <section
      id="beranda"
      className="relative flex min-h-[100vh] flex-col justify-center overflow-x-clip bg-paper pb-6"
      style={{ minHeight: '100svh', paddingTop: 'var(--nav-h)' }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.45]"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(17,17,17,0.14) 1px, transparent 0)',
          backgroundSize: '28px 28px',
        }}
      />

      <div className="relative mx-auto w-full max-w-7xl px-6 md:px-10">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-10">
          {/* Kolom kiri */}
          <div className="relative z-30 min-w-0">
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-pill border border-ink/15 px-4 py-1.5 text-sm font-semibold"
            >
              {hero.badge}
              <svg width="26" height="14" viewBox="0 0 26 14" fill="none" aria-hidden="true">
                <path d="M1 8c5-6 12-7 24-6M21 1l4 1-2 4" stroke="#FF4B1F" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.span>

            <h1 className="hero-heading mt-4 text-left text-ink">
              <span className="hero-word" style={{ animationDelay: '0.6s' }}>{hero.headingLead}</span>{' '}
              <span className="hero-word relative inline-block text-accent" style={{ animationDelay: '0.72s' }}>
                {hero.headingName}
                <HandUnderline />
              </span>
              <br />
              <span className="hero-word" style={{ animationDelay: '0.84s' }}>Data</span>{' '}
              <span className="hero-word relative inline-block" style={{ animationDelay: '0.96s' }}>
                Scientist
                <HandUnderline />
              </span>
            </h1>

            <p className="mt-4 min-h-[2.4em] max-w-xl text-base font-medium text-muted sm:text-lg">
              <Typewriter phrases={rotatingPhrases} />
            </p>

            {/* Tombol di kolom kiri */}
            <div className="relative mt-6 flex flex-wrap items-center gap-3">
              <div className="relative">
                <Magnetic>
                  <Pill as="button" type="button" variant="solid" data-cursor="Buka" onClick={() => navigate('/proyek')}>
                    {hero.ctaPrimary}
                    <ArrowIcon size={16} />
                  </Pill>
                </Magnetic>
                <svg
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-4 -top-8 hidden text-accent sm:block"
                  width="56"
                  height="38"
                  viewBox="0 0 60 40"
                  fill="none"
                >
                  <path d="M58 36C46 34 30 30 14 10M14 10l-2 12M14 10l11 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <Pill as="button" type="button" variant="outline" data-cursor="Buka" onClick={() => navigate('/kontak')}>
                {hero.ctaSecondary}
                <ArrowRight size={16} />
              </Pill>
            </div>

            {/* Kartu kutipan + statistik 3, ringkas */}
            <div className="mt-6 flex flex-wrap items-stretch gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.05, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                style={{ transform: 'rotate(-1.5deg)' }}
                className="max-w-[23.75rem] flex-1 rounded-card border border-line bg-white p-5 shadow-lg shadow-ink/5"
              >
                <QuoteIcon className="text-accent" size={22} />
                <p className="mt-2 text-sm font-medium leading-relaxed text-ink">
                  “{hero.quote}”
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="flex shrink-0 flex-col justify-center rounded-card border border-line bg-white px-5 py-4 shadow-sm"
              >
                <span className="font-display text-3xl text-ink">
                  <Counter value={statProjects.value} />
                </span>
                <span className="mt-1 max-w-[7rem] text-xs font-medium leading-snug text-muted">
                  {statProjects.label}
                </span>
              </motion.div>
            </div>
          </div>

          {/* Kolom kanan: foto */}
          <div className="relative z-10 min-w-0">
            <div className="relative mx-auto w-full max-w-[22rem]">
              <Portrait parallax={parallax} />
              <FloatingChips parallax={parallax} />
            </div>

            {/* Kartu 80% menempel pojok kanan-bawah foto */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              style={{ transform: 'rotate(2deg)' }}
              className="relative z-30 mx-auto mt-4 w-52 rounded-card border border-line bg-white p-4 shadow-lg shadow-ink/5 lg:absolute lg:-bottom-2 lg:right-0 lg:mx-0 lg:mt-0"
            >
              <span className="font-display text-3xl text-ink">
                <Counter value={statF1.value} suffix={statF1.suffix} />
              </span>
              <div className="mt-2 border-t border-line pt-2">
                <p className="text-[11px] font-medium leading-snug text-muted">{statF1.label}</p>
              </div>
              <div className="mt-2 flex gap-1 text-accent" aria-label="5 dari 5 bintang">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12 2l2.9 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77 5.82 21l1.18-6.88-5-4.87 7.1-1.01L12 2z" />
                  </svg>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Petunjuk scroll */}
      {!reduced && (
        <motion.div
          aria-hidden="true"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="pointer-events-none absolute bottom-4 left-1/2 hidden -translate-x-1/2 text-muted lg:block"
        >
          <svg width="22" height="30" viewBox="0 0 24 32" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 4v20" />
            <path d="m5 18 7 7 7-7" />
          </svg>
        </motion.div>
      )}
    </section>
  );
}
