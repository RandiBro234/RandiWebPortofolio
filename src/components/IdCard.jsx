import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { profile } from '../data/content';
import LogoMark from './LogoMark';
import { useReducedMotion } from '../hooks';

const BASE_W = 340;
const BASE_H = 540;

// --- Ikon inline (lucide-style) ---
function RotateCw({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 12a9 9 0 1 1-3-6.7L21 8" />
      <path d="M21 3v5h-5" />
    </svg>
  );
}
function LinkedInIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M4.98 3.5A2.5 2.5 0 1 1 5 8.5a2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05C20.4 8.65 21 11 21 14.1V21h-4v-6.1c0-1.45-.03-3.3-2-3.3s-2.3 1.57-2.3 3.2V21H9z" />
    </svg>
  );
}
function GitHubIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.99 1.03-2.69-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.6 9.6 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.6 1.03 2.69 0 3.84-2.34 4.69-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2z" />
    </svg>
  );
}

const SKILLS = ['Python', 'SQL', 'Power BI', 'Tableau', 'Machine Learning'];

// Hitung skala kartu agar muat tinggi layar & lebar kolom (tidak menimpa label kiri).
function useCardScale(ref) {
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const compute = () => {
      const el = ref.current;
      if (!el) return;
      const navH = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--nav-h'),
        10,
      ) || 112;
      const sTinggi = (window.innerHeight - navH - 64) / BASE_H;

      // lebar kolom kanan
      const col = el.parentElement?.getBoundingClientRect();
      const avail = col ? col.width : BASE_W;
      const sLebar = (avail - 24) / BASE_W;

      let s = Math.max(0.8, Math.min(sTinggi, sLebar, 1.35));
      // Di bawah lg (single column): batasi lebar kartu ~78vw, maks 340.
      if (window.innerWidth < 1024) {
        s = Math.min(s, Math.max(0.8, (Math.min(window.innerWidth * 0.78, 340)) / BASE_W));
      }
      setScale(s);
    };

    compute();
    window.addEventListener('resize', compute);
    if (document.fonts?.ready) document.fonts.ready.then(compute);
    return () => window.removeEventListener('resize', compute);
  }, [ref]);

  return scale;
}

