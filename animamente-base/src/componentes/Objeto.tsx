/**
 * OBJETO — adesivos grandes de "coisas" para contar histórias (cartucho, disco, console, chip...).
 * Estilo adesivo da base: formas chapadas nas cores dos tokens e UMA borda Névoa por fora da
 * silhueta (feita por filtro, então vale para qualquer desenho novo). Traços finos viram neurônios
 * (linha + nó redondo). Desenhos genéricos, sem marca de nenhum fabricante. viewBox 400×400.
 *
 * Para criar um objeto novo: adicione o nome em OBJETOS e um desenho em DESENHOS, só com as
 * cores dos tokens. O movimento próprio (girar, quicar) vem dos helpers de src/animacao.
 */
import React, { useId } from "react";
import { useCurrentFrame } from "remotion";
import { crescer, estiloEntrada, flutuar, girar, pulsar } from "../animacao";
import { useEstilo } from "../tema/Estilo";
import { cores, forma, fps, retro } from "../tema/tokens";

export const OBJETOS = ["cartucho", "disco", "console", "controle", "chip", "pc", "nuvem", "etiqueta", "banca", "clones", "codigo", "barreira"] as const;
export type NomeObjeto = (typeof OBJETOS)[number];

const c = cores;
const no = (x: number, y: number, cor: string = c.nevoa, r = 9) => <circle cx={x} cy={y} r={r} fill={cor} />;
const linha = (x1: number, y1: number, x2: number, y2: number, cor: string = c.nevoa, w: number = forma.traco + 2) => (
  <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={cor} strokeWidth={w} strokeLinecap="round" />
);

/** Console genérico (caixa com fenda de disco e duas luzes). */
const CaixaConsole: React.FC<{ y?: number; corpo?: string }> = ({ y = 0, corpo = c.ardosia }) => (
  <g transform={`translate(0 ${y})`}>
    <rect x={50} y={150} width={300} height={110} rx={18} fill={corpo} />
    <rect x={50} y={150} width={300} height={26} rx={13} fill={c.lilas} />
    {linha(92, 214, 232, 214, c.tinta, 10)}
    {no(288, 214, c.coral, 11)}
    {no(322, 214, c.amarelo, 11)}
  </g>
);

type PropsDesenho = { frame: number; fonteTitulo: React.CSSProperties };

