import { motion } from 'framer-motion';
import { useIntro, useReducedMotion } from '../hooks';

// Pembungkus konten halaman: judul mask-reveal lalu fade-up, dipicu dari sinyal intro.
export function EntryTitle({ children }) {
  const { ready } = useIntro();
  const reduced = useReducedMotion();

  if (reduced) {
    return (
      <motion.div
        initial={false}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className="overflow-hidden">
      <motion.div
        initial={{ y: '110%' }}
        animate={ready ? { y: '0%' } : { y: '110%' }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </div>
  );
}

// Fade-up dengan stagger untuk konten di bawah judul.
export function EntryFade({ children, delay = 0, className }) {
  const { ready } = useIntro();
  const reduced = useReducedMotion();

  if (reduced) {
    return (
      <motion.div
        initial={false}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        className={className}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
