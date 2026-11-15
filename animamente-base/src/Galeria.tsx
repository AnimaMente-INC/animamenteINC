/**
 * GALERIA — vitrine do design system no estilo da identidade visual:
 * marca, cores, tipografia, personagens (todas as expressões e poses) e todos os componentes.
 * Use como referência visual antes de criar algo novo.
 */
import React from "react";
import { AbsoluteFill } from "remotion";
import { BalaoDeFala } from "./componentes/BalaoDeFala";
import { BarrasPreco } from "./componentes/BarrasPreco";
import { CarimboAno, LinhaDoTempo } from "./componentes/Carimbo";
import { Cartao } from "./componentes/Cartao";
import { Chat } from "./componentes/Chat";
import { ESTILOS_FALA, Fala } from "./componentes/Fala";
import { Medalha, NumeroGigante } from "./componentes/NumeroGigante";
import { Quiz } from "./componentes/Quiz";
import { ESTILOS_TEXTO } from "./componentes/TextoAnimado";
import { Versus } from "./componentes/Versus";
import { ComparacaoMitoVerdade } from "./componentes/ComparacaoMitoVerdade";
import { Constelacao } from "./componentes/Constelacao";
import { Contador } from "./componentes/Contador";
import { Destaque } from "./componentes/Destaque";
import { Etiqueta } from "./componentes/Etiqueta";
import { FaixaCorrida } from "./componentes/FaixaCorrida";
import { FaixaNarrador } from "./componentes/FaixaNarrador";
import { Icone, ICONES } from "./componentes/Icone";
import { JanelaTerminal } from "./componentes/JanelaTerminal";
import { Legenda } from "./componentes/Legenda";
import { Logo, Marca } from "./componentes/Logo";
import { Lousa } from "./componentes/Lousa";
import { MolduraImagem } from "./componentes/MolduraImagem";
import { Objeto, OBJETOS } from "./componentes/Objeto";
import { Conector, Seta } from "./componentes/Seta";
import { TelaRetro } from "./componentes/TelaRetro";
import { TextoImpacto } from "./componentes/TextoImpacto";
import { Titulo } from "./componentes/Titulo";
import { Personagem } from "./personagens/Personagem";
import { EXPRESSOES, IdPersonagem, PERSONAGENS, POSES } from "./personagens/tipos";
import { carregarFontes } from "./tema/carregarFontes";
import { ProvedorEstilo, useEstilo } from "./tema/Estilo";
import { comAlfa, cores, fontes, forma, NomeCor, tamanhosBase } from "./tema/tokens";

carregarFontes();

export const GALERIA = { largura: 2400, altura: 13800 };

const Secao: React.FC<{ titulo: string; children: React.ReactNode }> = ({ titulo, children }) => {
  const { fonte, p } = useEstilo();
  return (
    <section style={{ display: "flex", flexDirection: "column", gap: 40 }}>
      <div style={{ ...fonte("titulo", "subtitulo"), color: p.texto, borderBottom: `3px solid ${comAlfa("lavanda", 0.3)}`, paddingBottom: 14 }}>{titulo}</div>
      {children}
    </section>
  );
};

const Rotulo: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { fonte, p } = useEstilo();
  return <div style={{ ...fonte("texto", "nota"), color: p.textoApoio, textAlign: "center" }}>{children}</div>;
};

const NOMES_CORES: Partial<Record<NomeCor, string>> = {
  tinta: "Tinta",
  coral: "Coral",
  amarelo: "Amarelo",
  lavanda: "Lavanda",
  nevoa: "Névoa",
  ardosia: "Ardósia",
  lilas: "Lilás",
};

