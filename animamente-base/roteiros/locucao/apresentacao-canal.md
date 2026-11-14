# Roteiro de locução: Prazer, animamente!

**Vídeo:** `apresentacao-canal` · vertical · duração total 0:48.8 · música de fundo: animada-1 (baixa)
**Falas:** 9 · o vídeo foi gerado **sem vozes de IA**. Tudo o que está aqui é para a equipe gravar.

## Elenco

| Personagem | Quem grava | Jeito de falar |
|---|---|---|
| Neuro (mascote e narrador) | ______________ | animado e simpático, voz um pouco mais aguda, como personagem de desenho |
| Caio (o animado) | ______________ | muita energia, rápido e brincalhão, puxando o público |
| Teo (o professor) | ______________ | calmo e didático, sorrindo, sem pressa |
| Rafa (o atleta do cérebro) | ______________ | voz grave e motivadora, como um treinador animado |
| Lia (a estudante curiosa) | ______________ | curiosa e leve, perguntando de verdade, como quem acabou de ter a dúvida |

## Falas (na ordem do vídeo)

As palavras em **negrito** são os destaques da tela: dê ênfase a elas. O tempo mostra onde a fala entra no vídeo. Se a gravação ficar um pouco mais longa, tudo bem, porque o vídeo se ajusta sozinho quando você importa as gravações.

### 1. Neuro · 0:00.5 → 0:02.6

> Oi! Bem-vindo à animamente!

- **Cabe em:** cerca de 2,1s (4 palavras)
- **Jeito de falar:** natural, narração em off (não aparece na cena)
- **Salvar como:** `fala01.wav` (cena 1, intro)

### 2. Neuro · 0:03.5 → 0:07.2

> Eu sou o **Neuro**, o cérebro desta turma!

- **Cabe em:** cerca de 3,7s (8 palavras)
- **Jeito de falar:** começa sorrindo e termina empolgado, fala com balão
- **Salvar como:** `fala02.wav` (cena 2, pergunta)

### 3. Caio · 0:08.1 → 0:11.8

> E o que a gente faz **aqui**, Neuro?

- **Cabe em:** cerca de 3,7s (8 palavras)
- **Jeito de falar:** empolgado, fala com balão
- **Salvar como:** `fala03.wav` (cena 3, pergunta)

### 4. Neuro · 0:12.8 → 0:19.5

> A gente pega um assunto complicado, transforma numa animação simples, e você entende de verdade.

- **Cabe em:** cerca de 6,7s (15 palavras)
- **Jeito de falar:** natural, narração em off (não aparece na cena)
- **Salvar como:** `fala04.wav` (cena 4, diagrama)

### 5. Teo · 0:20.5 → 0:27.6

> Tem ciência, história e curiosidades, em vídeos curtos e longos, aqui no Instagram e no YouTube.

- **Cabe em:** cerca de 7,1s (16 palavras)
- **Jeito de falar:** sorrindo, narração (aparece na cena e a boca mexe)
- **Salvar como:** `fala05.wav` (cena 5, lista)

### 6. Rafa · 0:28.5 → 0:31.8

> E aqui o cérebro também **treina**. Bora?

- **Cabe em:** cerca de 3,3s (7 palavras)
- **Jeito de falar:** começa sorrindo e termina empolgado, fala com balão
- **Salvar como:** `fala06.wav` (cena 6, explicacao)

### 7. Lia · 0:32.8 → 0:37.8

> Estudar não precisa ser chato. Com animação, tudo fica mais leve!

- **Cabe em:** cerca de 5,0s (11 palavras)
- **Jeito de falar:** começa em dúvida e termina sorrindo, narração (aparece na cena e a boca mexe)
- **Salvar como:** `fala07.wav` (cena 7, comparacao)

### 8. Neuro · 0:39.0 → 0:43.6

> Então já sabe: aqui o mundo é explicado em animação!

- **Cabe em:** cerca de 4,6s (10 palavras)
- **Jeito de falar:** empolgado, fala com balão
- **Salvar como:** `fala08.wav` (cena 8, resumo)

### 9. Neuro · 0:44.5 → 0:48.2

> Siga a animamente, e até o próximo vídeo!

- **Cabe em:** cerca de 3,7s (8 palavras)
- **Jeito de falar:** sorrindo, narração (aparece na cena e a boca mexe)
- **Salvar como:** `fala09.wav` (cena 9, outro)

## Como gravar e colocar no vídeo

**Jeito padrão: Dublador Animamente.** Abra `Dublador/ABRIR_DUBLADOR.bat`, clique em "Abrir vídeo" (o .mp4 deste vídeo) e em "Abrir roteiro" (`roteiros/locucao/apresentacao-canal.dublador.txt`). Grave fala por fala lendo o teleprompter, revise e exporte. O vídeo final sai em `Dublador/videos_finalizados/`.

**Jeito alternativo (o vídeo se ajusta à voz):**

1. Grave **uma fala por arquivo**, em lugar silencioso, com o celular a um palmo da boca.
2. Deixe meio segundo de silêncio antes e depois. O silêncio extra é cortado automaticamente.
3. Salve cada fala com o nome indicado (`fala01.wav`, `fala02.wav`...). Também valem `.mp3`, `.m4a` e `.ogg`.
4. Coloque tudo numa pasta e rode:
   `python3 scripts/importar-gravacoes.py roteiros/apresentacao-canal.json pasta-das-gravacoes/`
5. Renderize de novo: a voz de vocês toca no lugar certo, a boca e o balão acompanham, e a música abaixa um pouco sozinha.
