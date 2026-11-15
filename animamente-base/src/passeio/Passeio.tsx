/**
 * PASSEIO — vídeo em TOMADA ÚNICA, sem cortes nem pausas.
 * O Neuro anda sem parar por um caminho de neurônios (a Lia vai de skate ao lado), os dois conversam
 * do começo ao fim e as informações passam voando no céu em formas variadas (faixa, medalhões, anel de
 * nota, setas, selo, estrela, balança). Usa só tokens e helpers da base.
 *
 * Roteiro: roteiros/passeio/<id>.json  ·  Vozes e tempos: python3 scripts/gerar-vozes-passeio.py
 */
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { contar, desenharTraco, entrar, sair, suave } from "../animacao";
import { Constelacao } from "../componentes/Constelacao";
import { Marca } from "../componentes/Logo";
import { separarPalavras } from "../componentes/TextoAnimado";
import { Busto } from "../personagens/colagem/Busto";
import { Expressao, IdPersonagem, Pose } from "../personagens/tipos";
import { carregarFontes } from "../tema/carregarFontes";
import { ProvedorEstilo, useEstilo } from "../tema/Estilo";
import { colagem, comAlfa, cores, forma, fps, NomeCor } from "../tema/tokens";
import { MusicaDeFundo } from "../Video";

carregarFontes();

export type FalaPasseio = { quem: IdPersonagem; texto: string; voz?: string; expressao?: Expressao; pose?: Pose; arquivo?: string; inicio?: number; duracao?: number };
export type PlacaPasseio = {
  tipo: "abertura" | "nota" | "espera" | "setas" | "selo" | "estrela" | "duvida" | "balanca" | "final";
  de: number;
  ate: number;
  titulo?: string;
  sub?: string;
  valor?: number;
  cor?: NomeCor;
  esquerda?: string;
  direita?: string;
  extra?: string;
  extraEm?: number;
  extraValor?: number;
  itens?: string[];
};
export type RoteiroPasseio = { id: string; titulo: string; musica?: string; duracao?: number; falas: FalaPasseio[]; placas: PlacaPasseio[] };

const seg = (s: number) => Math.round(s * fps);
export const duracaoPasseio = (r: RoteiroPasseio) => seg(r.duracao ?? 30);

// ─── medidas do passeio (vertical 1080×1920) ──────────────────────────────
const W = 1080;
const CHAO = 1500; // linha do caminho (acima da faixa segura de baixo)
const VELOCIDADE = 9; // px por frame que o mundo anda para trás
const CEU = 430; // centro vertical das placas

/** Tempo de cada fala em frames. */
const tempoFala = (f: FalaPasseio) => ({ ini: seg(f.inicio ?? 0), fim: seg((f.inicio ?? 0) + (f.duracao ?? 2)) });

// ─── CENÁRIO: caminho de neurônios + árvores-neurônio em paralaxe ─────────
const Arvore: React.FC<{ x: number; h: number; cor: string; fase: number }> = ({ x, h, cor, fase }) => {
  const frame = useCurrentFrame();
  const b = Math.sin(frame / 22 + fase) * 6;
  return (
    <g stroke={cor} fill={cor} strokeWidth={forma.traco} strokeLinecap="round">
      <path d={`M ${x} ${CHAO} L ${x + b * 0.3} ${CHAO - h * 0.55} M ${x + b * 0.3} ${CHAO - h * 0.55} L ${x - h * 0.28 + b} ${CHAO - h} M ${x + b * 0.3} ${CHAO - h * 0.55} L ${x + h * 0.3 + b} ${CHAO - h * 0.85}`} fill="none" />
      <circle cx={x - h * 0.28 + b} cy={CHAO - h} r={h * 0.07} stroke="none" />
      <circle cx={x + h * 0.3 + b} cy={CHAO - h * 0.85} r={h * 0.055} stroke="none" />
    </g>
  );
};

