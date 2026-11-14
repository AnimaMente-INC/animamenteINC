# AnimamenteINC — instruções para o Claude

Canal educativo **animamente** ("o mundo explicado em animação"): vídeos animados para Instagram e YouTube.

## Pastas

- `animamente-base/` — base de animação em Remotion (design system). Roteiros em `roteiros/`, vídeos renderizados em `out/`.
- `Dublador/` — app Python para a equipe gravar a voz por cima do vídeo pronto (`ABRIR_DUBLADOR.bat`). Vídeos finais em `Dublador/videos_finalizados/`.
- `animamente-identidade-visual/` — logos e peças oficiais.

## Regra principal: SEMPRE que for criar um vídeo com roteiro

Siga o **prompt 1** de `animamente-base/prompt-base-animacao-animamente.md`. Leia esse arquivo antes de começar. Em resumo:

1. **Antes de tudo**, leia `animamente-base/STYLE_GUIDE.md` e `animamente-base/src/tema/tokens.ts` e siga-os à risca: fundo Tinta com constelação de neurônios, destaques só Coral/Amarelo/Lavanda, só Fredoka, estilo adesivo com borda Névoa, personagens Neuro, Lia, Teo, Caio e Rafa, tempos e transições da base.
2. **Crie apenas um roteiro novo** em `animamente-base/roteiros/<id>.json` (com `"id"`) e registre em `src/Root.tsx`. Só crie componente ou cena nova se nenhum existente servir; nesse caso use os tokens e helpers da base e adicione ao `STYLE_GUIDE.md` e à Galeria.
3. **Áudio:** música de fundo baixa e animada (`animada-1`, `animada-2` ou `animada-3`) e **nenhuma voz de IA**. A equipe grava as vozes no Dublador, por cima do vídeo pronto.
4. **Falas feitas para o Dublador:**
   - uma fala por cena, com no máximo ~16 palavras;
   - frases curtas e faladas, sem parênteses e sem começar linha com `[`;
   - cada cena dura pelo menos o tempo da fala (2,4 palavras por segundo) + 1 segundo;
   - todo personagem que fala tem `"expressao"` definida.
5. **Não** importe gravações nem ajuste o vídeo à voz (`importar-gravacoes.py` é só alternativa, a pedido). O vídeo é renderizado uma vez.
6. **Entregue, nesta ordem:**
   1. `roteiros/<id>.json`;
   2. o vídeo renderizado em `out/<id>.mp4`;
   3. o roteiro de locução: rode `npm run locucao -- roteiros/<id>.json` e confira `roteiros/locucao/<id>.dublador.txt` e `<id>.md` (blocos em ordem de tempo, sem sobreposição, último bloco terminando antes do fim do vídeo). Se uma fala não couber, encurte a fala ou aumente a `"duracao"` da cena e gere vídeo e roteiro de novo.
7. **No final**, informe os dois caminhos para abrir no Dublador: o do vídeo (`.mp4`) e o do roteiro (`.dublador.txt` ou `.md`).

Se o pedido não disser tema, formato (vertical ou horizontal), duração e público, pergunte antes de criar.

## Formato do roteiro de locução (Dublador)

```
[00:03.5 - 00:07.2] Neuro
(começa sorrindo e termina empolgado) Eu sou o Neuro, o cérebro desta turma!
```

`[início - fim] Quem fala`, texto na linha de baixo, `(parênteses)` = jeito de falar (não é lido), `#` = comentário, pelo menos 0,3 s de respiro entre falas. Os tempos vêm de `npm run locucao`, nunca escritos à mão. Regras completas em `Dublador/LEIA-ME.md`.

## Outras regras

- Nenhuma cor, fonte, tamanho ou tempo fora de `src/tema/tokens.ts`.
- Não instale `node_modules` nem `.venv` por um ambiente Linux dentro desta pasta: ela é usada no Windows.
- Não faça commit no git sem pedido.
