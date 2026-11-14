# animamente — Base de Animação 2D

Design system de animação do canal **animamente** (*o mundo explicado em animação*), seguindo a identidade visual oficial, feito em [Remotion](https://www.remotion.dev/) (React + TypeScript). Todos os vídeos saem no mesmo estilo porque **você não escreve estilo: só escreve um roteiro em JSON.**

## Começando

```bash
npm install
npm start            # abre o Remotion Studio no navegador (pré-visualização ao vivo)
```

No Studio, abra:
- **Videos → ApresentacaoCanal**: vídeo de apresentação do canal, com vozes (vertical)
- **Videos → ApresentacaoCanalHorizontal**: o mesmo roteiro em 16:9
- **Videos → ExemploEntropia**: exemplo sem voz
- **DesignSystem → FolhaElenco** e **PreviaElenco**: o elenco em colagem
- **DesignSystem → Galeria**: cores, fontes, personagens em todas as expressões/poses e todos os componentes

## Renderizar

```bash
npx remotion render ApresentacaoCanal out/apresentacao-canal.mp4
npm run render:exemplo                                   # out/exemplo-entropia.mp4
npx remotion render MeuVideo out/meu-video.mp4           # qualquer composição
npm run render:galeria                                   # out/galeria.png
```

> Se o Remotion não encontrar o navegador, use `--browser-executable=/caminho/do/chrome`.

## Áudio: música de fundo + locução da equipe (padrão do canal)

Todo vídeo sai com **música de fundo baixa e animada** e **sem vozes de IA**. Junto com o vídeo é gerado um **roteiro de locução** com tudo o que é falado, para a equipe gravar.

- **Música:** trilhas originais compostas por código (sem direitos de terceiros) em `public/musica/`: `animada-1` (padrão, 112 bpm), `animada-2` (120 bpm) e `animada-3` (100 bpm, com swing). Para escolher outra, use `"musica": "animada-2"` no roteiro; para tirar a música, `"musica": false`. O volume fica em `audio.volumeMusica` (tokens). Para gerar de novo ou criar variações, rode `npm run musica`.
- **Falas sem voz:** cada fala ganha o tempo estimado de leitura (2,4 palavras por segundo + folga). A boca do personagem mexe nesse tempo e o balão acompanha.
- **Roteiro de locução:** `npm run locucao -- roteiros/meu-video.json` gera `roteiros/locucao/<id>.md` com o tempo de cada fala no vídeo, quem fala, o texto (com as ênfases), quanto tempo cabe, o jeito de falar e o nome do arquivo para salvar. Gera também `roteiros/locucao/<id>.dublador.txt`, o mesmo roteiro no formato do Dublador.
- **Gravação padrão (Dublador Animamente):** abra `../Dublador/ABRIR_DUBLADOR.bat`, escolha o vídeo renderizado e o `<id>.dublador.txt`, grave fala por fala lendo o teleprompter e exporte. O vídeo final sai em `../Dublador/videos_finalizados/`. Como a voz entra por cima do vídeo pronto, cada fala precisa caber na própria cena.
- **Alternativa (o vídeo se ajusta à voz):** salvem como `fala01.wav`, `fala02.m4a`... numa pasta e rodem
  `python3 scripts/importar-gravacoes.py roteiros/meu-video.json pasta/`.
  O script corta os silêncios e normaliza o volume. O vídeo passa a tocar as vozes, ajusta o tempo das cenas, sincroniza boca e balão e abaixa a música.
- *(Opcional, fora do padrão)* Vozes de IA (Kokoro, offline): `"vozesIA": true` no roteiro + `scripts/gerar-vozes.py`. A instalação está explicada no topo do script.

## Criando um vídeo novo (4 passos)

> Regra do canal: **sempre** gerar o vídeo com música de fundo baixa e animada, sem vozes de IA, e **sempre** gerar o roteiro de locução junto.

**1. Escreva o roteiro** em `roteiros/meu-video.json`:

```json
{
  "id": "fotossintese",
  "titulo": "Como funciona a _fotossíntese_?",
  "categoria": "Biologia",
  "formato": "vertical",
  "cenas": [
    { "tipo": "intro" },
    {
      "tipo": "pergunta",
      "duracao": 4,
      "personagens": [
        { "id": "lia", "pose": "pensando", "expressao": "confuso", "fala": "Planta *come* luz?" }
      ]
    },
    {
      "tipo": "explicacao",
      "duracao": 6,
      "personagens": [{ "id": "teo", "pose": "apontando", "expressao": "feliz" }],
      "lousa": "6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂",
      "legenda": "Luz vira *energia química*"
    },
    {
      "tipo": "resumo",
      "duracao": 4,
      "destaque": "Luz + água + CO₂ = açúcar",
      "personagens": [{ "id": "neuro", "pose": "comemorando", "expressao": "empolgado", "fala": "Simples assim!" }]
    },
    { "tipo": "outro" }
  ]
}
```

**2. Gere o roteiro de locução:** `npm run locucao -- roteiros/meu-video.json` (o arquivo `<id>.dublador.txt` é o que se abre no Dublador)

**3. Registre** em `src/Root.tsx`:

```ts
import meuVideo from "../roteiros/meu-video.json";

const videos = [
  { id: "ExemploEntropia", roteiro: exemploEntropia as Roteiro },
  { id: "Fotossintese", roteiro: meuVideo as Roteiro },
];
```

**4. Veja no Studio** (`npm start`) e renderize. Depois abra o vídeo e o `<id>.dublador.txt` no Dublador para gravar as vozes.

### Referência rápida do roteiro

- Tempos em **segundos**. `intro` (2s) e `outro` (3s) têm duração fixa.
- `formato`: `"vertical"` (1080×1920, Reels/Shorts) ou `"horizontal"` (1920×1080, YouTube).
- `tema`: `"escuro"` (padrão da marca, fundo Tinta) ou `"claro"` (fundo Névoa).
- `categoria`: etiqueta amarela da intro (ex.: `"Ciência"`, `"História"`, `"Você sabia?"`).
- Personagens: `neuro` (cérebro), `lia` (gata), `bento` (cachorro), `teo` (bicho-preguiça), `rafa` (elefante), `caio` (lontra). Campos: `id`, `pose`, `expressao`, `olhando`, `fala`, `falaEm` (s), `mudancas`:
  ```json
  "mudancas": [{ "em": 1.5, "expressao": "surpreso" }, { "em": 3, "pose": "comemorando", "expressao": "feliz" }]
  ```
- Destaques no texto: `*amarelo*` e `_coral_`.
- Cartões (`cartao`, `nos`, `itens`): `{ "texto", "titulo?", "icone?", "cor?" }`. A cor é `"coral"`, `"amarelo"` ou `"lavanda"`.
- Voz em off: `"narracao": "texto"`, `"narrador": "teo"` (padrão `neuro`), `"narracaoEm": 0.3`.
- Outro: `"chamada"` (padrão "Continue _aprendendo_!") e `"botao"` (padrão "Siga para mais").

Se o roteiro sair do padrão (personagem, pose ou ícone inexistente, cor fora de Coral/Amarelo/Lavanda, legenda longa demais, dois personagens falando ao mesmo tempo...), o vídeo **não renderiza** e mostra a lista de erros.

## Estrutura

```
src/
  tema/        tokens.ts (ÚNICA fonte de cores, fontes, tamanhos, tempos), formatos.ts, Estilo.tsx
  personagens/ Neuro (cérebro do logo), Personagem (API única), partes/ (rosto, braços-neurônio, cérebro A+M)
               colagem/ elenco em colagem de papel: Gata (Lia), Cachorro (Bento), Preguica (Teo),
                        Elefante (Rafa), Lontra (Caio) + papel.tsx (recortes/texturas) e rosto.tsx (olhos, boca South Park)
  Elenco.tsx   folha do elenco (FolhaElenco) e prévia com todos falando (PreviaElenco)
  componentes/ Logo/Marca, Etiqueta, Titulo, Legenda, BalaoDeFala, Cartao, Lousa, Seta, Destaque, Contador,
               Comparação, Ícones, Constelacao (fundo), BarraProgresso
  cenas/       intro, pergunta, explicacao, diagrama, comparacao, lista, resumo, outro + LayoutCena
  animacao/    helpers: entrar, sair, estiloEntrada, stagger, respirar, piscar, flutuar, desenharTraco...
  Video.tsx    lê o roteiro e monta o vídeo
  Galeria.tsx  vitrine do design system
roteiros/      um JSON por vídeo
scripts/       verificar-estilo.mjs, gerar-musica.py, roteiro-locucao.ts, importar-gravacoes.py, gerar-vozes.py (opcional)
public/musica/ trilhas de fundo (geradas por scripts/gerar-musica.py)
public/vozes/  gravações importadas (uma por cena) + manifesto
roteiros/locucao/ roteiros de locução gerados (um por vídeo)
STYLE_GUIDE.md as regras visuais (leia antes de mexer)
```

## Mantendo o padrão

```bash
npm run verificar-estilo   # acusa cor hex, fonte ou animação fora dos tokens/helpers
npm run typecheck
```

- Quer mudar uma cor, fonte ou tempo? Mude **só** em `src/tema/tokens.ts`, e todos os vídeos mudam junto.
- Precisa de um componente ou cena nova? Monte com os tokens e helpers, adicione à `Galeria` e documente no `STYLE_GUIDE.md`.

## Usando com IA nas próximas animações

Use o **prompt 1** de `prompt-base-animacao-animamente.md` (já adaptado ao Dublador).

## Licenças

- Música: composta e sintetizada pelo próprio projeto (`scripts/gerar-musica.py`), sem direitos de terceiros.
- Vozes de IA opcionais: Kokoro TTS (licença Apache 2.0).
- Fonte Fredoka: SIL Open Font License (via @fontsource, empacotada localmente, funciona offline).
- Remotion: uso gratuito para pessoas físicas e empresas pequenas. Confira a licença em remotion.dev/license antes de usar comercialmente com uma equipe maior.
