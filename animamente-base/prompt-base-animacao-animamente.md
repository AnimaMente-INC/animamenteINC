# Prompts — Base de animação animamente (voz de IA por padrão, Dublador a pedido)

A base já existe (projeto Remotion `animamente-base`) e segue a **identidade visual oficial**. **Por padrão, todo vídeo sai pronto com voz de IA** (Kokoro, offline, com a voz fixa de cada personagem). Só quando o pedido for **para dublar** o vídeo sai sem voz e com o roteiro de locução, para a equipe gravar no **Dublador Animamente** (`Dublador/ABRIR_DUBLADOR.bat`). Use o prompt 1 para criar vídeos novos; o prompt 2 só se precisar recriar a base do zero.

## Qual modo usar

| Pedido | Modo | O que sai |
|---|---|---|
| Qualquer pedido de vídeo (padrão) | **Voz de IA** | vídeo pronto, com música e vozes de IA; sem roteiro de locução |
| O pedido fala em "para dublar", "para a equipe gravar", "para o Dublador", "sem voz" ou "com roteiro de locução" | **Dublagem** | vídeo com música e **sem voz** + roteiro de locução no formato do Dublador |

Na dúvida, use o modo voz de IA.

## Modelos de vídeo, de fala e de texto

Além do vídeo padrão (cenas `pergunta`, `explicacao`, `diagrama`...) e do modo história, a base tem modelos prontos. Cada um tem um roteiro de exemplo em `animamente-base/roteiros/`: copie a estrutura e troque o conteúdo. Detalhes no `STYLE_GUIDE.md`, seções 8.1 a 8.4.

| Peça no pedido | Roteiro de exemplo | O que é |
|---|---|---|
| "em quiz" | `modelo-quiz.json` | perguntas com alternativas, barra de tempo e resposta |
| "em duelo" / "X contra Y" | `modelo-duelo.json` | dois lados frente a frente com o selo VS |
| "em top 3" / "ranking" | `modelo-top3.json` | contagem regressiva com medalhas |
| "passo a passo" / "tutorial" | `modelo-passo-a-passo.json` | etapas numeradas com trilha de progresso |
| "em conversa" / "em chat" | `modelo-conversa.json` | os personagens trocando mensagens |
| "em mapa mental" | `modelo-mapa-mental.json` | um mapa só, em câmera contínua, nó por nó (`"modelo": "mapa"`) |

- **Fala** (`"estiloFala"`): `balao` (padrão), `pensamento`, `grito`, `legenda` (karaokê), `faixa` (tarja com nome) ou `recado` (bilhete de papel).
- **Texto dos títulos** (`"estiloTexto"`): `palavra` (padrão), `maquina`, `marcador`, `onda` ou `recorte`.
- Os dois campos vão no topo do roteiro e podem ser trocados em uma cena só. Se o pedido não disser o modelo, escolha o que combina com o tema e varie de um vídeo para o outro.
- Os personagens, as vozes, as cores e a fonte são sempre os mesmos em todos os modelos.

## Fluxo padrão: vídeo com voz de IA

1. **Roteiro da animação** em `animamente-base/roteiros/<id>.json`, com `"vozesIA": true`.
2. **Gerar as vozes**: `python3 scripts/gerar-vozes.py roteiros/<id>.json` cria `public/vozes/<id>/cenaNN.wav` e `manifesto.json`. O vídeo ajusta o tempo de cada cena à voz. A instalação (kokoro-onnx, modelos e ffmpeg) está no topo do script.
3. **Renderizar** o vídeo com música e vozes: `animamente-base/out/<id>.mp4`.
4. **Conferir** que todas as falas tocam, que a boca acompanha e que a música abaixa durante as falas.
5. **Vídeo final**: mover para `VIDEOS E ROTEIROS/<tema>/` e apagar `public/vozes/<id>/` (áudio temporário).

## Fluxo de dublagem (só quando o pedido for para dublar)

1. **Roteiro da animação** em `animamente-base/roteiros/<id>.json`, **sem** `"vozesIA"`.
2. **Renderizar** o vídeo com música e sem voz: `animamente-base/out/<id>.mp4`.
3. **Roteiro de locução**: `npm run locucao -- roteiros/<id>.json` gera `roteiros/locucao/<id>.dublador.txt`, já no formato do Dublador e com os tempos exatos de cada fala no vídeo.
4. **Gravar no Dublador**: Abrir vídeo (`<id>.mp4`) → Abrir roteiro (`<id>.dublador.txt`) → gravar e aprovar fala por fala → Exportar.
5. **Vídeo final** em `Dublador/videos_finalizados/<id>_dublado_<data>.mp4`.

Exemplo pronto de dublagem: `apresentacao-canal.mp4` + `roteiros/locucao/apresentacao-canal.dublador.txt` (9 falas, 48,8 s).

## Regra de áudio (todo vídeo)

