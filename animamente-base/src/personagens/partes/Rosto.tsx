/**
 * ROSTO COMPARTILHADO — olhos de ponto (com brilho Névoa) + boca + bochechas.
 * Expressões mudam SÓ olhos (ponto, arco, linha) e boca (linha, arco, "O").
 * Todo personagem novo deve usar este componente.
 */
import React from "react";
import { cores, forma } from "../../tema/tokens";
import { Expressao, Olhar, Ponto } from "../tipos";

type Props = {
  expressao: Expressao;
  olhos: [Ponto, Ponto];
  boca: Ponto;
  raioOlho?: number;
  larguraBoca?: number;
  piscada?: number; // 0 aberto → 1 fechado
  falando?: boolean; // boca aberta neste frame
  olhando?: Olhar;
  mostrarBocaFechada?: boolean; // Neuro só mostra boca quando fala ou quando a expressão pede
  /** Multiplica a espessura dos traços (para personagens desenhados em outra escala). */
  escala?: number;
  /** Cor das bochechas (null = sem bochechas). */
  bochechas?: string | null;
  /** Espessura das sobrancelhas (0 = sem sobrancelhas fixas). */
  sobrancelhas?: number;
  /** Íris colorida com pupila em fenda (olho de gato). */
  iris?: string;
  /** Branco do olho (Névoa) atrás da pupila — para rostos escuros ou com máscara. */
  olhoBranco?: boolean;
  /** Cor dos traços dos olhos (arcos de felicidade, sobrancelhas). Padrão: Tinta. */
  corLinhaOlhos?: string;
};

const T = cores.tinta;

