/**
 * LAYOUT PADRÃO DE CENA
 * Vertical:   [conteúdo] / [legenda] / [personagens]  (de cima para baixo, dentro da área segura)
 * Horizontal: [personagens] | [conteúdo + legenda]    (personagens à esquerda)
 */
import React, { createContext, useContext } from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { estiloEntrada, stagger } from "../animacao";
import { Constelacao } from "../componentes/Constelacao";
import { Legenda } from "../componentes/Legenda";
import { Fala, FalaCtx, reservaDaFala } from "../componentes/Fala";
import { Personagem, ritmoFala } from "../personagens/Personagem";
import { mudancasEmFrames, PersonagemRoteiro, seg } from "../roteiro";
import { useEstilo } from "../tema/Estilo";

/** Fundo padrão: cor do tema + constelação de neurônios (cada cena com uma semente diferente). */
export const Fundo: React.FC<{ children?: React.ReactNode; semente?: number }> = ({ children, semente = 1 }) => {
  const { p } = useEstilo();
  return (
    <AbsoluteFill style={{ background: p.fundo }}>
      <Constelacao semente={semente} />
      {children}
    </AbsoluteFill>
  );
};

/** true quando a cena continua o mesmo elenco da anterior: os personagens já estão em cena, não "entram" de novo. */
export const ContinuaCtx = createContext(false);
/** Altura fixa dos personagens (px) quando o roteiro pede elenco contínuo; undefined = cada cena decide. */
export const AlturaFixaCtx = createContext<number | undefined>(undefined);

export const GrupoPersonagens: React.FC<{ personagens: PersonagemRoteiro[]; atraso?: number; altura?: number }> = ({ personagens, atraso = 0, altura }) => {
  const frame = useCurrentFrame();
  const { formato } = useEstilo();
  const continua = useContext(ContinuaCtx);
  const estiloFala = useContext(FalaCtx);
  const n = personagens.length;
  const iFala = personagens.findIndex((p) => p.fala);
  const quemFala = iFala >= 0 ? personagens[iFala] : null;
  // o balão fica centralizado acima do grupo (nunca sai da tela); o rabicho aponta para quem fala
  const rabicho = n === 1 ? 0.5 : iFala === 0 ? 0.24 : iFala === n - 1 ? 0.76 : 0.5;
  return (
    <div style={{ position: "relative", display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 24 }}>
      {quemFala?.fala && (
        <div style={{ position: "absolute", bottom: "calc(100% + 24px)", left: "50%", transform: "translateX(-50%)", width: "max-content", maxWidth: formato === "vertical" ? 900 : 700 }}>
          <Fala
            estilo={estiloFala}
            texto={quemFala.fala}
            quem={quemFala.id}
            atraso={quemFala.falaEm !== undefined ? seg(quemFala.falaEm) : 10}
            rabicho={rabicho}
            porPalavra={ritmoFala(quemFala.fala, quemFala._duracaoFala)}
            duracaoFala={quemFala._duracaoFala}
          />
        </div>
      )}
      {personagens.map((pr, i) => {
        // padrão: o primeiro olha para a direita, o segundo para a esquerda (um olha para o outro)
        const olhando = pr.olhando ?? (personagens.length > 1 ? (i === 0 ? "direita" : "esquerda") : "frente");
        return (
          <div key={i} style={{ ...(continua ? {} : estiloEntrada(frame, { atraso: stagger(i, atraso), tipo: "subir" })), transformOrigin: "50% 100%" }}>
            <Personagem
              id={pr.id}
              pose={pr.pose}
              expressao={pr.expressao}
              olhando={olhando}
              fala={pr.fala}
              falaEm={pr.falaEm !== undefined ? seg(pr.falaEm) : 10}
              mudancas={mudancasEmFrames(pr)}
              altura={altura}
              duracaoFala={pr._duracaoFala}
              narraEm={pr._narraEm}
              semBalao
              calado={estiloFala === "pensamento"}
            />
          </div>
        );
      })}
    </div>
  );
};

export const LayoutCena: React.FC<{
  conteudo?: React.ReactNode;
  personagens?: PersonagemRoteiro[];
  legenda?: string;
  legendaEm?: number; // frames
  alturaPersonagem?: number;
  semente?: number;
}> = ({ conteudo, personagens = [], legenda, legendaEm = 20, alturaPersonagem: alturaDaCena, semente }) => {
  const { formato, area } = useEstilo();
  const alturaFixa = useContext(AlturaFixaCtx);
  const estiloFala = useContext(FalaCtx);
  const alturaPersonagem = alturaFixa ?? alturaDaCena;
  const temFala = personagens.some((p) => p.fala);
  const reservaBalao = temFala ? reservaDaFala(estiloFala, formato === "vertical") : 0;

  const blocoPersonagens = personagens.length > 0 && (
    <div style={{ paddingTop: reservaBalao, display: "flex", justifyContent: "center" }}>
      <GrupoPersonagens personagens={personagens} altura={alturaPersonagem} />
    </div>
  );
  const blocoLegenda = legenda && (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <Legenda texto={legenda} atraso={legendaEm} />
    </div>
  );

  if (formato === "vertical") {
    return (
      <Fundo semente={semente}>
        <div style={{ position: "absolute", left: area.x, top: area.y, width: area.largura, height: area.altura, display: "flex", flexDirection: "column", gap: 40 }}>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 40 }}>{conteudo}</div>
          {blocoLegenda}
          {blocoPersonagens}
        </div>
      </Fundo>
    );
  }

  return (
    <Fundo semente={semente}>
      <div style={{ position: "absolute", left: area.x, top: area.y, width: area.largura, height: area.altura, display: "flex", gap: 64, alignItems: "stretch" }}>
        {blocoPersonagens && <div style={{ width: "38%", display: "flex", alignItems: "flex-end", justifyContent: "center" }}>{blocoPersonagens}</div>}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 40 }}>
          {conteudo}
          {blocoLegenda}
        </div>
      </div>
    </Fundo>
  );
};
