/**
 * CÉREBRO A+M — geometria OFICIAL do símbolo (logo-02-simbolo-transparente.svg), em unidades do logo
 * (aprox. x 18–182, y 18–167). Usado pelo Logo e pela silhueta do Neuro.
 *
 * Construção: 10 círculos + caule formam a silhueta coral; uma cópia Névoa com traço por baixo
 * faz a borda de "adesivo"; as letras A e M são traços Névoa grossos com nós nas pontas;
 * os ramos de neurônio saem das letras.
 */
import React from "react";
import { cores } from "../../tema/tokens";

export const CIRCULOS_CEREBRO: [number, number, number][] = [
  [62, 70, 34],
  [52, 108, 30],
  [84, 52, 30],
  [88, 118, 28],
  [80, 90, 30],
  [138, 70, 34],
  [148, 108, 30],
  [116, 52, 30],
  [112, 118, 28],
  [120, 90, 30],
];
export const CAULE = "M92 134 Q95 150 103 161 Q108 167 114 163 Q119 159 115 150 Q111 142 111 130 Z";

/** Silhueta do cérebro (círculos + caule) numa cor. Com `borda`, vira a camada de borda. */
export const SilhuetaCerebro: React.FC<{ cor: string; borda?: number }> = ({ cor, borda }) => (
  <g fill={cor} stroke={borda ? cor : undefined} strokeWidth={borda ? borda * 2 : undefined} strokeLinejoin="round">
    {CIRCULOS_CEREBRO.map(([cx, cy, r], i) => (
      <circle key={i} cx={cx} cy={cy} r={r} />
    ))}
    <path d={CAULE} />
  </g>
);

/** Neurônios do caule (detalhe fino). */
export const NeuroniosCaule: React.FC<{ soCaule?: boolean }> = ({ soCaule = false }) => (
  <g>
    <g fill="none" stroke={cores.nevoa} strokeLinecap="round" opacity={0.8}>
      {!soCaule && <path d="M93.5 118 Q97 126 101 132" strokeWidth={1.6} />}
      {!soCaule && <path d="M108.5 118 Q105 126 101 132" strokeWidth={1.6} />}
      <path d="M101 132 Q103 146 108 158" strokeWidth={1.6} />
      <path d="M102 139 L98.5 141.5" strokeWidth={1.1} />
      <path d="M103.2 144 L107 145" strokeWidth={1.1} />
      <path d="M104.6 149.5 L101.5 152.5" strokeWidth={1.1} />
      <path d="M106.2 153.5 L110 152.5" strokeWidth={1.1} />
    </g>
    <g fill={cores.nevoa} opacity={0.9}>
      <circle cx={101} cy={132} r={1.8} />
      <circle cx={98.5} cy={141.5} r={1.1} />
      <circle cx={107} cy={145} r={1.1} />
      <circle cx={101.5} cy={152.5} r={1.1} />
      <circle cx={110} cy={152.5} r={1.1} />
      <circle cx={108} cy={158} r={1.5} />
    </g>
  </g>
);

// ─── Letra A (lado esquerdo, girada 6°) ───────────────────────────────────
const RAMOS_A = [
  ["M82 66 Q78 58 76 48", 4],
  ["M76 48 Q70 44 66 40", 3],
  ["M76 48 Q80 42 84 36", 3],
  ["M66 116 Q60 122 52 124", 4],
  ["M52 124 Q46 122 40 118", 3],
  ["M52 124 Q50 130 48 136", 3],
  ["M72 100 Q62 94 54 92", 4],
  ["M54 92 Q46 90 38 84", 3],
  ["M54 92 Q48 84 46 74", 3],
] as const;
const NOS_A: [number, number, number][] = [
  [76, 48, 3.5], [66, 40, 2.8], [84, 36, 2.8],
  [52, 124, 3.5], [40, 118, 2.8], [48, 136, 2.8],
  [54, 92, 3.5], [38, 84, 2.8], [46, 74, 2.8],
];
const LETRA_A = ["M66 116 Q72 90 79 72 Q82 63 85 72 Q90 90 96 116", "M72 100 Q80 95 89 100"];
const PONTAS_A: [number, number][] = [[66, 117], [96, 117]];

