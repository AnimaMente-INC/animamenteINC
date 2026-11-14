/**
 * CONSTRUÇÃO PADRÃO DE PERSONAGEM HUMANO — corpo inteiro no estilo "adesivo" da identidade
 *
 * cabeça grande (chibi) + orelhas + tronco (4 tipos) + pernas + sapatos
 * - A silhueta inteira ganha UMA borda Névoa por fora, como o cérebro do logo.
 *   Por dentro, as partes se separam só pela cor (sem contorno escuro).
 * - Braços são traços-neurônio Névoa que saem de trás da borda; mãos são nós redondos.
 * - Rosto: olhos Tinta com brilho Névoa, sobrancelhas, bochechas coral.
 *
 * Lia, Teo, Caio e Rafa são apenas configurações deste componente. Humanos novos também devem ser.
 */
import React from "react";
import { useCurrentFrame } from "remotion";
import { bocaAberta, piscar, respirar } from "../../animacao";
import { cores, forma } from "../../tema/tokens";
import { Expressao, Olhar, Ponto, Pose } from "../tipos";
import { Braco, LinhasMovimento } from "./Bracos";
import { espelhar, Estado, misturarPonto } from "./estado";
import { Rosto } from "./Rosto";

export const VIEWBOX_HUMANO = { x: -60, y: -20, w: 520, h: 650 };
export const CABECA = { x: 200, y: 150, r: 92 };
const PE = 612; // base dos pés (origem da respiração)
/** Borda de adesivo em unidades do viewBox (≈ forma.borda px num personagem de 700px). */
export const BORDA_HUMANO = 9;

export type TipoTronco = "capsula" | "retangulo" | "redondo" | "atletico";

export type ConfigHumano = {
  corPele: string;
  corCamisa: string;
  corCalca: string;
  corSapato: string;
  tronco: TipoTronco;
  ombros: [Ponto, Ponto];
  semente: number; // ritmo próprio de piscar/respirar
  /** Afastamento das mãos em relação ao centro (1 = padrão; atlético usa mais). */
  abertura?: number;
  espessuraBraco?: number;
  raioMao?: number;
  orelhas?: boolean;
  sobrancelhas?: number;
  /** Partes ATRÁS da cabeça que fazem parte da silhueta (ganham borda). `p` substitui a cor na passada da borda. */
  silhuetaTras?: (p?: string) => React.ReactNode;
  /** Partes NA FRENTE da cabeça que saem da silhueta (ex.: cabelo volumoso, topete) — também ganham borda. */
  silhuetaFrente?: (p?: string) => React.ReactNode;
  /** Desenhado sobre a cabeça, dentro da silhueta (ex.: franja, faixa). */
  cabeloFrente?: React.ReactNode;
  /** Detalhes sobre o corpo (ex.: gravata, logo da camiseta, cordão do capuz). */
  detalhesCorpo?: React.ReactNode;
  /** Acessórios no rosto (ex.: óculos). */
  acessorio?: React.ReactNode;
  olhos?: [Ponto, Ponto];
  boca?: Ponto;
  larguraBoca?: number;
};

/** Posição das mãos [esquerda, direita] em cada pose (olhando para a direita). */
const maosPorPose = (pose: Pose, frame: number, k: number): [Ponto, Ponto] => {
  const abre = (p: Ponto): Ponto => ({ x: 200 + (p.x - 200) * k, y: p.y });
  switch (pose) {
    case "apontando":
      return [abre({ x: 78, y: 420 }), { x: 405, y: 250 }];
    case "acenando":
      return [abre({ x: 78, y: 420 }), { x: 340 + Math.sin(frame / 3.2) * 18, y: 120 }];
    case "pensando":
      return [{ x: 168, y: 390 }, { x: 240, y: 252 }];
    case "comemorando": {
      const pulo = -Math.abs(Math.sin(frame / 5)) * 14;
      return [abre({ x: 56, y: 110 + pulo }), abre({ x: 344, y: 110 + pulo })];
    }
    default:
      return [abre({ x: 78, y: 420 }), abre({ x: 322, y: 420 })];
  }
};

const maos = (pose: Pose, olhando: Olhar, frame: number, k: number): [Ponto, Ponto] => {
  const [e, d] = maosPorPose(pose, frame, k);
  if (olhando === "esquerda") return [espelhar(d, 400), espelhar(e, 400)];
  return [e, d];
};

const formaTronco = (t: TipoTronco, fill: string) => {
  switch (t) {
    case "capsula":
      return <rect x={128} y={226} width={144} height={244} rx={72} fill={fill} />;
    case "retangulo":
      return <rect x={116} y={226} width={168} height={244} rx={46} fill={fill} />;
    case "redondo":
      return <rect x={98} y={226} width={204} height={250} rx={98} fill={fill} />;
    case "atletico":
      return (
        <path
          d="M 134 226 Q 74 230 72 282 Q 76 304 96 316 L 140 462 Q 144 476 158 476 L 242 476 Q 256 476 260 462 L 304 316 Q 324 304 328 282 Q 326 230 266 226 Z"
          fill={fill}
        />
      );
  }
};

