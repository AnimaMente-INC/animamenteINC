/**
 * CAPA — capa de Reels/Shorts (1080×1920) no padrão animamente: etiqueta, título grande com destaque,
 * um selo redondo e os personagens. Tudo o que importa fica no miolo 4:5 (o recorte da grade do Instagram).
 * Renderizar: npx remotion still <IdDaCapa> out/capas/<nome>.png --frame=0
 */
import React from "react";
import { AbsoluteFill } from "remotion";
import { Constelacao } from "./componentes/Constelacao";
import { Marca } from "./componentes/Logo";
import { separarPalavras } from "./componentes/TextoAnimado";
import { Busto } from "./personagens/colagem/Busto";
import { Expressao, IdPersonagem, Pose } from "./personagens/tipos";
import { carregarFontes } from "./tema/carregarFontes";
import { NomeFigurino, NomeFundo, ProvedorEstilo, useEstilo } from "./tema/Estilo";
import { cores, forma, NomeCor } from "./tema/tokens";

carregarFontes();

export type PropsCapa = {
  etiqueta: string;
  titulo: string; // *amarelo* e _coral_
  selo?: { texto: string; sub?: string; cor: NomeCor };
  versus?: [string, string];
  /** Frase de apoio abaixo do título (Lavanda). */
  sub?: string;
  /** Posição vertical do selo redondo quando há personagens (padrão 1020; suba se ele tapar um personagem). */
  seloTopo?: number;
  /** Pílula de chamada no pé da capa. */
  chamada?: string;
  personagens?: { id: IdPersonagem; expressao: Expressao; pose: Pose }[];
  /** Tema música: fundo com notas e Neuro maestro (iguais aos do vídeo). */
  fundo?: NomeFundo;
  figurino?: NomeFigurino;
};

