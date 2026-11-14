/**
 * <Video roteiro={...} vozes={...} /> — lê o roteiro e monta o vídeo inteiro no padrão animamente.
 * Transições, tempos, layout, barra de progresso e áudio são automáticos.
 *
 * PADRÃO DE ÁUDIO: música de fundo baixa e animada, SEM vozes de IA.
 * Cada fala ganha o tempo estimado de leitura (a boca mexe nesse tempo) e entra no roteiro
 * de locução (npm run locucao) para a equipe gravar. Gravações importadas
 * (scripts/importar-gravacoes.py) tocam no lugar certo e o vídeo se ajusta a elas.
 */
import React from "react";
import { AbsoluteFill, Audio, Easing, interpolate, Sequence, staticFile, useVideoConfig } from "remotion";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { slide } from "@remotion/transitions/slide";
import { CENAS } from "./cenas";
import { BarraProgresso } from "./componentes/BarraProgresso";
import { aplicarVoz, comPadroes, falaDaCena, framesCenas, ManifestoVozes, Roteiro, validarRoteiro, vozDaCena } from "./roteiro";
import { carregarFontes } from "./tema/carregarFontes";
import { ProvedorEstilo } from "./tema/Estilo";
import { audio, easings, tempos } from "./tema/tokens";

carregarFontes();

const timing = linearTiming({
  durationInFrames: tempos.transicao,
  easing: Easing.bezier(easings.suave[0], easings.suave[1], easings.suave[2], easings.suave[3]),
});

export type PropsVideo = { roteiro: Roteiro; vozes?: ManifestoVozes | null };

/** Música de fundo em loop, baixa, com fade de entrada e saída. */
export const MusicaDeFundo: React.FC<{ nome: string; comVoz: boolean }> = ({ nome, comVoz }) => {
  const { durationInFrames } = useVideoConfig();
  const alvo = comVoz ? audio.volumeMusicaComVoz : audio.volumeMusica;
  return (
    <Audio
      src={staticFile(`musica/${nome}.mp3`)}
      loop
      volume={(f) =>
        alvo *
        interpolate(f, [0, audio.fadeEntrada, durationInFrames - audio.fadeSaida, durationInFrames], [0, 1, 1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      }
    />
  );
};

export const Video: React.FC<PropsVideo> = ({ roteiro, vozes }) => {
  const erros = validarRoteiro(roteiro);
  if (erros.length) {
    throw new Error(`Roteiro fora do padrão animamente:\n- ${erros.join("\n- ")}`);
  }
  const frames = framesCenas(roteiro, vozes);
  const musica = roteiro.musica === false ? null : roteiro.musica ?? audio.musicaPadrao;
  const vozesDasCenas = roteiro.cenas.map((_, i) => vozDaCena(roteiro, i, vozes));
  const temVozTocando = vozesDasCenas.some((v) => v?.arquivo);
  return (
    <ProvedorEstilo formato={roteiro.formato} tema={roteiro.tema}>
      <AbsoluteFill>
        <TransitionSeries>
          {roteiro.cenas.map((bruta, i) => {
            const voz = vozesDasCenas[i];
            const cena = aplicarVoz(comPadroes(bruta), voz);
            const Cena = CENAS[cena.tipo];
            const f = falaDaCena(cena);
            return (
              <React.Fragment key={i}>
                {i > 0 && <TransitionSeries.Transition presentation={slide({ direction: "from-right" })} timing={timing} />}
                <TransitionSeries.Sequence durationInFrames={frames[i]}>
                  <Cena cena={cena} roteiro={roteiro} duracao={frames[i]} indice={i} />
                  {voz?.arquivo && f && (
                    <Sequence from={f.em} layout="none">
                      <Audio src={staticFile(voz.arquivo)} />
                    </Sequence>
                  )}
                </TransitionSeries.Sequence>
              </React.Fragment>
            );
          })}
        </TransitionSeries>
        <BarraProgresso />
        {musica && <MusicaDeFundo nome={musica} comVoz={temVozTocando} />}
      </AbsoluteFill>
    </ProvedorEstilo>
  );
};
