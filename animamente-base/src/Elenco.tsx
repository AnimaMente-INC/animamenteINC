/**
 * ELENCO DE COLAGEM — folha de apresentação dos personagens (imagem) e uma prévia curta
 * com cada um falando (boca "South Park"). A prévia NÃO é um vídeo do canal: é só para ver os bonecos.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { estiloEntrada } from "./animacao";
import { Constelacao } from "./componentes/Constelacao";
import { Etiqueta } from "./componentes/Etiqueta";
import { Logo } from "./componentes/Logo";
import { Busto, IdBusto } from "./personagens/colagem/Busto";
import { Expressao, Pose } from "./personagens/tipos";
import { carregarFontes } from "./tema/carregarFontes";
import { ProvedorEstilo, useEstilo } from "./tema/Estilo";
import { audio, cores, NomeCor } from "./tema/tokens";
import { MusicaDeFundo } from "./Video";

carregarFontes();

export const ELENCO: { id: IdBusto; nome: string; bicho: string; jeito: string; bordao: string; cor: NomeCor }[] = [
  { id: "neuro", nome: "Neuro", bicho: "o cérebro", jeito: "o anfitrião animado (e narrador)", bordao: "Bem-vindo à animamente!", cor: "coral" },
  { id: "lia", nome: "Lia", bicho: "a gata", jeito: "curiosa e desconfiada", bordao: "Hum... será mesmo?", cor: "amarelo" },
  { id: "bento", nome: "Bento", bicho: "o cachorro", jeito: "otimista e desastrado", bordao: "Bora, bora, bora!", cor: "coral" },
  { id: "teo", nome: "Teo", bicho: "o bicho-preguiça", jeito: "calmo, sábio e movido a café", bordao: "Devagar... e sempre.", cor: "lavanda" },
  { id: "rafa", nome: "Rafa", bicho: "o elefante", jeito: "coach com memória de elefante", bordao: "Bora treinar o cérebro!", cor: "amarelo" },
  { id: "caio", nome: "Caio", bicho: "a lontra", jeito: "brincalhão e travesso", bordao: "Pera que tem piada nisso!", cor: "coral" },
];

const Cartao: React.FC<{ i: number; expressao: Expressao; falando?: boolean; altura: number; compacto?: boolean; pose?: Pose }> = ({ i, expressao, falando = false, altura, compacto, pose = "parado" }) => {
  const { fonte, p } = useEstilo();
  const c = ELENCO[i];
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
      <Busto id={c.id} expressao={expressao} olhando="frente" pose={pose} falando={falando} altura={altura} />
      <Etiqueta texto={`${c.nome}, ${c.bicho}`} cor={c.cor} tamanho={compacto ? "rotulo" : "subtitulo"} />
      <div style={{ ...fonte("texto", compacto ? "nota" : "rotulo"), color: p.textoApoio, textAlign: "center" }}>{c.jeito}</div>
      <div style={{ ...fonte("textoForte", compacto ? "nota" : "rotulo"), color: p.texto }}>“{c.bordao}”</div>
    </div>
  );
};

/** Folha do elenco (imagem). */
export const FolhaElenco: React.FC = () => (
  <ProvedorEstilo formato="horizontal">
    <ConteudoFolha />
  </ProvedorEstilo>
);

const EXPRESSOES_PADRAO: Expressao[] = ["feliz", "pensativo", "empolgado", "neutro", "feliz", "feliz"];

const ConteudoFolha: React.FC = () => {
  const { fonte, p } = useEstilo();
  return (
    <AbsoluteFill style={{ background: p.fundo }}>
      <Constelacao semente={8} />
      <div style={{ position: "absolute", inset: 0, padding: "70px 80px", display: "flex", flexDirection: "column", gap: 40 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 30 }}>
          <Logo tamanho={130} animado={false} />
          <div>
            <div style={{ ...fonte("titulo", "titulo"), color: p.texto }}>
              O elenco da anima<span style={{ color: cores.coral }}>mente</span>
            </div>
            <div style={{ ...fonte("texto", "rotulo"), color: p.textoApoio }}>personagens em colagem de papel · a boca abre como recorte</div>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center", flex: 1 }}>
          {ELENCO.map((_, i) => (
            <Cartao key={i} i={i} expressao={EXPRESSOES_PADRAO[i]} altura={560} compacto pose={i === 0 ? "acenando" : "parado"} />
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** Prévia: cada personagem fala o seu bordão (boca abrindo), com música baixa. */
export const PREVIA = { porPersonagem: 66 };

export const PreviaElenco: React.FC = () => (
  <ProvedorEstilo formato="horizontal">
    <ConteudoPrevia />
  </ProvedorEstilo>
);

const ConteudoPrevia: React.FC = () => {
  const frame = useCurrentFrame();
  const { fonte, p } = useEstilo();
  const atual = Math.min(ELENCO.length - 1, Math.floor(frame / PREVIA.porPersonagem));
  const local = frame - atual * PREVIA.porPersonagem;
  const c = ELENCO[atual];
  return (
    <AbsoluteFill style={{ background: p.fundo }}>
      <Constelacao semente={5} />
      <div style={{ position: "absolute", left: 60, right: 60, top: 110, display: "flex", justifyContent: "space-between", alignItems: "flex-end", height: 560 }}>
        {ELENCO.map((x, i) => (
          <div key={x.id} style={{ filter: i === atual ? "none" : "brightness(0.55) saturate(0.7)", transform: `scale(${i === atual ? 1.06 : 0.92})`, transformOrigin: "50% 100%" }}>
            <Busto
              id={x.id}
              expressao={i === atual ? (local > 10 && local < 52 ? EXPRESSOES_PADRAO[i] : "feliz") : "neutro"}
              olhando={i < atual ? "direita" : i > atual ? "esquerda" : "frente"}
              pose={x.id === "neuro" && i === atual ? "acenando" : "parado"}
              falando={i === atual && local > 10 && local < 52}
              altura={360}
            />
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 90, display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
        <div style={estiloEntrada(local, { tipo: "pop" })}>
          <Etiqueta texto={`${c.nome}, ${c.bicho}`} cor={c.cor} tamanho="subtitulo" />
        </div>
        <div style={{ ...fonte("titulo", "titulo"), color: p.texto, ...estiloEntrada(local, { atraso: 6 }) }}>“{c.bordao}”</div>
      </div>
      <MusicaDeFundo nome={audio.musicaPadrao} comVoz={false} />
    </AbsoluteFill>
  );
};