const Cenario: React.FC = () => {
  const frame = useCurrentFrame();
  const camera = frame * VELOCIDADE;
  const faixa = (espaco: number, paralaxe: number, n: number) =>
    Array.from({ length: n }, (_, i) => {
      const total = espaco * n;
      return ((((i * espaco - camera * paralaxe) % total) + total) % total) - espaco;
    });
  return (
    <svg width={W} height={1920} style={{ position: "absolute", inset: 0 }}>
      {faixa(420, 0.3, 4).map((x, i) => (
        <Arvore key={`l${i}`} x={x} h={300 + (i % 3) * 70} cor={comAlfa("lavanda", 0.16)} fase={i} />
      ))}
      {faixa(560, 0.6, 3).map((x, i) => (
        <Arvore key={`p${i}`} x={x} h={190 + (i % 2) * 60} cor={comAlfa("coral", 0.4)} fase={i * 2.1} />
      ))}
      <line x1={0} y1={CHAO} x2={W} y2={CHAO} stroke={cores.nevoa} strokeWidth={forma.traco} strokeLinecap="round" />
      {faixa(180, 1, 8).map((x, i) => (
        <g key={`c${i}`}>
          <circle cx={x} cy={CHAO} r={i % 4 === 0 ? 14 : 8} fill={i % 4 === 0 ? cores.amarelo : cores.nevoa} />
          <line x1={x + 40} y1={CHAO + 44} x2={x + 110} y2={CHAO + 44} stroke={cores.ardosia} strokeWidth={forma.traco} strokeLinecap="round" />
        </g>
      ))}
    </svg>
  );
};

// ─── PERSONAGENS ANDANDO ──────────────────────────────────────────────────
/** Pernas-neurônio do Neuro: dois traços Névoa com pés-nó, em passos de recorte. */
const COMP_PERNA = 128; // do quadril (escondido atrás do corpo) até o pé
const QUADRIL = 0.47; // altura do quadril dentro do busto do Neuro (fração da altura)
const Pernas: React.FC<{ largura: number; altura: number; ritmo: number }> = ({ largura, altura, ritmo }) => {
  const frame = useCurrentFrame();
  const passo = Math.floor(frame / colagem.passo);
  const fase = (passo / ritmo) * Math.PI;
  const perna = (lado: number) => {
    const s = Math.sin(fase + lado * Math.PI);
    const quadril = { x: largura / 2 + (lado ? 46 : -46), y: 0 };
    const pe = { x: quadril.x + s * 40, y: COMP_PERNA - Math.max(0, Math.cos(fase + lado * Math.PI)) * 26 };
    const joelho = { x: (quadril.x + pe.x) / 2 + 14, y: COMP_PERNA * 0.55 };
    return (
      <g key={lado}>
        <path d={`M ${quadril.x} ${quadril.y} Q ${joelho.x} ${joelho.y} ${pe.x} ${pe.y}`} stroke={cores.nevoa} strokeWidth={forma.membro} strokeLinecap="round" fill="none" />
        <ellipse cx={pe.x + 10} cy={pe.y} rx={22} ry={13} fill={cores.coral} stroke={cores.nevoa} strokeWidth={forma.traco} />
      </g>
    );
  };
  return (
    <svg width={largura} height={COMP_PERNA + 20} style={{ position: "absolute", left: 0, top: altura * QUADRIL, overflow: "visible" }}>
      {perna(0)}
      {perna(1)}
    </svg>
  );
};

/** Skate da Lia: prancha Amarelo com borda Névoa e rodinhas girando. */
const Skate: React.FC<{ largura: number }> = ({ largura }) => {
  const frame = useCurrentFrame();
  const giro = frame * 14;
  const roda = (cx: number) => (
    <g transform={`rotate(${giro} ${cx} 62)`}>
      <circle cx={cx} cy={62} r={22} fill={cores.coral} stroke={cores.nevoa} strokeWidth={forma.traco} />
      <line x1={cx - 14} y1={62} x2={cx + 14} y2={62} stroke={cores.nevoa} strokeWidth={forma.tracoFino} strokeLinecap="round" />
    </g>
  );
  return (
    <svg width={largura} height={90} style={{ position: "absolute", left: 0, bottom: -78, overflow: "visible" }}>
      <rect x={10} y={8} width={largura - 20} height={30} rx={15} fill={cores.amarelo} stroke={cores.nevoa} strokeWidth={forma.traco} />
      {roda(70)}
      {roda(largura - 70)}
    </svg>
  );
};

