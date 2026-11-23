/**
 * PENTAGRAMA — a pauta musical no estilo animamente (tema música).
 * Cinco linhas Névoa com nós de neurônio nas pontas, clave de sol em traço Névoa,
 * notas com cabeça oval chapada e haste, linha suplementar quando a nota sai da pauta,
 * sustenido desenhado em traços e o nome da nota embaixo (Fredoka).
 * A nota em destaque fica Amarelo (ou Coral) e dá um pulinho; um "?" Amarelo marca a nota misteriosa.
 *
 * Notas: "do4", "re4", "mi4", "fa4", "sol4", "la4", "si4", "do5"... com "#" para sustenido ("fa#4").
 * A pauta é em clave de sol: a linha de baixo é o Mi4 e a de cima o Fá5.
 */
import React from "react";
import { useCurrentFrame } from "remotion";
import { entrar, estiloEntrada, ondular, pulsar, stagger } from "../animacao";
import { useEstilo } from "../tema/Estilo";
import { cores, musica, NomeCor, tempos } from "../tema/tokens";

const ORDEM = ["do", "re", "mi", "fa", "sol", "la", "si"];
const NOMES: Record<string, string> = { do: "Dó", re: "Ré", mi: "Mi", fa: "Fá", sol: "Sol", la: "Lá", si: "Si" };

export type NotaPauta = string; // "sol4", "fa#5", "?" (nota misteriosa)

