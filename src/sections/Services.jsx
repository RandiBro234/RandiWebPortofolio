import { Link } from 'react-router-dom';
import { services } from '../data/content';
import Reveal from '../components/Reveal';
import { ArrowIcon } from '../components/icons';
import { cn } from '../utils';

function CardVisual({ kind, featured }) {
  const stroke = featured ? '#FFFFFF' : '#FF4B1F';
  const faint = featured ? 'rgba(255,255,255,0.35)' : 'rgba(255,75,31,0.35)';

  if (kind === 'analysis') {
    return (
      <svg viewBox="0 0 220 120" className="h-36 w-full" aria-hidden="true">
        {[0, 1, 2, 3, 4].map((i) => (
          <rect key={i} x={16 + i * 38} y={100 - (20 + (i % 3) * 22)} width="22" height={20 + (i % 3) * 22} rx="5" fill={i === 2 ? stroke : faint} />
        ))}
      </svg>
    );
  }
  if (kind === 'ml') {
    return (
      <svg viewBox="0 0 220 120" className="h-36 w-full" aria-hidden="true">
        <polyline points="14,96 60,72 104,84 150,42 206,20" fill="none" stroke={stroke} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {[[14,96],[60,72],[104,84],[150,42],[206,20]].map(([x,y],i)=>(
          <circle key={i} cx={x} cy={y} r="4" fill={stroke} />
        ))}
        <rect x="14" y="14" width="52" height="20" rx="10" fill={faint} />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 220 120" className="h-36 w-full" aria-hidden="true">
      {['API','ETL','DB'].map((label, i) => (
        <g key={label}>
          <rect x={20 + i * 66} y={40} width="54" height="40" rx="12" fill={i === 1 ? stroke : faint} />
          <text x={47 + i * 66} y={65} textAnchor="middle" fontSize="12" fontWeight="700" fill={i === 1 ? '#111' : featured ? '#fff' : '#111'}>{label}</text>
        </g>
      ))}
      <g stroke={stroke} strokeWidth="2" fill="none">
        <path d="M74 60h14" />
        <path d="M140 60h14" />
      </g>
    </svg>
  );
}

function ServiceCard({ card, index }) {
  const { featured } = card;
  return (
    <Reveal delay={index * 90} className="h-full">
      <Link
        to={card.to}
        data-cursor="Buka"
        className={cn(
          'group flex h-full flex-col rounded-card p-5 transition-transform duration-300 hover:-translate-y-1 hover:rotate-[-1deg] md:p-6',
          featured ? 'bg-accent text-white' : 'bg-ink-soft text-white',
        )}
      >
        <span
          className={cn(
            'font-display text-xs font-bold',
            featured ? 'text-white/80' : 'text-accent',
          )}
        >
          {card.no}
        </span>
        <h3 className="mt-2 font-display text-xl font-extrabold">{card.title}</h3>
        <p className={cn('mt-2 text-[14px] leading-[1.6]', featured ? 'text-white/90' : 'text-white/65')}>
          {card.desc}
        </p>

        <div className="mt-5">
          <CardVisual kind={card.visual} featured={featured} />
        </div>

        <div className="mt-auto flex flex-wrap gap-1.5 pt-5">
          {card.tools.map((t) => (
            <span
              key={t}
              className={cn(
                'rounded-pill border px-2.5 py-0.5 text-[12px] font-medium',
                featured ? 'border-white/40 text-white' : 'border-white/15 text-white/75',
              )}
            >
              {t}
            </span>
          ))}
        </div>

        <div className="mt-5 flex justify-end">
          <span
            className={cn(
              'dock-arrow grid h-10 w-10 place-items-center rounded-full transition-colors',
              featured
                ? 'bg-white text-accent group-hover:bg-ink group-hover:text-white'
                : 'border border-white/20 text-white group-hover:border-accent group-hover:bg-accent',
            )}
          >
            <ArrowIcon size={16} />
          </span>
        </div>
      </Link>
    </Reveal>
  );
}

export default function Services() {
  return (
    <section id="layanan" className="section bg-paper px-5 md:px-8">
      <div className="mx-auto max-w-6xl rounded-card bg-ink p-6 text-white md:p-10">
        <div className="grid gap-4 border-b border-white/10 pb-6 lg:grid-cols-2 lg:items-end lg:gap-8">
          <h2 className="section-h2">
            {services.title} <span className="text-accent">{services.titleAccent}</span>
          </h2>
          <p className="section-sub text-white/70">{services.subtitle}</p>
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-3 lg:gap-6">
          {services.cards.map((card, i) => (
            <ServiceCard key={card.no} card={card} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
