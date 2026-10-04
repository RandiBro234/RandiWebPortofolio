import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useReducedMotion } from '../hooks';
import { cn } from '../utils';

// Tombol magnetik: ikut tertarik sedikit ke arah kursor.
export default function Magnetic({ children, className, strength = 12, as: Tag = 'div' }) {
  const reduced = useReducedMotion();
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 250, damping: 18 });
  const sy = useSpring(y, { stiffness: 250, damping: 18 });
  const tx = useTransform(sx, (v) => v);
  const ty = useTransform(sy, (v) => v);

  const onMove = (e) => {
    if (reduced || !ref.current) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;
    const r = ref.current.getBoundingClientRect();
    x.set(((e.clientX - (r.left + r.width / 2)) / r.width) * strength);
    y.set(((e.clientY - (r.top + r.height / 2)) / r.height) * strength);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  const MotionTag = motion[Tag] || motion.div;

  return (
    <MotionTag
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={{ x: tx, y: ty }}
      className={cn(className)}
    >
      {children}
    </MotionTag>
  );
}