/** Degrau da nota na pauta: 0 = linha de baixo (Mi4), 8 = linha de cima (Fá5). */
export const degrauDaNota = (n: string) => {
  const m = n.match(/^(do|re|mi|fa|sol|la|si)(#?)(\d)$/);
  if (!m) return null;
  return { degrau: ORDEM.indexOf(m[1]) + 7 * (Number(m[3]) - 4) - 2, sustenido: m[2] === "#", nome: NOMES[m[1]] + (m[2] ? "♯" : "") };
};

export const NOTAS_VALIDAS = (n: string) => n === "?" || degrauDaNota(n) !== null;

/** Clave de sol em traço, desenhada em unidades de "espaço" (e = distância entre linhas); a linha do Sol fica em y = 3e. */
const caminhoClave = (e: number, x0: number, y0: number) => {
  const P = (x: number, y: number) => `${x0 + x * e} ${y0 + y * e}`;
  return [
    `M ${P(1.2, 3.05)}`,
    `C ${P(0.72, 3.05)} ${P(0.68, 2.45)} ${P(1.15, 2.32)}`,
    `C ${P(1.75, 2.15)} ${P(2.15, 2.95)} ${P(1.7, 3.55)}`,
    `C ${P(1.2, 4.2)} ${P(0.15, 3.95)} ${P(0.22, 2.95)}`,
    `C ${P(0.3, 2.0)} ${P(1.65, 1.45)} ${P(1.72, 0.25)}`,
    `C ${P(1.78, -0.65)} ${P(1.3, -1.25)} ${P(1.08, -0.55)}`,
    `C ${P(0.88, 0.1)} ${P(1.0, 2.2)} ${P(1.22, 4.75)}`,
    `C ${P(1.3, 5.55)} ${P(0.55, 5.75)} ${P(0.45, 5.15)}`,
  ].join(" ");
};

export const Pentagrama: React.FC<{
  notas: NotaPauta[];
  /** Índices das notas em destaque. */
  destaque?: number[];
  corDestaque?: NomeCor;
  /** Mostrar o nome de cada nota embaixo da pauta. */
  rotulos?: boolean;
  /** A clave de sol também fica em destaque (Amarelo). */
  destacarClave?: boolean;
  atraso?: number;
}> = ({ notas, destaque = [], corDestaque = "amarelo", rotulos = false, destacarClave = false, atraso = 0 }) => {
  const frame = useCurrentFrame();
  const { formato, fonte, p } = useEstilo();
  const k = formato === "vertical" ? 1 : 0.75;
  const e = musica.espacoLinha * k;
  const W = musica.larguraPauta * k;
  const topo = e * 2.6; // espaço para a clave e para notas acima da pauta
  const H = topo + e * 4 + e * 2.8 + (rotulos ? e * 2.2 : 0);
  const yLinha = (i: number) => topo + i * e; // 0 = linha de cima (Fá5), 4 = linha de baixo (Mi4)
  const yDegrau = (d: number) => topo + 4 * e - (d * e) / 2;
  const inicioNotas = e * 4.4;
  const passoX = notas.length > 1 ? (W - inicioNotas - e * 1.6) / (notas.length - 1) : 0;
  const xNota = (i: number) => (notas.length > 1 ? inicioNotas + i * passoX : (W + inicioNotas) / 2 - e * 0.4);
  const cab = { rx: musica.cabeca.rx * k, ry: musica.cabeca.ry * k };
  const entradaPauta = Math.min(1, entrar(frame, atraso));
  const comprimento = W - e * 0.6;
  return (
    <div style={{ ...estiloEntrada(frame, { atraso, tipo: "pop" }), width: W, height: H, position: "relative" }}>
      <svg width={W} height={H} style={{ overflow: "visible" }}>
        {/* linhas da pauta: traço-neurônio com nó nas duas pontas, desenhadas da esquerda para a direita */}
        {[0, 1, 2, 3, 4].map((i) => {
          const t = Math.min(1, entrar(frame, stagger(i, atraso), tempos.entrada * 2));
          return (
            <g key={i} opacity={entradaPauta}>
              <line x1={e * 0.3} y1={yLinha(i)} x2={e * 0.3 + comprimento * t} y2={yLinha(i)} stroke={p.linha} strokeWidth={musica.traco * k} strokeLinecap="round" />
              <circle cx={e * 0.3} cy={yLinha(i)} r={musica.traco * k * 1.7} fill={p.linha} />
              {t > 0.98 && <circle cx={e * 0.3 + comprimento} cy={yLinha(i)} r={musica.traco * k * 1.7} fill={p.linha} />}
            </g>
          );
        })}
        {/* clave de sol */}
        <path
          d={caminhoClave(e, e * 0.75, topo)}
          fill="none"
          stroke={destacarClave ? cores.amarelo : p.linha}
          strokeWidth={musica.clave * k}
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - Math.min(1, entrar(frame, atraso + tempos.entrada, tempos.entrada * 2))}
        />
        {/* notas */}
        {notas.map((n, i) => {
          const atrasoNota = atraso + tempos.entrada * 2 + i * tempos.stagger * 2;
          const vis = Math.min(1, entrar(frame, atrasoNota));
          if (vis <= 0) return null;
          const x = xNota(i);
          const acesa = destaque.includes(i);
          const cor = acesa ? cores[corDestaque] : p.linha;
          const pulo = acesa ? -Math.abs(ondular(frame, i, 6)) : ondular(frame, i, 2);
          if (n === "?") {
            const s = 1 + 0.12 * pulsar(frame, tempos.pulsoNeuronio);
            return (
              <g key={i} opacity={vis} transform={`translate(${x} ${yLinha(2)}) scale(${s * vis})`}>
                <text textAnchor="middle" dominantBaseline="central" style={{ ...fonte("titulo", "titulo") }} fill={cores.amarelo}>
                  ?
                </text>
              </g>
            );
          }
          const info = degrauDaNota(n);
          if (!info) return null;
          const y = yDegrau(info.degrau);
          const hasteSobe = info.degrau < 4;
          const xHaste = hasteSobe ? x + cab.rx * 0.86 : x - cab.rx * 0.86;
          const yHaste = hasteSobe ? y - musica.haste * e : y + musica.haste * e;
          // linhas suplementares (abaixo do Mi4 ou acima do Fá5)
          const suplementares: number[] = [];
          for (let d = -2; d >= info.degrau; d -= 2) suplementares.push(d);
          for (let d = 10; d <= info.degrau; d += 2) suplementares.push(d);
          return (
            <g key={i} opacity={vis} transform={`translate(0 ${pulo + (1 - vis) * -e})`}>
              {suplementares.map((d) => (
                <line key={d} x1={x - cab.rx * 1.7} x2={x + cab.rx * 1.7} y1={yDegrau(d)} y2={yDegrau(d)} stroke={p.linha} strokeWidth={musica.traco * k} strokeLinecap="round" />
              ))}
              {info.sustenido && (
                <g stroke={cor} strokeWidth={musica.traco * k} strokeLinecap="round">
                  <line x1={x - cab.rx * 2.3} y1={y - e * 0.95} x2={x - cab.rx * 2.3} y2={y + e * 1.05} />
                  <line x1={x - cab.rx * 1.75} y1={y - e * 1.05} x2={x - cab.rx * 1.75} y2={y + e * 0.95} />
                  <line x1={x - cab.rx * 2.75} y1={y - e * 0.3} x2={x - cab.rx * 1.3} y2={y - e * 0.45} strokeWidth={musica.traco * k * 1.5} />
                  <line x1={x - cab.rx * 2.75} y1={y + e * 0.45} x2={x - cab.rx * 1.3} y2={y + e * 0.3} strokeWidth={musica.traco * k * 1.5} />
                </g>
              )}
              <line x1={xHaste} y1={y} x2={xHaste} y2={yHaste} stroke={cor} strokeWidth={musica.traco * k} strokeLinecap="round" />
              {/* nó de neurônio na ponta da haste */}
              <circle cx={xHaste} cy={yHaste} r={musica.traco * k * 1.5} fill={cor} />
              <ellipse cx={x} cy={y} rx={cab.rx} ry={cab.ry} fill={cor} transform={`rotate(${musica.cabeca.giro} ${x} ${y})`} />
              {rotulos && (
                <text
                  x={x}
                  y={topo + e * 4 + e * 3.6}
                  textAnchor="middle"
                  style={{ ...fonte(acesa ? "titulo" : "texto", "rotulo") }}
                  fill={acesa ? cores[corDestaque] : p.textoApoio}
                >
                  {info.nome}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
};
