/**
 * QUIZ — alternativas com letra (A, B, C, D), barra de tempo Amarelo que esvazia e a revelação:
 * a certa vira Amarelo (com o ícone "certo") e as outras apagam.
 * Com `inicioContagem` (quiz com "tempoResposta"): a barra fica cheia enquanto a pergunta é lida, depois
 * esvazia até a resposta, com o círculo da CONTAGEM REGRESSIVA ao lado (Amarelo; Coral nos últimos segundos).
 */
import React from "react";
import { useCurrentFrame } from "remotion";
import { entrar, estiloEntrada, linear, pulsar, stagger } from "../animacao";
import { useEstilo } from "../tema/Estilo";
import { comAlfa, cores, forma, fps, musica, tempos } from "../tema/tokens";
import { estiloPainel } from "./Cartao";
import { Icone } from "./Icone";

const LETRAS = ["A", "B", "C", "D"];

/** Círculo com os segundos que faltam; dá um pulinho a cada segundo. */
const Contagem: React.FC<{ frame: number; inicio: number; fim: number; opacidade: number }> = ({ frame, inicio, fim, opacidade }) => {
  const { fonte, formato } = useEstilo();
  const resta = Math.max(0, fim - Math.max(frame, inicio));
  const segundos = Math.ceil(resta / fps);
  const alerta = segundos <= musica.contagemAlerta;
  const noSegundo = frame >= inicio ? (fps - (resta % fps)) % fps : fps;
  const pop = noSegundo < tempos.popContagem ? 1 + 0.18 * (1 - noSegundo / tempos.popContagem) : 1;
  const d = musica.contagem * (formato === "vertical" ? 1 : 0.75);
  return (
    <div
      style={{
        ...fonte("titulo", "subtitulo"),
        width: d,
        height: d,
        flexShrink: 0,
        borderRadius: forma.raioPilula,
        border: `${forma.borda * 0.6}px solid ${cores.nevoa}`,
        background: alerta ? cores.coral : cores.amarelo,
        color: alerta ? cores.nevoa : cores.tinta,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transform: `scale(${pop})`,
        opacity: opacidade,
      }}
    >
      {segundos}
    </div>
  );
};

export const Quiz: React.FC<{ opcoes: string[]; correta: number; atraso?: number; revelarEm: number; parado?: boolean; inicioContagem?: number }> = ({
  opcoes,
  correta,
  atraso = 0,
  revelarEm,
  parado = false,
  inicioContagem,
}) => {
  const frame = useCurrentFrame();
  const { fonte, p, tema, formato } = useEstilo();
  const inicioTempo = inicioContagem ?? atraso + stagger(opcoes.length) + tempos.entrada;
  const resta = parado ? 0.6 : 1 - linear(frame, inicioTempo, revelarEm);
  const revelou = !parado && frame >= revelarEm;
  const r = revelou ? Math.min(1, entrar(frame, revelarEm)) : 0;
  const selo = formato === "vertical" ? 76 : 60;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: formato === "vertical" ? 24 : 16, width: "94%" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 24, opacity: revelou ? 1 - r : Math.min(1, entrar(frame, atraso)) }}>
        <div style={{ flex: 1, height: forma.grade * 2, background: comAlfa("lavanda", 0.2), borderRadius: forma.raioPilula, overflow: "hidden" }}>
          <div style={{ width: `${resta * 100}%`, height: "100%", background: resta < 0.25 ? cores.coral : cores.amarelo, borderRadius: forma.raioPilula }} />
        </div>
        {inicioContagem !== undefined && !parado && <Contagem frame={frame} inicio={inicioContagem} fim={revelarEm} opacidade={1} />}
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
