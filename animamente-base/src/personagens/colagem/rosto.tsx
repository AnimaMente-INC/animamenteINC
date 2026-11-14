/**
 * PEÇAS DE ROSTO DA COLAGEM — olhos de papel (com pálpebra que pisca), sobrancelhas de tira de papel
 * e a lógica das expressões. A boca é "South Park": cada personagem tem uma MANDÍBULA recortada
 * que desce (`abertura`) mostrando o fundo escuro da boca.
 */
import React, { useId } from "react";
import { cores } from "../../tema/tokens";
import { Expressao, Olhar } from "../tipos";
import { elipse, Peca, recorte } from "./papel";

/** Tudo o que um busto precisa saber neste frame. */
export type EstadoBusto = {
  id: string; // prefixo dos filtros
  expressao: Expressao;
  olhando: Olhar;
  piscada: number; // 0 aberto → 1 fechado
  abertura: number; // 0 boca fechada → 1 toda aberta (já inclui a fala)
  falando: boolean;
  passo: number; // frame "em degraus" (animação recortada)
};

/** Parâmetros de rosto por expressão (iguais para todos; cada personagem soma a sua personalidade). */
export const rostoDe = (e: Expressao) => {
  switch (e) {
    case "feliz":
      return { palpebra: 0.22, sobe: [-6, -6], ang: [-6, 6], pupila: 1, olhar: [0, 0], aberturaBase: 0 };
    case "empolgado":
      return { palpebra: 0, sobe: [-14, -14], ang: [-8, 8], pupila: 1.18, olhar: [0, 0], aberturaBase: 0.55 };
    case "surpreso":
      return { palpebra: 0, sobe: [-20, -20], ang: [0, 0], pupila: 0.7, olhar: [0, 0], aberturaBase: 0.38 };
    case "pensativo":
      return { palpebra: 0.3, sobe: [-2, -12], ang: [4, 10], pupila: 0.95, olhar: [7, -9], aberturaBase: 0 };
    case "confuso":
      return { palpebra: 0.12, sobe: [-16, 4], ang: [-14, 12], pupila: 0.9, olhar: [-3, 2], aberturaBase: 0 };
    default:
      return { palpebra: 0.08, sobe: [0, 0], ang: [0, 0], pupila: 1, olhar: [0, 0], aberturaBase: 0 };
  }
};

/** Deslocamento das pupilas para onde o personagem olha. */
export const olharX = (o: Olhar) => (o === "esquerda" ? -9 : o === "direita" ? 9 : 0);

/** Olho de papel: fundo (branco ou íris), pupila, brilho e pálpebra que desce. */
export const Olho: React.FC<{
  e: EstadoBusto;
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  corFundo?: string;
  corPalpebra: string;
  pupilaR: number;
  fenda?: boolean; // pupila em fenda (gato)
  palpebraExtra?: number; // personalidade (sono, desconfiança)
  semente: number;
  lado: 0 | 1;
}> = ({ e, cx, cy, rx, ry, corFundo = cores.nevoa, corPalpebra, pupilaR, fenda, palpebraExtra = 0, semente, lado }) => {
  const clip = useId().replace(/:/g, "");
  const r = rostoDe(e.expressao);
  const fecha = Math.min(1, Math.max(e.piscada, r.palpebra + palpebraExtra));
  const ox = olharX(e.olhando) + r.olhar[0];
  const oy = r.olhar[1];
  const contorno = elipse(cx, cy, rx, ry, 14);
  const d = recorte(contorno, semente, 2.2, 20);
  const pr = pupilaR * r.pupila;
  const feliz = (e.expressao === "feliz" || e.expressao === "empolgado") && e.piscada < 0.5;
  return (
    <g>
      <clipPath id={clip}>
        <path d={d} />
      </clipPath>
      <Peca id={e.id} d={d} cor={corFundo} textura="lisa" />
      <g clipPath={`url(#${clip})`}>
        {fenda ? (
          <ellipse cx={cx + ox} cy={cy + oy} rx={pr * 0.42} ry={pr * 1.25} fill={cores.tinta} />
        ) : (
          <path d={recorte(elipse(cx + ox, cy + oy, pr, pr, 10), semente + 7, 1.2, 12)} fill={cores.tinta} />
        )}
        <circle cx={cx + ox + pr * 0.4} cy={cy + oy - pr * 0.45} r={Math.max(2.5, pr * 0.3)} fill={cores.nevoa} />
        {/* pálpebra: papel da cor do pelo descendo de cima */}
        <rect x={cx - rx - 4} y={cy - ry - 4} width={rx * 2 + 8} height={(ry * 2 + 8) * fecha} fill={corPalpebra} />
        {/* "sorriso nos olhos": pálpebra de baixo subindo */}
        {feliz && <ellipse cx={cx} cy={cy + ry * 1.25} rx={rx * 1.2} ry={ry * 0.75} fill={corPalpebra} />}
      </g>
      {fecha > 0.04 && fecha < 0.98 && (
        <path
          d={`M ${cx - rx} ${cy - ry + (ry * 2) * fecha} L ${cx + rx} ${cy - ry + (ry * 2) * fecha + (lado === 0 ? 1 : -1)}`}
          stroke={cores.tinta}
          strokeWidth={3}
          strokeLinecap="round"
          opacity={0.75}
        />
      )}
    </g>
  );
};

/** Sobrancelha: tira de papel recortada que sobe e gira com a expressão. */
export const Sobrancelha: React.FC<{
  e: EstadoBusto;
  cx: number;
  cy: number;
  largura: number;
  altura?: number;
  cor: string;
  lado: 0 | 1;
  extraSobe?: number;
  extraAng?: number;
  semente: number;
}> = ({ e, cx, cy, largura, altura = 13, cor, lado, extraSobe = 0, extraAng = 0, semente }) => {
  const r = rostoDe(e.expressao);
  const sobe = r.sobe[lado] + extraSobe;
  const ang = (r.ang[lado] + extraAng) * (lado === 0 ? 1 : 1);
  const w = largura / 2;
  const d = recorte(
    [
      [cx - w, cy + altura * 0.35],
      [cx - w * 0.6, cy - altura * 0.45],
      [cx + w * 0.6, cy - altura * 0.55],
      [cx + w, cy + altura * 0.2],
      [cx + w * 0.5, cy + altura * 0.45],
      [cx - w * 0.5, cy + altura * 0.55],
    ],
    semente,
    1.6,
    40,
  );
  return (
    <g transform={`translate(0 ${sobe}) rotate(${ang} ${cx} ${cy})`}>
      <Peca id={e.id} d={d} cor={cor} textura="lisa" />
    </g>
  );
};

/** Grupo da mandíbula: desce com a abertura da boca (e inclina um tiquinho, estilo recorte). */
export const Mandibula: React.FC<{ e: EstadoBusto; queda: number; pivo: [number, number]; children: React.ReactNode }> = ({ e, queda, pivo, children }) => (
  <g transform={`translate(0 ${e.abertura * queda}) rotate(${e.abertura * 3} ${pivo[0]} ${pivo[1]})`}>{children}</g>
);
