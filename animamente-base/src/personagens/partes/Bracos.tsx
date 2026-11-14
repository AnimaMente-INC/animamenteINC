/**
 * BRAÇOS-NEURÔNIO E MÃOS-NÓ — o braço é um traço grosso Névoa (como as letras do logo)
 * e a mão é um nó redondo com borda de adesivo. Sem dedos.
 */
import React from "react";
import { cores, forma } from "../../tema/tokens";
import { Ponto } from "../tipos";

/**
 * `parte`: "linha" desenha só o braço (use ANTES do corpo, para ele sair de trás da borda);
 * "mao" desenha só a mão (use DEPOIS da cabeça); "tudo" desenha os dois.
 */
export const Braco: React.FC<{
  ombro: Ponto;
  mao: Ponto;
  raioMao?: number;
  corMao: string;
  curva?: number;
  espessura?: number;
  borda?: number;
  parte?: "tudo" | "linha" | "mao";
}> = ({ ombro, mao, raioMao = 22, corMao, curva = 0.18, espessura = forma.membro, borda = 7, parte = "tudo" }) => {
  const mx = (ombro.x + mao.x) / 2;
  const my = (ombro.y + mao.y) / 2;
  const dx = mao.x - ombro.x;
  const dy = mao.y - ombro.y;
  const lado = mao.x < ombro.x || (mao.x === ombro.x && ombro.x < 200) ? -1 : 1;
  const cx = mx + dy * curva * lado;
  const cy = my - dx * curva * lado;
  return (
    <g>
      {parte !== "mao" && (
        <path d={`M ${ombro.x} ${ombro.y} Q ${cx} ${cy} ${mao.x} ${mao.y}`} stroke={cores.nevoa} strokeWidth={espessura} strokeLinecap="round" fill="none" />
      )}
      {parte !== "linha" && <circle cx={mao.x} cy={mao.y} r={raioMao} fill={corMao} stroke={cores.nevoa} strokeWidth={borda} />}
    </g>
  );
};

/** Linhas de movimento (aceno, comemoração) — pequenos ramos de neurônio com nó na ponta. */
export const LinhasMovimento: React.FC<{ c: Ponto; lado: 1 | -1; opacidade?: number; escala?: number }> = ({ c, lado, opacidade = 1, escala = 1 }) => {
  const s = escala;
  const ramos = [
    [34, -28, 52, -42],
    [40, 0, 62, 0],
    [34, 28, 52, 42],
  ];
  return (
    <g opacity={opacidade}>
      {ramos.map(([x1, y1, x2, y2], i) => (
        <g key={i}>
          <path d={`M ${c.x + x1 * s * lado} ${c.y + y1 * s} L ${c.x + x2 * s * lado} ${c.y + y2 * s}`} stroke={cores.amarelo} strokeWidth={forma.traco * s} strokeLinecap="round" />
          <circle cx={c.x + x2 * s * lado} cy={c.y + y2 * s} r={5 * s} fill={cores.amarelo} />
        </g>
      ))}
    </g>
  );
};

/** Pequeno neurônio decorativo: um nó central com ramos e nós nas pontas. */
export const Neuronio: React.FC<{ c: Ponto; ramos: [number, number][]; cor?: string; espessura?: number; raio?: number; opacidade?: number }> = ({
  c,
  ramos,
  cor = cores.nevoa,
  espessura = 3,
  raio = 3.5,
  opacidade = 0.85,
}) => (
  <g opacity={opacidade}>
    {ramos.map(([x, y], i) => (
      <path key={i} d={`M ${c.x} ${c.y} Q ${(c.x + x) / 2 + (y - c.y) * 0.12} ${(c.y + y) / 2 - (x - c.x) * 0.12} ${x} ${y}`} stroke={cor} strokeWidth={espessura} strokeLinecap="round" fill="none" />
    ))}
    <circle cx={c.x} cy={c.y} r={raio} fill={cor} />
    {ramos.map(([x, y], i) => (
      <circle key={i} cx={x} cy={y} r={raio * 0.8} fill={cor} />
    ))}
  </g>
);
