/**
 * SETA e CONECTOR — desenhados com animação de traço, com um nó de neurônio na origem.
 * Coordenadas em px dentro de um container `position: relative` (a seta é absoluta).
 */
import React from "react";
import { useCurrentFrame } from "remotion";
import { desenharTraco, entrar } from "../animacao";
import { cores, forma, NomeCor } from "../tema/tokens";
import { useEstilo } from "../tema/Estilo";
import { Ponto } from "../personagens/tipos";

const caminho = (de: Ponto, para: Ponto, curva: number) => {
  const mx = (de.x + para.x) / 2;
  const my = (de.y + para.y) / 2;
  const dx = para.x - de.x;
  const dy = para.y - de.y;
  return { d: `M ${de.x} ${de.y} Q ${mx - dy * curva} ${my + dx * curva} ${para.x} ${para.y}`, c: { x: mx - dy * curva, y: my + dx * curva } };
};

export const Seta: React.FC<{
  de: Ponto;
  para: Ponto;
  curva?: number; // 0 = reta
  atraso?: number;
  cor?: NomeCor | "linha"; // "linha" = Névoa no escuro, Tinta no claro
  ponta?: boolean; // false = conector (sem ponta)
  fino?: boolean;
  tracejado?: boolean;
}> = ({ de, para, curva = 0.15, atraso = 0, cor = "linha", ponta = true, fino = false, tracejado = false }) => {
  const frame = useCurrentFrame();
  const { p } = useEstilo();
  const { d, c } = caminho(de, para, curva);
  const corTraco = cor === "linha" ? p.linha : cores[cor];
  const largura = fino ? forma.tracoFino : forma.traco;
  // direção final da seta (tangente no ponto final)
  const ang = Math.atan2(para.y - c.y, para.x - c.x);
  const tam = 26;
  const p1 = { x: para.x - Math.cos(ang - 0.5) * tam, y: para.y - Math.sin(ang - 0.5) * tam };
  const p2 = { x: para.x - Math.cos(ang + 0.5) * tam, y: para.y - Math.sin(ang + 0.5) * tam };
  const duracao = 18;
  const pontaVisivel = entrar(frame, atraso + duracao - 4);
  const traco = tracejado ? { strokeDasharray: "2 18", opacity: entrar(frame, atraso) } : desenharTraco(frame, 1, atraso, duracao);

  return (
    <svg style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%", overflow: "visible", pointerEvents: "none" }}>
      <circle cx={de.x} cy={de.y} r={largura * 1.2} fill={corTraco} opacity={Math.min(1, Math.max(0, entrar(frame, atraso)))} />
      <path d={d} fill="none" stroke={corTraco} strokeWidth={largura} strokeLinecap="round" pathLength={1} style={traco} />
      {ponta && (
        <path
          d={`M ${p1.x} ${p1.y} L ${para.x} ${para.y} L ${p2.x} ${p2.y}`}
          fill="none"
          stroke={corTraco}
          strokeWidth={largura}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={Math.min(1, pontaVisivel)}
        />
      )}
    </svg>
  );
};

/** Conector = seta sem ponta, traço fino. */
export const Conector: React.FC<Omit<React.ComponentProps<typeof Seta>, "ponta" | "fino">> = (p) => <Seta {...p} ponta={false} fino />;
