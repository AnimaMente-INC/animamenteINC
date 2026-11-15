# animamente — Guia de Estilo de Animação

> *o mundo explicado em animação*

Este guia é a "lei" visual dos vídeos. Ele aplica a **identidade visual oficial** (`guia-identidade-visual`) ao movimento. Todo vídeo novo, feito por uma pessoa ou por uma IA, segue o que está aqui. **Se algo não está neste guia, não entra no vídeo** até ser adicionado aqui e no código da base.

> Fonte da verdade no código: `src/tema/tokens.ts`.

---

## 1. Princípios

1. **Fundo principal Tinta** com a constelação de neurônios em Coral a 16%.
2. **Estilo "adesivo":** formas chapadas, sem contorno escuro, com **uma borda Névoa por fora da silhueta**, igual ao cérebro do logo.
3. **Neurônios em todo lugar:** traços Névoa com nós redondos nas pontas (letras do logo, braços, setas, presilhas, hastes de óculos).
4. **Uma ideia por tela.** Se precisa de duas legendas, são duas cenas.
5. **Flat de verdade:** sem sombras, sem gradientes, sem texturas, sem emojis e sem imagens externas. A única exceção é a cena `imagem` (seção 8), para imagens de referência com crédito, sempre dentro da `MolduraImagem`.
6. **No máximo 3 cores de destaque**, que são exatamente Coral, Amarelo e Lavanda.

---

## 2. Cores

| Token | Nome | Hex | Uso |
|---|---|---|---|
| `tinta` | Tinta | `#1F1A3D` | fundo principal; texto sobre fundos claros; traços do rosto |
| `coral` | Coral | `#F0476B` | marca ("mente", cérebro, Neuro), `_destaque_`, botões, barra de progresso, MITO |
| `amarelo` | Amarelo | `#FFC23D` | `*destaque*`, etiquetas, sublinhados e círculos, setas, VERDADE, Lia |
| `lavanda` | Lavanda | `#C9C5DD` | texto de apoio, slogan, painéis (14%), Teo |
| `nevoa` | Névoa | `#F7F6FB` | texto principal no escuro, bordas de adesivo, neurônios, balões |
| `ardosia` | Ardósia | `#5A5675` | tracejados, elementos inativos, texto de apoio no tema claro |
| `lilas` | Lilás | `#D9D6E6` | divisórias sobre fundo claro |
| `pele1` / `pele2` | — | `#F6C7A6` / `#A0663F` | tons de pele |

- **Painéis** (cartões, comparação): Lavanda a 14% sobre o Tinta, cantos de 28px.
- **Tema claro** (`"tema": "claro"`): Névoa e Tinta trocam de lugar. As bordas de adesivo continuam Névoa e os destaques continuam iguais. Sobre fundo claro, o Amarelo vira Coral automaticamente para ficar legível.

---

## 3. Tipografia: só Fredoka

| Papel | Peso |
|---|---|
| Títulos, nome, destaques, fórmulas e números | **Fredoka SemiBold (600)** |
| Textos de apoio e legendas | Fredoka Regular (400) |

**Escala (vertical 1080×1920).** No horizontal, tudo é multiplicado por 0,75 automaticamente.

| Nome | Vertical | Horizontal |
|---|---|---|
| `titulo` | 104px | 78px |
| `subtitulo` | 64px | 48px |
| `legenda` | 52px | 39px |
| `rotulo` | 40px | 30px |
| `nota` | 32px | 24px |

**Legendas:** no máximo 2 linhas e 32 caracteres por linha.

**Destaque no texto** (em títulos, legendas e falas):
- `*palavra*` → **Amarelo** (como "azul?" na thumbnail)
- `_palavra_` → **Coral** (como "mente" no nome e "no canal!" no story)
- A pontuação logo depois fica grudada: `_entropia_?`
- Use **um** destaque por frase.

**Marca nominal:** "anima" na cor do texto + "mente" em Coral, com o slogan em Lavanda. Componente `<Marca />`.

---

## 4. Forma e layout

