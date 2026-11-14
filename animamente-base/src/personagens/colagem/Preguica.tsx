/**
 * TEO — o BICHO-PREGUIÇA professor.
 * Pelo bege desgrenhado (recorte bem tremido, papel com respingos), rosto claro com a "máscara" escura,
 * olhos sonolentos, óculos redondos com nós de neurônio nas hastes, suéter de gola alta Coral canelado
 * e uma pata com garras segurando uma caneca de café fumegante.
 * Personalidade: calmíssimo, pálpebras sempre pesadas, fala devagar: "devagar... e sempre".
 */
import React from "react";
import { cores, forma } from "../../tema/tokens";
import { elipse, Margem, ombros, Peca, Rabisco, recorte, ret } from "./papel";
import { EstadoBusto, Mandibula, Olho, Sobrancelha } from "./rosto";

const P = cores.preguicaPelo;
const R = cores.preguicaRosto;
const M = cores.preguicaMascara;

const CABECA = recorte(elipse(300, 292, 146, 134, 40), 91, 9, 24);
const QUEIXO = recorte([[266, 372], [334, 372], [330, 400], [300, 410], [270, 400]], 92, 2, 24);
const BOCA = recorte([[268, 374], [332, 374], [328, 402], [300, 408], [272, 402]], 93, 1.5, 24);
const SUETER = ombros(1, 478);
const GOLA = recorte([[206, 412], [394, 412], [398, 500], [202, 500]], 94, 3, 30);

