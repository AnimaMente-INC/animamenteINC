/**
 * JANELA DE TERMINAL + TEXTO DIGITADO — texto que aparece letra por letra, com cursor piscando.
 * A janela é um painel da base (Lavanda 14%, cantos 28) com três bolinhas (Coral, Amarelo, Lavanda).
 * Linhas começando com ">" ganham o sinal em Amarelo. Opcional: barra de progresso (download).
 * Continua sendo Fredoka: a identidade não usa fonte monoespaçada.
 */
import React from "react";
import { useCurrentFrame } from "remotion";
import { contar, crescer, cursorAceso, digitar, estiloEntrada } from "../animacao";
import { useEstilo } from "../tema/Estilo";
import { cores, fontes, forma, NomeFonte, NomeTamanho, tempos } from "../tema/tokens";
import { estiloPainel } from "./Cartao";

/** Frames que um texto leva para ser digitado. */
export const duracaoDigitado = (texto: string) => Math.ceil(texto.length * tempos.porLetra);

export const TextoDigitado: React.FC<{ texto: string; atraso?: number; fonte?: NomeFonte; tamanho?: NomeTamanho; cor?: string; cursor?: boolean }> = ({ texto, atraso = 0, fonte: nomeFonte = "texto", tamanho = "rotulo", cor, cursor = true }) => {
  const frame = useCurrentFrame();
  const { fonte, p } = useEstilo();
  const n = digitar(frame, texto.length, atraso);
  const visivel = texto.slice(0, n);
  const prompt = visivel.startsWith(">");
  const digitando = frame >= atraso && n < texto.length;
  return (
    <div style={{ ...fonte(nomeFonte, tamanho), color: cor ?? p.texto, whiteSpace: "pre-wrap", minHeight: "1.15em" }}>
      {prompt && <span style={{ color: cores.amarelo, fontWeight: fontes.textoForte.peso }}>&gt;</span>}
      {prompt ? visivel.slice(1) : visivel}
      {cursor && (digitando || (n >= texto.length && cursorAceso(frame))) && frame >= atraso && (
        <span style={{ display: "inline-block", width: "0.5em", height: "0.9em", marginLeft: "0.12em", verticalAlign: "-0.08em", background: cores.amarelo, borderRadius: 4 }} />
      )}
    </div>
  );
};

export const JanelaTerminal: React.FC<{ linhas: string[]; titulo?: string; progresso?: string; progressoAte?: number; atraso?: number; duracao?: number }> = ({ linhas, titulo = "terminal", progresso, progressoAte = 100, atraso = 0, duracao = 90 }) => {
  const frame = useCurrentFrame();
  const { fonte, p, tema, formato } = useEstilo();
  // cada linha começa quando a anterior termina de ser digitada
  const inicios: number[] = [];
  linhas.reduce((t, l, i) => {
    inicios[i] = t;
    return t + duracaoDigitado(l) + tempos.entrada;
  }, atraso + tempos.entrada);
  const pad = formato === "vertical" ? 36 : 28;
  const durBarra = Math.max(tempos.entrada * 3, duracao - atraso - tempos.entrada * 3);
  const prog = crescer(frame, atraso + tempos.entrada, durBarra);
  const pct = contar(frame, 0, progressoAte, atraso + tempos.entrada, durBarra);
  return (
    <div style={{ ...estiloEntrada(frame, { atraso }), ...estiloPainel(tema), width: "100%", boxSizing: "border-box", overflow: "hidden", border: `${forma.tracoFino + 1}px solid ${cores.nevoa}` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, padding: `${pad * 0.5}px ${pad}px`, background: cores.ardosia }}>
        {[cores.coral, cores.amarelo, cores.lavanda].map((c) => (
          <div key={c} style={{ width: 24, height: 24, borderRadius: forma.raioPilula, background: c }} />
        ))}
        <div style={{ ...fonte("texto", "nota"), color: cores.nevoa, marginLeft: 12 }}>{titulo}</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 16, padding: pad, color: p.texto }}>
        {linhas.map((l, i) => (
          <TextoDigitado key={i} texto={l} tamanho={formato === "vertical" ? "legenda" : "rotulo"} atraso={inicios[i]} cursor={i === linhas.length - 1 || frame < inicios[i + 1]} />
        ))}
        {progresso && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 8, opacity: frame >= atraso + tempos.entrada ? 1 : 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", ...fonte("texto", "nota"), color: p.textoApoio }}>
              <span>{progresso}</span>
              <span style={{ color: cores.amarelo, fontWeight: fontes.textoForte.peso }}>{Math.round(pct)}%</span>
            </div>
            <div style={{ height: 28, background: cores.ardosia, borderRadius: forma.raioPilula, overflow: "hidden" }}>
              <div style={{ width: `${prog * progressoAte}%`, height: "100%", background: cores.coral, borderRadius: forma.raioPilula }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