- **Borda de adesivo:** cerca de 10px num personagem de 700px. Ela acompanha a escala.
- **Braços:** traço Névoa de 13 unidades, pontas redondas, saindo de trás da borda.
- **Traço de rosto, ícones e setas:** 6px, pontas arredondadas.
- **Raio:** 28px em painéis e 999px em pílulas.
- **Grade:** 8px.
- **Área segura no vertical:** 150px no topo, 350px embaixo e 60px nas laterais.
- **Área segura no horizontal:** 80px em cima e embaixo, 120px nas laterais.

**Layout das cenas (automático, em `LayoutCena`):**
- Vertical: conteúdo em cima → legenda → personagens embaixo.
- Horizontal: personagens à esquerda e conteúdo à direita.

---

## 5. Movimento

| Token | Valor |
|---|---|
| `fps` | 30 |
| entrada | 12 frames, `cubic-bezier(0.34, 1.56, 0.64, 1)` (pequeno "pulo") |
| saída | 8 frames, `cubic-bezier(0.4, 0, 1, 1)` |
| transição entre cenas | 15 frames, deslizando da direita, sempre igual (8 frames no `"ritmo": "rapido"`, ver seção 8) |
| stagger | 4 frames |
| troca de pose ou expressão | 6 frames |
| texto | palavra por palavra, 3 frames entre palavras |
| respiração | escala Y 1 → 1,02 a cada 2s |
| piscar | a cada 3 a 5s |
| flutuação (só o Neuro) | 10px a cada 3s |
| constelação | deriva lenta de 14px |

O **logo** entra assim: o cérebro faz "pop", as letras A e M são desenhadas, depois os ramos de neurônio crescem e os nós acendem.

Toda animação usa os helpers de `src/animacao`.

---

## 6. Personagens: colagem de papel

Os personagens têm uma **identidade própria dentro da marca**: são **colagens de papel recortado** (como recortes de revista e aquarela), em **busto** (cabeça e ombros, com roupinha) e com a **boca "South Park"**: a mandíbula é um recorte separado que desce quando eles falam. As cores são as da animamente (Coral, Amarelo, Lavanda, Névoa, Tinta, Ardósia), mais os tons de pelo de cada bicho. O **Neuro** também é colagem: o cérebro do logo recortado em papel.

### O jeito colagem (`personagens/colagem/papel.tsx`)
1. **Recorte de tesoura:** toda forma vira um polígono de cortes retos levemente tremidos (`recorte(...)`), sempre o mesmo para a mesma semente.
2. **Papel com textura**, por peça:
    - `aquarela`: manchas suaves;
    - `respingos`: pontinhos de tinta, como esponja;
    - `manchada`: manchas acinzentadas, para papéis claros;
    - `lisa`: só o grão do papel;
    - **meio-tom de revista** (pontinhos) em bochechas, focinhos e orelhas.
3. **Margem branca de recorte** (Névoa) por fora da silhueta. É a "borda de adesivo" da marca, agora como papel cortado de revista.
4. **Sombra de papel:** cada peça projeta uma sombrinha, como papel colado sobre papel. Esta é a **única** exceção à regra "sem sombras", e vale só para os personagens.
5. **Rabiscos de lápis** para pelos, costuras, dobrinhas e bigodes.
6. **Movimento "em degraus"**, como animação de recorte: a cabeça balança e a boca abre mudando a cada 3 frames (`colagem.passo`).

### Rosto e boca (`colagem/rosto.tsx`)
- **Olhos de papel** com pupila recortada, brilho e **pálpebra que desce** (piscar e personalidade). A gata tem íris amarela com pupila em fenda.
- **Sobrancelhas:** tiras de papel que sobem e giram com a expressão.
- **Boca South Park:** fundo escuro (com língua ou dentes) + **mandíbula recortada que desce** (`Mandibula`) enquanto o personagem fala. Fechada, vira um risquinho de lápis.
- **Expressões:** neutro, feliz, surpreso, pensativo, confuso e empolgado. Cada personagem soma a sua personalidade (pálpebras pesadas, sobrancelha levantada...).

### O elenco