// ─── Letra M (lado direito, girada −6°) ───────────────────────────────────
const RAMOS_M = [
  ["M110 68 Q111 58 112 48", 4],
  ["M112 48 Q108 42 104 36", 3],
  ["M112 48 Q117 40 122 34", 3],
  ["M134 68 Q141 62 148 56", 4],
  ["M148 56 Q147 50 146 44", 3],
  ["M148 56 Q156 58 162 62", 3],
  ["M138 98 Q149 94 160 92", 4],
  ["M160 92 Q164 86 166 82", 3],
  ["M160 92 Q165 96 170 100", 3],
  ["M138 116 Q145 122 152 124", 4],
  ["M152 124 Q160 120 166 116", 3],
  ["M152 124 Q152 130 152 136", 3],
] as const;
const NOS_M: [number, number, number][] = [
  [112, 48, 3.5], [104, 36, 2.8], [122, 34, 2.8],
  [148, 56, 3.5], [146, 44, 2.8], [162, 62, 2.8],
  [160, 92, 3.5], [166, 82, 2.8], [170, 100, 2.8],
  [152, 124, 3.5], [166, 116, 2.8], [152, 136, 2.8],
];
const LETRA_M = ["M106 116 C106 98 106 82 107 74 Q109 64 114 72 L122 89 L130 72 Q135 64 137 74 C138 82 138 98 138 116"];
const PONTAS_M: [number, number][] = [[106, 117], [138, 117]];

const Lado: React.FC<{
  rot: string;
  ramos: readonly (readonly [string, number])[];
  nos: [number, number, number][];
  letra: string[];
  pontas: [number, number][];
  estiloLetra?: React.CSSProperties;
  estiloRamos?: React.CSSProperties;
  opacidadeNos?: number;
  mostrarRamos?: boolean;
}> = ({ rot, ramos, nos, letra, pontas, estiloLetra, estiloRamos, opacidadeNos = 1, mostrarRamos = true }) => (
  <g transform={rot}>
    {mostrarRamos && (
      <>
        <g fill="none" stroke={cores.nevoa} strokeLinecap="round" strokeLinejoin="round" opacity={0.75}>
          {ramos.map(([d, w], i) => (
            <path key={i} d={d} strokeWidth={w} pathLength={1} style={estiloRamos} />
          ))}
        </g>
        <g fill={cores.nevoa} opacity={0.85 * opacidadeNos}>
          {nos.map(([cx, cy, r], i) => (
            <circle key={i} cx={cx} cy={cy} r={r} />
          ))}
        </g>
      </>
    )}
    <g fill="none" stroke={cores.nevoa} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round">
      {letra.map((d, i) => (
        <path key={i} d={d} pathLength={1} style={estiloLetra} />
      ))}
    </g>
    <g fill={cores.nevoa} opacity={opacidadeNos}>
      {pontas.map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r={4.5} />
      ))}
    </g>
  </g>
);

/** Letras A+M com ramos — o "miolo" do símbolo. */
export const LetrasAM: React.FC<{
  estiloLetraA?: React.CSSProperties;
  estiloLetraM?: React.CSSProperties;
  estiloRamos?: React.CSSProperties;
  opacidadeNos?: number;
  mostrarRamos?: boolean;
}> = ({ estiloLetraA, estiloLetraM, estiloRamos, opacidadeNos, mostrarRamos }) => (
  <g>
    <Lado rot="rotate(6 81 93)" ramos={RAMOS_A} nos={NOS_A} letra={LETRA_A} pontas={PONTAS_A} estiloLetra={estiloLetraA} estiloRamos={estiloRamos} opacidadeNos={opacidadeNos} mostrarRamos={mostrarRamos} />
    <Lado rot="rotate(-6 122 93)" ramos={RAMOS_M} nos={NOS_M} letra={LETRA_M} pontas={PONTAS_M} estiloLetra={estiloLetraM} estiloRamos={estiloRamos} opacidadeNos={opacidadeNos} mostrarRamos={mostrarRamos} />
  </g>
);

/** Símbolo completo, idêntico ao logo oficial (borda Névoa, cérebro Coral, A+M Névoa). */
export const SimboloAM: React.FC<{
  estiloLetraA?: React.CSSProperties;
  estiloLetraM?: React.CSSProperties;
  estiloRamos?: React.CSSProperties;
  opacidadeNos?: number;
}> = (p) => (
  <g>
    <SilhuetaCerebro cor={cores.nevoa} borda={1.2} />
    <SilhuetaCerebro cor={cores.coral} />
    <g fill="none" stroke={cores.nevoa} strokeLinecap="round" opacity={0.7}>
      <path d="M100 31 Q99 36 100 41" strokeWidth={3} />
    </g>
    <NeuroniosCaule />
    <LetrasAM {...p} />
  </g>
);
