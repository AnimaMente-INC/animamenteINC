/**
 * MODELOS DE FALA — o jeito que a fala de um personagem aparece na tela.
 * O roteiro escolhe com "estiloFala" (no topo, para o vídeo todo, ou em uma cena só):
 *
 *   balao       → balão Névoa com rabicho (padrão, BalaoDeFala)
 *   pensamento  → balão de pensamento: bolinhas no lugar do rabicho e a boca fica fechada
 *   grito       → estouro Amarelo com pontas, texto em maiúsculas, cai como carimbo
 *   legenda     → sem balão: etiqueta com o nome + legenda "karaokê" (a palavra falada acende)
 *   faixa       → tarja de telejornal: aba com o nome na cor do personagem + faixa com o texto
 *   recado      → bilhete de papel recortado, preso com fita, texto digitado e assinatura
 *
 * Todos usam só as cores, a fonte e os movimentos da base. A voz é a mesma em qualquer modelo.
 */
import React, { createContext } from "react";
import { useCurrentFrame } from "remotion";
import { entrar, estiloCarimbo, estiloEntrada } from "../animacao";
import { COR_PERSONAGEM, IdPersonagem, NOMES_PERSONAGENS } from "../personagens/tipos";
import { useEstilo } from "../tema/Estilo";
import { audio, comAlfa, cores, falas, forma, fps, tempos } from "../tema/tokens";
import { BalaoDeFala } from "./BalaoDeFala";
import { Etiqueta } from "./Etiqueta";
import { RECORTES, separarPalavras, TextoAnimado, textoLimpo } from "./TextoAnimado";

export type EstiloFala = "balao" | "pensamento" | "grito" | "legenda" | "faixa" | "recado";
export const ESTILOS_FALA: EstiloFala[] = ["balao", "pensamento", "grito", "legenda", "faixa", "recado"];
/** Modelo de fala da cena (vem do roteiro). */
export const FalaCtx = createContext<EstiloFala>("balao");

/** Espaço que a cena reserva acima dos personagens para a fala. */
export const reservaDaFala = (estilo: EstiloFala, vertical: boolean) => Math.round(falas.reserva[estilo] * (vertical ? 1 : 0.85));

export type PropsFala = {
  estilo?: EstiloFala;
  texto: string;
  quem: IdPersonagem;
  atraso?: number;
  /** Posição horizontal de quem fala (0 = esquerda, 1 = direita). */
  rabicho?: number;
  porPalavra?: number;
  /** Duração da voz em frames (a legenda karaokê e o recado acompanham). */
  duracaoFala?: number;
  larguraMax?: number;
};

/** Legenda karaokê: todas as palavras ficam na tela e acendem conforme são faladas. */
export const LegendaKaraoke: React.FC<{ texto: string; atraso?: number; duracaoFala?: number; alinhamento?: "left" | "center"; tamanho?: "legenda" | "rotulo" }> = ({ texto, atraso = 0, duracaoFala, alinhamento = "center", tamanho = "legenda" }) => {
  const frame = useCurrentFrame();
  const { fonte, p, tema } = useEstilo();
  const palavras = separarPalavras(texto);
  const total = duracaoFala ?? Math.round((palavras.length / audio.palavrasPorSegundo) * fps);
  // cada palavra dura conforme o tamanho dela (palavra comprida demora mais para falar)
  const pesos = palavras.map((pal) => pal.texto.length + (pal.sufixo ? 3 : 2));
  const soma = pesos.reduce((a, b) => a + b, 0);
  let acumulado = 0;
  const inicios = pesos.map((w) => {
    const t = atraso + (acumulado / soma) * total;
    acumulado += w;
    return t;
  });
  const apagada = tema === "escuro" ? comAlfa("lavanda", 0.42) : comAlfa("ardosia", 0.5);
  return (
    <div style={{ ...fonte("textoForte", tamanho), lineHeight: 1.32, textAlign: alinhamento, color: p.texto }}>
      {palavras.map((pal, i) => {
        const fim = i + 1 < inicios.length ? inicios[i + 1] : atraso + total;
        const agora = frame >= inicios[i] && frame < fim;
        const passou = frame >= fim;
        const destaque = pal.tipo === "marca" ? cores.amarelo : pal.tipo === "cor" ? cores.coral : undefined;
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              padding: "0 0.16em",
              margin: "0 0.04em",
              borderRadius: "0.22em",
              background: agora ? cores.amarelo : "transparent",
              color: agora ? cores.tinta : passou ? (destaque && !(tema === "claro" && destaque === cores.amarelo) ? destaque : p.texto) : apagada,
              transform: `scale(${agora ? 1.08 : 1})`,
            }}
          >
            {pal.texto}
            {pal.sufixo}
          </span>
        );
      })}
    </div>
  );
};

