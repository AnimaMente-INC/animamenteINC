/**
 * LIA — a GATA curiosa (e um pouco desconfiada).
 * Gata preta de papel aquarelado, focinho e peito brancos, olhos amarelos de gato com pupila em fenda,
 * nariz coral, bigodes de lápis, boina Coral com um broche-neurônio Amarelo e blusa listrada (marinière).
 * Personalidade: sempre com uma sobrancelha levantada e as pálpebras meio baixas: "hum... será?".
 */
import React from "react";
import { cores } from "../../tema/tokens";
import { elipse, Margem, ombros, Peca, Rabisco, recorte, ret } from "./papel";
import { EstadoBusto, Mandibula, Olho, Sobrancelha } from "./rosto";

const P = cores.gataPelo;
const B = cores.nevoa;

const CABECA = recorte(elipse(300, 300, 150, 128, 26), 31);
const ORELHA_E = recorte([[160, 215], [150, 66], [258, 160]], 32, 3, 30);
const ORELHA_D = recorte([[342, 160], [450, 66], [440, 215]], 33, 3, 30);
const QUEIXO = recorte([[262, 358], [338, 358], [334, 392], [300, 404], [266, 392]], 34, 2, 24);
const BOCA = recorte([[264, 360], [336, 360], [331, 393], [300, 400], [269, 393]], 35, 1.5, 24);
const BLUSA = ombros(1, 466);

export const Gata: React.FC<{ e: EstadoBusto }> = ({ e }) => {
  const id = e.id;
  return (
    <g>
      {/* orelhas (atrás da cabeça) */}
      <Peca id={id} d={ORELHA_E} cor={P} textura="aquarela" margem />
      <Peca id={id} d={ORELHA_D} cor={P} textura="aquarela" margem />
      <Peca id={id} d={recorte([[178, 190], [168, 100], [236, 162]], 36, 2, 30)} cor={cores.coral} textura="respingos" />
      <Peca id={id} d={recorte([[364, 162], [432, 100], [422, 190]], 37, 2, 30)} cor={cores.coral} textura="respingos" />

      {/* pescoço + peito branco */}
      <Peca id={id} d={recorte(ret(240, 400, 120, 120), 38)} cor={P} textura="aquarela" />
      {/* blusa listrada */}
      <Peca id={id} d={recorte(BLUSA, 39)} cor={B} textura="manchada" margem />
      <clipPath id={`${id}-blusa`}>
        <path d={recorte(BLUSA, 39)} />
      </clipPath>
      <g clipPath={`url(#${id}-blusa)`}>
        {[528, 572, 616, 660].map((y, i) => (
          <Peca key={y} id={id} d={recorte(ret(60, y, 480, 20), 40 + i, 2.5, 60)} cor={cores.tinta} textura="lisa" />
        ))}
      </g>
      <Peca id={id} d={recorte([[244, 466], [356, 466], [300, 540]], 45, 2.5, 30)} cor={B} textura="manchada" />

      {/* cabeça (margem do queixo por trás, para descer junto) */}
      <Mandibula e={e} queda={40} pivo={[300, 360]}>
        <Margem d={QUEIXO} />
      </Mandibula>
      <Peca id={id} d={CABECA} cor={P} textura="aquarela" margem />
      {/* pelos de lápis */}
      <Rabisco pts={[[180, 250], [196, 262], [184, 276]]} cor={B} opacidade={0.4} semente={2} />
      <Rabisco pts={[[420, 250], [404, 262], [416, 276]]} cor={B} opacidade={0.4} semente={3} />
      {/* listra branca na testa + focinho */}
      <Peca id={id} d={recorte([[286, 304], [300, 200], [314, 304]], 46, 2, 30)} cor={B} textura="manchada" />
      <Peca id={id} d={recorte(elipse(268, 338, 42, 30, 14), 47, 2.5)} cor={B} textura="manchada" />
      <Peca id={id} d={recorte(elipse(332, 338, 42, 30, 14), 48, 2.5)} cor={B} textura="manchada" />
      {/* bochechas em meio-tom coral */}
      <Peca id={id} d={recorte(elipse(206, 336, 24, 18, 10), 49, 2)} cor={cores.coral} meiotom="claro" opacidade={0.75} sombra={false} />
      <Peca id={id} d={recorte(elipse(394, 336, 24, 18, 10), 50, 2)} cor={cores.coral} meiotom="claro" opacidade={0.75} sombra={false} />

      {/* boca South Park: fundo escuro + língua, queixo branco que desce */}
      <Peca id={id} d={BOCA} cor={cores.tinta} sombra={false} />
      <Peca id={id} d={recorte(elipse(300, 392, 22, 10, 10), 51, 1.5)} cor={cores.coral} sombra={false} />
      <Mandibula e={e} queda={40} pivo={[300, 360]}>
        <Peca id={id} d={QUEIXO} cor={B} textura="manchada" />
        {e.abertura < 0.1 && <Rabisco pts={[[284, 362], [292, 368], [300, 364], [308, 368], [316, 362]]} largura={3} opacidade={0.8} />}
      </Mandibula>

      {/* nariz + bigodes */}
      <Peca id={id} d={recorte([[286, 322], [314, 322], [300, 340]], 52, 1.5, 30)} cor={cores.coral} />
      {[
        [[232, 344], [160, 330]],
        [[232, 356], [156, 360]],
        [[368, 344], [440, 330]],
        [[368, 356], [444, 360]],
      ].map((l, i) => (
        <Rabisco key={i} pts={l as [number, number][]} cor={B} largura={3} opacidade={0.85} semente={i + 5} />
      ))}

      {/* olhos de gato + "sobrancelhas" de bigode (a direita sempre meio levantada) */}
      <Olho e={e} cx={245} cy={276} rx={36} ry={31} corFundo={cores.amarelo} corPalpebra={P} pupilaR={22} fenda palpebraExtra={0.2} semente={53} lado={0} />
      <Olho e={e} cx={355} cy={276} rx={36} ry={31} corFundo={cores.amarelo} corPalpebra={P} pupilaR={22} fenda palpebraExtra={0.12} semente={54} lado={1} />
      <Sobrancelha e={e} cx={243} cy={230} largura={54} altura={9} cor={B} lado={0} semente={55} />
      <Sobrancelha e={e} cx={357} cy={224} largura={54} altura={9} cor={B} lado={1} extraSobe={-8} extraAng={9} semente={56} />

      {/* boina coral inclinada + broche-neurônio */}
      <g transform="rotate(-12 260 178)">
        <Peca id={id} d={recorte(elipse(262, 178, 132, 50, 24), 57)} cor={cores.coral} textura="aquarela" margem />
        <Peca id={id} d={recorte(ret(254, 116, 16, 22), 58, 2)} cor={cores.coral} textura="aquarela" />
        <Rabisco pts={[[150, 190], [210, 200], [280, 202], [360, 192]]} cor={cores.tinta} opacidade={0.35} semente={9} />
      </g>
      <g>
        {[[[318, 150], [338, 128]], [[318, 150], [344, 160]], [[318, 150], [304, 128]]].map((l, i) => (
          <Rabisco key={i} pts={l as [number, number][]} cor={cores.amarelo} largura={5} opacidade={1} semente={i + 20} />
        ))}
        <circle cx={318} cy={150} r={9} fill={cores.amarelo} />
        <circle cx={338} cy={128} r={5} fill={cores.amarelo} />
        <circle cx={344} cy={160} r={5} fill={cores.amarelo} />
        <circle cx={304} cy={128} r={5} fill={cores.amarelo} />
      </g>
    </g>
  );
};
