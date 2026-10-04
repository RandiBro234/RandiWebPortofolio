import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { profile } from '../data/content';
import LogoMark from './LogoMark';
import { useReducedMotion } from '../hooks';

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
      {/* pantulan cahaya plastik */}
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

export default function IdCard({ photoRef }) {
  const reduced = useReducedMotion();
  const stageRef = useRef(null);
  const cardRef = useRef(null);
  const ropeRef = useRef(null);
  const holoRef = useRef(null);

  const [flipped, setFlipped] = useState(false);
  const [canHover, setCanHover] = useState(false);
  const [badgeHover, setBadgeHover] = useState(false);
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

  const paint = useCallback(() => {
    const deg = angle.current;
    const card = cardRef.current;
    if (card) card.style.transform = `translate3d(0,0,0) rotate(${deg}deg)`;
    const rope = ropeRef.current;
    if (rope) {
      const bend = deg * 0.6;
      rope.setAttribute('d', `M50 0 Q ${50 + bend * 0.4} 55, 50 96`);
    }
  }, []);

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
        paint();
      }
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf.current);
  }, [reduced, paint]);

  useEffect(() => {
    if (reduced) return;
    const el = stageRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        inView.current = entry.isIntersecting;
        if (entry.isIntersecting && !introDone.current) {
          introDone.current = true;
          angle.current = 14;
          vel.current = 0;
          targetAngle.current = 0;
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    const onVis = () => { tabActive.current = document.visibilityState === 'visible'; };
    document.addEventListener('visibilitychange', onVis);
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [reduced]);

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
    paint();
  };
  const onPointerUp = (e) => {
    if (!dragging.current) return;
    dragging.current = false;
    cardRef.current?.releasePointerCapture?.(e.pointerId);
    if (cardRef.current) {
      cardRef.current.style.cursor = canHover ? 'grab' : 'pointer';
      cardRef.current.style.transform = `translate3d(0,0,0) rotate(${angle.current}deg)`;
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

  const goContact = (e) => {
    e.stopPropagation();
    const el = document.getElementById('kontak');
    if (el) el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
  };

  return (
    <div
      ref={stageRef}
      className="idcard-stage relative mx-auto w-full max-w-[300px]"
      style={{ touchAction: 'pan-y', '--mx': '30%', '--my': '0%' }}
    >
      {/* Lanyard */}
      <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-0 flex w-[22px] -translate-x-1/2 flex-col items-center">
        <svg viewBox="0 0 100 96" preserveAspectRatio="none" className="h-[96px] w-[22px] md:h-[120px]">
          <path id={ropeId} ref={ropeRef} d="M50 0 Q50 55,50 96" stroke="#FF4B1F" strokeWidth="22" fill="none" />
          <text fontFamily="ui-monospace, monospace" fontSize="7" fill="rgba(255,255,255,0.7)" letterSpacing="1">
            <textPath href={`#${ropeId}`} startOffset="4">
              RANDI · DATA SCIENTIST · RANDI · DATA SCIENTIST ·
            </textPath>
          </text>
        </svg>
      </div>

      {/* Klip logam */}
      <div aria-hidden="true" className="absolute left-1/2 top-[92px] z-20 -translate-x-1/2 md:top-[116px]">
        <div className="clip-metal h-6 w-5 rounded-sm" />
      </div>

      {/* Kartu + holder */}
      <div className="relative z-10 pt-[104px] md:pt-[128px]">
        {/* wrapper berputar saat flip; berisi frame plastik di kedua sisi */}
        <div className="relative mx-auto w-[240px] md:w-[280px]">
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
            className="relative aspect-[5/8] w-full select-none [perspective:1200px]"
            style={{ cursor: canHover ? 'grab' : 'pointer', transformOrigin: '50% -6%' }}
          >
            <div data-flip className="relative h-full w-full [transform-style:preserve-3d]">
              {/* ===== SISI DEPAN ===== */}
              <div className="absolute inset-0 [backface-visibility:hidden]">
                <HolderFrame>
                  {/* slot klip */}
                  <div className="absolute left-1/2 top-1.5 z-30 h-2 w-6 -translate-x-1/2 rounded-full border border-neutral-500/40 bg-neutral-400/30" />
                  <div className="relative h-full overflow-hidden rounded-[20px] bg-white shadow-[0_1px_0_#d4d4d4,0_2px_0_#c4c4c4,inset_0_0_0_1px_#e5e5e5]">
                    {/* band oranye */}
                    <div className="flex h-12 items-center gap-2 bg-accent px-3">
                      <span className="grid h-6 w-6 place-items-center rounded-full bg-white">
                        <LogoMark className="h-3.5 w-3.5 text-accent" />
                      </span>
                      <span className="font-mono text-[10px] tracking-widest text-white">
                        PENS · SAINS DATA TERAPAN
                      </span>
                    </div>

                    <div className="px-4 pt-3">
                      <img
                        ref={photoRef}
                        src={profile.portrait}
                        alt="Foto Randi Nandika Danendra"
                        loading="eager"
                        className="aspect-square w-full rounded-xl object-cover object-top"
                      />
                      <h3 className="mt-3 font-sans text-lg font-semibold leading-tight text-neutral-900">
                        {profile.name}
                      </h3>
                      <p className="mt-1 font-mono text-[12px] text-accent">
                        Data Scientist · AI Engineer
                      </p>

                      {/* baris ID + segel holografik */}
                      <div className="mt-3 flex items-center justify-between">
                        <div className="leading-tight">
                          <p className="font-mono text-[10px] text-neutral-500">NRP 3324600013</p>
                          <p className="font-mono text-[10px] text-neutral-500">ANGKATAN 2024</p>
                        </div>
                        <div
                          aria-hidden="true"
                          className="grid h-11 w-11 shrink-0 place-items-center rounded-full border-2 border-white"
                          style={{
                            background:
                              'conic-gradient(from calc(var(--mx,30%) * 2), #FFB37A, #C9A7FF, #9AD0FF, #A8F0D6, #FFB37A)',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                          }}
                        >
                          <span className="font-display text-sm font-extrabold text-white drop-shadow">R</span>
                        </div>
                      </div>

                      {/* bar status */}
                      <button
                        type="button"
                        aria-label="Buka kontak, tersedia untuk magang"
                        onClick={goContact}
                        onMouseEnter={() => setBadgeHover(true)}
                        onMouseLeave={() => setBadgeHover(false)}
                        className="status-bar group relative mt-3 flex h-9 w-full items-center justify-center gap-2 overflow-hidden rounded-xl font-mono text-[11px] font-bold tracking-widest text-white transition-transform duration-200"
                        style={{
                          background: 'linear-gradient(90deg, #16A34A, #22C55E)',
                          transform: badgeHover ? 'scale(1.02)' : 'scale(1)',
                        }}
                      >
                        <span className="relative flex h-2 w-2">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
                          <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
                        </span>
                        <span>{badgeHover && canHover ? 'HUBUNGI SAYA →' : 'OPEN TO INTERNSHIP'}</span>
                        <span aria-hidden="true" className="status-shine" />
                      </button>
                    </div>

                    {/* footer marquee */}
                    <div className="absolute inset-x-0 bottom-0 flex h-6 items-center overflow-hidden rounded-b-[20px] bg-ink-dark">
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
                  <div className="relative h-full overflow-hidden rounded-[20px] bg-ink-dark shadow-[0_1px_0_#d4d4d4,0_2px_0_#c4c4c4,inset_0_0_0_1px_#333]">
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0"
                      style={{
                        backgroundImage:
                          'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.06) 1px, transparent 0)',
                        backgroundSize: '20px 20px',
                      }}
                    />
                    <div className="h-1.5 w-full bg-accent" />
                    <div className="relative px-5 py-4">
                      <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-500">Skills</p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {SKILLS.map((s) => (
                          <span key={s} className="rounded-full border border-white/15 px-2.5 py-1 font-mono text-xs text-white">
                            {s}
                          </span>
                        ))}
                      </div>

                      <div className="my-4 h-px w-full bg-white/10" />

                      <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-500">Fokus</p>
                      <p className="mt-2 text-sm leading-relaxed text-neutral-300">
                        Analisis data, machine learning, dan visualisasi untuk membantu pengambilan keputusan.
                      </p>

                      <p className="mt-4 font-mono text-[10px] uppercase tracking-widest text-neutral-500">Kontak</p>
                      <div className="mt-2 grid grid-cols-2 gap-[10px]">
                        <a
                          href={profile.linkedin || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          data-cursor="buka"
                          className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-2.5 text-sm text-white transition-all hover:-translate-y-0.5 hover:border-accent hover:text-accent"
                        >
                          <LinkedInIcon /> LinkedIn
                        </a>
                        <a
                          href={profile.github || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          data-cursor="buka"
                          className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-2.5 text-sm text-white transition-all hover:-translate-y-0.5 hover:border-accent hover:text-accent"
                        >
                          <GitHubIcon /> GitHub
                        </a>
                      </div>
                    </div>

                    {/* footer marquee */}
                    <div className="absolute inset-x-0 bottom-0 flex h-6 items-center overflow-hidden rounded-b-[20px] bg-[#141414]">
                      <div className="footer-marquee whitespace-nowrap font-mono text-[8px] text-white/50">
                        PENS · SAINS DATA TERAPAN · RANDI NANDIKA DANENDRA · PENS · SAINS DATA TERAPAN · RANDI NANDIKA DANENDRA ·
                      </div>
                    </div>
                  </div>
                </HolderFrame>
              </div>
            </div>

            {/* tombol balik di bawah kanan */}
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
