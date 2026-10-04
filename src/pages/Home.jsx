import { Link } from 'react-router-dom';
import Hero from '../sections/Hero';
import Journey from '../sections/Journey';
import Services from '../sections/Services';
import Reveal from '../components/Reveal';
import { ArrowIcon } from '../components/icons';
import { pages } from '../data/content';
import { usePageMeta } from '../hooks';

export default function Home() {
  usePageMeta(pages.home.title, pages.home.description);

  return (
    <>
      <h1 className="sr-only">Randi Nandika Danendra, Data Scientist</h1>
      <Hero />
      <Journey />
      <Services />

      <section className="bg-paper px-5 pb-16 md:px-8 md:pb-24">
        <Reveal className="mx-auto max-w-6xl">
          <div className="flex flex-col items-start gap-5 rounded-card border border-line bg-white p-6 md:flex-row md:items-center md:justify-between md:p-8">
            <div>
              <h2 className="font-display text-xl font-extrabold">
                Lihat bagaimana ceritanya berjalan di proyek nyata
              </h2>
              <p className="mt-1 text-[15px] text-muted">
                Tiga studi kasus end-to-end, dari pertanyaan sampai hasil.
              </p>
            </div>
            <Link
              to="/proyek"
              data-cursor="Buka"
              className="inline-flex shrink-0 items-center gap-2 rounded-pill bg-accent px-6 py-3 text-[15px] font-semibold text-white transition-all hover:-translate-y-px hover:bg-[#e63f16]"
            >
              Lihat Proyek
              <ArrowIcon size={16} />
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
