/**
 * TEO — o professor.
 * Pele 2, camisa Lavanda, calça Ardósia, sapato Tinta, cabelo grisalho Lavanda,
 * óculos redondos em traço Névoa com nós de neurônio nas hastes e gravata-borboleta Coral.
 * Explica fórmulas e conceitos, quase sempre ao lado de uma lousa ou cartão.
 */
import { cores, forma } from "../tema/tokens";
import { ConfigHumano } from "./partes/Humano";

const L = cores.lavanda;
const N = cores.nevoa;

export const configTeo: ConfigHumano = {
  corPele: cores.pele2,
  corCamisa: cores.lavanda,
  corCalca: cores.ardosia,
  corSapato: cores.tinta,
  tronco: "retangulo",
  ombros: [
    { x: 136, y: 285 },
    { x: 264, y: 285 },
  ],
  semente: 7,
  sobrancelhas: 6,
  // tufos laterais grisalhos (saem da cabeça → silhueta)
  silhuetaFrente: (p) => (
    <g fill={p ?? L}>
      <ellipse cx={113} cy={122} rx={26} ry={34} />
      <ellipse cx={287} cy={122} rx={26} ry={34} />
    </g>
  ),
  // topo do cabelo com topete arredondado
  cabeloFrente: <path d="M 116 112 Q 140 90 168 104 Q 198 80 230 102 Q 262 88 284 112 A 92 92 0 0 0 116 112 Z" fill={L} />,
  // gola em V Névoa + gravata-borboleta coral
  detalhesCorpo: (
    <g>
      <path d="M 170 232 L 200 262 L 230 232 Z" fill={N} />
      <g fill={cores.coral}>
        <path d="M 200 258 L 168 242 Q 160 258 168 274 Z" />
        <path d="M 200 258 L 232 242 Q 240 258 232 274 Z" />
        <circle cx={200} cy={258} r={10} />
      </g>
      <g fill={cores.ardosia}>
        <circle cx={200} cy={318} r={5} />
        <circle cx={200} cy={362} r={5} />
        <circle cx={200} cy={406} r={5} />
      </g>
    </g>
  ),
  // óculos redondos Névoa + hastes que terminam em nós de neurônio
  acessorio: (
    <g stroke={N} strokeWidth={forma.traco} strokeLinecap="round" fill="none">
      <circle cx={163} cy={166} r={29} />
      <circle cx={237} cy={166} r={29} />
      <path d="M 192 163 Q 200 155 208 163" />
      <path d="M 134 161 L 114 153" />
      <path d="M 266 161 L 286 153" />
      <circle cx={112} cy={152} r={5} fill={N} stroke="none" />
      <circle cx={288} cy={152} r={5} fill={N} stroke="none" />
    </g>
  ),
  olhos: [
    { x: 163, y: 168 },
    { x: 237, y: 168 },
  ],
  boca: { x: 200, y: 214 },
};
