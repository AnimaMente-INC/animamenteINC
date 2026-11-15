/**
 * TEXTO ANIMADO — base de Titulo, Legenda e das falas.
 * Marcação de destaque no texto:
 *   *palavra*  → Amarelo (como "azul?" na thumbnail da identidade)
 *   _palavra_  → Coral (como "mente" no nome da marca)
 *
 * MODELOS DE TEXTO (como o texto aparece). O roteiro escolhe com "estiloTexto":
 *   palavra   → palavra por palavra, com um pulinho (padrão)
 *   maquina   → digitado letra por letra, com cursor Amarelo
 *   marcador  → o texto aparece e um marca-texto passa por trás dos destaques
 *   onda      → letra por letra, em onda; os destaques continuam balançando
 *   recorte   → cada palavra é um recorte de papel colado torto (colagem, como os personagens)
 */
import React, { createContext } from "react";
import { useCurrentFrame } from "remotion";
import { crescer, cursorAceso, digitar, entrar, estiloCarimbo, ondular, sair } from "../animacao";
import { useEstilo } from "../tema/Estilo";
import { cores, fontes, NomeFonte, NomeTamanho, tempos } from "../tema/tokens";

export type EstiloTexto = "palavra" | "maquina" | "marcador" | "onda" | "recorte";
export const ESTILOS_TEXTO: EstiloTexto[] = ["palavra", "maquina", "marcador", "onda", "recorte"];
/** Modelo de texto da cena (vem do roteiro). Titulo e Legenda leem daqui. */
export const TextoCtx = createContext<EstiloTexto>("palavra");

type Palavra = { texto: string; tipo: "normal" | "marca" | "cor"; sufixo?: string };

/**
 * Divide o texto em unidades animadas. Um trecho marcado (*...* ou _..._) vira UMA unidade
 * (o destaque aparece inteiro), e pontuação logo depois dele fica grudada ("_entropia_?").
 */
export const separarPalavras = (texto: string): Palavra[] => {
  const out: Palavra[] = [];
  const re = /\*([^*]+)\*([.,!?;:…]*)|_([^_]+)_([.,!?;:…]*)|(\S+)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(texto))) {
    if (m[1] !== undefined) out.push({ texto: m[1], tipo: "marca", sufixo: m[2] });
    else if (m[3] !== undefined) out.push({ texto: m[3], tipo: "cor", sufixo: m[4] });
    else out.push({ texto: m[5], tipo: "normal" });
  }
  return out;
};

/** Texto sem marcação (para contar caracteres). */
export const textoLimpo = (texto: string) => separarPalavras(texto).map((p) => p.texto + (p.sufixo ?? "")).join(" ");

/** Quantos frames o texto leva para aparecer inteiro. */
export const duracaoTexto = (texto: string) => textoLimpo(texto).split(/\s+/).length * tempos.porPalavra + tempos.entrada;

/** Cantos levemente tortos, como papel cortado com tesoura (3 variações). */
export const RECORTES = [
  "polygon(1.5% 7%, 98.5% 0%, 100% 91%, 3% 100%)",
  "polygon(0% 2%, 97% 6%, 99% 100%, 2% 94%)",
  "polygon(3% 0%, 100% 4%, 97% 96%, 0% 100%)",
];