export const Preguica: React.FC<{ e: EstadoBusto }> = ({ e }) => {
  const id = e.id;
  // vapor do café sobe "em degraus"
  const v = (e.passo % 6) * 2;
  return (
    <g>
      {/* suéter coral canelado + gola alta */}
      <Peca id={id} d={recorte(SUETER, 95)} cor={cores.coral} textura="aquarela" margem />
      {Array.from({ length: 19 }, (_, i) => 108 + i * 22).map((x, i) => (
        <Rabisco key={x} pts={[[x, 520 + (i % 3) * 6], [x + 4, 700]]} cor={cores.nevoa} largura={2.4} opacidade={0.3} semente={i} />
      ))}
      <Peca id={id} d={GOLA} cor={cores.coral} textura="aquarela" margem />
      {Array.from({ length: 9 }, (_, i) => 218 + i * 21).map((x, i) => (
        <Rabisco key={x} pts={[[x, 418], [x + 2, 496]]} cor={cores.nevoa} largura={2.4} opacidade={0.35} semente={i + 30} />
      ))}

      {/* cabeça desgrenhada */}
      <Mandibula e={e} queda={32} pivo={[300, 374]}>
        <Margem d={QUEIXO} />
      </Mandibula>
      <Peca id={id} d={CABECA} cor={P} textura="aquarela" margem />
      {/* tufo no topo */}
      <Peca id={id} d={recorte([[236, 194], [246, 160], [286, 136], [338, 140], [366, 166], [372, 196], [340, 172], [300, 166], [266, 178]], 96, 3, 30)} cor={P} textura="aquarela" margem />
      {/* pelos desgrenhados de lápis */}
      {[[176, 250, 160, 262], [170, 300, 152, 306], [182, 350, 166, 362], [424, 250, 440, 262], [430, 300, 448, 306], [418, 350, 434, 362], [270, 176, 266, 160], [330, 176, 336, 160]].map(([a, b, c, d], i) => (
        <Rabisco key={i} pts={[[a, b], [c, d]]} cor={cores.preguicaMascara} largura={3} opacidade={0.55} semente={i + 70} />
      ))}
      {/* rosto claro */}
      <Peca id={id} d={recorte(elipse(300, 316, 114, 96, 26), 97, 4)} cor={R} textura="manchada" />
      {/* máscara escura em volta dos olhos */}
      <g transform="rotate(18 240 302)">
        <Peca id={id} d={recorte(elipse(240, 302, 58, 30, 16), 98, 3)} cor={M} textura="aquarela" />
      </g>
      <g transform="rotate(-18 360 302)">
        <Peca id={id} d={recorte(elipse(360, 302, 58, 30, 16), 99, 3)} cor={M} textura="aquarela" />
      </g>

      {/* boca */}
      <Peca id={id} d={BOCA} cor={cores.tinta} sombra={false} />
      <Peca id={id} d={recorte(elipse(300, 398, 18, 8, 8), 100, 1.2)} cor={cores.coral} sombra={false} />
      <Mandibula e={e} queda={32} pivo={[300, 374]}>
        <Peca id={id} d={QUEIXO} cor={R} textura="manchada" />
        {e.abertura < 0.1 && <Rabisco pts={[[280, 374], [292, 381], [308, 381], [320, 374]]} largura={3} opacidade={0.75} />}
      </Mandibula>
      {/* nariz */}
      <Peca id={id} d={recorte(elipse(300, 342, 22, 14, 12), 101, 1.5)} cor={M} />
      <ellipse cx={292} cy={337} rx={6} ry={3} fill={cores.nevoa} opacity={0.6} />

      {/* olhos sonolentos (pálpebras pesadas) */}
      <Olho e={e} cx={248} cy={296} rx={18} ry={18} corPalpebra={M} pupilaR={11} palpebraExtra={0.42} semente={102} lado={0} />
      <Olho e={e} cx={352} cy={296} rx={18} ry={18} corPalpebra={M} pupilaR={11} palpebraExtra={0.42} semente={103} lado={1} />
      <Sobrancelha e={e} cx={246} cy={246} largura={40} altura={9} cor={M} lado={0} extraAng={4} semente={104} />
      <Sobrancelha e={e} cx={354} cy={246} largura={40} altura={9} cor={M} lado={1} extraAng={-4} semente={105} />
      {/* óculos redondos + hastes com nós de neurônio */}
      <g stroke={cores.tinta} strokeWidth={forma.traco} strokeLinecap="round" fill="none">
        <circle cx={248} cy={296} r={36} />
        <circle cx={352} cy={296} r={36} />
        <path d="M 284 292 Q 300 282 316 292" />
        <path d="M 212 290 L 168 278" />
        <path d="M 388 290 L 432 278" />
      </g>
      <circle cx={166} cy={277} r={7} fill={cores.tinta} />
      <circle cx={434} cy={277} r={7} fill={cores.tinta} />

      {/* manga + pata com garras segurando a caneca de café */}
      <Peca id={id} d={recorte([[352, 700], [372, 622], [440, 600], [470, 700]], 106, 3, 30)} cor={cores.coral} textura="aquarela" margem />
      <Peca id={id} d={recorte(ret(392, 552, 96, 96), 107, 2.5)} cor={cores.nevoa} textura="manchada" margem />
      <Peca id={id} d={recorte(ret(392, 576, 96, 14), 108, 1.5)} cor={cores.coral} sombra={false} />
      <path d="M 488 572 Q 520 572 518 600 Q 516 626 488 626" stroke={cores.nevoa} strokeWidth={14} fill="none" strokeLinecap="round" />
      {[0, 1, 2].map((i) => (
        <Rabisco key={i} pts={[[414 + i * 24, 540 - v], [422 + i * 24, 520 - v], [412 + i * 24, 500 - v], [420 + i * 24, 482 - v]]} cor={cores.lavanda} largura={4} opacidade={0.75} semente={i + 40} />
      ))}
      <Peca id={id} d={recorte(elipse(394, 610, 34, 30, 14), 109, 3)} cor={P} textura="aquarela" margem={5} />
      {[0, 1, 2].map((i) => (
        <path key={i} d={`M ${392 + i * 4} ${592 + i * 16} Q ${430} ${586 + i * 18} ${446} ${602 + i * 18}`} stroke={cores.garra} strokeWidth={8} strokeLinecap="round" fill="none" />
      ))}
    </g>
  );
};