const Andarilho: React.FC<{ id: IdPersonagem; roteiro: RoteiroPasseio; x: number; altura: number }> = ({ id, roteiro, x, altura }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const minhas = roteiro.falas.filter((f) => f.quem === id);
  const atual = roteiro.falas.find((f) => frame >= tempoFala(f).ini && frame < tempoFala(f).fim);
  const falando = atual?.quem === id;
  // expressão/pose: a da minha última fala começada (antes da primeira, a da primeira)
  const ultima = [...minhas].reverse().find((f) => frame >= tempoFala(f).ini - 6) ?? minhas[0];
  const ouvindo = !falando && !!atual;
  const neuro = id === "neuro";
  const largura = (altura * 600) / 700;
  const passo = Math.floor(frame / colagem.passo);
  // caminhada: sobe e desce em degraus + leve inclinação para a frente; a Lia desliza e balança no skate
  const sobe = neuro ? -Math.abs(Math.sin((passo / 3) * Math.PI)) * 10 : Math.sin(frame / 9) * 6;
  const inclina = neuro ? 4 + Math.sin((passo / 3) * Math.PI) * 3 : Math.sin(frame / 14) * 4;
  // vai e vem pela tela: nunca fica parado no mesmo ponto
  const passeio = Math.sin(frame / (neuro ? 52 : 67) + (neuro ? 0 : 2)) * (neuro ? 80 : 46) + Math.sin(frame / 23) * 14;
  // pulinho quando começa a falar
  const pulo = falando ? -Math.sin(Math.min(1, (frame - tempoFala(atual!).ini) / 12) * Math.PI) * 54 : 0;
  // entra andando no começo e sai correndo no fim
  const entrada = (1 - entrar(frame, neuro ? 0 : 6, 22)) * -520;
  const saida = suave(frame, [durationInFrames - 20, durationInFrames], [0, 700]);
  return (
    <div style={{ position: "absolute", left: x + passeio + entrada + saida - largura / 2, top: (neuro ? CHAO - altura * QUADRIL - COMP_PERNA - 16 : CHAO - altura - 70) + sobe + pulo, width: largura, height: altura, transform: `rotate(${inclina}deg)`, transformOrigin: "50% 100%" }}>
      {neuro ? <Pernas largura={largura} altura={altura} ritmo={3} /> : <Skate largura={largura} />}
      <div style={{ position: "relative" }}>
        <Busto id={id} expressao={ultima?.expressao ?? "feliz"} olhando={ouvindo ? (neuro ? "direita" : "esquerda") : neuro ? "direita" : "frente"} pose={falando ? ultima?.pose ?? "parado" : "parado"} falando={falando} altura={altura} />
      </div>
    </div>
  );
};

// ─── BALÃO-NUVEM: forma viva (a borda ondula), palavras no ritmo da voz ───
const Balao: React.FC<{ fala: FalaPasseio; xQuem: number }> = ({ fala, xQuem }) => {
  const frame = useCurrentFrame();
  const { fonte } = useEstilo();
  const { ini, fim } = tempoFala(fala);
  const local = frame - ini;
  if (local < -2 || frame > fim + 3) return null;
  const e = entrar(frame, ini, 9);
  const s = sair(frame, fim - 2, 5);
  const lia = fala.quem !== "neuro";
  const fundo = lia ? cores.amarelo : cores.nevoa;
  const palavras = separarPalavras(fala.texto);
  const porPalavra = Math.max(1.5, ((fim - ini) * 0.82) / palavras.length);
  const o = (n: number, base: number) => base + Math.sin(frame / 7 + n) * 9;
  const raio = `${o(0, 46)}% ${o(1, 54)}% ${o(2, 50)}% ${o(3, 50)}% / ${o(4, 58)}% ${o(5, 52)}% ${o(6, 48)}% ${o(7, 42)}%`;
  const largura = Math.min(900, 330 + fala.texto.length * 11);
  const centro = Math.max(largura / 2 + 50, Math.min(W - largura / 2 - 50, xQuem + (lia ? -70 : 70)));
  return (
    <div style={{ position: "absolute", left: centro - largura / 2, bottom: 1920 - 985, width: largura, opacity: Math.min(1, e) * s, transform: `scale(${0.5 + 0.5 * e}) rotate(${Math.sin(frame / 16) * 1.6 + (lia ? 2 : -2)}deg)`, transformOrigin: `${((xQuem - (centro - largura / 2)) / largura) * 100}% 130%` }}>
      <svg width={70} height={64} viewBox="0 0 70 64" style={{ position: "absolute", left: Math.max(60, Math.min(largura - 130, xQuem - (centro - largura / 2) - 35)), bottom: -44, overflow: "visible" }}>
        <path d="M 4 0 Q 30 10 35 60 Q 44 16 66 0 Z" fill={fundo} />
      </svg>
      <div style={{ position: "relative", background: fundo, borderRadius: raio, padding: "46px 64px", textAlign: "center", ...fonte("textoForte", "rotulo"), color: cores.tinta }}>
        {palavras.map((p, i) => {
          const ep = entrar(frame, ini + 2 + i * porPalavra, 7);
          return (
            <span key={i} style={{ display: "inline-block", marginRight: "0.26em", opacity: Math.min(1, ep), transform: `translateY(${(1 - ep) * 18}px) scale(${0.7 + 0.3 * ep})`, color: p.tipo === "normal" ? cores.tinta : cores.coral }}>
              {p.texto}
              {p.sufixo ?? ""}
            </span>
          );
        })}
      </div>
    </div>
  );
};

