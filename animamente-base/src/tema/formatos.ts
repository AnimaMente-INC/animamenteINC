import { tamanhosBase, NomeTamanho } from "./tokens";

export type NomeFormato = "vertical" | "horizontal";

export const formatos = {
  vertical: {
    largura: 1080,
    altura: 1920,
    escalaTexto: 1,
    // área segura: interface do Instagram/TikTok/Shorts
    seguro: { topo: 150, baixo: 350, lados: 60 },
  },
  horizontal: {
    largura: 1920,
    altura: 1080,
    escalaTexto: 0.75,
    seguro: { topo: 80, baixo: 80, lados: 120 },
  },
} as const;

export type Formato = (typeof formatos)[NomeFormato];

export const tamanhoTexto = (formato: NomeFormato, nome: NomeTamanho) =>
  Math.round(tamanhosBase[nome] * formatos[formato].escalaTexto);

/** Retângulo útil (dentro da área segura). */
export const areaUtil = (formato: NomeFormato) => {
  const f = formatos[formato];
  return {
    x: f.seguro.lados,
    y: f.seguro.topo,
    largura: f.largura - f.seguro.lados * 2,
    altura: f.altura - f.seguro.topo - f.seguro.baixo,
  };
};
