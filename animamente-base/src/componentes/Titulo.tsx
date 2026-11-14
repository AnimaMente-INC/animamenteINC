import React from "react";
import { NomeTamanho } from "../tema/tokens";
import { TextoAnimado } from "./TextoAnimado";

/** Título (Fredoka 600). Use `tamanho="subtitulo"` para subtítulos. */
export const Titulo: React.FC<{
  texto: string;
  atraso?: number;
  inicioSaida?: number;
  tamanho?: Extract<NomeTamanho, "titulo" | "subtitulo">;
  cor?: string;
  alinhamento?: "left" | "center";
}> = ({ texto, atraso, inicioSaida, tamanho = "titulo", cor, alinhamento }) => (
  <TextoAnimado texto={texto} fonte="titulo" tamanho={tamanho} atraso={atraso} inicioSaida={inicioSaida} cor={cor} alinhamento={alinhamento} />
);
