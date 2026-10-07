import { motion } from 'framer-motion';
import { useIntro, useReducedMotion } from '../hooks';

export default function PageHeader({ eyebrow, title, titleAccent, subtitle }) {
  const { ready } = useIntro();
  const reduced = useReducedMotion();

  return (
    <motion.header
      initial={reduced ? false : { opacity: 0 }}
      animate={reduced || ready ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="mx-auto max-w-6xl"
    >
      {eyebrow && (
        <p className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted">
          <span className="h-2 w-2 rounded-full bg-accent" aria-hidden="true" />
          {eyebrow}
        </p>
      )}
      <div className="overflow-hidden">
        <motion.h1
          className="section-h2"
          initial={reduced ? false : { y: '110%' }}
          animate={reduced || ready ? { y: '0%' } : { y: '110%' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          {title} {titleAccent && <span className="text-accent">{titleAccent}</span>}
        </motion.h1>
      </div>
      {subtitle && (
        <p className="section-sub mt-4 text-muted">{subtitle}</p>
      )}
    </motion.header>
  );
}
