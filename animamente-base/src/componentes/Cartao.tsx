/**
 * CARTÃO — conceito com ícone + texto curto.
 * Painel chapado translúcido (Lavanda 14%), cantos 28, sem contorno e sem sombra (identidade é flat).
 */
import React from "react";
import { useCurrentFrame } from "remotion";
import { estiloEntrada, TipoEntrada } from "../animacao";
import { useEstilo } from "../tema/Estilo";
import { comAlfa, cores, forma, NomeCor } from "../tema/tokens";
import { Icone, NomeIcone } from "./Icone";

export const estiloPainel = (tema: "escuro" | "claro"): React.CSSProperties => ({
  background: comAlfa("lavanda", tema === "escuro" ? 0.14 : 0.45),
  borderRadius: forma.raioCartao,
});

export const Cartao: React.FC<{
  texto: string;
  titulo?: string;
  icone?: NomeIcone;
  cor?: NomeCor; // cor do círculo do ícone / do título
  atraso?: number;
  inicioSaida?: number;
  entrada?: TipoEntrada;
  largura?: number | string;
}> = ({ texto, titulo, icone, cor = "coral", atraso = 0, inicioSaida, entrada = "pop", largura = "100%" }) => {
  const frame = useCurrentFrame();
  const { fonte, formato, p, tema } = useEstilo();
  const corTitulo = cor === "lavanda" ? p.texto : cores[cor];
  return (
    <div
      style={{
        ...estiloEntrada(frame, { atraso, tipo: entrada, inicioSaida }),
        ...estiloPainel(tema),
        display: "flex",
        alignItems: "center",
        gap: 28,
        width: largura,
        boxSizing: "border-box",
        padding: formato === "vertical" ? "28px 36px" : "22px 30px",
        color: p.texto,
      }}
    >
      {icone && <Icone nome={icone} cor={cor} tamanho={formato === "vertical" ? 92 : 76} />}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {titulo && <div style={{ ...fonte("titulo", "rotulo"), color: corTitulo }}>{titulo}</div>}
        <div style={{ ...fonte("texto", titulo ? "nota" : "rotulo") }}>{texto}</div>
      </div>
    </div>
  );
};
