/**
 * FORMATO DO ROTEIRO (JSON em /roteiros).
 * Tempos no roteiro são em SEGUNDOS; aqui são convertidos para frames.
 */
import { ItemPreco } from "./componentes/BarrasPreco";
import type { MensagemChat } from "./componentes/Chat";
import { ESTILOS_FALA, EstiloFala } from "./componentes/Fala";
import { ESTILOS_TEXTO, EstiloTexto } from "./componentes/TextoAnimado";
import type { LadoVersus } from "./componentes/Versus";
import { NomeIcone, ICONES } from "./componentes/Icone";
import { NomeObjeto, OBJETOS } from "./componentes/Objeto";
import { NOTAS_VALIDAS } from "./componentes/Pentagrama";
import type { NomeFigurino, NomeFundo } from "./tema/Estilo";
import { validarLegenda } from "./componentes/Legenda";
import { EXPRESSOES, Expressao, IdPersonagem, Mudanca, Olhar, PERSONAGENS, POSES, Pose } from "./personagens/tipos";
import { NomeFormato } from "./tema/formatos";
import { audio, cores, coresDestaque, fps, NomeCor, NomeTema, tempos } from "./tema/tokens";

export type PersonagemRoteiro = {
  id: IdPersonagem;
  pose?: Pose;
  expressao?: Expressao;
  olhando?: Olhar;
  fala?: string;
  falaEm?: number; // segundos desde o início da cena
  mudancas?: { em: number; pose?: Pose; expressao?: Expressao; olhando?: Olhar }[]; // em segundos
  /** (preenchido automaticamente a partir das vozes) duração da fala em frames. */
  _duracaoFala?: number;
  /** (automático) frame em que este personagem começa a narrar sem balão. */
  _narraEm?: number;
};

export type ItemRoteiro = { texto: string; titulo?: string; icone?: NomeIcone; cor?: NomeCor };

export type TipoCena =
  | "intro" | "pergunta" | "explicacao" | "diagrama" | "comparacao" | "lista" | "imagem" | "resumo" | "outro"
  // modo história
  | "capitulo" | "impacto" | "tela" | "objeto" | "preco" | "terminal"
  // modelos novos: quiz, duelo, dado, top N, passo a passo, conversa
  | "quiz" | "versus" | "numero" | "ranking" | "passos" | "chat"
  // nó do mapa mental (só em roteiros com "modelo": "mapa")
  | "no";
export const TIPOS_CENA: TipoCena[] = [
  "intro", "pergunta", "explicacao", "diagrama", "comparacao", "lista", "imagem", "resumo", "outro",
  "capitulo", "impacto", "tela", "objeto", "preco", "terminal",
  "quiz", "versus", "numero", "ranking", "passos", "chat",
  "no",
];

