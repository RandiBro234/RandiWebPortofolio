import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { nav, profile, projects } from '../data/content';
import { copyText } from '../utils';

export default function CommandPalette({ open, onOpenChange }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [index, setIndex] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        onOpenChange((v) => !v);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onOpenChange]);

  useEffect(() => {
    if (open) {
      setQuery('');
      setIndex(0);
      setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [open]);

  const showCopied = async () => {
    try {
      await copyText(profile.email);
    } catch {
      /* diamkan jika clipboard tidak tersedia */
    }
  };

  const items = useMemo(() => {
    const pageItems = [
      ...nav.links.map((l) => ({ label: l.label, hint: 'Halaman', to: l.to })),
      { label: 'Kontak', hint: 'Halaman', to: nav.cta.to },
    ];
    const projectItems = projects.map((p) => ({
      label: p.title,
      hint: 'Projek',
      to: `/proyek/${p.id}`,
    }));
    const actionItems = [
      { label: 'Unduh CV', hint: 'Aksi', href: profile.cvPath, download: true },
      { label: 'Salin Email', hint: 'Aksi', action: showCopied },
      { label: 'Kirim Email', hint: 'Aksi', href: `mailto:${profile.email}` },
    ];
    return [...pageItems, ...projectItems, ...actionItems];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((it) => it.label.toLowerCase().includes(q));
  }, [items, query]);

  const run = (item) => {
    onOpenChange(false);
    if (item.to) return navigate(item.to);
    if (item.action) return item.action();
    if (item.href) return window.open(item.href, item.download ? '_blank' : '_self');
  };

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const item = filtered[index];
      if (item) run(item);
    } else if (e.key === 'Escape') {
      onOpenChange(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-start justify-center bg-ink/50 p-4 pt-[12vh] backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => onOpenChange(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Command palette"
        >
          <motion.div
            initial={{ y: -12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -12, opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg overflow-hidden rounded-2xl border border-line bg-white shadow-2xl"
          >
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setIndex(0);
              }}
              onKeyDown={onKeyDown}
              placeholder="Cari halaman, proyek, atau aksi..."
              aria-label="Cari"
              className="w-full border-b border-line px-5 py-4 text-[15px] outline-none"
            />
            <ul className="max-h-[52vh] overflow-y-auto p-2">
              {filtered.length === 0 && (
                <li className="px-4 py-6 text-center text-[14px] text-muted">
                  Tidak ada hasil untuk "{query}"
                </li>
              )}
              {filtered.map((item, i) => (
                <li key={`${item.label}-${i}`}>
                  <button
                    type="button"
                    onMouseEnter={() => setIndex(i)}
                    onClick={() => run(item)}
                    className={`flex w-full items-center justify-between rounded-xl px-4 py-2.5 text-left text-[15px] ${
                      i === index ? 'bg-accent text-white' : 'text-ink hover:bg-paper'
                    }`}
                  >
                    <span>{item.label}</span>
                    <span
                      className={`text-[11px] uppercase tracking-wider ${
                        i === index ? 'text-white/70' : 'text-muted'
                      }`}
                    >
                      {item.hint}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
            <div className="flex items-center gap-3 border-t border-line px-5 py-2.5 text-[11px] text-muted">
              <span>↑↓ navigasi</span>
              <span>⏎ pilih</span>
              <span>esc tutup</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
