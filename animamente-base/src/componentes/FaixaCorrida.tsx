/**
 * FAIXA CORRIDA — letreiro que atravessa a tela sem parar (ex.: "3 POR 10").
 * Faixa Amarelo com texto Tinta (ou Coral com texto Névoa), levemente inclinada, de ponta a ponta.
 */
import React from "react";
import { useCurrentFrame } from "remotion";
import { correr, estiloEntrada } from "../animacao";
import { useEstilo } from "../tema/Estilo";
import { cores } from "../tema/tokens";

export const FaixaCorrida: React.FC<{ texto: string; cor?: "amarelo" | "coral"; atraso?: number; inclinacao?: number }> = ({ texto, cor = "amarelo", atraso = 0, inclinacao = -3 }) => {
  const frame = useCurrentFrame();
  const { fonte, dim } = useEstilo();
  const f = fonte("titulo", "rotulo");
  const fs = f.fontSize as number;
  const item = `${texto}  •  `;
  const periodo = item.length * fs * 0.52;
  const desloc = correr(Math.max(0, frame - atraso)) % periodo;
  const repeticoes = Math.ceil((dim.largura * 1.4) / periodo) + 2;
  return (
    <div style={{ ...estiloEntrada(frame, { atraso, tipo: "aparecer" }), width: dim.largura * 1.2, flexShrink: 0, transform: `rotate(${inclinacao}deg)`, background: cores[cor], overflow: "hidden", padding: `${fs * 0.3}px 0` }}>
      <div style={{ ...f, color: cor === "coral" ? cores.nevoa : cores.tinta, whiteSpace: "pre", transform: `translateX(${-desloc}px)`, width: "max-content" }}>{item.repeat(repeticoes)}</div>
    </div>
  );
};