const Pensamento: React.FC<PropsFala & { max: number }> = ({ texto, atraso = 0, rabicho = 0.5, porPalavra, max }) => {
  const frame = useCurrentFrame();
  const { p } = useEstilo();
  const bolinhas = [34, 24, 15];
  let y = 0;
  return (
    <div style={{ position: "relative", marginBottom: 70 }}>
      <div style={{ ...estiloEntrada(frame, { atraso: atraso + 6, tipo: "pop" }), transformOrigin: `${rabicho * 100}% 130%`, background: p.texto, borderRadius: forma.raioCartao * 2.6, padding: "30px 52px", maxWidth: max }}>
        <TextoAnimado texto={texto} fonte="textoForte" tamanho="rotulo" cor={p.fundo} atraso={atraso + 8} porPalavra={porPalavra} />
      </div>
      {bolinhas.map((d, k) => {
        y += d + 8;
        // as bolinhas sobem de quem pensa até o balão: a menor (perto da cabeça) aparece primeiro
        return <div key={k} style={{ ...estiloEntrada(frame, { atraso: atraso + (bolinhas.length - 1 - k) * 3, tipo: "pop" }), position: "absolute", left: `calc(${rabicho * 100}% + ${(k - 1) * 14 - d / 2}px)`, bottom: -y, width: d, height: d, borderRadius: forma.raioPilula, background: p.texto }} />;
      })}
    </div>
  );
};

const Grito: React.FC<PropsFala & { max: number }> = ({ texto, atraso = 0, porPalavra, max }) => {
  const frame = useCurrentFrame();
  const n = falas.pontasGrito * 2;
  const pontos = Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2;
    const r = i % 2 ? 41 + ((i * 7) % 5) * 0.6 : 50;
    return `${50 + Math.cos(a) * r},${50 + Math.sin(a) * r}`;
  }).join(" ");
  return (
    <div style={{ ...estiloCarimbo(frame, { atraso, giro: -2 }), position: "relative", padding: "64px 96px", maxWidth: max, boxSizing: "border-box" }}>
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        <polygon points={pontos} fill={cores.amarelo} stroke={cores.nevoa} strokeWidth={forma.borda} strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
      </svg>
      <div style={{ position: "relative", textTransform: "uppercase" }}>
        <TextoAnimado texto={texto} fonte="titulo" tamanho="rotulo" cor={cores.tinta} atraso={atraso + tempos.carimbo} porPalavra={porPalavra} />
      </div>
    </div>
  );
};

const LegendaComNome: React.FC<PropsFala & { max: number }> = ({ texto, quem, atraso = 0, duracaoFala, max }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ ...estiloEntrada(frame, { atraso: Math.max(0, atraso - 6), tipo: "subir" }), display: "flex", flexDirection: "column", alignItems: "center", gap: 14, maxWidth: max + 80 }}>
      <Etiqueta texto={NOMES_PERSONAGENS[quem]} cor={COR_PERSONAGEM[quem]} tamanho="nota" />
      <LegendaKaraoke texto={texto} atraso={atraso} duracaoFala={duracaoFala} />
    </div>
  );
};

