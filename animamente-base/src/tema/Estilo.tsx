import React, { createContext, useContext } from "react";
import { fontes, NomeFonte, NomeTamanho, NomeTema, paleta, Paleta, TEMA_PADRAO } from "./tokens";
import { areaUtil, formatos, NomeFormato, tamanhoTexto } from "./formatos";

type ValorEstilo = {
  formato: NomeFormato;
  tema: NomeTema;
  p: Paleta;
};

const Ctx = createContext<ValorEstilo>({
  formato: "vertical",
  tema: TEMA_PADRAO,
  p: paleta(TEMA_PADRAO),
});

export const ProvedorEstilo: React.FC<{
  formato: NomeFormato;
  tema?: NomeTema;
  children: React.ReactNode;
}> = ({ formato, tema = TEMA_PADRAO, children }) => (
  <Ctx.Provider value={{ formato, tema, p: paleta(tema) }}>{children}</Ctx.Provider>
);

/** Acesso ao padrão visual de dentro de qualquer componente. */
export const useEstilo = () => {
  const v = useContext(Ctx);
  return {
    ...v,
    dim: formatos[v.formato],
    area: areaUtil(v.formato),
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
