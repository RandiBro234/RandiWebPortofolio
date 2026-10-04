import { useEffect, useRef, useState } from 'react';

export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [label, setLabel] = useState(null);
  const raf = useRef(0);

  useEffect(() => {
    const finePointer =
      window.matchMedia('(pointer: fine)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!finePointer) return;
    setEnabled(true);

    const move = (e) => {
      cancelAnimationFrame(raf.current);
      raf.current = requestAnimationFrame(() => {
        setPos({ x: e.clientX, y: e.clientY });
        const target = e.target.closest?.('[data-cursor]');
        setLabel(target ? target.getAttribute('data-cursor') : null);
      });
    };
    window.addEventListener('mousemove', move);
    return () => {
      window.removeEventListener('mousemove', move);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  if (!enabled) return null;

  const active = Boolean(label);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed z-[190] hidden md:block"
      style={{ left: pos.x, top: pos.y, transform: 'translate(-50%, -50%)' }}
    >
      <div
        className="flex items-center justify-center rounded-full border-2 border-accent font-sans text-[11px] font-semibold text-white transition-all duration-200 ease-out"
        style={{
          minWidth: active ? 56 : 16,
          height: active ? 56 : 16,
          padding: active ? '0 12px' : 0,
          backgroundColor: active ? 'var(--color-accent)' : 'transparent',
        }}
      >
        {active ? label : ''}
      </div>
    </div>
  );
}
