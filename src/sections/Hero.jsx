import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { hero, profile } from '../data/content';
import { ArrowIcon, ArrowRight } from '../components/icons';
import Pill from '../components/Pill';
import Magnetic from '../components/Magnetic';
import { useReducedMotion } from '../hooks';

// --- Animasi teks raksasa: baris oranye naik per huruf, outline menyala. ---
function GiantLines({ reduced }) {
  const solidLetters = hero.lineSolid.split('');
  const solidDelay = (i) => (reduced ? 0 : 0.3 + i * 0.025);

  return (
    <div className="relative z-20 select-none" aria-hidden="true">
      <h1 className="sr-only">
        {hero.lineSolid} {hero.lineOutline}
      </h1>

      {/* Baris 1: SOLID oranye */}
      <div className="hero-giant hero-giant-solid">
        {solidLetters.map((ch, i) => (
          <motion.span
            key={`s-${i}`}
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: '0.6em' }}
            animate={{ opacity: 1, y: 0 }}
            transition={
              reduced
                ? { duration: 0.15 }
                : { duration: 0.5, delay: solidDelay(i), ease: [0.22, 1, 0.36, 1] }
            }
            className="inline-block"
          >
            {ch === ' ' ? '\u00A0' : ch}
          </motion.span>
        ))}
      </div>

      {/* Baris 2: OUTLINE hitam */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: reduced ? 0.15 : 0.5, delay: reduced ? 0 : 0.05 }}
        className="hero-giant hero-giant-outline"
      >
        {hero.lineOutline}
      </motion.div>
    </div>
  );
}

// --- Foto dalam kartu ala polaroid (dengan tilt 3D) ---
function Cutout({ photoRef }) {
  const tiltRef = useRef(null);
  const reduced = useReducedMotion();
  const [canTilt, setCanTilt] = useState(false);

  useEffect(() => {
    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    setCanTilt(canHover && !reduced);
  }, [reduced]);

  const onMove = (e) => {
    if (!canTilt || !tiltRef.current) return;
    const r = tiltRef.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    const rotY = px * 12;
    const rotX = -py * 12;
    tiltRef.current.style.transform =
      `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.02)`;
    tiltRef.current.style.transition = 'transform 100ms ease-out';
  };

  const reset = () => {
    if (!tiltRef.current) return;
    tiltRef.current.style.transform = '';
    tiltRef.current.style.transition = 'transform 300ms ease-out';
  };

  return (
    <div
      ref={tiltRef}
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={{ transformStyle: 'preserve-3d' }}
    >
      <div className="hero-polaroid relative">
        <img
          ref={photoRef}
          src={profile.portrait}
          alt="Foto Randi Nandika Danendra"
          loading="eager"
          width="520"
          height="640"
          className="hero-cutout relative z-10 select-none"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
            e.currentTarget.nextElementSibling?.removeAttribute('hidden');
          }}
        />
        <div
          hidden
          className="hero-cutout grid place-items-center bg-ink/5 text-center text-[12px] font-medium text-muted"
        >
          Taruh foto di
          <br />
          <code className="text-accent">/assets/randi-cutout.png</code>
        </div>
        <span className="hero-polaroid-caption">Surabaya, 2026</span>
      </div>
    </div>
  );
}

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

// Chip data menepi.
function DataChips({ reduced }) {
  const chips = [
    { text: hero.chips[0], pos: 'left-[4%] top-[26%]' },
    { text: hero.chips[1], pos: 'right-[5%] top-[46%]' },
    { text: hero.chips[2], pos: 'left-[7%] bottom-[24%]' },
  ];
  if (reduced) return null;
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-30 hidden lg:block">
      {chips.map((c, i) => (
        <span
          key={c.text}
          className={`hero-chip-float absolute ${c.pos} rounded-pill border border-line bg-white/80 px-3 py-1 font-mono text-[11px] text-muted shadow-sm backdrop-blur`}
          style={{ animationDelay: `${i * 0.7}s` }}
        >
          {c.text}
        </span>
      ))}
    </div>
  );
}

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

// Baris peran dengan efek decode/scramble.
function DecodeRole({ reduced }) {
  const phrases = hero.peran.rotasi;
  const [index, setIndex] = useState(0);
  const [text, setText] = useState(phrases[0]);

  useEffect(() => {
    if (reduced) {
      setText(phrases[0]);
      return;
    }

    const target = phrases[index];
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789_';
    let frame = 0;
    let raf = 0;
    let holdTimer = 0;

    const step = () => {
      frame += 1;
      if (frame >= target.length) {
        setText(target);
        holdTimer = window.setTimeout(() => {
          setIndex((i) => (i + 1) % phrases.length);
        }, 2600);
        return;
      }
      const revealed = target.slice(0, frame);
      const noise = target
        .slice(frame)
        .split('')
        .map((ch) => (ch === ' ' ? ' ' : chars[Math.floor(Math.random() * chars.length)]))
        .join('');
      setText(revealed + noise);
      raf = window.setTimeout(step, 45);
    };

    raf = window.setTimeout(step, 45);

    return () => {
      clearTimeout(raf);
      clearTimeout(holdTimer);
    };
  }, [index, phrases, reduced]);

  return (
    <p className="font-mono text-[12px] text-muted sm:text-[13px]" aria-live="polite">
      <span className="text-accent">{hero.peran.prefix}</span> {text}
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
  const photoStyle = desktop
    ? { transform: `translate3d(${offset.x * 10}px, ${offset.y * 8}px, 0)` }
    : undefined;
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
          <div className="relative mt-4 w-full" style={textStyle}>
            <div className="relative w-full">
              <GiantLines reduced={reduced} />
            </div>
            <Annotations reduced={reduced} />
          </div>

          {/* Baris peran dengan decode */}
          <div className="relative z-40 mt-4">
            <DecodeRole reduced={reduced} />
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

        {/* KANAN: foto cutout */}
        <div className="relative flex justify-center lg:justify-end">
          <div className="relative pointer-events-auto" style={photoStyle}>
            <Cutout photoRef={photoRef} />
            <DataChips reduced={reduced} />
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
