/**
 * FAIXA DO NARRADOR — "modo história": o Neuro fica pequeno no canto de cima contando a história
 * (a boca mexe enquanto ele narra) e, ao lado dele, uma legenda mostra tudo o que ele fala,
 * palavra por palavra no ritmo da voz. A etiqueta da época fica embaixo do Neuro.
 * Ligue no roteiro com "narradorNoCanto": true. A faixa ocupa `narrador.faixa` px do topo da área útil.
 *
 * <NarradorSobreposto /> desenha a faixa UMA vez por cima das transições (ela não desliza junto com as cenas).
 */
import React from "react";
import { Sequence, useCurrentFrame } from "remotion";
import { estiloEntrada } from "../animacao";
import { Personagem } from "../personagens/Personagem";
import { useEstilo } from "../tema/Estilo";
import { forma, narrador } from "../tema/tokens";
import { Etiqueta } from "./Etiqueta";
import { separarPalavras } from "./TextoAnimado";

/** Legenda da fala: balão Névoa ao lado do Neuro; a palavra dita fica Tinta, a atual Coral e as próximas apagadas. */
const LegendaDoNarrador: React.FC<{ texto: string; narraEm: number; duracaoFala: number }> = ({ texto, narraEm, duracaoFala }) => {
  const frame = useCurrentFrame();
  const { p, fonte } = useEstilo();
  const palavras = separarPalavras(texto).map((w) => ({ ...w, cheia: w.texto + (w.sufixo ?? "") }));
  const total = palavras.reduce((a, w) => a + w.cheia.length + 2, 0);
  let acumulado = 0;
  const marcadas = palavras.map((w) => {
    const inicio = narraEm + (acumulado / total) * duracaoFala;
    acumulado += w.cheia.length + 2;
    return { ...w, inicio };
  });
  const atual = marcadas.reduce((k, w, i) => (frame >= w.inicio ? i : k), -1);
  const f = fonte("textoForte", "rotulo");
  return (
    <div style={{ position: "relative", flex: 1, minWidth: 0 }}>
      <div
        style={{
          ...estiloEntrada(frame, { atraso: Math.max(0, narraEm - 6), tipo: "pop" }),
          transformOrigin: "0% 50%",
          position: "relative",
          background: p.texto,
          borderRadius: forma.raioCartao,
          padding: "14px 26px",
        }}
      >
        <svg width={30} height={44} viewBox="0 0 30 44" style={{ position: "absolute", left: -24, top: "50%", marginTop: -22, overflow: "visible" }}>
          <path d="M 32 0 Q 8 6 0 22 Q 8 38 32 44 Z" fill={p.texto} />
        </svg>
        <div style={{ ...f, lineHeight: 1.18 }}>
          {marcadas.map((w, i) => (
            <span key={i} style={{ color: i < atual ? p.fundo : i === atual ? p.coral : p.textoApoio, opacity: i <= atual ? 1 : 0.55 }}>
              {w.cheia}{" "}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export const FaixaNarrador: React.FC<{
  epoca?: string;
  /** O que o Neuro está falando (vira legenda ao lado dele). */
  texto?: string;
  narraEm?: number;
  duracaoFala?: number;
  /** Faz o Neuro "entrar" (pop) — só na primeira cena de uma sequência. */
  entrando?: boolean;
  parado?: boolean;
}> = ({ epoca, texto, narraEm, duracaoFala, entrando = false, parado = false }) => {
  const frame = useCurrentFrame();
  const { area, reservaTopo } = useEstilo();
  const topo = area.y - reservaTopo;
  const legendado = !!texto && narraEm !== undefined && duracaoFala !== undefined;
  return (
    <div style={{ position: parado ? "relative" : "absolute", left: parado ? undefined : area.x, top: parado ? undefined : topo, width: parado ? "100%" : area.largura, height: narrador.faixa, display: "flex", alignItems: "center", gap: 36 }}>
      <div style={{ position: "relative", flexShrink: 0, transformOrigin: "50% 100%", ...(entrando ? estiloEntrada(frame, { tipo: "pop" }) : {}) }}>
        <Personagem id="neuro" expressao={narraEm !== undefined ? "feliz" : "neutro"} olhando="direita" altura={narrador.altura} narraEm={narraEm} duracaoFala={duracaoFala} semBalao />
        {legendado && epoca && (
          <div style={{ position: "absolute", left: "50%", bottom: -6, transform: "translateX(-50%)", ...estiloEntrada(frame, { atraso: 4, tipo: "pop" }) }}>
            <Etiqueta texto={epoca} tamanho="nota" />
          </div>
        )}
      </div>
      {legendado ? (
        <LegendaDoNarrador texto={texto} narraEm={narraEm} duracaoFala={duracaoFala} />
      ) : (
        <div style={{ flex: 1, display: "flex", justifyContent: "flex-end", ...(epoca ? estiloEntrada(frame, { atraso: 4, tipo: "deslizar" }) : {}) }}>
          {epoca && <Etiqueta texto={epoca} tamanho="rotulo" />}
        </div>
      )}
    </div>
  );
};

export type SegmentoNarrador = {
  /** Frame (absoluto no vídeo) em que o trecho começa e quanto dura. */
  de: number;
  duracao: number;
  epoca?: string;
  texto?: string;
  narraEm?: number;
  duracaoFala?: number;
  entrando: boolean;
};

/** A faixa do Neuro desenhada uma só vez por cima das cenas: fica parada enquanto as cenas trocam. */
export const NarradorSobreposto: React.FC<{ segmentos: SegmentoNarrador[] }> = ({ segmentos }) => (
  <>
    {segmentos.map((s, i) => (
      <Sequence key={i} from={s.de} durationInFrames={s.duracao} layout="none">
        <FaixaNarrador epoca={s.epoca} texto={s.texto} narraEm={s.narraEm} duracaoFala={s.duracaoFala} entrando={s.entrando} />
      </Sequence>
    ))}
  </>
);
