import { Link } from 'react-router-dom';
import { ArrowIcon } from '../components/icons';
import { pages } from '../data/content';
import { usePageMeta } from '../hooks';

export default function NotFound() {
  usePageMeta(pages.notFound.title, pages.notFound.description);

  return (
    <div className="grid min-h-[70svh] place-items-center px-5 pt-28 md:pt-32">
      <div className="text-center">
        <p className="font-display text-[clamp(4rem,16vw,9rem)] font-extrabold leading-none text-accent">
          404
        </p>
        <h1 className="mt-4 font-display text-2xl font-extrabold">
          Halaman tidak ditemukan
        </h1>
        <p className="mx-auto mt-2 max-w-md text-[15px] text-muted">
          Sepertinya tautan yang Anda tuju tidak ada. Mari kembali ke jalur yang benar.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/"
            data-cursor="buka"
            className="inline-flex items-center gap-2 rounded-pill bg-accent px-6 py-3 text-[15px] font-semibold text-white transition-all hover:-translate-y-px hover:bg-[#e63f16]"
          >
            Ke Beranda
            <ArrowIcon size={16} />
          </Link>
          <Link
            to="/proyek"
            className="rounded-pill border border-line px-6 py-3 text-[15px] font-semibold text-ink transition-colors hover:border-accent hover:text-accent"
          >
            Lihat Projek
          </Link>
        </div>
      </div>
    </div>
  );
}
