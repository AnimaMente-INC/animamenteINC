/**
 * CONTADOR — número animado em Fredoka SemiBold, Amarelo por padrão.
 */
import React from "react";
import { useCurrentFrame } from "remotion";
import { contar, estiloEntrada } from "../animacao";
import { useEstilo } from "../tema/Estilo";
import { cores, NomeCor } from "../tema/tokens";

export const Contador: React.FC<{
  de?: number;
  ate: number;
  casas?: number;
  prefixo?: string;
  sufixo?: string;
  rotulo?: string;
  atraso?: number;
  inicioSaida?: number;
  cor?: NomeCor;
}> = ({ de = 0, ate, casas = 0, prefixo = "", sufixo = "", rotulo, atraso = 0, inicioSaida, cor = "amarelo" }) => {
  const frame = useCurrentFrame();
  const { fonte, p } = useEstilo();
  const v = contar(frame, de, ate, atraso, 36);
  return (
    <div style={{ ...estiloEntrada(frame, { atraso, inicioSaida }), display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
      <div style={{ ...fonte("formula", "titulo"), fontSize: (fonte("formula", "titulo").fontSize as number) * 1.6, color: cores[cor] }}>
        {prefixo}
        {v.toLocaleString("pt-BR", { minimumFractionDigits: casas, maximumFractionDigits: casas })}
        {sufixo}
      </div>
      {rotulo && <div style={{ ...fonte("texto", "rotulo"), color: p.textoApoio }}>{rotulo}</div>}
    </div>
  );
};
