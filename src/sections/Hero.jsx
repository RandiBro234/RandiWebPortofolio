import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { hero } from '../data/content';
import { ArrowIcon, ArrowRight } from '../components/icons';
import Pill from '../components/Pill';
import Magnetic from '../components/Magnetic';
import IdCard from '../components/IdCard';
import { useReducedMotion } from '../hooks';

// --- FitText: skala font agar lebar teks persis = lebar target. ---
function FitText({ text, targetRef, className }) {
  const ref = useRef(null);
  const [size, setSize] = useState(null);

  useEffect(() => {
    const compute = () => {
      const el = ref.current;
      const target = targetRef.current;
      if (!el || !target) return;

      // Ukur lebar natural pada 100px memakai elemen tersembunyi sementara.
      const probe = document.createElement('span');
      probe.textContent = text;
      probe.className = className;
      probe.style.cssText =
        'position:absolute;left:-99999px;top:0;visibility:hidden;' +
        'display:inline-block;width:max-content;white-space:nowrap;font-size:100px;';
      document.body.appendChild(probe);
      const naturalWidth = probe.getBoundingClientRect().width;
      document.body.removeChild(probe);

      const targetWidth = target.getBoundingClientRect().width;
      if (!targetWidth || !naturalWidth) return;
      setSize((targetWidth / naturalWidth) * 100);
    };

    compute();
    const ro = new ResizeObserver(compute);
    if (targetRef.current) ro.observe(targetRef.current);
    if (document.fonts?.ready) document.fonts.ready.then(compute);
    window.addEventListener('resize', compute);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', compute);
    };
  }, [text, targetRef, className]);

  return (
    <span
      ref={ref}
      className={`hero-giant ${className}`}
      style={size ? { fontSize: `${size}px` } : { visibility: 'hidden' }}
    >
      {text}
    </span>
  );
}

// --- Headline 2 baris, lebarnya disejajarkan. ---
function GiantLines({ reduced }) {
  const line1Ref = useRef(null);

  return (
    <div className="relative z-20 flex flex-col gap-2 select-none">
      <h1 className="sr-only">
        {hero.lineSolid} — {hero.lineOutline}
      </h1>

      {/* Baris 1: acuan lebar */}
      <div ref={line1Ref} className="w-full">
        <FitText text={hero.lineSolid} targetRef={line1Ref} className="hero-giant-solid" />
      </div>

      {/* Baris 2: disamakan lebar dengan baris 1 */}
      <motion.div
        className="w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: reduced ? 0.15 : 0.5, delay: reduced ? 0 : 0.15 }}
      >
        <FitText text={hero.lineOutline} targetRef={line1Ref} className="hero-giant-outline" />
      </motion.div>
    </div>
  );
}

// --- (Kartu polaroid lama diganti <IdCard />) ---

// Anotasi gaya chart: garis + titik + label, muncul berurutan (di sisi kanan kolom teks, dekat foto).
function Annotations({ reduced }) {
  const items = [
    { label: hero.anotasi[0], top: '14%', delay: 0.9 },
    { label: hero.anotasi[1], top: '38%', delay: 1.05 },
    { label: hero.anotasi[2], top: '62%', delay: 1.2 },
    { label: hero.anotasi[3], top: '86%', delay: 1.35 },
  ];
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-30 hidden xl:block">
      {items.map((a, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: reduced ? 0 : a.delay }}
          className="absolute right-0 flex translate-x-[calc(100%+0.75rem)] items-center gap-2"
          style={{ top: a.top }}
        >
          <svg width="40" height="10" viewBox="0 0 40 10" className="text-muted">
            <circle cx="3" cy="5" r="3" fill="var(--color-accent)" />
            <line x1="6" y1="5" x2="40" y2="5" stroke="currentColor" strokeWidth="1" className="hero-anno-line" style={{ animationDelay: `${a.delay}s` }} />
          </svg>
          <span className="whitespace-nowrap rounded-pill border border-line bg-white/85 px-2.5 py-1 font-mono text-[12px] text-ink shadow-sm backdrop-blur">
            {a.label}
          </span>
        </motion.div>
      ))}
    </div>
  );
}

// (Label data kini berada di dalam <IdCard />.)

// Scanner reticle mengikuti kursor, mengunci ke foto saat dekat.
function Reticle({ targetRef, enabled }) {
  const [pos, setPos] = useState({ x: -200, y: -200 });
  const [locked, setLocked] = useState(false);
  const [show, setShow] = useState(false);
  const raf = useRef(0);

  useEffect(() => {
    if (!enabled) return;
    const onMove = (e) => {
      cancelAnimationFrame(raf.current);
      raf.current = requestAnimationFrame(() => {
        setPos({ x: e.clientX, y: e.clientY });
        const el = targetRef.current;
        let near = false;
        if (el) {
          const r = el.getBoundingClientRect();
          near = e.clientX > r.left - 120 && e.clientX < r.right + 120 &&
            e.clientY > r.top - 120 && e.clientY < r.bottom + 120;
        }
        setLocked(near);
        setShow(true);
      });
    };
    window.addEventListener('mousemove', onMove);
    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf.current);
    };
  }, [enabled, targetRef]);

  if (!enabled || !show) return null;

  const size = locked ? 132 : 46;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed z-[60] hidden text-accent lg:block"
      style={{ left: pos.x, top: pos.y, transform: 'translate(-50%, -50%)' }}
    >
      <div
        className="hero-reticle relative"
        style={{ width: size, height: size }}
      >
        {/* sudut-sudut kotak */}
        {['left-0 top-0 border-l-2 border-t-2', 'right-0 top-0 border-r-2 border-t-2', 'left-0 bottom-0 border-l-2 border-b-2', 'right-0 bottom-0 border-r-2 border-b-2'].map((c) => (
          <span key={c} className={`absolute h-3 w-3 ${c}`} />
        ))}
        {locked && (
          <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-pill bg-ink px-2.5 py-1 font-mono text-[11px] text-white">
            Randi · Data Scientist
          </span>
        )}
      </div>
    </div>
  );
}

