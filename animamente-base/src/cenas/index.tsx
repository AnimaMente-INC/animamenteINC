/**
 * TIPOS DE CENA PRONTOS — intro, pergunta, explicacao, diagrama, comparacao, lista, imagem, resumo, outro,
 * as cenas do MODO HISTÓRIA (capitulo, impacto, tela, objeto, preco, terminal)
 * e os MODELOS NOVOS (quiz, versus, numero, ranking, passos, chat).
 * Cada cena só monta componentes da base dentro do LayoutCena. Nenhum estilo novo aqui.
 */
import React from "react";
import { useCurrentFrame } from "remotion";
import { estiloEntrada, stagger } from "../animacao";
import { BarrasPreco } from "../componentes/BarrasPreco";
import { CarimboAno, LinhaDoTempo } from "../componentes/Carimbo";
import { Cartao } from "../componentes/Cartao";
import { Chat } from "../componentes/Chat";
import { Medalha, NumeroGigante } from "../componentes/NumeroGigante";
import { Quiz } from "../componentes/Quiz";
import { TextoAnimado } from "../componentes/TextoAnimado";
import { Versus } from "../componentes/Versus";
import { ComparacaoMitoVerdade } from "../componentes/ComparacaoMitoVerdade";
import { Destaque } from "../componentes/Destaque";
import { Etiqueta } from "../componentes/Etiqueta";
import { FaixaCorrida } from "../componentes/FaixaCorrida";
import { Imagem } from "../componentes/Imagem";
import { JanelaTerminal } from "../componentes/JanelaTerminal";
import { Logo, Marca } from "../componentes/Logo";
import { Lousa } from "../componentes/Lousa";
import { MolduraImagem } from "../componentes/MolduraImagem";
import { Objeto } from "../componentes/Objeto";
import { Seta } from "../componentes/Seta";
import { TelaRetro } from "../componentes/TelaRetro";
import { textoLimpo } from "../componentes/TextoAnimado";
import { TextoImpacto } from "../componentes/TextoImpacto";
import { Titulo } from "../componentes/Titulo";
import { CenaRoteiro, ItemRoteiro, Roteiro, seg } from "../roteiro";
import { useEstilo } from "../tema/Estilo";
import { tempos } from "../tema/tokens";
import { Fundo, GrupoPersonagens, LayoutCena } from "./LayoutCena";

export type PropsCena = { cena: CenaRoteiro; roteiro: Roteiro; duracao: number; indice: number };

const legendaEm = (c: CenaRoteiro, padrao: number) => (c.legendaEm !== undefined ? seg(c.legendaEm) : padrao);

// ─── INTRO (2s): símbolo A+M + etiqueta de categoria + título do vídeo ────────
export const CenaIntro: React.FC<PropsCena> = ({ roteiro, indice }) => {
  const { formato } = useEstilo();
  return (
    <Fundo semente={indice + 1}>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 40, padding: 80 }}>
        <Logo tamanho={formato === "vertical" ? 460 : 340} />
        {roteiro.categoria && <Etiqueta texto={roteiro.categoria} tamanho="rotulo" atraso={tempos.entrada * 1.5} animar />}
        <Titulo texto={roteiro.titulo} atraso={tempos.entrada * 2} />
      </div>
    </Fundo>
  );
};

// ─── PERGUNTA: personagem pergunta (normalmente a Lia) ─────────────────────
export const CenaPergunta: React.FC<PropsCena> = ({ cena, indice }) => (
  <LayoutCena
    semente={indice + 1}
    conteudo={cena.titulo && <Titulo texto={cena.titulo} atraso={4} />}
    personagens={cena.personagens}
    legenda={cena.legenda}
    legendaEm={legendaEm(cena, 30)}
  />
);

// ─── EXPLICAÇÃO: personagem + lousa ou cartão + legenda ───────────────────
export const CenaExplicacao: React.FC<PropsCena> = ({ cena, indice }) => (
  <LayoutCena
    semente={indice + 1}
    conteudo={
      <>
        {cena.titulo && <Titulo texto={cena.titulo} tamanho="subtitulo" atraso={2} />}
        {cena.imagem && <Imagem arquivo={cena.imagem} rotulo={cena.imagemRotulo} atraso={8} />}
        {cena.lousa && <Lousa formula={cena.lousa} rotulo={cena.lousaRotulo} atraso={8} />}
        {cena.cartao && <Cartao {...cena.cartao} atraso={cena.lousa ? 24 : 8} />}
      </>
    }
    personagens={cena.personagens}
    legenda={cena.legenda}
    legendaEm={legendaEm(cena, 30)}
    alturaPersonagem={cena.imagem ? 480 : undefined}
  />
);

