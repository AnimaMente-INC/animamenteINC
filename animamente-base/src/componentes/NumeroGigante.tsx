/**
 * NÚMERO GIGANTE — um dado que ocupa a tela: o número conta até o valor, ganha um sublinhado
 * "à mão" e uma linha explicando o que ele é. O tamanho se ajusta ao comprimento do número.
 * MEDALHA — selo redondo da posição no ranking ("3º", "2º", "1º"), que cai como carimbo.
 */
import React from "react";
import { useCurrentFrame } from "remotion";
import { contar, estiloCarimbo, estiloEntrada } from "../animacao";
import { useEstilo } from "../tema/Estilo";
import { cores, forma, NomeCor, tempos } from "../tema/tokens";
import { Destaque } from "./Destaque";
import { TextoAnimado } from "./TextoAnimado";

export const NumeroGigante: React.FC<{ valor: number; casas?: number; prefixo?: string; sufixo?: string; rotulo?: string; cor?: NomeCor; atraso?: number; parado?: boolean; escala?: number }> = ({ valor, casas = 0, prefixo = "", sufixo = "", rotulo, cor = "amarelo", atraso = 0, parado = false, escala = 1 }) => {
  const frame = useCurrentFrame();
  const { fonte, area, p, tema } = useEstilo();
  const duracao = tempos.entrada * 3;
  const formatar = (n: number) => n.toLocaleString("pt-BR", { minimumFractionDigits: casas, maximumFractionDigits: casas });
  const final = prefixo + formatar(valor) + sufixo;
  const v = parado ? valor : contar(frame, 0, valor, atraso + 4, duracao);
  const base = fonte("formula", "titulo");
  const fs = Math.min((base.fontSize as number) * 3, (area.largura * 0.94) / (final.length * 0.56)) * escala;
  const corNumero = tema === "claro" && cor === "amarelo" ? cores.coral : cores[cor];
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
      <div style={{ ...(parado ? {} : estiloEntrada(frame, { atraso })), position: "relative" }}>
        {/* o texto final (invisível) segura a largura: o número não "dança" enquanto conta */}
        <div style={{ ...base, fontSize: fs, lineHeight: 1, whiteSpace: "nowrap", visibility: "hidden" }}>{final}</div>
        <div style={{ ...base, fontSize: fs, lineHeight: 1, whiteSpace: "nowrap", color: corNumero, position: "absolute", inset: 0, textAlign: "center" }}>
          {prefixo}
          {formatar(v)}
          {sufixo}
        </div>
        <div style={{ width: "100%", marginTop: fs * 0.04 }}>
          <Destaque tipo="sublinhado" cor={cor === "coral" ? "amarelo" : "coral"} atraso={parado ? -999 : atraso + 4 + duracao} />
        </div>
      </div>
      {rotulo && <TextoAnimado texto={rotulo} fonte="textoForte" tamanho="legenda" cor={p.texto} atraso={parado ? -999 : atraso + duracao} larguraMax="16em" />}
    </div>
  );
};

export const Medalha: React.FC<{ posicao: number; atraso?: number; tamanho?: number; parado?: boolean }> = ({ posicao, atraso = 0, tamanho = 300, parado = false }) => {
  const frame = useCurrentFrame();
  const { fonte } = useEstilo();
  const primeiro = posicao === 1;
  return (
    <div style={{ ...(parado ? {} : estiloCarimbo(frame, { atraso, giro: -6 })), ...fonte("titulo", "titulo"), fontSize: tamanho * 0.46, lineHeight: 1, width: tamanho, height: tamanho, boxSizing: "border-box", borderRadius: forma.raioPilula, background: primeiro ? cores.amarelo : cores.coral, color: primeiro ? cores.tinta : cores.nevoa, border: `${forma.borda}px solid ${cores.nevoa}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      {posicao}º
    </div>
  );
};
