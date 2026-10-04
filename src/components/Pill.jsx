import { cn } from '../utils';

const styles = {
  solid:
    'bg-accent text-white hover:bg-ink transition-colors',
  outline:
    'border border-line text-ink hover:border-accent hover:text-accent bg-transparent transition-colors',
  dark: 'bg-ink text-white hover:bg-accent transition-colors',
};

export default function Pill({
  as: Tag = 'a',
  variant = 'solid',
  className,
  children,
  ...rest
}) {
  return (
    <Tag
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-pill px-6 py-3 text-sm font-semibold tracking-tight',
        styles[variant],
        className,
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
}
