/**
 * QUIZ — alternativas com letra (A, B, C, D), barra de tempo Amarelo que esvazia e a revelação:
 * a certa vira Amarelo (com o ícone "certo") e as outras apagam.
 */
import React from "react";
import { useCurrentFrame } from "remotion";
import { entrar, estiloEntrada, linear, pulsar, stagger } from "../animacao";
import { useEstilo } from "../tema/Estilo";
import { comAlfa, cores, forma, tempos } from "../tema/tokens";
import { estiloPainel } from "./Cartao";
import { Icone } from "./Icone";

const LETRAS = ["A", "B", "C", "D"];

export const Quiz: React.FC<{ opcoes: string[]; correta: number; atraso?: number; revelarEm: number; parado?: boolean }> = ({ opcoes, correta, atraso = 0, revelarEm, parado = false }) => {
  const frame = useCurrentFrame();
  const { fonte, p, tema, formato } = useEstilo();
  const inicioTempo = atraso + stagger(opcoes.length) + tempos.entrada;
  const resta = parado ? 0.6 : 1 - linear(frame, inicioTempo, revelarEm);
  const revelou = !parado && frame >= revelarEm;
  const r = revelou ? Math.min(1, entrar(frame, revelarEm)) : 0;
  const selo = formato === "vertical" ? 76 : 60;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: formato === "vertical" ? 24 : 16, width: "94%" }}>
      <div style={{ height: forma.grade * 2, background: comAlfa("lavanda", 0.2), borderRadius: forma.raioPilula, overflow: "hidden", opacity: revelou ? 1 - r : Math.min(1, entrar(frame, atraso)) }}>
        <div style={{ width: `${resta * 100}%`, height: "100%", background: resta < 0.25 ? cores.coral : cores.amarelo, borderRadius: forma.raioPilula }} />
      </div>
      {opcoes.map((o, i) => {
        const certa = i === correta;
        const acesa = revelou && certa;
        return (
          <div
            key={i}
            style={{
              ...(parado ? {} : estiloEntrada(frame, { atraso: stagger(i * 2, atraso), tipo: "deslizar" })),
              ...estiloPainel(tema),
              ...(acesa ? { background: cores.amarelo } : {}),
              display: "flex",
              alignItems: "center",
              gap: 26,
              padding: formato === "vertical" ? "22px 30px" : "14px 24px",
              color: acesa ? cores.tinta : p.texto,
              opacity: (parado ? 1 : Math.min(1, entrar(frame, stagger(i * 2, atraso)))) * (revelou && !certa ? 1 - 0.62 * r : 1),
              transform: acesa ? `scale(${1 + 0.03 * pulsar(frame - revelarEm, tempos.entrada * 2)})` : undefined,
            }}
          >
            {acesa ? (
              <Icone nome="certo" cor="coral" tamanho={selo} />
            ) : (
              <div style={{ ...fonte("titulo", "rotulo"), width: selo, height: selo, flexShrink: 0, borderRadius: forma.raioPilula, background: cores.lavanda, color: cores.tinta, display: "flex", alignItems: "center", justifyContent: "center" }}>{LETRAS[i]}</div>
            )}
            <div style={fonte("textoForte", "rotulo")}>{o}</div>
          </div>
        );
      })}
    </div>
  );
};
