import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../hooks';
import { cn } from '../utils';

// Tombol magnetik: bergeser maksimal 8px ke arah kursor saat kursor berada
// dalam radius ~80px dari tombol. Nonaktif di perangkat touch & reduced-motion.
const RADIUS = 80;
const MAX_SHIFT = 8;

export default function Magnetic({ children, className }) {
  const reduced = useReducedMotion();
  const [allowed, setAllowed] = useState(false);
  const ref = useRef(null);
  const raf = useRef(0);

  useEffect(() => {
    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    setAllowed(canHover && !reduced);
  }, [reduced]);

  useEffect(() => {
    if (!allowed) return;

    const onMove = (e) => {
      cancelAnimationFrame(raf.current);
      raf.current = requestAnimationFrame(() => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        const dist = Math.hypot(dx, dy);
        const reach = Math.max(r.width, r.height) / 2 + RADIUS;

        if (dist <= reach) {
          const pull = 1 - dist / reach;
          const halfW = r.width / 2 || 1;
          const halfH = r.height / 2 || 1;
          const clamp = (v) => Math.max(-MAX_SHIFT, Math.min(MAX_SHIFT, v));
          const tx = clamp(dx * pull * (MAX_SHIFT / halfW));
          const ty = clamp(dy * pull * (MAX_SHIFT / halfH));
          el.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
        } else {
          el.style.transform = 'translate3d(0, 0, 0)';
        }
      });
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf.current);
      if (ref.current) ref.current.style.transform = 'translate3d(0, 0, 0)';
    };
  }, [allowed]);

  return (
    <div
      ref={ref}
      className={cn('inline-block will-change-transform', className)}
      style={{ transition: 'transform 300ms ease-out' }}
    >
      {children}
    </div>
  );
}
