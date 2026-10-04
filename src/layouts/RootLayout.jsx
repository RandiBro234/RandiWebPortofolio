import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CustomCursor from '../components/CustomCursor';
import ScrollProgress from '../components/ScrollProgress';
import BackToTop from '../components/BackToTop';
import CommandPalette from '../components/CommandPalette';
import PageTransition from '../components/PageTransition';
import ErrorBoundary from '../components/ErrorBoundary';

export default function RootLayout({ children, showPanel, panelLabel }) {
  const [paletteOpen, setPaletteOpen] = useState(false);

  return (
    <div className="min-h-screen bg-paper">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[210] focus:rounded-pill focus:bg-ink focus:px-5 focus:py-2 focus:text-white"
      >
        Lewati ke konten
      </a>

      <ScrollProgress />
      <CustomCursor />
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