export default function IdCard({ photoRef }) {
  const reduced = useReducedMotion();
  const stageRef = useRef(null);
  const cardRef = useRef(null);
  const ropeRef = useRef(null);
  const holoRef = useRef(null);
  const scale = useCardScale(stageRef);

  const [flipped, setFlipped] = useState(false);
  const [canHover, setCanHover] = useState(false);
  const ropeId = useId().replace(/:/g, '');

  const angle = useRef(0);
  const vel = useRef(0);
  const targetAngle = useRef(0);
  const dragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0, angle: 0 });
  const moved = useRef(0);
  const raf = useRef(0);
  const introDone = useRef(false);
  const idleTimer = useRef(0);
  const inView = useRef(false);
  const tabActive = useRef(true);
  const tilt = useRef({ rx: 0, ry: 0 });

  useEffect(() => {
    const hov = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    setCanHover(hov);
  }, []);

  // Tempatkan tali dari klip (atas kartu) ke tepi atas halaman.
  const paintRope = useCallback(() => {
    const rope = ropeRef.current;
    const card = cardRef.current;
    if (!rope || !card) return;
    const cardTop = card.getBoundingClientRect().top; // posisi klip di viewport
    const length = Math.max(cardTop, 0);
    rope.setAttribute('d', `M50 0 Q50 ${length / 2},50 ${length}`);
    rope.parentElement?.setAttribute('viewBox', `0 0 100 ${Math.max(length, 1)}`);
    rope.parentElement?.style.setProperty('height', `${length}px`);
  }, []);

  // Loop pendulum.
  useEffect(() => {
    if (reduced) return;
    const stiffness = 120;
    const damping = 8;
    let last = performance.now();
    const loop = (now) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (inView.current && tabActive.current && !dragging.current) {
        const a = angle.current;
        const acc = -stiffness * (a - targetAngle.current) - damping * vel.current;
        vel.current += acc * dt;
        angle.current += vel.current * dt;
        if (cardRef.current) {
          cardRef.current.style.transform = `rotate(${angle.current}deg)`;
        }
      }
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf.current);
  }, [reduced]);

  useEffect(() => {
    if (reduced) return;
    const el = stageRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        inView.current = entry.isIntersecting;
        paintRope();
        if (entry.isIntersecting && !introDone.current) {
          introDone.current = true;
          angle.current = 12;
          vel.current = 0;
          targetAngle.current = 0;
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    const onResize = () => paintRope();
    const onVis = () => { tabActive.current = document.visibilityState === 'visible'; };
    window.addEventListener('resize', onResize);
    window.addEventListener('scroll', onResize, { passive: true });
    document.addEventListener('visibilitychange', onVis);
    paintRope();
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onResize);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [reduced, paintRope]);

  const scheduleIdleHint = useCallback(() => {
    if (reduced) return;
    clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => {
      targetAngle.current = 1.6;
      setTimeout(() => {
        targetAngle.current = -1.6;
        setTimeout(() => { targetAngle.current = 0; }, 700);
      }, 700);
    }, 6000);
  }, [reduced]);

  // --- Drag ---
  const onPointerDown = (e) => {
    if (reduced) return;
    dragging.current = true;
    moved.current = 0;
    dragStart.current = { x: e.clientX, y: e.clientY, angle: angle.current };
    cardRef.current?.setPointerCapture?.(e.pointerId);
    if (cardRef.current) cardRef.current.style.cursor = 'grabbing';
  };
  const onPointerMove = (e) => {
    if (!dragging.current) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    moved.current = Math.max(moved.current, Math.hypot(dx, dy));
    let a = dragStart.current.angle + dx * 0.18;
    a = Math.max(-25, Math.min(25, a));
    angle.current = a;
    if (cardRef.current) {
      cardRef.current.style.transform =
        `translate3d(0, ${Math.max(-20, Math.min(20, dy * 0.08))}px, 0) rotate(${a}deg)`;
    }
  };
  const onPointerUp = (e) => {
    if (!dragging.current) return;
    dragging.current = false;
    cardRef.current?.releasePointerCapture?.(e.pointerId);
    if (cardRef.current) {
      cardRef.current.style.cursor = canHover ? 'grab' : 'pointer';
      cardRef.current.style.transform = `rotate(${angle.current}deg)`;
    }
    targetAngle.current = 0;
    scheduleIdleHint();
  };

  const onCardClick = () => {
    if (moved.current > 6) return;
    setFlipped((f) => !f);
  };
  const onKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setFlipped((f) => !f);
    }
  };

  // --- Tilt + kilau ---
  const onTiltMove = (e) => {
    if (!canHover || reduced || !cardRef.current) return;
    const r = cardRef.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    tilt.current = { rx: -(py - 0.5) * 16, ry: (px - 0.5) * 16 };
    if (holoRef.current) {
      holoRef.current.style.setProperty('--mx', `${px * 100}%`);
      holoRef.current.style.setProperty('--my', `${py * 100}%`);
    }
    if (stageRef.current) {
      stageRef.current.style.setProperty('--mx', `${px * 100}%`);
      stageRef.current.style.setProperty('--my', `${py * 100}%`);
    }
    const inner = cardRef.current.querySelector('[data-flip]');
    if (inner) {
      const { rx, ry } = tilt.current;
      inner.style.transform = `rotateY(${flipped ? 180 : 0}deg) rotateX(${rx}deg) rotateY(${ry}deg)`;
    }
  };
  const onTiltLeave = () => {
    tilt.current = { rx: 0, ry: 0 };
    const inner = cardRef.current?.querySelector('[data-flip]');
    if (inner) inner.style.transform = `rotateY(${flipped ? 180 : 0}deg)`;
  };

  useEffect(() => {
    const inner = cardRef.current?.querySelector('[data-flip]');
    if (!inner) return;
    inner.style.transition = reduced
      ? 'opacity 200ms ease'
      : 'transform 700ms cubic-bezier(0.22,1,0.36,1)';
    inner.style.transform = `rotateY(${flipped ? 180 : 0}deg)`;
  }, [flipped, reduced]);

  const backStyle = reduced
    ? { backfaceVisibility: 'hidden' }
    : { transform: 'rotateY(180deg)', backfaceVisibility: 'hidden' };

  return (
    <div ref={stageRef} className="idcard-stage relative" style={{ '--mx': '30%', '--my': '0%' }}>
      {/* Sizer: mengatur ruang layout sesuai skala */}
      <div
        className="relative"
        style={{ width: BASE_W * scale, height: BASE_H * scale }}
      >
        {/* Inner: ukuran dasar + scale dari top-left (di LUAR ayunan/flip) */}
        <div
          className="absolute left-0 top-0"
          style={{
            width: BASE_W,
            height: BASE_H,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
          }}
        >
          {/* Tali lanyard ke ATAS (absolute, tidak mempengaruhi layout, tidak ikut flip) */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-full left-1/2 z-0 w-[22px] -translate-x-1/2"
          >
            <svg
              viewBox="0 0 100 200"
              preserveAspectRatio="none"
              className="w-[22px]"
              style={{ height: '200px' }}
            >
              <path id={ropeId} ref={ropeRef} d="M50 0 Q50 100,50 200" stroke="#FF4B1F" strokeWidth="22" fill="none" />
              <text fontFamily="ui-monospace, monospace" fontSize="6" fill="rgba(255,255,255,0.7)" letterSpacing="1">
                <textPath href={`#${ropeId}`} startOffset="4">
                  RANDI · DATA SCIENTIST · RANDI · DATA SCIENTIST ·
                </textPath>
              </text>
            </svg>
          </div>

          {/* Kartu (elemen ayunan + flip + tilt) */}
          <div
            ref={cardRef}
            role="button"
            tabIndex={0}
            aria-label="Balik kartu identitas"
            onClick={onCardClick}
            onKeyDown={onKeyDown}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            onMouseMove={onTiltMove}
            onMouseLeave={onTiltLeave}
            className="relative h-full w-full select-none [perspective:1200px]"
            style={{ cursor: canHover ? 'grab' : 'pointer', transformOrigin: '50% 0%' }}
          >
            {/* Klip: duduk di tepi atas holder, masuk ~8px */}
            <div aria-hidden="true" className="absolute left-1/2 top-0 z-30 -translate-x-1/2 translate-y-[-10px]">
              <div className="clip-metal h-6 w-5 rounded-sm" />
            </div>

            <div data-flip className="relative h-full w-full [transform-style:preserve-3d]">
              {/* ===== SISI DEPAN ===== */}
              <div className="absolute inset-0 [backface-visibility:hidden]">
                <HolderFrame>
                  <div className="relative flex h-full w-full flex-col overflow-hidden rounded-[20px] bg-white shadow-[0_1px_0_#d4d4d4,0_2px_0_#c4c4c4,inset_0_0_0_1px_#e5e5e5]">
                    {/* band oranye (padding-top agar tidak tertimpa klip) */}
                    <div className="flex shrink-0 items-center gap-2 bg-accent px-3 pb-2.5" style={{ paddingTop: 18 }}>
                      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white">
                        <LogoMark className="h-4 w-4 text-accent" />
                      </span>
                      <span className="whitespace-nowrap font-mono text-[10px] tracking-widest text-white">
                        PENS · SAINS DATA TERAPAN
                      </span>
                    </div>

                    {/* foto mengisi sisa ruang */}
                    <div className="flex min-h-0 flex-1 flex-col px-3">
                      <img
                        ref={photoRef}
                        src={profile.portrait}
                        alt="Foto Randi Nandika Danendra"
                        loading="eager"
                        className="my-3 min-h-0 w-full flex-1 rounded-xl object-cover object-top"
                      />
                    </div>

                    <div className="shrink-0 px-3">
                      <h3 className="whitespace-nowrap font-sans text-[20px] font-semibold leading-tight text-neutral-900">
                        {profile.name}
                      </h3>
                      <p className="mt-0.5 whitespace-nowrap font-mono text-[12px] text-accent">
                        Data Scientist · AI Engineer
                      </p>
                    </div>

                    {/* baris info */}
                    <div className="mt-2.5 flex shrink-0 items-center justify-between px-3.5" style={{ height: 40 }}>
                      <div className="leading-tight">
                        <p className="font-mono text-[10px] text-neutral-500">NRP 3324600013</p>
                        <p className="font-mono text-[10px] text-neutral-500">ANGKATAN 2024</p>
                      </div>
                      <div
                        aria-hidden="true"
                        className="grid h-10 w-10 shrink-0 place-items-center rounded-full border-2 border-white"
                        style={{
                          background:
                            'conic-gradient(from 210deg, #FF8A4B, #C9A7FF, #6FB7FF, #57E0B0, #FFD166, #FF8A4B)',
                          boxShadow: '0 2px 5px rgba(0,0,0,0.3), inset 0 0 0 1px rgba(255,255,255,0.5)',
                        }}
                      >
                        <span className="font-display text-base font-extrabold text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.5)]">R</span>
                      </div>
                    </div>

                    {/* strip footer marquee */}
                    <div className="mt-2 flex h-6 shrink-0 items-center overflow-hidden bg-ink-dark">
                      <div className="footer-marquee whitespace-nowrap font-mono text-[8px] text-white/50">
                        PENS · SAINS DATA TERAPAN · RANDI NANDIKA DANENDRA · PENS · SAINS DATA TERAPAN · RANDI NANDIKA DANENDRA ·
                      </div>
                    </div>
                  </div>

                  {/* kilau holografik (tilt) */}
                  <div
                    ref={holoRef}
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 z-10 rounded-[28px] transition-opacity duration-200"
                    style={{
                      background:
                        'linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.25) 48%, transparent 66%)',
                      backgroundSize: '220% 220%',
                      backgroundPosition: 'var(--mx,50%) var(--my,50%)',
                      mixBlendMode: 'soft-light',
                    }}
                  />
                </HolderFrame>
              </div>

              {/* ===== SISI BELAKANG ===== */}
              <div className="absolute inset-0 [backface-visibility:hidden]" style={backStyle}>
                <HolderFrame>
                  <div className="relative flex h-full flex-col overflow-hidden rounded-[20px] bg-ink-dark shadow-[0_1px_0_#d4d4d4,0_2px_0_#c4c4c4,inset_0_0_0_1px_#333]">
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0"
                      style={{
                        backgroundImage:
                          'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.06) 1px, transparent 0)',
                        backgroundSize: '20px 20px',
                      }}
                    />
                    <div className="h-1.5 w-full shrink-0 bg-accent" />
                    <div className="relative flex min-h-0 flex-1 flex-col px-5 py-4">
                      <p className="font-mono text-[11px] uppercase tracking-widest text-neutral-500">Skills</p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {SKILLS.map((s) => (
                          <span key={s} className="rounded-full border border-white/15 px-2.5 py-1 font-mono text-xs text-white">
                            {s}
                          </span>
                        ))}
                      </div>

                      <div className="my-4 h-px w-full bg-white/10" />

                      <p className="font-mono text-[11px] uppercase tracking-widest text-neutral-500">Fokus</p>
                      <p className="mt-2 text-sm leading-relaxed text-neutral-300">
                        Analisis data, machine learning, dan visualisasi untuk membantu pengambilan keputusan.
                      </p>

                      <p className="mt-4 font-mono text-[11px] uppercase tracking-widest text-neutral-500">Kontak</p>
                      <div className="mt-2 grid grid-cols-2 gap-3">
                        <a
                          href={profile.linkedin || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-2.5 text-sm text-white transition-all hover:-translate-y-0.5 hover:border-accent hover:text-accent"
                        >
                          <LinkedInIcon size={16} /> LinkedIn
                        </a>
                        <a
                          href={profile.github || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-2.5 text-sm text-white transition-all hover:-translate-y-0.5 hover:border-accent hover:text-accent"
                        >
                          <GitHubIcon size={16} /> GitHub
                        </a>
                      </div>
                    </div>

                    <div className="mt-auto flex h-6 shrink-0 items-center overflow-hidden bg-[#141414]">
                      <div className="footer-marquee whitespace-nowrap font-mono text-[8px] text-white/50">
                        PENS · SAINS DATA TERAPAN · RANDI NANDIKA DANENDRA · PENS · SAINS DATA TERAPAN · RANDI NANDIKA DANENDRA ·
                      </div>
                    </div>
                  </div>
                </HolderFrame>
              </div>
            </div>

            {/* tombol balik */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setFlipped((f) => !f);
              }}
              aria-label="Balik kartu"
              className="absolute -bottom-3 -right-3 z-50 grid h-9 w-9 place-items-center rounded-full border border-neutral-200 bg-white text-neutral-700 shadow-md transition-colors hover:bg-accent hover:text-white"
            >
              <RotateCw size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function HolderFrame({ children }) {
  return (
    <div
      className="relative h-full w-full overflow-hidden rounded-[28px] p-2 shadow-[0_24px_50px_rgba(0,0,0,0.18),inset_0_0_0_1px_rgba(0,0,0,0.04)] ring-1 ring-neutral-300"
      style={{
        background: 'rgba(255,255,255,0.35)',
        border: '1px solid rgba(255,255,255,0.7)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
      }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-20 opacity-70"
        style={{
          background:
            'linear-gradient(115deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.35) 18%, rgba(255,255,255,0) 38%)',
          backgroundPosition: 'var(--mx,30%) var(--my,0%)',
        }}
      />
      {children}
    </div>
  );
}