// ─── DIAGRAMA: nós ligados por setas-neurônio ──────────────────────────────
const SetaFluxo: React.FC<{ atraso: number; direcao: "baixo" | "direita" }> = ({ atraso, direcao }) => {
  const t = 72;
  return (
    <div style={{ position: "relative", width: t, height: t, flexShrink: 0 }}>
      {direcao === "baixo" ? (
        <Seta de={{ x: t / 2, y: 8 }} para={{ x: t / 2, y: t - 6 }} curva={0} atraso={atraso} cor="amarelo" />
      ) : (
        <Seta de={{ x: 8, y: t / 2 }} para={{ x: t - 6, y: t / 2 }} curva={0} atraso={atraso} cor="amarelo" />
      )}
    </div>
  );
};

export const CenaDiagrama: React.FC<PropsCena> = ({ cena, duracao, indice }) => {
  const { formato } = useEstilo();
  const nos = cena.nos ?? [];
  const passo = Math.max(tempos.entrada + tempos.stagger, Math.floor((duracao * 0.6) / Math.max(1, nos.length)));
  const vertical = formato === "vertical";
  return (
    <LayoutCena
      semente={indice + 1}
      conteudo={
        <>
          {cena.titulo && <Titulo texto={cena.titulo} tamanho="subtitulo" atraso={2} />}
          <div style={{ display: "flex", flexDirection: vertical ? "column" : "row", alignItems: "center", gap: 8, width: vertical ? "88%" : "100%" }}>
            {nos.map((n, i) => (
              <React.Fragment key={i}>
                {i > 0 && <SetaFluxo atraso={8 + i * passo - 10} direcao={vertical ? "baixo" : "direita"} />}
                <Cartao {...n} atraso={8 + i * passo} largura={vertical ? "100%" : undefined} />
              </React.Fragment>
            ))}
          </div>
        </>
      }
      personagens={cena.personagens}
      legenda={cena.legenda}
      legendaEm={legendaEm(cena, 8 + nos.length * passo)}
      alturaPersonagem={vertical ? 500 : undefined}
    />
  );
};

// ─── COMPARAÇÃO: mito x verdade ───────────────────────────────────────────
export const CenaComparacao: React.FC<PropsCena> = ({ cena, indice }) => {
  const { formato } = useEstilo();
  return (
    <LayoutCena
      semente={indice + 1}
      conteudo={
        <>
          {cena.titulo && <Titulo texto={cena.titulo} tamanho="subtitulo" atraso={2} />}
          <ComparacaoMitoVerdade mito={cena.mito ?? ""} verdade={cena.verdade ?? ""} atraso={8} />
        </>
      }
      personagens={cena.personagens}
      legenda={cena.legenda}
      legendaEm={legendaEm(cena, 50)}
      alturaPersonagem={formato === "vertical" ? 540 : undefined}
    />
  );
};

// ─── LISTA: título + itens numerados em sequência ─────────────────────────
export const CenaLista: React.FC<PropsCena> = ({ cena, duracao, indice }) => {
  const itens: ItemRoteiro[] = cena.itens ?? [];
  const passo = Math.max(tempos.entrada * 2, Math.floor((duracao * 0.6) / Math.max(1, itens.length)));
  return (
    <LayoutCena
      semente={indice + 1}
      conteudo={
        <>
          {cena.titulo && <Titulo texto={cena.titulo} tamanho="subtitulo" atraso={2} />}
          <div style={{ display: "flex", flexDirection: "column", gap: 24, width: "92%" }}>
            {itens.map((it, i) => (
              <Cartao key={i} {...it} titulo={it.titulo ?? `${i + 1}.`} atraso={10 + i * passo} entrada="deslizar" />
            ))}
          </div>
        </>
      }
      personagens={cena.personagens}
      legenda={cena.legenda}
      legendaEm={legendaEm(cena, 10 + itens.length * passo)}
      alturaPersonagem={500}
    />
  );
};

