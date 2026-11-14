/**
 * <Personagem /> — API única para todos os personagens.
 *
 * <Personagem id="lia" pose="pensando" expressao="confuso" fala="Por quê?" olhando="direita" />
 */
import React from "react";
import { useCurrentFrame } from "remotion";
import { BalaoDeFala } from "../componentes/BalaoDeFala";
import { duracaoTexto, textoLimpo } from "../componentes/TextoAnimado";
import { useEstilo } from "../tema/Estilo";
import { tempos } from "../tema/tokens";
import { configLia } from "./Lia";
import { Neuro } from "./Neuro";
import { Humano } from "./partes/Humano";
import { resolverEstado } from "./partes/estado";
import { configTeo } from "./Teo";
import { configCaio } from "./Caio";
import { configRafa } from "./Rafa";
import { Expressao, IdPersonagem, Mudanca, Olhar, Pose } from "./tipos";

const humanos = { lia: configLia, teo: configTeo, caio: configCaio, rafa: configRafa } as const;

export type PropsPersonagem = {
  id: IdPersonagem;
  pose?: Pose;
  expressao?: Expressao;
  fala?: string;
  olhando?: Olhar;
  /** Altura do personagem em px (sem o balão). */
  altura?: number;
  /** Frame em que o balão aparece (relativo ao início do personagem). */
  falaEm?: number;
  /** Frame em que o balão some. */
  falaAte?: number;
  /** Mudanças de pose/expressão ao longo do tempo (frames). */
  mudancas?: Mudanca[];
  /** Duração do áudio da fala (frames). Sincroniza boca e balão com a voz. */
  duracaoFala?: number;
  /** Frame em que o personagem começa a narrar sem balão (voz em off com ele em cena). */
  narraEm?: number;
  /** Não desenha o balão (quando o grupo desenha o balão por cima de todos). */
  semBalao?: boolean;
};

/** Ritmo das palavras no balão, acompanhando a duração do áudio. */
export const ritmoFala = (fala: string, duracaoFala?: number) =>
  duracaoFala !== undefined ? Math.max(2, Math.min(10, (duracaoFala * 0.8) / textoLimpo(fala).split(/\s+/).length)) : undefined;

export const Personagem: React.FC<PropsPersonagem> = ({
  id,
  pose = "parado",
  expressao = "neutro",
  fala,
  olhando = "frente",
  altura,
  falaEm = 8,
  falaAte,
  mudancas,
  duracaoFala,
  narraEm,
  semBalao = false,
}) => {
  const frame = useCurrentFrame();
  const { formato } = useEstilo();
  const h = altura ?? (formato === "vertical" ? 700 : 520);
  const estado = resolverEstado(frame, { pose, expressao, olhando }, mudancas);

  // com voz: boca mexe exatamente enquanto o áudio toca; sem voz: enquanto o texto aparece
  const inicioFala = narraEm ?? falaEm;
  const fimFala = duracaoFala !== undefined ? inicioFala + duracaoFala : fala ? falaEm + duracaoTexto(fala) + tempos.entrada : 0;
  const temFala = !!fala || narraEm !== undefined;
  const falando = temFala && frame >= inicioFala + (duracaoFala !== undefined ? 0 : 4) && frame < fimFala && (falaAte === undefined || frame < falaAte);
  const porPalavra = fala ? ritmoFala(fala, duracaoFala) : undefined;

  // rabicho aponta para a cabeça
  const rabicho = estado.olhando === "esquerda" ? 0.6 : estado.olhando === "direita" ? 0.4 : 0.5;

  return (
    <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}>
      {fala && !semBalao && (
        <div style={{ position: "absolute", bottom: `calc(100% + 24px)`, display: "flex", justifyContent: "center", width: "max-content", maxWidth: formato === "vertical" ? 820 : 680 }}>
          <BalaoDeFala texto={fala} atraso={falaEm} inicioSaida={falaAte} rabicho={rabicho} porPalavra={porPalavra} />
        </div>
      )}
      {id === "neuro" ? (
        <Neuro estado={estado} falando={falando} altura={h * 0.72} />
      ) : (
        <Humano config={humanos[id]} estado={estado} falando={falando} altura={h} />
      )}
    </div>
  );
};
