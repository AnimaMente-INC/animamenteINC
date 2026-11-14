/**
 * BUSTO DE COLAGEM — monta o estado do frame (piscar, boca "South Park", balanço em degraus)
 * e desenha o personagem escolhido. viewBox 0 0 600 700 (cabeça + ombros, sem corpo inteiro).
 */
import React, { useId } from "react";
import { useCurrentFrame } from "remotion";
import { piscar } from "../../animacao";
import { colagem } from "../../tema/tokens";
import { Expressao, Olhar, Pose } from "../tipos";
import { Cachorro } from "./Cachorro";
import { Elefante } from "./Elefante";
import { Gata } from "./Gata";
import { Lontra } from "./Lontra";
import { Preguica } from "./Preguica";
import { FiltrosPapel } from "./papel";
import { EstadoBusto, rostoDe } from "./rosto";

export type IdBusto = "lia" | "bento" | "teo" | "rafa" | "caio";

export const BUSTOS: Record<IdBusto, { C: React.FC<{ e: EstadoBusto }>; semente: number }> = {
  lia: { C: Gata, semente: 3 },
  bento: { C: Cachorro, semente: 13 },
  teo: { C: Preguica, semente: 7 },
  rafa: { C: Elefante, semente: 9 },
  caio: { C: Lontra, semente: 5 },
};

export const VIEWBOX_BUSTO = { w: 600, h: 700 };

/** Sequência da boca falando (abre/fecha em degraus, como recorte animado). */
const BOCA = [0.15, 0.95, 0.45, 1, 0.2, 0.8, 0.05, 0.65, 0.35, 0.9];

export const Busto: React.FC<{
  id: IdBusto;
  expressao: Expressao;
  olhando: Olhar;
  pose: Pose;
  falando: boolean;
  altura: number;
}> = ({ id, expressao, olhando, pose, falando, altura }) => {
  const frame = useCurrentFrame();
  const uid = useId().replace(/:/g, "");
  const { C, semente } = BUSTOS[id];
  const passo = Math.floor(frame / colagem.passo);
  const r = rostoDe(expressao);
  const abertura = falando ? BOCA[(passo + semente) % BOCA.length] : r.aberturaBase;
  const e: EstadoBusto = {
    id: uid,
    expressao,
    olhando,
    piscada: piscar(frame, semente),
    abertura,
    falando,
    passo,
  };
  // balanço "em degraus": a cabeça e os ombros mexem como recorte animado
  const fase = passo + semente * 3;
  const rot = Math.sin(fase / 5) * 1.6 + (falando ? (passo % 2 ? 1.2 : -0.8) : 0) + (pose === "pensando" ? -5 : 0);
  const dy = Math.sin(fase / 4) * 3 + (falando ? (passo % 2) * -4 : 0) + (pose === "comemorando" ? -Math.abs(Math.sin(passo / 1.5)) * 18 : 0);
  const dx = olhando === "esquerda" ? -8 : olhando === "direita" ? 8 : 0;
  const vb = VIEWBOX_BUSTO;
  return (
    <svg width={(altura * vb.w) / vb.h} height={altura} viewBox={`0 0 ${vb.w} ${vb.h}`} style={{ overflow: "visible" }}>
      <FiltrosPapel id={uid} semente={semente} />
      <g transform={`translate(${dx} ${dy}) rotate(${rot} 300 640)`}>
        <C e={e} />
      </g>
    </svg>
  );
};
