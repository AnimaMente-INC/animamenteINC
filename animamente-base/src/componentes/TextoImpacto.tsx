/**
 * TEXTO DE IMPACTO — frase curta que ocupa a tela, uma linha por vez, cada linha "carimbada".
 * Separe as linhas com " / ":  "Bora / voltar no / *tempo*!"
 * Destaques iguais aos do resto da base: *amarelo* e _coral_. O tamanho se ajusta à linha mais longa.
 */
import React from "react";
import { useCurrentFrame } from "remotion";
import { estiloCarimbo } from "../animacao";
import { useEstilo } from "../tema/Estilo";
import { cores, tempos } from "../tema/tokens";
import { separarPalavras, textoLimpo } from "./TextoAnimado";

export const linhasImpacto = (texto: string) => texto.split("/").map((l) => l.trim()).filter(Boolean);

export const TextoImpacto: React.FC<{ texto: string; atraso?: number; escala?: number }> = ({ texto, atraso = 0, escala = 1 }) => {
  const frame = useCurrentFrame();
  const { fonte, area, p } = useEstilo();
  const linhas = linhasImpacto(texto);
  const maior = Math.max(...linhas.map((l) => textoLimpo(l).length));
  const f = fonte("titulo", "titulo");
  const fs = Math.min((f.fontSize as number) * 1.9, (area.largura * 0.94) / (maior * 0.56)) * escala;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: fs * 0.08 }}>
      {linhas.map((l, i) => (
        <div key={i} style={{ ...estiloCarimbo(frame, { atraso: atraso + i * tempos.staggerImpacto, giro: i % 2 ? 1.5 : -1.5 }), ...f, fontSize: fs, lineHeight: 1.02, color: p.texto, whiteSpace: "nowrap" }}>
          {separarPalavras(l).map((pal, k) => (
            <span key={k} style={{ marginRight: "0.24em", color: pal.tipo === "marca" ? cores.amarelo : pal.tipo === "cor" ? cores.coral : undefined }}>
              {pal.texto}
              <span style={{ color: p.texto }}>{pal.sufixo}</span>
            </span>
          ))}
        </div>
      ))}
    </div>
  );
};