export type CenaRoteiro = {
  tipo: TipoCena;
  duracao?: number; // segundos (intro e outro têm duração fixa)
  personagens?: PersonagemRoteiro[];
  titulo?: string;
  legenda?: string;
  legendaEm?: number; // segundos
  // explicacao
  lousa?: string;
  lousaRotulo?: string;
  cartao?: ItemRoteiro;
  // diagrama / lista
  nos?: ItemRoteiro[];
  itens?: ItemRoteiro[];
  // comparacao
  mito?: string;
  verdade?: string;
  // imagem (moldura de imagem de referência, ex.: print de trailer)
  /** Caminho dentro de public/ (ex.: "gta6/trailer-01.jpg"). Sem ele, a cena mostra um espaço reservado. */
  imagem?: string;
  /** O que deve entrar no espaço reservado (aparece na tela até a imagem ser colocada). */
  imagemDescricao?: string;
  /** Etiqueta no canto da moldura (ex.: "Trailer 2"). */
  imagemRotulo?: string;
  /** Crédito da imagem (ex.: "Imagem: Rockstar Games"). */
  imagemCredito?: string;
  // ── modo história ──
  /** capitulo: texto do carimbo (ex.: "Anos 80", "1997", "Hoje"). */
  ano?: string;
  /** capitulo: nomes das etapas da linha do tempo e qual está acesa (começa em 0). */
  etapas?: string[];
  etapa?: number;
  /** impacto: frase em linhas separadas por " / " (ex.: "Bora / voltar no / *tempo*!"). */
  impacto?: string;
  /** tela: o que passa na TV ("jogo" = joguinho; "texto" = `telaTexto` digitado). */
  tela?: "jogo" | "texto";
  telaTexto?: string;
  /** objeto: adesivo grande (cartucho, disco, console, chip...). */
  objeto?: NomeObjeto;
  /** objeto / impacto: letreiro que corre na tela (ex.: "3 POR 10"). */
  faixa?: string;
  /** preco: barras comparando valores. */
  precos?: ItemPreco[];
  /** terminal: linhas digitadas e, se quiser, uma barra de progresso com rótulo. */
  linhas?: string[];
  terminalTitulo?: string;
  progresso?: string;
  progressoAte?: number;
  // ── modelos novos ──
  /** Modelo de fala só desta cena (senão vale o do roteiro). */
  estiloFala?: EstiloFala;
  /** Modelo de texto só desta cena (senão vale o do roteiro). */
  estiloTexto?: EstiloTexto;
  /** quiz: a pergunta vai em `titulo`; alternativas (2 a 4) e o índice da certa (começa em 0). */
  opcoes?: string[];
  correta?: number;
  /** quiz / versus: segundo em que a resposta (ou o vencedor) aparece. Padrão: 2 s antes do fim da cena. */
  revelarEm?: number;
  /**
   * quiz: segundos para responder (ex.: 10). A contagem regressiva começa quando a pergunta falada termina,
   * a resposta aparece no fim dela e a cena se ajusta sozinha a isso (ignora `revelarEm`).
   */
  tempoResposta?: number;
  /** quiz: texto da etiqueta no topo (padrão "Quiz"), ex.: "Pergunta 3 de 6". */
  etiqueta?: string;
  /** quiz / explicacao: pauta musical (tema música) com as notas, as que ficam em destaque e os nomes embaixo. */
  pauta?: { notas: string[]; destaque?: number[]; corDestaque?: NomeCor; rotulos?: boolean; destacarClave?: boolean };
  /** versus: os dois lados e, se quiser, quem ganha (0 ou 1). */
  lados?: LadoVersus[];
  vencedor?: number;
  /** numero: valor que conta na tela, com prefixo/sufixo ("R$ ", " km", " trilhões") e a explicação. */
  numero?: number;
  numeroCasas?: number;
  numeroPrefixo?: string;
  numeroSufixo?: string;
  numeroRotulo?: string;
  numeroCor?: NomeCor;
  /** ranking: posição desta cena (3, 2, 1...), de quantos (`rankingDe`), nome do item em `titulo`. */
  posicao?: number;
  rankingDe?: number;
  /** passos: número deste passo e total; `titulo` + `cartao` (ícone e texto) descrevem o passo. */
  passo?: number;
  passosDe?: number;
  /** chat: a conversa até aqui. A ÚLTIMA mensagem é a fala desta cena (a voz é de quem a escreveu). */
  mensagens?: MensagemChat[];
  /** no (mapa mental): índice do nó de onde este sai (padrão: o centro, nó 0). Usa `titulo`, `texto`, `icone`, `cor`. */
  de?: number;
  /** no: expressão de quem narra este nó (padrão: feliz). */
  expressao?: Expressao;
  texto?: string;
  icone?: NomeIcone;
  cor?: NomeCor;
  /** (automático) duração da voz desta cena em frames e o frame em que ela começa. */
  _duracaoVoz?: number;
  _vozEm?: number;
  // resumo
  destaque?: string;
  // outro
  chamada?: string;
  botao?: string;
  // voz
  /** Texto falado sem balão (voz em off). Use OU a `fala` de um personagem, OU `narracao`. */
  narracao?: string;
  /** Quem narra (padrão: neuro). Se estiver em cena, a boca mexe. */
  narrador?: IdPersonagem;
  /** Quando a narração começa (segundos, padrão 0,3). */
  narracaoEm?: number;
};

