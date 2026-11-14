# Prompts — Base de animação animamente (com Dublador)

A base já existe (projeto Remotion `animamente-base`) e segue a **identidade visual oficial**. A voz da equipe é gravada no **Dublador Animamente** (`Dublador/ABRIR_DUBLADOR.bat`), por cima do vídeo pronto. Use o prompt 1 para criar vídeos novos; o prompt 2 só se precisar recriar a base do zero.

## Fluxo de um vídeo (do roteiro ao vídeo com voz)

1. **Roteiro da animação** em `animamente-base/roteiros/<id>.json`.
2. **Renderizar** o vídeo com música e sem voz: `animamente-base/out/<id>.mp4`.
3. **Roteiro de locução**: `npm run locucao -- roteiros/<id>.json` gera `roteiros/locucao/<id>.dublador.txt`, já no formato do Dublador e com os tempos exatos de cada fala no vídeo.
4. **Gravar no Dublador**: Abrir vídeo (`<id>.mp4`) → Abrir roteiro (`<id>.dublador.txt`) → gravar e aprovar fala por fala → Exportar.
5. **Vídeo final** em `Dublador/videos_finalizados/<id>_dublado_<data>.mp4`.

Exemplo pronto: `apresentacao-canal.mp4` + `roteiros/locucao/apresentacao-canal.dublador.txt` (9 falas, 48,8 s).

## Regra de áudio (todo vídeo)

- **Sempre** com **música de fundo baixa e animada**. São trilhas originais em `public/musica/`: `animada-1`, `animada-2` e `animada-3`. O Dublador mantém a música e abaixa o volume dela sozinho enquanto alguém fala.
- **Sempre sem vozes de IA.**
- **Sempre** gerar, junto com o vídeo, o **roteiro de locução no formato do Dublador** (`<id>.dublador.txt`).
- Como a voz entra por cima do vídeo já renderizado, **cada fala precisa caber no tempo da própria cena**. Ver "Regras das falas" abaixo.
- *(Alternativa)* `python3 scripts/importar-gravacoes.py roteiros/<id>.json pasta/` continua existindo para quando o vídeo é que deve se ajustar à voz (arquivos `fala01.wav`, `fala02.m4a`...). Nesse caso é preciso renderizar de novo.

## Formato do roteiro de locução (Dublador)

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

## Regras das falas (para caber no Dublador)

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
Pontos que precisam aparecer: [lista]

Regra de áudio: gere o vídeo com música de fundo baixa e animada e SEM vozes de IA. A equipe grava as vozes no Dublador Animamente, por cima do vídeo pronto. Por isso:
- uma fala por cena, com no máximo ~16 palavras, frases curtas e faladas, sem parênteses, e cada cena durando pelo menos o tempo da fala (2,4 palavras por segundo) + 1 segundo;
- todo personagem que fala tem "expressao" definida;
- NÃO importe gravações nem ajuste o vídeo à voz: o vídeo é renderizado uma vez só.

Entregue, nesta ordem:
1. roteiros/<id>.json, registrado em src/Root.tsx;
2. o vídeo renderizado em out/<id>.mp4;
3. o roteiro de locução no formato do Dublador: rode "npm run locucao -- roteiros/<id>.json" e confira roteiros/locucao/<id>.dublador.txt (blocos "[mm:ss.d - mm:ss.d] Quem fala" + texto, em ordem de tempo, sem sobreposição, e com o último bloco terminando antes do fim do vídeo). Se alguma fala não couber na cena, encurte a fala ou aumente a "duracao" da cena, e gere o vídeo e o roteiro de novo.

No final, diga os dois caminhos para abrir no Dublador: o do vídeo (.mp4) e o do roteiro (.dublador.txt).

Só crie um componente ou cena nova se nenhum existente servir; nesse caso, construa com os tokens e helpers da base e adicione ao STYLE_GUIDE.md e à Galeria.
```

## 2. Prompt para recriar a base do zero (referência)

```
Você é um desenvolvedor sênior de motion design em código. Crie a BASE DE ANIMAÇÃO 2D do canal educativo "animamente" (slogan: "o mundo explicado em animação"), em Remotion (React + TypeScript), 30 fps, nos formatos vertical 1080x1920 e horizontal 1920x1080. É um design system: nenhuma cor, fonte, tamanho, tempo ou personagem pode ser definido fora de src/tema/tokens.ts.

IDENTIDADE: fundo Tinta #1F1A3D com constelação de neurônios Coral a 16%; Coral #F0476B, Amarelo #FFC23D, Lavanda #C9C5DD, Névoa #F7F6FB; só Fredoka (600 títulos/destaques, 400 apoio). Estilo "adesivo": formas chapadas, sem contorno escuro, borda Névoa por fora da silhueta; neurônios = traços Névoa com nós redondos. Sem sombras e sem gradientes. Destaques no texto: *amarelo* e _coral_.

PERSONAGENS ORIGINAIS (API única <Personagem id expressao fala olhando />): Neuro (o cérebro do logo com rosto) e um elenco de bichos em COLAGEM DE PAPEL de revista, em busto com roupinha, boca "South Park" (mandíbula recortada que desce ao falar), olhos de papel que piscam e muita personalidade: Lia (gata curiosa e desconfiada), Bento (cachorro otimista), Teo (bicho-preguiça sábio), Rafa (elefante coach), Caio (lontra brincalhona).

ÁUDIO: música de fundo original, baixa e animada, em loop; sem vozes de IA; cada fala com tempo estimado (2,4 palavras/s) e boca mexendo. Gerador de roteiro de locução ("npm run locucao") com duas saídas: um .md para leitura (tempo, quem fala, texto, jeito de falar) e um .dublador.txt para o app Dublador Animamente, no formato:
  [mm:ss.d - mm:ss.d] Quem fala
  (jeito de falar) texto da fala
com linhas "#" como comentário, blocos em ordem de tempo, 0,3 s de respiro entre falas e tempos tirados dos frames reais das cenas. Importador opcional das gravações da equipe que sincroniza o vídeo à voz real.

ROTEIRO JSON → vídeo, com cenas intro, pergunta, explicacao, diagrama, comparacao, lista, resumo, outro; transição de 15 frames igual entre todas; validação; Galeria; STYLE_GUIDE.md; README.
```
