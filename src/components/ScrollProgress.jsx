import { useEffect, useRef } from 'react';

export default function ScrollProgress() {
  const barRef = useRef(null);
  const raf = useRef(0);

  useEffect(() => {
    const update = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      const p = max > 0 ? h.scrollTop / max : 0;
      if (barRef.current) barRef.current.style.transform = `scaleX(${p})`;
    };
    const onScroll = () => {
      cancelAnimationFrame(raf.current);
      raf.current = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-[120] h-[3px] bg-transparent"
    >
      <div
        ref={barRef}
        className="h-full origin-left bg-accent will-change-transform"
        style={{ transform: 'scaleX(0)' }}
      />
    </div>
  );
}