// ─── IMAGEM: imagem de referência (ex.: print de trailer) em moldura de adesivo ─
export const CenaImagem: React.FC<PropsCena> = ({ cena, duracao, indice }) => {
  const { formato } = useEstilo();
  return (
    <LayoutCena
      semente={indice + 1}
      conteudo={
        <>
          {cena.titulo && <Titulo texto={cena.titulo} tamanho="subtitulo" atraso={2} />}
          <MolduraImagem
            imagem={cena.imagem}
            descricao={cena.imagemDescricao}
            rotulo={cena.imagemRotulo}
            credito={cena.imagemCredito}
            atraso={6}
            duracao={duracao}
          />
        </>
      }
      personagens={cena.personagens}
      legenda={cena.legenda}
      legendaEm={legendaEm(cena, 30)}
      alturaPersonagem={formato === "vertical" ? 480 : undefined}
    />
  );
};

// ─── RESUMO: Neuro fecha a ideia com um destaque circulado ─────────────────
const FraseDestaque: React.FC<{ texto: string; atraso: number }> = ({ texto, atraso }) => {
  const frame = useCurrentFrame();
  // frase curta: circulada; frase longa: sublinhada (o círculo cortaria as palavras)
  if (textoLimpo(texto).length > 20) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, ...estiloEntrada(frame, { atraso }) }}>
        <Titulo texto={texto} atraso={atraso} />
        <div style={{ width: "70%" }}>
          <Destaque tipo="sublinhado" atraso={atraso + 14} />
        </div>
      </div>
    );
  }
  return (
    <div style={{ position: "relative", padding: "64px 110px", ...estiloEntrada(frame, { atraso }) }}>
      <Titulo texto={texto} atraso={atraso} />
      <div style={{ position: "absolute", inset: 0 }}>
        <Destaque tipo="circulo" atraso={atraso + 14} altura="100%" />
      </div>
    </div>
  );
};

export const CenaResumo: React.FC<PropsCena> = ({ cena, indice }) => (
  <LayoutCena
    semente={indice + 1}
    conteudo={cena.destaque && <FraseDestaque texto={cena.destaque} atraso={6} />}
    personagens={cena.personagens ?? [{ id: "neuro", pose: "comemorando", expressao: "empolgado" }]}
    legenda={cena.legenda}
    legendaEm={legendaEm(cena, 40)}
  />
);

// ─── OUTRO (3s): Neuro acenando + marca + botão ───────────────────────────
export const CenaOutro: React.FC<PropsCena> = ({ cena, indice }) => {
  const { formato, area } = useEstilo();
  const vertical = formato === "vertical";
  return (
    <Fundo semente={indice + 1}>
      <div
        style={{
          position: "absolute",
          left: area.x,
          top: area.y,
          width: area.largura,
          height: area.altura,
          display: "flex",
          flexDirection: vertical ? "column" : "row",
          alignItems: "center",
          justifyContent: "center",
          gap: vertical ? 48 : 80,
        }}
      >
        <GrupoPersonagens personagens={cena.personagens ?? [{ id: "neuro", pose: "acenando", expressao: "feliz", olhando: "frente" }]} altura={vertical ? 720 : 560} />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 28 }}>
          <Titulo texto={cena.chamada ?? "Continue _aprendendo_!"} atraso={8} />
          <Marca tamanho="subtitulo" atraso={8 + stagger(4)} />
          <Etiqueta texto={cena.botao ?? "Siga para mais"} cor="coral" tamanho="rotulo" atraso={8 + stagger(8)} animar />
        </div>
      </div>
    </Fundo>
  );
};

// ═══ MODO HISTÓRIA ═════════════════════════════════════════════════════════
/** Altura dos personagens nas cenas de história (sobra espaço para o conteúdo e a faixa do narrador). */
// altura fixa: os personagens ficam do mesmo tamanho e no mesmo lugar de uma cena para outra (cenas contínuas)
const alturaHistoria = (formato: string, _temFala: boolean) => (formato === "vertical" ? 520 : undefined);
const temFala = (c: CenaRoteiro) => !!c.personagens?.some((p) => p.fala);