| Personagem | Visual | Personalidade | Bordão |
|---|---|---|---|
| **Neuro, o cérebro** | o cérebro do símbolo oficial em papel Coral aquarelado, A+M em tiras de papel Névoa com ramos de neurônio a lápis, retalhos em meio-tom, **gravata-borboleta Amarelo**, braços-neurônio de tira de papel com mãos-nó | o anfitrião animado e narrador, olhos grandes e sobrancelhas sempre pra cima | "Bem-vindo à animamente!" |
| **Lia, a gata** | preta "smoking", olhos amarelos de gato, bigodes, **boina Coral** com broche-neurônio, **blusa listrada** | curiosa e desconfiada, sempre com uma sobrancelha levantada | "Hum... será mesmo?" |
| **Bento, o cachorro** | caramelo com focinho branco sardento, **uma orelha caída e outra virada pra cima**, língua pra fora, **capa de chuva Amarelo**, coleira Coral com plaquinha-neurônio | otimista e desastrado, topa tudo antes de entender | "Bora, bora, bora!" |
| **Teo, o bicho-preguiça** | pelo desgrenhado, máscara escura, óculos redondos com nós de neurônio, **gola alta Coral** canelada, **caneca de café** fumegante na pata com garras | calmo, sábio, sonolento | "Devagar... e sempre." |
| **Rafa, o elefante** | orelhas enormes em meio-tom rosado, tromba de papel com dobrinhas, presas, **faixa Amarelo**, **jaqueta esportiva Ardósia**, apito | coach confiante, com memória de elefante | "Bora treinar o cérebro!" |
| **Caio, a lontra** | bochechas claras fofinhas, dentinhos, bigodes, **chapéu de pescador Amarelo**, **camisa estampada Coral** com folhas | brincalhão e travesso, uma piscadinha marota | "Pera que tem piada nisso!" |

### Criando um personagem novo
1. Crie `colagem/<Bicho>.tsx` com o mesmo esqueleto: orelhas e roupa atrás, cabeça com margem, rosto, **boca + mandíbula**, olhos, sobrancelhas e acessórios na frente.
2. Use só `recorte`, `Peca`, `Rabisco`, `Olho`, `Sobrancelha` e `Mandibula`, com as cores dos tokens. Os pelos novos entram nos tokens.
3. Dê **uma marca registrada** (roupa, acessório, gesto) e uma personalidade que apareça no rosto em repouso.
4. Registre em `colagem/Busto.tsx`, `tipos.ts` e `Elenco.tsx` (o Neuro está em `colagem/NeuroColagem.tsx` e é o único com braços: as poses mexem os braços dele), coloque o "jeito de falar" em `src/tema/vozes.json` e documente aqui.

### API

```tsx
<Personagem id="neuro | lia | bento | teo | rafa | caio" expressao="..." fala="..." olhando="..." />
```

---

## 6.1 Áudio e vozes (regra do canal)

**Todo vídeo:** tem **música de fundo baixa e animada** e **vozes de IA** (`"vozesIA": true` + `scripts/gerar-vozes.py`). **Só quando o pedido for para dublar** o vídeo sai sem voz e com o **roteiro de locução** (`npm run locucao`), para a equipe gravar as falas.

- **Música:** trilhas originais em `public/musica/`, em volume baixo (`audio.volumeMusica` = 0,16), com fade de entrada e de saída. Ela abaixa mais quando há voz gravada tocando.
- **Uma fala por cena:** ou a `fala` de um personagem (com balão), ou uma `narracao` (sem balão; se o narrador estiver em cena, a boca dele mexe).
- **Tempo da fala sem voz:** 2,4 palavras por segundo + 0,4 s de folga. Escreva falas curtas e faladas, com vírgulas onde a voz respira.
- **Gravações da equipe:** `importar-gravacoes.py` coloca a voz real no lugar e o vídeo se ajusta a ela.
- **Jeito de falar de cada personagem** (vai no roteiro de locução, em `src/tema/vozes.json`):

