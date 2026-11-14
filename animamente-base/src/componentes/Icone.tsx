/**
 * ÍCONES — no estilo dos destaques do Instagram da identidade:
 * círculo chapado (Coral por padrão) com o desenho em traço Névoa, pontas arredondadas. viewBox 64×64.
 * Para criar ícone novo: só linhas e formas simples em Névoa, dentro do raio 18 a partir do centro.
 */
import React from "react";
import { cores, NomeCor } from "../tema/tokens";

export type NomeIcone =
  | "lampada"
  | "livro"
  | "atomo"
  | "grafico"
  | "relogio"
  | "ampulheta"
  | "interrogacao"
  | "alvo"
  | "certo"
  | "errado"
  | "calor"
  | "dados"
  | "play"
  | "camera"
  | "neuronio";

export const ICONES: NomeIcone[] = [
  "lampada", "livro", "atomo", "grafico", "relogio", "ampulheta", "interrogacao", "alvo",
  "certo", "errado", "calor", "dados", "play", "camera", "neuronio",
];

export const Icone: React.FC<{ nome: NomeIcone; tamanho?: number; cor?: NomeCor; semCirculo?: boolean }> = ({
  nome,
  tamanho = 72,
  cor = "coral",
  semCirculo = false,
}) => {
  const fundo = cores[cor];
  // ícone sobre Amarelo/Lavanda/Névoa fica em Tinta; sobre Coral/Tinta fica em Névoa
  const linha = cor === "amarelo" || cor === "lavanda" || cor === "nevoa" || cor === "lilas" ? cores.tinta : cores.nevoa;
  const t = { stroke: linha, strokeWidth: 4, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, fill: "none" };
  const cheio = { fill: linha };
  const desenhos: Record<NomeIcone, React.ReactNode> = {
    lampada: (
      <>
        <path d="M 25 36 A 10 10 0 1 1 39 36 Q 37 39 37 42 L 27 42 Q 27 39 25 36 Z" {...t} />
        <path d="M 28 47 L 36 47" {...t} />
      </>
    ),
    livro: (
      <>
        <path d="M 16 22 Q 24 19 32 23 Q 40 19 48 22 L 48 44 Q 40 41 32 45 Q 24 41 16 44 Z" {...t} />
        <path d="M 32 23 L 32 45" {...t} />
      </>
    ),
    atomo: (
      <>
        <ellipse cx={32} cy={32} rx={17} ry={7} {...t} />
        <ellipse cx={32} cy={32} rx={17} ry={7} transform="rotate(60 32 32)" {...t} />
        <ellipse cx={32} cy={32} rx={17} ry={7} transform="rotate(-60 32 32)" {...t} />
        <circle cx={32} cy={32} r={3.5} {...cheio} />
      </>
    ),
    grafico: (
      <>
        <path d="M 20 44 L 20 36 M 32 44 L 32 26 M 44 44 L 44 20" {...t} strokeWidth={6} />
      </>
    ),
    relogio: (
      <>
        <circle cx={32} cy={32} r={15} {...t} />
        <path d="M 32 24 L 32 32 L 38 36" {...t} />
      </>
    ),
    ampulheta: (
      <>
        <path d="M 22 18 L 42 18 M 22 46 L 42 46 M 24 18 Q 24 28 32 32 Q 40 28 40 18 M 24 46 Q 24 36 32 32 Q 40 36 40 46" {...t} />
      </>
    ),
    interrogacao: (
      <>
        <path d="M 25 26 Q 25 18 32 18 Q 39 18 39 25 Q 39 30 32 33 L 32 37" {...t} strokeWidth={5} />
        <circle cx={32} cy={45} r={3} {...cheio} />
      </>
    ),
    alvo: (
      <>
        <circle cx={32} cy={32} r={15} {...t} />
        <circle cx={32} cy={32} r={8} {...t} />
        <circle cx={32} cy={32} r={2.5} {...cheio} />
      </>
    ),
    certo: <path d="M 21 33 L 29 41 L 44 24" {...t} strokeWidth={5} />,
    errado: <path d="M 23 23 L 41 41 M 41 23 L 23 41" {...t} strokeWidth={5} />,
    calor: <path d="M 32 16 Q 44 28 42 38 Q 40 47 32 47 Q 24 47 22 39 Q 21 31 27 26 Q 27 33 32 34 Q 30 24 32 16 Z" {...t} />,
    dados: (
      <>
        <rect x={19} y={19} width={26} height={26} rx={6} {...t} />
        <circle cx={26} cy={26} r={2.5} {...cheio} />
        <circle cx={32} cy={32} r={2.5} {...cheio} />
        <circle cx={38} cy={38} r={2.5} {...cheio} />
      </>
    ),
    play: <path d="M 26 20 L 44 32 L 26 44 Z" fill={linha} stroke={linha} strokeWidth={3} strokeLinejoin="round" />,
    camera: (
      <>
        <rect x={16} y={23} width={22} height={18} rx={5} {...t} />
        <path d="M 38 29 L 47 24 L 47 40 L 38 35" {...t} />
      </>
    ),
    neuronio: (
      <>
        <path d="M 32 32 L 22 22 M 32 32 L 44 24 M 32 32 L 30 46 M 22 22 L 18 28 M 44 24 L 46 18" {...t} strokeWidth={3} />
        <circle cx={32} cy={32} r={4.5} {...cheio} />
        <circle cx={22} cy={22} r={3} {...cheio} />
        <circle cx={44} cy={24} r={3} {...cheio} />
        <circle cx={30} cy={46} r={3} {...cheio} />
        <circle cx={18} cy={28} r={2.2} {...cheio} />
        <circle cx={46} cy={18} r={2.2} {...cheio} />
      </>
    ),
  };
  return (
    <svg width={tamanho} height={tamanho} viewBox="0 0 64 64" style={{ overflow: "visible", flexShrink: 0 }}>
      {!semCirculo && <circle cx={32} cy={32} r={30} fill={fundo} />}
      {desenhos[nome]}
    </svg>
  );
};
