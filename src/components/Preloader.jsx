import { useCallback, useEffect, useRef, useState } from 'react';
import LogoMark from './LogoMark';

// Baris-baris terminal yang diketik berurutan.
const LINES = [
  { text: 'import portfolio', keyword: 'import' },
  { text: 'df = load_data("randi")', keyword: 'load_data' },
  { text: 'model.fit(df)', keyword: 'fit' },
  { text: 'siap ditampilkan', check: true },
];

const MIN_MS = 1800; // durasi minimum
const MAX_MS = 3500; // batas maksimal total
const HOLD_MS = 250; // tahan setelah 100%
const CURTAIN_MS = 800; // durasi tirai terbuka
const CHAR_MS = 25; // kecepatan ketik
const LINE_GAP = 150; // jeda antar baris

function useTypeLines(reduced) {
  const [rendered, setRendered] = useState(() =>
    reduced ? LINES.map((l) => l.text) : LINES.map(() => ''),
  );

  useEffect(() => {
    if (reduced) return;
    let li = 0;
    let ci = 0;
    let timer;

    const step = () => {
      if (li >= LINES.length) return;
      const target = LINES[li].text;
      ci += 1;
      setRendered((prev) => {
        const next = [...prev];
        next[li] = target.slice(0, ci);
        return next;
      });
      if (ci >= target.length) {
        li += 1;
        ci = 0;
        timer = setTimeout(step, LINE_GAP);
      } else {
        timer = setTimeout(step, CHAR_MS);
      }
    };

    timer = setTimeout(step, 200);
    return () => clearTimeout(timer);
  }, [reduced]);

  return rendered;
}