| Personagem | Jeito de falar |
|---|---|
| Neuro | animado e simpático, voz um pouco mais aguda, como personagem de desenho |
| Lia (gata) | curiosa e desconfiada, meio irônica: "hum... será mesmo?" |
| Bento (cachorro) | empolgadíssimo e otimista, rápido, topa tudo |
| Teo (bicho-preguiça) | calmo, sábio e bem devagar, com sono |
| Rafa (elefante) | grave, confiante e motivador, como técnico de academia |
| Caio (lontra) | brincalhão e travesso, com risadinha |

- Vozes de IA são o padrão (`"vozesIA": true` no roteiro), sempre com as vozes de `src/tema/vozes.json` e nunca imitando a voz de uma pessoa real.

---

## 7. Componentes

| Componente | Visual |
|---|---|
| `Logo` | símbolo oficial A+M, animado |
| `Marca` | "anima**mente**" + slogan |
| `Etiqueta` | pílula Amarelo/Tinta ("Ciência", "Você sabia?") ou Coral/Névoa ("Toque no link") |
| `Titulo`, `Legenda` | Fredoka, palavra por palavra |
| `BalaoDeFala` | balão Névoa chapado, texto Tinta |
| `Cartao` | painel Lavanda 14% com ícone em círculo |
| `Icone` | círculo Coral (ou Amarelo/Lavanda) com o desenho em traço Névoa/Tinta |
| `Lousa` | quadro com borda Névoa, fórmula em Fredoka SemiBold e sublinhado Amarelo |
| `Seta` / `Conector` | traço com nó de neurônio na origem |
| `Destaque` | círculo ou sublinhado "à mão" em Amarelo |
| `Contador` | número em Fredoka SemiBold Amarelo |
| `ComparacaoMitoVerdade` | MITO (Coral, riscado) × VERDADE (Amarelo) |
| `Imagem` | imagem de referência do projeto (`public/`) como adesivo: borda Névoa, cantos de 28px, rótulo Lavanda. Exceção à regra "sem imagens externas": só quando o roteiro pede (`imagem`, na cena `explicacao`) |
| `Constelacao` | fundo de neurônios Coral a 16% |
| `BarraProgresso` | barra fina Coral no topo |
| `MolduraImagem` | imagem de referência 16:9 em moldura de adesivo (borda Névoa, cantos 28), etiqueta Amarelo no canto, crédito em Lavanda e zoom lento (`amplitudes.zoomImagem`). Sem imagem, mostra um espaço reservado tracejado com ícone de câmera e a descrição do que entra ali |

| `CarimboAno` | adesivo Coral com borda Névoa e texto Névoa, inclinado 6°, que cai, bate e treme; ao bater solta um estouro de neurônios Amarelo |
| `LinhaDoTempo` | nós de neurônio ligados: os que já passaram em Coral, o atual pulsando em Amarelo, os próximos em Ardósia |
| `TextoImpacto` | frase que ocupa a tela, uma linha por vez, cada linha "carimbada"; linhas separadas por ` / `; o tamanho se ajusta à linha mais longa |
| `FaixaCorrida` | letreiro Amarelo (texto Tinta) inclinado 3° que corre de ponta a ponta ("3 POR 10") |
| `Objeto` | adesivo grande de uma coisa, com borda Névoa por fora da silhueta e movimento próprio (o disco gira, a seta quica, a cancela desce) |
| `TelaRetro` | TV de tubo em adesivo, com antenas-neurônio, linhas de varredura e um joguinho de blocos original rodando |
| `BarrasPreco` | barras que crescem com o número contando na ponta, para comparar preços |
| `JanelaTerminal` / `TextoDigitado` | painel com três bolinhas e texto digitado letra por letra, cursor Amarelo e barra de progresso opcional (continua em Fredoka) |
| `FaixaNarrador` | Neuro pequeno no topo narrando (a boca mexe) + etiqueta Lavanda "Neuro conta" + etiqueta Amarelo com a época |

| `Fala` / `LegendaKaraoke` | os 6 modelos de fala (seção 8.1) |
| `Quiz`, `Versus`, `NumeroGigante`, `Medalha`, `Chat` | peças dos modelos de vídeo novos (seção 8.3) |
| `MapaMental` | o vídeo em câmera contínua (seção 8.4) |

