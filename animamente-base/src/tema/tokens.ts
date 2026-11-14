/**
 * ANIMAMENTE — TOKENS DO DESIGN SYSTEM DE ANIMAÇÃO
 * Baseado na identidade visual oficial (guia-identidade-visual).
 *
 * Este é o ÚNICO lugar do projeto onde cores, fontes, tamanhos, traços,
 * tempos e easings podem ser definidos. Todo o resto importa daqui.
 * Mudou aqui, muda em todos os vídeos.
 */

// ─── CORES (identidade visual) ───────────────────────────────────────────
export const cores = {
  tinta: "#1F1A3D", // fundo principal, texto sobre fundos claros
  coral: "#F0476B", // cor da marca: cérebro, "mente", destaque principal, botões
  amarelo: "#FFC23D", // segundo destaque: palavra-chave, etiquetas, sublinhados
  lavanda: "#C9C5DD", // texto de apoio, slogan, terceiro destaque
  nevoa: "#F7F6FB", // texto principal no escuro, bordas de "adesivo", neurônios
  // apoio (presentes nas peças da identidade)
  ardosia: "#5A5675", // tracejados, elementos inativos
  lilas: "#D9D6E6", // divisórias sobre fundo claro
  // tons de pele dos personagens
  pele1: "#F6C7A6",
  pele2: "#A0663F",
  pele3: "#C98B5E",
} as const;

export type NomeCor = keyof typeof cores;

/** Cores de destaque permitidas (no máximo 3 por cena — e são exatamente 3). */
export const coresDestaque: NomeCor[] = ["coral", "amarelo", "lavanda"];

export type NomeTema = "escuro" | "claro";

/** Tema padrão da marca: fundo Tinta. */
export const TEMA_PADRAO: NomeTema = "escuro";

/** Tema claro = Névoa e Tinta trocam de lugar; o resto não muda. */
export const paleta = (tema: NomeTema = TEMA_PADRAO) => ({
  ...cores,
  fundo: tema === "escuro" ? cores.tinta : cores.nevoa,
  texto: tema === "escuro" ? cores.nevoa : cores.tinta,
  textoApoio: tema === "escuro" ? cores.lavanda : cores.ardosia,
  /** Borda de "adesivo" — sempre clara, como no logo. */
  borda: cores.nevoa,
  /** Linha que encosta no fundo (setas, conectores). */
  linha: tema === "escuro" ? cores.nevoa : cores.tinta,
});

export type Paleta = ReturnType<typeof paleta>;

/** Cor de token com transparência (ex.: comAlfa("coral", 0.16)). */
export const comAlfa = (nome: NomeCor, alfa: number) => {
  const h = cores[nome].replace("#", "");
  const [r, g2, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
  return `rgba(${r}, ${g2}, ${b}, ${alfa})`;
};

// ─── FUNDO: CONSTELAÇÃO DE NEURÔNIOS ──────────────────────────────────────
export const constelacao = {
  cor: "coral" as NomeCor,
  opacidade: 0.16, // igual às peças da identidade
  pontos: 38, // por 1080×1920 (escala com a área)
  raioGrande: 19,
  raioPequeno: 11,
  traco: 4.4,
  deriva: 14, // px de movimento lento dos neurônios
} as const;

// ─── TIPOGRAFIA (só Fredoka) ──────────────────────────────────────────────
export const fontes = {
  titulo: { familia: "Fredoka", peso: 600 }, // títulos, nome e destaques
  texto: { familia: "Fredoka", peso: 400 }, // textos de apoio e legendas
  textoForte: { familia: "Fredoka", peso: 600 },
  formula: { familia: "Fredoka", peso: 600 }, // fórmulas e números
} as const;

export type NomeFonte = keyof typeof fontes;

/** Tamanhos para o formato VERTICAL. No horizontal, multiplicar por 0,75 (ver formatos.ts). */
export const tamanhosBase = {
  titulo: 104,
  subtitulo: 64,
  legenda: 52,
  rotulo: 40,
  nota: 32,
} as const;

export type NomeTamanho = keyof typeof tamanhosBase;

export const legenda = {
  maxLinhas: 2,
  maxCaracteresPorLinha: 32,
} as const;

// ─── FORMA ────────────────────────────────────────────────────────────────
export const forma = {
  borda: 10, // px — borda branca de "adesivo" (cérebro do logo)
  traco: 6, // px — linhas de rosto, ícones, setas
  tracoFino: 3, // px — conectores, ramos de neurônio
  membro: 13, // px — braços (traço-neurônio)
  raioCartao: 28,
  raioPilula: 999,
  grade: 8,
} as const;

/** Arredonda qualquer medida para a grade de 8px. */
export const g = (n: number) => Math.round(n / forma.grade) * forma.grade;

// ─── MOVIMENTO ────────────────────────────────────────────────────────────
export const fps = 30;

export const tempos = {
  entrada: 12, // frames
  saida: 8,
  transicao: 15,
  stagger: 4,
  trocaPoseExpressao: 6,
  bocaFalando: 4, // alterna aberta/fechada a cada N frames
  respiracao: 2 * fps, // ciclo de 2s
  flutuacao: 3 * fps, // ciclo de 3s (Neuro)
  piscarMin: 3 * fps,
  piscarMax: 5 * fps,
  duracaoPiscada: 5,
  pulsoNeuronio: 2 * fps, // brilho dos nós de neurônio
  intro: 2 * fps,
  outro: 3 * fps,
  porPalavra: 3, // frames entre palavras no texto "palavra por palavra"
} as const;

export const easings = {
  entrada: [0.34, 1.56, 0.64, 1] as const, // pequeno "pulo" no final
  saida: [0.4, 0, 1, 1] as const,
  suave: [0.45, 0, 0.55, 1] as const, // movimentos contínuos
} as const;

// ─── ÁUDIO ────────────────────────────────────────────────────────────────
/**
 * Padrão de áudio dos vídeos: música de fundo BAIXA e ANIMADA, SEM vozes de IA.
 * As falas são gravadas pela equipe a partir do roteiro de locução (npm run locucao).
 */
export const audio = {
  musicaPadrao: "animada-1", // public/musica/<nome>.mp3 (gerar: python3 scripts/gerar-musica.py)
  volumeMusica: 0.16, // baixo: fica por baixo da voz gravada pela equipe
  volumeMusicaComVoz: 0.1, // quando houver voz (gravada) tocando, a música abaixa mais
  fadeEntrada: 20, // frames
  fadeSaida: 45, // frames
  palavrasPorSegundo: 2.4, // ritmo confortável de locução (para estimar o tempo de cada fala)
  folgaFala: 0.4, // segundos extras por fala
} as const;

export const amplitudes = {
  respiracao: 0.02, // escala Y 1 → 1,02
  flutuacao: 10, // px (Neuro sobe e desce)
  deslizeTransicao: 120, // px
  popEscalaInicial: 0.6,
} as const;
