export type IdPersonagem = "neuro" | "lia" | "bento" | "teo" | "caio" | "rafa";
export const PERSONAGENS: IdPersonagem[] = ["neuro", "lia", "bento", "teo", "caio", "rafa"];
/** Nome que aparece na tela (legenda, faixa, recado, chat) e cor de destaque de cada um. */
export const NOMES_PERSONAGENS: Record<IdPersonagem, string> = { neuro: "Neuro", lia: "Lia", bento: "Bento", teo: "Teo", caio: "Caio", rafa: "Rafa" };
export const COR_PERSONAGEM: Record<IdPersonagem, "coral" | "amarelo" | "lavanda"> = { neuro: "coral", lia: "amarelo", bento: "amarelo", teo: "lavanda", caio: "coral", rafa: "lavanda" };
export type Pose = "parado" | "apontando" | "acenando" | "pensando" | "comemorando" | "regendo";
export type Expressao = "neutro" | "feliz" | "surpreso" | "pensativo" | "confuso" | "empolgado";
export type Olhar = "esquerda" | "direita" | "frente";

export const POSES: Pose[] = ["parado", "apontando", "acenando", "pensando", "comemorando", "regendo"];
export const EXPRESSOES: Expressao[] = ["neutro", "feliz", "surpreso", "pensativo", "confuso", "empolgado"];

/** Mudança de estado durante a cena (em segundos no roteiro, convertida para frames). */
export type Mudanca = {
  em: number; // frame relativo ao início do personagem
  pose?: Pose;
  expressao?: Expressao;
  olhando?: Olhar;
};

export type Ponto = { x: number; y: number };