const Pernas: React.FC<{ calca: string; sapato: string }> = ({ calca, sapato }) => (
  <g>
    <rect x={152} y={430} width={42} height={168} rx={21} fill={calca} />
    <rect x={206} y={430} width={42} height={168} rx={21} fill={calca} />
    <ellipse cx={164} cy={600} rx={34} ry={17} fill={sapato} />
    <ellipse cx={236} cy={600} rx={34} ry={17} fill={sapato} />
  </g>
);

export const Humano: React.FC<{
  config: ConfigHumano;
  estado: Estado;
  falando: boolean;
  altura: number;
}> = ({ config, estado, falando, altura }) => {
  const frame = useCurrentFrame();
  const vb = VIEWBOX_HUMANO;
  const largura = (altura * vb.w) / vb.h;
  const k = config.abertura ?? 1;

  const [eA, dA] = maos(estado.poseAnterior, estado.olhando, frame, k);
  const [eN, dN] = maos(estado.pose, estado.olhando, frame, k);
  const maoE = misturarPonto(eA, eN, estado.tPose);
  const maoD = misturarPonto(dA, dN, estado.tPose);

  const esc = respirar(frame, config.semente * 17);
  const piscada = piscar(frame, config.semente);
  const boca = falando && bocaAberta(frame);
  const olhos = config.olhos ?? [
    { x: 165, y: 168 },
    { x: 235, y: 168 },
  ];

  const rosto = (exp: Expressao, opac: number) => (
    <g opacity={opac}>
      <Rosto
        expressao={exp}
        olhos={olhos}
        boca={config.boca ?? { x: 200, y: 210 }}
        larguraBoca={config.larguraBoca ?? 28}
        piscada={piscada}
        falando={boca}
        olhando={estado.olhando}
        sobrancelhas={config.sobrancelhas ?? 0}
      />
    </g>
  );

  const comemorando = estado.pose === "comemorando" && estado.tPose > 0.9;
  const acenando = estado.pose === "acenando" && estado.tPose > 0.9;
  const N = cores.nevoa;
  const orelhas = (fill: string) =>
    config.orelhas !== false && (
      <g fill={fill}>
        <circle cx={CABECA.x - CABECA.r + 2} cy={162} r={17} />
        <circle cx={CABECA.x + CABECA.r - 2} cy={162} r={17} />
      </g>
    );
  const bracoProps = { espessura: config.espessuraBraco ?? forma.membro, raioMao: config.raioMao ?? 22, corMao: config.corPele };

  return (
    <svg width={largura} height={altura} viewBox={`${vb.x} ${vb.y} ${vb.w} ${vb.h}`} style={{ overflow: "visible" }}>
      <g transform={`translate(200 ${PE}) scale(1 ${esc}) translate(-200 -${PE})`}>
        {/* 1. braços (saem de trás da borda) */}
        <Braco ombro={config.ombros[0]} mao={maoE} parte="linha" {...bracoProps} />
        <Braco ombro={config.ombros[1]} mao={maoD} parte="linha" {...bracoProps} />
        {/* 2. borda de adesivo da silhueta inteira */}
        <g stroke={N} strokeWidth={BORDA_HUMANO * 2} strokeLinejoin="round">
          <Pernas calca={N} sapato={N} />
          {config.silhuetaTras?.(N)}
          {formaTronco(config.tronco, N)}
          {orelhas(N)}
          <circle cx={CABECA.x} cy={CABECA.y} r={CABECA.r} fill={N} />
          {config.silhuetaFrente?.(N)}
        </g>
        {/* 3. cores chapadas */}
        <Pernas calca={config.corCalca} sapato={config.corSapato} />
        {config.silhuetaTras?.()}
        {formaTronco(config.tronco, config.corCamisa)}
        {config.detalhesCorpo}
        {orelhas(config.corPele)}
        <circle cx={CABECA.x} cy={CABECA.y} r={CABECA.r} fill={config.corPele} />
        {estado.tExpressao < 1 && rosto(estado.expressaoAnterior, 1 - estado.tExpressao)}
        {rosto(estado.expressao, estado.tExpressao)}
        {config.silhuetaFrente?.()}
        {config.cabeloFrente}
        {config.acessorio}
        {/* 4. mãos-nó na frente */}
        <Braco ombro={config.ombros[0]} mao={maoE} parte="mao" {...bracoProps} />
        <Braco ombro={config.ombros[1]} mao={maoD} parte="mao" {...bracoProps} />
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
