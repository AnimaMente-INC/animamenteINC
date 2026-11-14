/**
 * NEURO — o mascote e narrador, em COLAGEM DE PAPEL.
 * O cérebro do símbolo oficial (os 10 círculos + caule) recortado em papel Coral aquarelado,
 * com um retalho em meio-tom de revista, dobrinhas de lápis, o A+M em tiras de papel Névoa
 * com ramos de neurônio a lápis e nós de papel, gravatinha-borboleta Amarelo de apresentador,
 * braços-neurônio de tira de papel com mãos-nó e a boca "South Park" (o queixo desce ao falar).
 * Personalidade: o anfitrião animado, olhos grandes e sobrancelhas sempre pra cima.
 */
import React from "react";
import { cores } from "../../tema/tokens";
import { CIRCULOS_CEREBRO } from "../partes/Cerebro";
import { Pose } from "../tipos";
import { elipse, Margem, Peca, Pt, Rabisco, recorte } from "./papel";
import { EstadoBusto, Mandibula, Olho, Sobrancelha } from "./rosto";

const C = cores.coral;
const N = cores.nevoa;

// ─── silhueta do cérebro: contorno da união dos círculos oficiais (escala 2,5) ──────
const S = 2.5;
const tx = (x: number) => 300 + (x - 100) * S;
const ty = (y: number) => 268 + (y - 88) * S;
const CIRC = CIRCULOS_CEREBRO.map(([cx, cy, r]) => [tx(cx), ty(cy), r * S] as const);
const dentro = (x: number, y: number) => CIRC.some(([cx, cy, r]) => (x - cx) ** 2 + (y - cy) ** 2 <= r * r);
const contornoCerebro = (): Pt[] => {
  const pts: Pt[] = [];
  const centro: Pt = [300, 262];
  for (let i = 0; i < 64; i++) {
    const a = (i / 64) * Math.PI * 2;
    let r = 260;
    while (r > 0 && !dentro(centro[0] + Math.cos(a) * r, centro[1] + Math.sin(a) * r)) r -= 2;
    pts.push([centro[0] + Math.cos(a) * r, centro[1] + Math.sin(a) * r]);
  }
  return pts;
};
const CEREBRO = recorte(contornoCerebro(), 201, 3, 30);
const CAULE = recorte([[tx(92), ty(132)], [tx(111), ty(128)], [tx(117), ty(150)], [tx(114), ty(163)], [tx(104), ty(165)], [tx(97), ty(150)]], 202, 2.5, 24);

// ─── boca South Park ───────────────────────────────────────────────────────────
const QUEIXO = recorte([[250, 322], [350, 322], [346, 352], [300, 368], [254, 352]], 203, 2, 24);
const BOCA = recorte([[254, 324], [346, 324], [342, 354], [300, 364], [258, 354]], 204, 1.5, 24);

/** Tira de papel entre dois pontos (letras A e M, braços). */
const tira = (a: Pt, b: Pt, w: number, semente: number) => {
  const ang = Math.atan2(b[1] - a[1], b[0] - a[0]) + Math.PI / 2;
  const ox = (Math.cos(ang) * w) / 2;
  const oy = (Math.sin(ang) * w) / 2;
  return recorte(
    [
      [a[0] + ox, a[1] + oy],
      [b[0] + ox, b[1] + oy],
      [b[0] - ox, b[1] - oy],
      [a[0] - ox, a[1] - oy],
    ],
    semente,
    1.4,
    30,
  );
};

const LETRAS: [Pt, Pt][] = [
  // A
  [[254, 204], [276, 140]],
  [[276, 140], [298, 204]],
  [[263, 182], [290, 182]],
  // M
  [[306, 204], [310, 140]],
  [[310, 140], [328, 178]],
  [[328, 178], [346, 140]],
  [[346, 140], [350, 204]],
];
const PONTAS: Pt[] = [[254, 206], [298, 206], [306, 206], [350, 206]];
const RAMOS: Pt[][] = [
  [[276, 140], [266, 112], [252, 102]],
  [[266, 112], [282, 96]],
  [[346, 140], [362, 112], [378, 104]],
  [[362, 112], [352, 94]],
  [[254, 206], [228, 218], [210, 208]],
  [[228, 218], [222, 240]],
  [[350, 206], [376, 218], [394, 208]],
  [[376, 218], [382, 240]],
  [[166, 268], [144, 256]],
  [[166, 268], [150, 290]],
  [[434, 268], [456, 256]],
  [[434, 268], [450, 290]],
];
const NOS: Pt[] = [[252, 102], [282, 96], [378, 104], [352, 94], [210, 208], [222, 240], [394, 208], [382, 240], [166, 268], [144, 256], [150, 290], [434, 268], [456, 256], [450, 290], [266, 112], [362, 112], [228, 218], [376, 218]];