export type Roteiro = {
  /** Identificador do vídeo (pasta das vozes em public/vozes/<id> e nome do roteiro de locução). */
  id?: string;
  /** Trilha de fundo (public/musica/<nome>.mp3) ou false para sem música. Padrão: audio.musicaPadrao. */
  musica?: string | false;
  /** Multiplicador do volume da música (1 = padrão dos tokens; 0.5 = metade). */
  volumeMusica?: number;
  /** Segundos do começo da faixa que são pulados (para tirar uma introdução com som alto). */
  musicaInicio?: number;
  /** Usar vozes de IA (Kokoro)? Padrão: false — as falas são gravadas pela equipe. */
  vozesIA?: boolean;
  /** Pausa (segundos) depois que a voz termina, antes da cena acabar. Padrão: 0,6 s. Menor = voz mais colada. */
  respiroVoz?: number;
  /** "rapido" = transições curtas (tempos.transicaoRapida) e virada de baixo para cima em cada capítulo. */
  ritmo?: "padrao" | "rapido";
  /** Modo história: Neuro pequeno no topo narrando + etiqueta da época (do último `capitulo`). */
  narradorNoCanto?: boolean;
  /** Cenas seguidas com o MESMO elenco não deslizam: os personagens ficam parados e só o conteúdo troca (fade). O deslize fica para quando o elenco muda ou vem um capítulo. */
  elencoContinuo?: boolean;
  /**
   * Modelo do vídeo. "cenas" (padrão) = uma cena depois da outra, com transição.
   * "mapa" = MAPA MENTAL: um mapa só, em câmera contínua, que voa de um nó de neurônio para o outro
   * (cenas do tipo `no` e, no fim, um `outro`, que afasta a câmera e mostra o mapa inteiro).
   */
  modelo?: "cenas" | "mapa";
  /** Modelo de fala do vídeo: balao (padrão), pensamento, grito, legenda, faixa ou recado. */
  estiloFala?: EstiloFala;
  /** Fundo da constelação: "neuronios" (padrão) ou "musical" (alguns nós viram notas musicais). */
  fundo?: NomeFundo;
  /** Roupa do Neuro no vídeo todo: "padrao" ou "maestro" (fraque e batuta). */
  figurino?: NomeFigurino;
  /** Modelo de texto dos títulos: palavra (padrão), maquina, marcador, onda ou recorte. */
  estiloTexto?: EstiloTexto;
  titulo: string;
  /** Etiqueta amarela na intro (ex.: "Ciência", "História", "Você sabia?"). */
  categoria?: string;
  formato: NomeFormato;
  tema?: NomeTema;
  cenas: CenaRoteiro[];
};

export const seg = (s: number) => Math.round(s * fps);

/** Duração (frames) da transição entre cenas deste roteiro. */
export const transicaoDe = (r: Pick<Roteiro, "ritmo" | "modelo">) => (r.modelo === "mapa" ? 0 : r.ritmo === "rapido" ? tempos.transicaoRapida : tempos.transicao);

/** Ids dos personagens de uma cena (com os padrões do resumo e do outro), em ordem alfabética. */
const elencoDe = (c: CenaRoteiro) => (c.tipo === "intro" || c.tipo === "capitulo" ? [] : (c.personagens ?? []).map((p) => p.id).sort());

/** A cena `i` tem o mesmo elenco da anterior? (só vale com `elencoContinuo`). Então a transição vira um fade e os personagens não reaparecem. */
export const mesmoElencoDaAnterior = (r: Roteiro, i: number) => {
  if (!r.elencoContinuo || i === 0) return false;
  const a = elencoDe(r.cenas[i - 1]);
  const b = elencoDe(r.cenas[i]);
  return a.length > 0 && a.join() === b.join();
};

/** Primeira cena do bloco de cenas contínuas que contém a cena `i` (usada para manter o mesmo fundo). */
export const inicioDoBloco = (r: Roteiro, i: number) => {
  let k = i;
  while (k > 0 && mesmoElencoDaAnterior(r, k)) k--;
  return k;
};

/** Época em que a história está na cena `i`: o `ano` do último `capitulo` antes dela. */
export const epocaDaCena = (r: Roteiro, i: number): string | undefined => {
  for (let k = i - 1; k >= 0; k--) if (r.cenas[k].tipo === "capitulo") return r.cenas[k].ano;
  return undefined;
};

