import { footer, profile } from '../data/content';
import { ArrowIcon } from './icons';
import LogoMark from './LogoMark';

const socials = [
  { label: 'Email', href: `mailto:${profile.email}` },
  { label: 'WhatsApp', href: profile.whatsappLink },
  { label: 'LinkedIn', href: profile.linkedin },
  { label: 'GitHub', href: profile.github },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-ink px-5 py-6 text-white/70 md:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent">
              <LogoMark className="h-4 w-4 text-white" />
            </span>
            <span className="font-display text-[15px] font-bold text-white">
              {profile.name}
            </span>
          </div>
          <p className="mt-1.5 max-w-md text-[13px]">{footer.note}</p>
        </div>

        <nav aria-label="Tautan sosial" className="flex flex-wrap gap-2">
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target={s.href.startsWith('http') ? '_blank' : undefined}
              rel={s.href.startsWith('http') ? 'noreferrer' : undefined}
              className="inline-flex items-center gap-1.5 rounded-pill border border-white/15 px-3.5 py-1.5 text-[13px] font-medium text-white/80 transition-colors hover:border-accent hover:text-accent"
            >
              {s.label}
              <ArrowIcon size={13} />
            </a>
          ))}
        </nav>
      </div>
      <p className="mx-auto mt-5 max-w-6xl text-[13px] text-white/40">
        {footer.copyright}
      </p>
    </footer>
  );
}