Ícones disponíveis: lampada, livro, atomo, grafico, relogio, ampulheta, interrogacao, alvo, certo, errado, calor, dados, play, camera, neuronio, sol, gota, folha, trofeu, balao.

---

## 8. Tipos de cena

| Tipo | O que mostra | Campos |
|---|---|---|
| `intro` | logo animado + etiqueta de categoria + título (2s) | `categoria` (no topo do roteiro) |
| `pergunta` | personagem perguntando | `personagens`, `titulo?`, `legenda?` |
| `explicacao` | personagem + lousa/cartão + legenda | `lousa?`, `lousaRotulo?`, `cartao?`, `legenda?` |
| `diagrama` | cartões ligados por setas | `nos`, `titulo?` |
| `comparacao` | mito × verdade | `mito`, `verdade`, `titulo?` |
| `lista` | itens numerados | `itens`, `titulo?` |
| `imagem` | imagem de referência (ex.: print de trailer) na `MolduraImagem` + legenda + personagens | `imagem?` (caminho em `public/`), `imagemDescricao?`, `imagemRotulo?`, `imagemCredito?`, `titulo?` (precisa de `imagem` ou `imagemDescricao`) |
| `resumo` | frase circulada + Neuro | `destaque?`, `personagens?` |
| `outro` | Neuro acenando + chamada + marca + botão (3s) | `chamada?`, `botao?` |

**Cena `imagem`:** use só para mostrar algo real que a animação não consegue desenhar (print de trailer, foto histórica) e sempre com `imagemCredito`. Prefira `narracao` a `fala` nessa cena, para sobrar espaço para a moldura no vertical. Para trocar o espaço reservado pela imagem: coloque o arquivo em `public/` (ex.: `public/gta6/trailer-01.jpg`), escreva `"imagem": "gta6/trailer-01.jpg"` na cena e renderize de novo.

### Modo história (contar uma história em capítulos)

Use quando o vídeo responde a uma pergunta por meio de uma história ou de uma linha do tempo. No topo do roteiro:

- `"ritmo": "rapido"`: a transição cai de 15 para 8 frames (`tempos.transicaoRapida`) e cada `capitulo` entra de baixo para cima. As outras cenas continuam deslizando da direita.
- `"narradorNoCanto": true` (só vertical): reserva 170px no topo para a `FaixaNarrador`. O Neuro aparece ali em toda cena em que ele não está entre os personagens (menos `intro` e `outro`), e a etiqueta mostra o `ano` do último `capitulo`.

| Tipo | O que mostra | Campos |
|---|---|---|
| `capitulo` | carimbo da época + linha do tempo + título; cena curta (1,6 s), sem personagens | `ano`, `titulo?`, `etapas?`, `etapa?` |
| `impacto` | frase carimbada linha por linha | `impacto` (até 4 linhas separadas por ` / `), `faixa?`, `personagens?`, `legenda?` |
| `tela` | TV de tubo com joguinho + personagens jogando | `tela?` (`jogo` ou `texto`), `telaTexto?`, `titulo?` |
| `objeto` | adesivo grande + título + letreiro | `objeto`, `titulo?`, `faixa?`, `legenda?` |
| `preco` | barras comparando valores | `precos` (`rotulo`, `valor`, `texto?`, `cor?`), `titulo?` |
| `terminal` | texto digitado numa janela + barra de progresso | `linhas`, `terminalTitulo?`, `progresso?`, `progressoAte?` |

Objetos disponíveis: cartucho, disco, console, controle, chip, pc, nuvem, etiqueta, banca, clones, codigo, barreira. São desenhos genéricos, sem marca de fabricante. Para criar outro, siga o comentário no topo de `componentes/Objeto.tsx`.

Movimentos novos (todos em `src/animacao`, com tempos em `tokens.ts`): `carimbar`/`estiloCarimbo` (8 frames de queda, escala 2,4 → 1, tremida de 12px), `digitar` (1,5 frame por letra), `cursorAceso`, `correr` (5px por frame), `girar` (uma volta a cada 4 s), `crescer` e `pulsar`.