// ─── CAPÍTULO: carimbo da época + linha do tempo (cena curta, sem personagens) ─
export const CenaCapitulo: React.FC<PropsCena> = ({ cena, indice }) => {
  const { area } = useEstilo();
  return (
    <Fundo semente={indice + 1}>
      <div style={{ position: "absolute", left: area.x, top: area.y, width: area.largura, height: area.altura, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 56 }}>
        {cena.etapas && <LinhaDoTempo etapas={cena.etapas} atual={cena.etapa ?? 0} atraso={2} />}
        <CarimboAno texto={cena.ano ?? ""} atraso={4} />
        {cena.titulo && <Titulo texto={cena.titulo} tamanho="subtitulo" atraso={4 + tempos.carimbo} />}
      </div>
    </Fundo>
  );
};

// ─── IMPACTO: frase carimbada linha por linha ──────────────────────────────
export const CenaImpacto: React.FC<PropsCena> = ({ cena, indice }) => {
  const { formato } = useEstilo();
  const comGente = (cena.personagens?.length ?? 0) > 0;
  return (
    <LayoutCena
      semente={indice + 1}
      conteudo={
        <>
          <TextoImpacto texto={cena.impacto ?? ""} atraso={4} escala={comGente && temFala(cena) ? 0.72 : 1} />
          {cena.faixa && <FaixaCorrida texto={cena.faixa} atraso={16} />}
        </>
      }
      personagens={cena.personagens}
      legenda={cena.legenda}
      legendaEm={legendaEm(cena, 30)}
      alturaPersonagem={alturaHistoria(formato, temFala(cena))}
    />
  );
};

// ─── TELA: TV de tubo com o joguinho + personagens jogando ─────────────────
export const CenaTela: React.FC<PropsCena> = ({ cena, indice }) => {
  const { formato } = useEstilo();
  const fala = temFala(cena);
  return (
    <LayoutCena
      semente={indice + 1}
      conteudo={
        <>
          {cena.titulo && <Titulo texto={cena.titulo} tamanho="subtitulo" atraso={2} />}
          <TelaRetro modo={cena.tela ?? "jogo"} texto={cena.telaTexto} atraso={4} largura={formato === "vertical" ? (fala ? 600 : 680) : undefined} />
        </>
      }
      personagens={cena.personagens}
      legenda={cena.legenda}
      legendaEm={legendaEm(cena, 30)}
      alturaPersonagem={alturaHistoria(formato, fala)}
    />
  );
};

// ─── OBJETO: adesivo grande + título + letreiro opcional ───────────────────
export const CenaObjeto: React.FC<PropsCena> = ({ cena, indice }) => {
  const { formato } = useEstilo();
  const fala = temFala(cena);
  // o adesivo ocupa o espaço que sobra: menor quando há balão de fala ou legenda
  const tamanho = fala || (cena.legenda && cena.faixa) ? 440 : cena.legenda ? 520 : 620;
  return (
    <LayoutCena
      semente={indice + 1}
      conteudo={
        <>
          {cena.titulo && <Titulo texto={cena.titulo} tamanho="subtitulo" atraso={2} />}
          {cena.objeto && <Objeto nome={cena.objeto} atraso={6} tamanho={formato === "vertical" ? tamanho : undefined} />}
          {cena.faixa && <FaixaCorrida texto={cena.faixa} atraso={14} />}
        </>
      }
      personagens={cena.personagens}
      legenda={cena.legenda}
      legendaEm={legendaEm(cena, 30)}
      alturaPersonagem={alturaHistoria(formato, fala)}
    />
  );
};

// ─── PREÇO: barras comparando valores ──────────────────────────────────────
export const CenaPreco: React.FC<PropsCena> = ({ cena, indice }) => {
  const { formato } = useEstilo();
  return (
    <LayoutCena
      semente={indice + 1}
      conteudo={
        <>
          {cena.titulo && <Titulo texto={cena.titulo} tamanho="subtitulo" atraso={2} />}
          <div style={{ width: "94%" }}>
            <BarrasPreco itens={cena.precos ?? []} atraso={10} />
          </div>
        </>
      }
      personagens={cena.personagens}
      legenda={cena.legenda}
      legendaEm={legendaEm(cena, 46)}
      alturaPersonagem={alturaHistoria(formato, temFala(cena))}
    />
  );
};