const DESENHOS: Record<NomeObjeto, React.FC<PropsDesenho>> = {
  cartucho: () => (
    <g>
      <path d="M 86 60 H 314 Q 334 60 334 80 V 300 H 290 V 340 H 110 V 300 H 66 V 80 Q 66 60 86 60 Z" fill={c.ardosia} />
      {[84, 100, 116].map((y) => (
        <React.Fragment key={y}>{linha(96, y, 304, y, c.lilas, 5)}</React.Fragment>
      ))}
      <rect x={96} y={136} width={208} height={130} rx={14} fill={c.coral} />
      <circle cx={150} cy={200} r={30} fill={c.amarelo} />
      {linha(200, 184, 280, 184, c.nevoa, 8)}
      {linha(200, 216, 256, 216, c.nevoa, 8)}
      {[134, 166, 198, 230, 262].map((x) => (
        <rect key={x} x={x} y={312} width={14} height={28} fill={c.amarelo} />
      ))}
    </g>
  ),
  disco: ({ frame }) => (
    <g transform={`rotate(${girar(frame)} 200 200)`}>
      <circle cx={200} cy={200} r={160} fill={c.lavanda} />
      <path d="M 200 40 A 160 160 0 0 1 338 120 L 248 172 A 56 56 0 0 0 200 144 Z" fill={c.lilas} />
      <path d="M 200 360 A 160 160 0 0 1 62 280 L 152 228 A 56 56 0 0 0 200 256 Z" fill={c.nevoa} opacity={0.75} />
      <circle cx={200} cy={200} r={56} fill={c.coral} />
      <circle cx={200} cy={200} r={20} fill={c.tinta} />
    </g>
  ),
  console: () => <CaixaConsole y={-10} />,
  controle: () => (
    <g>
      <rect x={60} y={130} width={280} height={120} rx={56} fill={c.lavanda} />
      <circle cx={104} cy={236} r={54} fill={c.lavanda} />
      <circle cx={296} cy={236} r={54} fill={c.lavanda} />
      {linha(126, 168, 126, 220, c.tinta, 18)}
      {linha(100, 194, 152, 194, c.tinta, 18)}
      {no(262, 206, c.coral, 18)}
      {no(302, 176, c.amarelo, 18)}
      {linha(184, 160, 216, 160, c.ardosia, 10)}
    </g>
  ),
  chip: ({ frame }) => (
    <g>
      {[150, 200, 250].map((v) => (
        <React.Fragment key={v}>
          {linha(v, 110, v, 62)}
          {no(v, 56)}
          {linha(v, 290, v, 338)}
          {no(v, 344)}
          {linha(110, v, 62, v)}
          {no(56, v)}
          {linha(290, v, 338, v)}
          {no(344, v)}
        </React.Fragment>
      ))}
      <rect x={104} y={104} width={192} height={192} rx={22} fill={c.ardosia} />
      <rect x={150} y={150} width={100} height={100} rx={14} fill={c.amarelo} opacity={0.75 + 0.25 * pulsar(frame, fps)} />
      {no(128, 128, c.lilas, 8)}
    </g>
  ),
  pc: ({ frame }) => {
    const dy = 14 * pulsar(frame, fps);
    return (
      <g>
        <rect x={56} y={64} width={288} height={206} rx={18} fill={c.ardosia} />
        <rect x={76} y={84} width={248} height={166} rx={10} fill={c.tinta} />
        <rect x={176} y={270} width={48} height={40} fill={c.lilas} />
        <rect x={120} y={306} width={160} height={24} rx={12} fill={c.lilas} />
        <g transform={`translate(0 ${dy})`}>
          {linha(200, 110, 200, 176, c.coral, 14)}
          <path d="M 168 158 L 200 194 L 232 158" fill="none" stroke={c.coral} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" />
        </g>
        {linha(120, 226, 280, 226, c.amarelo, 12)}
      </g>
    );
  },
  nuvem: ({ frame }) => {
    const dy = 16 * pulsar(frame, fps);
    return (
      <g>
        <circle cx={140} cy={170} r={62} fill={c.lavanda} />
        <circle cx={214} cy={134} r={80} fill={c.lavanda} />
        <circle cx={284} cy={178} r={54} fill={c.lavanda} />
        <rect x={110} y={170} width={200} height={62} rx={30} fill={c.lavanda} />
        <g transform={`translate(0 ${dy})`}>
          {linha(206, 214, 206, 306, c.coral, 18)}
          <path d="M 166 280 L 206 326 L 246 280" fill="none" stroke={c.coral} strokeWidth={18} strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </g>
    );
  },
  etiqueta: ({ frame, fonteTitulo }) => (
    <g transform={`rotate(${-10 + 4 * Math.sin((frame / fps) * 2.2)} 110 110)`}>
      {linha(110, 110, 70, 50, c.nevoa, 6)}
      {no(66, 44, c.nevoa, 10)}
      <path d="M 70 150 L 150 70 H 330 Q 350 70 350 90 V 310 Q 350 330 330 330 H 150 L 70 250 Z" fill={c.amarelo} />
      <circle cx={130} cy={200} r={18} fill={c.tinta} />
      <text x={248} y={236} textAnchor="middle" style={{ ...fonteTitulo, fontSize: 104 }} fill={c.tinta}>
        R$
      </text>
    </g>
  ),
  banca: ({ frame }) => (
    <g>
      {linha(74, 120, 74, 340, c.lilas, 12)}
      {linha(326, 120, 326, 340, c.lilas, 12)}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <path key={i} d={`M ${50 + i * 50} 60 H ${100 + i * 50} V 130 Q ${75 + i * 50} 160 ${50 + i * 50} 130 Z`} fill={i % 2 ? c.nevoa : c.coral} />
      ))}
      <rect x={50} y={250} width={300} height={36} rx={10} fill={c.ardosia} />
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(${104 + i * 96} 0)`}>
          {[0, 1, 2].map((k) => (
            <ellipse key={k} cx={0} cy={240 - k * 16 - (i === 1 ? 6 * pulsar(frame + k * 5, fps) : 0)} rx={40} ry={12} fill={k % 2 ? c.lilas : c.lavanda} />
          ))}
          <ellipse cx={0} cy={208 - (i === 1 ? 6 * pulsar(frame + 10, fps) : 0)} rx={10} ry={3.5} fill={c.tinta} />
        </g>
      ))}
    </g>
  ),
  clones: ({ frame }) => {
    const p = crescer(frame, 16, 14);
    return (
      <g>
        <g transform={`translate(${34 * p} ${-70 * p})`} opacity={0.4 + 0.6 * p}>
          <CaixaConsole corpo={c.lavanda} />
        </g>
        <g transform={`translate(${-22 * p} ${44 * p})`}>
          <CaixaConsole />
        </g>
      </g>
    );
  },
  codigo: ({ frame }) => {
    const linhas: [number, number, string][] = [
      [96, 150, c.coral],
      [124, 210, c.nevoa],
      [124, 170, c.amarelo],
      [124, 230, c.nevoa],
      [96, 130, c.coral],
    ];
    return (
      <g>
        <rect x={50} y={60} width={300} height={280} rx={20} fill={c.ardosia} />
        <rect x={50} y={60} width={300} height={52} rx={20} fill={c.tinta} />
        {no(84, 86, c.coral, 9)}
        {no(112, 86, c.amarelo, 9)}
        {no(140, 86, c.lavanda, 9)}
        {linhas.map(([x, w, cor], i) => {
          const p = crescer(frame, 10 + i * 7, 10);
          return p > 0 ? <React.Fragment key={i}>{linha(x, 150 + i * 38, x + (w - x + 60) * p, 150 + i * 38, cor, 12)}</React.Fragment> : null;
        })}
      </g>
    );
  },
  barreira: ({ frame }) => {
    // a cancela desce e barra a passagem
    const ang = -62 + 62 * crescer(frame, 12, 12);
    return (
      <g>
        <rect x={64} y={150} width={36} height={190} rx={8} fill={c.ardosia} />
        <rect x={44} y={326} width={76} height={22} rx={10} fill={c.lilas} />
        <g transform={`rotate(${ang} 82 170)`}>
          <rect x={70} y={150} width={280} height={40} rx={12} fill={c.nevoa} />
          {[0, 1, 2, 3].map((i) => (
            <path key={i} d={`M ${100 + i * 66} 150 h 30 l -22 40 h -30 z`} fill={c.coral} />
          ))}
        </g>
        <circle cx={82} cy={170} r={22} fill={c.amarelo} />
        <circle cx={270} cy={280} r={50} fill={c.coral} />
        {linha(244, 280, 296, 280, c.nevoa, 16)}
      </g>
    );
  },
};

/** Filtro "adesivo": engrossa a silhueta do desenho em Névoa e coloca o desenho por cima. */
export const FiltroAdesivo: React.FC<{ id: string; borda?: number }> = ({ id, borda = retro.bordaAdesivo }) => (
  <filter id={id} x="-15%" y="-15%" width="130%" height="130%">
    <feMorphology in="SourceAlpha" operator="dilate" radius={borda} result="gordo" />
    <feGaussianBlur in="gordo" stdDeviation={1.2} result="macio" />
    <feComponentTransfer in="macio" result="silhueta">
      <feFuncA type="discrete" tableValues="0 1" />
    </feComponentTransfer>
    <feFlood floodColor={cores.nevoa} />
    <feComposite in2="silhueta" operator="in" result="bordaNevoa" />
    <feMerge>
      <feMergeNode in="bordaNevoa" />
      <feMergeNode in="SourceGraphic" />
    </feMerge>
  </filter>
);

export const Objeto: React.FC<{ nome: NomeObjeto; tamanho?: number; atraso?: number; parado?: boolean }> = ({ nome, tamanho, atraso = 0, parado = false }) => {
  const frame = useCurrentFrame();
  const { formato, fonte } = useEstilo();
  const id = `adesivo${useId().replace(/:/g, "")}`;
  const t = tamanho ?? (formato === "vertical" ? 460 : 340);
  const Desenho = DESENHOS[nome];
  return (
    <div style={{ ...(parado ? {} : estiloEntrada(frame, { atraso })), width: t, height: t, flexShrink: 0 }}>
      <svg width={t} height={t} viewBox="0 0 400 400" style={{ overflow: "visible", transform: parado ? undefined : `translateY(${flutuar(frame, atraso * 7)}px)` }}>
        <FiltroAdesivo id={id} />
        <g filter={`url(#${id})`}>
          <Desenho frame={parado ? 60 : Math.max(0, frame - atraso)} fonteTitulo={fonte("titulo", "titulo")} />
        </g>
      </svg>
    </div>
  );
};
