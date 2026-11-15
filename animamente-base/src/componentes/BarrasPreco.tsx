/**
 * BARRAS DE PREÇO — compara valores com barras que crescem e números que contam.
 * Cada item: rótulo em cima, barra na cor de destaque e o valor na ponta.
 * `texto` troca o número por um texto fixo (ex.: "3 por R$ 10"); a barra continua proporcional a `valor`.
 */
import React from "react";
import { useCurrentFrame } from "remotion";
import { contar, crescer, estiloEntrada } from "../animacao";
import { useEstilo } from "../tema/Estilo";
import { cores, forma, NomeCor, tempos } from "../tema/tokens";

export type ItemPreco = { rotulo: string; valor: number; texto?: string; prefixo?: string; casas?: number; cor?: NomeCor };

export const BarrasPreco: React.FC<{ itens: ItemPreco[]; atraso?: number }> = ({ itens, atraso = 0 }) => {
  const frame = useCurrentFrame();
  const { fonte, p, formato } = useEstilo();
  const max = Math.max(...itens.map((i) => i.valor), 1);
  const alturaBarra = formato === "vertical" ? 72 : 56;
  const passo = tempos.entrada + tempos.stagger * 2;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 36, width: "100%" }}>
      {itens.map((it, i) => {
        const a = atraso + i * passo;
        const cor = cores[it.cor ?? (i === 0 ? "coral" : "amarelo")];
        const prog = crescer(frame, a, tempos.entrada * 2.5);
        const fracao = Math.max(0.05, it.valor / max);
        const v = contar(frame, 0, it.valor, a, tempos.entrada * 2.5);
        const valor = it.texto ?? `${it.prefixo ?? "R$ "}${v.toLocaleString("pt-BR", { minimumFractionDigits: it.casas ?? 0, maximumFractionDigits: it.casas ?? 0 })}`;
        return (
          <div key={i} style={{ ...estiloEntrada(frame, { atraso: a, tipo: "aparecer" }), display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ ...fonte("texto", "rotulo"), color: p.textoApoio }}>{it.rotulo}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
              <div style={{ width: `${fracao * prog * 62}%`, minWidth: alturaBarra, height: alturaBarra, background: cor, borderRadius: forma.raioPilula, border: `${forma.tracoFino + 1}px solid ${cores.nevoa}`, boxSizing: "border-box", flexShrink: 0 }} />
              <div style={{ ...fonte("formula", "subtitulo"), color: cor, whiteSpace: "nowrap" }}>{valor}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