const Miolo: React.FC<PropsCapa> = ({ etiqueta, titulo, selo, versus, sub, chamada, seloTopo, personagens = [] }) => {
  const semElenco = personagens.length === 0;
  const pontas = Array.from({ length: 32 }, (_, i) => {
    const r = i % 2 ? 232 : 280;
    const a = (i / 32) * Math.PI * 2;
    return `${280 + Math.cos(a) * r},${280 + Math.sin(a) * r}`;
  }).join(" ");
  const { fonte } = useEstilo();
  const medalha = (texto: string, cor: NomeCor, gira: number) => (
    <div style={{ width: semElenco ? 330 : 250, height: semElenco ? 330 : 250, borderRadius: "50%", background: cores[cor], border: `${forma.borda}px solid ${cores.nevoa}`, display: "flex", alignItems: "center", justifyContent: "center", ...fonte("titulo", "subtitulo"), color: cor === "coral" ? cores.nevoa : cores.tinta, transform: `rotate(${gira}deg)` }}>{texto}</div>
  );
  return (
    <AbsoluteFill style={{ background: cores.tinta }}>
      <Constelacao semente={5} />
      <div style={{ position: "absolute", left: 70, right: 70, top: 330, display: "flex", flexDirection: "column", alignItems: "center", gap: 36 }}>
        <div style={{ ...fonte("titulo", "rotulo"), background: cores.amarelo, color: cores.tinta, borderRadius: forma.raioPilula, padding: "12px 40px", transform: "rotate(-3deg)" }}>{etiqueta}</div>
        <div style={{ ...fonte("titulo", "titulo"), fontSize: 132, lineHeight: 1.04, color: cores.nevoa, textAlign: "center" }}>
          {separarPalavras(titulo).map((p, i) => (
            <span key={i} style={{ color: p.tipo === "marca" ? cores.amarelo : p.tipo === "cor" ? cores.coral : cores.nevoa }}>
              {p.texto}
              {p.sufixo ?? ""}{" "}
            </span>
          ))}
        </div>
        {sub && <div style={{ ...fonte("texto", "legenda"), color: cores.lavanda, textAlign: "center", maxWidth: 860 }}>{sub}</div>}
        {versus && (
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            {medalha(versus[0], "coral", -8)}
            <div style={{ ...fonte("titulo", "subtitulo"), color: cores.amarelo }}>VS</div>
            {medalha(versus[1], "amarelo", 8)}
          </div>
        )}
      </div>
      {selo && semElenco && (
        <div style={{ position: "absolute", left: 260, top: 1085, width: 560, height: 560, transform: "rotate(-7deg) scale(0.9)" }}>
          <svg width={560} height={560} style={{ position: "absolute", inset: 0 }}>
            <polygon points={pontas} fill={cores[selo.cor]} stroke={cores.nevoa} strokeWidth={forma.borda} strokeLinejoin="round" />
          </svg>
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: selo.cor === "coral" ? cores.nevoa : cores.tinta }}>
            <div style={{ ...fonte("titulo", "titulo"), fontSize: selo.texto.length > 6 ? 78 : 124 }}>{selo.texto}</div>
            {selo.sub && <div style={{ ...fonte("textoForte", "rotulo") }}>{selo.sub}</div>}
          </div>
        </div>
      )}
      {selo && !semElenco && (
        <div style={{ position: "absolute", right: 60, top: seloTopo ?? 1020, width: 330, height: 330, borderRadius: "50%", background: cores[selo.cor], border: `${forma.borda}px solid ${cores.nevoa}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", transform: "rotate(9deg)", color: selo.cor === "coral" ? cores.nevoa : cores.tinta }}>
          <div style={{ ...fonte("titulo", "subtitulo") }}>{selo.texto}</div>
          {selo.sub && <div style={{ ...fonte("texto", "nota") }}>{selo.sub}</div>}
        </div>
      )}
      {chamada && (
        <div style={{ position: "absolute", left: 0, right: 0, top: versus ? 1290 : 1590, display: "flex", justifyContent: "center" }}>
          <div style={{ ...fonte("titulo", "rotulo"), background: cores.coral, color: cores.nevoa, border: `${forma.traco}px solid ${cores.nevoa}`, borderRadius: forma.raioPilula, padding: "16px 44px", transform: "rotate(2deg)" }}>{chamada}</div>
        </div>
      )}
      <div style={{ position: "absolute", left: selo ? 40 : 0, right: selo ? undefined : 0, bottom: 330, display: "flex", justifyContent: "center", alignItems: "flex-end", gap: 10 }}>
        {personagens.map((p, i) => (
          <div key={i} style={{ transform: personagens.length > 1 && p.id === "neuro" ? "translateY(130px)" : undefined }}>
            <Busto id={p.id} expressao={p.expressao} olhando={personagens.length > 1 ? (i ? "esquerda" : "direita") : "frente"} pose={p.pose} falando={i === 0} altura={personagens.length > 1 ? 500 : 680} />
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 300, display: "flex", justifyContent: "center", transform: "translateY(110%)" }}>
        <Marca tamanho="rotulo" atraso={-60} />
      </div>
    </AbsoluteFill>
  );
};

export const Capa: React.FC<PropsCapa> = (props) => (
  <ProvedorEstilo formato="vertical" fundo={props.fundo} figurino={props.figurino}>
    <Miolo {...props} />
  </ProvedorEstilo>
);

export const CAPAS: { id: string; props: PropsCapa }[] = [
  { id: "CapaGta6TudoQueSabemos", props: { etiqueta: "Antes de jogar", titulo: "GTA 6: tudo que você _precisa saber_", sub: "Data, plataformas, PC, história e mapa em menos de 2 minutos", selo: { texto: "19/11", sub: "é o dia!", cor: "amarelo" } } },
  { id: "CapaGta6VozIa", props: { etiqueta: "Prepare o bolso", titulo: "Quanto custa o GTA 6 no *Brasil*?", sub: "E o PC, quando sai?", selo: { texto: "R$ 449,90", sub: "e isso é a edição padrão", cor: "coral" } } },
  { id: "CapaPiratariaGames", props: { etiqueta: "História dos games", titulo: "Por que jogar era tão _barato_?", sub: "A história da pirataria de games", selo: { texto: "R$ 10", sub: "3 jogos", cor: "amarelo" }, seloTopo: 820, personagens: [{ id: "rafa", expressao: "surpreso", pose: "parado" }, { id: "caio", expressao: "confuso", pose: "parado" }] } },
  { id: "CapaGta6VsZelda", props: { etiqueta: "Jogo do Ano 2026", titulo: "*GTA 6* ou _Zelda_: quem leva?", sub: "Dá pra ganhar só por gráfico?", versus: ["GTA 6", "Zelda"], chamada: "Comenta o seu voto!" } },
  { id: "CapaSusVoceUsaSemSaber", props: { etiqueta: "Caiu no Enem", titulo: "Você usa o _SUS_ sem saber", sub: "Faça o quiz e descubra onde", selo: { texto: "Quiz", sub: "2 perguntas", cor: "amarelo" } } },
  { id: "CapaTerrasRaras", props: { etiqueta: "Caiu no Enem", titulo: "O que são terras _raras_?", sub: "Não é terra e nem é tão rara", selo: { texto: "23%", sub: "estão no Brasil", cor: "amarelo" } } },
  { id: "CapaQuizMusica", props: { etiqueta: "Quiz musical · nível 1", titulo: "Você consegue _responder_?", sub: "Notas, pauta e escalas: do fácil ao médio", selo: { texto: "6 s", sub: "por pergunta", cor: "amarelo" }, seloTopo: 900, fundo: "musical", figurino: "maestro", personagens: [{ id: "neuro", expressao: "empolgado", pose: "regendo" }] } },
  { id: "CapaQuizMusica2", props: { etiqueta: "Quiz musical · nível 2", titulo: "Só quem estuda _música_ acerta", sub: "Intervalos, semitons e sustenidos", selo: { texto: "6 s", sub: "por pergunta", cor: "amarelo" }, seloTopo: 900, fundo: "musical", figurino: "maestro", personagens: [{ id: "neuro", expressao: "pensativo", pose: "regendo" }] } },
  { id: "CapaQuizMusica3", props: { etiqueta: "Quiz musical · nível 3", titulo: "Só *maestro* acerta as 6", sub: "Nível extremamente difícil", selo: { texto: "6 s", sub: "por pergunta", cor: "coral" }, seloTopo: 900, fundo: "musical", figurino: "maestro", personagens: [{ id: "neuro", expressao: "surpreso", pose: "regendo" }] } },
];
