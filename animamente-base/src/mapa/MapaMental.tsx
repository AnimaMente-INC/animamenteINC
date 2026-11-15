/**
 * MAPA MENTAL — modelo de vídeo em CÂMERA CONTÍNUA (roteiro com "modelo": "mapa").
 *
 * Em vez de cenas que trocam, o vídeo inteiro é UM mapa de neurônios: o tema fica no centro e cada
 * ideia é um nó ligado por um traço-neurônio. A câmera voa de um nó para o outro enquanto o traço
 * se desenha e um impulso Amarelo corre por ele. Quem narra fica no rodapé, com legenda karaokê.
 * No fim (cena `outro`), a câmera se afasta e mostra o mapa inteiro pulsando, com a marca.
 *
 * Roteiro: cenas do tipo `no` (titulo, texto?, icone?, cor?, de?, narracao, narrador?, expressao?)
 * e um `outro` opcional no fim. O primeiro nó é o centro. `de` diz de qual nó este sai (padrão: 0).
 * As vozes, a música, a barra de progresso e o roteiro de locução funcionam como nos outros vídeos.
 */
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { desenharTraco, estiloEntrada, pulsar, stagger, viajar } from "../animacao";
import { Fundo } from "../cenas/LayoutCena";
import { estiloPainel } from "../componentes/Cartao";
import { Etiqueta } from "../componentes/Etiqueta";
import { LegendaKaraoke } from "../componentes/Fala";
import { Icone } from "../componentes/Icone";
import { Logo, Marca } from "../componentes/Logo";
import { TextoAnimado } from "../componentes/TextoAnimado";
import { Titulo } from "../componentes/Titulo";
import { Personagem } from "../personagens/Personagem";
import { COR_PERSONAGEM, IdPersonagem, NOMES_PERSONAGENS, Ponto } from "../personagens/tipos";
import { CenaRoteiro, falaDaCena, framesCenas, ManifestoVozes, Roteiro, seg, vozDaCena } from "../roteiro";
import { useEstilo } from "../tema/Estilo";
import { cores, forma, mapa, tempos } from "../tema/tokens";

const rad = (graus: number) => (graus * Math.PI) / 180;

/** Posição de cada nó no mapa: o centro em (0,0), os filhos dele em volta e os netos abrindo em leque. */
export const posicoesDoMapa = (cenas: CenaRoteiro[]): (Ponto | null)[] => {
  const pai = (i: number) => cenas[i].de ?? 0;
  const filhos = (k: number) => cenas.map((c, i) => (c.tipo === "no" && i > 0 && pai(i) === k ? i : -1)).filter((i) => i >= 0);
  const pos: (Ponto | null)[] = cenas.map(() => null);
  pos[0] = { x: 0, y: 0 };
  const doCentro = filhos(0);
  doCentro.forEach((i, k) => {
    const a = rad(-90 + (k * 360) / doCentro.length);
    pos[i] = { x: Math.cos(a) * mapa.raio, y: Math.sin(a) * mapa.raio };
  });
  cenas.forEach((c, i) => {
    if (c.tipo !== "no" || i === 0 || pai(i) === 0) return;
    const p = pos[pai(i)]!;
    const avo = pos[pai(pai(i))]!;
    const irmaos = filhos(pai(i));
    const base = Math.atan2(p.y - avo.y, p.x - avo.x);
    const a = base + rad((irmaos.indexOf(i) - (irmaos.length - 1) / 2) * mapa.abertura);
    pos[i] = { x: p.x + Math.cos(a) * mapa.raioFilho, y: p.y + Math.sin(a) * mapa.raioFilho };
  });
  return pos;
};

/** Traço curvo entre dois nós (Bézier de 2º grau) e um ponto ao longo dele. */
const curvaEntre = (a: Ponto, b: Ponto, lado: number) => {
  const c = { x: (a.x + b.x) / 2 - (b.y - a.y) * 0.14 * lado, y: (a.y + b.y) / 2 + (b.x - a.x) * 0.14 * lado };
  const em = (t: number): Ponto => ({ x: (1 - t) ** 2 * a.x + 2 * (1 - t) * t * c.x + t * t * b.x, y: (1 - t) ** 2 * a.y + 2 * (1 - t) * t * c.y + t * t * b.y });
  return { d: `M ${a.x} ${a.y} Q ${c.x} ${c.y} ${b.x} ${b.y}`, em };
};

const NoCentral: React.FC<{ cena: CenaRoteiro; categoria?: string }> = ({ cena, categoria }) => {
  const { p } = useEstilo();
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 26, width: 900, padding: "40px 30px", background: p.fundo, borderRadius: forma.raioCartao * 2 }}>
      <Logo tamanho={300} />
      {categoria && <Etiqueta texto={categoria} tamanho="rotulo" atraso={tempos.entrada * 1.5} animar />}
      <Titulo texto={cena.titulo ?? ""} atraso={tempos.entrada * 2} />
      {cena.texto && <TextoAnimado texto={cena.texto} fonte="texto" tamanho="legenda" cor={p.textoApoio} atraso={tempos.entrada * 3} larguraMax="18em" />}
    </div>
  );
};