- **Sempre** com **música de fundo baixa e animada**. São trilhas originais em `public/musica/`: `animada-1`, `animada-2` e `animada-3`. A música abaixa sozinha enquanto alguém fala.
- **Padrão: com vozes de IA.** `"vozesIA": true` no roteiro + `scripts/gerar-vozes.py`. A voz, a velocidade e o tom de cada personagem vêm de `src/tema/vozes.json` e não mudam sem pedido. Nunca imitar a voz de uma pessoa real.
- **Só no modo dublagem:** vídeo **sem voz** e, junto com ele, o **roteiro de locução no formato do Dublador** (`<id>.dublador.txt`). Nesse modo a voz entra por cima do vídeo já renderizado, então **cada fala precisa caber no tempo da própria cena**. Ver "Regras das falas" abaixo.
- *(Alternativa do modo dublagem)* `python3 scripts/importar-gravacoes.py roteiros/<id>.json pasta/` continua existindo para quando o vídeo é que deve se ajustar à voz gravada (arquivos `fala01.wav`, `fala02.m4a`...). Nesse caso é preciso renderizar de novo.

## Formato do roteiro de locução (Dublador, só no modo dublagem)

```
# Título: Prazer, animamente!
# Vídeo: apresentacao-canal.mp4 · vertical · duração 0:48.8

[00:00.5 - 00:02.6] Neuro
Oi! Bem-vindo à animamente!

[00:03.5 - 00:07.2] Neuro
(começa sorrindo e termina empolgado) Eu sou o Neuro, o cérebro desta turma!

[00:08.1 - 00:11.8] Caio
(empolgado) E o que a gente faz aqui, Neuro?
```

- Cada fala começa com `[início - fim]` em `mm:ss.d`, seguido de quem fala. O texto vem na linha de baixo.
- `(parênteses)` = jeito de falar, não é lido. `#` = comentário.
- Falas em ordem de tempo, com pelo menos 0,3 s de respiro entre uma e outra.
- Nenhuma linha de texto pode começar com `[`. Não usar `*` nem `_` no texto.
- O arquivo é **gerado** por `npm run locucao`. Não escrever os tempos à mão: se o `.json` mudar, gerar de novo.

## Regras das falas (valem nos dois modos)

No modo voz de IA o vídeo se ajusta à voz, mas as falas seguem as mesmas regras para o ritmo ficar igual em todos os vídeos.

- **Uma fala por cena**, de no máximo ~16 palavras. Se a ideia for maior, dividir em duas cenas.
- A base reserva 2,4 palavras por segundo para cada fala. A cena precisa durar pelo menos o tempo da fala + 1 s.
- Frases curtas e faladas, sem parênteses dentro do texto da fala (o Dublador trata parênteses como instrução).
- Todo personagem que fala tem `expressao` definida, porque ela vira o "jeito de falar" no teleprompter.

## Resumo do padrão visual

- **Fundo:** Tinta `#1F1A3D` com constelação de neurônios em Coral a 16%.
- **Cores:** Coral `#F0476B`, Amarelo `#FFC23D`, Lavanda `#C9C5DD` e Névoa `#F7F6FB`. Apoio: Ardósia `#5A5675` e Lilás `#D9D6E6`.
- **Fonte:** só Fredoka.
- **Estilo:** "adesivo" flat, com borda Névoa por fora da silhueta e neurônios (traços com nós redondos) em toda parte.
- **Personagens** (todos originais):
  - **Elenco em colagem de papel** (boca "South Park"):
    - **Neuro, o cérebro:** o cérebro do logo em papel recortado, com gravata-borboleta amarela. É o anfitrião e narrador.
    - **Lia, a gata:** curiosa e desconfiada, boina coral e blusa listrada.
    - **Bento, o cachorro:** otimista e desastrado, capa de chuva amarela e uma orelha em pé.
    - **Teo, o bicho-preguiça:** calmo e sábio, gola alta coral, óculos e caneca de café.
    - **Rafa, o elefante:** coach confiante, faixa amarela, jaqueta esportiva e apito.
    - **Caio, a lontra:** brincalhão, chapéu de pescador amarelo e camisa estampada.

## 1. Prompt para as próximas animações

