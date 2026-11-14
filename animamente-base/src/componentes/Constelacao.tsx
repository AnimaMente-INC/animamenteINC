/**
 * CONSTELAÇÃO DE NEURÔNIOS — o fundo das peças da identidade:
 * nós e ligações em Coral a 16% sobre o Tinta, com uma deriva lenta.
 * Determinística pela `semente` (cada cena pode ter a sua).
 */
import React from "react";
import { useCurrentFrame } from "remotion";
import { useEstilo } from "../tema/Estilo";
import { cores, constelacao } from "../tema/tokens";

const aleatorio = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

export const Constelacao: React.FC<{ semente?: number; opacidade?: number }> = ({ semente = 1, opacidade = constelacao.opacidade }) => {
  const frame = useCurrentFrame();
  const { dim } = useEstilo();
  const { largura: W, altura: H } = dim;
  const n = Math.round((constelacao.pontos * (W * H)) / (1080 * 1920));
  const pts = Array.from({ length: n }, (_, i) => {
    const fase = aleatorio(semente * 97 + i * 13) * Math.PI * 2;
    const vel = 0.6 + aleatorio(semente * 7 + i * 3);
    return {
      x: aleatorio(semente * 31 + i * 2.17) * W + Math.sin(frame / (40 * vel) + fase) * constelacao.deriva,
      y: aleatorio(semente * 53 + i * 5.31) * H + Math.cos(frame / (46 * vel) + fase) * constelacao.deriva,
      grande: aleatorio(semente * 11 + i) > 0.62,
    };
  });
  // cada nó liga aos 2 vizinhos mais próximos (como nas peças da identidade)
  const ligacoes: [number, number][] = [];
  pts.forEach((a, i) => {
    const viz = pts
      .map((b, j) => ({ j, d: (a.x - b.x) ** 2 + (a.y - b.y) ** 2 }))
      .filter((v) => v.j !== i)
      .sort((u, v) => u.d - v.d)
      .slice(0, 2);
    viz.forEach((v) => {
      if (!ligacoes.some(([x, y]) => (x === v.j && y === i) || (x === i && y === v.j))) ligacoes.push([i, v.j]);
    });
  });
  const cor = cores[constelacao.cor];
  return (
    <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
      <g opacity={opacidade} stroke={cor} fill={cor} strokeLinecap="round">
        {ligacoes.map(([i, j], k) => (
          <line key={k} x1={pts[i].x} y1={pts[i].y} x2={pts[j].x} y2={pts[j].y} strokeWidth={constelacao.traco} />
        ))}
        {pts.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={p.grande ? constelacao.raioGrande : constelacao.raioPequeno} stroke="none" />
        ))}
      </g>
    </svg>
  );
};
