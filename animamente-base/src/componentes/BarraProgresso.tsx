/**
 * BARRA DE PROGRESSO — fina, em Coral, no topo durante todo o vídeo.
 */
import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { cores, forma } from "../tema/tokens";

export const BarraProgresso: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  return (
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: forma.grade, background: "transparent" }}>
      <div style={{ height: "100%", width: `${(frame / Math.max(1, durationInFrames - 1)) * 100}%`, background: cores.coral, borderRadius: `0 ${forma.raioPilula}px ${forma.raioPilula}px 0` }} />
    </div>
  );
};
