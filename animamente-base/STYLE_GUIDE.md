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
5. **Flat de verdade:** sem sombras, sem gradientes, sem texturas, sem emojis e sem imagens externas.
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
| transição entre cenas | 15 frames, deslizando da direita, sempre igual |
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

## 6. Personagens

### Construção comum (humanos)
1. **Corpo inteiro "chibi":** cabeça grande, orelhas, tronco, pernas e tênis. Há quatro tipos de tronco: `capsula`, `retangulo`, `redondo` e `atletico`.
2. **Silhueta com uma única borda Névoa por fora.** Tudo o que sai da cabeça (cabelo volumoso, topete, tufos, pontas de faixa) vai em `silhuetaFrente` ou `silhuetaTras`, para ganhar a borda. Por dentro, as partes se separam **só pela cor**.
3. **Braços-neurônio:** traço Névoa grosso que sai de trás da borda (o atleta usa um traço mais grosso). **Mãos-nó:** círculo na cor da pele com borda Névoa. Sem dedos.
4. **Rosto:** olhos Tinta com brilho Névoa, sobrancelhas que reagem à expressão, bochechas Coral e boca Tinta. Sem nariz.
5. **Um detalhe de neurônio** por personagem.
6. Cada humano tem **uma cor de destaque principal** na roupa, para ser reconhecido de longe.

### Neuro: mascote e narrador
É o próprio símbolo da marca ganhando vida: a **silhueta oficial do cérebro** (10 círculos + caule) em Coral com borda Névoa, um **mini A+M com ramos na "testa"**, neurônios nas laterais e no caule, olhos grandes e bochechas Névoa. Tem braços-neurônio com mãos-nó Coral e flutua o tempo todo.
**Papel:** apresenta o tema, resume e encerra o vídeo. É o narrador padrão.

### Lia: a estudante curiosa
Pele 1, blusa em cápsula **Amarelo**, legging Ardósia, tênis Coral, cabelo chanel **Tinta** com franja ondulada e **presilha-neurônio Coral**.
**Papel:** faz as perguntas que o público faria.

### Teo: o professor
Pele 2, camisa **Lavanda** com gola Névoa e botões, calça Ardósia, sapato Tinta, cabelo grisalho Lavanda, **óculos Névoa com nós nas hastes** e **gravata-borboleta Coral**.
**Papel:** explica fórmulas e conceitos.

### Caio: o animado
Pele 3, **cabelo cacheado volumoso feito de círculos** (a mesma construção do cérebro do logo), **moletom Coral** com capuz, bolso canguru e **cordões-neurônio Névoa**, calça Ardósia e tênis Amarelo. Tronco `redondo`.
**Papel:** abre assuntos com energia, faz piada e chama o público para participar.

### Rafa: o atleta do cérebro
Pele 1, **tronco atlético em V**, **regata Ardósia com acabamento Amarelo e um neurônio no peito**, **topete loiro Amarelo**, **faixa de cabeça Coral**, short Coral e tênis Névoa. Tem braços mais grossos e mãos maiores.
**Papel:** desafios, dicas práticas, "bora treinar o cérebro".

> Todos os personagens são **originais**. A base não cria personagens feitos para parecer pessoas reais.

### API única

```tsx
<Personagem
  id="neuro | lia | teo | caio | rafa"
  pose="parado | apontando | acenando | pensando | comemorando"
  expressao="neutro | feliz | surpreso | pensativo | confuso | empolgado"
  fala="texto opcional com *destaque*"
  olhando="esquerda | direita | frente"
/>
```

- Com `fala`, aparece o balão Névoa centralizado acima do grupo, com o rabicho apontando para quem fala.
- **Só um personagem fala por cena.**

### Criando um personagem novo
1. Crie um `ConfigHumano` (veja `Caio.tsx`): pele, roupa, calça, sapato, tipo de tronco, ombros, cabelo e detalhes.
2. Use só cores dos tokens. Tudo o que sai da cabeça vai em `silhuetaFrente`/`silhuetaTras`.
3. Dê um detalhe de neurônio e escolha uma voz em `src/tema/vozes.json`.
4. Registre em `tipos.ts` e `Personagem.tsx`, inclua na `Galeria` e documente aqui.

---

## 6.1 Áudio e vozes (regra do canal)

**Todo vídeo:** tem **música de fundo baixa e animada** e **não tem vozes de IA**. Junto com cada vídeo é gerado o **roteiro de locução** (`npm run locucao`), e a equipe grava as falas.

- **Música:** trilhas originais em `public/musica/`, em volume baixo (`audio.volumeMusica` = 0,16), com fade de entrada e de saída. Ela abaixa mais quando há voz gravada tocando.
- **Uma fala por cena:** ou a `fala` de um personagem (com balão), ou uma `narracao` (sem balão; se o narrador estiver em cena, a boca dele mexe).
- **Tempo da fala sem voz:** 2,4 palavras por segundo + 0,4 s de folga. Escreva falas curtas e faladas, com vírgulas onde a voz respira.
- **Gravações da equipe:** `importar-gravacoes.py` coloca a voz real no lugar e o vídeo se ajusta a ela.
- **Jeito de falar de cada personagem** (vai no roteiro de locução, em `src/tema/vozes.json`):

| Personagem | Jeito de falar |
|---|---|
| Neuro | animado e simpático, voz um pouco mais aguda, como personagem de desenho |
| Lia | curiosa e leve, perguntando de verdade |
| Teo | calmo e didático, sorrindo, sem pressa |
| Caio | muita energia, rápido e brincalhão, puxando o público |
| Rafa | voz grave e motivadora, como um treinador animado |

- Vozes de IA só se o roteiro pedir `"vozesIA": true`, e nunca imitando a voz de uma pessoa real.

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
| `Constelacao` | fundo de neurônios Coral a 16% |
| `BarraProgresso` | barra fina Coral no topo |

Ícones disponíveis: lampada, livro, atomo, grafico, relogio, ampulheta, interrogacao, alvo, certo, errado, calor, dados, play, camera, neuronio.

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
| `resumo` | frase circulada + Neuro | `destaque?`, `personagens?` |
| `outro` | Neuro acenando + chamada + marca + botão (3s) | `chamada?`, `botao?` |

Qualquer cena aceita uma fala: `narracao`, `narrador` e `narracaoEm`, ou a `fala` de um personagem. Todas entram no roteiro de locução.

**Estrutura recomendada (30 a 60s):** `intro` → `pergunta` → 1 a 3 cenas de `explicacao`/`diagrama`/`lista` → `comparacao` (opcional) → `resumo` → `outro`.

---

## 9. Checklist antes de publicar

- [ ] `npm run verificar-estilo` e `npm run typecheck` passaram
- [ ] Cores de destaque só Coral, Amarelo e Lavanda
- [ ] Nenhuma legenda com mais de 2 linhas
- [ ] Só um personagem falando por cena (e uma voz por cena)
- [ ] Música de fundo baixa e animada tocando; nenhuma voz de IA
- [ ] Roteiro de locução gerado (`npm run locucao -- roteiros/<video>.json`) e entregue para quem grava
- [ ] Começa com `intro` e termina com `outro`
- [ ] Nada importante dentro da faixa de 350px de baixo (vertical)
