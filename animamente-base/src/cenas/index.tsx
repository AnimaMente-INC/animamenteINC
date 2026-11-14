/**
 * TIPOS DE CENA PRONTOS — intro, pergunta, explicacao, diagrama, comparacao, lista, imagem, resumo, outro.
 * Cada cena só monta componentes da base dentro do LayoutCena. Nenhum estilo novo aqui.
 */
import React from "react";
import { useCurrentFrame } from "remotion";
import { estiloEntrada, stagger } from "../animacao";
import { Cartao } from "../componentes/Cartao";
import { ComparacaoMitoVerdade } from "../componentes/ComparacaoMitoVerdade";
import { Destaque } from "../componentes/Destaque";
import { Etiqueta } from "../componentes/Etiqueta";
import { Logo, Marca } from "../componentes/Logo";
import { Lousa } from "../componentes/Lousa";
import { MolduraImagem } from "../componentes/MolduraImagem";
import { Seta } from "../componentes/Seta";
import { textoLimpo } from "../componentes/TextoAnimado";
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
        {cena.lousa && <Lousa formula={cena.lousa} rotulo={cena.lousaRotulo} atraso={8} />}
        {cena.cartao && <Cartao {...cena.cartao} atraso={cena.lousa ? 24 : 8} />}
      </>
    }
    personagens={cena.personagens}
    legenda={cena.legenda}
    legendaEm={legendaEm(cena, 30)}
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
};
