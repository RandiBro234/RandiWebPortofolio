import { motion } from 'framer-motion';
import { cn } from '../utils';

export default function SectionHeading({
  eyebrow,
  title,
  titleAccent,
  titleTail = '',
  subtitle,
  align = 'left',
  dark = false,
  className,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'max-w-xl',
        align === 'center' && 'mx-auto text-center',
        className,
      )}
    >
      {eyebrow && (
        <p
          className={cn(
            'mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em]',
            dark ? 'text-white/60' : 'text-muted',
          )}
        >
          <span className="h-2 w-2 rounded-full bg-accent" aria-hidden="true" />
          {eyebrow}
        </p>
      )}
      <h2
        className={cn(
          'section-h2',
          dark ? 'text-white' : 'text-ink',
        )}
      >
        {title} {titleAccent && <span className="text-accent">{titleAccent}</span>}
        {titleTail}
      </h2>
      {subtitle && (
        <p
          className={cn(
            'section-sub mt-4',
            dark ? 'text-white/70' : 'text-muted',
          )}
        >
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
