/**
 * FORMATO DO ROTEIRO (JSON em /roteiros).
 * Tempos no roteiro são em SEGUNDOS; aqui são convertidos para frames.
 */
import { NomeIcone, ICONES } from "./componentes/Icone";
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

export type TipoCena = "intro" | "pergunta" | "explicacao" | "diagrama" | "comparacao" | "lista" | "imagem" | "resumo" | "outro";
export const TIPOS_CENA: TipoCena[] = ["intro", "pergunta", "explicacao", "diagrama", "comparacao", "lista", "imagem", "resumo", "outro"];

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
  // imagem (arquivo em public/, ex.: "imagens/mapa.png") exibida como adesivo na cena `explicacao`
  imagem?: string;
  imagemRotulo?: string;
};

export type Roteiro = {
  /** Identificador do vídeo (pasta das vozes em public/vozes/<id> e nome do roteiro de locução). */
  id?: string;
  /** Trilha de fundo (public/musica/<nome>.mp3) ou false para sem música. Padrão: audio.musicaPadrao. */
  musica?: string | false;
  /** Usar vozes de IA (Kokoro)? Padrão: false — as falas são gravadas pela equipe. */
  vozesIA?: boolean;
  /** Pausa (segundos) depois que a voz termina, antes da cena acabar. Padrão: 0,6 s. Menor = voz mais colada. */
  respiroVoz?: number;
  titulo: string;
  /** Etiqueta amarela na intro (ex.: "Ciência", "História", "Você sabia?"). */
  categoria?: string;
  formato: NomeFormato;
  tema?: NomeTema;
  cenas: CenaRoteiro[];
};

export const seg = (s: number) => Math.round(s * fps);

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
  if (c.narracao) return { quem: c.narrador ?? "neuro", texto: c.narracao, tipo: "narracao", em: seg(c.narracaoEm ?? 0.3) };
  return null;
};

/** Duração da cena em frames (sem contar a sobreposição da transição). A voz estica a cena se precisar. */
export const duracaoCena = (c: CenaRoteiro, voz?: { duracao: number }, respiro: number = RESPIRO_VOZ) => {
  const base = c.tipo === "intro" ? tempos.intro : c.tipo === "outro" ? tempos.outro : seg(c.duracao ?? 4);
  const f = falaDaCena(c);
  if (!voz || !f) return base;
  return Math.max(base, f.em + seg(voz.duracao) + respiro);
};

/** Cada cena ganha +transição frames, porque a transição "come" esse tempo da cena seguinte. */
export const framesCenas = (r: Roteiro, vozes?: ManifestoVozes | null) =>
  r.cenas.map((c, i) => duracaoCena(c, vozDaCena(r, i, vozes), r.respiroVoz !== undefined ? seg(r.respiroVoz) : RESPIRO_VOZ) + (i < r.cenas.length - 1 ? tempos.transicao : 0));

export const duracaoTotal = (r: Roteiro, vozes?: ManifestoVozes | null) => {
  const f = framesCenas(r, vozes);
  return f.reduce((a, b) => a + b, 0) - tempos.transicao * Math.max(0, f.length - 1);
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
  return { ...c, personagens: c.personagens ? personagens : c.personagens };
};

export const mudancasEmFrames = (p: PersonagemRoteiro): Mudanca[] =>
  (p.mudancas ?? []).map((m) => ({ ...m, em: seg(m.em) }));

/**
 * Validação do roteiro — erros claros em vez de vídeo fora do padrão.
 */
export const validarRoteiro = (r: Roteiro): string[] => {
  const erros: string[] = [];
  if (!["vertical", "horizontal"].includes(r.formato)) erros.push(`formato inválido: "${r.formato}"`);
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
    [...(c.nos ?? []), ...(c.itens ?? []), ...(c.cartao ? [c.cartao] : [])].forEach((it) => {
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
  });
  return erros;
};