// ─── PLACAS DO CÉU ────────────────────────────────────────────────────────
type PropsPlaca = { placa: PlacaPasseio; t: number; extraT: number };

const Pilula: React.FC<{ texto: string; cor: NomeCor; t: number; gira?: number }> = ({ texto, cor, t, gira = 0 }) => {
  const { fonte } = useEstilo();
  const e = entrar(t, 0, 12);
  return (
    <div style={{ ...fonte("titulo", "rotulo"), background: cores[cor], color: cor === "coral" ? cores.nevoa : cores.tinta, border: `${forma.traco}px solid ${cores.nevoa}`, borderRadius: forma.raioPilula, padding: "14px 34px", opacity: Math.min(1, e), transform: `scale(${e}) rotate(${gira + Math.sin(t / 11) * 3}deg)`, whiteSpace: "nowrap" }}>{texto}</div>
  );
};

/** Anel de nota: o traço se desenha e o número conta até o valor. */
const Anel: React.FC<{ valor?: number; cor: NomeCor; t: number; tamanho: number }> = ({ valor, cor, t, tamanho }) => {
  const { fonte } = useEstilo();
  const r = tamanho / 2 - 22;
  const comp = 2 * Math.PI * r;
  const cheio = valor !== undefined ? valor / 100 : 1;
  const giro = valor === undefined ? t * 3 : -90;
  return (
    <div style={{ position: "relative", width: tamanho, height: tamanho, transform: `scale(${entrar(t, 0, 14)})` }}>
      <svg width={tamanho} height={tamanho} style={{ position: "absolute", inset: 0, transform: `rotate(${giro}deg)` }}>
        <circle cx={tamanho / 2} cy={tamanho / 2} r={r} fill={comAlfa("lavanda", 0.14)} stroke={cores.ardosia} strokeWidth={22} />
        <circle cx={tamanho / 2} cy={tamanho / 2} r={r} fill="none" stroke={cores[cor]} strokeWidth={22} strokeLinecap="round" style={valor !== undefined ? desenharTraco(t, comp * cheio, 6, 40) : { strokeDasharray: `${comp * 0.2} ${comp * 0.13}` }} strokeDasharray={`${comp * cheio} ${comp}`} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", ...fonte("formula", "titulo"), color: cores.nevoa, transform: `scale(${valor === undefined ? 1.3 + Math.sin(t / 6) * 0.14 : tamanho / 300})` }}>{valor !== undefined ? Math.round(contar(t, 0, valor, 6, 40)) : "?"}</div>
    </div>
  );
};

const Rotulo: React.FC<{ titulo?: string; sub?: string }> = ({ titulo, sub }) => {
  const { fonte } = useEstilo();
  return (
    <div style={{ textAlign: "center" }}>
      {titulo && <div style={{ ...fonte("titulo", "subtitulo"), color: cores.nevoa }}>{titulo}</div>}
      {sub && <div style={{ ...fonte("texto", "nota"), color: cores.lavanda, marginTop: 6 }}>{sub}</div>}
    </div>
  );
};

