# Vozes dos personagens (padrão do canal)

A modulação de cada personagem está em `../src/tema/vozes.json` (voz Kokoro + velocidade + tom + direção de atuação).
Esse é o padrão do vídeo **gta6-vs-zelda** e vale para todos os vídeos seguintes.

| Personagem | voz | velocidade | tom (semitons) |
|---|---|---|---|
| neuro | pm_alex | 1.08 | +3 |
| lia | pf_dora | 1.05 | +1 |
| teo | pm_santa | 0.95 | -1 |
| caio | pm_alex | 1.14 | +1 |
| rafa | pm_santa | 1.02 | -3 |
| bento | pm_santa | 1.15 | +2 |

- `neuro.wav` e `lia.wav`: amostras reais geradas nesse vídeo, para ouvir como soa.
- Teo, Caio, Rafa e Bento usam o mesmo método e ainda não têm amostra; gere com `scripts/gerar-vozes.py` quando forem usados e salve aqui como `<personagem>.wav`.
- Regra do canal: vídeos saem sem voz de IA (a equipe grava no Dublador). Estas vozes são a referência de timbre e jeito de falar.
