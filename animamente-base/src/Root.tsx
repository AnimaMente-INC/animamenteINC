import React from "react";
import { CalculateMetadataFunction, Composition, Folder, staticFile } from "remotion";
import apresentacaoCanal from "../roteiros/apresentacao-canal.json";
import exemploEntropia from "../roteiros/exemplo-entropia.json";
import gta6 from "../roteiros/gta6-tudo-que-sabemos.json";
import piratariaGames from "../roteiros/pirataria-games-brasil.json";
import susVoceUsaSemSaber from "../roteiros/sus-voce-usa-sem-saber.json";
import terrasRaras from "../roteiros/terras-raras.json";
import modeloConversa from "../roteiros/modelo-conversa.json";
import modeloDuelo from "../roteiros/modelo-duelo.json";
import modeloMapaMental from "../roteiros/modelo-mapa-mental.json";
import modeloPassoAPasso from "../roteiros/modelo-passo-a-passo.json";
import modeloQuiz from "../roteiros/modelo-quiz.json";
import modeloTop3 from "../roteiros/modelo-top3.json";
import gta6VsZelda from "../roteiros/passeio/gta6-vs-zelda.json";
import { duracaoPasseio, Passeio, RoteiroPasseio } from "./passeio/Passeio";
import { Capa, CAPAS } from "./Capa";
import { Galeria, GALERIA } from "./Galeria";
import { ELENCO, FolhaElenco, PREVIA, PreviaElenco } from "./Elenco";
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
  { id: "Gta6TudoQueSabemos", roteiro: gta6 as Roteiro },
  { id: "PiratariaGamesBrasil", roteiro: piratariaGames as Roteiro },
  { id: "SusVoceUsaSemSaber", roteiro: susVoceUsaSemSaber as Roteiro },
  { id: "TerrasRaras", roteiro: terrasRaras as Roteiro },
  // modelos de vídeo (um exemplo de cada; copie o roteiro e troque o conteúdo)
  { id: "ModeloQuiz", roteiro: modeloQuiz as Roteiro },
  { id: "ModeloDuelo", roteiro: modeloDuelo as Roteiro },
  { id: "ModeloTop3", roteiro: modeloTop3 as Roteiro },
  { id: "ModeloPassoAPasso", roteiro: modeloPassoAPasso as Roteiro },
  { id: "ModeloConversa", roteiro: modeloConversa as Roteiro },
  { id: "ModeloMapaMental", roteiro: modeloMapaMental as Roteiro },
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
      <Composition id="Gta6VsZelda" component={Passeio} defaultProps={{ roteiro: gta6VsZelda as RoteiroPasseio }} fps={fps} width={1080} height={1920} durationInFrames={duracaoPasseio(gta6VsZelda as RoteiroPasseio)} />
    </Folder>
    <Folder name="Capas">
      {CAPAS.map((c) => (
        <Composition key={c.id} id={c.id} component={Capa} defaultProps={c.props} fps={fps} width={1080} height={1920} durationInFrames={1} />
      ))}
    </Folder>
    <Folder name="DesignSystem">
      <Composition id="Galeria" component={Galeria} fps={fps} width={GALERIA.largura} height={GALERIA.altura} durationInFrames={90} />
      <Composition id="FolhaElenco" component={FolhaElenco} fps={fps} width={3200} height={1350} durationInFrames={90} />
      <Composition id="PreviaElenco" component={PreviaElenco} fps={fps} width={1920} height={1080} durationInFrames={PREVIA.porPersonagem * ELENCO.length} />
    </Folder>
  </>
);