export const TextoAnimado: React.FC<{
  texto: string;
  fonte?: NomeFonte;
  tamanho?: NomeTamanho;
  cor?: string;
  atraso?: number;
  inicioSaida?: number;
  alinhamento?: "left" | "center";
  larguraMax?: number | string;
  porPalavra?: number;
  /** Como o texto aparece (padrão: palavra por palavra). */
  modelo?: EstiloTexto;
  /** Frames por letra no modelo "maquina" (padrão: tempos.porLetra). */
  porLetra?: number;
}> = ({ texto, fonte = "texto", tamanho = "legenda", cor, atraso = 0, inicioSaida, alinhamento = "center", larguraMax, porPalavra = tempos.porPalavra, modelo = "palavra", porLetra = tempos.porLetra }) => {
  const frame = useCurrentFrame();
  const { fonte: f, p } = useEstilo();
  const palavras = separarPalavras(texto);
  const s = inicioSaida !== undefined ? sair(frame, inicioSaida) : 1;
  const estiloBase = f(fonte, tamanho);
  const corBase = cor ?? p.texto;
  // sobre fundo claro (texto Tinta), o Amarelo some: os dois destaques viram Coral
  const sobreClaro = corBase === cores.tinta;
  const corDestaque = (pal: Palavra) => (pal.tipo === "marca" ? (sobreClaro ? cores.coral : cores.amarelo) : pal.tipo === "cor" ? cores.coral : undefined);
  const interno = (pal: Palavra): React.CSSProperties => (pal.tipo === "normal" ? {} : { color: corDestaque(pal), fontWeight: fontes.textoForte.peso });
  const caixa: React.CSSProperties = { ...estiloBase, color: corBase, textAlign: alinhamento, maxWidth: larguraMax, opacity: s };

  // ── máquina de escrever ──
  if (modelo === "maquina") {
    const total = palavras.reduce((n, pal) => n + pal.texto.length + (pal.sufixo?.length ?? 0), 0);
    const escritas = digitar(frame, total, atraso, porLetra);
    let pos = 0;
    return (
      <div style={caixa}>
        {palavras.map((pal, i) => {
          const inicio = pos;
          const tudo = pal.texto.length + (pal.sufixo?.length ?? 0);
          pos += tudo;
          const v = Math.max(0, Math.min(tudo, escritas - inicio));
          const vt = Math.min(v, pal.texto.length);
          const vs = v - vt;
          const cursorAqui = frame >= atraso && (i === palavras.length - 1 ? escritas >= inicio + 1 : escritas >= inicio + 1 && escritas < pos + 1) && (escritas < total || cursorAceso(frame));
          const oculto: React.CSSProperties = { opacity: 0 };
          return (
            <span key={i} style={{ display: "inline-block", marginRight: "0.28em", whiteSpace: "nowrap" }}>
              <span style={interno(pal)}>
                {pal.texto.slice(0, vt)}
                {vs === 0 && cursorAqui && <Cursor />}
                <span style={oculto}>{pal.texto.slice(vt)}</span>
              </span>
              {(pal.sufixo ?? "").slice(0, vs)}
              {vs > 0 && cursorAqui && <Cursor />}
              <span style={oculto}>{(pal.sufixo ?? "").slice(vs)}</span>
            </span>
          );
        })}
      </div>
    );
  }

  // ── marca-texto ──
  if (modelo === "marcador") {
    const fimTexto = atraso + palavras.length + tempos.entrada * 0.5;
    let k = 0;
    return (
      <div style={{ ...caixa, lineHeight: 1.3 }}>
        {palavras.map((pal, i) => {
          const e = Math.min(1, entrar(frame, atraso + i));
          const base: React.CSSProperties = { display: "inline-block", opacity: e, marginRight: "0.28em", whiteSpace: "nowrap" };
          if (pal.tipo === "normal") return <span key={i} style={base}>{pal.texto}</span>;
          const passada = crescer(frame, fimTexto + k++ * (tempos.marcador - 2), tempos.marcador);
          const fundo = corDestaque(pal)!;
          const sobre = fundo === cores.coral ? cores.nevoa : cores.tinta;
          return (
            <span key={i} style={base}>
              <span style={{ position: "relative", isolation: "isolate", display: "inline-block", fontWeight: fontes.textoForte.peso, color: passada > 0.5 ? sobre : corBase }}>
                <span style={{ position: "absolute", inset: "0.06em -0.14em", background: fundo, borderRadius: "0.16em", transform: `rotate(-1.2deg) scaleX(${passada})`, transformOrigin: "0% 50%", zIndex: -1 }} />
                {pal.texto}
              </span>
              {pal.sufixo}
            </span>
          );
        })}
      </div>
    );
  }

  // ── onda ──
  if (modelo === "onda") {
    let n = 0;
    return (
      <div style={caixa}>
        {palavras.map((pal, i) => (
          <span key={i} style={{ display: "inline-block", marginRight: "0.28em", whiteSpace: "nowrap" }}>
            {[...(pal.texto + (pal.sufixo ?? ""))].map((letra, j) => {
              const idx = n++;
              const e = entrar(frame, atraso + idx * tempos.porLetraOnda);
              const destaque = pal.tipo !== "normal" && j < pal.texto.length;
              const balanco = destaque && e >= 1 ? ondular(frame - atraso, idx) : 0;
              return (
                <span key={j} style={{ display: "inline-block", opacity: Math.min(1, e), transform: `translateY(${(1 - e) * 46 + balanco}px)`, ...(destaque ? interno(pal) : {}) }}>
                  {letra}
                </span>
              );
            })}
          </span>
        ))}
      </div>
    );
  }

  // ── recorte de papel ──
  if (modelo === "recorte") {
    return (
      <div style={{ ...caixa, lineHeight: 1.42 }}>
        {palavras.map((pal, i) => {
          const fundo = corDestaque(pal) ?? corBase;
          const sobre = fundo === cores.coral || fundo === cores.tinta ? cores.nevoa : cores.tinta;
          const giro = (((i * 37) % 7) - 3) * 0.9;
          return (
            <span key={i} style={{ ...estiloCarimbo(frame, { atraso: atraso + i * porPalavra, giro }), display: "inline-block", margin: "0.06em 0.1em", padding: "0 0.24em", background: fundo, color: sobre, fontWeight: fontes.textoForte.peso, clipPath: RECORTES[i % RECORTES.length], whiteSpace: "nowrap" }}>
              {pal.texto}
              {pal.sufixo}
            </span>
          );
        })}
      </div>
    );
  }

  // ── palavra por palavra (padrão) ──
  return (
    <div style={caixa}>
      {palavras.map((pal, i) => {
        const e = entrar(frame, atraso + i * porPalavra);
        const estiloPal: React.CSSProperties = {
          display: "inline-block",
          opacity: Math.min(1, e),
          transform: `translateY(${(1 - e) * 24}px) scale(${0.7 + 0.3 * e})`,
          marginRight: "0.28em",
        };
        return (
          <span key={i} style={estiloPal}>
            <span style={interno(pal)}>{pal.texto}</span>
            {pal.sufixo}
          </span>
        );
      })}
    </div>
  );
};

/** Cursor Amarelo do modelo "maquina" (não ocupa espaço: o texto não pula). */
const Cursor: React.FC = () => (
  <span style={{ display: "inline-block", width: 0, position: "relative" }}>
    <span style={{ position: "absolute", left: "0.04em", bottom: "-0.02em", width: "0.1em", height: "0.86em", background: cores.amarelo, borderRadius: "0.05em" }} />
  </span>
);