// ─── VOZES ─────────────────────────────────────────────────────────────────
/** Manifesto gerado por scripts/gerar-vozes.py (public/vozes/<id>/manifesto.json). */
export type ManifestoVozes = {
  /** "ia" = gerado pelo Kokoro; "gravacao" = gravado pela equipe (importar-gravacoes.py). */
  origem?: "ia" | "gravacao";
  cenas: Record<string, { arquivo: string; duracao: number; quem: IdPersonagem; tipo?: string }>;
};

/** Tempo estimado de uma fala lida com calma (segundos). */
export const estimarFala = (texto: string) => {
  const palavras = texto.replace(/[*_]/g, "").trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1.2, palavras / audio.palavrasPorSegundo + audio.folgaFala);
};

export type VozCena = { duracao: number; arquivo?: string };

/**
 * Voz de uma cena:
 * - gravação da equipe (manifesto de origem "gravacao") → toca o áudio e sincroniza;
 * - voz de IA → só se o roteiro pedir `"vozesIA": true`;
 * - senão (PADRÃO) → sem áudio de voz; a cena reserva o TEMPO ESTIMADO da fala, a boca mexe
 *   nesse tempo e a fala entra no roteiro de locução para a equipe gravar.
 */
export const vozDaCena = (r: Roteiro, i: number, vozes?: ManifestoVozes | null): VozCena | undefined => {
  const f = falaDaCena(r.cenas[i]);
  if (!f) return undefined;
  const v = vozes?.cenas[String(i)];
  const usar = v && (vozes?.origem === "gravacao" || r.vozesIA === true);
  if (usar) return { duracao: v.duracao, arquivo: v.arquivo };
  return { duracao: estimarFala(f.texto) };
};

/** Personagens padrão de algumas cenas (outro e resumo têm o Neuro mesmo sem estar no roteiro). */
export const comPadroes = (c: CenaRoteiro): CenaRoteiro => {
  if (c.personagens) return c;
  if (c.tipo === "outro") return { ...c, personagens: [{ id: "neuro", pose: "acenando", expressao: "feliz", olhando: "frente" }] };
  if (c.tipo === "resumo") return { ...c, personagens: [{ id: "neuro", pose: "comemorando", expressao: "empolgado" }] };
  return c;
};

/** Pausa depois que a voz termina, antes da cena acabar. */
const RESPIRO_VOZ = 18;

/** Quem fala na cena e o texto (para o gerador de vozes e para a sincronia). */
export const falaDaCena = (c: CenaRoteiro): { quem: IdPersonagem; texto: string; tipo: "fala" | "narracao"; em: number } | null => {
  const p = c.personagens?.find((x) => x.fala);
  if (p?.fala) return { quem: p.id, texto: p.fala, tipo: "fala", em: p.falaEm !== undefined ? seg(p.falaEm) : 10 };
  // nó do mapa mental: a narração espera a câmera chegar
  if (c.narracao) return { quem: c.narrador ?? "neuro", texto: c.narracao, tipo: "narracao", em: seg(c.narracaoEm ?? (c.tipo === "no" ? tempos.vozNoMapa : 0.3)) };
  // chat: a última mensagem é a fala da cena, na voz de quem a escreveu
  const ultima = c.tipo === "chat" ? c.mensagens?.[c.mensagens.length - 1] : undefined;
  if (ultima) return { quem: ultima.quem, texto: ultima.texto, tipo: "narracao", em: seg(c.narracaoEm ?? 0.7) };
  return null;
};

/**
 * Quiz com `tempoResposta`: frame em que a contagem começa (quando a pergunta falada termina) e em que a resposta aparece.
 * `vozFrames` = duração da fala em frames (voz de IA ou tempo estimado).
 */
export const tempoDoQuiz = (c: CenaRoteiro, vozFrames?: number) => {
  const f = falaDaCena(c);
  const fimFala = f ? f.em + (vozFrames ?? seg(estimarFala(f.texto))) : tempos.entrada * 3;
  const inicio = Math.max(tempos.entrada * 3, fimFala + tempos.esperaContagem);
  const total = c.tempoResposta !== undefined ? seg(c.tempoResposta) : tempos.respostaQuiz;
  return { inicio, revela: inicio + total };
};

