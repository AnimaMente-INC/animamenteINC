/**
 * VERSUS — dois lados frente a frente, com o selo "VS" carimbado no meio.
 * Cada lado: nome na cor dele, traço e até 4 pontos (com nó de neurônio). Com `vencedor`, o lado
 * escolhido ganha uma moldura Amarelo e o outro apaga.
 */
import React from "react";
import { useCurrentFrame } from "remotion";
import { crescer, entrar, estiloCarimbo, estiloEntrada, stagger } from "../animacao";
import { useEstilo } from "../tema/Estilo";
import { cores, forma, NomeCor, tempos } from "../tema/tokens";
import { estiloPainel } from "./Cartao";

export type LadoVersus = { titulo: string; itens?: string[]; cor?: NomeCor };

export const Versus: React.FC<{ lados: LadoVersus[]; atraso?: number; vencedor?: number; revelarEm?: number; parado?: boolean }> = ({ lados, atraso = 0, vencedor, revelarEm = 0, parado = false }) => {
  const frame = useCurrentFrame();
  const { fonte, p, tema, formato } = useEstilo();
  const f = parado ? 9999 : frame;
  const selo = formato === "vertical" ? 132 : 104;
  const revelou = vencedor !== undefined && !parado && frame >= revelarEm;
  const r = revelou ? Math.min(1, entrar(frame, revelarEm)) : 0;
  return (
    <div style={{ position: "relative", display: "flex", gap: formato === "vertical" ? 28 : 48, alignItems: "stretch", width: "100%" }}>
      {lados.slice(0, 2).map((l, i) => {
        const cor = cores[l.cor ?? (i === 0 ? "coral" : "amarelo")];
        const ganhou = revelou && vencedor === i;
        return (
          <div
            key={i}
            style={{
              ...(parado ? {} : estiloEntrada(frame, { atraso: stagger(i * 2, atraso), tipo: "subir" })),
              ...estiloPainel(tema),
              flex: 1,
              boxSizing: "border-box",
              padding: formato === "vertical" ? "34px 28px 40px" : "26px 30px",
              display: "flex",
              flexDirection: "column",
              gap: 20,
              outline: ganhou ? `${forma.borda * r}px solid ${cores.amarelo}` : undefined,
              opacity: (parado ? 1 : Math.min(1, entrar(frame, stagger(i * 2, atraso)))) * (revelou && !ganhou ? 1 - 0.55 * r : 1),
            }}
          >
            <div style={{ ...fonte("titulo", "legenda"), color: cor, textAlign: "center", lineHeight: 1.05 }}>{l.titulo}</div>
            <div style={{ height: forma.traco, background: cor, borderRadius: forma.raioPilula, transform: `scaleX(${crescer(f, atraso + tempos.entrada)})` }} />
            {(l.itens ?? []).slice(0, 4).map((it, k) => {
              const quando = atraso + tempos.entrada * 2 + (k * 2 + i) * tempos.stagger * 2;
              return (
                <div key={k} style={{ ...(parado ? {} : estiloEntrada(frame, { atraso: quando, tipo: "subir" })), display: "flex", gap: 14, alignItems: "flex-start", color: p.texto }}>
                  <div style={{ width: forma.grade * 2, height: forma.grade * 2, borderRadius: forma.raioPilula, background: cor, flexShrink: 0, marginTop: "0.4em" }} />
                  <div style={{ ...fonte("texto", "nota"), lineHeight: 1.2 }}>{it}</div>
                </div>
              );
            })}
          </div>
        );
      })}
      <div style={{ position: "absolute", left: "50%", top: formato === "vertical" ? 0 : "50%", marginLeft: -selo / 2, marginTop: -selo / 2 }}>
        <div style={{ ...(parado ? {} : estiloCarimbo(frame, { atraso: atraso + tempos.entrada, giro: -8 })), ...fonte("titulo", "rotulo"), width: selo, height: selo, boxSizing: "border-box", borderRadius: forma.raioPilula, background: tema === "escuro" ? cores.nevoa : cores.tinta, color: tema === "escuro" ? cores.tinta : cores.nevoa, border: `${forma.borda}px solid ${cores.coral}`, display: "flex", alignItems: "center", justifyContent: "center" }}>VS</div>
      </div>
    </div>
  );
};
