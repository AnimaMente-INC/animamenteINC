/**
 * BENTO — o CACHORRO otimista (e meio desastrado).
 * Caramelo com listra e focinho brancos, sardas em meio-tom, nariz escuro, uma orelha caída
 * e a outra virada pra cima (mostrando o coral de dentro), língua sempre pra fora quando está feliz,
 * capa de chuva Amarelo com gola e botões de pino, coleira Coral com plaquinha-neurônio Lavanda.
 * Personalidade: olhos arregalados, sobrancelhas sempre pra cima, topa tudo: "bora, bora, bora!".
 */
import React from "react";
import { cores } from "../../tema/tokens";
import { elipse, Margem, ombros, Peca, Rabisco, recorte, ret } from "./papel";
import { EstadoBusto, Mandibula, Olho, Sobrancelha } from "./rosto";

const P = cores.cachorroPelo;
const B = cores.nevoa;

const CABECA = recorte(elipse(300, 296, 138, 124, 26), 61);
const QUEIXO = recorte([[254, 370], [346, 370], [338, 400], [300, 412], [262, 400]], 62, 2, 24);
const BOCA = recorte([[258, 372], [342, 372], [334, 402], [300, 410], [266, 402]], 63, 1.5, 24);
const CAPA = ombros(1.04);

export const Cachorro: React.FC<{ e: EstadoBusto }> = ({ e }) => {
  const id = e.id;
  const linguaFora = e.expressao === "feliz" || e.expressao === "empolgado" || e.expressao === "neutro";
  return (
    <g>
      {/* orelha caída (esquerda) — atrás da cabeça */}
      <Peca id={id} d={recorte([[188, 200], [140, 230], [118, 330], [130, 430], [176, 440], [200, 340], [214, 250]], 64)} cor={P} textura="respingos" margem />

      {/* pescoço, coleira e capa de chuva */}
      <Peca id={id} d={recorte(ret(238, 400, 124, 110), 65)} cor={P} textura="aquarela" />
      <Peca id={id} d={recorte(CAPA, 66)} cor={cores.amarelo} textura="aquarela" margem />
      {/* gola da capa (duas abas) */}
      <Peca id={id} d={recorte([[206, 488], [300, 520], [262, 600], [180, 548]], 67, 3, 30)} cor={cores.amarelo} textura="manchada" />
      <Peca id={id} d={recorte([[394, 488], [300, 520], [338, 600], [420, 548]], 68, 3, 30)} cor={cores.amarelo} textura="manchada" />
      <Rabisco pts={[[300, 600], [300, 700]]} cor={cores.tinta} opacidade={0.35} semente={4} />
      {/* botões de pino */}
      {[620, 670].map((y, i) => (
        <g key={y}>
          <Peca id={id} d={recorte(ret(262, y - 8, 30, 14), 69 + i, 1.5)} cor={B} />
          <Peca id={id} d={recorte(ret(308, y - 8, 30, 14), 71 + i, 1.5)} cor={B} />
          <Rabisco pts={[[292, y], [308, y]]} cor={cores.tinta} largura={3} opacidade={0.6} />
        </g>
      ))}
      {/* coleira + plaquinha-neurônio */}
      <Peca id={id} d={recorte(ret(232, 468, 136, 26), 73, 2)} cor={cores.coral} textura="aquarela" />
      <Peca id={id} d={recorte(elipse(300, 514, 24, 24, 12), 74, 1.5)} cor={cores.lavanda} textura="lisa" margem={4} />
      {[[300, 514, 288, 502], [300, 514, 314, 504], [300, 514, 300, 530]].map(([a, b, c, d], i) => (
        <g key={i}>
          <Rabisco pts={[[a, b], [c, d]]} cor={cores.tinta} largura={3} opacidade={0.8} />
          <circle cx={c} cy={d} r={3} fill={cores.tinta} />
        </g>
      ))}

      {/* cabeça */}
      <Mandibula e={e} queda={34} pivo={[300, 372]}>
        <Margem d={QUEIXO} />
      </Mandibula>
      <Peca id={id} d={CABECA} cor={P} textura="aquarela" margem />
      <Rabisco pts={[[200, 220], [214, 232], [204, 244]]} opacidade={0.4} semente={7} />
      <Rabisco pts={[[396, 360], [384, 372], [398, 382]]} opacidade={0.4} semente={8} />
      {/* listra branca + focinho com sardas */}
      <Peca id={id} d={recorte([[282, 176], [318, 176], [330, 300], [270, 300]], 75, 2.5, 30)} cor={B} textura="manchada" />
      <Peca id={id} d={recorte(elipse(300, 348, 74, 44, 18), 76)} cor={B} textura="manchada" meiotom="escuro" />

      {/* boca South Park */}
      <Peca id={id} d={BOCA} cor={cores.tinta} sombra={false} />
      <Mandibula e={e} queda={34} pivo={[300, 372]}>
        <Peca id={id} d={QUEIXO} cor={B} textura="manchada" />
        {linguaFora && (
          <g>
            <Peca id={id} d={recorte([[302, 384], [338, 384], [340, 432], [322, 446], [304, 432]], 77, 2, 24)} cor={cores.coral} textura="aquarela" margem={4} />
            <Rabisco pts={[[321, 392], [321, 430]]} cor={cores.tinta} largura={2.5} opacidade={0.4} />
          </g>
        )}
        {e.abertura < 0.1 && <Rabisco pts={[[268, 374], [284, 382], [300, 376], [316, 382], [332, 374]]} largura={3} opacidade={0.8} />}
      </Mandibula>
      {/* nariz */}
      <Peca id={id} d={recorte([[270, 312], [330, 312], [322, 336], [300, 346], [278, 336]], 78, 2, 24)} cor={cores.tinta} />
      <ellipse cx={288} cy={319} rx={8} ry={4} fill={B} opacity={0.6} />

      {/* olhos grandes e brilhantes + sobrancelhas sempre animadas */}
      <Olho e={e} cx={248} cy={268} rx={27} ry={31} corPalpebra={P} pupilaR={17} palpebraExtra={-0.1} semente={79} lado={0} />
      <Olho e={e} cx={352} cy={268} rx={27} ry={31} corPalpebra={P} pupilaR={17} palpebraExtra={-0.1} semente={80} lado={1} />
      <Sobrancelha e={e} cx={246} cy={220} largura={50} altura={14} cor={cores.tinta} lado={0} extraSobe={-8} extraAng={-6} semente={81} />
      <Sobrancelha e={e} cx={354} cy={220} largura={50} altura={14} cor={cores.tinta} lado={1} extraSobe={-8} extraAng={6} semente={82} />

      {/* orelha direita virada pra cima (coral por dentro) — na frente */}
      <Peca id={id} d={recorte([[392, 196], [440, 120], [500, 104], [486, 168], [428, 232]], 83)} cor={P} textura="respingos" margem />
      <Peca id={id} d={recorte([[414, 192], [446, 136], [484, 124], [472, 168], [430, 214]], 84, 2.5)} cor={cores.coral} textura="aquarela" />
    </g>
  );
};
