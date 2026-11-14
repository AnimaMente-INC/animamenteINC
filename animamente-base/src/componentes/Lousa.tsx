/**
 * LOUSA — quadro com borda Névoa (como a borda de adesivo do logo), fórmula em Fredoka SemiBold,
 * sublinhado Amarelo desenhado. `rotulo` opcional em Lavanda acima da fórmula.
 * Fórmulas longas diminuem sozinhas para caber na tela (nunca quebram linha).
 */
import React from "react";
import { useCurrentFrame } from "remotion";
import { estiloEntrada } from "../animacao";
import { useEstilo } from "../tema/Estilo";
import { forma } from "../tema/tokens";
import { Destaque } from "./Destaque";

const LARGURA_CARACTERE = 0.56; // em "em" (Fredoka SemiBold, média)

export const Lousa: React.FC<{
  formula: string;
  rotulo?: string;
  atraso?: number;
  inicioSaida?: number;
  destacar?: boolean;
}> = ({ formula, rotulo, atraso = 0, inicioSaida, destacar = true }) => {
  const frame = useCurrentFrame();
  const { fonte, formato, area, p } = useEstilo();
  const vertical = formato === "vertical";
  const padH = vertical ? 56 : 48;
  const larguraMax = (vertical ? area.largura : area.largura * 0.55) - padH * 2 - forma.borda * 2;
  const base = fonte("formula", "titulo");
  const tamanho = Math.min(base.fontSize as number, larguraMax / (Array.from(formula).length * LARGURA_CARACTERE));

  return (
    <div
      style={{
        ...estiloEntrada(frame, { atraso, tipo: "pop", inicioSaida }),
        border: `${forma.borda}px solid ${p.borda === p.fundo ? p.texto : p.borda}`,
        borderRadius: forma.raioCartao,
        padding: `${vertical ? 44 : 36}px ${padH}px ${vertical ? 56 : 44}px`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 16,
        minWidth: vertical ? 720 : 560,
        maxWidth: larguraMax + padH * 2,
      }}
    >
      {rotulo && <div style={{ ...fonte("texto", "nota"), color: p.textoApoio }}>{rotulo}</div>}
      <div style={{ position: "relative", ...base, fontSize: tamanho, color: p.texto, whiteSpace: "nowrap" }}>
        {formula}
        {destacar && (
          <div style={{ position: "absolute", left: 0, right: 0, bottom: -20 }}>
            <Destaque tipo="sublinhado" atraso={atraso + 14} />
          </div>
        )}
      </div>
    </div>
  );
};