```
Use a base de animação da animamente que já existe neste projeto (pasta animamente-base). Antes de tudo, leia STYLE_GUIDE.md e src/tema/tokens.ts e siga-os à risca: identidade visual animamente (fundo Tinta com constelação de neurônios, destaques só Coral/Amarelo/Lavanda, só Fredoka, estilo adesivo com borda Névoa), personagens Neuro e o elenco em colagem (Lia, Bento, Teo, Rafa, Caio), tempos e transições.

Crie apenas um novo roteiro em /roteiros (com "id") sobre: [TEMA]
Categoria (etiqueta da intro): [ex.: Ciência]
Formato: [vertical | horizontal] · Duração: [X segundos] · Público: [ex.: estudantes do ensino médio]
Modelo: [padrão | história | quiz | duelo | top 3 | passo a passo | conversa | mapa mental] (parta do roteiro roteiros/modelo-*.json correspondente)
Fala: [balao | pensamento | grito | legenda | faixa | recado] · Texto: [palavra | maquina | marcador | onda | recorte]
Pontos que precisam aparecer: [lista]

Regra de áudio: gere o vídeo com música de fundo baixa e animada e COM vozes de IA (padrão do canal). Para isso:
- coloque "vozesIA": true no roteiro;
- rode "python3 scripts/gerar-vozes.py roteiros/<id>.json" antes de renderizar (vozes do Kokoro, com a voz, a velocidade e o tom de cada personagem em src/tema/vozes.json; não mude esse arquivo);
- uma fala por cena, com no máximo ~16 palavras, frases curtas e faladas, sem parênteses;
- todo personagem que fala tem "expressao" definida.

Entregue, nesta ordem (e ao final mova o .mp4 para VIDEOS E ROTEIROS/<tema>/, limpe out/ e apague public/vozes/<id>/; mantenha só o roteiro .json como referência, sem áudios nem arquivos temporários):
1. roteiros/<id>.json, registrado em src/Root.tsx;
2. as vozes geradas e o vídeo renderizado em out/<id>.mp4, já com música e vozes;
3. a confirmação de que todas as falas tocam no vídeo e de que a música abaixa durante as falas.

No final, diga o caminho do vídeo pronto (.mp4). Não gere roteiro de locução neste modo.

SÓ SE O PEDIDO FOR PARA DUBLAR (falar em "para dublar", "para a equipe gravar", "para o Dublador", "sem voz" ou "com roteiro de locução"), troque a regra de áudio e a entrega por estas:
- gere o vídeo com música e SEM vozes de IA (roteiro sem "vozesIA"); a equipe grava as vozes no Dublador Animamente, por cima do vídeo pronto;
- cada cena dura pelo menos o tempo da fala (2,4 palavras por segundo) + 1 segundo;
- NÃO importe gravações nem ajuste o vídeo à voz: o vídeo é renderizado uma vez só;
- entregue roteiros/<id>.json, o vídeo em out/<id>.mp4 e o roteiro de locução: rode "npm run locucao -- roteiros/<id>.json" e confira roteiros/locucao/<id>.dublador.txt (blocos "[mm:ss.d - mm:ss.d] Quem fala" + texto, em ordem de tempo, sem sobreposição, e com o último bloco terminando antes do fim do vídeo). Se alguma fala não couber na cena, encurte a fala ou aumente a "duracao" da cena, e gere o vídeo e o roteiro de novo;
- no final, diga os dois caminhos para abrir no Dublador: o do vídeo (.mp4) e o do roteiro (.dublador.txt).

Só crie um componente ou cena nova se nenhum existente servir; nesse caso, construa com os tokens e helpers da base e adicione ao STYLE_GUIDE.md e à Galeria.
```

## 2. Prompt para recriar a base do zero (referência)

```
Você é um desenvolvedor sênior de motion design em código. Crie a BASE DE ANIMAÇÃO 2D do canal educativo "animamente" (slogan: "o mundo explicado em animação"), em Remotion (React + TypeScript), 30 fps, nos formatos vertical 1080x1920 e horizontal 1920x1080. É um design system: nenhuma cor, fonte, tamanho, tempo ou personagem pode ser definido fora de src/tema/tokens.ts.

IDENTIDADE: fundo Tinta #1F1A3D com constelação de neurônios Coral a 16%; Coral #F0476B, Amarelo #FFC23D, Lavanda #C9C5DD, Névoa #F7F6FB; só Fredoka (600 títulos/destaques, 400 apoio). Estilo "adesivo": formas chapadas, sem contorno escuro, borda Névoa por fora da silhueta; neurônios = traços Névoa com nós redondos. Sem sombras e sem gradientes. Destaques no texto: *amarelo* e _coral_.

PERSONAGENS ORIGINAIS (API única <Personagem id expressao fala olhando />): Neuro (o cérebro do logo com rosto) e um elenco de bichos em COLAGEM DE PAPEL de revista, em busto com roupinha, boca "South Park" (mandíbula recortada que desce ao falar), olhos de papel que piscam e muita personalidade: Lia (gata curiosa e desconfiada), Bento (cachorro otimista), Teo (bicho-preguiça sábio), Rafa (elefante coach), Caio (lontra brincalhona).

ÁUDIO: música de fundo original, baixa e animada, em loop; vozes de IA por padrão (Kokoro offline, "vozesIA": true, uma voz fixa por personagem em src/tema/vozes.json, o vídeo se ajusta à voz); modo dublagem a pedido, sem voz, com cada fala em tempo estimado (2,4 palavras/s) e boca mexendo. Gerador de roteiro de locução ("npm run locucao") com duas saídas: um .md para leitura (tempo, quem fala, texto, jeito de falar) e um .dublador.txt para o app Dublador Animamente, no formato:
  [mm:ss.d - mm:ss.d] Quem fala
  (jeito de falar) texto da fala
com linhas "#" como comentário, blocos em ordem de tempo, 0,3 s de respiro entre falas e tempos tirados dos frames reais das cenas. Importador opcional das gravações da equipe que sincroniza o vídeo à voz real.

ROTEIRO JSON → vídeo, com cenas intro, pergunta, explicacao, diagrama, comparacao, lista, resumo, outro; transição de 15 frames igual entre todas; validação; Galeria; STYLE_GUIDE.md; README.
```