const Abertura: React.FC<PropsPlaca> = ({ t }) => {
  const { fonte } = useEstilo();
  const medalha = (texto: string, cor: NomeCor, atraso: number, lado: number) => {
    const e = entrar(t, atraso, 14);
    return (
      <div style={{ width: 290, height: 290, borderRadius: "50%", background: cores[cor], border: `${forma.borda}px solid ${cores.nevoa}`, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", ...fonte("titulo", "subtitulo"), color: cor === "coral" ? cores.nevoa : cores.tinta, transform: `scale(${e}) rotate(${lado * (8 + Math.sin(t / 9) * 5)}deg) translateY(${Math.sin(t / 8 + lado) * 14}px)` }}>{texto}</div>
    );
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 44 }}>
      <div style={{ ...fonte("titulo", "subtitulo"), background: cores.nevoa, color: cores.tinta, padding: "22px 90px", clipPath: "polygon(0 0, 100% 0, 94% 50%, 100% 100%, 0 100%, 6% 50%)", transform: `rotate(-4deg) skewY(${Math.sin(t / 8) * 2}deg) scale(${entrar(t, 0, 12)})` }}>JOGO DO ANO 2026</div>
      <div style={{ display: "flex", alignItems: "center", gap: 26 }}>
        {medalha("GTA 6", "coral", 8, -1)}
        <div style={{ ...fonte("titulo", "subtitulo"), color: cores.amarelo, transform: `scale(${entrar(t, 22, 10) * (1 + Math.sin(t / 5) * 0.12)})` }}>VS</div>
        {medalha("Zelda", "amarelo", 14, 1)}
      </div>
    </div>
  );
};

const Nota: React.FC<PropsPlaca> = ({ placa, t }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
    <Anel valor={placa.valor} cor={placa.cor ?? "amarelo"} t={t} tamanho={380} />
    <Rotulo titulo={placa.titulo} sub={placa.sub} />
  </div>
);

const Espera: React.FC<PropsPlaca> = ({ placa, t, extraT }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 36 }}>
      <Anel cor="coral" t={t} tamanho={extraT > 0 ? 300 : 380} />
      {extraT > 0 && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
          <Anel valor={placa.extraValor} cor="amarelo" t={extraT} tamanho={300} />
          <Rotulo sub={placa.extra} />
        </div>
      )}
    </div>
    <Rotulo titulo={placa.titulo} sub={placa.sub} />
  </div>
);

const Setas: React.FC<PropsPlaca> = ({ placa, t, extraT }) => {
  const { fonte } = useEstilo();
  const seta = (texto: string, lado: number, cor: NomeCor, atraso: number) => (
    <div style={{ ...fonte("titulo", "rotulo"), background: cores[cor], color: cor === "coral" ? cores.nevoa : cores.tinta, padding: lado < 0 ? "30px 60px 30px 110px" : "30px 110px 30px 60px", clipPath: lado < 0 ? "polygon(14% 0, 100% 0, 100% 100%, 14% 100%, 0 50%)" : "polygon(0 0, 86% 0, 100% 50%, 86% 100%, 0 100%)", alignSelf: lado < 0 ? "flex-start" : "flex-end", transform: `translateX(${(1 - entrar(t, atraso, 14)) * lado * -500 + Math.sin(t / 7 + lado) * lado * 16}px) rotate(${lado * 3}deg)` }}>{texto}</div>
  );
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 34, width: 800, alignItems: "center" }}>
      {seta(placa.esquerda ?? "", -1, "coral", 0)}
      <svg width={12} height={70} style={{ overflow: "visible" }}>
        <line x1={6} y1={0} x2={6} y2={70} stroke={cores.nevoa} strokeWidth={forma.traco} strokeLinecap="round" strokeDasharray="2 18" />
      </svg>
      {seta(placa.direita ?? "", 1, "amarelo", 8)}
      {extraT > 0 && placa.extra && <Pilula texto={placa.extra} cor="lavanda" t={extraT} gira={-3} />}
    </div>
  );
};

