import { useEffect, useState } from 'react';
import { useReducedMotion } from '../hooks';

export default function Typewriter({ phrases, className }) {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [text, setText] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (reduced) {
      setText(phrases[0]);
      return;
    }
    const current = phrases[index % phrases.length];
    const typing = !deleting;
    const delay = deleting ? 35 : typing ? 55 : 1600;
    const atFull = typing && text === current;
    const atEmpty = deleting && text === '';

    const timer = setTimeout(() => {
      if (atFull) {
        setDeleting(true);
      } else if (atEmpty) {
        setDeleting(false);
        setIndex((i) => (i + 1) % phrases.length);
      } else {
        setText(
          typing
            ? current.slice(0, text.length + 1)
            : current.slice(0, text.length - 1),
        );
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [text, deleting, index, phrases, reduced]);

  return (
    <span className={className}>
      {text}
      <span className="ml-0.5 inline-block h-[1em] w-[3px] translate-y-[2px] animate-pulse bg-accent align-middle" aria-hidden="true" />
    </span>
  );
}