const CartaoNo: React.FC<{ cena: CenaRoteiro; chega: number; ativo: boolean }> = ({ cena, chega, ativo }) => {
  const frame = useCurrentFrame();
  const { fonte, p, tema } = useEstilo();
  const cor = cena.cor ?? "coral";
  const icone = 132;
  return (
    <div style={{ ...estiloEntrada(frame, { atraso: chega - tempos.entrada * 0.5, tipo: "pop" }), width: mapa.larguraNo, background: p.fundo, borderRadius: forma.raioCartao, outline: `${forma.traco}px solid ${ativo ? cores.nevoa : cores.ardosia}` }}>
      <div style={{ ...estiloPainel(tema), display: "flex", flexDirection: "column", alignItems: "center", gap: 14, padding: `${cena.icone ? icone / 2 + 18 : 36}px 40px 40px`, position: "relative" }}>
        {cena.icone && (
          <div style={{ position: "absolute", top: -icone / 2, left: "50%", marginLeft: -icone / 2, borderRadius: forma.raioPilula, outline: `${forma.borda}px solid ${cores.nevoa}`, lineHeight: 0 }}>
            <Icone nome={cena.icone} cor={cor} tamanho={icone} />
          </div>
        )}
        <div style={{ ...fonte("titulo", "subtitulo"), color: cor === "lavanda" ? p.texto : tema === "claro" && cor === "amarelo" ? cores.coral : cores[cor], textAlign: "center", lineHeight: 1.05 }}>{(cena.titulo ?? "").replace(/[*_]/g, "")}</div>
        {cena.texto && <TextoAnimado texto={cena.texto} fonte="texto" tamanho="rotulo" atraso={chega + 4} porPalavra={2} />}
      </div>
    </div>
  );
};

