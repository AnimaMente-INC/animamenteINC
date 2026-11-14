export type IdPersonagem = "neuro" | "lia" | "teo" | "caio" | "rafa";
export const PERSONAGENS: IdPersonagem[] = ["neuro", "lia", "teo", "caio", "rafa"];
export type Pose = "parado" | "apontando" | "acenando" | "pensando" | "comemorando";
export type Expressao = "neutro" | "feliz" | "surpreso" | "pensativo" | "confuso" | "empolgado";
export type Olhar = "esquerda" | "direita" | "frente";

export const POSES: Pose[] = ["parado", "apontando", "acenando", "pensando", "comemorando"];
export const EXPRESSOES: Expressao[] = ["neutro", "feliz", "surpreso", "pensativo", "confuso", "empolgado"];

/** Mudança de estado durante a cena (em segundos no roteiro, convertida para frames). */
export type Mudanca = {
  em: number; // frame relativo ao início do personagem
  pose?: Pose;
  expressao?: Expressao;
  olhando?: Olhar;
};

export type Ponto = { x: number; y: number };
