import { Link } from 'react-router-dom';
import { ArrowIcon } from './icons';

// Blok contoh per tahap "Alur Kerja": label kecil + kartu-kartu contoh.
// Tiap kartu bisa jadi link ke halaman proyek bila punya `slug`.
export default function ExampleCards({ label, items = [] }) {
  if (!items.length) return null;

  return (
    <div className="@container mt-3">
      <p className="mb-3 font-mono text-xs uppercase tracking-widest text-neutral-500">
        {label}
      </p>

      <div className="grid grid-cols-1 gap-[10px] @min-[600px]:grid-cols-3 @min-[600px]:gap-3">
        {items.map((item) => {
          const content = (
            <>
              <p className="text-sm font-medium leading-[1.4] text-neutral-800 md:text-base">
                {item.text}
              </p>

              <div className="mt-auto flex flex-wrap gap-2 pt-3">
                <span className="inline-flex w-fit items-center rounded-full bg-[#FF4B1F]/10 px-2.5 py-0.5 font-mono text-xs text-[#FF4B1F]">
                  {item.project}
                </span>
              </div>

              {item.slug && (
                <ArrowIcon
                  size={16}
                  className="example-card__arrow absolute right-3 top-3 text-neutral-400 transition-transform duration-200"
                />
              )}
            </>
          );

          const cls =
            'example-card group relative flex h-full flex-col rounded-2xl border border-neutral-200 bg-white px-[16px] py-[14px] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#FF4B1F]/40';

          if (item.slug) {
            return (
              <Link
                key={item.project}
                to={`/proyek/${item.slug}`}
                data-cursor="lihat"
                className={cls}
              >
                {content}
              </Link>
            );
          }

          return (
            <div key={item.project} className={cls}>
              {content}
            </div>
          );
        })}
      </div>
    </div>
  );
}