// ─── braços-neurônio ───────────────────────────────────────────────────────────
const OMBROS: [Pt, Pt] = [
  [128, 300],
  [472, 300],
];
const maos = (pose: Pose, passo: number): [Pt, Pt] => {
  switch (pose) {
    case "apontando":
      return [[86, 470], [586, 244]];
    case "acenando":
      return [[86, 470], [524 + (passo % 2 ? 16 : -12), 112]];
    case "pensando":
      return [[86, 470], [398, 352]];
    case "comemorando": {
      const pulo = passo % 2 ? -14 : 0;
      return [[78, 92 + pulo], [522, 92 + pulo]];
    }
    default:
      return [[86, 470], [514, 470]];
  }
};
const cotovelo = (o: Pt, m: Pt): Pt => {
  const mx = (o[0] + m[0]) / 2;
  const my = (o[1] + m[1]) / 2;
  const fora = o[0] < 300 ? -1 : 1;
  return [mx + fora * 34, my + 10];
};

export const NeuroColagem: React.FC<{ e: EstadoBusto }> = ({ e }) => {
  const id = e.id;
  const espelho = e.olhando === "esquerda";
  const [mE, mD] = maos(e.pose, e.passo);
  const mao = (o: Pt, m: Pt, lado: number) => {
    const el = cotovelo(o, m);
    return { o, m, el, lado };
  };
  // olhando para a esquerda: espelha o braço que gesticula
  const bracos = espelho
    ? [mao(OMBROS[0], [600 - mD[0], mD[1]], 0), mao(OMBROS[1], [600 - mE[0], mE[1]], 1)]
    : [mao(OMBROS[0], mE, 0), mao(OMBROS[1], mD, 1)];

  return (
    <g>
      {/* braços (tiras de papel atrás do cérebro) */}
      {bracos.map(({ o, m, el, lado }) => (
        <g key={lado}>
          <Peca id={id} d={tira(o, el, 26, 210 + lado)} cor={N} textura="manchada" margem={4} />
          <Peca id={id} d={tira(el, m, 24, 212 + lado)} cor={N} textura="manchada" margem={4} />
        </g>
      ))}

      {/* caule + gravata-borboleta de apresentador */}
      <Peca id={id} d={CAULE} cor={C} textura="aquarela" margem />
      {[[[312, 390], [318, 420]], [[316, 404], [304, 408]], [[318, 416], [330, 420]]].map((l, i) => (
        <Rabisco key={i} pts={l as Pt[]} cor={N} largura={2.6} opacidade={0.8} semente={i + 80} />
      ))}

      {/* cérebro */}
      <Mandibula e={e} queda={38} pivo={[300, 324]}>
        <Margem d={QUEIXO} />
      </Mandibula>
      <Peca id={id} d={CEREBRO} cor={C} textura="aquarela" margem />
      {/* retalho em meio-tom de revista + dobrinhas de lápis */}
      <Peca id={id} d={recorte(elipse(186, 182, 66, 50, 16), 205, 3)} cor={C} textura="respingos" meiotom="claro" />
      <Peca id={id} d={recorte(elipse(426, 330, 52, 38, 14), 206, 3)} cor={C} textura="respingos" meiotom="claro" />
      {[
        [[150, 210], [172, 196], [186, 214], [206, 200]],
        [[392, 168], [414, 182], [432, 166], [450, 184]],
        [[160, 340], [182, 352], [198, 336]],
        [[200, 120], [222, 110], [236, 124]],
      ].map((l, i) => (
        <Rabisco key={i} pts={l as Pt[]} cor={cores.tinta} largura={3} opacidade={0.25} semente={i + 90} />
      ))}

      {/* A+M em tiras de papel, com ramos de neurônio a lápis e nós de papel */}
      {RAMOS.map((l, i) => (
        <Rabisco key={i} pts={l} cor={N} largura={3.5} opacidade={0.85} semente={i + 100} />
      ))}
      {NOS.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i < 14 ? 5.5 : 4} fill={N} />
      ))}
      {LETRAS.map(([a, b], i) => (
        <Peca key={i} id={id} d={tira(a, b, 15, 220 + i)} cor={N} textura="lisa" />
      ))}
      {PONTAS.map(([x, y], i) => (
        <Peca key={i} id={id} d={recorte(elipse(x, y, 10, 10, 9), 230 + i, 1)} cor={N} textura="lisa" />
      ))}

      {/* bochechas em meio-tom */}
      <Peca id={id} d={recorte(elipse(206, 304, 28, 18, 10), 240, 2)} cor={cores.lilas} meiotom="escuro" opacidade={0.75} sombra={false} />
      <Peca id={id} d={recorte(elipse(394, 304, 28, 18, 10), 241, 2)} cor={cores.lilas} meiotom="escuro" opacidade={0.75} sombra={false} />

      {/* boca South Park */}
      <Peca id={id} d={BOCA} cor={cores.tinta} sombra={false} />
      <Peca id={id} d={recorte(elipse(300, 354, 26, 10, 10), 242, 1.4)} cor={cores.elefanteOrelha} sombra={false} />
      <Mandibula e={e} queda={38} pivo={[300, 324]}>
        <Peca id={id} d={QUEIXO} cor={C} textura="aquarela" />
        {e.abertura < 0.1 && <Rabisco pts={[[262, 324], [282, 334], [300, 336], [318, 334], [338, 324]]} largura={3.5} opacidade={0.85} />}
      </Mandibula>

      {/* olhos grandes + sobrancelhas sempre animadas */}
      <Olho e={e} cx={252} cy={262} rx={27} ry={30} corPalpebra={C} pupilaR={16} palpebraExtra={-0.1} semente={243} lado={0} />
      <Olho e={e} cx={348} cy={262} rx={27} ry={30} corPalpebra={C} pupilaR={16} palpebraExtra={-0.1} semente={244} lado={1} />
      <Sobrancelha e={e} cx={250} cy={218} largura={46} altura={12} cor={cores.tinta} lado={0} extraSobe={-6} extraAng={-4} semente={245} />
      <Sobrancelha e={e} cx={350} cy={218} largura={46} altura={12} cor={cores.tinta} lado={1} extraSobe={-6} extraAng={4} semente={246} />

      {/* gravata-borboleta (na frente do caule) */}
      <Peca id={id} d={recorte([[300, 400], [262, 380], [258, 422]], 247, 2, 30)} cor={cores.amarelo} textura="aquarela" margem={4} />
      <Peca id={id} d={recorte([[300, 400], [338, 380], [342, 422]], 248, 2, 30)} cor={cores.amarelo} textura="aquarela" margem={4} />
      <Peca id={id} d={recorte(elipse(300, 401, 11, 11, 9), 249, 1)} cor={cores.amarelo} textura="manchada" />

      {/* mãos-nó (na frente) */}
      {bracos.map(({ el, m, lado }) => {
        const ang = Math.atan2(m[1] - el[1], m[0] - el[0]);
        const dedo = (d: number): Pt => [m[0] + Math.cos(ang + d) * 24, m[1] + Math.sin(ang + d) * 24];
        return (
          <g key={lado}>
            {[-0.6, 0, 0.6].map((d, i) => (
              <Peca key={i} id={id} d={recorte(elipse(dedo(d)[0], dedo(d)[1], 10, 10, 8), 250 + lado * 5 + i, 1)} cor={C} textura="aquarela" margem={4} />
            ))}
            <Peca id={id} d={recorte(elipse(m[0], m[1], 25, 25, 12), 260 + lado, 2)} cor={C} textura="aquarela" margem={5} />
          </g>
        );
      })}
    </g>
  );
};