/** Duração da cena em frames (sem contar a sobreposição da transição). A voz estica a cena se precisar. */
export const duracaoCena = (c: CenaRoteiro, voz?: { duracao: number }, respiro: number = RESPIRO_VOZ) => {
  // quiz com contagem: pergunta falada + contagem + a resposta na tela por `tempos.revelarQuiz`
  if (c.tipo === "quiz" && c.tempoResposta !== undefined) return tempoDoQuiz(c, voz ? seg(voz.duracao) : undefined).revela + tempos.revelarQuiz;
  const base = c.tipo === "intro" ? tempos.intro : c.tipo === "outro" ? tempos.outro : seg(c.duracao ?? 4);
  const f = falaDaCena(c);
  if (!voz || !f) return base;
  return Math.max(base, f.em + seg(voz.duracao) + respiro);
};

/** Cada cena ganha +transição frames, porque a transição "come" esse tempo da cena seguinte. */
export const framesCenas = (r: Roteiro, vozes?: ManifestoVozes | null) =>
  r.cenas.map((c, i) => duracaoCena(c, vozDaCena(r, i, vozes), r.respiroVoz !== undefined ? seg(r.respiroVoz) : RESPIRO_VOZ) + (i < r.cenas.length - 1 ? transicaoDe(r) : 0));

export const duracaoTotal = (r: Roteiro, vozes?: ManifestoVozes | null) => {
  const f = framesCenas(r, vozes);
  return f.reduce((a, b) => a + b, 0) - transicaoDe(r) * Math.max(0, f.length - 1);
};

/** Injeta a duração das falas nos personagens (boca e balão sincronizados com o áudio). */
export const aplicarVoz = (c: CenaRoteiro, voz?: { duracao: number }): CenaRoteiro => {
  const f = falaDaCena(c);
  if (!voz || !f) return c;
  const frames = seg(voz.duracao);
  const personagens = (c.personagens ?? []).map((p) => {
    if (f.tipo === "fala" && p.fala) return { ...p, _duracaoFala: frames };
    if (f.tipo === "narracao" && p.id === f.quem) return { ...p, _duracaoFala: frames, _narraEm: f.em };
    return p;
  });
  return { ...c, personagens: c.personagens ? personagens : c.personagens, _duracaoVoz: frames, _vozEm: f.em };
};

export const mudancasEmFrames = (p: PersonagemRoteiro): Mudanca[] =>
  (p.mudancas ?? []).map((m) => ({ ...m, em: seg(m.em) }));

/**
 * Validação do roteiro — erros claros em vez de vídeo fora do padrão.
 */
