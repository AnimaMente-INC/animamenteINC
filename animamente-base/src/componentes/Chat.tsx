/**
 * CHAT — a conversa dos personagens como mensagens de celular.
 * As mensagens anteriores já estão na tela; a ÚLTIMA é a que está sendo falada agora:
 * primeiro aparecem os três pontinhos ("digitando"), depois a mensagem, no ritmo da voz.
 * O primeiro que fala fica à esquerda; o outro, à direita.
 */
import React from "react";
import { useCurrentFrame } from "remotion";
import { estiloEntrada, pulsar } from "../animacao";
import { Personagem, ritmoFala } from "../personagens/Personagem";
import { COR_PERSONAGEM, IdPersonagem, NOMES_PERSONAGENS } from "../personagens/tipos";
import { useEstilo } from "../tema/Estilo";
import { comAlfa, cores, forma, tempos } from "../tema/tokens";
import { TextoAnimado } from "./TextoAnimado";

export type MensagemChat = { quem: IdPersonagem; texto: string };

const Avatar: React.FC<{ quem: IdPersonagem; tamanho: number; narraEm?: number; duracaoFala?: number }> = ({ quem, tamanho, narraEm, duracaoFala }) => (
  <div style={{ width: tamanho, height: tamanho, flexShrink: 0, borderRadius: forma.raioPilula, overflow: "hidden", background: comAlfa(COR_PERSONAGEM[quem], 0.3), position: "relative" }}>
    <div style={{ position: "absolute", left: "50%", top: tamanho * 0.02, transform: "translateX(-50%)" }}>
      <Personagem id={quem} altura={tamanho * 1.9} expressao="feliz" narraEm={narraEm} duracaoFala={duracaoFala} semBalao />
    </div>
  </div>
);

export const Chat: React.FC<{ mensagens: MensagemChat[]; falaEm?: number; duracaoFala?: number; parado?: boolean }> = ({ mensagens, falaEm = 18, duracaoFala, parado = false }) => {
  const frame = useCurrentFrame();
  const { fonte, p, formato } = useEstilo();
  const primeiro = mensagens[0]?.quem;
  const avatar = formato === "vertical" ? 150 : 100;
  const corpo = formato === "vertical" ? "legenda" : "rotulo";
  const digitando = Math.max(0, falaEm - tempos.digitandoChat);
  return (
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end", gap: formato === "vertical" ? 26 : 16, width: "100%" }}>
      {mensagens.map((m, i) => {
        const ultima = i === mensagens.length - 1 && !parado;
        const direita = m.quem !== primeiro;
        const cor = COR_PERSONAGEM[m.quem];
        const chegou = !ultima || frame >= falaEm;
        if (ultima && frame < digitando) return null;
        const fundo = direita ? cores.lavanda : p.texto;
        return (
          <div key={i} style={{ ...(ultima ? estiloEntrada(frame, { atraso: digitando, tipo: "subir" }) : {}), display: "flex", flexDirection: direita ? "row-reverse" : "row", alignItems: "flex-end", gap: 18 }}>
            <Avatar quem={m.quem} tamanho={avatar} narraEm={ultima ? falaEm : undefined} duracaoFala={ultima ? duracaoFala : undefined} />
            <div style={{ display: "flex", flexDirection: "column", alignItems: direita ? "flex-end" : "flex-start", gap: 6, maxWidth: "76%" }}>
              <div style={{ ...fonte("titulo", "nota"), color: cor === "lavanda" ? p.textoApoio : cores[cor], padding: "0 14px" }}>{NOMES_PERSONAGENS[m.quem]}</div>
              <div style={{ background: fundo, borderRadius: forma.raioCartao * 1.2, [direita ? "borderBottomRightRadius" : "borderBottomLeftRadius"]: forma.grade, padding: "20px 30px" }}>
                {chegou ? (
                  <TextoAnimado texto={m.texto} fonte="textoForte" tamanho={corpo} cor={cores.tinta} alinhamento="left" atraso={ultima ? falaEm : -999} porPalavra={ultima ? ritmoFala(m.texto, duracaoFala) : undefined} />
                ) : (
                  <div style={{ display: "flex", gap: 12, padding: "14px 6px" }}>
                    {[0, 1, 2].map((k) => (
                      <div key={k} style={{ width: forma.grade * 2, height: forma.grade * 2, borderRadius: forma.raioPilula, background: cores.ardosia, opacity: 0.35 + 0.65 * pulsar(frame - k * 4, tempos.digitandoChat), transform: `translateY(${-6 * pulsar(frame - k * 4, tempos.digitandoChat)}px)` }} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
