import { useEffect, useRef, useState } from 'react';

export function useReveal(options = {}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -10% 0px', ...options },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [options]);

  return [ref, visible];
}

export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return reduced;
}

export function usePageMeta(title, description) {
  useEffect(() => {
    document.title = title;
    const set = (selector, attr, value) => {
      let el = document.head.querySelector(selector);
      if (!el) {
        el = document.createElement('meta');
        const [k, v] = attr;
        el.setAttribute(k, v);
        document.head.appendChild(el);
      }
      el.setAttribute('content', value);
    };
    if (description) {
      set('meta[name="description"]', ['name', 'description'], description);
      set('meta[property="og:description"]', ['property', 'og:description'], description);
      set('meta[name="twitter:description"]', ['name', 'twitter:description'], description);
    }
  }, [title, description]);
}

export function useScrollLock(active) {
  useEffect(() => {
    if (!active) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [active]);
}
