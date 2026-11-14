/**
 * DESTAQUE — círculo ou sublinhado "desenhado à mão" em Amarelo, com traço animado.
 * Coloque dentro de um container `position: relative`; ocupa 100% da largura.
 */
import React from "react";
import { useCurrentFrame } from "remotion";
import { desenharTraco } from "../animacao";
import { cores, forma, NomeCor } from "../tema/tokens";

export const Destaque: React.FC<{
  tipo?: "circulo" | "sublinhado";
  atraso?: number;
  cor?: NomeCor;
  altura?: number | string; // só para círculo ("100%" preenche o container)
}> = ({ tipo = "sublinhado", atraso = 0, cor = "amarelo", altura = 140 }) => {
  const frame = useCurrentFrame();
  if (tipo === "sublinhado") {
    const d = "M 2 14 Q 60 4 120 10 T 238 8";
    return (
      <svg width="100%" height={22} viewBox="0 0 240 22" preserveAspectRatio="none" style={{ overflow: "visible", display: "block" }}>
        <path d={d} fill="none" stroke={cores[cor]} strokeWidth={forma.traco + 4} strokeLinecap="round" pathLength={1} style={desenharTraco(frame, 1, atraso)} />
      </svg>
    );
  }
  // círculo à mão: elipse que "passa do ponto" no final
  const d = "M 200 18 C 120 0 20 20 12 60 C 4 104 110 124 210 116 C 300 108 330 60 290 32 C 260 12 220 10 170 14";
  return (
    <svg width="100%" height={altura} viewBox="0 0 320 130" preserveAspectRatio="none" style={{ overflow: "visible", display: "block" }}>
      <path d={d} fill="none" stroke={cores[cor]} strokeWidth={forma.traco + 2} strokeLinecap="round" pathLength={1} style={desenharTraco(frame, 1, atraso)} />
    </svg>
  );
};
