# AnimamenteINC — instruções para o Claude

Canal educativo **animamente** ("o mundo explicado em animação"): vídeos animados para Instagram e YouTube.

## Pastas

- `animamente-base/` — base de animação em Remotion (design system). Roteiros em `roteiros/`, vídeos renderizados em `out/`.
- `Dublador/` — app Python para a equipe gravar a voz por cima do vídeo pronto (`ABRIR_DUBLADOR.bat`), usado só quando o vídeo é pedido para dublar. Vídeos finais em `Dublador/videos_finalizados/`.
- `animamente-identidade-visual/` — logos e peças oficiais.

## Regra principal: SEMPRE que for criar um vídeo com roteiro

Siga o **prompt 1** de `animamente-base/prompt-base-animacao-animamente.md`. Leia esse arquivo antes de começar. Em resumo:

1. **Antes de tudo**, leia `animamente-base/STYLE_GUIDE.md` e `animamente-base/src/tema/tokens.ts` e siga-os à risca: fundo Tinta com constelação de neurônios, destaques só Coral/Amarelo/Lavanda, só Fredoka, estilo adesivo com borda Névoa, personagens Neuro e o elenco em colagem de papel (Lia a gata, Bento o cachorro, Teo o bicho-preguiça, Rafa o elefante, Caio a lontra), tempos e transições da base.
2. **Crie apenas um roteiro novo** em `animamente-base/roteiros/<id>.json` (com `"id"`) e registre em `src/Root.tsx`. Só crie componente ou cena nova se nenhum existente servir; nesse caso use os tokens e helpers da base e adicione ao `STYLE_GUIDE.md` e à Galeria.
3. **Áudio (padrão): música de fundo baixa e animada, escolhida em `animamente-base/public/musica/CATALOGO.md` (`animada-1/2/3` ou as faixas CC0 sem copyright; varie a cada vídeo) e vozes de IA.** Coloque `"vozesIA": true` no roteiro e rode `python3 scripts/gerar-vozes.py roteiros/<id>.json` antes de renderizar. As vozes vêm de `src/tema/vozes.json`.
4. **Só faça sem voz e com roteiro de locução quando o pedido for para dublar** (falar em "para dublar", "para a equipe gravar", "para o Dublador", "sem voz" ou "com roteiro de locução"). Na dúvida, use voz de IA.
5. **Falas (nos dois modos):**
   - uma fala por cena, com no máximo ~16 palavras;
   - frases curtas e faladas, sem parênteses e sem começar linha com `[`;
   - todo personagem que fala tem `"expressao"` definida.
6. **Entrega no modo padrão (voz de IA), nesta ordem:**
   1. `roteiros/<id>.json`;
   2. o vídeo renderizado em `out/<id>.mp4`, já com música e vozes;
   3. a conferência de que todas as falas tocam e de que a música abaixa durante as falas.

   No final, informe o caminho do vídeo pronto. Não gere roteiro de locução.
7. **Entrega no modo dublagem (só a pedido), nesta ordem:**
   1. `roteiros/<id>.json`, sem `"vozesIA"`, com cada cena durando pelo menos o tempo da fala (2,4 palavras por segundo) + 1 segundo;
   2. o vídeo renderizado **uma vez**, sem voz, em `out/<id>.mp4`. Não importe gravações nem ajuste o vídeo à voz (`importar-gravacoes.py` é só alternativa, a pedido);
   3. o roteiro de locução: rode `npm run locucao -- roteiros/<id>.json` e confira `roteiros/locucao/<id>.dublador.txt` e `<id>.md` (blocos em ordem de tempo, sem sobreposição, último bloco terminando antes do fim do vídeo). Se uma fala não couber, encurte a fala ou aumente a `"duracao"` da cena e gere vídeo e roteiro de novo.

   No final, informe os dois caminhos para abrir no Dublador: o do vídeo (`.mp4`) e o do roteiro (`.dublador.txt` ou `.md`).

Se o pedido não disser tema, formato (vertical ou horizontal), duração e público, pergunte antes de criar.

## Modelos de vídeo, fala e texto

A base tem modelos prontos (detalhes em `animamente-base/STYLE_GUIDE.md`, seções 8.1 a 8.4). Parta do roteiro de exemplo e troque o conteúdo:

- **Vídeo:** quiz (`modelo-quiz.json`), duelo (`modelo-duelo.json`), top 3 (`modelo-top3.json`), passo a passo (`modelo-passo-a-passo.json`), conversa em chat (`modelo-conversa.json`) e mapa mental em câmera contínua (`modelo-mapa-mental.json`, com `"modelo": "mapa"`).
- **Fala** (`"estiloFala"`): balao, pensamento, grito, legenda (karaokê), faixa ou recado.
- **Texto dos títulos** (`"estiloTexto"`): palavra, maquina, marcador, onda ou recorte.

- **Tema música** (STYLE_GUIDE 8.5): `"fundo": "musical"`, `"figurino": "maestro"` (Neuro de fraque e batuta, pose `regendo`), `pauta` (pentagrama) e quiz com contagem regressiva (`"tempoResposta": 10`). Exemplo: `roteiros/quiz-musica.json`.

Se o pedido não disser o modelo, escolha o que combina com o tema e varie de um vídeo para o outro. Personagens, vozes, cores e fonte não mudam em nenhum modelo. Exemplos renderizados: `VIDEOS E ROTEIROS/MODELOS NOVOS/`.

## Formato do roteiro de locução (Dublador, só no modo dublagem)

```
[00:03.5 - 00:07.2] Neuro
(começa sorrindo e termina empolgado) Eu sou o Neuro, o cérebro desta turma!
```

`[início - fim] Quem fala`, texto na linha de baixo, `(parênteses)` = jeito de falar (não é lido), `#` = comentário, pelo menos 0,3 s de respiro entre falas. Os tempos vêm de `npm run locucao`, nunca escritos à mão. Regras completas em `Dublador/LEIA-ME.md`.

## Organização e limpeza (obrigatório ao terminar um vídeo)

- `animamente-base/` guarda **só código, prompt e referências**: `src/`, `scripts/`, `roteiros/*.json`, `STYLE_GUIDE.md`, `prompt-base-animacao-animamente.md`, `public/musica/` e `referencia/` (galeria e elenco, para os próximos vídeos saírem parecidos).
- Vídeo pronto: **mova** o `.mp4` final (e, se quiser, o roteiro de locução e a capa) de `out/` para `VIDEOS E ROTEIROS/<tema>/`. Depois deixe `out/` vazio.
- **Não salve** o que sobra do processo: `.wav`, vozes (incluindo `public/vozes/<id>/` das vozes de IA, depois do render), gravações do Dublador (`Dublador/projetos`), `.venv`, `__pycache__`, renders de teste, imagens/trailers usados só naquele vídeo, `_to_delete`.
- Em `Dublador/` ficam só o código, os `.bat`/`.md` e `videos_finalizados/` (apenas `.mp4`).
- Mantenha o roteiro `.json` de cada vídeo em `animamente-base/roteiros/` como referência de estilo.

## Vozes dos personagens (padrão fixo)

- A modulação de cada personagem (voz, velocidade, tom, direção) fica em `animamente-base/src/tema/vozes.json`, igual à do vídeo gta6-vs-zelda. Amostras em `animamente-base/vozes-referencia/`. Nunca mude sem pedido; use sempre esse arquivo nas falas e no roteiro de locução.

## Graphify (grafo de conhecimento do projeto)

- O grafo está em `graphify-out/` (`GRAPH_REPORT.md`, `graph.html`, `graph.json`). Antes de buscar em arquivos, consulte-o: `graphify query "<pergunta>"`.
- Depois de mudar código, atualize com `graphify update .` (sem IA). Para docs e imagens, use `/graphify . --update`.
- No Windows, instale uma vez: `pip install graphifyy` (ou `uv tool install graphifyy`). Os hooks em `.claude/settings.json` chamam o comando `graphify`.

## Respostas a comentários (Neuro)

- Quando o pedido for um comentário, pergunta ou resposta pela metade do Instagram/YouTube, responda sempre como o Neuro, seguindo `PROMPT-NEURO-COMENTARIOS.md` (leia esse arquivo antes): tom humanizado, exemplo simples, pedido de tema para o próximo vídeo e emoji no final.

## Outras regras

- Nenhuma cor, fonte, tamanho ou tempo fora de `src/tema/tokens.ts`.
- Não instale `node_modules` nem `.venv` por um ambiente Linux dentro desta pasta: ela é usada no Windows.
- Não faça commit no git sem pedido.

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:
- When graphify-out/graph.json exists, run `graphify query "<question>"` before your first grep, search or source-file read for a codebase question, and put this rule in every subagent prompt that explores code. Read raw files only for lines the graph or an earlier read already located. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
- A committed graphify-out/graph.json is rewritten whole on every build, so a large diff to it in a pull request is expected. Do not flag it as churn or suggest skipping the graph rebuild or its hooks.