export default function Preloader({ onDone, onFinish }) {
  const reduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const [progress, setProgress] = useState(0); // 0..1
  const [exiting, setExiting] = useState(false);
  const lines = useTypeLines(reduced);

  const startRef = useRef(0);
  const assetsReady = useRef({ fonts: false, photo: false });
  const raf = useRef(0);
  const finished = useRef(false);

  const beginExit = useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    setProgress(1);
    setTimeout(() => {
      setExiting(true);
      // Sinkronkan dengan animasi hero: beri tahu parent saat tirai mulai terbuka.
      onDone?.();
      // Setelah tirai selesai, baru hapus preloader dari DOM.
      setTimeout(() => onFinish?.(), CURTAIN_MS);
    }, HOLD_MS);
  }, [onDone, onFinish]);

  // Tandai waktu mulai saat mount.
  useEffect(() => {
    startRef.current = performance.now();
  }, []);

  // Kesiapan aset: font + foto ID card.
  useEffect(() => {
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => {
        assetsReady.current.fonts = true;
      });
    } else {
      assetsReady.current.fonts = true;
    }

    const img = new Image();
    img.src = '/assets/randi-cutout.png';
    const mark = () => {
      if (img.decode) {
        img.decode().then(() => (assetsReady.current.photo = true)).catch(() => (assetsReady.current.photo = true));
      } else {
        assetsReady.current.photo = true;
      }
    };
    if (img.complete) mark();
    else img.onload = mark;
  }, []);

  // Progres: gabungan waktu minimum + kesiapan aset.
  useEffect(() => {
    if (reduced) {
      beginExit();
      return;
    }
    const tick = () => {
      const elapsed = performance.now() - startRef.current;
      const timeFrac = Math.min(elapsed / MIN_MS, 1);
      const bothReady = assetsReady.current.fonts && assetsReady.current.photo;
      // waktu mendominasi; aset mempercepat sisa menuju 1
      let p = timeFrac * 0.85 + (bothReady ? 0.15 : 0);
      if (elapsed >= MAX_MS) p = 1;
      setProgress((prev) => Math.max(prev, Math.min(p, 1)));
      if (bothReady && elapsed >= MIN_MS) {
        beginExit();
        return;
      }
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [reduced, beginExit]);

  // Lewati: klik / Escape / Space.
  useEffect(() => {
    const skip = (e) => {
      if (e.type === 'keydown' && !['Escape', ' '].includes(e.key)) return;
      e.preventDefault?.();
      beginExit();
    };
    window.addEventListener('pointerdown', skip);
    window.addEventListener('keydown', skip);
    return () => {
      window.removeEventListener('pointerdown', skip);
      window.removeEventListener('keydown', skip);
    };
  }, [beginExit]);

  // Kunci scroll selama preloader tampil.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const pct = Math.round(progress * 100);
  const pctLabel = String(pct).padStart(3, '0') + '%';

  const renderLine = (line, text) => {
    if (line.check) {
      // "✓ siap ditampilkan" — centang hijau setelah selesai ketik.
      const typed = text ?? '';
      const done = typed === line.text;
      return (
        <span>
          <span className={done ? 'text-green-500' : 'text-neutral-500'}>✓ </span>
          {typed}
        </span>
      );
    }
    // Prompt ">" dan keyword oranye, sisanya abu.
    const typed = text ?? '';
    return (
      <span>
        <span className="text-accent">&gt; </span>
        {typed.startsWith(line.keyword) ? (
          <>
            <span className="text-accent">{line.keyword}</span>
            {typed.slice(line.keyword.length)}
          </>
        ) : (
          typed
        )}
      </span>
    );
  };

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Memuat portofolio"
      className="fixed inset-0 z-[300]"
    >
      {/* Panel tirai atas/bawah */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-1/2 bg-ink-dark will-change-transform"
        style={{
          transform: exiting ? 'translateY(-100%)' : 'translateY(0)',
          transition: exiting ? `transform ${CURTAIN_MS}ms cubic-bezier(0.76,0,0.24,1)` : 'none',
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.06) 1px, transparent 0)',
            backgroundSize: '20px 20px',
          }}
        />
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-1/2 bg-ink-dark will-change-transform"
        style={{
          transform: exiting ? 'translateY(100%)' : 'translateY(0)',
          transition: exiting ? `transform ${CURTAIN_MS}ms cubic-bezier(0.76,0,0.24,1)` : 'none',
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.06) 1px, transparent 0)',
            backgroundSize: '20px 20px',
          }}
        />
      </div>

      {/* Garis oranye belahan tengah */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-1/2 h-[2px] -translate-y-1/2 bg-accent"
        style={{ opacity: exiting ? 1 : 0, transition: 'opacity 120ms ease' }}
      />

      {/* Konten tengah */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center px-6 transition-opacity duration-200"
        style={{ opacity: exiting ? 0 : 1 }}
      >
        {/* Logo */}
        <div
          className="grid h-16 w-16 place-items-center rounded-full bg-accent"
          style={{
            animation: reduced
              ? 'none'
              : 'preloader-logo-in 500ms cubic-bezier(0.22,1,0.36,1) both, preloader-logo-pulse 2s ease-in-out 600ms infinite',
          }}
        >
          <LogoMark className="h-6 w-6 text-white" />
        </div>

        {/* Terminal */}
        <div className="mt-6 w-full max-w-[80vw] font-mono text-xs text-neutral-400 md:max-w-[360px] md:text-sm">
          {LINES.map((line, i) => (
            <p key={i} className="whitespace-pre">
              {renderLine(line, lines[i])}
              {!reduced && i === lines.findIndex((t) => t === '' || t.length < LINES[i].text.length) && (
                <span className="ml-0.5 inline-block h-3.5 w-2 animate-pulse bg-accent align-middle" />
              )}
            </p>
          ))}
        </div>

        {/* Progress */}
        <div className="mt-6 flex w-full max-w-[80vw] items-end gap-3 md:max-w-[240px]">
          <div className="h-0.5 flex-1 overflow-hidden rounded-pill bg-white/10">
            <div
              className="h-full bg-accent"
              style={{ width: `${pct}%`, transition: 'width 150ms ease-out' }}
            />
          </div>
          <span className="font-mono text-[10px] tabular-nums text-neutral-400">{pctLabel}</span>
        </div>
      </div>
    </div>
  );
}
