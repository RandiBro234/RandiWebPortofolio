import { useEffect, useRef, useState } from 'react';
import { NavLink as RouterNavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { nav, profile } from '../data/content';
import LogoMark from './LogoMark';
import Magnetic from './Magnetic';
import { useIntro } from '../hooks';
import { cn } from '../utils';

function NavItem({ item, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'relative rounded-full px-3 py-1.5 text-[14px] font-medium transition-colors',
        active ? 'text-white' : 'text-white/70 hover:text-white',
      )}
    >
      {active && (
        <motion.span
          layoutId="nav-active-pill"
          className="absolute inset-0 -z-10 rounded-full bg-accent"
          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
        />
      )}
      {item.label}
    </button>
  );
}

export default function Navbar({ onOpenPalette }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { ready } = useIntro();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [location.pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    const onClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClick);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClick);
    };
  }, [open]);

  const isActive = (to) => {
    if (to === '/') return location.pathname === '/';
    return location.pathname.startsWith(to);
  };

  return (
    <motion.div
      ref={menuRef}
      className="fixed inset-x-0 top-3 z-[130] px-6 md:px-10"
      initial={false}
      animate={ready ? { y: 0, opacity: 1 } : { y: '-100%', opacity: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <header className="mx-auto w-full max-w-7xl">
        <nav          aria-label="Navigasi utama"
          data-scrolled={scrolled}
          className={cn(
            'nav-shell flex items-center justify-between rounded-full pl-2 pr-3 md:pl-3',
            scrolled ? 'h-[52px]' : 'h-14',
          )}
        >
          {/* logo kiri */}
          <RouterNavLink
            to="/"
            className="flex shrink-0 items-center gap-2 rounded-full py-1 pr-2"
            aria-label={`${profile.firstName}, ke Home`}
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent md:h-9 md:w-9">
              <LogoMark className="h-[42%] w-auto text-white" />
            </span>
            <span className="font-display text-[18px] text-white">
              {profile.firstName}
            </span>
          </RouterNavLink>

          {/* desktop */}
          <div className="hidden items-center gap-1 md:flex md:gap-2">
            {nav.links.map((item) => (
              <NavItem
                key={item.to}
                item={item}
                active={isActive(item.to)}
                onClick={() => navigate(item.to)}
              />
            ))}

            <button
              type="button"
              onClick={onOpenPalette}
              className="ml-1 hidden items-center gap-1.5 rounded-full border border-white/15 px-2.5 py-1.5 text-[12px] font-medium text-white/70 transition-colors hover:border-accent hover:text-accent lg:inline-flex"
              aria-label="Buka pencarian cepat"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
                <circle cx="11" cy="11" r="7" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              Ctrl K
            </button>

            <Magnetic className="ml-2">
              <button
                type="button"
                onClick={() => navigate(nav.cta.to)}
                className="inline-flex items-center gap-1 rounded-full bg-accent px-4 py-2 text-[14px] font-semibold text-white transition-all hover:-translate-y-px hover:bg-[#e63f16]"
              >
                {nav.cta.label}
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M7 17 17 7" />
                  <path d="M8 7h9v9" />
                </svg>
              </button>
            </Magnetic>
          </div>

          {/* hamburger */}
          <button
            type="button"
            aria-label={open ? 'Tutup menu' : 'Buka menu'}
            aria-expanded={open}
            aria-controls="menu-mobile"
            onClick={() => setOpen((v) => !v)}
            className="grid h-10 w-10 place-items-center rounded-full text-white md:hidden"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {open ? (
                <>
                  <path d="M6 6l12 12" />
                  <path d="M18 6 6 18" />
                </>
              ) : (
                <>
                  <path d="M4 7h16" />
                  <path d="M4 12h16" />
                  <path d="M4 17h16" />
                </>
              )}
            </svg>
          </button>
        </nav>

        {open && (
          <div
            id="menu-mobile"
            className="mt-2 overflow-hidden rounded-3xl border border-white/10 bg-ink/95 p-2 shadow-xl backdrop-blur md:hidden"
          >
            {nav.links.map((item) => (
              <RouterNavLink
                key={item.to}
                to={item.to}
                aria-current={isActive(item.to) ? 'page' : undefined}
                className={cn(
                  'flex min-h-[44px] items-center rounded-2xl px-4 text-base font-medium hover:bg-white/5',
                  isActive(item.to) ? 'text-accent' : 'text-white/85',
                )}
              >
                {item.label}
              </RouterNavLink>
            ))}
            <RouterNavLink
              to={nav.cta.to}
              className="mt-1 flex min-h-[44px] items-center justify-center rounded-full bg-accent px-4 text-base font-semibold text-white"
            >
              {nav.cta.label}
            </RouterNavLink>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                onOpenPalette();
              }}
              className="mt-1 flex min-h-[44px] w-full items-center justify-center rounded-full border border-white/15 px-4 text-base font-medium text-white/80"
            >
              Cari (Ctrl K)
            </button>
          </div>
        )}
      </header>
    </motion.div>
  );
}
