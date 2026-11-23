import React, { createContext, useContext } from "react";
import { fontes, NomeFonte, NomeTamanho, NomeTema, paleta, Paleta, TEMA_PADRAO } from "./tokens";
import { areaUtil, formatos, NomeFormato, tamanhoTexto } from "./formatos";

type ValorEstilo = {
  formato: NomeFormato;
  tema: NomeTema;
  p: Paleta;
  /** Faixa reservada no topo da área útil (Neuro narrador no modo história). */
  reservaTopo: number;
  /** Fundo da constelação: "neuronios" (padrão) ou "musical" (alguns nós viram notas musicais). */
  fundo: NomeFundo;
  /** Roupa do Neuro no vídeo todo: "padrao" (gravata-borboleta) ou "maestro" (fraque e batuta). */
  figurino: NomeFigurino;
};

export type NomeFundo = "neuronios" | "musical";
export type NomeFigurino = "padrao" | "maestro";

const Ctx = createContext<ValorEstilo>({
  formato: "vertical",
  tema: TEMA_PADRAO,
  p: paleta(TEMA_PADRAO),
  reservaTopo: 0,
  fundo: "neuronios",
  figurino: "padrao",
});

export const ProvedorEstilo: React.FC<{
  formato: NomeFormato;
  tema?: NomeTema;
  reservaTopo?: number;
  fundo?: NomeFundo;
  figurino?: NomeFigurino;
  children: React.ReactNode;
}> = ({ formato, tema = TEMA_PADRAO, reservaTopo = 0, fundo = "neuronios", figurino = "padrao", children }) => (
  <Ctx.Provider value={{ formato, tema, p: paleta(tema), reservaTopo, fundo, figurino }}>{children}</Ctx.Provider>
);

/** Acesso ao padrão visual de dentro de qualquer componente. */
export const useEstilo = () => {
  const v = useContext(Ctx);
  const a = areaUtil(v.formato);
  return {
    ...v,
    dim: formatos[v.formato],
    area: { ...a, y: a.y + v.reservaTopo, altura: a.altura - v.reservaTopo },
    tamanho: (nome: NomeTamanho) => tamanhoTexto(v.formato, nome),
    /** Estilo CSS de fonte a partir do token. */
    fonte: (nome: NomeFonte, tamanho: NomeTamanho): React.CSSProperties => ({
      fontFamily: `"${fontes[nome].familia}", sans-serif`,
      fontWeight: fontes[nome].peso,
      fontSize: tamanhoTexto(v.formato, tamanho),
      lineHeight: 1.15,
    }),
  };
};
