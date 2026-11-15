/**
 * CARIMBO DE ÉPOCA + LINHA DO TEMPO — abrem cada capítulo do "modo história".
 *
 * <CarimboAno texto="Anos 80" />  → adesivo Coral com borda Névoa que cai, bate e treme,
 *                                    soltando um estouro de neurônios Amarelo.
 * <LinhaDoTempo etapas={[...]} atual={2} /> → nós de neurônio ligados; os que já passaram ficam
 *                                    Coral, o atual pulsa em Amarelo e os próximos ficam Ardósia.
 */
import React from "react";
import { useCurrentFrame } from "remotion";
import { carimbar, crescer, entrar, estiloCarimbo, pulsar, stagger } from "../animacao";
import { useEstilo } from "../tema/Estilo";
import { amplitudes, cores, forma, tempos } from "../tema/tokens";

/** Estouro: traços-neurônio que saem do centro quando o carimbo bate. */
const Estouro: React.FC<{ atraso: number; raio: number }> = ({ atraso, raio }) => {
  const frame = useCurrentFrame();
  const n = 10;
  const prog = crescer(frame, atraso, tempos.entrada);
  const some = 1 - crescer(frame, atraso + tempos.entrada * 2, tempos.entrada);
  if (prog <= 0) return null;
  return (
    <svg width={raio * 2} height={raio * 2} viewBox={`${-raio} ${-raio} ${raio * 2} ${raio * 2}`} style={{ position: "absolute", left: "50%", top: "50%", marginLeft: -raio, marginTop: -raio, overflow: "visible", opacity: some }}>
      {Array.from({ length: n }).map((_, i) => {
        const a = (i / n) * Math.PI * 2 + 0.3;
        const r0 = raio * 0.62;
        const r1 = r0 + (raio - r0) * prog * (i % 2 ? 1 : 0.72);
        return (
          <g key={i}>
            <line x1={Math.cos(a) * r0} y1={Math.sin(a) * r0 * 0.6} x2={Math.cos(a) * r1} y2={Math.sin(a) * r1 * 0.6} stroke={cores.amarelo} strokeWidth={forma.traco} strokeLinecap="round" />
            <circle cx={Math.cos(a) * r1} cy={Math.sin(a) * r1 * 0.6} r={forma.traco * 1.5} fill={cores.amarelo} />
          </g>
        );
      })}
    </svg>
  );
};

export const CarimboAno: React.FC<{ texto: string; atraso?: number }> = ({ texto, atraso = 0 }) => {
  const frame = useCurrentFrame();
  const { fonte, formato } = useEstilo();
  const f = fonte("titulo", "titulo");
  const fs = (f.fontSize as number) * (texto.length > 7 ? 1.25 : 1.7);
  return (
    <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", padding: formato === "vertical" ? "130px 0" : "60px 0" }}>
      <Estouro atraso={atraso + tempos.carimbo} raio={fs * 2.7} />
      <div
        style={{
          ...estiloCarimbo(frame, { atraso, giro: -amplitudes.carimboGiro }),
          ...f,
          fontSize: fs,
          lineHeight: 1,
          color: cores.nevoa,
          background: cores.coral,
          border: `${forma.borda}px solid ${cores.nevoa}`,
          borderRadius: forma.raioCartao,
          padding: `${fs * 0.2}px ${fs * 0.42}px`,
          whiteSpace: "nowrap",
        }}
      >
        {texto}
      </div>
    </div>
  );
};

export const LinhaDoTempo: React.FC<{ etapas: string[]; atual: number; atraso?: number }> = ({ etapas, atual, atraso = 0 }) => {
  const frame = useCurrentFrame();
  const { fonte, p, formato } = useEstilo();
  const no = formato === "vertical" ? 40 : 30;
  return (
    <div style={{ display: "flex", alignItems: "flex-start", width: "100%" }}>
      {etapas.map((e, i) => {
        const passou = i < atual;
        const agora = i === atual;
        const cor = passou ? cores.coral : agora ? cores.amarelo : cores.ardosia;
        const acende = agora ? entrar(frame, atraso + tempos.carimbo) : 1;
        const pulso = agora && carimbar(frame, atraso).bateu ? 1 + 0.18 * pulsar(frame - atraso, tempos.entrada * 2) : 1;
        // o trecho que chega no nó atual se desenha na hora
        const trecho = i === 0 ? 0 : passou ? 1 : agora ? crescer(frame, atraso, tempos.carimbo) : 0;
        return (
          <React.Fragment key={i}>
            {i > 0 && (
              <div style={{ flex: 1, height: forma.traco, marginTop: no / 2 - forma.traco / 2, background: cores.ardosia, borderRadius: forma.raioPilula }}>
                <div style={{ width: `${trecho * 100}%`, height: "100%", background: cores.coral, borderRadius: forma.raioPilula }} />
              </div>
            )}
            <div style={{ ...estiloEtapa(frame, stagger(i, atraso)), display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: no }}>
              <div style={{ width: no, height: no, borderRadius: forma.raioPilula, background: agora && acende < 0.5 ? cores.ardosia : cor, border: `${forma.tracoFino + 1}px solid ${cores.nevoa}`, boxSizing: "border-box", transform: `scale(${pulso})` }} />
              <div style={{ ...fonte(agora ? "textoForte" : "texto", "nota"), color: agora ? cores.amarelo : passou ? p.texto : p.textoApoio, whiteSpace: "nowrap" }}>{e}</div>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
};

const estiloEtapa = (frame: number, atraso: number): React.CSSProperties => ({ opacity: Math.min(1, entrar(frame, atraso)) });
