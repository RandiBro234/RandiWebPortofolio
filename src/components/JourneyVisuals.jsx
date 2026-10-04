export function RawTable() {
  return (
    <svg viewBox="0 0 320 220" className="h-full w-full" role="img" aria-label="Ilustrasi tabel data mentah dengan sel bermasalah">
      <rect x="20" y="20" width="280" height="180" rx="14" fill="#fff" stroke="#e6e6e6" />
      {[0, 1, 2, 3, 4, 5].map((r) =>
        [0, 1, 2, 3].map((c) => {
          const bad =
            (r === 0 && c === 1) || (r === 2 && c === 3) || (r === 4 && c === 0);
          return (
            <rect
              key={`${r}-${c}`}
              x={36 + c * 64}
              y={40 + r * 26}
              width="56"
              height="18"
              rx="4"
              fill={bad ? '#FFE9E2' : '#F4F4F4'}
              stroke={bad ? '#FF4B1F' : 'transparent'}
              strokeDasharray={r % 2 ? '3 3' : undefined}
            />
          );
        }),
      )}
      <g stroke="#FF4B1F" strokeWidth="1.5">
        <path d="M88 34l8 8M96 34l-8 8" />
        <path d="M216 86l8 8M224 86l-8 8" />
        <path d="M88 138h8" />
      </g>
    </svg>
  );
}

export function CleanTable() {
  return (
    <svg viewBox="0 0 320 220" className="h-full w-full" role="img" aria-label="Ilustrasi tabel data bersih">
      <rect x="20" y="20" width="280" height="180" rx="14" fill="#fff" stroke="#e6e6e6" />
      {[0, 1, 2, 3, 4, 5].map((r) =>
        [0, 1, 2, 3].map((c) => (
          <rect
            key={`${r}-${c}`}
            x={36 + c * 64}
            y={40 + r * 26}
            width="56"
            height="18"
            rx="4"
            fill="#F4F4F4"
            stroke="#e6e6e6"
          />
        )),
      )}
      <g fill="#FF4B1F">
        <circle cx="252" cy="168" r="6" />
        <path d="M249 168l2 2 4-4" stroke="#fff" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
}

export function QuestionVisual() {
  return (
    <svg viewBox="0 0 320 220" className="h-full w-full" role="img" aria-label="Ilustrasi pertanyaan yang berubah menjadi target masalah">
      <circle cx="140" cy="110" r="60" fill="none" stroke="#FF4B1F" strokeWidth="2" strokeDasharray="6 6" />
      <text x="140" y="138" textAnchor="middle" fontSize="72" fontWeight="800" fill="#111">?</text>
      <g transform="translate(220 66)">
        <circle r="34" fill="none" stroke="#111" strokeWidth="2" />
        <circle r="20" fill="none" stroke="#FF4B1F" strokeWidth="2" />
        <circle r="6" fill="#FF4B1F" />
      </g>
    </svg>
  );
}

export function EdaVisual() {
  return (
    <svg viewBox="0 0 320 220" className="h-full w-full" role="img" aria-label="Ilustrasi grafik eksplorasi data">
      <rect x="24" y="20" width="272" height="180" rx="14" fill="#fff" stroke="#e6e6e6" />
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={48 + i * 60} y={170 - (40 + i * 26)} width="34" height={40 + i * 26} rx="6" fill="#111" opacity={i === 3 ? 1 : 0.85} />
      ))}
      <polyline points="48,150 118,120 178,138 238,88 294,64" fill="none" stroke="#FF4B1F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {[[48,150],[118,120],[178,138],[238,88],[294,64]].map(([x,y],i)=>(
        <circle key={i} cx={x} cy={y} r="4" fill="#FF4B1F" />
      ))}
    </svg>
  );
}

export function ModelVisual() {
  return (
    <svg viewBox="0 0 320 220" className="h-full w-full" role="img" aria-label="Ilustrasi perbandingan performa model">
      <rect x="24" y="20" width="272" height="180" rx="14" fill="#fff" stroke="#e6e6e6" />
      {[
        { h: 60, c: '#111' },
        { h: 92, c: '#FF4B1F' },
        { h: 74, c: '#111' },
        { h: 108, c: '#FF4B1F' },
      ].map((b, i) => (
        <rect key={i} x={56 + i * 56} y={176 - b.h} width="36" height={b.h} rx="6" fill={b.c} opacity={b.c === '#111' ? 0.85 : 1} />
      ))}
      <line x1="40" y1="176" x2="280" y2="176" stroke="#e6e6e6" />
      <path d="M244 44l10 10M254 44l-10 10" stroke="#FF4B1F" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function InsightVisual() {
  const bars = [70, 45, 88, 60];
  return (
    <svg viewBox="0 0 320 220" className="h-full w-full" role="img" aria-label="Ilustrasi dashboard ringkasan insight">
      <rect x="24" y="20" width="272" height="180" rx="16" fill="#1F1F1F" />
      <rect x="40" y="36" width="120" height="60" rx="10" fill="#262626" />
      <text x="52" y="62" fontSize="12" fill="#9a9a9a">Prioritas</text>
      <text x="52" y="84" fontSize="22" fontWeight="800" fill="#FF4B1F">Tinggi</text>
      <rect x="172" y="36" width="108" height="60" rx="10" fill="#262626" />
      <text x="184" y="62" fontSize="12" fill="#9a9a9a">Wilayah</text>
      <text x="184" y="84" fontSize="22" fontWeight="800" fill="#fff">4</text>
      {bars.map((h, i) => (
        <rect key={i} x={44 + i * 60} y={186 - h} width="32" height={h} rx="6" fill={i === 2 ? '#FF4B1F' : '#3a3a3a'} />
      ))}
    </svg>
  );
}

export function DeployVisual() {
  const nodes = [
    { x: 40, y: 40, label: 'Client' },
    { x: 132, y: 40, label: 'FastAPI' },
    { x: 224, y: 40, label: 'Model' },
    { x: 132, y: 128, label: 'Postgres' },
  ];
  return (
    <svg viewBox="0 0 320 220" className="h-full w-full" role="img" aria-label="Diagram alur deployment model lewat API">
      {nodes.map((n, i) => (
        <g key={i}>
          <rect x={n.x} y={n.y} width="68" height="44" rx="12" fill={i === 1 ? '#FF4B1F' : '#1F1F1F'} />
          <text x={n.x + 34} y={n.y + 27} textAnchor="middle" fontSize="11" fontWeight="700" fill="#fff">{n.label}</text>
        </g>
      ))}
      <g stroke="#FF4B1F" strokeWidth="2" fill="none">
        <path d="M108 62h22" />
        <path d="M200 62h22" />
        <path d="M166 84v42" />
      </g>
    </svg>
  );
}

export const visuals = {
  question: QuestionVisual,
  raw: RawTable,
  clean: CleanTable,
  eda: EdaVisual,
  model: ModelVisual,
  insight: InsightVisual,
  deploy: DeployVisual,
};
