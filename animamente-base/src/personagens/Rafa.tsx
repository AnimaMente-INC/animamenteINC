/**
 * RAFA — o atleta do cérebro (personagem original).
 * Pele 1, tronco atlético em V com regata Ardósia (acabamento Amarelo e neurônio Névoa no peito),
 * faixa de cabeça Coral, topete loiro Amarelo, short Coral, tênis Névoa, braços mais grossos.
 * Traz o lado "treino": desafios, dicas práticas e "bora exercitar o cérebro".
 */
import { cores } from "../tema/tokens";
import { Neuronio } from "./partes/Bracos";
import { ConfigHumano } from "./partes/Humano";

const A = cores.amarelo;
const C = cores.coral;

export const configRafa: ConfigHumano = {
  corPele: cores.pele1,
  corCamisa: cores.ardosia,
  corCalca: cores.coral,
  corSapato: cores.nevoa,
  tronco: "atletico",
  ombros: [
    { x: 104, y: 282 },
    { x: 296, y: 282 },
  ],
  abertura: 1.18,
  espessuraBraco: 22,
  raioMao: 26,
  semente: 9,
  sobrancelhas: 8,
  // topete loiro (sai da cabeça → silhueta) + pontas da faixa
  silhuetaFrente: (p) => (
    <g fill={p ?? A}>
      <path d="M 110 118 Q 104 72 134 74 Q 136 38 170 52 Q 186 18 214 46 Q 242 24 256 60 Q 292 58 290 118 Q 200 76 110 118 Z" fill={p ?? A} />
      <path d="M 288 112 Q 318 102 330 120 Q 312 126 296 124 Z" fill={p ?? C} />
      <path d="M 288 118 Q 316 128 320 148 Q 302 142 292 130 Z" fill={p ?? C} />
    </g>
  ),
  // faixa de cabeça Coral
  cabeloFrente: <path d="M 110 126 Q 200 84 290 126 L 289 106 Q 200 64 111 106 Z" fill={C} />,
  detalhesCorpo: (
    <g>
      {/* cava da regata (pele aparecendo nos ombros) */}
      <path d="M 134 226 Q 74 230 72 282 Q 76 304 96 316 L 118 300 Q 130 262 150 232 Z" fill={cores.pele1} />
      <path d="M 266 226 Q 326 230 328 282 Q 324 304 304 316 L 282 300 Q 270 262 250 232 Z" fill={cores.pele1} />
      {/* gola e acabamento Amarelo */}
      <path d="M 150 232 Q 200 282 250 232" stroke={A} strokeWidth={8} fill="none" strokeLinecap="round" />
      <path d="M 118 300 Q 130 262 150 232" stroke={A} strokeWidth={7} fill="none" strokeLinecap="round" />
      <path d="M 282 300 Q 270 262 250 232" stroke={A} strokeWidth={7} fill="none" strokeLinecap="round" />
      {/* neurônio no peito */}
      <Neuronio c={{ x: 200, y: 340 }} ramos={[[176, 318], [226, 316], [184, 370], [222, 366]]} espessura={5} raio={8} opacidade={0.95} />
    </g>
  ),
  olhos: [
    { x: 166, y: 172 },
    { x: 234, y: 172 },
  ],
  boca: { x: 200, y: 214 },
};
