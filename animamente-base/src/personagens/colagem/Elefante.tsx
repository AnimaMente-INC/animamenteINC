/**
 * RAFA — o ELEFANTE coach do cérebro.
 * Pele cinza-lavanda aquarelada, orelhas enormes (rosadas por dentro, em meio-tom de revista),
 * tromba de papel com dobrinhas de lápis curvada pra cima (pose de campeão), presas pequenas,
 * faixa de cabeça Amarelo, jaqueta esportiva Ardósia com listras Amarelo e zíper, apito no cordão Coral.
 * Personalidade: confiante, sorrisão, sobrancelhas grossas: "bora treinar o cérebro!".
 */
import React from "react";
import { cores } from "../../tema/tokens";
import { elipse, Margem, ombros, Peca, Pt, Rabisco, recorte, tubo } from "./papel";
import { EstadoBusto, Mandibula, Olho, Sobrancelha } from "./rosto";

const P = cores.elefantePele;

const CABECA = recorte(elipse(300, 282, 128, 122, 26), 111);
const ORELHA_E = recorte(elipse(160, 300, 118, 150, 24, Math.PI * 0.35, Math.PI * 1.75).concat([[250, 250]] as Pt[]), 112);
const ORELHA_D = recorte(elipse(440, 300, 118, 150, 24, -Math.PI * 0.75, Math.PI * 0.65).concat([[350, 250]] as Pt[]), 113);
const QUEIXO = recorte([[226, 386], [374, 386], [362, 414], [300, 428], [238, 414]], 114, 2, 24);
const BOCA = recorte([[230, 388], [370, 388], [360, 414], [300, 424], [240, 414]], 115, 1.5, 24);
const TROMBA_C: Pt[] = [
  [300, 296],
  [297, 334],
  [297, 372],
  [302, 406],
  [318, 434],
  [344, 446],
  [368, 438],
  [380, 414],
  [374, 392],
];
const TROMBA = recorte(tubo(TROMBA_C, 64, 26), 116, 2.5, 26);
const JAQUETA = ombros(1.12, 480);

