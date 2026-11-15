import React, { createContext, useContext } from "react";
import { fontes, NomeFonte, NomeTamanho, NomeTema, paleta, Paleta, TEMA_PADRAO } from "./tokens";
import { areaUtil, formatos, NomeFormato, tamanhoTexto } from "./formatos";

type ValorEstilo = {
  formato: NomeFormato;
  tema: NomeTema;
  p: Paleta;
  /** Faixa reservada no topo da área útil (Neuro narrador no modo história). */
  reservaTopo: number;
};

const Ctx = createContext<ValorEstilo>({
  formato: "vertical",
  tema: TEMA_PADRAO,
  p: paleta(TEMA_PADRAO),
  reservaTopo: 0,
});

export const ProvedorEstilo: React.FC<{
  formato: NomeFormato;
  tema?: NomeTema;
  reservaTopo?: number;
  children: React.ReactNode;
}> = ({ formato, tema = TEMA_PADRAO, reservaTopo = 0, children }) => (
  <Ctx.Provider value={{ formato, tema, p: paleta(tema), reservaTopo }}>{children}</Ctx.Provider>
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
