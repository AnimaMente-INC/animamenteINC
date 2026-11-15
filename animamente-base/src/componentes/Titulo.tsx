import React, { useContext } from "react";
import { NomeTamanho } from "../tema/tokens";
import { EstiloTexto, TextoAnimado, TextoCtx } from "./TextoAnimado";

/** Título (Fredoka 600). Use `tamanho="subtitulo"` para subtítulos. Segue o modelo de texto do roteiro ("estiloTexto"). */
export const Titulo: React.FC<{
  texto: string;
  atraso?: number;
  inicioSaida?: number;
  tamanho?: Extract<NomeTamanho, "titulo" | "subtitulo">;
  cor?: string;
  alinhamento?: "left" | "center";
  modelo?: EstiloTexto;
}> = ({ texto, atraso, inicioSaida, tamanho = "titulo", cor, alinhamento, modelo }) => {
  const doRoteiro = useContext(TextoCtx);
  return <TextoAnimado texto={texto} fonte="titulo" tamanho={tamanho} atraso={atraso} inicioSaida={inicioSaida} cor={cor} alinhamento={alinhamento} modelo={modelo ?? doRoteiro} />;
};
