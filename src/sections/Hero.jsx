import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { hero } from '../data/content';
import { ArrowIcon, ArrowRight } from '../components/icons';
import Pill from '../components/Pill';
import Magnetic from '../components/Magnetic';
import IdCard from '../components/IdCard';
import { useIntro, useReducedMotion } from '../hooks';

// --- FitText: skala font agar lebar teks persis = lebar target. ---
// `wrapBelow`: jika font-size hasil < nilai ini, teks dipecah jadi 2 baris (mobile).
function FitText({ text, targetRef, className, wrapBelow = 0, wrapAfter = '' }) {
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

  // Mode 2 baris untuk mobile saat font terlalu kecil.
  const wrap = wrapBelow > 0 && size !== null && size < wrapBelow && wrapAfter;
  if (wrap) {
    const [a, b] = text.split(wrapAfter);
    return (
      <span
        ref={ref}
        className={`${className} hero-giant-wrapped`}
        style={size ? { fontSize: `${size}px` } : { visibility: 'hidden' }}
      >
        <span className="block">{a.trim()}</span>
        <span className="block">{wrapAfter}{b}</span>
      </span>
    );
  }

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

// --- Headline 2 baris, lebarnya disejajarkan (mask reveal saat intro selesai). ---
function GiantLines({ reduced }) {
  const line1Ref = useRef(null);
  const { ready } = useIntro();

  const lineMotion = (delay) =>
    reduced
      ? { initial: false, animate: { y: 0, opacity: 1 }, transition: { duration: 0.2 } }
      : {
          initial: { y: '110%' },
          animate: ready ? { y: '0%' } : { y: '110%' },
          transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] },
        };

  return (
    <div className="relative z-20 flex flex-col gap-3 select-none">
      <h1 className="sr-only">
        {hero.lineSolid} — {hero.lineOutline}
      </h1>

      {/* Baris 1: acuan lebar */}
      <div ref={line1Ref} className="w-full overflow-hidden">
        <motion.div {...lineMotion(0)}>
          <FitText text={hero.lineSolid} targetRef={line1Ref} className="hero-giant-solid" />
        </motion.div>
      </div>

      {/* Baris 2: disamakan lebar dengan baris 1 */}
      <div className="w-full overflow-hidden">
        <motion.div {...lineMotion(0.12)}>
          <FitText
            text={hero.lineOutline}
            targetRef={line1Ref}
            className="hero-giant-outline"
            wrapBelow={18}
            wrapAfter="INTO "
          />
        </motion.div>
      </div>
    </div>
  );
}

// --- (Kartu polaroid lama diganti <IdCard />) ---

// Baris peran dengan efek typewriter.
function Typewriter({ words, reduced, start = true }) {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (reduced || !start) return;

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
  }, [text, deleting, index, words, reduced, start]);

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
  const { ready } = useIntro();
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

  const reveal = (delay) =>
    reduced
      ? { initial: false, animate: { opacity: 1, y: 0 }, transition: { duration: 0.2 } }
      : {
          initial: { opacity: 0, y: 16 },
          animate: ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 },
          transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] },
        };

  return (
    <section
      id="beranda"
      className="hero-section relative flex min-h-[100svh] items-center justify-center overflow-x-clip bg-paper px-5"
      style={{
        minHeight: '100svh',
        paddingTop: 'var(--nav-h)',
        paddingBottom: '24px',
      }}
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
      <div className="relative z-20 grid w-full max-w-6xl grid-cols-1 items-center gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-6 2xl:max-w-[1400px]">
        {/* KIRI: keterangan */}
        <div className="hero-left flex flex-col items-center text-center lg:items-start lg:text-left">
          <motion.p
            {...reveal(0.1)}
            className="max-w-xl text-[15px] leading-[1.6] text-muted sm:text-[17px]"
          >
            Halo, saya <span className="font-semibold text-ink">Randi</span>, mahasiswa Sains Data Terapan yang tertarik pada analisis data dan machine learning.
          </motion.p>

          {/* Blok teks raksasa */}
          <div className="relative mt-4 w-full" style={textStyle}>
            <div className="relative w-full">
              <GiantLines reduced={reduced} />
            </div>
          </div>

          {/* Baris peran dengan typewriter (mulai setelah intro) */}
          <div className="relative z-40 mt-3 min-h-[20px]">
            <Typewriter words={hero.peran.roles} reduced={reduced} start={ready} />
          </div>

          {/* Tombol: kiri-bawah & kanan-bawah di dalam kolom teks */}
          <div className="relative z-40 mt-6 flex w-full max-w-md flex-wrap items-center justify-center gap-3 lg:justify-start">
            <motion.div {...reveal(0.5)}>
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
            </motion.div>
            <motion.div {...reveal(0.6)}>
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
            </motion.div>
          </div>
        </div>

        {/* KANAN: ID card dengan lanyard */}
        <div className="idcard-col relative flex w-full items-center justify-center">
          <IdCard photoRef={photoRef} introReady={ready} />
        </div>
      </div>

      {/* Penanda scroll */}
      {!reduced && (
        <motion.div
          aria-hidden="true"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="hero-scroll-arrow pointer-events-none absolute bottom-4 left-1/2 hidden -translate-x-1/2 text-muted lg:block"
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
