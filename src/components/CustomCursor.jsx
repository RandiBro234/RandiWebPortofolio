import { useEffect, useRef, useState } from 'react';

// Kursor kustom: satu lingkaran yang mengikuti mouse.
// Saat di atas elemen interaktif, lingkaran membesar, terisi oranye penuh,
// dan label teks tampil DI DALAM lingkaran (dari atribut data-cursor).
// Hanya di perangkat mouse presisi (hover: hover) and (pointer: fine).
export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const ref = useRef(null);
  const textRef = useRef(null);
  const target = useRef({ x: -100, y: -100 });
  const pos = useRef({ x: -100, y: -100 });
  const raf = useRef(0);
  const hover = useRef(false);
  const visible = useRef(false);
  const label = useRef('');

  useEffect(() => {
    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!canHover) return;
    setEnabled(true);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const lerp = (a, b, n) => a + (b - a) * n;

    const onMove = (e) => {
      target.current = { x: e.clientX, y: e.clientY };
      const el = e.target.closest?.('a, button, [data-cursor]');
      hover.current = Boolean(el);
      label.current = el?.getAttribute('data-cursor') || '';
      visible.current = true;
    };
    const onLeave = () => { visible.current = false; };
    const onEnter = () => { visible.current = true; };

    const tick = () => {
      pos.current.x = lerp(pos.current.x, target.current.x, 0.2);
      pos.current.y = lerp(pos.current.y, target.current.y, 0.2);
      const el = ref.current;
      if (el) {
        el.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0) translate(-50%, -50%)`;
        el.dataset.hover = hover.current && !!label.current ? 'true' : 'false';
        el.style.opacity = visible.current ? '1' : '0';
      }
      if (textRef.current) textRef.current.textContent = label.current;
      raf.current = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', onEnter);
    raf.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
      cancelAnimationFrame(raf.current);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={ref}
      aria-hidden="true"
      data-hover="false"
      className="cursor-blob pointer-events-none fixed left-0 top-0 z-[199] rounded-full opacity-0"
    >
      <span ref={textRef} className="cursor-blob__text" />
    </div>
  );
}

