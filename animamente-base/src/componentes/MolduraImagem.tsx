/**
 * MOLDURA DE IMAGEM — imagem de referência (ex.: print de trailer) em moldura de "adesivo".
 * Borda Névoa por fora, cantos 28, proporção 16:9, etiqueta Amarelo no canto e crédito em Lavanda.
 * Sem `imagem`: mostra um espaço reservado (painel Lavanda 14% com ícone e descrição do que entra ali),
 * para a equipe trocar pela imagem na edição ou colocar o arquivo em public/ e renderizar de novo.
 */
import React from "react";
import { Img, staticFile, useCurrentFrame } from "remotion";
import { estiloEntrada, zoomLento } from "../animacao";
import { useEstilo } from "../tema/Estilo";
import { comAlfa, cores, forma } from "../tema/tokens";
import { Etiqueta } from "./Etiqueta";
import { Icone } from "./Icone";

export const MolduraImagem: React.FC<{
  /** Caminho dentro de public/ (ex.: "gta6/trailer-01.jpg"). Sem ele, mostra o espaço reservado. */
  imagem?: string;
  /** O que deve entrar no espaço reservado (ex.: "Vice City vista do alto"). */
  descricao?: string;
  /** Etiqueta no canto (ex.: "Trailer 2"). */
  rotulo?: string;
  /** Crédito da imagem (ex.: "Imagem: Rockstar Games"). */
  credito?: string;
  atraso?: number;
  /** Duração da cena em frames (para o zoom lento). */
  duracao?: number;
}> = ({ imagem, descricao, rotulo, credito, atraso = 0, duracao = 120 }) => {
  const frame = useCurrentFrame();
  const { fonte, formato, p, tema } = useEstilo();
  const vertical = formato === "vertical";
  const largura = vertical ? 960 : 1040;
  const altura = Math.round((largura * 9) / 16);
  const raio = forma.raioCartao;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 14, ...estiloEntrada(frame, { atraso, tipo: "pop" }) }}>
      <div style={{ position: "relative", width: largura, height: altura }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: raio,
            border: `${forma.borda}px solid ${p.borda}`,
            overflow: "hidden",
            boxSizing: "border-box",
            background: comAlfa("lavanda", tema === "escuro" ? 0.14 : 0.45),
          }}
        >
          {imagem ? (
            <Img
              src={staticFile(imagem)}
              style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${zoomLento(frame - atraso, duracao)})` }}
            />
          ) : (
            <div
              style={{
                position: "absolute",
                inset: 24,
                borderRadius: raio - 8,
                border: `${forma.tracoFino}px dashed ${cores.ardosia}`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 18,
                padding: 32,
                textAlign: "center",
              }}
            >
              <Icone nome="camera" cor="coral" tamanho={vertical ? 110 : 96} />
              <div style={{ ...fonte("titulo", "rotulo"), color: p.texto, letterSpacing: 2 }}>IMAGEM DO TRAILER</div>
              {descricao && <div style={{ ...fonte("texto", "nota"), color: p.textoApoio, maxWidth: largura * 0.8 }}>{descricao}</div>}
            </div>
          )}
        </div>
        {rotulo && (
          <div style={{ position: "absolute", left: 28, top: -26 }}>
            <Etiqueta texto={rotulo} cor="amarelo" tamanho="nota" />
          </div>
        )}
      </div>
      {credito && <div style={{ ...fonte("texto", "nota"), color: p.textoApoio, paddingRight: 12 }}>{credito}</div>}
    </div>
  );
};
