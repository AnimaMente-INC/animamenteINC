/**
 * CAIO — a LONTRA brincalhona.
 * Pelo marrom aquarelado, bochechas claras fofinhas, nariz escuro, bigodes de lápis, dois dentinhos,
 * orelhinhas redondas, chapéu de pescador Amarelo com faixa Lavanda e camisa estampada Coral
 * com folhas Névoa (gola aberta). Personalidade: travesso, um olho sempre meio fechado de quem
 * está aprontando, sorriso de canto: "pera que tem piada nisso!".
 */
import React from "react";
import { cores } from "../../tema/tokens";
import { elipse, Margem, ombros, Peca, Rabisco, recorte, ret } from "./papel";
import { EstadoBusto, Mandibula, Olho, Sobrancelha } from "./rosto";

const P = cores.lontraPelo;
const C = cores.lontraClaro;

const CABECA = recorte(elipse(300, 300, 140, 122, 26), 141);
const QUEIXO = recorte([[260, 366], [340, 366], [334, 396], [300, 408], [266, 396]], 142, 2, 24);
const BOCA = recorte([[262, 368], [338, 368], [332, 398], [300, 406], [268, 398]], 143, 1.5, 24);
const CAMISA = ombros(1.02, 482);

const FOLHAS: [number, number, number][] = [
  [130, 590, -30],
  [190, 650, 20],
  [250, 600, 60],
  [360, 640, -20],
  [430, 580, 35],
  [470, 660, -50],
  [160, 540, 70],
];

export const Lontra: React.FC<{ e: EstadoBusto }> = ({ e }) => {
  const id = e.id;
  return (
    <g>
      {/* orelhinhas */}
      <Peca id={id} d={recorte(elipse(170, 232, 30, 30, 12), 144, 2.5)} cor={P} textura="aquarela" margem />
      <Peca id={id} d={recorte(elipse(430, 232, 30, 30, 12), 145, 2.5)} cor={P} textura="aquarela" margem />
      <Peca id={id} d={recorte(elipse(172, 234, 15, 15, 10), 146, 1.5)} cor={C} />
      <Peca id={id} d={recorte(elipse(428, 234, 15, 15, 10), 147, 1.5)} cor={C} />

      {/* pescoço/peito claro + camisa estampada */}
      <Peca id={id} d={recorte(ret(240, 400, 120, 140), 148)} cor={C} textura="manchada" />
      <Peca id={id} d={recorte(CAMISA, 149)} cor={cores.coral} textura="aquarela" margem />
      <clipPath id={`${id}-camisa`}>
        <path d={recorte(CAMISA, 149)} />
      </clipPath>
      <g clipPath={`url(#${id}-camisa)`}>
        {FOLHAS.map(([x, y, a], i) => (
          <g key={i} transform={`rotate(${a} ${x} ${y})`}>
            <Peca id={id} d={recorte([[x - 34, y], [x - 10, y - 16], [x + 30, y - 6], [x + 36, y], [x + 10, y + 16], [x - 20, y + 10]], 150 + i, 2, 30)} cor={cores.nevoa} opacidade={0.9} />
            <Rabisco pts={[[x - 28, y], [x + 30, y]]} cor={cores.coral} largura={2.5} opacidade={0.8} />
          </g>
        ))}
        {[[220, 560], [400, 610], [300, 680]].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={9} fill={cores.amarelo} />
        ))}
      </g>
      {/* gola aberta */}
      <Peca id={id} d={recorte([[214, 486], [290, 500], [258, 580], [196, 534]], 160, 2.5, 30)} cor={cores.coral} textura="manchada" margem={4} />
      <Peca id={id} d={recorte([[386, 486], [310, 500], [342, 580], [404, 534]], 161, 2.5, 30)} cor={cores.coral} textura="manchada" margem={4} />

      {/* cabeça */}
      <Mandibula e={e} queda={32} pivo={[300, 366]}>
        <Margem d={QUEIXO} />
      </Mandibula>
      <Peca id={id} d={CABECA} cor={P} textura="aquarela" margem />
      {/* bochechas claras fofinhas */}
      <Peca id={id} d={recorte(elipse(254, 342, 62, 44, 18), 162, 3)} cor={C} textura="manchada" />
      <Peca id={id} d={recorte(elipse(346, 342, 62, 44, 18), 163, 3)} cor={C} textura="manchada" />

      {/* boca + dentinhos */}
      <Peca id={id} d={BOCA} cor={cores.tinta} sombra={false} />
      <Peca id={id} d={recorte(ret(287, 368, 12, 16), 164, 1)} cor={cores.nevoa} sombra={false} />
      <Peca id={id} d={recorte(ret(301, 368, 12, 16), 165, 1)} cor={cores.nevoa} sombra={false} />
      <Mandibula e={e} queda={32} pivo={[300, 366]}>
        <Peca id={id} d={QUEIXO} cor={C} textura="manchada" />
        {/* sorriso de canto */}
        {e.abertura < 0.1 && <Rabisco pts={[[268, 368], [290, 374], [314, 372], [334, 360]]} largura={3.5} opacidade={0.8} />}
      </Mandibula>
      {/* nariz + bigodes */}
      <Peca id={id} d={recorte([[272, 314], [328, 314], [320, 334], [300, 342], [280, 334]], 166, 2, 24)} cor={cores.tinta} />
      <ellipse cx={288} cy={320} rx={7} ry={3} fill={cores.nevoa} opacity={0.55} />
      {[
        [[214, 340], [150, 328]],
        [[214, 354], [146, 358]],
        [[386, 340], [450, 328]],
        [[386, 354], [454, 358]],
      ].map((l, i) => (
        <Rabisco key={i} pts={l as [number, number][]} largura={3} opacidade={0.6} semente={i + 60} />
      ))}

      {/* olhos: o esquerdo meio fechado (piscadinha marota) */}
      <Olho e={e} cx={250} cy={272} rx={19} ry={21} corPalpebra={P} pupilaR={13} palpebraExtra={0.38} semente={167} lado={0} />
      <Olho e={e} cx={350} cy={272} rx={19} ry={21} corPalpebra={P} pupilaR={13} palpebraExtra={0} semente={168} lado={1} />
      <Sobrancelha e={e} cx={248} cy={232} largura={44} altura={11} cor={cores.tinta} lado={0} extraSobe={6} extraAng={-6} semente={169} />
      <Sobrancelha e={e} cx={352} cy={226} largura={44} altura={11} cor={cores.tinta} lado={1} extraSobe={-6} extraAng={10} semente={170} />

      {/* chapéu de pescador */}
      <g transform="rotate(-7 300 180)">
        <Peca id={id} d={recorte([[198, 186], [218, 100], [382, 100], [402, 186]], 171)} cor={cores.amarelo} textura="aquarela" margem />
        <Peca id={id} d={recorte(elipse(300, 192, 182, 36, 26), 172)} cor={cores.amarelo} textura="manchada" margem />
        <Peca id={id} d={recorte(ret(205, 154, 190, 22), 173, 2)} cor={cores.lavanda} />
        <Rabisco pts={[[150, 198], [220, 206], [300, 208], [380, 206], [450, 198]]} opacidade={0.3} semente={11} />
      </g>
    </g>
  );
};
