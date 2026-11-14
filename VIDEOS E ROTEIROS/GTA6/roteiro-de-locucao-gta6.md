# Roteiro de locução: Como o GTA 6 vai mudar os games?

**Vídeo:** `gta6-nova-geracao` · vertical · duração total 1:08.2 · música de fundo: animada-2 (baixa)
**Falas:** 9 · o vídeo foi gerado **sem vozes de IA**. Tudo o que está aqui é para a equipe gravar.

## Elenco

| Personagem | Quem grava | Jeito de falar |
|---|---|---|
| Caio (a lontra brincalhona) | ______________ | brincalhão e travesso, com risadinha, como quem vai contar uma piada |
| Neuro (mascote e narrador) | ______________ | animado e simpático, voz um pouco mais aguda, como personagem de desenho |
| Bento (o cachorro otimista) | ______________ | empolgadíssimo e otimista, rápido, como cachorro feliz que topa tudo |

## Falas (na ordem do vídeo)

As palavras em **negrito** são os destaques da tela: dê ênfase a elas. O tempo mostra onde a fala entra no vídeo. Se a gravação ficar um pouco mais longa, tudo bem, porque o vídeo se ajusta sozinho quando você importa as gravações.

### 1. Caio · 0:02.5 → 0:07.1

> Neuro, por que todo mundo só fala de **GTA 6**?

- **Cabe em:** cerca de 4,6s (10 palavras)
- **Jeito de falar:** em dúvida, fala com balão
- **Salvar como:** `fala01.wav` (cena 2, pergunta)

### 2. Neuro · 0:08.0 → 0:13.4

> Ele chega dia **dezenove de novembro**, treze anos depois do GTA 5.

- **Cabe em:** cerca de 5,4s (12 palavras)
- **Jeito de falar:** empolgado, narração (aparece na cena e a boca mexe)
- **Salvar como:** `fala02.wav` (cena 3, explicacao)

### 3. Bento · 0:14.5 → 0:20.7

> O trailer dois virou o maior lançamento de vídeo da **história** em um dia!

- **Cabe em:** cerca de 6,2s (14 palavras)
- **Jeito de falar:** empolgado, narração (aparece na cena e a boca mexe)
- **Salvar como:** `fala03.wav` (cena 4, imagem)

### 4. Caio · 0:22.0 → 0:28.2

> E tudo foi capturado **dentro do jogo**, num PS5. Olha esse reflexo na água!

- **Cabe em:** cerca de 6,2s (14 palavras)
- **Jeito de falar:** surpreso, narração (aparece na cena e a boca mexe)
- **Salvar como:** `fala04.wav` (cena 5, imagem)

### 5. Bento · 0:29.5 → 0:35.3

> Agora são dois protagonistas, a Lucia e o Jason, um **casal** no crime.

- **Cabe em:** cerca de 5,8s (13 palavras)
- **Jeito de falar:** sorrindo, narração (aparece na cena e a boca mexe)
- **Salvar como:** `fala05.wav` (cena 6, imagem)

### 6. Caio · 0:36.5 → 0:42.7

> O trailer dá pistas: academia, casa que evolui e redes sociais **dentro** do jogo.

- **Cabe em:** cerca de 6,2s (14 palavras)
- **Jeito de falar:** empolgado, narração (aparece na cena e a boca mexe)
- **Salvar como:** `fala06.wav` (cena 7, lista)

### 7. Neuro · 0:44.5 → 0:51.5

> E a indústria sente: preço de oitenta dólares, rivais fugindo da data e caixa **sem disco**.

- **Cabe em:** cerca de 7,1s (16 palavras)
- **Jeito de falar:** pensativo, narração (aparece na cena e a boca mexe)
- **Salvar como:** `fala07.wav` (cena 8, diagrama)

### 8. Bento · 0:53.3 → 0:57.4

> Então todo jogo novo vai ser **comparado** com ele?

- **Cabe em:** cerca de 4,2s (9 palavras)
- **Jeito de falar:** surpreso, fala com balão
- **Salvar como:** `fala08.wav` (cena 9, comparacao)

### 9. Neuro · 0:59.3 → 1:03.8

> Exato! Ele vira a **régua** da nova geração de jogos.

- **Cabe em:** cerca de 4,6s (10 palavras)
- **Jeito de falar:** empolgado, fala com balão
- **Salvar como:** `fala09.wav` (cena 10, resumo)

## Como gravar e colocar no vídeo

**Jeito padrão: Dublador Animamente.** Abra `Dublador/ABRIR_DUBLADOR.bat`, clique em "Abrir vídeo" (o .mp4 deste vídeo) e em "Abrir roteiro" (`roteiros/locucao/gta6-nova-geracao.dublador.txt`). Grave fala por fala lendo o teleprompter, revise e exporte. O vídeo final sai em `Dublador/videos_finalizados/`.

**Jeito alternativo (o vídeo se ajusta à voz):**

1. Grave **uma fala por arquivo**, em lugar silencioso, com o celular a um palmo da boca.
2. Deixe meio segundo de silêncio antes e depois. O silêncio extra é cortado automaticamente.
3. Salve cada fala com o nome indicado (`fala01.wav`, `fala02.wav`...). Também valem `.mp3`, `.m4a` e `.ogg`.
4. Coloque tudo numa pasta e rode:
   `python3 scripts/importar-gravacoes.py roteiros/gta6-nova-geracao.json pasta-das-gravacoes/`
5. Renderize de novo: a voz de vocês toca no lugar certo, a boca e o balão acompanham, e a música abaixa um pouco sozinha.
