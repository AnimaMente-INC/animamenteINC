/**
 * HELPERS DE ANIMAÇÃO — toda animação do projeto passa por aqui.
 * Nada de interpolate solto com easing próprio nos componentes.
 */
import React from "react";
import { Easing, interpolate } from "remotion";
import { amplitudes, easings, tempos } from "../tema/tokens";

const curva = (c: readonly [number, number, number, number]) => Easing.bezier(c[0], c[1], c[2], c[3]);

const easeEntrada = curva(easings.entrada);
const easeSaida = curva(easings.saida);
const easeSuave = curva(easings.suave);

const travar = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** 0 → 1 (com leve passagem de 1 por causa do "pulo") durante a entrada. */
export const entrar = (frame: number, atraso = 0, duracao: number = tempos.entrada) =>
  interpolate(frame - atraso, [0, duracao], [0, 1], { ...travar, easing: easeEntrada });

/** 1 → 0 durante a saída, começando em `inicio`. */
export const sair = (frame: number, inicio: number, duracao: number = tempos.saida) =>
  interpolate(frame - inicio, [0, duracao], [1, 0], { ...travar, easing: easeSaida });

/** Atraso do i-ésimo item numa sequência. */
export const stagger = (i: number, base = 0) => base + i * tempos.stagger;

/** Interpolação suave genérica (para movimentos contínuos e trocas de estado). */
export const suave = (frame: number, entrada: [number, number], saida: [number, number]) =>
  interpolate(frame, entrada, saida, { ...travar, easing: easeSuave });

export type TipoEntrada = "pop" | "subir" | "deslizar" | "aparecer";

/**
 * Estilo pronto de entrada/saída para qualquer elemento.
 * Use em TODO elemento que aparece na tela.
 */
export const estiloEntrada = (
  frame: number,
  opcoes: { atraso?: number; tipo?: TipoEntrada; inicioSaida?: number } = {},
): React.CSSProperties => {
  const { atraso = 0, tipo = "pop", inicioSaida } = opcoes;
  const e = entrar(frame, atraso);
  const s = inicioSaida !== undefined ? sair(frame, inicioSaida) : 1;
  const opacidade = Math.min(1, Math.max(0, e)) * s;
  let transform = "";
  if (tipo === "pop") {
    const esc = amplitudes.popEscalaInicial + (1 - amplitudes.popEscalaInicial) * e;
    transform = `scale(${esc * (0.9 + 0.1 * s)})`;
  } else if (tipo === "subir") {
    transform = `translateY(${(1 - e) * 60 + (1 - s) * -30}px)`;
  } else if (tipo === "deslizar") {
    transform = `translateX(${(1 - e) * amplitudes.deslizeTransicao}px)`;
  }
  return { opacity: opacidade, transform };
};

/** Respiração: escala Y oscilando entre 1 e 1,02 (ciclo de 2s). */
export const respirar = (frame: number, fase = 0) =>
  1 + (amplitudes.respiracao / 2) * (1 - Math.cos(((frame + fase) / tempos.respiracao) * Math.PI * 2));

/** Flutuação vertical (Neuro): sobe e desce 10px a cada 3s. */
export const flutuar = (frame: number, fase = 0) =>
  -(amplitudes.flutuacao / 2) * (1 - Math.cos(((frame + fase) / tempos.flutuacao) * Math.PI * 2));

/** Pseudoaleatório determinístico (renderização sempre igual). */
const aleatorio = (n: number) => {
  const x = Math.sin(n * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
};

/**
 * Piscar: retorna 0 (olho aberto) → 1 (fechado).
 * Intervalos entre 3 e 5s, determinísticos pela `semente` (cada personagem pisca num ritmo).
 */
export const piscar = (frame: number, semente = 1) => {
  let t = Math.round(tempos.piscarMin * 0.5 + aleatorio(semente) * tempos.piscarMin);
  let i = 0;
  while (t <= frame) {
    const d = frame - t;
    if (d < tempos.duracaoPiscada) {
      const meio = tempos.duracaoPiscada / 2;
      return 1 - Math.abs(d - meio) / meio;
    }
    i++;
    t += Math.round(tempos.piscarMin + aleatorio(semente * 31 + i) * (tempos.piscarMax - tempos.piscarMin));
  }
  return 0;
};

/** Boca falando: alterna aberta/fechada a cada 4 frames. */
export const bocaAberta = (frame: number) => Math.floor(frame / tempos.bocaFalando) % 2 === 0;

/**
 * Traço sendo desenhado: devolve strokeDasharray/offset para um path de `comprimento`.
 */
export const desenharTraco = (
  frame: number,
  comprimento: number,
  atraso = 0,
  duracao = tempos.entrada * 2,
): React.CSSProperties => {
  const prog = interpolate(frame - atraso, [0, duracao], [0, 1], { ...travar, easing: easeSuave });
  return { strokeDasharray: `${comprimento} ${comprimento}`, strokeDashoffset: comprimento * (1 - prog), opacity: prog > 0 ? 1 : 0 };
};

/** Progresso de transição de uma cena inteira (entrada e saída padronizadas). */
export const transicaoCena = (frame: number, duracaoCena: number) => {
  const dentro = entrar(frame, 0, tempos.transicao);
  const fora = sair(frame, duracaoCena - tempos.transicao, tempos.transicao);
  return { dentro, fora };
};

/** Número animado (contador). */
export const contar = (frame: number, de: number, ate: number, atraso = 0, duracao = 30) =>
  interpolate(frame - atraso, [0, duracao], [de, ate], { ...travar, easing: easeSuave });
