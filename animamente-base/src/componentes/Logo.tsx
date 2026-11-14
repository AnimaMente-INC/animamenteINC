/**
 * LOGO ANIMAMENTE — símbolo oficial (cérebro Coral com borda Névoa e A+M em neurônios)
 * e a marca nominal "anima" + "mente" com o slogan.
 *
 * Animação do símbolo: o cérebro faz "pop", as letras A e M são desenhadas,
 * depois os ramos de neurônio crescem e os nós acendem.
 */
import React from "react";
import { useCurrentFrame } from "remotion";
import { desenharTraco, entrar, estiloEntrada } from "../animacao";
import { SimboloAM } from "../personagens/partes/Cerebro";
import { useEstilo } from "../tema/Estilo";
import { cores, NomeTamanho, tempos } from "../tema/tokens";
import { TextoAnimado } from "./TextoAnimado";

export const Logo: React.FC<{ tamanho?: number; atraso?: number; animado?: boolean }> = ({ tamanho = 360, atraso = 0, animado = true }) => {
  const frame = useCurrentFrame();
  const f = animado ? frame : 999;
  const e = entrar(f, atraso);
  const a = desenharTraco(f, 1, atraso + tempos.entrada * 0.5, 14);
  const m = desenharTraco(f, 1, atraso + tempos.entrada, 14);
  const ramos = desenharTraco(f, 1, atraso + tempos.entrada * 1.6, 14);
  const nos = Math.min(1, Math.max(0, entrar(f, atraso + tempos.entrada * 2.4)));
  return (
    <svg width={tamanho} height={tamanho * (160 / 170)} viewBox="15 12 170 160" style={{ overflow: "visible" }}>
      <g transform={`translate(100 95) scale(${0.6 + 0.4 * e}) translate(-100 -95)`} opacity={Math.min(1, e)}>
        <SimboloAM estiloLetraA={a} estiloLetraM={m} estiloRamos={ramos} opacidadeNos={nos} />
      </g>
    </svg>
  );
};

/** Marca nominal: "anima" (cor do texto) + "mente" (Coral), slogan em Lavanda. */
export const Marca: React.FC<{ tamanho?: NomeTamanho; slogan?: boolean; atraso?: number }> = ({ tamanho = "titulo", slogan = true, atraso = 0 }) => {
  const frame = useCurrentFrame();
  const { fonte, p } = useEstilo();
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
      <div style={{ ...fonte("titulo", tamanho), ...estiloEntrada(frame, { atraso, tipo: "pop" }), color: p.texto, letterSpacing: "-0.01em" }}>
        anima<span style={{ color: cores.coral }}>mente</span>
      </div>
      {slogan && <TextoAnimado texto="o mundo explicado em animação" fonte="texto" tamanho="nota" cor={cores.lavanda} atraso={atraso + 8} porPalavra={2} />}
    </div>
  );
};
