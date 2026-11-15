# animamente-base — antes de qualquer animação

Esta pasta é a base de animação (Remotion) do canal **animamente**. Antes de criar ou mudar **qualquer** animação (vídeo novo, cena, componente, personagem ou roteiro), siga os dois passos abaixo, nesta ordem. Não pule nenhum.

## 1. Consulte o grafo (graphify) primeiro

O grafo do projeto está em `../graphify-out/` (`graph.json`, `GRAPH_REPORT.md`, `graph.html`). Use-o **antes** de abrir arquivos de código:

- `graphify query "<pergunta>"`: contexto geral. Exemplo: `graphify query "como uma cena usa os personagens em colagem"`.
- `graphify explain "<nó>"`: um componente ou conceito. Exemplos: `graphify explain "Mandibula()"`, `graphify explain "tokens.ts"`.
- `graphify path "<A>" "<B>"`: como duas partes se ligam. Exemplo: `graphify path "roteiro.ts" "Video.tsx"`.

Regras:
- Leia o código-fonte só nas linhas que o grafo já apontou (`source_location`).
- Antes de criar componente ou cena nova, pergunte ao grafo se já existe algo que sirva (comunidades "Helpers de Animação", "Elenco em Colagem", "Validação e Cenas", "Cenas do Passeio").
- Depois de mudar código, atualize o grafo com `graphify update .` (sem IA). Depois de mudar docs ou imagens, use `/graphify . --update`.
- Se `graphify` não estiver no PATH, rode pelo Python indicado em `../graphify-out/.graphify_python`, assim: `<python> -m graphify query "..."`.

## 2. Siga o padrão de prompt da base

O padrão já está na aplicação. Leia estes arquivos antes de começar e siga-os à risca:

1. `prompt-base-animacao-animamente.md`: use o **prompt 1** (próximas animações). O prompt 2 serve só para recriar a base do zero.
2. `STYLE_GUIDE.md`: cores, fonte, estilo adesivo, elenco em colagem, movimento e áudio.
3. `src/tema/tokens.ts`: é a única fonte de cores, fontes, tamanhos e tempos. Nada fora dele.
4. `src/tema/vozes.json`: o jeito de falar de cada personagem (padrão fixo, não mude sem pedido).
5. `roteiros/*.json`: os vídeos anteriores, como referência de estilo.

Resumo do fluxo (o detalhe está no prompt 1 e no `../CLAUDE.md`):

1. Se o pedido não disser tema, formato (vertical ou horizontal), duração e público, pergunte antes.
2. Crie só um roteiro novo em `roteiros/<id>.json` e registre em `src/Root.tsx`.
3. Use música `animada-1`, `animada-2` ou `animada-3` e, por padrão, **vozes de IA**: `"vozesIA": true` no roteiro e `python3 scripts/gerar-vozes.py roteiros/<id>.json` antes de renderizar. **Só faça sem voz quando o pedido for para dublar** ("para dublar", "para a equipe gravar", "para o Dublador", "sem voz", "com roteiro de locução").
4. Escreva uma fala por cena, com no máximo ~16 palavras, e todo personagem que fala tem `"expressao"`. No modo dublagem, cada cena dura pelo menos o tempo da fala (2,4 palavras/s) + 1 s.
5. Rode `npm run verificar-estilo` e renderize `out/<id>.mp4`. Só no modo dublagem, rode também `npm run locucao -- roteiros/<id>.json`.
6. Entregue o caminho do `.mp4` pronto. No modo dublagem, entregue os caminhos do `.mp4` e do `.dublador.txt` para abrir no Dublador. Depois faça a limpeza descrita no `../CLAUDE.md`.

## Modelos de vídeo, fala e texto

Antes de escrever um roteiro, escolha o modelo (seções 8.1 a 8.4 do `STYLE_GUIDE.md`) e parta do exemplo em `roteiros/modelo-*.json`: quiz, duelo, top 3, passo a passo, conversa (chat) ou mapa mental (`"modelo": "mapa"`). `"estiloFala"` (balao, pensamento, grito, legenda, faixa, recado) e `"estiloTexto"` (palavra, maquina, marcador, onda, recorte) vão no topo do roteiro. Personagens, vozes, cores e fonte não mudam em nenhum modelo.