// Baris peran dengan efek typewriter.
function Typewriter({ words, reduced }) {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (reduced) return;

    const current = words[index % words.length];
    const typing = !deleting;
    const atFull = typing && text === current;
    const atEmpty = deleting && text === '';

    let delay = typing ? 70 : 40;
    if (atFull) delay = 1600;
    else if (atEmpty) delay = 300;

    const timer = setTimeout(() => {
      if (atFull) {
        setDeleting(true);
      } else if (atEmpty) {
        setDeleting(false);
        setIndex((i) => (i + 1) % words.length);
      } else {
        setText(
          typing ? current.slice(0, text.length + 1) : current.slice(0, text.length - 1),
        );
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [text, deleting, index, words, reduced]);

  if (reduced) {
    return (
      <p className="font-mono text-[12px] text-muted sm:text-[13px]">
        <span className="text-accent">{hero.peran.prefix}</span>{' '}
        <span className="text-neutral-700">{words.join(' · ')}</span>
      </p>
    );
  }

  return (
    <p className="font-mono text-[12px] text-muted sm:text-[13px]" aria-live="polite">
      <span className="text-accent">{hero.peran.prefix}</span>{' '}
      <span className="text-neutral-700">{text}</span>
      <span className="hero-type-cursor ml-0.5 inline-block text-accent">|</span>
    </p>
  );
}

// Parallax halus foto vs teks (berlawanan arah).
function useParallax(enabled) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const raf = useRef(0);

  useEffect(() => {
    if (!enabled) return;
    const onMove = (e) => {
      cancelAnimationFrame(raf.current);
      raf.current = requestAnimationFrame(() => {
        setOffset({
          x: e.clientX / window.innerWidth - 0.5,
          y: e.clientY / window.innerHeight - 0.5,
        });
      });
    };
    window.addEventListener('mousemove', onMove);
    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf.current);
    };
  }, [enabled]);

  return offset;
}

export default function Hero() {
  const navigate = useNavigate();
  const reduced = useReducedMotion();
  const [desktop, setDesktop] = useState(false);
  const photoRef = useRef(null);

  useEffect(() => {
    const mq = window.matchMedia('(pointer: fine) and (min-width: 1024px)');
    const update = () => setDesktop(mq.matches && !reduced);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, [reduced]);

  const offset = useParallax(desktop);
  const textStyle = desktop
    ? { transform: `translate3d(${offset.x * -4}px, ${offset.y * -3}px, 0)` }
    : undefined;

  return (
    <section
      id="beranda"
      className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-x-clip bg-paper px-5 pb-6 pt-[var(--nav-h)]"
    >
      {/* Pola titik samar */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.4]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgba(17,17,17,0.12) 1px, transparent 0)',
          backgroundSize: '26px 26px',
        }}
      />

      {/* Konten utama: 2 kolom di lg (teks kiri, foto kanan) */}
      <div className="relative z-20 grid w-full max-w-6xl grid-cols-1 items-center gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-6">
        {/* KIRI: keterangan */}
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: reduced ? 0 : 0.15 }}
            className="max-w-xl text-[15px] leading-[1.6] text-muted sm:text-[17px]"
          >
            Halo, saya <span className="font-semibold text-ink">Randi</span>, mahasiswa Sains Data Terapan yang tertarik pada analisis data dan machine learning.
          </motion.p>

          {/* Blok teks raksasa */}
          <div className="relative mt-4 w-full xl:pr-8" style={textStyle}>
            <div className="relative w-full">
              <GiantLines reduced={reduced} />
            </div>
            <Annotations reduced={reduced} />
          </div>

          {/* Baris peran dengan typewriter */}
          <div className="relative z-40 mt-3 min-h-[20px]">
            <Typewriter words={hero.peran.roles} reduced={reduced} />
          </div>

          {/* Tombol: kiri-bawah & kanan-bawah di dalam kolom teks */}
          <div className="relative z-40 mt-6 flex w-full max-w-md flex-wrap items-center justify-center gap-3 lg:justify-start">
            <Magnetic>
              <Pill
                as="button"
                type="button"
                variant="solid"
                data-cursor="lihat"
                onClick={() => navigate('/proyek')}
              >
                {hero.ctaPrimary}
                <ArrowIcon size={16} />
              </Pill>
            </Magnetic>
            <Magnetic>
              <Pill
                as="button"
                type="button"
                variant="outline"
                data-cursor="kontak"
                onClick={() => navigate('/kontak')}
              >
                {hero.ctaSecondary}
                <ArrowRight size={16} />
              </Pill>
            </Magnetic>
          </div>
        </div>

        {/* KANAN: ID card dengan lanyard */}
        <div className="relative flex justify-center pt-2 lg:justify-end">
          <div className="pointer-events-auto">
            <IdCard photoRef={photoRef} />
          </div>
        </div>
      </div>

      {/* Penanda scroll */}
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

      <Reticle targetRef={photoRef} enabled={desktop} />
    </section>
  );
}
