/**
 * LIA — a estudante curiosa.
 * Pele 1, blusa em cápsula Amarelo, legging Ardósia, tênis Coral,
 * cabelo chanel Tinta com franja ondulada e presilha-neurônio Coral.
 * Faz as perguntas que o público faria.
 */
import { cores } from "../tema/tokens";
import { Neuronio } from "./partes/Bracos";
import { ConfigHumano } from "./partes/Humano";

const T = cores.tinta;

export const configLia: ConfigHumano = {
  corPele: cores.pele1,
  corCamisa: cores.amarelo,
  corCalca: cores.ardosia,
  corSapato: cores.coral,
  tronco: "capsula",
  ombros: [
    { x: 146, y: 285 },
    { x: 254, y: 285 },
  ],
  semente: 3,
  orelhas: false,
  sobrancelhas: 5,
  // cabelo chanel (atrás da cabeça, passa dos ombros dos lados)
  silhuetaTras: (p) => (
    <g fill={p ?? T}>
      <rect x={80} y={42} width={240} height={150} rx={110} />
      <rect x={80} y={110} width={240} height={160} rx={56} />
    </g>
  ),
  cabeloFrente: (
    <g>
      {/* franja com leve ondulação */}
      <path d="M 111 124 Q 160 102 205 118 Q 250 134 289 114 A 92 92 0 0 0 111 124 Z" fill={T} />
      {/* presilha-neurônio */}
      <Neuronio
        c={{ x: 262, y: 84 }}
        ramos={[
          [286, 66],
          [292, 96],
          [266, 58],
        ]}
        cor={cores.coral}
        espessura={5}
        raio={7}
        opacidade={1}
      />
    </g>
  ),
  olhos: [
    { x: 166, y: 170 },
    { x: 234, y: 170 },
  ],
  boca: { x: 200, y: 210 },
};
