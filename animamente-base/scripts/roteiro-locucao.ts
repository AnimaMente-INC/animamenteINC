/**
 * ROTEIRO DE LOCUÇÃO — tudo o que é falado no vídeo, para a equipe gravar com a própria voz.
 * Gerado SEMPRE junto com cada vídeo (padrão do canal: música de fundo, sem vozes de IA).
 *
 * Uso:
 *   npm run locucao -- roteiros/meu-video.json
 *
 * Saídas:
 *   roteiros/locucao/<id>.dublador.txt — roteiro pronto para abrir no Dublador Animamente
 *     (../Dublador/ABRIR_DUBLADOR.bat): um bloco "[mm:ss.d - mm:ss.d] Quem fala" por fala,
 *     com os tempos exatos do vídeo renderizado.
 *   roteiros/locucao/<id>.md — o mesmo conteúdo para leitura: tempo de cada fala, quem fala,
 *     o texto, quanto tempo cabe, o jeito de falar e o nome do arquivo da gravação.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, dirname, join } from "node:path";
import vozes from "../src/tema/vozes.json";
import { comPadroes, falaDaCena, framesCenas, Roteiro, vozDaCena } from "../src/roteiro";
import { IdPersonagem } from "../src/personagens/tipos";
import { audio, fps, tempos } from "../src/tema/tokens";

const NOMES: Record<IdPersonagem, string> = { neuro: "Neuro", lia: "Lia", bento: "Bento", teo: "Teo", caio: "Caio", rafa: "Rafa" };
const PAPEIS: Record<IdPersonagem, string> = {
  neuro: "mascote e narrador",
  lia: "a gata curiosa",
  bento: "o cachorro otimista",
  teo: "o bicho-preguiça sábio",
  caio: "a lontra brincalhona",
  rafa: "o elefante coach",
};
const EMOCAO: Record<string, string> = {
  neutro: "natural",
  feliz: "sorrindo",
  surpreso: "surpreso",
  pensativo: "pensativo",
  confuso: "em dúvida",
  empolgado: "empolgado",
};

const num = (n: number) => n.toFixed(1).replace(".", ",");
const tempo = (frames: number) => {
  const s = frames / fps;
  const m = Math.floor(s / 60);
  return `${m}:${(s - m * 60).toFixed(1).padStart(4, "0")}`;
};
/** *destaque* e _destaque_ viram negrito (= dar ênfase ao falar). */
const enfase = (t: string) => t.replace(/\*([^*]+)\*/g, "**$1**").replace(/_([^_]+)_/g, "**$1**");

const arq = process.argv[2];
if (!arq) {
  console.error("Uso: npm run locucao -- roteiros/meu-video.json");
  process.exit(1);
}
const roteiro = JSON.parse(readFileSync(arq, "utf8")) as Roteiro;
const id = roteiro.id ?? basename(arq, ".json");
const frames = framesCenas(roteiro, null);
const total = frames.reduce((a, b) => a + b, 0) - tempos.transicao * Math.max(0, frames.length - 1);

let inicio = 0;
const falas: string[] = [];
const elenco = new Set<IdPersonagem>();
const mapa: { fala: number; cena: number; quem: IdPersonagem }[] = [];
const dublador: { de: number; ate: number; quem: string; texto: string; emocao: string }[] = [];
roteiro.cenas.forEach((bruta, i) => {
  const cena = comPadroes(bruta);
  const f = falaDaCena(cena);
  if (f) {
    const v = vozDaCena(roteiro, i, null)!;
    const de = inicio + f.em;
    const ate = de + Math.round(v.duracao * fps);
    const p = cena.personagens?.find((x) => x.id === f.quem);
    // emoção inicial e as mudanças de expressão durante a fala
    const emocoes = [p?.expressao ? EMOCAO[p.expressao] : "natural"];
    (p?.mudancas ?? []).forEach((m) => {
      if (m.expressao && EMOCAO[m.expressao] !== emocoes[emocoes.length - 1]) emocoes.push(EMOCAO[m.expressao]);
    });
    const emocao = emocoes.length > 1 ? `começa ${emocoes[0]} e termina ${emocoes[emocoes.length - 1]}` : emocoes[0];
    const off = f.tipo === "narracao" ? (p ? "narração (aparece na cena e a boca mexe)" : "narração em off (não aparece na cena)") : "fala com balão";
    const n = falas.length + 1;
    mapa.push({ fala: n, cena: i, quem: f.quem });
    const palavras = f.texto.replace(/[*_]/g, "").split(/\s+/).filter(Boolean).length;
    elenco.add(f.quem);
    dublador.push({ de, ate, quem: NOMES[f.quem], texto: f.texto.replace(/[*_]/g, "").trim(), emocao });
    falas.push(
      [
        `### ${n}. ${NOMES[f.quem]} · ${tempo(de)} → ${tempo(ate)}`,
        "",
        `> ${enfase(f.texto)}`,
        "",
        `- **Cabe em:** cerca de ${num(v.duracao)}s (${palavras} palavras)`,
        `- **Jeito de falar:** ${emocao}, ${off}`,
        `- **Salvar como:** \`fala${String(n).padStart(2, "0")}.wav\` (cena ${i + 1}, ${cena.tipo})`,
        "",
      ].join("\n"),
    );
  }
  inicio += frames[i] - tempos.transicao;
});

