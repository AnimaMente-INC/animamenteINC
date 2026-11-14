// Verifica as regras do padrão Animamente no código-fonte:
// 1. Nenhuma cor hex / rgb fora de src/tema/tokens.ts
// 2. Nenhum interpolate / Easing / spring fora de src/animacao (e do Video.tsx, que usa o easing dos tokens)
// 3. Nenhuma fontFamily escrita à mão fora dos arquivos de tema
// 4. Todos os roteiros em /roteiros passam na validação básica
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const raiz = new URL("..", import.meta.url).pathname;
const arquivos = [];
const andar = (d) => {
  for (const n of readdirSync(d)) {
    const p = join(d, n);
    if (statSync(p).isDirectory()) andar(p);
    else if (/\.(tsx?|jsx?)$/.test(n)) arquivos.push(p);
  }
};
andar(join(raiz, "src"));

const problemas = [];
for (const arq of arquivos) {
  const rel = relative(raiz, arq);
  const linhas = readFileSync(arq, "utf8").split("\n");
  linhas.forEach((l, i) => {
    const onde = `${rel}:${i + 1}`;
    const codigo = l.replace(/\/\/.*$/, "");
    if (rel !== "src/tema/tokens.ts" && /#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3}\b|rgba?\(/.test(codigo)) {
      problemas.push(`${onde}  cor escrita à mão (use cores.* de tema/tokens.ts)`);
    }
    if (!rel.startsWith("src/animacao/") && rel !== "src/Video.tsx" && /\b(interpolate|spring|Easing)\b/.test(codigo) && !/^import/.test(l.trim())) {
      problemas.push(`${onde}  animação fora dos helpers (use src/animacao)`);
    }
    if (!rel.startsWith("src/tema/") && /fontFamily\s*:/.test(codigo)) {
      problemas.push(`${onde}  fontFamily à mão (use fonte(...) de useEstilo)`);
    }
  });
}

const TIPOS = ["intro", "pergunta", "explicacao", "diagrama", "comparacao", "lista", "resumo", "outro"];
for (const n of readdirSync(join(raiz, "roteiros"))) {
  if (!n.endsWith(".json")) continue;
  try {
    const r = JSON.parse(readFileSync(join(raiz, "roteiros", n), "utf8"));
    r.cenas.forEach((c, i) => {
      if (!TIPOS.includes(c.tipo)) problemas.push(`roteiros/${n}  cena ${i + 1}: tipo "${c.tipo}" não existe`);
    });
  } catch (e) {
    problemas.push(`roteiros/${n}  JSON inválido: ${e.message}`);
  }
}

if (problemas.length) {
  console.log(`✗ ${problemas.length} problema(s) de padrão:\n` + problemas.map((p) => "  - " + p).join("\n"));
  process.exit(1);
}
console.log("✓ Tudo dentro do padrão Animamente.");
