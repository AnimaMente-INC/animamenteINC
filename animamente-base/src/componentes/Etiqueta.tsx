/**
 * ETIQUETA (pílula) — como "Ciência" / "Você sabia?" (Amarelo, texto Tinta)
 * e o botão "Toque no link" (Coral, texto Névoa) da identidade.
 */
import React from "react";
import { useCurrentFrame } from "remotion";
import { estiloEntrada } from "../animacao";
import { useEstilo } from "../tema/Estilo";
import { cores, forma, NomeCor, NomeTamanho } from "../tema/tokens";

export const Etiqueta: React.FC<{
  texto: string;
  cor?: NomeCor;
  tamanho?: NomeTamanho;
  atraso?: number;
  animar?: boolean;
}> = ({ texto, cor = "amarelo", tamanho = "nota", atraso = 0, animar = false }) => {
  const frame = useCurrentFrame();
  const { fonte } = useEstilo();
  const corTexto = cor === "coral" || cor === "tinta" || cor === "ardosia" ? cores.nevoa : cores.tinta;
  const f = fonte("titulo", tamanho);
  const fs = f.fontSize as number;
  return (
    <div
      style={{
        ...(animar ? estiloEntrada(frame, { atraso, tipo: "pop" }) : {}),
        ...f,
        display: "inline-block",
        background: cores[cor],
        color: corTexto,
        borderRadius: forma.raioPilula,
        padding: `${fs * 0.22}px ${fs * 0.7}px`,
        lineHeight: 1.1,
        whiteSpace: "nowrap",
      }}
    >
      {texto}
    </div>
  );
};
