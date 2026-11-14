/**
 * CAIO — o animado (personagem original).
 * Pele 3, cabelo cacheado volumoso Tinta feito de círculos (como o cérebro do logo),
 * moletom Coral com capuz e cordões-neurônio Névoa, calça Ardósia, tênis Amarelo.
 * Abre os assuntos com energia, faz piadas e chama o público para participar.
 */
import { cores } from "../tema/tokens";
import { ConfigHumano } from "./partes/Humano";

const T = cores.tinta;
const N = cores.nevoa;

// cachos: nuvem de círculos no topo da cabeça
const CACHOS: [number, number, number][] = [
  [118, 112, 30],
  [132, 76, 36],
  [170, 56, 38],
  [214, 50, 40],
  [256, 66, 36],
  [282, 104, 30],
  [196, 84, 34],
  [150, 96, 28],
  [246, 96, 28],
];

export const configCaio: ConfigHumano = {
  corPele: cores.pele3,
  corCamisa: cores.coral,
  corCalca: cores.ardosia,
  corSapato: cores.amarelo,
  tronco: "redondo",
  ombros: [
    { x: 128, y: 290 },
    { x: 272, y: 290 },
  ],
  abertura: 1.08,
  semente: 5,
  sobrancelhas: 7,
  // capuz caído atrás do pescoço
  silhuetaTras: (p) => <ellipse cx={200} cy={236} rx={92} ry={30} fill={p ?? cores.coral} />,
  silhuetaFrente: (p) => (
    <g fill={p ?? T}>
      {CACHOS.map(([cx, cy, r], i) => (
        <circle key={i} cx={cx} cy={cy} r={r} />
      ))}
    </g>
  ),
  detalhesCorpo: (
    <g>
      {/* forro do capuz */}
      <ellipse cx={200} cy={238} rx={70} ry={18} fill={cores.tinta} opacity={0.25} />
      {/* cordões do capuz terminando em nós (neurônio) */}
      <g stroke={N} strokeWidth={5} strokeLinecap="round" fill="none">
        <path d="M 180 246 Q 176 270 178 296" />
        <path d="M 220 246 Q 224 270 222 296" />
      </g>
      <circle cx={178} cy={300} r={7} fill={N} />
      <circle cx={222} cy={300} r={7} fill={N} />
      {/* bolso canguru */}
      <path d="M 140 392 Q 200 372 260 392 L 252 440 Q 200 452 148 440 Z" fill={cores.tinta} opacity={0.18} />
    </g>
  ),
  olhos: [
    { x: 164, y: 170 },
    { x: 236, y: 170 },
  ],
  boca: { x: 200, y: 212 },
  larguraBoca: 32,
};
