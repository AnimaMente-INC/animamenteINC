/**
 * MOTOR DE COLAGEM — recortes de papel "com tesoura", texturas de revista e peças.
 *
 * - `recorte(...)`: transforma uma forma em polígono de cortes retos, levemente tremidos
 *   (como papel cortado à mão). Determinístico: a mesma semente dá sempre o mesmo recorte.
 * - `<FiltrosPapel id>`: texturas de papel (aquarela manchada, respingos, grão) e sombra de papel.
 * - `<Peca>`: um pedaço de papel colado (cor + textura + margem branca opcional + sombra).
 */
import React from "react";
import { colagem, cores } from "../../tema/tokens";

export type Pt = [number, number];

const aleatorio = (n: number) => {
  const x = Math.sin(n * 91.345 + 47.853) * 24634.6345;
  return x - Math.floor(x);
};

/** Pontos de uma elipse (de `a0` a `a1` radianos). */
export const elipse = (cx: number, cy: number, rx: number, ry: number, n = 22, a0 = 0, a1 = Math.PI * 2): Pt[] => {
  const pts: Pt[] = [];
  const fechada = Math.abs(a1 - a0 - Math.PI * 2) < 1e-6;
  const total = fechada ? n : n + 1;
  for (let i = 0; i < total; i++) {
    const a = a0 + ((a1 - a0) * i) / n;
    pts.push([cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]);
  }
  return pts;
};

/** Densifica um polígono (para a tesoura ter onde "tremer" nas retas longas). */
const densificar = (pts: Pt[], passo = 38): Pt[] => {
  const out: Pt[] = [];
  pts.forEach((p, i) => {
    const q = pts[(i + 1) % pts.length];
    const d = Math.hypot(q[0] - p[0], q[1] - p[1]);
    const n = Math.max(1, Math.round(d / passo));
    for (let k = 0; k < n; k++) out.push([p[0] + ((q[0] - p[0]) * k) / n, p[1] + ((q[1] - p[1]) * k) / n]);
  });
  return out;
};

/** Recorte de tesoura: cortes retos com tremidinha. */
export const recorte = (pts: Pt[], semente = 1, tremor: number = colagem.tesoura, densidade = 38): string => {
  const ds = densificar(pts, densidade);
  return (
    ds
      .map(([x, y], i) => {
        const jx = (aleatorio(semente * 131 + i * 7.13) - 0.5) * 2 * tremor;
        const jy = (aleatorio(semente * 173 + i * 3.71) - 0.5) * 2 * tremor;
        return `${i === 0 ? "M" : "L"} ${(x + jx).toFixed(1)} ${(y + jy).toFixed(1)}`;
      })
      .join(" ") + " Z"
  );
};

export type Textura = "lisa" | "aquarela" | "respingos" | "manchada";

/** Filtros SVG de papel, com ids prefixados (um conjunto por personagem). */
export const FiltrosPapel: React.FC<{ id: string; semente?: number }> = ({ id, semente = 3 }) => {
  const s = colagem.sombra;
  const sombra = (
    <feDropShadow dx={s.dx} dy={s.dy} stdDeviation={s.desfoque} floodColor={cores.tinta} floodOpacity={s.opacidade} />
  );
  return (
    <defs>
      {/* só sombra de papel */}
      <filter id={`${id}-lisa`} x="-10%" y="-10%" width="125%" height="125%">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="1" seed={semente} result="grao" />
        <feColorMatrix in="grao" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.10 -0.02" result="graoA" />
        <feComposite in="graoA" in2="SourceAlpha" operator="in" result="graoIn" />
        <feMerge result="papel">
          <feMergeNode in="SourceGraphic" />
          <feMergeNode in="graoIn" />
        </feMerge>
        {sombra}
      </filter>
      {/* aquarela manchada (manchas suaves mais escuras) */}
      <filter id={`${id}-aquarela`} x="-10%" y="-10%" width="125%" height="125%">
        <feTurbulence type="fractalNoise" baseFrequency="0.018" numOctaves="4" seed={semente + 1} result="n" />
        <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -2.4 1.25" result="m" />
        <feComposite in="m" in2="SourceAlpha" operator="in" result="mIn" />
        <feColorMatrix in="mIn" type="matrix" values="0 0 0 0 0.12  0 0 0 0 0.10  0 0 0 0 0.24  0 0 0 0.22 0" result="manchas" />
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="1" seed={semente + 2} result="grao" />
        <feColorMatrix in="grao" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.12 -0.03" result="graoA" />
        <feComposite in="graoA" in2="SourceAlpha" operator="in" result="graoIn" />
        <feMerge>
          <feMergeNode in="SourceGraphic" />
          <feMergeNode in="manchas" />
          <feMergeNode in="graoIn" />
        </feMerge>
        {sombra}
      </filter>
      {/* respingos (pontinhos escuros de tinta, como esponja/spray) */}
      <filter id={`${id}-respingos`} x="-10%" y="-10%" width="125%" height="125%">
        <feTurbulence type="fractalNoise" baseFrequency="0.16" numOctaves="2" seed={semente + 3} result="n" />
        <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -9 5.1" result="m" />
        <feComposite in="m" in2="SourceAlpha" operator="in" result="mIn" />
        <feColorMatrix in="mIn" type="matrix" values="0 0 0 0 0.12  0 0 0 0 0.10  0 0 0 0 0.24  0 0 0 0.55 0" result="pingos" />
        <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="3" seed={semente + 4} result="n2" />
        <feColorMatrix in="n2" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -2 1.1" result="m2" />
        <feComposite in="m2" in2="SourceAlpha" operator="in" result="m2In" />
        <feColorMatrix in="m2In" type="matrix" values="0 0 0 0 0.12  0 0 0 0 0.10  0 0 0 0 0.24  0 0 0 0.16 0" result="manchas" />
        <feMerge>
          <feMergeNode in="SourceGraphic" />
          <feMergeNode in="manchas" />
          <feMergeNode in="pingos" />
        </feMerge>
        {sombra}
      </filter>
      {/* manchada clara (para pelos claros e papéis brancos: manchas acinzentadas) */}
      <filter id={`${id}-manchada`} x="-10%" y="-10%" width="125%" height="125%">
        <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="4" seed={semente + 5} result="n" />
        <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -3 1.6" result="m" />
        <feComposite in="m" in2="SourceAlpha" operator="in" result="mIn" />
        <feColorMatrix in="mIn" type="matrix" values="0 0 0 0 0.35  0 0 0 0 0.34  0 0 0 0 0.46  0 0 0 0.28 0" result="manchas" />
        <feMerge>
          <feMergeNode in="SourceGraphic" />
          <feMergeNode in="manchas" />
        </feMerge>
        {sombra}
      </filter>
      {/* meio-tom de revista (pontinhos regulares) */}
      <pattern id={`${id}-meiotom`} width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(30)">
        <circle cx="4.5" cy="4.5" r="2.1" fill={cores.tinta} opacity="0.22" />
      </pattern>
      <pattern id={`${id}-meiotomClaro`} width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(30)">
        <circle cx="5" cy="5" r="2.2" fill={cores.nevoa} opacity="0.45" />
      </pattern>
    </defs>
  );
};

