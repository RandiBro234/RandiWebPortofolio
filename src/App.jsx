import { lazy, Suspense, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Layout from './layouts/RootLayout';
import Preloader from './components/Preloader';
import ErrorBoundary from './components/ErrorBoundary';
import { IntroContext, useReducedMotion } from './hooks';
import { intro } from './data/content';

const Home = lazy(() => import('./pages/Home'));
const Projects = lazy(() => import('./pages/Projects'));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'));
const Tools = lazy(() => import('./pages/Tools'));
const Journey = lazy(() => import('./pages/Journey'));
const Contact = lazy(() => import('./pages/Contact'));
const NotFound = lazy(() => import('./pages/NotFound'));

function routeLabel(pathname) {
  if (pathname === '/') return 'Home';
  if (pathname.startsWith('/proyek/')) return 'Studi Kasus';
  if (pathname.startsWith('/proyek')) return 'Projek';
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

  // Preloader tampil di SETIAP pemuatan penuh (kunjungan pertama, refresh,
  // atau buka langsung URL apa pun). Tidak pernah untuk navigasi dalam aplikasi.
  // Perpindahan POP (back/forward) memakai transisi rute biasa.

  // Deteksi pemuatan penuh: preloader ditampilkan di setiap full load,
  // dan tidak pernah untuk navigasi dalam aplikasi.
  const [showPreloader, setShowPreloader] = useState(() => {
    if (typeof window === 'undefined') return false;
    if (reduced) return false;
    return intro.aktif !== false;
  });
  const [introReady, setIntroReady] = useState(false);
  const [introSeen, setIntroSeen] = useState(false);

  // Selalu kunci restore scroll ke manual; scroll dikunci selama preloader,
  // posisi halaman tidak diubah (tetap di posisi yang benar).
  useLayoutEffect(() => {
    if ('scrollRestoration' in window.history) {
      try {
        window.history.scrollRestoration = 'manual';
      } catch {
        /* abaikan */
      }
    }
  }, []);

  // Jaring pengaman: apa pun yang terjadi, preloader dihapus dan intro selesai
  // paling lambat durasiMaks + 1500ms. Juga memastikan scroll tidak terkunci.
  useEffect(() => {
    if (!showPreloader) return;
    const t = setTimeout(() => {
      setShowPreloader(false);
      setIntroReady(true);
      setIntroSeen(true);
      document.body.style.overflow = '';
    }, intro.durasiMaks + 1500);
    return () => clearTimeout(t);
  }, [showPreloader]);

  const handleIntroDone = () => {
    setIntroReady(true);
    setIntroSeen(true);
  };

  const handlePreloaderError = () => {
    setShowPreloader(false);
    setIntroReady(true);
    setIntroSeen(true);
    document.body.style.overflow = '';
  };

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
    // Transisi rute dan animasi masuk ditunda sampai intro selesai.
    if (!introSeen) return;
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
  }, [location.pathname, reduced, introSeen]);

  // Pindahkan fokus ke heading halaman setelah intro selesai (aksesibilitas).
  useEffect(() => {
    if (!introReady) return;
    const t = setTimeout(() => {
      const h1 = document.querySelector('main h1');
      if (h1 && !h1.hasAttribute('tabindex')) {
        h1.setAttribute('tabindex', '-1');
        h1.style.outline = 'none';
      }
      h1?.focus({ preventScroll: true });
    }, 450);
    return () => clearTimeout(t);
  }, [introReady, displayLocation]);

  return (
    <IntroContext.Provider value={{ ready: introReady, stage: introReady ? 1 : 0 }}>
      {showPreloader && (
        <ErrorBoundary silent onError={handlePreloaderError}>
          <Preloader
            onDone={handleIntroDone}
            onFinish={() => setShowPreloader(false)}
          />
        </ErrorBoundary>
      )}
      <Layout showPanel={showPanel} panelLabel={panelLabel}>
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
    </IntroContext.Provider>
  );
}
