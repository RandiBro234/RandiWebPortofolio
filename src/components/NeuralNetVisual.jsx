import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../hooks';

// PRNG deterministik (mulberry32) untuk memilih koneksi yang berdenyut per siklus.
function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const W = 420;
const H = 280;
const PAD_X = 60;
const PAD_Y = 40;
const LABELS = ['input', 'hidden', 'hidden', 'output'];

// Hitung posisi tiap node berdasarkan jumlah node per lapis.
function layout(layers) {
  const cols = layers.length;
  return layers.map((n, li) => {
    const x = PAD_X + (li * (W - PAD_X * 2)) / (cols - 1);
    const nodes = [];
    for (let ni = 0; ni < n; ni++) {
      const y = n === 1 ? H / 2 : PAD_Y + (ni * (H - PAD_Y * 2)) / (n - 1);
      nodes.push({ x, y, layer: li, node: ni });
    }
    return nodes;
  });
}

export default function NeuralNetVisual({ layers = [3, 5, 5, 2] }) {
  const reduced = useReducedMotion();
  const wrapRef = useRef(null);
  const [tick, setTick] = useState(0); // indeks siklus
  const [activeLayer, setActiveLayer] = useState(reduced ? -1 : -1);
  const [hovered, setHovered] = useState(null);
  const [latency, setLatency] = useState(12);
  const [showOutputs, setShowOutputs] = useState(false);
  const timer = useRef(0);
  const inView = useRef(false);
  const tabActive = useRef(true);

  const grid = layout(layers);

  // Koneksi antar lapis bersebelahan.
  const edges = [];
  for (let li = 0; li < layers.length - 1; li++) {
    for (let a = 0; a < layers[li]; a++) {
      for (let b = 0; b < layers[li + 1]; b++) {
        edges.push({ from: { ...grid[li][a] }, to: { ...grid[li + 1][b] }, layer: li, key: `${li}-${a}-${b}` });
      }
    }
  }

  // Koneksi aktif untuk siklus ini (deterministik per tick).
  const [activeEdges, setActiveEdges] = useState(() => new Set());
  useEffect(() => {
    if (reduced) return;
    const rand = mulberry32(1000 + tick);
    const set = new Set();
    edges.forEach((e) => {
      if (rand() < 0.4) set.add(e.key);
    });
    setActiveEdges(set);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tick, reduced]);

  // Siklus forward pass.
  const runCycle = () => {
    if (reduced) return;
    const stepMs = 520;
    const total = layers.length;
    setShowOutputs(false);
    setLatency(10 + Math.round(Math.random() * 4));

    const timers = [];
    for (let i = 0; i < total; i++) {
      timers.push(setTimeout(() => setActiveLayer(i), i * stepMs));
    }
    timers.push(
      setTimeout(() => {
        setActiveLayer(-1);
        setShowOutputs(true);
      }, total * stepMs),
    );
    timers.push(
      setTimeout(() => {
        setShowOutputs(false);
        setTick((t) => t + 1);
      }, total * stepMs + 1400),
    );
    return timers;
  };

  // Observer + visibility + timer loop.
  useEffect(() => {
    if (reduced) return;
    const el = wrapRef.current;
    if (!el) return;
    let timers = [];

    const clearAll = () => {
      timers.forEach(clearTimeout);
      timers = [];
      clearTimeout(timer.current);
    };

    const loop = () => {
      if (!inView.current || !tabActive.current) return;
      timers = runCycle();
      timer.current = setTimeout(loop, layers.length * 520 + 1800);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        inView.current = entry.isIntersecting;
        if (entry.isIntersecting && tabActive.current) loop();
        else clearAll();
      },
      { threshold: 0.4 },
    );
    observer.observe(el);

    const onVis = () => {
      tabActive.current = document.visibilityState === 'visible';
      if (tabActive.current && inView.current) loop();
      else clearAll();
    };
    document.addEventListener('visibilitychange', onVis);

    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      clearAll();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced, layers.length]);

  // Statis untuk reduced-motion: satu jalur oranye menyala.
  const staticEdges = reduced
    ? new Set([edges[Math.floor(edges.length / 3)]?.key].filter(Boolean))
    : activeEdges;

  const isEdgeActive = (edge) => staticEdges.has(edge.key) && (reduced || edge.layer === activeLayer);

  return (
    <div
      ref={wrapRef}
      role="img"
      aria-label="Ilustrasi jaringan saraf tiruan yang memproses data dari input ke output"
      className="flex h-full w-full flex-col"
    >
      {/* baris kode */}
      <p className="font-mono text-xs text-neutral-400">
        <span className="text-accent">&gt; model.predict</span>(x)
      </p>

      {/* pita status */}
      <div className="mt-3 flex items-center gap-2">
        <span
          className="h-2 w-2 shrink-0 rounded-full bg-accent"
          style={{ animation: reduced ? 'none' : 'pulse-dot 1.4s ease-in-out infinite' }}
          aria-hidden="true"
        />
        <span className="font-mono text-xs text-neutral-400">inferring</span>
      </div>

      {/* jaringan */}
      <svg viewBox={`0 0 ${W} ${H}`} className="mt-2 w-full" aria-hidden="true">
        {/* koneksi */}
        {edges.map((e) => {
          const on = isEdgeActive(e);
          return (
            <line
              key={e.key}
              x1={e.from.x}
              y1={e.from.y}
              x2={e.to.x}
              y2={e.to.y}
              stroke={on ? '#FF4B1F' : 'rgba(255,255,255,0.1)'}
              strokeWidth={on ? 1.8 : 1}
              style={{
                filter: on ? 'drop-shadow(0 0 4px rgba(255,75,31,0.7))' : 'none',
                strokeDasharray: on ? 60 : 'none',
                strokeDashoffset: on ? 0 : 60,
                transition: 'stroke 250ms ease, stroke-dashoffset 500ms ease, filter 250ms ease',
              }}
            />
          );
        })}

        {/* node */}
        {grid.map((layerNodes, li) =>
          layerNodes.map((nd) => {
            const active = reduced ? li === 0 || li === layers.length - 1 : activeLayer === li;
            const hov = hovered && hovered.layer === li && hovered.node === nd.node;
            return (
              <circle
                key={`${li}-${nd.node}`}
                cx={nd.x}
                cy={nd.y}
                r={hov ? 9.8 : 7}
                fill={active ? '#FF4B1F' : '#1F1F1F'}
                stroke={active ? '#FF4B1F' : 'rgba(255,255,255,0.4)'}
                strokeWidth="1.5"
                style={{
                  transformBox: 'fill-box',
                  transformOrigin: 'center',
                  transform: active ? 'scale(1.25)' : 'scale(1)',
                  transition: 'transform 400ms ease, fill 250ms ease, stroke 250ms ease, r 150ms ease',
                  cursor: 'default',
                }}
                onMouseEnter={() => setHovered({ layer: li, node: nd.node })}
                onMouseLeave={() => setHovered(null)}
              />
            );
          }),
        )}

        {/* label lapis */}
        {grid.map((nodes, li) => (
          <text
            key={`lbl-${li}`}
            x={nodes[0].x}
            y={H - 8}
            textAnchor="middle"
            fontFamily="ui-monospace, monospace"
            fontSize="10"
            fill="rgba(255,255,255,0.4)"
          >
            {LABELS[li] || 'hidden'}
          </text>
        ))}

        {/* nilai output */}
        {showOutputs &&
          grid[layers.length - 1].map((nd, i) => (
            <text
              key={`out-${i}`}
              x={nd.x + 14}
              y={nd.y + 4}
              fontFamily="ui-monospace, monospace"
              fontSize="10"
              fill="#FF4B1F"
              style={{ opacity: showOutputs ? 1 : 0, transition: 'opacity 400ms ease' }}
            >
              {i === 0 ? '0.87' : '0.13'}
            </text>
          ))}

        {/* tooltip hover */}
        {hovered && (
          <g
            transform={`translate(${Math.min(grid[hovered.layer][hovered.node].x + 12, W - 130)}, ${grid[hovered.layer][hovered.node].y - 26})`}
          >
            <rect width="122" height="20" rx="4" fill="rgba(17,17,17,0.92)" stroke="rgba(255,255,255,0.15)" />
            <text x="8" y="14" fontFamily="ui-monospace, monospace" fontSize="10" fill="#fff">
              layer {hovered.layer + 1} · node {hovered.node + 1}
            </text>
          </g>
        )}
      </svg>

      {/* readout */}
      <dl className="mt-3 grid grid-cols-3 gap-3 font-mono text-xs">
        <div>
          <dt className="text-neutral-500">layers</dt>
          <dd className="text-white">{layers.length}</dd>
        </div>
        <div>
          <dt className="text-neutral-500">params</dt>
          <dd className="text-white">1.2k</dd>
        </div>
        <div>
          <dt className="text-neutral-500">latency</dt>
          <dd className="text-white">{latency}ms</dd>
        </div>
      </dl>
    </div>
  );
}
