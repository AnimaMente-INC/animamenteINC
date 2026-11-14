/**
 * TEXTO PALAVRA POR PALAVRA — base de Titulo, Legenda e BalaoDeFala.
 * Marcação de destaque no texto:
 *   *palavra*  → Amarelo (como "azul?" na thumbnail da identidade)
 *   _palavra_  → Coral (como "mente" no nome da marca)
 */
import React from "react";
import { useCurrentFrame } from "remotion";
import { entrar, sair } from "../animacao";
import { useEstilo } from "../tema/Estilo";
import { cores, fontes, NomeFonte, NomeTamanho, tempos } from "../tema/tokens";

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
}> = ({ texto, fonte = "texto", tamanho = "legenda", cor, atraso = 0, inicioSaida, alinhamento = "center", larguraMax, porPalavra = tempos.porPalavra }) => {
  const frame = useCurrentFrame();
  const { fonte: f, p } = useEstilo();
  const palavras = separarPalavras(texto);
  const s = inicioSaida !== undefined ? sair(frame, inicioSaida) : 1;
  const estiloBase = f(fonte, tamanho);

  return (
    <div style={{ ...estiloBase, color: cor ?? p.texto, textAlign: alinhamento, maxWidth: larguraMax, opacity: s }}>
      {palavras.map((pal, i) => {
        const e = entrar(frame, atraso + i * porPalavra);
        const estiloPal: React.CSSProperties = {
          display: "inline-block",
          opacity: Math.min(1, e),
          transform: `translateY(${(1 - e) * 24}px) scale(${0.7 + 0.3 * e})`,
          marginRight: "0.28em",
        };
        let interno: React.CSSProperties = {};
        // sobre fundo claro (texto Tinta), o Amarelo some: os dois destaques viram Coral
        const sobreClaro = (cor ?? p.texto) === cores.tinta;
        if (pal.tipo === "marca") interno = { color: sobreClaro ? cores.coral : cores.amarelo, fontWeight: fontes.textoForte.peso };
        if (pal.tipo === "cor") interno = { color: cores.coral, fontWeight: fontes.textoForte.peso };
        return (
          <span key={i} style={estiloPal}>
            <span style={interno}>{pal.texto}</span>
            {pal.sufixo}
          </span>
        );
      })}
    </div>
  );
};
