/**
 * TELA RETRÔ — TV de tubo em adesivo, com antenas-neurônio, linhas de varredura e um joguinho
 * de "pixels" rodando dentro (tudo original e genérico, só com as cores dos tokens).
 *
 * modo="jogo"  → joguinho de plataforma: bloco Coral pulando, moedas Amarelo, chão correndo.
 * modo="texto" → texto digitado na tela (ex.: "FIM DE JOGO").
 */
import React, { useId } from "react";
import { useCurrentFrame } from "remotion";
import { correr, cursorAceso, digitar, estiloEntrada, pulsar } from "../animacao";
import { useEstilo } from "../tema/Estilo";
import { comAlfa, cores, forma, fps, retro } from "../tema/tokens";
import { FiltroAdesivo } from "./Objeto";

const TELA = { x: 46, y: 84, w: 420, h: 330 };

const Joguinho: React.FC<{ frame: number; fonte: React.CSSProperties }> = ({ frame, fonte }) => {
  const px = retro.pixel;
  const chao = TELA.y + TELA.h - px * 2;
  const desloc = correr(frame, 4) % (px * 2);
  // pulo: um arco a cada segundo
  const ciclo = (frame % fps) / fps;
  const pulo = Math.sin(ciclo * Math.PI) * px * 3.2;
  const pontos = Math.floor(frame / 9) * 10;
  const blocos = Math.ceil(TELA.w / px) + 3;
  return (
    <g>
      <rect x={TELA.x} y={TELA.y} width={TELA.w} height={TELA.h} fill={cores.tinta} />
      {/* nuvens em blocos */}
      {[0, 1].map((i) => {
        const x = TELA.x + TELA.w - ((correr(frame, 1.2) + i * 260) % (TELA.w + 160)) ;
        return (
          <g key={i} fill={cores.lavanda} opacity={0.55}>
            <rect x={x} y={TELA.y + 50 + i * 46} width={px * 3} height={px} />
            <rect x={x + px} y={TELA.y + 50 + i * 46 - px} width={px} height={px} />
          </g>
        );
      })}
      {/* moedas vindo da direita */}
      {[0, 1, 2].map((i) => {
        const x = TELA.x + TELA.w - ((correr(frame, 4) + i * 170) % (TELA.w + 60));
        const pega = x < TELA.x + 150 && x > TELA.x + 96 && pulo > px;
        return pega ? null : <rect key={i} x={x} y={chao - px * 3.4} width={px * 0.7} height={px * 0.7} fill={cores.amarelo} opacity={0.7 + 0.3 * pulsar(frame + i * 6, 12)} />;
      })}
      {/* herói: um bloco com olho */}
      <g transform={`translate(${TELA.x + 110} ${chao - px - pulo})`}>
        <rect width={px} height={px} fill={cores.coral} />
        <rect x={px * 0.58} y={px * 0.22} width={px * 0.22} height={px * 0.22} fill={cores.nevoa} />
      </g>
      {/* chão */}
      {Array.from({ length: blocos }).map((_, i) => (
        <rect key={i} x={TELA.x - desloc + i * px} y={chao} width={px - 3} height={px - 3} fill={i % 2 ? cores.ardosia : cores.lilas} />
      ))}
      <rect x={TELA.x} y={chao + px} width={TELA.w} height={px} fill={cores.ardosia} />
      <text x={TELA.x + 22} y={TELA.y + 46} style={{ ...fonte, fontSize: 34 }} fill={cores.amarelo}>
        {String(pontos).padStart(5, "0")}
      </text>
    </g>
  );
};

export const TelaRetro: React.FC<{ modo?: "jogo" | "texto"; texto?: string; largura?: number; atraso?: number; parado?: boolean }> = ({ modo = "jogo", texto = "", largura, atraso = 0, parado = false }) => {
  const quadro = useCurrentFrame();
  const { formato, fonte } = useEstilo();
  const uid = useId().replace(/:/g, "");
  const frame = parado ? 40 : Math.max(0, quadro - atraso);
  const w = largura ?? (formato === "vertical" ? 620 : 460);
  const h = (w * 500) / 640;
  const f = fonte("formula", "rotulo");
  const letras = digitar(frame, texto.length, 10);
  const varreduras = Math.floor(TELA.h / retro.varredura);
  return (
    <div style={{ ...(parado ? {} : estiloEntrada(quadro, { atraso })), width: w, height: h, flexShrink: 0 }}>
      <svg width={w} height={h} viewBox="0 0 640 500" style={{ overflow: "visible" }}>
        <defs>
          <FiltroAdesivo id={`tv${uid}`} />
          <clipPath id={`tela${uid}`}>
            <rect x={TELA.x} y={TELA.y} width={TELA.w} height={TELA.h} rx={26} />
          </clipPath>
        </defs>
        <g filter={`url(#tv${uid})`}>
          {/* antenas-neurônio */}
          <line x1={300} y1={50} x2={214} y2={10} stroke={cores.lilas} strokeWidth={forma.traco + 2} strokeLinecap="round" />
          <line x1={340} y1={50} x2={430} y2={6} stroke={cores.lilas} strokeWidth={forma.traco + 2} strokeLinecap="round" />
          <circle cx={214} cy={10} r={10} fill={cores.amarelo} />
          <circle cx={430} cy={6} r={10} fill={cores.amarelo} />
          {/* corpo */}
          <rect x={14} y={48} width={612} height={404} rx={40} fill={cores.ardosia} />
          <rect x={90} y={448} width={70} height={30} rx={10} fill={cores.lilas} />
          <rect x={480} y={448} width={70} height={30} rx={10} fill={cores.lilas} />
          {/* painel */}
          <circle cx={548} cy={130} r={30} fill={cores.coral} />
          <circle cx={548} cy={214} r={30} fill={cores.amarelo} />
          {[290, 318, 346, 374].map((y) => (
            <line key={y} x1={508} y1={y} x2={588} y2={y} stroke={cores.lilas} strokeWidth={8} strokeLinecap="round" />
          ))}
          <rect x={TELA.x - 10} y={TELA.y - 10} width={TELA.w + 20} height={TELA.h + 20} rx={34} fill={cores.tinta} />
        </g>
        <g clipPath={`url(#tela${uid})`}>
          {modo === "jogo" ? (
            <Joguinho frame={frame} fonte={f} />
          ) : (
            <>
              <rect x={TELA.x} y={TELA.y} width={TELA.w} height={TELA.h} fill={cores.tinta} />
              <text x={TELA.x + TELA.w / 2} y={TELA.y + TELA.h / 2 + 18} textAnchor="middle" style={{ ...f, fontSize: 56 }} fill={cores.amarelo}>
                {texto.slice(0, letras)}
                {cursorAceso(frame) ? "_" : ""}
              </text>
            </>
          )}
          {Array.from({ length: varreduras }).map((_, i) => (
            <rect key={i} x={TELA.x} y={TELA.y + i * retro.varredura} width={TELA.w} height={retro.varredura / 2} fill={comAlfa("nevoa", retro.opacidadeVarredura)} />
          ))}
        </g>
      </svg>
    </div>
  );
};
