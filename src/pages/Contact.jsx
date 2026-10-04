import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowIcon } from '../components/icons';
import { contact, profile, pages } from '../data/content';
import { usePageMeta } from '../hooks';
import { copyText } from '../utils';

function CopyButton({ value }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef(null);

  const onCopy = async () => {
    try {
      await copyText(value);
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard tidak tersedia */
    }
  };

  useEffect(() => () => clearTimeout(timer.current), []);

  return (
    <button
      type="button"
      onClick={onCopy}
      data-cursor="salin"
      className="rounded-pill border border-line px-3.5 py-2 text-[13px] font-semibold text-ink transition-colors hover:border-accent hover:text-accent"
    >
      {copied ? contact.copiedCta : contact.copyCta}
    </button>
  );
}

function ContactCard({ label, value, icon, actions }) {
  return (
    <div
      data-cursor="buka"
      className="group flex flex-col rounded-card border border-line bg-white p-5 transition-transform duration-300 hover:-translate-y-1 hover:rotate-[-0.5deg]"
    >
      <div className="flex items-center gap-2 text-accent">{icon}<span className="text-[13px] font-semibold uppercase tracking-wider">{label}</span></div>
      <p className="mt-3 flex-1 break-words text-[15px] font-medium text-ink">{value}</p>
      <div className="mt-4 flex flex-wrap gap-2">{actions}</div>
    </div>
  );
}

const IconMail = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </svg>
);
const IconChat = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
    <path d="M21 12a8 8 0 0 1-11.3 7.2L4 20l1-5.7A8 8 0 1 1 21 12z" />
  </svg>
);
const IconLinkedIn = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M4.98 3.5A2.5 2.5 0 1 1 5 8.5a2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05C20.4 8.65 21 11 21 14.1V21h-4v-6.1c0-1.45-.03-3.3-2-3.3s-2.3 1.57-2.3 3.2V21H9z" />
  </svg>
);
const IconGitHub = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.99 1.03-2.69-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.6 9.6 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.6 1.03 2.69 0 3.84-2.34 4.69-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2z" />
  </svg>
);
const IconDownload = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 4v11" />
    <path d="m7 11 5 5 5-5" />
    <path d="M5 20h14" />
  </svg>
);

function MessageForm() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Nama wajib diisi.';
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) e.email = 'Email tidak valid.';
    if (!form.message.trim()) e.message = 'Pesan wajib diisi.';
    return e;
  };

  const onSubmit = (ev) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;
    const subject = encodeURIComponent(contact.form.subject);
    const body = encodeURIComponent(
      `Nama: ${form.name}\nEmail: ${form.email}\n\n${form.message}`,
    );
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
  };

  const field = (name, label, type = 'text') => (
    <label className="block">
      <span className="text-[13px] font-semibold text-ink">{label}</span>
      <input
        type={type}
        value={form[name]}
        onChange={(ev) => setForm((f) => ({ ...f, [name]: ev.target.value }))}
        aria-invalid={Boolean(errors[name])}
        className="mt-1 w-full rounded-xl2 border border-line bg-white px-4 py-2.5 text-[15px] outline-none focus:border-accent"
      />
      {errors[name] && <span className="mt-1 block text-[12px] text-accent">{errors[name]}</span>}
    </label>
  );

  return (
    <form onSubmit={onSubmit} className="rounded-card border border-line bg-white p-5">
      <p className="text-[13px] font-semibold uppercase tracking-wider text-muted">
        {contact.form.eyebrow}
      </p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {field('name', contact.form.nameLabel)}
        {field('email', contact.form.emailLabel, 'email')}
      </div>
      <label className="mt-4 block">
        <span className="text-[13px] font-semibold text-ink">{contact.form.messageLabel}</span>
        <textarea
          rows="4"
          value={form.message}
          onChange={(ev) => setForm((f) => ({ ...f, message: ev.target.value }))}
          aria-invalid={Boolean(errors.message)}
          className="mt-1 w-full rounded-xl2 border border-line bg-white px-4 py-2.5 text-[15px] outline-none focus:border-accent"
        />
        {errors.message && <span className="mt-1 block text-[12px] text-accent">{errors.message}</span>}
      </label>
      <button
        type="submit"
        data-cursor="buka"
        className="mt-5 inline-flex items-center gap-2 rounded-pill bg-ink px-5 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-accent"
      >
        {contact.form.submit}
        <ArrowIcon size={15} />
      </button>
    </form>
  );
}

const HELP = [
  'whoami   → siapa saya',
  'projects → daftar proyek',
  'skills   → keahlian',
  'contact  → info kontak',
  'cv       → unduh CV',
  'help     → tampilkan perintah',
];