export const Rosto: React.FC<Props> = ({
  expressao,
  olhos,
  boca,
  raioOlho = 10,
  larguraBoca = 28,
  piscada = 0,
  falando = false,
  olhando = "frente",
  mostrarBocaFechada = true,
  escala = 1,
  bochechas = cores.coral,
  sobrancelhas = 0,
  iris,
  olhoBranco = false,
  corLinhaOlhos = T,
}) => {
  const sw = forma.traco * escala;
  const traco = { stroke: T, strokeWidth: sw, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, fill: "none" };
  const r = raioOlho;
  const tracoOlho = { ...traco, stroke: corLinhaOlhos };
  const dx = olhando === "esquerda" ? -r * 0.8 : olhando === "direita" ? r * 0.8 : 0;

  /** Sobrancelha fixa (quando `sobrancelhas` > 0): muda de altura/inclinação com a expressão. */
  const sobrancelha = (c: Ponto, lado: 0 | 1) => {
    if (sobrancelhas <= 0) return null;
    const x = c.x + dx;
    const sobe = expressao === "surpreso" ? -r * 1.1 : expressao === "empolgado" || expressao === "feliz" ? -r * 0.5 : 0;
    const inclina = expressao === "pensativo" ? (lado === 0 ? r * 0.6 : -r * 0.3) : expressao === "confuso" ? (lado === 0 ? -r * 1.0 : r * 0.5) : 0;
    const yb = c.y - r * 2.5 + sobe;
    const fora = lado === 0 ? -1 : 1; // ponta de fora
    return (
      <path
        key={`sf${lado}`}
        d={`M ${x - r * 1.2 * fora} ${yb + inclina} Q ${x} ${yb - r * 0.7} ${x + r * 1.3 * fora} ${yb + inclina * 0.1 + r * 0.2}`}
        stroke={corLinhaOlhos}
        strokeWidth={sobrancelhas}
        strokeLinecap="round"
        fill="none"
      />
    );
  };

  const olhoBase = (c: Ponto, lado: 0 | 1) => {
    const x = c.x + dx;
    // olhos em arco (felicidade) não piscam
    if (expressao === "feliz" || expressao === "empolgado") {
      const w = r * 1.4;
      return <path key={lado} d={`M ${x - w} ${c.y + r * 0.4} Q ${x} ${c.y - r * 1.5} ${x + w} ${c.y + r * 0.4}`} {...tracoOlho} />;
    }
    if (iris || olhoBranco) {
      // olho "completo": fundo (íris ou branco) + pupila + brilho; pisca achatando tudo
      const R = r * 1.65 * (expressao === "surpreso" ? 1.15 : 1);
      const k = Math.max(1 - piscada * 0.92, 0.08);
      const ox2 = expressao === "pensativo" ? r * 0.4 : 0;
      const oy2 = expressao === "pensativo" ? -r * 0.5 : 0;
      const px = x + ox2 + (olhando === "esquerda" ? -R * 0.3 : olhando === "direita" ? R * 0.3 : 0) * 0.6;
      const partes2: React.ReactNode[] = [
        <ellipse key="f" cx={c.x + dx * 0.4} cy={c.y} rx={R} ry={R * k} fill={iris ?? cores.nevoa} />,
      ];
      if (piscada < 0.6) {
        partes2.push(
          iris ? (
            <ellipse key="p" cx={px} cy={c.y + oy2 * 0.5} rx={r * 0.42} ry={R * 0.82 * k} fill={T} />
          ) : (
            <circle key="p" cx={px} cy={c.y + oy2} r={r * 0.95} fill={T} />
          ),
          <circle key="b" cx={px + r * 0.45} cy={c.y + oy2 - r * 0.5} r={r * 0.32} fill={cores.nevoa} />,
        );
      }
      return <g key={lado}>{partes2}</g>;
    }
    const raio = expressao === "surpreso" ? r * 1.3 : r;
    const ox = expressao === "pensativo" ? r * 0.5 : 0;
    const oy = expressao === "pensativo" ? -r * 0.6 : 0;
    const ry = Math.max(raio * (1 - piscada * 0.92), sw * 0.3);
    const aberto = piscada < 0.5;
    const partes: React.ReactNode[] = [
      <ellipse key="o" cx={x + ox} cy={c.y + oy} rx={raio} ry={ry} fill={T} />,
      aberto && <circle key="b" cx={x + ox + raio * 0.35} cy={c.y + oy - raio * 0.35} r={raio * 0.32} fill={cores.nevoa} />,
    ];
    if (sobrancelhas <= 0 && expressao === "confuso") {
      partes.push(
        lado === 0 ? (
          <path key="s" d={`M ${x - r * 1.5} ${c.y - r * 2.4} L ${x + r * 1.3} ${c.y - r * 3.2}`} {...traco} />
        ) : (
          <path key="s" d={`M ${x - r * 1.3} ${c.y - r * 2.1} L ${x + r * 1.5} ${c.y - r * 2.1}`} {...traco} />
        ),
      );
    }
    if (sobrancelhas <= 0 && expressao === "surpreso") {
      partes.push(<path key="s" d={`M ${x - r * 1.2} ${c.y - r * 3} Q ${x} ${c.y - r * 3.8} ${x + r * 1.2} ${c.y - r * 3}`} {...traco} />);
    }
    return <g key={lado}>{partes}</g>;
  };

  const olho = (c: Ponto, lado: 0 | 1) => (
    <g key={lado}>
      {olhoBase(c, lado)}
      {sobrancelha(c, lado)}
    </g>
  );

  const w = larguraBoca;
  const x = boca.x + dx * 0.5;
  const y = boca.y;
  const bocaCheia = (d: string) => <path d={d} fill={T} stroke={T} strokeWidth={sw} strokeLinejoin="round" />;
  const sorrisoAberto = (a: number) =>
    bocaCheia(`M ${x - w * a} ${y - 6 * escala} Q ${x} ${y - 6 * escala} ${x + w * a} ${y - 6 * escala} Q ${x + w * a * 0.75} ${y + w} ${x} ${y + w} Q ${x - w * a * 0.75} ${y + w} ${x - w * a} ${y - 6 * escala} Z`);

  let bocaEl: React.ReactNode = null;
  if (falando) {
    bocaEl = expressao === "feliz" || expressao === "empolgado" ? sorrisoAberto(0.8) : <ellipse cx={x} cy={y + 4 * escala} rx={w * 0.42} ry={w * 0.5} fill={T} />;
  } else if (mostrarBocaFechada) {
    switch (expressao) {
      case "feliz":
        bocaEl = <path d={`M ${x - w * 0.9} ${y - 5 * escala} Q ${x} ${y + w * 0.85} ${x + w * 0.9} ${y - 5 * escala}`} {...traco} />;
        break;
      case "empolgado":
        bocaEl = sorrisoAberto(1);
        break;
      case "surpreso":
        bocaEl = <ellipse cx={x} cy={y + 4 * escala} rx={w * 0.34} ry={w * 0.44} {...traco} />;
        break;
      case "pensativo":
        bocaEl = <path d={`M ${x - w * 0.2} ${y + 4 * escala} L ${x + w * 0.55} ${y}`} {...traco} />;
        break;
      case "confuso":
        bocaEl = <path d={`M ${x - w * 0.7} ${y + 4 * escala} Q ${x - w * 0.25} ${y - 6 * escala} ${x} ${y + 2 * escala} Q ${x + w * 0.35} ${y + 10 * escala} ${x + w * 0.7} ${y - 2 * escala}`} {...traco} />;
        break;
      default:
        bocaEl = <path d={`M ${x - w * 0.5} ${y} Q ${x} ${y + 8 * escala} ${x + w * 0.5} ${y}`} {...traco} />;
    }
  }

  const corar = expressao === "feliz" || expressao === "empolgado" || expressao === "surpreso";
  return (
    <g>
      {bochechas && (
        <g fill={bochechas} opacity={corar ? 0.45 : 0.28}>
          <ellipse cx={olhos[0].x - r * 1.2 + dx * 0.3} cy={olhos[0].y + r * 2.6} rx={r * 1.5} ry={r * 0.9} />
          <ellipse cx={olhos[1].x + r * 1.2 + dx * 0.3} cy={olhos[1].y + r * 2.6} rx={r * 1.5} ry={r * 0.9} />
        </g>
      )}
      {olho(olhos[0], 0)}
      {olho(olhos[1], 1)}
      {bocaEl}
    </g>
  );
};