// ─── TERMINAL: texto digitado numa janela + barra de progresso opcional ────
export const CenaTerminal: React.FC<PropsCena> = ({ cena, duracao, indice }) => {
  const { formato } = useEstilo();
  return (
    <LayoutCena
      semente={indice + 1}
      conteudo={
        <>
          {cena.titulo && <Titulo texto={cena.titulo} tamanho="subtitulo" atraso={2} />}
          <JanelaTerminal linhas={cena.linhas ?? []} titulo={cena.terminalTitulo} progresso={cena.progresso} progressoAte={cena.progressoAte} atraso={6} duracao={duracao} />
        </>
      }
      personagens={cena.personagens}
      legenda={cena.legenda}
      legendaEm={legendaEm(cena, 40)}
      alturaPersonagem={alturaHistoria(formato, temFala(cena))}
    />
  );
};

// ═══ MODELOS NOVOS: quiz, versus, numero, ranking, passos, chat ════════════
/** Frame em que a resposta do quiz (ou o vencedor do versus) aparece. */
const revelar = (c: CenaRoteiro, duracao: number) => (c.revelarEm !== undefined ? seg(c.revelarEm) : Math.max(tempos.entrada * 3, duracao - tempos.revelarQuiz - tempos.transicao));

// ─── QUIZ: pergunta + alternativas + barra de tempo + resposta ─────────────
export const CenaQuiz: React.FC<PropsCena> = ({ cena, duracao, indice }) => {
  const { formato } = useEstilo();
  return (
    <LayoutCena
      semente={indice + 1}
      conteudo={
        <>
          <Etiqueta texto="Quiz" tamanho="rotulo" atraso={0} animar />
          {cena.titulo && <Titulo texto={cena.titulo} tamanho="subtitulo" atraso={4} />}
          <Quiz opcoes={cena.opcoes ?? []} correta={cena.correta ?? 0} atraso={tempos.entrada * 2} revelarEm={revelar(cena, duracao)} />
        </>
      }
      personagens={cena.personagens}
      legenda={cena.legenda}
      legendaEm={legendaEm(cena, revelar(cena, duracao) + tempos.entrada)}
      alturaPersonagem={formato === "vertical" ? ((cena.opcoes?.length ?? 0) > 3 ? 400 : 460) : undefined}
    />
  );
};

// ─── VERSUS: dois lados frente a frente ────────────────────────────────────
export const CenaVersus: React.FC<PropsCena> = ({ cena, duracao, indice }) => {
  const { formato } = useEstilo();
  return (
    <LayoutCena
      semente={indice + 1}
      conteudo={
        <>
          {cena.titulo && <Titulo texto={cena.titulo} tamanho="subtitulo" atraso={2} />}
          <div style={{ width: "100%", paddingTop: formato === "vertical" ? 66 : 0 }}>
            <Versus lados={cena.lados ?? []} atraso={8} vencedor={cena.vencedor} revelarEm={revelar(cena, duracao)} />
          </div>
        </>
      }
      personagens={cena.personagens}
      legenda={cena.legenda}
      legendaEm={legendaEm(cena, 50)}
      alturaPersonagem={formato === "vertical" ? 480 : undefined}
    />
  );
};

// ─── NÚMERO: um dado gigante que conta na tela ─────────────────────────────
export const CenaNumero: React.FC<PropsCena> = ({ cena, indice }) => {
  const { formato } = useEstilo();
  return (
    <LayoutCena
      semente={indice + 1}
      conteudo={
        <>
          {cena.titulo && <Titulo texto={cena.titulo} tamanho="subtitulo" atraso={2} />}
          <NumeroGigante valor={cena.numero ?? 0} casas={cena.numeroCasas} prefixo={cena.numeroPrefixo} sufixo={cena.numeroSufixo} rotulo={cena.numeroRotulo} cor={cena.numeroCor} atraso={8} escala={temFala(cena) ? 0.8 : 1} />
        </>
      }
      personagens={cena.personagens}
      legenda={cena.legenda}
      legendaEm={legendaEm(cena, 60)}
      alturaPersonagem={formato === "vertical" ? 520 : undefined}
    />
  );
};