Nas cenas de história os personagens ficam menores (520px com fala, 560px sem) para sobrar espaço para o conteúdo. Exemplo completo: `roteiros/pirataria-games-brasil.json`.

Qualquer cena aceita uma fala: `narracao`, `narrador` e `narracaoEm`, ou a `fala` de um personagem. Todas entram no roteiro de locução.

**Estrutura recomendada (30 a 60s):** `intro` → `pergunta` → 1 a 3 cenas de `explicacao`/`diagrama`/`lista` → `comparacao` (opcional) → `resumo` → `outro`.


---

## 8.1 Modelos de fala (`estiloFala`)

O jeito que a fala aparece na tela. Vai no topo do roteiro (vale para o vídeo todo) ou dentro de uma cena (só nela). A voz é a mesma em qualquer modelo. Código: `componentes/Fala.tsx`.

| Modelo | Visual | Quando usar |
|---|---|---|
| `balao` (padrão) | balão Névoa com rabicho | conversa normal |
| `pensamento` | balão bem redondo com bolinhas subindo da cabeça; **a boca fica fechada** | dúvida, pergunta para si mesmo, quiz |
| `grito` | estouro Amarelo com 16 pontas e borda Névoa, texto Tinta em maiúsculas, cai como carimbo | surpresa, chamada, virada |
| `legenda` | sem balão: etiqueta com o nome (na cor do personagem) + legenda **karaokê**, em que a palavra falada acende em Amarelo | vídeos rápidos, Shorts/Reels vistos sem som |
| `faixa` | tarja de telejornal: aba com o nome + faixa Névoa com filete na cor do personagem, entra deslizando | duelo, notícia, entrevista |
| `recado` | bilhete de papel recortado, inclinado 2,5°, preso com fita Amarelo, texto digitado e assinatura Coral | passo a passo, dica, lembrete |

Cor de cada personagem (etiqueta, faixa, chat): Neuro e Caio Coral, Lia e Bento Amarelo, Teo e Rafa Lavanda (`COR_PERSONAGEM` em `personagens/tipos.ts`).

## 8.2 Modelos de texto (`estiloTexto`)

Como os **títulos** aparecem (e as legendas, nos modelos `maquina` e `marcador`). Também vai no topo do roteiro ou em uma cena. Código: `componentes/TextoAnimado.tsx`.

| Modelo | Movimento |
|---|---|
| `palavra` (padrão) | palavra por palavra, com um pulinho |
| `maquina` | digitado letra por letra (1,5 frame por letra), com cursor Amarelo |
| `marcador` | o texto aparece e um marca-texto passa por trás dos destaques (10 frames); o destaque Amarelo fica com texto Tinta e o Coral com texto Névoa |
| `onda` | letra por letra, subindo em onda; os destaques continuam balançando 5px |
| `recorte` | cada palavra é um recorte de papel colado torto, que cai como carimbo: Névoa (normal), Amarelo (`*destaque*`) ou Coral (`_destaque_`) |

Use **um** modelo de texto por vídeo. O `TextoImpacto` (cena `impacto`) continua sendo o sexto jeito: a frase carimbada.

## 8.3 Modelos de vídeo novos

Cada modelo tem um roteiro pronto em `roteiros/modelo-*.json`: copie, troque o conteúdo e mantenha a estrutura.

| Tipo de cena | O que mostra | Campos |
|---|---|---|
| `quiz` | etiqueta "Quiz" + pergunta + alternativas com letra + barra de tempo; na hora certa, a correta vira Amarelo e as outras apagam | `titulo` (a pergunta), `opcoes` (2 a 4), `correta` (começa em 0), `revelarEm?` |
| `versus` | dois painéis frente a frente com o selo "VS" carimbado | `lados` (2, cada um com `titulo`, `itens?` até 4, `cor?`), `vencedor?`, `revelarEm?`, `titulo?` |
| `numero` | um dado gigante que conta até o valor, com sublinhado à mão | `numero`, `numeroPrefixo?`, `numeroSufixo?`, `numeroCasas?`, `numeroRotulo?`, `numeroCor?`, `titulo?` |
| `ranking` | trilha de posições + medalha carimbada ("3º"; a do 1º é Amarelo) + nome | `posicao`, `rankingDe?`, `titulo`, `texto?` |
| `passos` | trilha de etapas + etiqueta "Passo 2 de 3" + título + cartão | `passo`, `passosDe`, `titulo`, `cartao?` |
| `chat` | a conversa como mensagens de celular, com o rosto de cada um; antes da mensagem nova aparecem os três pontinhos | `mensagens` (até 4, de 2 personagens), `titulo?` |

