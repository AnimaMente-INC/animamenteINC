/**
 * NEURO — mascote e narrador. É o próprio símbolo da marca ganhando vida:
 * silhueta oficial do cérebro (círculos + caule) em Coral com borda de adesivo Névoa,
 * mini A+M com ramos de neurônio na "testa", rosto no centro, braços-neurônio e mãos-nó.
 * A boca só aparece quando fala ou quando a expressão pede. Flutua 10px a cada 3s.
 */
import React from "react";
import { useCurrentFrame } from "remotion";
import { bocaAberta, flutuar, piscar, respirar } from "../animacao";
import { cores } from "../tema/tokens";
import { Braco, LinhasMovimento, Neuronio } from "./partes/Bracos";
import { LetrasAM, NeuroniosCaule, SilhuetaCerebro } from "./partes/Cerebro";
import { espelhar, Estado, misturarPonto } from "./partes/estado";
import { Rosto } from "./partes/Rosto";
import { Olhar, Ponto, Pose } from "./tipos";

export const VIEWBOX_NEURO = { x: -60, y: -10, w: 520, h: 360 };
const SEMENTE = 11;
const ESCALA = 2; // unidades do logo → viewBox do Neuro
const BORDA = 2.4; // em unidades do logo (≈ borda dos humanos)

const OMBROS: [Ponto, Ponto] = [
  { x: 64, y: 226 },
  { x: 336, y: 226 },
];

const maosPorPose = (pose: Pose, frame: number): [Ponto, Ponto] => {
  switch (pose) {
    case "apontando":
      return [{ x: 18, y: 300 }, { x: 440, y: 196 }];
    case "acenando":
      return [{ x: 18, y: 300 }, { x: 392 + Math.sin(frame / 3.2) * 16, y: 70 }];
    case "pensando":
      return [{ x: 18, y: 300 }, { x: 246, y: 262 }];
    case "comemorando": {
      const pulo = -Math.abs(Math.sin(frame / 5)) * 12;
      return [{ x: 4, y: 60 + pulo }, { x: 396, y: 60 + pulo }];
    }
    default:
      return [{ x: 14, y: 296 }, { x: 386, y: 296 }];
  }
};

const maos = (pose: Pose, olhando: Olhar, frame: number): [Ponto, Ponto] => {
  const [e, d] = maosPorPose(pose, frame);
  return olhando === "esquerda" ? [espelhar(d, 400), espelhar(e, 400)] : [e, d];
};

export const Neuro: React.FC<{ estado: Estado; falando: boolean; altura: number }> = ({ estado, falando, altura }) => {
  const frame = useCurrentFrame();
  const vb = VIEWBOX_NEURO;
  const largura = (altura * vb.w) / vb.h;
  const dy = flutuar(frame, SEMENTE * 5);
  const esc = respirar(frame, SEMENTE * 17);
  const piscada = piscar(frame, SEMENTE);
  const boca = falando && bocaAberta(frame);

  const [eA, dA] = maos(estado.poseAnterior, estado.olhando, frame);
  const [eN, dN] = maos(estado.pose, estado.olhando, frame);
  const maoE = misturarPonto(eA, eN, estado.tPose);
  const maoD = misturarPonto(dA, dN, estado.tPose);

  const rosto = (exp: Estado["expressao"], opac: number) => (
    <g opacity={opac}>
      <Rosto
        expressao={exp}
        olhos={[
          { x: 84, y: 99 },
          { x: 116, y: 99 },
        ]}
        boca={{ x: 100, y: 117 }}
        raioOlho={6}
        larguraBoca={13}
        escala={0.55}
        piscada={piscada}
        falando={boca}
        olhando={estado.olhando}
        mostrarBocaFechada={exp !== "neutro"}
        bochechas={cores.nevoa}
      />
    </g>
  );

  const comemorando = estado.pose === "comemorando" && estado.tPose > 0.9;
  const acenando = estado.pose === "acenando" && estado.tPose > 0.9;

  return (
    <svg width={largura} height={altura} viewBox={`${vb.x} ${vb.y} ${vb.w} ${vb.h}`} style={{ overflow: "visible" }}>
      <g transform={`translate(0 ${dy + 6})`}>
        {/* braços-neurônio saem de trás do cérebro */}
        <Braco ombro={OMBROS[0]} mao={maoE} corMao={cores.coral} parte="linha" />
        <Braco ombro={OMBROS[1]} mao={maoD} corMao={cores.coral} parte="linha" />
        <g transform={`translate(200 330) scale(1 ${esc}) translate(-200 -330) scale(${ESCALA})`}>
          <SilhuetaCerebro cor={cores.nevoa} borda={BORDA} />
          <SilhuetaCerebro cor={cores.coral} />
          <NeuroniosCaule soCaule />
          {/* mini A+M na testa */}
          <g transform="translate(100 52) scale(0.4) translate(-102 -91)">
            <LetrasAM />
          </g>
          {/* neurônios nas laterais */}
          <Neuronio c={{ x: 40, y: 104 }} ramos={[[28, 92], [30, 120], [48, 124]]} espessura={1.8} raio={2.6} opacidade={0.75} />
          <Neuronio c={{ x: 160, y: 104 }} ramos={[[172, 92], [170, 120], [152, 124]]} espessura={1.8} raio={2.6} opacidade={0.75} />
          {estado.tExpressao < 1 && rosto(estado.expressaoAnterior, 1 - estado.tExpressao)}
          {rosto(estado.expressao, estado.tExpressao)}
        </g>
        <Braco ombro={OMBROS[0]} mao={maoE} corMao={cores.coral} parte="mao" raioMao={20} />
        <Braco ombro={OMBROS[1]} mao={maoD} corMao={cores.coral} parte="mao" raioMao={20} />
        {comemorando && (
          <>
            <LinhasMovimento c={maoE} lado={-1} />
            <LinhasMovimento c={maoD} lado={1} />
          </>
        )}
        {acenando && <LinhasMovimento c={estado.olhando === "esquerda" ? maoE : maoD} lado={estado.olhando === "esquerda" ? -1 : 1} opacidade={0.9} />}
      </g>
    </svg>
  );
};
