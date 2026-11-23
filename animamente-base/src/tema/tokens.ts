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
  // papéis da colagem dos personagens — só para o corpo dos bichos, nunca para destaques
  gataPelo: "#2E2856", // gata preta (um tom acima do Tinta, para não sumir no fundo)
  cachorroPelo: "#D39A5E",
  preguicaPelo: "#B9A68F",
  preguicaRosto: "#EFE3D0",
  preguicaMascara: "#6B5646",
  elefantePele: "#A9A5C6",
  elefanteOrelha: "#EDA5B8",
  lontraPelo: "#9A633F",
  lontraClaro: "#F2DAC0",
  garra: "#E9E2D6",
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
  // ── modo história (ritmo rápido) ──
  transicaoRapida: 8, // transição curta dos roteiros com "ritmo": "rapido"
  carimbo: 8, // queda do carimbo (CarimboAno, TextoImpacto) até bater
  staggerImpacto: 7, // intervalo entre as linhas do TextoImpacto
  porLetra: 1.5, // frames por letra no texto digitado (JanelaTerminal, TelaRetro)
  cursor: 8, // pisca do cursor do texto digitado
  giro: 4 * fps, // uma volta completa (disco girando)
  // ── modelos de texto e de fala ──
  marcador: 10, // passada do marcador de texto (modelo "marcador")
  porLetraOnda: 1.2, // intervalo entre letras no modelo "onda"
  digitandoChat: 14, // os três pontinhos antes da mensagem nova (cena chat)
  // ── modelos de vídeo novos ──
  revelarQuiz: 2 * fps, // quanto antes do fim da cena a resposta do quiz aparece
  viagemMapa: 26, // a câmera do mapa mental vai de um nó ao outro
  vozNoMapa: 1, // segundos até a narração começar em cada nó (depois que a câmera chega)
  // ── tema música (quiz musical) ──
  respostaQuiz: 10 * fps, // contagem padrão para responder um quiz com "tempoResposta"
  esperaContagem: 6, // frames entre o fim da pergunta falada e o começo da contagem
  popContagem: 6, // pulinho do número da contagem a cada segundo
  compasso: 15, // um tempo da regência do Neuro maestro (120 bpm)
} as const;

export const easings = {
  entrada: [0.34, 1.56, 0.64, 1] as const, // pequeno "pulo" no final
  saida: [0.4, 0, 1, 1] as const,
  suave: [0.45, 0, 0.55, 1] as const, // movimentos contínuos
} as const;

// ─── COLAGEM (personagens) ─────────────────────────────────────────────────
/**
 * Os personagens são colagens de papel recortado (revista, aquarela, respingos, meio-tom),
 * com a boca "South Park": a mandíbula é um recorte separado que desce quando eles falam.
 */
export const colagem = {
  margem: 7, // margem branca (Névoa) do recorte, como papel cortado de revista — a "borda de adesivo"
  tesoura: 4, // quanto as bordas "tremem" (cortes retos de tesoura)
  sombra: { dx: 3, dy: 5, desfoque: 2.2, opacidade: 0.45 }, // papel sobre papel
  passo: 3, // movimento "em degraus" de animação recortada: muda a cada N frames
  quedaMandibula: 46, // quanto a mandíbula desce com a boca toda aberta
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
  rampaVoz: 8, // frames: a música desce e sobe suave quando uma fala começa e termina
} as const;

export const amplitudes = {
  respiracao: 0.02, // escala Y 1 → 1,02
  flutuacao: 10, // px (Neuro sobe e desce)
  deslizeTransicao: 120, // px
  popEscalaInicial: 0.6,
  zoomImagem: 0.06, // zoom lento ("Ken Burns") das imagens de referência: 1 → 1,06 durante a cena
  // ── modo história ──
  carimboEscalaInicial: 2.4, // o carimbo cai deste tamanho até 1
  carimboGiro: 6, // graus de inclinação do carimbo
  tremor: 12, // px de tremida depois que o carimbo bate
  velocidadeFaixa: 5, // px por frame da FaixaCorrida
} as const;

// ─── MODO HISTÓRIA (tela retrô, faixa do narrador) ────────────────────────
export const retro = {
  varredura: 10, // px entre as linhas de varredura da TelaRetro
  opacidadeVarredura: 0.12,
  pixel: 28, // tamanho do "pixel" do joguinho da TelaRetro
  bordaAdesivo: 8, // borda Névoa dos adesivos desenhados em SVG (Objeto, TelaRetro)
} as const;

export const narrador = {
  faixa: 210, // altura reservada no topo (vertical) para o Neuro narrador e a legenda da fala dele
  altura: 250, // altura do Neuro na faixa
  alturaElenco: 520, // altura FIXA dos personagens em todas as cenas do modo história (nunca muda de tamanho)
} as const;

// ─── MODELOS DE FALA (balão, pensamento, grito, legenda, faixa, recado) ───
export const falas = {
  /** Espaço reservado acima dos personagens para cada modelo de fala (vertical; horizontal = 85%). */
  reserva: { balao: 260, pensamento: 320, grito: 360, legenda: 380, faixa: 300, recado: 360 },
  pontasGrito: 16, // pontas do balão de grito
  giroRecado: -2.5, // graus de inclinação do recado de papel
} as const;

// ─── MAPA MENTAL (modelo de vídeo em câmera contínua) ─────────────────────
export const mapa = {
  raio: 1040, // distância do centro até os nós ligados a ele
  raioFilho: 900, // distância de um nó até os filhos dele
  abertura: 42, // graus entre irmãos que saem de um nó que não é o centro
  larguraNo: 660, // largura do cartão de cada nó
  rodape: 420, // faixa de baixo reservada para quem narra e a legenda
  alturaNarrador: 460,
  escalaFinal: 1.35, // no fim, com a câmera longe, os cartões crescem para continuar legíveis
  zoomViagem: 0.78, // a câmera se afasta um pouco no meio da viagem
} as const;

// ─── TEMA MÚSICA (pauta, Neuro maestro, fundo com notas) ──────────────────
export const musica = {
  espacoLinha: 30, // px entre as linhas da pauta (vertical; horizontal = 75%)
  larguraPauta: 880, // largura da pauta (vertical)
  traco: 4, // linhas da pauta e hastes das notas
  cabeca: { rx: 19, ry: 14, giro: -22 }, // cabeça da nota (oval inclinada), em px no vertical
  haste: 3.4, // altura da haste em espaços
  clave: 7, // traço da clave de sol
  notasNoFundo: 0.34, // fração dos nós da constelação que viram notas musicais no fundo "musical"
  contagem: 96, // diâmetro do círculo da contagem regressiva do quiz
  contagemAlerta: 3, // segundos finais em Coral
} as const;
