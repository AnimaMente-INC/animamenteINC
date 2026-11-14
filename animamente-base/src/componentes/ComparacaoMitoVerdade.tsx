/**
 * COMPARAÇÃO MITO x VERDADE — dois painéis translúcidos com etiqueta em pílula:
 * MITO (Coral, texto riscado em Lavanda) × VERDADE (Amarelo, texto em destaque).
 * Vertical: empilhado. Horizontal: lado a lado.
 */
import React from "react";
import { useCurrentFrame } from "remotion";
import { estiloEntrada } from "../animacao";
import { useEstilo } from "../tema/Estilo";
import { NomeCor, tempos } from "../tema/tokens";
import { estiloPainel } from "./Cartao";
import { Etiqueta } from "./Etiqueta";
import { Icone } from "./Icone";

const Lado: React.FC<{ rotulo: string; texto: string; cor: NomeCor; icone: "errado" | "certo"; atraso: number; inicioSaida?: number; mito?: boolean }> = ({
  rotulo,
  texto,
  cor,
  icone,
  atraso,
  inicioSaida,
  mito,
}) => {
  const frame = useCurrentFrame();
  const { fonte, p, tema } = useEstilo();
  return (
    <div
      style={{
        ...estiloEntrada(frame, { atraso, inicioSaida }),
        ...estiloPainel(tema),
        flex: 1,
        padding: "28px 32px",
        display: "flex",
        flexDirection: "column",
        gap: 18,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <Icone nome={icone} cor={cor} tamanho={56} />
        <Etiqueta texto={rotulo} cor={cor} />
      </div>
      <div
        style={{
          ...fonte(mito ? "texto" : "textoForte", "rotulo"),
          color: mito ? p.textoApoio : p.texto,
          textDecoration: mito ? "line-through" : undefined,
          textDecorationThickness: 4,
        }}
      >
        {texto}
      </div>
    </div>
  );
};

export const ComparacaoMitoVerdade: React.FC<{
  mito: string;
  verdade: string;
  atraso?: number;
  inicioSaida?: number;
}> = ({ mito, verdade, atraso = 0, inicioSaida }) => {
  const { formato } = useEstilo();
  return (
    <div style={{ display: "flex", flexDirection: formato === "vertical" ? "column" : "row", gap: 32, width: "100%" }}>
      <Lado rotulo="MITO" texto={mito} cor="coral" icone="errado" atraso={atraso} inicioSaida={inicioSaida} mito />
      <Lado rotulo="VERDADE" texto={verdade} cor="amarelo" icone="certo" atraso={atraso + tempos.entrada * 3} inicioSaida={inicioSaida} />
    </div>
  );
};
