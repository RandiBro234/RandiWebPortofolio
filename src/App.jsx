import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Layout from './layouts/RootLayout';
import CustomCursor from './components/CustomCursor';
import { useReducedMotion } from './hooks';

const Home = lazy(() => import('./pages/Home'));
const Projects = lazy(() => import('./pages/Projects'));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'));
const Tools = lazy(() => import('./pages/Tools'));
const Journey = lazy(() => import('./pages/Journey'));
const Contact = lazy(() => import('./pages/Contact'));
const NotFound = lazy(() => import('./pages/NotFound'));

function routeLabel(pathname) {
  if (pathname === '/') return 'Beranda';
  if (pathname.startsWith('/proyek/')) return 'Studi Kasus';
  if (pathname.startsWith('/proyek')) return 'Proyek';
  if (pathname.startsWith('/tools')) return 'Tools';
  if (pathname.startsWith('/journey')) return 'Journey';
  if (pathname.startsWith('/kontak')) return 'Kontak';
  return 'Randi';
}

function PageFallback() {
  return (
    <div className="grid min-h-full place-items-center py-32" aria-hidden="true">
      <span className="grid h-12 w-12 place-items-center rounded-full bg-accent font-display text-lg font-extrabold text-white">
        R
      </span>
    </div>
  );
}

// Waktu (ms) sinkron dengan keyframes PageTransition (desktop 0.9s, mobile 0.7s).
function transitionTimings() {
  const mobile =
    typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches;
  return mobile
    ? { cover: 252, total: 700 }
    : { cover: 288, total: 900 };
}

export default function App() {
  const location = useLocation();
  const reduced = useReducedMotion();

  // Lokasi yang sedang DITAMPILKAN. Dibekukan sampai panel selesai menutup,
  // supaya halaman lama tetap terlihat di balik panel, lalu baru ditukar.
  const [displayLocation, setDisplayLocation] = useState(location);
  const [showPanel, setShowPanel] = useState(false);
  const [panelLabel, setPanelLabel] = useState(routeLabel(location.pathname));
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }

    // Transisi hanya saat PATHNAME berubah (pindah halaman lewat navbar).
    // Perubahan query (mis. ?p=slug di /proyek) tidak memicu transisi.
    if (location.pathname === displayLocation.pathname) {
      setDisplayLocation(location);
      return;
    }

    const { cover, total } = transitionTimings();
    setPanelLabel(routeLabel(location.pathname));
    setShowPanel(true);

    const t1 = setTimeout(
      () => {
        setDisplayLocation(location);
        window.scrollTo({ top: 0, behavior: 'auto' });
      },
      reduced ? 100 : cover,
    );
    const t2 = setTimeout(() => setShowPanel(false), reduced ? 220 : total);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, reduced]);

  return (
    <Layout showPanel={showPanel} panelLabel={panelLabel}>
      <CustomCursor />
      <Suspense fallback={<PageFallback />}>
        <Routes location={displayLocation}>
          <Route index element={<Home />} />
          <Route path="proyek" element={<Projects />} />
          <Route path="proyek/:slug" element={<ProjectDetail />} />
          <Route path="tools" element={<Tools />} />
          <Route path="journey" element={<Journey />} />
          <Route path="kontak" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Layout>
  );
}
