import React from "react";
import { CalculateMetadataFunction, Composition, Folder, staticFile } from "remotion";
import apresentacaoCanal from "../roteiros/apresentacao-canal.json";
import exemploEntropia from "../roteiros/exemplo-entropia.json";
import { Galeria, GALERIA } from "./Galeria";
import { duracaoTotal, ManifestoVozes, Roteiro } from "./roteiro";
import { formatos } from "./tema/formatos";
import { fps } from "./tema/tokens";
import { PropsVideo, Video } from "./Video";

/** Carrega as vozes (se existirem) e calcula duração e tamanho a partir do roteiro. */
const metadados: CalculateMetadataFunction<PropsVideo> = async ({ props }) => {
  let vozes: ManifestoVozes | null = props.vozes ?? null;
  if (!vozes && props.roteiro.id) {
    try {
      const r = await fetch(staticFile(`vozes/${props.roteiro.id}/manifesto.json`));
      if (r.ok) vozes = (await r.json()) as ManifestoVozes;
    } catch {
      vozes = null; // sem vozes: o vídeo sai mudo, no tempo do roteiro
    }
  }
  const f = formatos[props.roteiro.formato];
  return {
    durationInFrames: duracaoTotal(props.roteiro, vozes),
    width: f.largura,
    height: f.altura,
    fps,
    props: { ...props, vozes },
  };
};

/**
 * PARA CRIAR UM VÍDEO NOVO:
 * 1. Escreva roteiros/meu-video.json (com "id": "meu-video")
 * 2. Gere as vozes: python3 scripts/gerar-vozes.py roteiros/meu-video.json
 * 3. Importe aqui e adicione na lista abaixo.
 */
const videos: { id: string; roteiro: Roteiro }[] = [
  { id: "ApresentacaoCanal", roteiro: apresentacaoCanal as Roteiro },
  { id: "ExemploEntropia", roteiro: exemploEntropia as Roteiro },
];

export const Root: React.FC = () => (
  <>
    <Folder name="Videos">
      {videos.map((v) => (
        <Composition key={v.id} id={v.id} component={Video} defaultProps={{ roteiro: v.roteiro, vozes: null }} calculateMetadata={metadados} fps={fps} width={1080} height={1920} durationInFrames={1} />
      ))}
      <Composition
        id="ApresentacaoCanalHorizontal"
        component={Video}
        defaultProps={{ roteiro: { ...(apresentacaoCanal as Roteiro), formato: "horizontal" }, vozes: null }}
        calculateMetadata={metadados}
        fps={fps}
        width={1920}
        height={1080}
        durationInFrames={1}
      />
    </Folder>
    <Folder name="DesignSystem">
      <Composition id="Galeria" component={Galeria} fps={fps} width={GALERIA.largura} height={GALERIA.altura} durationInFrames={90} />
    </Folder>
  </>
);
