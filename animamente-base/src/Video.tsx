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
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { CENAS } from "./cenas";
import { BarraProgresso } from "./componentes/BarraProgresso";
import { FalaCtx } from "./componentes/Fala";
import { TextoCtx } from "./componentes/TextoAnimado";
import { MapaMental } from "./mapa/MapaMental";
import { NarradorSobreposto, SegmentoNarrador } from "./componentes/FaixaNarrador";
import { AlturaFixaCtx, ContinuaCtx } from "./cenas/LayoutCena";
import { aplicarVoz, comPadroes, epocaDaCena, falaDaCena, framesCenas, inicioDoBloco, ManifestoVozes, mesmoElencoDaAnterior, Roteiro, seg, transicaoDe, validarRoteiro, vozDaCena } from "./roteiro";
import { carregarFontes } from "./tema/carregarFontes";
import { ProvedorEstilo } from "./tema/Estilo";
import { audio, easings, fps, narrador } from "./tema/tokens";

carregarFontes();

const timingDe = (frames: number) =>
  linearTiming({
    durationInFrames: frames,
    easing: Easing.bezier(easings.suave[0], easings.suave[1], easings.suave[2], easings.suave[3]),
  });

export type PropsVideo = { roteiro: Roteiro; vozes?: ManifestoVozes | null };

/** Música de fundo em loop, baixa, com fade de entrada e saída. */
export const MusicaDeFundo: React.FC<{ nome: string; comVoz: boolean; volume?: number; inicio?: number }> = ({ nome, comVoz, volume = 1, inicio = 0 }) => {
  const { durationInFrames } = useVideoConfig();
  const alvo = (comVoz ? audio.volumeMusicaComVoz : audio.volumeMusica) * volume;
  return (
    <Audio
      src={staticFile(`musica/${nome}.mp3`)}
      loop
      startFrom={Math.round(inicio * fps)}
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
  // MAPA MENTAL: um mapa só, em câmera contínua (sem cenas que trocam)
  if (roteiro.modelo === "mapa") {
    return (
      <ProvedorEstilo formato={roteiro.formato} tema={roteiro.tema}>
        <TextoCtx.Provider value={roteiro.estiloTexto ?? "palavra"}>
          <AbsoluteFill>
            <MapaMental roteiro={roteiro} vozes={vozes} />
            <BarraProgresso />
            {musica && <MusicaDeFundo nome={musica} comVoz={temVozTocando} volume={roteiro.volumeMusica} inicio={roteiro.musicaInicio} />}
          </AbsoluteFill>
        </TextoCtx.Provider>
      </ProvedorEstilo>
    );
  }
  const timing = timingDe(transicaoDe(roteiro));
  const rapido = roteiro.ritmo === "rapido";
  // modo história: o Neuro narra de um cantinho no topo (só no vertical, que tem espaço em cima)
  const comNarrador = roteiro.narradorNoCanto === true && roteiro.formato === "vertical";
  const T = transicaoDe(roteiro);
  // a faixa do Neuro é desenhada uma vez, por cima das cenas, e só some nas cenas em que o Neuro já aparece
  const segmentos: SegmentoNarrador[] = [];
  if (comNarrador) {
    let inicio = 0;
    roteiro.cenas.forEach((bruta, i) => {
      const cena = comPadroes(bruta);
      const fim = i < frames.length - 1 ? inicio + frames[i] - T : inicio + frames[i];
      const neuroEmCena = !!cena.personagens?.some((p) => p.id === "neuro");
      if (cena.tipo !== "intro" && cena.tipo !== "outro" && !neuroEmCena) {
        const f = falaDaCena(cena);
        const voz = vozesDasCenas[i];
        const neuroNarra = f?.tipo === "narracao" && f.quem === "neuro" && voz;
        const anterior = segmentos[segmentos.length - 1];
        segmentos.push({
          de: inicio,
          duracao: fim - inicio,
          epoca: cena.tipo === "capitulo" ? undefined : epocaDaCena(roteiro, i),
          texto: neuroNarra ? f.texto : undefined,
          narraEm: neuroNarra ? f.em : undefined,
          duracaoFala: neuroNarra ? seg(voz.duracao) : undefined,
          entrando: !anterior || anterior.de + anterior.duracao !== inicio,
        });
      }
      inicio = fim;
    });
  }
  return (
    <ProvedorEstilo formato={roteiro.formato} tema={roteiro.tema} reservaTopo={comNarrador ? narrador.faixa : 0}>
      <AbsoluteFill>
        <AlturaFixaCtx.Provider value={roteiro.elencoContinuo && roteiro.formato === "vertical" ? narrador.alturaElenco : undefined}>
        <TransitionSeries>
          {roteiro.cenas.map((bruta, i) => {
            const voz = vozesDasCenas[i];
            const cena = aplicarVoz(comPadroes(bruta), voz);
            const Cena = CENAS[cena.tipo];
            const f = falaDaCena(cena);
            // no ritmo rápido, cada capítulo novo entra de baixo para cima (virada de página)
            const direcao = rapido && cena.tipo === "capitulo" ? "from-bottom" : "from-right";
            // mesmo elenco da cena anterior: sem deslize, só um fade — os personagens ficam parados e o conteúdo troca
            // (duas cenas de chat seguidas também: as mensagens antigas ficam paradas e só a nova chega)
            const continua = mesmoElencoDaAnterior(roteiro, i) || (i > 0 && cena.tipo === "chat" && roteiro.cenas[i - 1].tipo === "chat");
            return (
              <React.Fragment key={i}>
                {i > 0 && <TransitionSeries.Transition presentation={continua ? fade() : slide({ direction: direcao })} timing={timing} />}
                <TransitionSeries.Sequence durationInFrames={frames[i]}>
                  <ContinuaCtx.Provider value={continua}>
                    <FalaCtx.Provider value={cena.estiloFala ?? roteiro.estiloFala ?? "balao"}>
                      <TextoCtx.Provider value={cena.estiloTexto ?? roteiro.estiloTexto ?? "palavra"}>
                        <Cena cena={cena} roteiro={roteiro} duracao={frames[i]} indice={i > 0 && cena.tipo === "chat" && roteiro.cenas[i - 1].tipo === "chat" ? roteiro.cenas.findIndex((c, k) => c.tipo === "chat" && roteiro.cenas.slice(k, i).every((x) => x.tipo === "chat")) : inicioDoBloco(roteiro, i)} />
                      </TextoCtx.Provider>
                    </FalaCtx.Provider>
                  </ContinuaCtx.Provider>
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
        </AlturaFixaCtx.Provider>
        {comNarrador && <NarradorSobreposto segmentos={segmentos} />}
        <BarraProgresso />
        {musica && <MusicaDeFundo nome={musica} comVoz={temVozTocando} volume={roteiro.volumeMusica} inicio={roteiro.musicaInicio} />}
      </AbsoluteFill>
    </ProvedorEstilo>
  );
};
