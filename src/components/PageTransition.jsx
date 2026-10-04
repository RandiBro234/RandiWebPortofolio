import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '../hooks';

// Panel oranye menyapu dari bawah ke atas, menampilkan label tujuan di tengah.
// Durasi lebih pendek di layar kecil supaya transisi terasa ringan/smooth di mobile.
export default function PageTransition({ label, onComplete }) {
  const reduced = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  if (reduced) {
    return (
      <motion.div
        aria-hidden="true"
        className="fixed inset-0 z-[150] bg-accent"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 0.2, times: [0, 0.5, 1] }}
        onAnimationComplete={onComplete}
      />
    );
  }

  const duration = isMobile ? 0.7 : 0.9;
  const times = isMobile ? [0, 0.36, 0.56, 1] : [0, 0.32, 0.55, 1];

  return (
    <motion.div
      aria-hidden="true"
      className="fixed inset-0 z-[150] flex items-center justify-center bg-accent"
      style={{ willChange: 'transform', transform: 'translateZ(0)' }}
      initial={{ y: '100%' }}
      animate={{ y: ['100%', '0%', '0%', '-100%'] }}
      transition={{ duration, times, ease: [0.76, 0, 0.24, 1] }}
      onAnimationComplete={onComplete}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: [0, 1, 1, 0], scale: [0.9, 1, 1, 0.95] }}
        transition={{ duration, times }}
        className="flex items-center gap-3 text-white"
      >
        <span className="grid h-12 w-12 place-items-center rounded-full bg-white font-display text-lg font-extrabold text-accent">
          R
        </span>
        <span className="font-display text-3xl font-extrabold">{label}</span>
      </motion.div>
    </motion.div>
  );
}