export const validarRoteiro = (r: Roteiro): string[] => {
  const erros: string[] = [];
  if (!["vertical", "horizontal"].includes(r.formato)) erros.push(`formato inválido: "${r.formato}"`);
  if (r.estiloFala && !ESTILOS_FALA.includes(r.estiloFala)) erros.push(`estiloFala "${r.estiloFala}" não existe (use ${ESTILOS_FALA.join(", ")})`);
  if (r.estiloTexto && !ESTILOS_TEXTO.includes(r.estiloTexto)) erros.push(`estiloTexto "${r.estiloTexto}" não existe (use ${ESTILOS_TEXTO.join(", ")})`);
  if (r.modelo === "mapa") {
    r.cenas.forEach((c, i) => {
      const onde = `cena ${i + 1} (${c.tipo})`;
      const ultima = i === r.cenas.length - 1;
      if (c.tipo !== "no" && !(ultima && c.tipo === "outro")) erros.push(`${onde}: no mapa mental as cenas são do tipo "no" (e um "outro" no fim)`);
      if (c.tipo === "no" && !c.titulo) erros.push(`${onde}: cada nó precisa de "titulo"`);
      if (c.tipo === "no" && c.de !== undefined && (c.de < 0 || c.de >= i || r.cenas[c.de]?.tipo !== "no")) erros.push(`${onde}: "de" precisa apontar para um nó anterior (o centro é 0)`);
      if (c.personagens?.length) erros.push(`${onde}: no mapa mental use "narracao" e "narrador" (sem "personagens")`);
    });
    if (r.cenas.filter((c) => c.tipo === "no").length < 2) erros.push(`mapa mental precisa de pelo menos 2 nós (o primeiro é o centro)`);
  }
  r.cenas.forEach((c, i) => {
    const onde = `cena ${i + 1} (${c.tipo})`;
    if (!TIPOS_CENA.includes(c.tipo)) erros.push(`${onde}: tipo inválido`);
    c.personagens?.forEach((p) => {
      if (!PERSONAGENS.includes(p.id)) erros.push(`${onde}: personagem "${p.id}" não existe`);
      if (p.pose && !POSES.includes(p.pose)) erros.push(`${onde}: pose "${p.pose}" não existe`);
      if (p.expressao && !EXPRESSOES.includes(p.expressao)) erros.push(`${onde}: expressão "${p.expressao}" não existe`);
    });
    if ((c.personagens?.filter((p) => p.fala).length ?? 0) > 1) erros.push(`${onde}: só um personagem fala por cena`);
    if (c.narracao && c.personagens?.some((p) => p.fala)) erros.push(`${onde}: use "fala" OU "narracao", não os dois`);
    if (c.narrador && !PERSONAGENS.includes(c.narrador)) erros.push(`${onde}: narrador "${c.narrador}" não existe`);
    if (c.legenda && !validarLegenda(c.legenda)) erros.push(`${onde}: legenda passa de 2 linhas x 32 caracteres`);
    [...(c.nos ?? []), ...(c.itens ?? []), ...(c.cartao ? [c.cartao] : []), ...(c.precos ?? [])].forEach((it: { icone?: NomeIcone; cor?: NomeCor }) => {
      if (it.icone && !ICONES.includes(it.icone)) erros.push(`${onde}: ícone "${it.icone}" não existe`);
      if (it.cor && !(it.cor in cores)) erros.push(`${onde}: cor "${it.cor}" não existe`);
      else if (it.cor && !coresDestaque.includes(it.cor)) erros.push(`${onde}: cor "${it.cor}" não é de destaque (use ${coresDestaque.join(", ")})`);
    });
    const destaques = new Set([...(c.nos ?? []), ...(c.itens ?? [])].map((it) => it.cor).filter(Boolean));
    if (destaques.size > 3) erros.push(`${onde}: mais de 3 cores de destaque na mesma cena`);
    if (c.tipo === "comparacao" && (!c.mito || !c.verdade)) erros.push(`${onde}: precisa de "mito" e "verdade"`);
    if (c.tipo === "diagrama" && !c.nos?.length) erros.push(`${onde}: precisa de "nos"`);
    if (c.tipo === "lista" && !c.itens?.length) erros.push(`${onde}: precisa de "itens"`);
    if (c.tipo === "imagem" && !c.imagem && !c.imagemDescricao) erros.push(`${onde}: precisa de "imagem" ou "imagemDescricao"`);
    // modo história
    if (c.tipo === "capitulo" && !c.ano) erros.push(`${onde}: precisa de "ano" (texto do carimbo)`);
    if (c.tipo === "capitulo" && c.etapas && (c.etapa === undefined || c.etapa < 0 || c.etapa >= c.etapas.length)) erros.push(`${onde}: "etapa" precisa apontar para uma das "etapas"`);
    if (c.tipo === "impacto" && !c.impacto) erros.push(`${onde}: precisa de "impacto"`);
    if (c.tipo === "impacto" && c.impacto && c.impacto.split("/").length > 4) erros.push(`${onde}: "impacto" com no máximo 4 linhas`);
    if (c.tipo === "objeto" && !c.objeto) erros.push(`${onde}: precisa de "objeto"`);
    if (c.objeto && !OBJETOS.includes(c.objeto)) erros.push(`${onde}: objeto "${c.objeto}" não existe (use ${OBJETOS.join(", ")})`);
    if (c.tipo === "preco" && !c.precos?.length) erros.push(`${onde}: precisa de "precos"`);
    if (c.tipo === "terminal" && !c.linhas?.length) erros.push(`${onde}: precisa de "linhas"`);
    if (c.tipo === "tela" && c.tela === "texto" && !c.telaTexto) erros.push(`${onde}: tela de texto precisa de "telaTexto"`);
    // modelos novos
    if (c.estiloFala && !ESTILOS_FALA.includes(c.estiloFala)) erros.push(`${onde}: estiloFala "${c.estiloFala}" não existe (use ${ESTILOS_FALA.join(", ")})`);
    if (c.estiloTexto && !ESTILOS_TEXTO.includes(c.estiloTexto)) erros.push(`${onde}: estiloTexto "${c.estiloTexto}" não existe (use ${ESTILOS_TEXTO.join(", ")})`);
    if (c.tipo === "quiz") {
      if (!c.titulo) erros.push(`${onde}: a pergunta do quiz vai em "titulo"`);
      if (!c.opcoes || c.opcoes.length < 2 || c.opcoes.length > 4) erros.push(`${onde}: precisa de 2 a 4 "opcoes"`);
      else if (c.correta === undefined || c.correta < 0 || c.correta >= c.opcoes.length) erros.push(`${onde}: "correta" precisa apontar para uma das "opcoes" (começa em 0)`);
    }
    if (c.tempoResposta !== undefined && (c.tipo !== "quiz" || c.tempoResposta < 3 || c.tempoResposta > 30)) erros.push(`${onde}: "tempoResposta" é só para quiz, de 3 a 30 segundos`);
    if (c.pauta) {
      if (!c.pauta.notas?.length || c.pauta.notas.length > 9) erros.push(`${onde}: a pauta precisa de 1 a 9 "notas"`);
      c.pauta.notas?.forEach((n) => {
        if (!NOTAS_VALIDAS(n)) erros.push(`${onde}: nota "${n}" inválida (use do4, re4, fa#4, sol4... ou "?")`);
      });
      if (c.pauta.destaque?.some((d) => d < 0 || d >= (c.pauta?.notas.length ?? 0))) erros.push(`${onde}: "destaque" aponta para uma nota que não existe`);
      if (c.pauta.corDestaque && !coresDestaque.includes(c.pauta.corDestaque)) erros.push(`${onde}: corDestaque "${c.pauta.corDestaque}" não é de destaque`);
    }
    if (c.tipo === "versus") {
      if (c.lados?.length !== 2) erros.push(`${onde}: precisa de exatamente 2 "lados"`);
      if (c.lados?.some((l) => (l.itens?.length ?? 0) > 4)) erros.push(`${onde}: cada lado com no máximo 4 "itens"`);
      if (c.vencedor !== undefined && c.vencedor !== 0 && c.vencedor !== 1) erros.push(`${onde}: "vencedor" é 0 ou 1`);
      c.lados?.forEach((l) => {
        if (l.cor && !coresDestaque.includes(l.cor)) erros.push(`${onde}: cor "${l.cor}" não é de destaque (use ${coresDestaque.join(", ")})`);
      });
    }
    if (c.tipo === "numero" && c.numero === undefined) erros.push(`${onde}: precisa de "numero"`);
    if (c.numeroCor && !coresDestaque.includes(c.numeroCor)) erros.push(`${onde}: numeroCor "${c.numeroCor}" não é de destaque`);
    if (c.tipo === "ranking" && (!c.posicao || !c.titulo)) erros.push(`${onde}: precisa de "posicao" e "titulo"`);
    if (c.tipo === "passos" && (!c.passo || !c.passosDe || c.passo > c.passosDe || !c.titulo)) erros.push(`${onde}: precisa de "passo", "passosDe" e "titulo"`);
    if (c.tipo === "chat") {
      if (!c.mensagens?.length) erros.push(`${onde}: precisa de "mensagens"`);
      if ((c.mensagens?.length ?? 0) > 4) erros.push(`${onde}: no máximo 4 "mensagens" na tela (tire as mais antigas)`);
      c.mensagens?.forEach((m) => {
        if (!PERSONAGENS.includes(m.quem)) erros.push(`${onde}: personagem "${m.quem}" não existe`);
      });
      if (new Set(c.mensagens?.map((m) => m.quem)).size > 2) erros.push(`${onde}: a conversa é entre 2 personagens`);
      if (c.narracao || c.personagens?.some((p) => p.fala)) erros.push(`${onde}: no chat a fala é a última mensagem (não use "fala" nem "narracao")`);
    }
    if (c.tipo === "no" && r.modelo !== "mapa") erros.push(`${onde}: o tipo "no" só existe em roteiros com "modelo": "mapa"`);
    if (c.icone && !ICONES.includes(c.icone)) erros.push(`${onde}: ícone "${c.icone}" não existe`);
    if (c.cor && !coresDestaque.includes(c.cor)) erros.push(`${onde}: cor "${c.cor}" não é de destaque (use ${coresDestaque.join(", ")})`);
  });
  return erros;
};