// ─── RANKING: a posição da vez (3º, 2º, 1º...) ─────────────────────────────
export const CenaRanking: React.FC<PropsCena> = ({ cena, indice }) => {
  const { formato, p } = useEstilo();
  const de = Math.max(cena.rankingDe ?? cena.posicao ?? 1, cena.posicao ?? 1);
  const etapas = Array.from({ length: de }, (_, i) => `${de - i}º`);
  const vertical = formato === "vertical";
  return (
    <LayoutCena
      semente={indice + 1}
      conteudo={
        <>
          {de > 1 && (
            <div style={{ width: vertical ? "78%" : "60%" }}>
              <LinhaDoTempo etapas={etapas} atual={de - (cena.posicao ?? 1)} atraso={2} />
            </div>
          )}
          <div style={{ display: "flex", flexDirection: vertical ? "column" : "row", alignItems: "center", gap: vertical ? 30 : 48 }}>
            <Medalha posicao={cena.posicao ?? 1} atraso={6} tamanho={vertical ? (temFala(cena) ? 250 : 320) : 220} />
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
              {cena.titulo && <Titulo texto={cena.titulo} atraso={6 + tempos.carimbo} />}
              {cena.texto && <TextoAnimado texto={cena.texto} fonte="texto" tamanho="legenda" cor={p.textoApoio} atraso={6 + tempos.carimbo + tempos.entrada} larguraMax="17em" />}
            </div>
          </div>
        </>
      }
      personagens={cena.personagens}
      legenda={cena.legenda}
      legendaEm={legendaEm(cena, 40)}
      alturaPersonagem={vertical ? 480 : undefined}
    />
  );
};

// ─── PASSOS: passo a passo com a trilha de etapas no topo ──────────────────
export const CenaPassos: React.FC<PropsCena> = ({ cena, indice }) => {
  const { formato } = useEstilo();
  const total = cena.passosDe ?? 1;
  const vertical = formato === "vertical";
  return (
    <LayoutCena
      semente={indice + 1}
      conteudo={
        <>
          <div style={{ width: vertical ? "78%" : "60%" }}>
            <LinhaDoTempo etapas={Array.from({ length: total }, (_, i) => `${i + 1}`)} atual={(cena.passo ?? 1) - 1} atraso={2} />
          </div>
          <Etiqueta texto={`Passo ${cena.passo ?? 1} de ${total}`} cor="coral" tamanho="rotulo" atraso={tempos.carimbo} animar />
          {cena.titulo && <Titulo texto={cena.titulo} tamanho={vertical && !temFala(cena) ? "titulo" : "subtitulo"} atraso={tempos.carimbo + 4} />}
          {cena.cartao && (
            <div style={{ width: "94%" }}>
              <Cartao {...cena.cartao} atraso={tempos.carimbo + tempos.entrada * 2} entrada="subir" />
            </div>
          )}
        </>
      }
      personagens={cena.personagens}
      legenda={cena.legenda}
      legendaEm={legendaEm(cena, 50)}
      alturaPersonagem={vertical ? 480 : undefined}
    />
  );
};

// ─── CHAT: a conversa como mensagens de celular (sem personagens embaixo) ──
export const CenaChat: React.FC<PropsCena> = ({ cena, indice }) => (
  <LayoutCena
    semente={indice + 1}
    conteudo={
      <div style={{ flex: 1, alignSelf: "stretch", display: "flex", flexDirection: "column", gap: 32 }}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Etiqueta texto={cena.titulo ?? "Conversa"} cor="lavanda" tamanho="rotulo" />
        </div>
        <div style={{ flex: 1, display: "flex", alignItems: "flex-end" }}>
          <Chat mensagens={cena.mensagens ?? []} falaEm={cena._vozEm} duracaoFala={cena._duracaoVoz} />
        </div>
      </div>
    }
    legenda={cena.legenda}
    legendaEm={legendaEm(cena, 30)}
  />
);

export const CENAS: Record<CenaRoteiro["tipo"], React.FC<PropsCena>> = {
  intro: CenaIntro,
  pergunta: CenaPergunta,
  explicacao: CenaExplicacao,
  diagrama: CenaDiagrama,
  comparacao: CenaComparacao,
  lista: CenaLista,
  imagem: CenaImagem,
  resumo: CenaResumo,
  outro: CenaOutro,
  capitulo: CenaCapitulo,
  impacto: CenaImpacto,
  tela: CenaTela,
  objeto: CenaObjeto,
  preco: CenaPreco,
  terminal: CenaTerminal,
  quiz: CenaQuiz,
  versus: CenaVersus,
  numero: CenaNumero,
  ranking: CenaRanking,
  passos: CenaPassos,
  chat: CenaChat,
  // o nó do mapa mental não é uma cena solta: quem desenha é o <MapaMental /> (modelo "mapa")
  no: () => null,
};
