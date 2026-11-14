/**
 * BALÃO DE FALA — "adesivo" chapado: fundo na cor do texto do tema (Névoa no escuro),
 * texto na cor do fundo (Tinta), sem contorno, rabicho apontando para quem fala.
 */
import React from "react";
import { useCurrentFrame } from "remotion";
import { estiloEntrada } from "../animacao";
import { useEstilo } from "../tema/Estilo";
import { forma } from "../tema/tokens";
import { TextoAnimado } from "./TextoAnimado";

export const BalaoDeFala: React.FC<{
  texto: string;
  atraso?: number;
  inicioSaida?: number;
  /** Posição horizontal do rabicho (0 = esquerda, 1 = direita). */
  rabicho?: number;
  larguraMax?: number;
  /** Frames entre palavras (com voz, acompanha o ritmo do áudio). */
  porPalavra?: number;
}> = ({ texto, atraso = 0, inicioSaida, rabicho = 0.5, larguraMax, porPalavra }) => {
  const frame = useCurrentFrame();
  const { formato, p } = useEstilo();
  const max = larguraMax ?? (formato === "vertical" ? 800 : 640);
  return (
    <div
      style={{
        ...estiloEntrada(frame, { atraso, tipo: "pop", inicioSaida }),
        transformOrigin: `${rabicho * 100}% 120%`,
        position: "relative",
        background: p.texto,
        borderRadius: forma.raioCartao * 1.4,
        padding: "22px 36px",
        maxWidth: max,
      }}
    >
      <TextoAnimado texto={texto} fonte="textoForte" tamanho="rotulo" cor={p.fundo} atraso={atraso + 2} porPalavra={porPalavra} />
      <svg width={52} height={36} viewBox="0 0 52 36" style={{ position: "absolute", left: `calc(${rabicho * 100}% - 26px)`, bottom: -32, overflow: "visible" }}>
        <path d="M 0 -2 Q 22 4 26 34 Q 30 4 52 -2 Z" fill={p.texto} />
      </svg>
    </div>
  );
};
