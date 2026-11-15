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

/** Zoom lento de imagem (1 → 1 + amplitudes.zoomImagem ao longo de `duracao` frames). */
export const zoomLento = (frame: number, duracao: number) =>
  1 + amplitudes.zoomImagem * interpolate(frame, [0, Math.max(1, duracao)], [0, 1], { ...travar, easing: easeSuave });

// ─── MODO HISTÓRIA ─────────────────────────────────────────────────────────

/**
 * Carimbo: o elemento cai grande, bate (escala 1) e treme um instante.
 * Use com `estiloCarimbo` em textos de impacto e no CarimboAno.
 */
export const carimbar = (frame: number, atraso = 0) => {
  const t = frame - atraso;
  const prog = interpolate(t, [0, tempos.carimbo], [0, 1], { ...travar, easing: easeSaida });
  const escala = amplitudes.carimboEscalaInicial + (1 - amplitudes.carimboEscalaInicial) * prog;
  const opacidade = interpolate(t, [0, tempos.carimbo * 0.5], [0, 1], travar);
  const pos = t - tempos.carimbo;
  const tremor = pos >= 0 && pos < tempos.entrada ? Math.sin(pos * 2.4) * amplitudes.tremor * (1 - pos / tempos.entrada) : 0;
  return { escala, opacidade, tremor, bateu: t >= tempos.carimbo };
};

export const estiloCarimbo = (frame: number, opcoes: { atraso?: number; giro?: number } = {}): React.CSSProperties => {
  const { atraso = 0, giro = 0 } = opcoes;
  const c = carimbar(frame, atraso);
  return { opacity: c.opacidade, transform: `translate(${c.tremor}px, ${c.tremor * 0.5}px) rotate(${giro}deg) scale(${c.escala})` };
};

/** Texto digitado: quantas letras já apareceram. */
export const digitar = (frame: number, total: number, atraso = 0, porLetra: number = tempos.porLetra) =>
  Math.max(0, Math.min(total, Math.floor((frame - atraso) / porLetra)));

/** Cursor do texto digitado (aceso / apagado). */
export const cursorAceso = (frame: number) => Math.floor(frame / tempos.cursor) % 2 === 0;

/** Deslocamento contínuo (FaixaCorrida, chão do joguinho). */
export const correr = (frame: number, velocidade: number = amplitudes.velocidadeFaixa) => frame * velocidade;

/** Giro contínuo em graus (disco). */
export const girar = (frame: number, periodo: number = tempos.giro) => (frame / periodo) * 360;

/** 0 → 1 suave (barras que crescem, linhas que se desenham). */
export const crescer = (frame: number, atraso = 0, duracao: number = tempos.entrada * 2) =>
  interpolate(frame - atraso, [0, duracao], [0, 1], { ...travar, easing: easeSuave });

/** Pulso 0 → 1 → 0 (nó aceso da linha do tempo). */
export const pulsar = (frame: number, periodo: number = tempos.pulsoNeuronio) => 0.5 * (1 - Math.cos((frame / periodo) * Math.PI * 2));

// ─── MODELOS DE TEXTO, QUIZ E MAPA MENTAL ──────────────────────────────────

/** Onda: sobe e desce `amplitude` px, com cada letra um pouco atrasada da anterior. */
export const ondular = (frame: number, i: number, amplitude = 5) => Math.sin((frame - i * 3) / 6) * amplitude;

/** 0 → 1 em linha reta (barra de tempo do quiz). */
export const linear = (frame: number, inicio: number, fim: number) => interpolate(frame, [inicio, Math.max(inicio + 1, fim)], [0, 1], travar);

/** Viagem de câmera: 0 → 1 suave em `duracao` frames. */
export const viajar = (frame: number, duracao: number = tempos.viagemMapa) => interpolate(frame, [0, duracao], [0, 1], { ...travar, easing: easeSuave });