const Selo: React.FC<PropsPlaca> = ({ placa, t, extraT }) => {
  const { fonte } = useEstilo();
  const e = entrar(t, 0, 10);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
      <div style={{ width: 400, height: 400, borderRadius: "50%", border: `${forma.borda}px solid ${cores.coral}`, padding: 16, transform: `scale(${2.2 - 1.2 * e}) rotate(${-14 + Math.sin(t / 13) * 3}deg)`, opacity: Math.min(1, e) }}>
        <div style={{ width: "100%", height: "100%", borderRadius: "50%", border: `${forma.traco}px dashed ${cores.coral}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6 }}>
          <div style={{ ...fonte("titulo", "subtitulo"), color: cores.coral }}>{placa.titulo}</div>
          <div style={{ ...fonte("texto", "nota"), color: cores.lavanda }}>{placa.sub}</div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 24, minHeight: 80 }}>{extraT > 0 && (placa.itens ?? []).map((it, i) => <Pilula key={i} texto={it} cor={i ? "lavanda" : "amarelo"} t={extraT - i * 8} gira={i ? 4 : -4} />)}</div>
    </div>
  );
};

const Estrela: React.FC<PropsPlaca> = ({ placa, t, extraT }) => {
  const { fonte } = useEstilo();
  const pontas = 14;
  const pts = Array.from({ length: pontas * 2 }, (_, i) => {
    const r = i % 2 ? 150 + Math.sin(t / 5 + i) * 10 : 205;
    const a = (i / (pontas * 2)) * Math.PI * 2;
    return `${210 + Math.cos(a) * r},${210 + Math.sin(a) * r}`;
  }).join(" ");
  const comp = 2 * Math.PI * 120;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 30 }}>
        <div style={{ position: "relative", width: 420, height: 420, transform: `scale(${entrar(t, 0, 14)})` }}>
          <svg width={420} height={420} style={{ position: "absolute", inset: 0, transform: `rotate(${t * 0.9}deg)` }}>
            <polygon points={pts} fill={cores.amarelo} stroke={cores.nevoa} strokeWidth={forma.traco} strokeLinejoin="round" />
          </svg>
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: cores.tinta }}>
            <div style={{ ...fonte("titulo", "subtitulo") }}>{placa.titulo}</div>
            <div style={{ ...fonte("texto", "nota") }}>{placa.sub}</div>
          </div>
        </div>
        {extraT > 0 && (
          <div style={{ position: "relative", width: 300, height: 300, transform: `scale(${entrar(extraT, 0, 14)})` }}>
            <svg width={300} height={300} style={{ position: "absolute", inset: 0, transform: `rotate(${extraT * 5}deg)` }}>
              <circle cx={150} cy={150} r={120} fill="none" stroke={cores.coral} strokeWidth={18} strokeLinecap="round" strokeDasharray={`${comp * 0.38} ${comp * 0.12}`} />
            </svg>
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", ...fonte("titulo", "nota"), color: cores.nevoa, padding: 60 }}>{placa.extra}</div>
          </div>
        )}
      </div>
    </div>
  );
};

const Duvida: React.FC<PropsPlaca> = ({ placa, t }) => {
  const { fonte } = useEstilo();
  const e = entrar(t, 0, 14);
  return (
    <div style={{ position: "relative", width: 700, height: 560, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ ...fonte("formula", "titulo"), color: cores.coral, transform: `scale(${e * (4.4 + Math.sin(t / 6) * 0.3)}) rotate(${Math.sin(t / 9) * 10}deg)` }}>?</div>
      {[0, 1, 2].map((i) => {
        const a = t / 14 + (i * Math.PI * 2) / 3;
        return <div key={i} style={{ position: "absolute", left: 350 + Math.cos(a) * 300 - 16, top: 280 + Math.sin(a) * 210 - 16, width: 32, height: 32, borderRadius: "50%", background: i ? cores.nevoa : cores.amarelo }} />;
      })}
      <div style={{ position: "absolute", bottom: 0 }}>
        <Pilula texto={placa.titulo ?? ""} cor="amarelo" t={t - 8} gira={-3} />
      </div>
    </div>
  );
};

const Balanca: React.FC<PropsPlaca> = ({ placa, t }) => {
  const ang = Math.sin(t / 15) * 13;
  const e = entrar(t, 0, 14);
  return (
    <div style={{ position: "relative", width: 900, height: 480, transform: `scale(${e})` }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 150, height: 0, transform: `rotate(${ang}deg)` }}>
        <div style={{ position: "absolute", left: 40, right: 40, top: 84, height: forma.membro, borderRadius: forma.raioPilula, background: cores.nevoa }} />
        <div style={{ position: "absolute", left: 0, top: 0, transform: `rotate(${-ang}deg)` }}>
          <Pilula texto={placa.esquerda ?? ""} cor="amarelo" t={t} />
        </div>
        <div style={{ position: "absolute", right: 0, top: 0, transform: `rotate(${-ang}deg)` }}>
          <Pilula texto={placa.direita ?? ""} cor="coral" t={t - 6} />
        </div>
      </div>
      <svg width={900} height={480} style={{ position: "absolute", inset: 0 }}>
        <polygon points="450,236 380,420 520,420" fill={cores.lavanda} stroke={cores.nevoa} strokeWidth={forma.traco} strokeLinejoin="round" />
        <circle cx={450} cy={240} r={20} fill={cores.nevoa} />
      </svg>
    </div>
  );
};

const Final: React.FC<PropsPlaca> = ({ placa, t }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 40, transform: `translateY(${Math.sin(t / 8) * 10}px)` }}>
    <div style={{ transform: "scale(1.5)" }}>
      <Pilula texto={placa.titulo ?? ""} cor="coral" t={t} gira={-4} />
    </div>
    <Marca tamanho="subtitulo" atraso={0} />
  </div>
);

const PLACAS: Record<PlacaPasseio["tipo"], React.FC<PropsPlaca>> = { abertura: Abertura, nota: Nota, espera: Espera, setas: Setas, selo: Selo, estrela: Estrela, duvida: Duvida, balanca: Balanca, final: Final };

/** Cada placa chega voando da direita, vai derivando para trás com o mundo e sai pela esquerda. */
const PlacaNoCeu: React.FC<{ placa: PlacaPasseio; roteiro: RoteiroPasseio; ultima: boolean }> = ({ placa, roteiro, ultima }) => {
  const frame = useCurrentFrame();
  const ini = tempoFala(roteiro.falas[placa.de]).ini - 4;
  const fim = ultima ? Infinity : tempoFala(roteiro.falas[placa.ate]).fim + 2;
  if (frame < ini || frame > fim + 12) return null;
  const t = frame - ini;
  const e = entrar(frame, ini, 16);
  const s = ultima ? 1 : sair(frame, fim - 2, 12);
  const meio = (Math.min(fim, ini + 400) - ini) / 2;
  const deriva = (meio - t) * 0.9; // continua andando para trás enquanto está na tela
  const x = (1 - e) * 1100 - (1 - s) * 1200 + deriva;
  const extraT = placa.extraEm !== undefined ? frame - tempoFala(roteiro.falas[placa.extraEm]).ini : 0;
  const C = PLACAS[placa.tipo];
  return (
    <Sequence from={ini} layout="none">
      <div style={{ position: "absolute", left: 0, width: W, top: CEU - 330, height: 660, display: "flex", alignItems: "center", justifyContent: "center", transform: `translate(${x}px, ${Math.sin(frame / 19) * 12}px) rotate(${(1 - e) * 14 - (1 - s) * 10}deg)` }}>
        <C placa={placa} t={t} extraT={extraT} />
      </div>
    </Sequence>
  );
};

const X_NEURO = 330;
const X_LIA = 770;

export const Passeio: React.FC<{ roteiro: RoteiroPasseio }> = ({ roteiro }) => {
  const frame = useCurrentFrame();
  return (
    <ProvedorEstilo formato="vertical">
      <AbsoluteFill style={{ background: cores.tinta }}>
        <div style={{ position: "absolute", inset: 0, transform: `translateX(${-((frame * 0.8) % 60)}px) scale(1.08)` }}>
          <Constelacao semente={7} />
        </div>
        <Cenario />
        {roteiro.placas.map((p, i) => (
          <PlacaNoCeu key={i} placa={p} roteiro={roteiro} ultima={i === roteiro.placas.length - 1} />
        ))}
        <Andarilho id="lia" roteiro={roteiro} x={X_LIA} altura={400} />
        <Andarilho id="neuro" roteiro={roteiro} x={X_NEURO} altura={430} />
        {roteiro.falas.map((f, i) => (
          <Balao key={i} fala={f} xQuem={f.quem === "neuro" ? X_NEURO : X_LIA} />
        ))}
        {roteiro.falas.map((f, i) => f.arquivo && (
          <Sequence key={`a${i}`} from={tempoFala(f).ini} layout="none">
            <Audio src={staticFile(f.arquivo)} />
          </Sequence>
        ))}
        {roteiro.musica && <MusicaDeFundo nome={roteiro.musica} comVoz />}
      </AbsoluteFill>
    </ProvedorEstilo>
  );
};