const ConteudoGaleria: React.FC = () => {
  const { fonte, p } = useEstilo();
  const ids: IdPersonagem[] = PERSONAGENS;
  const nomes: Record<IdPersonagem, string> = {
    neuro: "Neuro: mascote e narrador",
    lia: "Lia: a gata curiosa",
    bento: "Bento: o cachorro otimista",
    teo: "Teo: o bicho-preguiça sábio",
    caio: "Caio: a lontra brincalhona",
    rafa: "Rafa: o elefante coach",
  };
  return (
    <AbsoluteFill style={{ background: p.fundo }}>
      <Constelacao semente={4} />
      <div style={{ position: "absolute", inset: 0, padding: 110, display: "flex", flexDirection: "column", gap: 90, color: p.texto }}>
        <div style={{ display: "flex", alignItems: "center", gap: 56 }}>
          <Logo tamanho={300} animado={false} />
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 12 }}>
            <div style={{ ...fonte("titulo", "titulo"), fontSize: 140 }}>
              anima<span style={{ color: cores.coral }}>mente</span>
            </div>
            <div style={{ ...fonte("texto", "subtitulo"), color: p.textoApoio }}>Design system de animação · Galeria de referência</div>
          </div>
        </div>

        <Secao titulo="Cores">
          <div style={{ display: "flex", gap: 30, flexWrap: "wrap" }}>
            {(Object.keys(cores) as NomeCor[]).map((n) => (
              <div key={n} style={{ display: "flex", flexDirection: "column", gap: 10, width: 210 }}>
                <div style={{ height: 150, background: cores[n], borderRadius: forma.raioCartao, boxShadow: `inset 0 0 0 3px ${comAlfa("lavanda", 0.35)}` }} />
                <div style={fonte("textoForte", "nota")}>{NOMES_CORES[n] ?? n}</div>
                <div style={{ ...fonte("texto", "nota"), fontSize: 24, color: p.textoApoio }}>{cores[n]}</div>
              </div>
            ))}
          </div>
        </Secao>

        <Secao titulo="Tipografia (só Fredoka)">
          <div style={{ display: "flex", gap: 100, alignItems: "flex-start" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ ...fonte("titulo", "titulo") }}>Fredoka SemiBold</div>
              <div style={{ ...fonte("texto", "nota"), color: p.textoApoio }}>títulos, nome, destaques e fórmulas</div>
              <div style={{ ...fonte("texto", "subtitulo"), marginTop: 16 }}>Fredoka Regular</div>
              <div style={{ ...fonte("texto", "nota"), color: p.textoApoio }}>textos de apoio e legendas</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {(Object.keys(tamanhosBase) as (keyof typeof tamanhosBase)[]).map((t) => (
                <div key={t} style={{ ...fonte("texto", "nota") }}>
                  <span style={{ color: cores.amarelo, fontWeight: fontes.textoForte.peso }}>{t}</span>: {tamanhosBase[t]}px vertical · {Math.round(tamanhosBase[t] * 0.75)}px horizontal
                </div>
              ))}
              <div style={{ marginTop: 16 }}>
                <Titulo texto="Por que o céu é *azul?*" alinhamento="left" tamanho="subtitulo" />
              </div>
              <Titulo texto="Vídeo novo _no canal!_" alinhamento="left" tamanho="subtitulo" />
            </div>
          </div>
        </Secao>

        <Secao titulo="Personagens: expressões">
          {ids.map((id) => (
            <div key={id} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ ...fonte("textoForte", "rotulo"), color: cores.amarelo }}>{nomes[id]}</div>
              <div style={{ display: "flex", gap: 30, alignItems: "flex-end" }}>
                {EXPRESSOES.map((ex) => (
                  <div key={ex} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: 340 }}>
                    <Personagem id={id} expressao={ex} altura={360} />
                    <Rotulo>{ex}</Rotulo>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </Secao>

        <Secao titulo="Personagens: poses">
          {ids.map((id) => (
            <div key={id} style={{ display: "flex", gap: 60, alignItems: "flex-end" }}>
              {POSES.map((po) => (
                <div key={po} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: 380 }}>
                  <Personagem id={id} pose={po} expressao={po === "comemorando" ? "empolgado" : po === "pensando" ? "pensativo" : "feliz"} olhando="direita" altura={360} />
                  <Rotulo>{po}</Rotulo>
                </div>
              ))}
            </div>
          ))}
        </Secao>

        <Secao titulo="Componentes">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 70, alignItems: "center" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 20 }}>
              <Etiqueta texto="Ciência" />
              <Titulo texto="Título de _cena_" alinhamento="left" />
              <Legenda texto="Legenda com *palavra-chave* em destaque" />
            </div>
            <div style={{ paddingBottom: 40 }}>
              <BalaoDeFala texto="Balão de fala com _destaque_!" />
            </div>
            <Cartao titulo="Cartão" texto="Conceito com ícone e texto curto" icone="lampada" cor="coral" />
            <Lousa formula="E = m · c²" rotulo="lousa" />
            <div style={{ position: "relative", height: 220 }}>
              <Seta de={{ x: 20, y: 180 }} para={{ x: 300, y: 40 }} cor="amarelo" />
              <Conector de={{ x: 360, y: 180 }} para={{ x: 680, y: 60 }} curva={-0.2} />
            </div>
            <div style={{ display: "flex", gap: 70, alignItems: "center" }}>
              <Contador ate={1234} rotulo="contador" />
              <div style={{ position: "relative", padding: "20px 40px" }}>
                <div style={fonte("titulo", "subtitulo")}>Destaque</div>
                <div style={{ position: "absolute", inset: "-20px -30px" }}>
                  <Destaque tipo="circulo" altura="100%" />
                </div>
              </div>
            </div>
          </div>
          <ComparacaoMitoVerdade mito="Entropia é só sujeira" verdade="É uma medida de probabilidade" />
          <MolduraImagem descricao="Espaço reservado: a equipe coloca o print aqui" rotulo="Trailer" credito="Imagem: crédito da fonte" />
          <div style={{ display: "flex", gap: 56, alignItems: "center" }}>
            <Marca tamanho="titulo" />
            <Etiqueta texto="Toque no link" cor="coral" tamanho="rotulo" />
            <Etiqueta texto="Você sabia?" cor="amarelo" tamanho="rotulo" />
          </div>
          <div style={{ display: "flex", gap: 30, flexWrap: "wrap" }}>
            {ICONES.map((i, k) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: 120 }}>
                <Icone nome={i} tamanho={96} cor={k % 5 === 3 ? "amarelo" : "coral"} />
                <Rotulo>{i}</Rotulo>
              </div>
            ))}
          </div>
        </Secao>

        <Secao titulo="Modo história (capitulo, impacto, tela, objeto, preco, terminal)">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
              <LinhaDoTempo etapas={["80", "90", "CD", "PS2", "Net", "Hoje"]} atual={2} />
              <CarimboAno texto="Anos 80" />
              <Rotulo>LinhaDoTempo + CarimboAno (cena capitulo)</Rotulo>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
              <TextoImpacto texto="Bora / voltar no / *tempo*!" escala={0.8} />
              <Rotulo>TextoImpacto (cena impacto)</Rotulo>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
              <TelaRetro parado largura={640} />
              <Rotulo>TelaRetro (cena tela)</Rotulo>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <JanelaTerminal linhas={["> código recriado por fãs", "> roda sem emulador"]} titulo="terminal" progresso="Baixando" progressoAte={87} />
              <Rotulo>JanelaTerminal + TextoDigitado (cena terminal)</Rotulo>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <BarrasPreco itens={[{ rotulo: "Original, na loja", valor: 119, cor: "coral" }, { rotulo: "No camelô", valor: 3.33, texto: "3 por R$ 10", cor: "amarelo" }]} />
              <Rotulo>BarrasPreco (cena preco)</Rotulo>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 40, overflow: "hidden", padding: "30px 0" }}>
              <FaixaCorrida texto="3 POR 10" />
              <FaixaNarrador epoca="Anos 80" parado />
              <Rotulo>FaixaCorrida e FaixaNarrador (Neuro narrando no canto)</Rotulo>
            </div>
          </div>
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
            {OBJETOS.map((o) => (
              <div key={o} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: 340 }}>
                <Objeto nome={o} tamanho={300} parado />
                <Rotulo>{o}</Rotulo>
              </div>
            ))}
          </div>
        </Secao>

        <Secao titulo="Modelos de fala (estiloFala)">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 90, alignItems: "center", justifyItems: "center" }}>
            {ESTILOS_FALA.map((e) => (
              <div key={e} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 70 }}>
                <Fala estilo={e} quem="lia" texto="Hum... será _mesmo_ assim?" duracaoFala={30} larguraMax={560} />
                <Rotulo>{e}</Rotulo>
              </div>
            ))}
          </div>
        </Secao>

        <Secao titulo="Modelos de texto (estiloTexto)">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 70, alignItems: "center" }}>
            {ESTILOS_TEXTO.map((m) => (
              <div key={m} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
                <Titulo texto="Por que o céu é *azul?*" tamanho="subtitulo" modelo={m} />
                <Rotulo>{m}</Rotulo>
              </div>
            ))}
          </div>
        </Secao>

        <Secao titulo="Modelos de vídeo (quiz, versus, numero, ranking, passos, chat) e mapa mental">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 90, alignItems: "center" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
              <Quiz opcoes={["Fígado", "Pele", "Pulmão"]} correta={1} revelarEm={0} parado />
              <Rotulo>Quiz (cena quiz): alternativas, barra de tempo e resposta</Rotulo>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20, paddingTop: 60 }}>
              <Versus parado lados={[{ titulo: "Bactéria", cor: "amarelo", itens: ["É uma célula viva", "Antibiótico funciona"] }, { titulo: "Vírus", cor: "coral", itens: ["É muito menor", "Antibiótico não funciona"] }]} />
              <Rotulo>Versus (cena versus)</Rotulo>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
              <NumeroGigante valor={206} rotulo="ossos no corpo de um adulto" parado escala={0.7} />
              <Rotulo>NumeroGigante (cena numero)</Rotulo>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
              <div style={{ display: "flex", gap: 40 }}>
                <Medalha posicao={3} parado tamanho={220} />
                <Medalha posicao={2} parado tamanho={220} />
                <Medalha posicao={1} parado tamanho={220} />
              </div>
              <Rotulo>Medalha (cena ranking) · a cena passos usa LinhaDoTempo + Etiqueta + Cartao</Rotulo>
            </div>
          </div>
          <div style={{ width: 1100, alignSelf: "center", display: "flex", flexDirection: "column", gap: 20 }}>
            <Chat parado mensagens={[{ quem: "lia", texto: "Teo, por que o céu é *azul*?" }, { quem: "teo", texto: "Porque o ar espalha mais a luz _azul_." }]} />
            <Rotulo>Chat (cena chat): a última mensagem é a fala da cena · Mapa mental: ver roteiros/modelo-mapa-mental.json</Rotulo>
          </div>
        </Secao>
      </div>
    </AbsoluteFill>
  );
};

export const Galeria: React.FC = () => (
  <ProvedorEstilo formato="horizontal">
    <ConteudoGaleria />
  </ProvedorEstilo>
);
