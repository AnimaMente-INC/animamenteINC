/**
 * LEGENDA — Nunito, no máximo 2 linhas e 32 caracteres por linha.
 * Palavra-chave com *asteriscos* (Amarelo) ou _sublinhados_ (Coral).
 */
import React from "react";
import { legenda } from "../tema/tokens";
import { TextoAnimado, textoLimpo } from "./TextoAnimado";

/** Avisa no console (e no Studio) quando a legenda passa do limite do padrão. */
export const validarLegenda = (texto: string) => {
  const limpo = textoLimpo(texto);
  const max = legenda.maxLinhas * legenda.maxCaracteresPorLinha;
  if (limpo.length > max) {
    console.warn(`[Animamente] Legenda com ${limpo.length} caracteres (máx. ${max}): "${limpo}". Divida em duas cenas.`);
    return false;
  }
  return true;
};

export const Legenda: React.FC<{ texto: string; atraso?: number; inicioSaida?: number }> = ({ texto, atraso = 0, inicioSaida }) => {
  validarLegenda(texto);
  return (
    <TextoAnimado
      texto={texto}
      fonte="texto"
      tamanho="legenda"
      atraso={atraso}
      inicioSaida={inicioSaida}
      larguraMax={`${legenda.maxCaracteresPorLinha * 0.56}em`}
    />
  );
};