export const Elefante: React.FC<{ e: EstadoBusto }> = ({ e }) => {
  const id = e.id;
  return (
    <g>
      {/* orelhas enormes */}
      <Peca id={id} d={ORELHA_E} cor={P} textura="aquarela" margem />
      <Peca id={id} d={ORELHA_D} cor={P} textura="aquarela" margem />
      <Peca id={id} d={recorte(elipse(160, 304, 78, 108, 20), 117, 3)} cor={cores.elefanteOrelha} textura="aquarela" meiotom="claro" />
      <Peca id={id} d={recorte(elipse(440, 304, 78, 108, 20), 118, 3)} cor={cores.elefanteOrelha} textura="aquarela" meiotom="claro" />

      {/* jaqueta esportiva */}
      <Peca id={id} d={recorte([[244, 400], [356, 400], [360, 500], [240, 500]], 119)} cor={P} textura="aquarela" />
      <Peca id={id} d={recorte(JAQUETA, 120)} cor={cores.ardosia} textura="aquarela" margem />
      {/* listras amarelas nos ombros */}
      <Peca id={id} d={recorte([[86, 600], [100, 548], [200, 494], [214, 508], [116, 562], [104, 610]], 121, 2, 30)} cor={cores.amarelo} />
      <Peca id={id} d={recorte([[514, 600], [500, 548], [400, 494], [386, 508], [484, 562], [496, 610]], 122, 2, 30)} cor={cores.amarelo} />
      {/* gola alta e zíper */}
      <Peca id={id} d={recorte([[220, 470], [300, 492], [300, 540], [210, 512]], 123, 2.5, 30)} cor={cores.ardosia} textura="manchada" />
      <Peca id={id} d={recorte([[380, 470], [300, 492], [300, 540], [390, 512]], 124, 2.5, 30)} cor={cores.ardosia} textura="manchada" />
      <Rabisco pts={[[300, 492], [300, 700]]} cor={cores.nevoa} largura={5} opacidade={0.8} />
      {Array.from({ length: 9 }, (_, i) => 510 + i * 20).map((y) => (
        <Rabisco key={y} pts={[[294, y], [306, y]]} cor={cores.nevoa} largura={2.5} opacidade={0.6} />
      ))}
      <Peca id={id} d={recorte([[292, 540], [308, 540], [310, 572], [290, 572]], 125, 1)} cor={cores.amarelo} />
      {/* apito no cordão coral */}
      <path d="M 240 500 Q 250 580 330 590" stroke={cores.coral} strokeWidth={6} fill="none" strokeLinecap="round" />
      <path d="M 360 500 Q 356 560 334 588" stroke={cores.coral} strokeWidth={6} fill="none" strokeLinecap="round" />
      <Peca id={id} d={recorte([[326, 580], [380, 576], [384, 604], [344, 612], [326, 600]], 126, 2, 24)} cor={cores.amarelo} textura="aquarela" margem={4} />

      {/* cabeça */}
      <Mandibula e={e} queda={34} pivo={[300, 388]}>
        <Margem d={QUEIXO} />
      </Mandibula>
      <Peca id={id} d={CABECA} cor={P} textura="aquarela" margem />
      {/* bochechas em meio-tom */}
      <Peca id={id} d={recorte(elipse(218, 350, 26, 18, 10), 127, 2)} cor={cores.coral} meiotom="claro" opacidade={0.6} sombra={false} />
      <Peca id={id} d={recorte(elipse(382, 350, 26, 18, 10), 128, 2)} cor={cores.coral} meiotom="claro" opacidade={0.6} sombra={false} />

      {/* boca larga (South Park) por trás da tromba */}
      <Peca id={id} d={BOCA} cor={cores.tinta} sombra={false} />
      <Peca id={id} d={recorte(elipse(270, 414, 26, 9, 10), 129, 1.2)} cor={cores.coral} sombra={false} />
      <Mandibula e={e} queda={34} pivo={[300, 388]}>
        <Peca id={id} d={QUEIXO} cor={P} textura="aquarela" />
        {e.abertura < 0.1 && <Rabisco pts={[[232, 386], [262, 398], [300, 402], [338, 398], [368, 386]]} largura={3.5} opacidade={0.75} />}
      </Mandibula>
      {/* presas */}
      <Peca id={id} d={recorte([[244, 384], [258, 384], [236, 420]], 130, 1.2, 30)} cor={cores.nevoa} />
      <Peca id={id} d={recorte([[342, 384], [356, 384], [364, 420]], 131, 1.2, 30)} cor={cores.nevoa} />
      {/* tromba com dobrinhas */}
      <Peca id={id} d={TROMBA} cor={P} textura="aquarela" margem={5} />
      {[[282, 344, 316, 344], [282, 366, 316, 366], [284, 388, 318, 386], [292, 410, 326, 404]].map(([a, b, c, d], i) => (
        <Rabisco key={i} pts={[[a, b], [(a + c) / 2, b + 5], [c, d]]} opacidade={0.4} semente={i + 50} />
      ))}
      <ellipse cx={374} cy={392} rx={7} ry={5} fill={cores.tinta} opacity={0.6} />

      {/* olhos + sobrancelhas grossas e confiantes */}
      <Olho e={e} cx={254} cy={256} rx={21} ry={23} corPalpebra={P} pupilaR={13} palpebraExtra={0.06} semente={132} lado={0} />
      <Olho e={e} cx={346} cy={256} rx={21} ry={23} corPalpebra={P} pupilaR={13} palpebraExtra={0.06} semente={133} lado={1} />
      <Sobrancelha e={e} cx={252} cy={216} largura={54} altura={18} cor={cores.tinta} lado={0} extraAng={8} semente={134} />
      <Sobrancelha e={e} cx={348} cy={216} largura={54} altura={18} cor={cores.tinta} lado={1} extraAng={-8} semente={135} />
      {/* faixa amarela + pontas do nó */}
      <Peca id={id} d={recorte([[174, 196], [300, 150], [426, 196], [424, 222], [300, 178], [176, 222]], 136, 2.5, 30)} cor={cores.amarelo} textura="aquarela" />
      <Peca id={id} d={recorte([[418, 196], [470, 170], [480, 200], [430, 216]], 137, 2, 30)} cor={cores.amarelo} textura="aquarela" margem={5} />
      <Peca id={id} d={recorte([[420, 210], [466, 232], [452, 252], [418, 222]], 138, 2, 30)} cor={cores.amarelo} textura="aquarela" margem={5} />
    </g>
  );
};
