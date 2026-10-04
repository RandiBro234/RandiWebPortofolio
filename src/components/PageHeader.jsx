import { motion } from 'framer-motion';

export default function PageHeader({ eyebrow, title, titleAccent, subtitle }) {
  return (
    <motion.header
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="mx-auto max-w-6xl"
    >
      {eyebrow && (
        <p className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted">
          <span className="h-2 w-2 rounded-full bg-accent" aria-hidden="true" />
          {eyebrow}
        </p>
      )}
      <h1 className="section-h2">
        {title} {titleAccent && <span className="text-accent">{titleAccent}</span>}
      </h1>
      {subtitle && (
        <p className="section-sub mt-4 text-muted">{subtitle}</p>
      )}
    </motion.header>
  );
}
