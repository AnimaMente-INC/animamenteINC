/**
 * Resolve o estado do personagem em cada frame a partir das mudanças do roteiro.
 * Trocas de pose/expressão são animadas em `tempos.trocaPoseExpressao` frames.
 */
import { suave } from "../../animacao";
import { tempos } from "../../tema/tokens";
import { Expressao, Mudanca, Olhar, Ponto, Pose } from "../tipos";

export type Estado = {
  pose: Pose;
  poseAnterior: Pose;
  tPose: number; // 0 = pose anterior, 1 = pose atual
  expressao: Expressao;
  expressaoAnterior: Expressao;
  tExpressao: number;
  olhando: Olhar;
};

export const resolverEstado = (
  frame: number,
  base: { pose: Pose; expressao: Expressao; olhando: Olhar },
  mudancas: Mudanca[] = [],
): Estado => {
  const ord = [...mudancas].sort((a, b) => a.em - b.em);
  let pose = base.pose;
  let poseAnterior = base.pose;
  let inicioPose = -Infinity;
  let exp = base.expressao;
  let expAnterior = base.expressao;
  let inicioExp = -Infinity;
  let olhando = base.olhando;
  for (const m of ord) {
    if (m.em > frame) break;
    if (m.pose && m.pose !== pose) {
      poseAnterior = pose;
      pose = m.pose;
      inicioPose = m.em;
    }
    if (m.expressao && m.expressao !== exp) {
      expAnterior = exp;
      exp = m.expressao;
      inicioExp = m.em;
    }
    if (m.olhando) olhando = m.olhando;
  }
  const d = tempos.trocaPoseExpressao;
  return {
    pose,
    poseAnterior,
    tPose: inicioPose === -Infinity ? 1 : suave(frame - inicioPose, [0, d], [0, 1]),
    expressao: exp,
    expressaoAnterior: expAnterior,
    tExpressao: inicioExp === -Infinity ? 1 : suave(frame - inicioExp, [0, d], [0, 1]),
    olhando,
  };
};

export const misturarPonto = (a: Ponto, b: Ponto, t: number): Ponto => ({
  x: a.x + (b.x - a.x) * t,
  y: a.y + (b.y - a.y) * t,
});

/** Espelha um ponto horizontalmente dentro de um viewBox de largura `w`. */
export const espelhar = (p: Ponto, w: number): Ponto => ({ x: w - p.x, y: p.y });