export const MapaMental: React.FC<{ roteiro: Roteiro; vozes?: ManifestoVozes | null }> = ({ roteiro, vozes }) => {
  const frame = useCurrentFrame();
  const { dim, area, formato, p } = useEstilo();
  const cenas = roteiro.cenas;
  const frames = framesCenas(roteiro, vozes);
  const inicios = frames.map((_, i) => frames.slice(0, i).reduce((a, b) => a + b, 0));
  const pos = posicoesDoMapa(cenas);
  const nos = cenas.map((c, i) => (c.tipo === "no" ? i : -1)).filter((i) => i >= 0);
  const ultimoNo = nos[nos.length - 1];
  const atual = Math.max(0, inicios.findIndex((ini, i) => frame >= ini && frame < ini + frames[i]));
  const cena = cenas[atual];
  const t = frame - inicios[atual];

  // ── janela do mapa (em cima) e rodapé de quem narra (embaixo) ──
  const vertical = formato === "vertical";
  const rodape = Math.round(mapa.rodape * (vertical ? 1 : 0.62));
  const janela = { altura: area.y + area.altura - rodape };
  const centro = { x: dim.largura / 2, y: (area.y + janela.altura) / 2 + (vertical ? 20 : 0) };

  // ── câmera ──
  const xs = nos.map((i) => pos[i]!.x);
  const ys = nos.map((i) => pos[i]!.y);
  const caixa = { x0: Math.min(...xs), x1: Math.max(...xs), y0: Math.min(...ys), y1: Math.max(...ys) };
  const zoomTudo = Math.min(1, (dim.largura * 0.94) / (caixa.x1 - caixa.x0 + mapa.larguraNo * mapa.escalaFinal), ((janela.altura - area.y) * 0.94) / (caixa.y1 - caixa.y0 + 460));
  let cam: Ponto;
  let zoom: number;
  let afastou = 0;
  if (cena.tipo === "no") {
    const de = pos[atual === 0 ? 0 : nos[nos.indexOf(atual) - 1]]!;
    const para = pos[atual]!;
    const k = atual === 0 ? 1 : viajar(t);
    cam = { x: de.x + (para.x - de.x) * k, y: de.y + (para.y - de.y) * k };
    zoom = 1 - (1 - mapa.zoomViagem) * Math.sin(Math.PI * k);
  } else {
    const de = pos[ultimoNo]!;
    const k = viajar(t, tempos.viagemMapa * 1.6);
    cam = { x: de.x + ((caixa.x0 + caixa.x1) / 2 - de.x) * k, y: de.y + ((caixa.y0 + caixa.y1) / 2 - de.y) * k };
    zoom = 1 + (zoomTudo - 1) * k;
    afastou = k;
  }
  const noFim = cena.tipo !== "no";

  // ── quem narra ──
  const fala = falaDaCena(cena);
  const voz = vozDaCena(roteiro, atual, vozes);
  const quem: IdPersonagem = noFim ? "neuro" : fala?.quem ?? "neuro";
  const quemDe = (i: number): IdPersonagem => (cenas[i].tipo !== "no" ? "neuro" : falaDaCena(cenas[i])?.quem ?? "neuro");
  let desde = atual;
  while (desde > 0 && quemDe(desde - 1) === quem) desde--;
  const alturaNarrador = Math.round(mapa.alturaNarrador * (vertical ? 1 : 0.62));

  return (
    <Fundo semente={7}>
      <AbsoluteFill style={{ height: janela.altura, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, top: 0, transformOrigin: "0 0", transform: `translate(${centro.x}px, ${centro.y}px) scale(${zoom}) translate(${-cam.x}px, ${-cam.y}px)` }}>
          <svg width={1} height={1} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
            {nos.slice(1).map((i) => {
              if (frame < inicios[i]) return null;
              const a = pos[cenas[i].de ?? 0]!;
              const b = pos[i]!;
              const c = curvaEntre(a, b, i % 2 ? 1 : -1);
              const k = viajar(frame - inicios[i]);
              // durante a viagem o impulso vai junto com a câmera; no fim, os impulsos correm por todo o mapa
              const impulso = noFim ? c.em(((t + stagger(i * 3)) % (tempos.viagemMapa * 2)) / (tempos.viagemMapa * 2)) : k > 0 && k < 1 ? c.em(k) : null;
              return (
                <g key={i}>
                  <path d={c.d} fill="none" stroke={p.linha} strokeWidth={forma.traco} strokeLinecap="round" pathLength={1} style={desenharTraco(frame, 1, inicios[i], tempos.viagemMapa)} />
                  {impulso && <circle cx={impulso.x} cy={impulso.y} r={forma.traco * 2.4} fill={cores.amarelo} />}
                </g>
              );
            })}
          </svg>
          {nos.map((i) => {
            if (frame < inicios[i]) return null;
            const pt = pos[i]!;
            const brilho = noFim ? (1 + (i === 0 ? 0 : mapa.escalaFinal - 1) * afastou) * (1 + 0.04 * pulsar(t + i * 9)) : 1;
            return (
              <div key={i} style={{ position: "absolute", left: pt.x, top: pt.y, transform: `translate(-50%, -50%) scale(${brilho})` }}>
                {i === 0 ? <NoCentral cena={cenas[0]} categoria={roteiro.categoria} /> : <CartaoNo cena={cenas[i]} chega={inicios[i] + tempos.viagemMapa} ativo={i === atual} />}
              </div>
            );
          })}
        </div>
      </AbsoluteFill>

      {/* rodapé: quem narra + legenda karaokê (ou a chamada final) */}
      <div style={{ position: "absolute", left: area.x, top: janela.altura, width: area.largura, height: rodape, display: "flex", alignItems: "flex-end", gap: 28 }}>
        <div key={quem} style={{ ...estiloEntrada(frame, { atraso: inicios[desde] + (desde === 0 ? tempos.entrada : 0), tipo: "subir" }), flexShrink: 0, lineHeight: 0 }}>
          <Personagem
            id={quem}
            altura={alturaNarrador}
            pose={noFim ? "acenando" : "parado"}
            expressao={cena.expressao ?? "feliz"}
            olhando={noFim ? "frente" : "direita"}
            narraEm={fala && voz ? inicios[atual] + fala.em : undefined}
            duracaoFala={fala && voz ? seg(voz.duracao) : undefined}
            semBalao
          />
        </div>
        <div style={{ flex: 1, alignSelf: "center", display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 12 }}>
          {noFim ? (
            <>
              <Titulo texto={cena.chamada ?? "Continue _aprendendo_!"} tamanho="subtitulo" atraso={inicios[atual] + tempos.entrada} alinhamento="left" modelo="palavra" />
              <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
                <Marca tamanho="legenda" slogan={false} atraso={inicios[atual] + tempos.entrada * 2} />
                <Etiqueta texto={cena.botao ?? "Siga para mais"} cor="coral" tamanho="nota" atraso={inicios[atual] + tempos.entrada * 3} animar />
              </div>
            </>
          ) : (
            fala &&
            voz && (
              <div key={atual} style={{ ...estiloEntrada(frame, { atraso: inicios[atual] + fala.em - tempos.entrada * 0.5, tipo: "subir" }), display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 10 }}>
                <Etiqueta texto={NOMES_PERSONAGENS[quem]} cor={COR_PERSONAGEM[quem]} tamanho="nota" />
                <LegendaKaraoke texto={fala.texto} atraso={inicios[atual] + fala.em} duracaoFala={seg(voz.duracao)} alinhamento="left" tamanho="rotulo" />
              </div>
            )
          )}
        </div>
      </div>

      {cenas.map((c, i) => {
        const f = falaDaCena(c);
        const v = vozDaCena(roteiro, i, vozes);
        return v?.arquivo && f ? (
          <Sequence key={i} from={inicios[i] + f.em} layout="none">
            <Audio src={staticFile(v.arquivo)} />
          </Sequence>
        ) : null;
      })}
    </Fundo>
  );
};