const linhasElenco = [...elenco].map(
  (q) => `| ${NOMES[q]} (${PAPEIS[q]}) | ______________ | ${(vozes as Record<string, { direcao?: string }>)[q]?.direcao ?? ""} |`,
);

const md = `# Roteiro de locução: ${roteiro.titulo.replace(/[*_]/g, "")}

**Vídeo:** \`${id}\` · ${roteiro.formato} · duração total ${tempo(total)} · música de fundo: ${roteiro.musica === false ? "nenhuma" : roteiro.musica ?? audio.musicaPadrao} (baixa)
**Falas:** ${falas.length} · o vídeo foi gerado **sem vozes de IA**. Tudo o que está aqui é para a equipe gravar.

## Elenco

| Personagem | Quem grava | Jeito de falar |
|---|---|---|
${linhasElenco.join("\n")}

## Falas (na ordem do vídeo)

As palavras em **negrito** são os destaques da tela: dê ênfase a elas. O tempo mostra onde a fala entra no vídeo. Se a gravação ficar um pouco mais longa, tudo bem, porque o vídeo se ajusta sozinho quando você importa as gravações.

${falas.join("\n")}
## Como gravar e colocar no vídeo

**Jeito padrão: Dublador Animamente.** Abra \`Dublador/ABRIR_DUBLADOR.bat\`, clique em "Abrir vídeo" (o .mp4 deste vídeo) e em "Abrir roteiro" (\`roteiros/locucao/${id}.dublador.txt\`). Grave fala por fala lendo o teleprompter, revise e exporte. O vídeo final sai em \`Dublador/videos_finalizados/\`.

**Jeito alternativo (o vídeo se ajusta à voz):**

1. Grave **uma fala por arquivo**, em lugar silencioso, com o celular a um palmo da boca.
2. Deixe meio segundo de silêncio antes e depois. O silêncio extra é cortado automaticamente.
3. Salve cada fala com o nome indicado (\`fala01.wav\`, \`fala02.wav\`...). Também valem \`.mp3\`, \`.m4a\` e \`.ogg\`.
4. Coloque tudo numa pasta e rode:
   \`python3 scripts/importar-gravacoes.py ${arq} pasta-das-gravacoes/\`
5. Renderize de novo: a voz de vocês toca no lugar certo, a boca e o balão acompanham, e a música abaixa um pouco sozinha.
`;

// ---- Roteiro no formato do Dublador Animamente (regras em ../Dublador/LEIA-ME.md) ----
const RESPIRO = Math.round(0.3 * fps); // silêncio mínimo entre o fim de uma fala e o início da próxima
const tempoDub = (frames: number) => {
  const d = Math.round((Math.max(0, frames) / fps) * 10); // décimos de segundo
  return `${String(Math.floor(d / 600)).padStart(2, "0")}:${((d % 600) / 10).toFixed(1).padStart(4, "0")}`;
};
const blocos = dublador.map((b, i) => {
  const limite = i + 1 < dublador.length ? dublador[i + 1].de - RESPIRO : total;
  const fim = Math.max(b.de + Math.round(0.5 * fps), Math.min(b.ate, limite));
  const instrucao = b.emocao === "natural" ? "" : `(${b.emocao}) `;
  return `[${tempoDub(b.de)} - ${tempoDub(fim)}] ${b.quem}\n${instrucao}${b.texto}\n`;
});
const txtDublador = `# Roteiro de locução (formato do Dublador Animamente)
# Título: ${roteiro.titulo.replace(/[*_]/g, "")}
# Vídeo: ${id}.mp4 · ${roteiro.formato} · duração ${tempo(total)}
# Como usar: abra o Dublador, clique em "Abrir vídeo" (o .mp4 renderizado deste roteiro)
# e depois em "Abrir roteiro" (este arquivo). O texto entre parênteses é o jeito de falar e não é lido.
# Arquivo gerado por "npm run locucao". Se o roteiro .json mudar, gere de novo.

${blocos.join("\n")}`;

const destino = join(dirname(arq), "locucao", `${id}.md`);
mkdirSync(dirname(destino), { recursive: true });
writeFileSync(destino, md);
// mapa fala → cena, usado pelo importador de gravações
writeFileSync(join(dirname(arq), "locucao", `${id}.falas.json`), JSON.stringify({ id, falas: mapa }, null, 2));
const destinoDublador = join(dirname(arq), "locucao", `${id}.dublador.txt`);
writeFileSync(destinoDublador, txtDublador);
console.log(`✓ ${destino} (${falas.length} falas, ${tempo(total)})`);
console.log(`✓ ${destinoDublador} (abrir no Dublador junto com o vídeo renderizado)`);
