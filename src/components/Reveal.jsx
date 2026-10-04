import { useReveal } from '../hooks';
import { cn } from '../utils';

export default function Reveal({ children, className, delay = 0, as: Tag = 'div' }) {
  const [ref, visible] = useReveal();
  return (
    <Tag
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={cn('reveal-up', visible && 'is-visible', className)}
    >
      {children}
    </Tag>
  );
}