/** Um pedaço de papel colado. `margem` = recorte com margem branca (peças externas da silhueta). */
export const Peca: React.FC<{
  id: string; // prefixo dos filtros do personagem
  d: string;
  cor: string;
  textura?: Textura;
  margem?: boolean | number;
  meiotom?: "escuro" | "claro";
  opacidade?: number;
  sombra?: boolean;
}> = ({ id, d, cor, textura = "lisa", margem = false, meiotom, opacidade, sombra = true }) => {
  const m = margem === true ? colagem.margem : margem || 0;
  return (
    <g opacity={opacidade} filter={sombra ? `url(#${id}-${textura})` : undefined}>
      {m > 0 && <path d={d} fill={cores.nevoa} stroke={cores.nevoa} strokeWidth={m * 2} strokeLinejoin="round" />}
      <path d={d} fill={cor} />
      {meiotom && <path d={d} fill={`url(#${id}-${meiotom === "escuro" ? "meiotom" : "meiotomClaro"})`} />}
    </g>
  );
};

/** Rabisco de lápis (traço fino, levemente tremido) — pelos, costuras, pregas. */
export const Rabisco: React.FC<{ pts: Pt[]; cor?: string; largura?: number; semente?: number; opacidade?: number }> = ({
  pts,
  cor = cores.tinta,
  largura = 2.6,
  semente = 1,
  opacidade = 0.7,
}) => {
  const d = pts
    .map(([x, y], i) => {
      const j = (aleatorio(semente * 11 + i) - 0.5) * 2;
      return `${i === 0 ? "M" : "L"} ${(x + j).toFixed(1)} ${(y + j).toFixed(1)}`;
    })
    .join(" ");
  return <path d={d} stroke={cor} strokeWidth={largura} strokeLinecap="round" strokeLinejoin="round" fill="none" opacity={opacidade} />;
};

/** Só a margem branca de um recorte (para peças que se mexem por trás de outras, como a mandíbula). */
export const Margem: React.FC<{ d: string; largura?: number }> = ({ d, largura = colagem.margem }) => (
  <path d={d} fill={cores.nevoa} stroke={cores.nevoa} strokeWidth={largura * 2} strokeLinejoin="round" />
);

/** Retângulo como lista de pontos. */
export const ret = (x: number, y: number, w: number, h: number): Pt[] => [
  [x, y],
  [x + w, y],
  [x + w, y + h],
  [x, y + h],
];

/** Ombros/roupa do busto (cortado embaixo, em y = 700). `abre` alarga os ombros. */
export const ombros = (abre = 1, topo = 486): Pt[] => {
  const a = (x: number) => 300 + (x - 300) * abre;
  return [
    [a(84), 700],
    [a(90), 590],
    [a(122), 526],
    [a(206), topo],
    [a(394), topo],
    [a(478), 526],
    [a(510), 590],
    [a(516), 700],
  ];
};

/** Forma de "tubo" (tromba, cauda, manga) a partir de uma linha central, afinando de w0 para w1. */
export const tubo = (centro: Pt[], w0: number, w1: number): Pt[] => {
  const esq: Pt[] = [];
  const dir: Pt[] = [];
  centro.forEach((p, i) => {
    const q = centro[Math.min(i + 1, centro.length - 1)];
    const o = centro[Math.max(i - 1, 0)];
    const ang = Math.atan2(q[1] - o[1], q[0] - o[0]) + Math.PI / 2;
    const w = (w0 + ((w1 - w0) * i) / (centro.length - 1)) / 2;
    esq.push([p[0] + Math.cos(ang) * w, p[1] + Math.sin(ang) * w]);
    dir.push([p[0] - Math.cos(ang) * w, p[1] - Math.sin(ang) * w]);
  });
  const fim = centro[centro.length - 1];
  return [...esq, ...elipse(fim[0], fim[1], w1 / 2, w1 / 2, 6, 0, 0).slice(0, 0), ...dir.reverse()];
};