const Faixa: React.FC<PropsFala & { max: number }> = ({ texto, quem, atraso = 0, porPalavra, max }) => {
  const frame = useCurrentFrame();
  const { fonte, p } = useEstilo();
  const cor = COR_PERSONAGEM[quem];
  const sobre = cor === "coral" ? cores.nevoa : cores.tinta;
  return (
    <div style={{ ...estiloEntrada(frame, { atraso, tipo: "deslizar" }), display: "flex", flexDirection: "column", alignItems: "flex-start", width: max + 80 }}>
      <div style={{ ...fonte("titulo", "nota"), background: cores[cor], color: sobre, padding: "8px 30px 6px", borderRadius: `${forma.raioCartao * 0.7}px ${forma.raioCartao * 0.7}px 0 0`, marginLeft: forma.raioCartao }}>{NOMES_PERSONAGENS[quem]}</div>
      <div style={{ background: p.texto, borderRadius: forma.raioCartao, borderLeft: `${forma.grade * 2}px solid ${cores[cor]}`, padding: "22px 34px", width: "100%", boxSizing: "border-box" }}>
        <TextoAnimado texto={texto} fonte="textoForte" tamanho="rotulo" cor={p.fundo} atraso={atraso + 4} porPalavra={porPalavra} alinhamento="left" />
      </div>
    </div>
  );
};

const Recado: React.FC<PropsFala & { max: number }> = ({ texto, quem, atraso = 0, duracaoFala, max }) => {
  const frame = useCurrentFrame();
  const { fonte, tema } = useEstilo();
  const letras = textoLimpo(texto).length;
  const porLetra = duracaoFala !== undefined ? Math.max(0.6, Math.min(3, (duracaoFala * 0.9) / letras)) : tempos.porLetra;
  const assinou = Math.min(1, entrar(frame, atraso + tempos.carimbo + letras * porLetra));
  return (
    <div style={{ ...estiloCarimbo(frame, { atraso, giro: falas.giroRecado }), position: "relative", maxWidth: max }}>
      <div style={{ background: tema === "escuro" ? cores.nevoa : cores.lilas, clipPath: RECORTES[0], padding: "54px 50px 34px" }}>
        <TextoAnimado texto={texto} fonte="textoForte" tamanho="rotulo" cor={cores.tinta} atraso={atraso + tempos.carimbo} modelo="maquina" porLetra={porLetra} alinhamento="left" />
        <div style={{ ...fonte("titulo", "nota"), color: cores.coral, textAlign: "right", marginTop: 10, opacity: assinou }}>— {NOMES_PERSONAGENS[quem]}</div>
      </div>
      {/* fita que prende o bilhete */}
      <div style={{ position: "absolute", top: -14, left: "50%", width: 170, height: 46, marginLeft: -85, background: comAlfa("amarelo", 0.86), transform: "rotate(3deg)", clipPath: RECORTES[2] }} />
    </div>
  );
};

/** Fala no modelo escolhido. Fica dentro de um container posicionado acima de quem fala. */
export const Fala: React.FC<PropsFala> = (props) => {
  const { formato } = useEstilo();
  const { estilo = "balao", larguraMax } = props;
  const max = larguraMax ?? (formato === "vertical" ? 800 : 620);
  if (estilo === "pensamento") return <Pensamento {...props} max={max} />;
  if (estilo === "grito") return <Grito {...props} max={max + 60} />;
  if (estilo === "legenda") return <LegendaComNome {...props} max={max} />;
  if (estilo === "faixa") return <Faixa {...props} max={max} />;
  if (estilo === "recado") return <Recado {...props} max={max} />;
  return <BalaoDeFala texto={props.texto} atraso={props.atraso} rabicho={props.rabicho} porPalavra={props.porPalavra} larguraMax={larguraMax} />;
};