function Terminal() {
  const [lines, setLines] = useState([
    { type: 'out', text: contact.terminal.output },
  ]);
  const [input, setInput] = useState('');
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 9999 });
  }, [lines]);

  const run = (raw) => {
    const cmd = raw.trim().toLowerCase();
    if (!cmd) return;
    const next = [...lines, { type: 'in', text: cmd }];
    if (cmd === 'help') next.push({ type: 'out', text: HELP.join('\n') });
    else if (cmd === 'whoami') next.push({ type: 'out', text: profile.name + ', ' + profile.role });
    else if (cmd === 'projects') next.push({ type: 'out', text: 'Buka /proyek untuk melihat tiga studi kasus.' });
    else if (cmd === 'skills') next.push({ type: 'out', text: 'Python, SQL, Pandas, Scikit-learn, CatBoost, XGBoost, FastAPI, Docker, MLflow.' });
    else if (cmd === 'contact') next.push({ type: 'out', text: `${profile.email} · ${profile.whatsapp}` });
    else if (cmd === 'cv') {
      next.push({ type: 'out', text: 'Membuka CV...' });
      window.open(profile.cvPath, '_blank');
    } else next.push({ type: 'out', text: `command not found: ${cmd}. Ketik "help".` });
    setLines(next);
    setInput('');
  };

  return (
    <div className="w-full max-w-[520px] rounded-card border border-white/10 bg-black/50 p-4 font-mono text-[13px] leading-relaxed text-white/80">
      <div className="mb-3 flex items-center justify-between" aria-hidden="true">
        <div className="flex gap-1.5">
          <span className="h-3 w-3 rounded-full bg-white/20" />
          <span className="h-3 w-3 rounded-full bg-white/20" />
          <span className="h-3 w-3 rounded-full bg-accent" />
        </div>
        <button
          type="button"
          onClick={() => run('help')}
          className="pointer-events-auto rounded-pill border border-white/20 px-2.5 py-0.5 text-[11px] text-white/70 hover:text-accent"
        >
          Bantuan
        </button>
      </div>
      <div ref={scrollRef} className="max-h-40 overflow-y-auto whitespace-pre-wrap">
        {lines.map((l, i) => (
          <p key={i} className={l.type === 'in' ? 'text-accent' : ''}>
            {l.type === 'in' ? '$ ' : ''}
            {l.text}
          </p>
        ))}
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          run(input);
        }}
        className="mt-2 flex items-center gap-1"
      >
        <span className="text-accent">$</span>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          aria-label="Ketik perintah terminal"
          className="w-full bg-transparent text-white outline-none"
        />
      </form>
    </div>
  );
}

export default function Contact() {
  usePageMeta(pages.contact.title, pages.contact.description);
  const b = contact.banner;

  return (
    <div className="pt-28 md:pt-32">
      {/* banner */}
      <section className="px-5 md:px-8">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-card bg-ink p-8 text-white md:p-12">
          <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-pill border border-emerald-400/40 bg-emerald-400/10 px-3 py-1 text-[12px] font-semibold text-emerald-300">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>
                {b.badge}
              </span>
              <h1
                className="mt-4 font-display font-extrabold leading-[1.1]"
                style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)', letterSpacing: '-0.02em' }}
              >
                {b.heading}
              </h1>
              <p className="mt-4 max-w-xl text-[16px] leading-[1.65] text-white/70">
                {b.subtitle}
              </p>
              <ul className="mt-4 flex flex-col gap-1 text-[13px] text-white/50">
                {b.details.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
            </div>
            <Terminal />
          </div>
        </div>
      </section>

      {/* kartu kontak */}
      <section className="section px-5 md:px-8">
        <div className="mx-auto grid max-w-6xl gap-4 sm:grid-cols-2">
          <ContactCard
            label="Email"
            value={profile.email}
            icon={IconMail}
            actions={
              <>
                <CopyButton value={profile.email} />
                <a
                  href={`mailto:${profile.email}`}
                  data-cursor="buka"
                  className="rounded-pill bg-accent px-3.5 py-2 text-[13px] font-semibold text-white hover:bg-[#e63f16]"
                >
                  {contact.emailCta}
                </a>
              </>
            }
          />
          <ContactCard
            label="WhatsApp"
            value={profile.whatsapp}
            icon={IconChat}
            actions={
              <a
                href={`${profile.whatsappLink}?text=${encodeURIComponent(contact.waMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="buka"
                className="rounded-pill border border-line px-3.5 py-2 text-[13px] font-semibold text-ink hover:border-accent hover:text-accent"
              >
                Chat WhatsApp
              </a>
            }
          />
          <ContactCard
            label="LinkedIn"
            value="randi-nandika-danendra"
            icon={IconLinkedIn}
            actions={
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="buka"
                className="rounded-pill border border-line px-3.5 py-2 text-[13px] font-semibold text-ink hover:border-accent hover:text-accent"
              >
                Buka LinkedIn
              </a>
            }
          />
          <ContactCard
            label="GitHub"
            value="RandiBro234"
            icon={IconGitHub}
            actions={
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="buka"
                className="rounded-pill border border-line px-3.5 py-2 text-[13px] font-semibold text-ink hover:border-accent hover:text-accent"
              >
                Buka GitHub
              </a>
            }
          />
          <div className="sm:col-span-2 flex flex-col items-start gap-4 rounded-card border border-accent/30 bg-accent-soft p-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3 text-accent">
              {IconDownload}
              <div>
                <p className="text-[15px] font-semibold text-ink">Unduh CV</p>
                <p className="text-[13px] text-muted">PDF, lengkap dengan pengalaman dan keahlian.</p>
              </div>
            </div>
            <a
              href={profile.cvPath}
              download
              data-cursor="unduh"
              className="inline-flex items-center gap-2 rounded-pill bg-accent px-6 py-3 text-[15px] font-semibold text-white transition-all hover:-translate-y-px hover:bg-[#e63f16]"
            >
              Unduh CV
              <ArrowIcon size={16} />
            </a>
          </div>
        </div>

        <div className="mx-auto mt-6 max-w-6xl">
          <MessageForm />
        </div>

        <p className="mx-auto mt-8 max-w-6xl text-center text-[14px] text-muted">
          Atau lihat dulu{' '}
          <Link to="/proyek" className="font-semibold text-accent hover:underline">
            proyek saya
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
