import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ScrollProgress from '../components/ScrollProgress';
import BackToTop from '../components/BackToTop';
import CommandPalette from '../components/CommandPalette';
import PageTransition from '../components/PageTransition';
import ErrorBoundary from '../components/ErrorBoundary';

export default function RootLayout({ children, showPanel, panelLabel }) {
  const [paletteOpen, setPaletteOpen] = useState(false);

  // Pause animasi CSS berulang saat tab tidak aktif.
  useEffect(() => {
    const onVis = () => {
      document.documentElement.classList.toggle('tab-hidden', document.hidden);
    };
    onVis();
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);

  return (
    <div className="min-h-screen bg-paper">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[210] focus:rounded-pill focus:bg-ink focus:px-5 focus:py-2 focus:text-white"
      >
        Lewati ke konten
      </a>

      <ScrollProgress />
      <Navbar onOpenPalette={() => setPaletteOpen(true)} />
      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />

      {showPanel && <PageTransition label={panelLabel} />}

      <ErrorBoundary>
        <main id="main">{children}</main>
      </ErrorBoundary>

      <BackToTop />
      <Footer />
    </div>
  );
}