- **Quiz e versus:** a resposta aparece 2 s antes do fim da cena (`tempos.revelarQuiz`), ou no segundo de `revelarEm`. Explique a resposta na cena seguinte.
- **Chat:** a **última** mensagem é a fala da cena (voz de quem escreveu). Para continuar a conversa, repita as mensagens anteriores na próxima cena e acrescente uma. Cenas de chat seguidas trocam com fade. Não tem personagens embaixo.
- **Ícones novos:** `sol`, `gota`, `folha`, `trofeu`, `balao`.

| Modelo de vídeo | Roteiro de exemplo | Cenas principais | Fala · texto |
|---|---|---|---|
| Quiz relâmpago | `modelo-quiz.json` | `impacto` → (`quiz` → resposta) × 2 | `legenda` · `recorte` |
| Duelo | `modelo-duelo.json` | `pergunta` → `versus` → `numero` → `comparacao` → `resumo` | `faixa` · `marcador` |
| Top 3 | `modelo-top3.json` | `impacto` → `ranking` × 3 → `numero` (ritmo rápido) | `legenda` · `onda` |
| Passo a passo | `modelo-passo-a-passo.json` | `pergunta` → `passos` × 3 → `resumo` | `recado` · `maquina` |
| Conversa | `modelo-conversa.json` | `chat` × 6 → `resumo` | mensagens · `palavra` |
| Mapa mental | `modelo-mapa-mental.json` | `no` × 7 → `outro` | karaokê no rodapé |

## 8.4 Mapa mental (`"modelo": "mapa"`)

O modelo mais diferente: **não tem cenas que trocam**. O vídeo inteiro é um mapa de neurônios em câmera contínua. O tema fica no centro (com o logo) e cada ideia é um nó ligado por um traço-neurônio. A câmera voa de um nó ao outro em 26 frames (afastando até 78% no meio do caminho), o traço se desenha e um impulso Amarelo corre por ele. Quem narra aparece no rodapé, com a etiqueta do nome e legenda karaokê. No `outro`, a câmera se afasta, mostra o mapa inteiro pulsando e entram a chamada, a marca e o botão.

- Cenas do tipo `no`: `titulo`, `texto?`, `icone?`, `cor?`, `narracao`, `narrador?`, `expressao?` e `de?` (de qual nó este sai; padrão 0, o centro). O primeiro `no` é o centro.
- Os nós ligados ao centro ficam em volta dele (1040px); os filhos de outro nó abrem em leque (900px, 42° entre irmãos). Medidas em `tokens.ts` (`mapa`).
- De 5 a 8 nós por vídeo. Sem `personagens`: quem fala é o `narrador` de cada nó.
- Código: `src/mapa/MapaMental.tsx`.

---

## 9. Checklist antes de publicar

- [ ] `npm run verificar-estilo` e `npm run typecheck` passaram
- [ ] Cores de destaque só Coral, Amarelo e Lavanda
- [ ] Nenhuma legenda com mais de 2 linhas
- [ ] Só um personagem falando por cena (e uma voz por cena)
- [ ] Um só modelo de texto (`estiloTexto`) no vídeo; modelo de fala (`estiloFala`) trocado em uma cena só quando ajuda a contar
- [ ] Música de fundo baixa e animada tocando; vozes de IA em todas as falas (ou nenhuma voz, se o vídeo foi pedido para dublar)
- [ ] Só no modo dublagem: roteiro de locução gerado (`npm run locucao -- roteiros/<video>.json`) e entregue para quem grava
- [ ] Começa com `intro` e termina com `outro`
- [ ] Nada importante dentro da faixa de 350px de baixo (vertical)
