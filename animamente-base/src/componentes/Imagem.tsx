/**
 * IMAGEM — imagem do projeto (public/) como adesivo: borda Névoa, cantos de 28px e rótulo Lavanda.
 * Use para mostrar uma referência real (ex.: comparação de mapas). `rotulo` opcional abaixo.
 */
import React from "react";
import { Img, staticFile, useCurrentFrame } from "remotion";
import { estiloEntrada } from "../animacao";
import { useEstilo } from "../tema/Estilo";
import { forma } from "../tema/tokens";

export const Imagem: React.FC<{ arquivo: string; rotulo?: string; atraso?: number; altura?: number }> = ({ arquivo, rotulo, atraso = 0, altura }) => {
  const frame = useCurrentFrame();
  const { fonte, formato, p } = useEstilo();
  const vertical = formato === "vertical";
  const alturaFinal = altura ?? (vertical ? 640 : 520);
  return (
    <div style={{ ...estiloEntrada(frame, { atraso, tipo: "pop" }), display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      <div
        style={{
          border: `${forma.borda}px solid ${p.borda === p.fundo ? p.texto : p.borda}`,
          borderRadius: forma.raioCartao,
          overflow: "hidden",
          display: "flex",
          height: alturaFinal,
        }}
      >
        <Img src={staticFile(arquivo)} style={{ height: "100%", width: "auto", display: "block" }} />
      </div>
      {rotulo && <div style={{ ...fonte("texto", "nota"), color: p.textoApoio }}>{rotulo}</div>}
    </div>
  );
};
