# Dublador Animamente

Programa para gravar a locução dos vídeos do canal **por cima do vídeo**, trecho por trecho, lendo o roteiro num teleprompter. Cada fala é cortada e colocada no tempo certo, e no final sai o vídeo completo.

## Como abrir

Dê dois cliques em **`ABRIR_DUBLADOR.bat`**.

- Na primeira vez ele prepara tudo sozinho (leva 1–3 minutos e precisa de internet) e cria um atalho **"Dublador Animamente"** na Área de Trabalho.
- Precisa do Python instalado. Se não tiver: baixe em https://www.python.org/downloads/ e, na instalação, marque **"Add Python to PATH"**.

## Como usar

1. **🎬 Abrir vídeo**: o vídeo já pronto (sem voz).
2. **📝 Abrir roteiro**: o arquivo `.txt` no formato abaixo.
3. **Microfone**: escolha na lista. A barrinha colorida ao lado tem que mexer quando você fala.
4. Selecione um trecho na lista e aperte **Espaço**:
   - o vídeo volta 3 segundos e faz a contagem **3, 2, 1**;
   - no zero começa a gravar, e o texto vai acendendo no ritmo certo (a palavra atual fica amarela);
   - aperte **Espaço** de novo quando terminar (ou ele para sozinho no fim do trecho + o tempo extra).
5. **Revise**: ele toca o vídeo com a sua fala já no lugar.
   - Ficou bom? **Enter** = aprovar e ir para o próximo.
   - Não gostou? **Espaço** de novo = regravar.
   - A frase passou do tempo? Regrave mais rápido ou use **⏩ Acelerar para caber**.
   - Quer empurrar a fala um pouquinho? Use o **Ajuste fino** (ex.: `0.2` = 0,2 s depois, `-0.2` = antes).
6. Com tudo aprovado: **💾 Exportar vídeo final**. O vídeo sai em **`videos_finalizados/`**, junto com um `.wav` só com a voz.

Pode fechar o programa no meio. Quando abrir o mesmo vídeo de novo, ele volta de onde parou, com as gravações e o roteiro (tudo fica em `projetos/`). Assim cada pessoa da equipe pode gravar a sua parte em momentos diferentes.

**Atalhos:** Espaço = gravar/parar · P = ouvir com vídeo · Enter = aprovar e próximo · ↑ ↓ = trocar de trecho · Esc = parar.

**Dica de som:** grave de **fone de ouvido** se marcar "Ouvir o som do vídeo enquanto grava". Sem fone, deixe essa opção desmarcada, senão a música do vídeo vaza no microfone.

---

## Como escrever o roteiro (formato obrigatório)

O roteiro é um arquivo de texto (`.txt`). Pode ser escrito no Bloco de Notas.

O Dublador também abre direto o **roteiro de locução em Markdown (`.md`)** gerado pela base de animação (`animamente-base/roteiros/locucao/<video>.md`): ele lê o tempo, quem fala, a fala e o jeito de falar de cada bloco `### 1. Neuro · 0:00.5 → 0:02.6`.

```
# Linhas que começam com # são ignoradas.

[00:00 - 00:06] Neuro
Oi! Eu sou o Neuro. Hoje vamos descobrir por que o céu é azul.

[00:06.5 - 00:10] Lia
Mas Neuro... (pausa) a luz do Sol não é branca?

[00:10.5] Teo
(tom de professor) Exatamente, Lia! A luz branca é uma mistura de todas as cores.
```

### Regras

1. **Cada fala começa com uma linha de tempo entre colchetes**: `[início - fim]`.
   - Formato `minutos:segundos`, com décimos se precisar: `[01:05.5 - 01:09]`.
   - Também vale `[1:02:03]` (horas) ou só segundos: `[12.5 - 15]`.
   - O **fim é opcional**. Sem fim, o trecho vai até o começo do próximo (ou até o fim do vídeo).
2. **Depois do colchete, na mesma linha, o nome de quem fala** (opcional): `[00:05 - 00:09] Lia`. Aparece em cima do teleprompter e na lista. Assim cada pessoa da equipe acha as próprias falas.
3. **O texto vem nas linhas de baixo**, até o próximo colchete. Pode ter várias linhas.
4. **Parênteses = instrução, não é lido**: `(pausa)`, `(animado)`, `(rindo)`. Aparece em lilás e menor.
5. **Linhas com `#` são comentários** (título, observações, nome do vídeo).
6. **Os trechos precisam estar em ordem de tempo.**
7. **Não comece uma linha de texto com `[`**. Colchete no início da linha é sempre lido como tempo.

### Para a fala caber no tempo

- Conte **~2,5 palavras por segundo** de janela. Uma janela de 4 s comporta umas 10 palavras.
- O programa avisa quando o texto parece grande demais para a janela.
- Deixe **0,3 a 0,5 s de respiro** entre o fim de um trecho e o início do próximo.
- **Uma ideia por trecho.** Trechos de 3 a 8 segundos são os mais fáceis de gravar bem.
- Pegue os tempos das cenas do próprio vídeo (no editor ou no roteiro da animação). A fala deve começar quando a cena correspondente aparece.

### Erros comuns

| Problema | Como corrigir |
|---|---|
| "texto fora de um trecho" | Tem texto antes do primeiro `[tempo]`. Apague ou comente com `#`. |
| "tempo inválido" | Use `mm:ss`, ex.: `[00:07.5 - 00:10]`. Não use `7s5` nem `00h07`. |
| "precisam estar em ordem" | Algum trecho começa antes do anterior. |
| "vai ficar corrido" | Texto longo para a janela: encurte o texto ou aumente o fim do trecho. |
