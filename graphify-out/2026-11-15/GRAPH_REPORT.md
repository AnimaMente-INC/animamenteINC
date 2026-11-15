# Graph Report - AnimamenteINC  (2026-11-15)

## Corpus Check
- 90 files · ~81,055 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 4 file(s) not represented in the graph (top: (none) 3, .bat 1)

## Summary
- 923 nodes · 2565 edges · 36 communities (33 shown, 3 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 85 edges (avg confidence: 0.85)
- Token cost: 224,496 input · 0 output

## Graph Freshness
- Built from commit: `0b3b4571`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Helpers de Animação
- App Dublador (UI)
- Elenco em Colagem
- Personagem Neuro
- Apresentação do Canal
- Processamento de Voz
- Cenas do Passeio
- Guia de Estilo
- Vozes de IA (Kokoro)
- Gerador de Música
- roteiro.ts
- Roteiro de Locução (script)
- Falas do Neuro (GTA6)
- Base Remotion e Checklist
- package.json
- Fluxo do Dublador
- Instruções do Projeto
- Composições Registradas
- Config TypeScript
- Leitura de Vídeo (ffmpeg)
- Finanças pra Casais
- Prompts da Base
- Parser de Roteiro
- Pipeline de Áudio
- README da Base
- Falas (na ordem do vídeo)
- Personagens do Canal
- Elenco.tsx
- Verificador de Estilo
- Trechos de Fala
- Regras do Roteiro Modelo
- Vozes de Referência
- Config graphify
- Regra principal: criar vídeo com roteiro (prompt 1)
- formatos.ts
- Prompt de contexto — Neuro respondendo comentários

## God Nodes (most connected - your core abstractions)
1. `useEstilo()` - 84 edges
2. `App` - 67 edges
3. `react` - 51 edges
4. `estiloEntrada()` - 39 edges
5. `remotion` - 38 edges
6. `cores` - 36 edges
7. `ConteudoGaleria()` - 32 edges
8. `Falas (na ordem do vídeo)` - 31 edges
9. `entrar()` - 24 edges
10. `forma` - 21 edges

## Surprising Connections (you probably didn't know these)
- `Regras das falas (≤16 palavras, 2,4 palavras/s + 1 s)` --semantically_similar_to--> `Regra principal: criar vídeo com roteiro (prompt 1)`  [INFERRED] [semantically similar]
  animamente-base/prompt-base-animacao-animamente.md → CLAUDE.md
- `Rosto e boca (`colagem/rosto.tsx`)` --references--> `Mandibula()`  [INFERRED]
  animamente-base/STYLE_GUIDE.md → animamente-base/src/personagens/colagem/rosto.tsx
- `Regras das falas (≤16 palavras, 2,4 palavras/s + 1 s)` --semantically_similar_to--> `Regra ~2,5 palavras por segundo e 0,3-0,5 s de respiro`  [INFERRED] [semantically similar]
  animamente-base/prompt-base-animacao-animamente.md → Dublador/LEIA-ME.md
- `scripts/importar-gravacoes.py (vídeo se ajusta à voz)` --semantically_similar_to--> `Gravação por trecho com teleprompter e contagem 3-2-1`  [INFERRED] [semantically similar]
  animamente-base/README.md → Dublador/LEIA-ME.md
- `Modificador de voz (tom e timbre por personagem)` --semantically_similar_to--> `src/tema/vozes.json (jeito de falar de cada personagem)`  [INFERRED] [semantically similar]
  Dublador/LEIA-ME.md → animamente-base/STYLE_GUIDE.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Fontes obrigatorias do padrao antes de animar** — animamente_base_prompt_base_animacao_animamente, animamente_base_style_guide, animamente_base_claude_tokens_ts, animamente_base_claude_vozes_json [EXTRACTED 1.00]
- **Elenco animamente (Neuro, Lia, Bento, Teo, Rafa, Caio)** — videos_e_roteiros_apresenta__o_do_canal_apresentacao_canal_roteiro_neuro, videos_e_roteiros_apresenta__o_do_canal_apresentacao_canal_roteiro_lia, videos_e_roteiros_explica__o_canal_roteiros_video3_voce_escolhe_dublador_bento, videos_e_roteiros_apresenta__o_do_canal_apresentacao_canal_roteiro_teo, animamente_base_style_guide_rafa, videos_e_roteiros_apresenta__o_do_canal_apresentacao_canal_roteiro_caio [EXTRACTED 1.00]
- **Elenco em colagem de papel (Neuro, Lia, Bento, Teo, Rafa, Caio)** — animamente_base_style_guide_neuro, animamente_base_style_guide_lia, animamente_base_style_guide_bento, animamente_base_style_guide_teo, animamente_base_style_guide_rafa, animamente_base_style_guide_caio [EXTRACTED 1.00]
- **Pipeline roteiro JSON → render → locução → Dublador → vídeo final** — animamente_base_readme_roteiro_json, animamente_base_readme_npm_run_locucao, dublador_leia_me_formato_roteiro, dublador_leia_me_dublador_animamente, dublador_leia_me_videos_finalizados [EXTRACTED 1.00]
- **Fluxo de gravacao: npm run locucao -> roteiro Dublador -> gravacao** — videos_e_roteiros_gta6_gta6_nova_geracao_dublador_npm_run_locucao, videos_e_roteiros_gta6_gta6_nova_geracao_dublador_formato_dublador, videos_e_roteiros_gta6_gta6_tudo_que_sabemos_dublador_padrao, videos_e_roteiros_finan_as_pra_casais_roteiro_de_locucao_financas_casal_importar_gravacoes [INFERRED 0.85]
- **Regras de identidade visual (paleta, Fredoka, adesivo, constelação, tokens)** — animamente_base_style_guide_paleta_cores, animamente_base_style_guide_fredoka, animamente_base_style_guide_estilo_adesivo, animamente_base_style_guide_constelacao_neuronios, animamente_base_readme_tokens_ts [INFERRED 0.85]
- **Serie de apresentacao do canal (3 videos + apresentacao)** — videos_e_roteiros_apresenta__o_do_canal_apresentacao_canal_roteiro, videos_e_roteiros_explica__o_canal_roteiros_video1_o_que_e_o_canal_dublador, videos_e_roteiros_explica__o_canal_roteiros_video2_temas_dublador, videos_e_roteiros_explica__o_canal_roteiros_video3_voce_escolhe_dublador [INFERRED 0.85]

## Communities (36 total, 3 thin omitted)

### Community 0 - "Helpers de Animação"
Cohesion: 0.06
Nodes (128): carimbar(), contar(), correr(), crescer(), cursorAceso(), desenharTraco(), digitar(), easeEntrada (+120 more)

### Community 1 - "App Dublador (UI)"
Cohesion: 0.06
Nodes (10): abrir_no_sistema(), App, ligar(), fmt(), ler_roteiro(), log_erro(), Microfone, Projeto (+2 more)

### Community 2 - "Elenco em Colagem"
Cohesion: 0.07
Nodes (74): BOCA, BUSTOS, VIEWBOX_BUSTO, BOCA, CABECA, Cachorro(), CAPA, QUEIXO (+66 more)

### Community 3 - "Personagem Neuro"
Cohesion: 0.08
Nodes (45): aleatorio(), bocaAberta(), flutuar(), piscar(), respirar(), suave(), maos(), maosPorPose() (+37 more)

### Community 4 - "Apresentação do Canal"
Cohesion: 0.07
Nodes (42): Roteiro: Prazer, animamente! (apresentacao-canal), Caio (a lontra brincalhona), Lia (a gata estudante curiosa), Neuro (mascote e narrador), Slogan: o mundo explicado em animacao, Teo (o bicho-preguica professor), Roteiro Dublador: O que e a animamente? (canal-01), Proposta: animacao simples, sem decoreba (+34 more)

### Community 5 - "Processamento de Voz"
Cohesion: 0.08
Nodes (13): aplicar_voz(), ErroRoteiro, _ffmpeg_filtrar(), _istft(), ler_texto_arquivo(), listar_microfones(), main(), mudar_timbre() (+5 more)

### Community 6 - "Cenas do Passeio"
Cohesion: 0.15
Nodes (28): entrar(), Abertura(), Andarilho(), Anel(), Arvore(), Balanca(), Balao(), Cenario() (+20 more)

### Community 7 - "Guia de Estilo"
Cohesion: 0.07
Nodes (22): animamente-base CLAUDE.md, Entrega para o Dublador (.mp4 e .dublador.txt), Fluxo de criacao de video (roteiro, musica, falas, render, locucao), npm run verificar-estilo / npm run locucao, src/tema/tokens.ts (fonte unica de cores, fontes, tamanhos e tempos), src/tema/vozes.json (jeito de falar dos personagens), 1. Princípios, 2. Cores (+14 more)

### Community 8 - "Vozes de IA (Kokoro)"
Cohesion: 0.16
Nodes (7): duracao_wav(), fala_da_cena(), main(), mudar_tom(), duracao(), main(), carregar_cfg()

### Community 9 - "Gerador de Música"
Cohesion: 0.21
Nodes (12): acorde(), baixo(), bumbo(), chimbal(), dedilhado(), env(), gerar(), hz() (+4 more)

### Community 10 - "roteiro.ts"
Cohesion: 0.16
Nodes (26): CENAS, BarraProgresso(), ItemPreco, validarLegenda(), aplicarVoz(), CenaRoteiro, comPadroes(), duracaoCena() (+18 more)

### Community 11 - "Roteiro de Locução (script)"
Cohesion: 0.10
Nodes (16): blocos, destino, destinoDublador, dublador, elenco, EMOCAO, falas, frames (+8 more)

### Community 12 - "Falas do Neuro (GTA6)"
Cohesion: 0.11
Nodes (19): 10. Neuro · 1:04.3 → 1:11.0, 11. Neuro · 1:12.3 → 1:18.1, 12. Neuro · 1:19.2 → 1:24.6, 13. Neuro · 1:25.7 → 1:32.4, 14. Neuro · 1:34.0 → 1:41.1, 15. Neuro · 1:42.2 → 1:45.9, 1. Neuro · 0:00.4 → 0:03.3, 2. Neuro · 0:04.2 → 0:09.6 (+11 more)

### Community 13 - "Base Remotion e Checklist"
Cohesion: 0.20
Nodes (10): npm run verificar-estilo (verificar-estilo.mjs), Componentes da base (Logo, Marca, Etiqueta, BalaoDeFala, Cartao, Lousa...), Constelação de neurônios (fundo Tinta, Coral 16%), Tipografia só Fredoka (600/400), Guia de Estilo de Animação animamente, MolduraImagem / cena imagem (exceção a imagens externas), Tokens de movimento (30 fps, entrada 12f, transição 15f), Paleta: Tinta, Coral, Amarelo, Lavanda, Névoa, Ardósia, Lilás (+2 more)

### Community 14 - "package.json"
Cohesion: 0.07
Nodes (31): dependencies, @fontsource/fredoka@^5.3.0, react@^19.1.0, react-dom@^19.1.0, remotion@4.0.543, @remotion/cli@4.0.543, @remotion/transitions@^4.0.543, description (+23 more)

### Community 15 - "Fluxo do Dublador"
Cohesion: 0.16
Nodes (12): Exemplo apresentacao-canal (9 falas, 48,8 s), Fluxo de um vídeo (roteiro → render → locução → Dublador → final), VIDEOS E ROTEIROS/<tema>/ (destino dos vídeos prontos), Como abrir, Como usar, Dublador Animamente, projetos/ (gravações persistidas por vídeo), Supressor de ruído e modificador de voz (+4 more)

### Community 16 - "Instruções do Projeto"
Cohesion: 0.14
Nodes (13): graphify skill (.claude/skills/graphify), AnimamenteINC — instruções para o Claude, Canal animamente (o mundo explicado em animação), Formato do roteiro de locução (Dublador), graphify, Graphify knowledge graph (graphify-out/), Organização e limpeza (obrigatório ao terminar um vídeo), Outras regras (+5 more)

### Community 17 - "Composições Registradas"
Cohesion: 0.15
Nodes (8): GALERIA, RoteiroPasseio, metadados(), Root(), videos, duracaoTotal(), Roteiro, PropsVideo

### Community 18 - "Config TypeScript"
Cohesion: 0.14
Nodes (13): compilerOptions, esModuleInterop, forceConsistentCasingInFileNames, jsx, lib, module, moduleResolution, noEmit (+5 more)

### Community 19 - "Leitura de Vídeo (ffmpeg)"
Cohesion: 0.20
Nodes (7): trabalho(), duracao_ffmpeg(), exportar_video(), ler_wav_amostras(), limitar(), mixar(), rodar_ffmpeg()

### Community 20 - "Finanças pra Casais"
Cohesion: 0.14
Nodes (13): 1. Caio · 0:02.6 → 0:06.8, 2. Neuro · 0:07.7 → 0:16.4, 3. Neuro · 0:17.3 → 0:26.9, 4. Teo · 0:27.8 → 0:36.9, 5. Teo · 0:37.8 → 0:47.8, 6. Neuro · 0:48.7 → 0:57.9, 7. Neuro · 0:58.8 → 1:09.6, 8. Lia · 1:12.2 → 1:14.3 (+5 more)

### Community 21 - "Prompts da Base"
Cohesion: 0.15
Nodes (11): 1. Prompt para as próximas animações, 2. Prompt para recriar a base do zero (referência), Fluxo de um vídeo (do roteiro ao vídeo com voz), Formato do roteiro de locução (Dublador), Prompt 2: recriar a base do zero, Prompts — Base de animação animamente (com Dublador), Regra de áudio (todo vídeo), Regras das falas (para caber no Dublador) (+3 more)

### Community 22 - "Parser de Roteiro"
Cohesion: 0.28
Nodes (4): limpar(), converter_md(), limpar_md(), parse_tempo()

### Community 23 - "Pipeline de Áudio"
Cohesion: 0.38
Nodes (6): scripts/gerar-vozes.py (Kokoro TTS opcional), src/tema/vozes.json (jeito de falar de cada personagem), Amostras neuro.wav e lia.wav, Vídeo gta6-vs-zelda (referência de vozes), Vozes dos personagens (padrão gta6-vs-zelda, Kokoro), Modificador de voz (tom e timbre por personagem)

### Community 24 - "README da Base"
Cohesion: 0.18
Nodes (10): animamente — Base de Animação 2D, Começando, Criando um vídeo novo (4 passos), Estrutura, Licenças, Mantendo o padrão, Referência rápida do roteiro, Renderizar (+2 more)

### Community 25 - "Falas (na ordem do vídeo)"
Cohesion: 0.06
Nodes (34): 10. Neuro · 0:53.4 → 0:58.8, 11. Neuro · 1:01.0 → 1:08.1, 12. Neuro · 1:08.7 → 1:13.7, 13. Rafa · 1:14.3 → 1:19.3, 14. Neuro · 1:19.9 → 1:25.7, 15. Rafa · 1:27.9 → 1:32.5, 16. Neuro · 1:33.1 → 1:38.9, 17. Neuro · 1:39.5 → 1:45.3 (+26 more)

### Community 26 - "Personagens do Canal"
Cohesion: 0.24
Nodes (9): Bento, o cachorro, Caio, a lontra, Personagens em colagem de papel (papel.tsx, boca South Park), Lia, a gata, Neuro, o cérebro, <Personagem> API única, Rafa, o elefante, Teo, o bicho-preguiça (+1 more)

### Community 27 - "Elenco.tsx"
Cohesion: 0.17
Nodes (17): Capa(), CAPAS, Miolo(), PropsCapa, Cartao(), ConteudoFolha(), ConteudoPrevia(), ELENCO (+9 more)

### Community 28 - "Verificador de Estilo"
Cohesion: 0.29
Nodes (4): andar(), arquivos, problemas, TIPOS

### Community 30 - "Regras do Roteiro Modelo"
Cohesion: 0.50
Nodes (4): Como escrever o roteiro (formato obrigatório), Erros comuns, Para a fala caber no tempo, Regras

### Community 33 - "Regra principal: criar vídeo com roteiro (prompt 1)"
Cohesion: 0.24
Nodes (10): Prompt 1: próximas animações, animamente Base de Animação 2D (Remotion), Galeria (vitrine do design system), scripts/importar-gravacoes.py (vídeo se ajusta à voz), Trilhas animada-1/2/3 (public/musica, gerar-musica.py), npm run locucao (gera <id>.md e <id>.dublador.txt), src/Root.tsx (registro das composições), Roteiro JSON (roteiros/<id>.json) (+2 more)

### Community 34 - "formatos.ts"
Cohesion: 0.29
Nodes (6): areaUtil(), Formato, formatos, NomeFormato, tamanhoTexto(), tamanhosBase

### Community 35 - "Prompt de contexto — Neuro respondendo comentários"
Cohesion: 0.33
Nodes (5): Como responder, Exemplo, Formato da entrega, Prompt de contexto — Neuro respondendo comentários, Quem é o Neuro

## Knowledge Gaps
- **19 isolated node(s):** `Galeria (vitrine do design system)`, `Constelação de neurônios (fundo Tinta, Coral 16%)`, `Tipografia só Fredoka (600/400)`, `Tokens de movimento (30 fps, entrada 12f, transição 15f)`, `Paleta: Tinta, Coral, Amarelo, Lavanda, Névoa, Ardósia, Lilás` (+14 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 330 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Mandibula()` connect `Elenco em Colagem` to `Guia de Estilo`?**
  _High betweenness centrality (0.193) - this node is a cross-community bridge._
- **What connects `Galeria (vitrine do design system)`, `Constelação de neurônios (fundo Tinta, Coral 16%)`, `Tipografia só Fredoka (600/400)` to the rest of the system?**
  _19 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Helpers de Animação` be split into smaller, more focused modules?**
  _Cohesion score 0.060947204968944096 - nodes in this community are weakly interconnected._
- **Why does `Rosto e boca (`colagem/rosto.tsx`)` connect `Guia de Estilo` to `Elenco em Colagem`?**
  _High betweenness centrality (0.192) - this node is a cross-community bridge._
- **Should `App Dublador (UI)` be split into smaller, more focused modules?**
  _Cohesion score 0.05603960396039604 - nodes in this community are weakly interconnected._
- **Should `Elenco em Colagem` be split into smaller, more focused modules?**
  _Cohesion score 0.07199529826623567 - nodes in this community are weakly interconnected._
- **Should `Personagem Neuro` be split into smaller, more focused modules?**
  _Cohesion score 0.07767722473604827 - nodes in this community are weakly interconnected._