# Graph Report - AnimamenteINC  (2026-11-15)

## Corpus Check
- 209 files · ~520,247 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1145 nodes · 3157 edges · 55 communities (44 shown, 11 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 141 edges (avg confidence: 0.83)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Elenco em Colagem
- Passeio, Capa e Root
- Roteiro e Mapa Mental
- Neuro e Partes do Personagem
- Comentários e Pirataria
- Dublador: Núcleo e FFmpeg
- Tokens e Texto Animado
- Estilo de Fala e Chat
- Dublador: Reprodução e Gravação
- Galeria e Componentes
- Dependências npm
- Cenas e Layout
- Catálogo de Componentes (Style Guide)
- Dublador: App e Vídeo
- Catálogo de Músicas
- Animação, Quiz e Versus
- Identidade YouTube e Logo
- Modos de Entrega e Locução
- Objetos e Tela Retrô
- Gerador de Música
- Roteiros de Locução Antigos
- Dublador: Exportação e Mic
- Instruções do Projeto
- Legendas YouTube/Instagram
- Princípios do Style Guide
- Destaques do Instagram
- Locução GTA6 (Neuro)
- Dublador: Ticks e UI
- Gerador de Vozes IA
- Config TypeScript
- Locução Finanças Casal
- Referência do Elenco
- Guia de Identidade Visual
- Dublador: Guia de Uso
- Roteiro GTA6 e Importação
- Locução GTA6 vs Zelda
- Vozes do Passeio e Importação
- Dublador: Takes e Voz
- README da Base
- Prompt Base de Animação
- Verificador de Estilo
- Capas de Vídeo
- Roteiros Modelo
- Story e Capa de Reels
- Dublador: Trechos
- Regras do Roteiro Dublador
- Faixa Corrida
- Vozes de Referência
- Gravação GTA6
- Modelo Mapa Mental
- LEIA-ME das Vozes
- Config graphify (.claude)
- README Raiz
- Skill graphify

## God Nodes (most connected - your core abstractions)
1. `useEstilo()` - 107 edges
2. `App` - 67 edges
3. `react` - 57 edges
4. `STYLE_GUIDE` - 57 edges
5. `estiloEntrada()` - 55 edges
6. `remotion` - 44 edges
7. `cores` - 42 edges
8. `TextoAnimado()` - 33 edges
9. `Falas (na ordem do vídeo)` - 31 edges
10. `entrar()` - 30 edges

## Surprising Connections (you probably didn't know these)
- `Rosto e boca (`colagem/rosto.tsx`)` --references--> `Mandibula()`  [INFERRED]
  animamente-base/STYLE_GUIDE.md → animamente-base/src/personagens/colagem/rosto.tsx
- `Modo voz de IA (padrao)` --semantically_similar_to--> `Modo dublagem`  [INFERRED] [semantically similar]
  animamente-base/prompt-base-animacao-animamente.md → CLAUDE.md
- `Capa GTA 6: tudo que voce precisa saber` --conceptually_related_to--> `Estilo de capa: fundo Tinta, constelacao, Fredoka, Coral/Amarelo`  [INFERRED]
  VIDEOS E ROTEIROS/GTA6/capa-gta6-tudo-que-sabemos.png → animamente-base/referencia/galeria.png
- `Capa GTA 6 ou Zelda: quem leva?` --conceptually_related_to--> `Estilo de capa: fundo Tinta, constelacao, Fredoka, Coral/Amarelo`  [INFERRED]
  VIDEOS E ROTEIROS/GTA6/capa-gta6-vs-zelda.png → animamente-base/referencia/galeria.png
- `Capa Por que jogar era tao barato? (pirataria)` --conceptually_related_to--> `Estilo de capa: fundo Tinta, constelacao, Fredoka, Coral/Amarelo`  [INFERRED]
  VIDEOS E ROTEIROS/PIRATARIA DE GAMES/pirataria-games-brasil-capa.png → animamente-base/referencia/galeria.png

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Elenco animamente (Neuro, Lia, Bento, Teo, Rafa, Caio)** — videos_e_roteiros_apresenta__o_do_canal_apresentacao_canal_roteiro_neuro, videos_e_roteiros_apresenta__o_do_canal_apresentacao_canal_roteiro_lia, videos_e_roteiros_explica__o_canal_roteiros_video3_voce_escolhe_dublador_bento, videos_e_roteiros_apresenta__o_do_canal_apresentacao_canal_roteiro_teo, animamente_base_style_guide_rafa, videos_e_roteiros_apresenta__o_do_canal_apresentacao_canal_roteiro_caio [EXTRACTED 1.00]
- **Fluxo de gravacao: npm run locucao -> roteiro Dublador -> gravacao** — videos_e_roteiros_gta6_gta6_nova_geracao_dublador_npm_run_locucao, videos_e_roteiros_gta6_gta6_nova_geracao_dublador_formato_dublador, videos_e_roteiros_gta6_gta6_tudo_que_sabemos_dublador_padrao, videos_e_roteiros_finan_as_pra_casais_roteiro_de_locucao_financas_casal_importar_gravacoes [INFERRED 0.85]
- **Serie de apresentacao do canal (3 videos + apresentacao)** — videos_e_roteiros_apresenta__o_do_canal_apresentacao_canal_roteiro, videos_e_roteiros_explica__o_canal_roteiros_video1_o_que_e_o_canal_dublador, videos_e_roteiros_explica__o_canal_roteiros_video2_temas_dublador, videos_e_roteiros_explica__o_canal_roteiros_video3_voce_escolhe_dublador [INFERRED 0.85]
- **Fluxo de dublagem com Dublador** — claude_modo_dublagem, claude_dublador, videos_e_roteiros_pirataria_de_games_pirataria_games_brasil_dublador_roteiro, videos_e_roteiros_pirataria_de_games_pirataria_games_brasil_roteiro [INFERRED 0.85]
- **Fluxo de video com voz de IA** — animamente_base_readme_roteiro_json, animamente_base_scripts_gerar_vozes, animamente_base_readme_root_tsx, animamente_base_prompt_base_animacao_animamente_modo_voz_ia, animamente_base_readme_remotion [EXTRACTED 1.00]
- **Fluxo de dublagem** — claude_modo_dublagem, animamente_base_readme_locucao, animamente_base_readme_dublador, animamente_base_prompt_base_animacao_animamente_formato_locucao [EXTRACTED 1.00]
- **Elenco em colagem** — animamente_base_style_guide_neuro, animamente_base_style_guide_lia, animamente_base_style_guide_bento, animamente_base_style_guide_teo, animamente_base_style_guide_rafa, animamente_base_style_guide_caio, animamente_base_style_guide_colagem [EXTRACTED 1.00]
- **Instagram templates sharing brand system** — animamente_identidade_visual_instagram_01_foto_perfil, animamente_identidade_visual_instagram_02_post_modelo_1080x1350, animamente_identidade_visual_instagram_03_carrossel_slide_1080x1350, animamente_identidade_visual_guia_identidade_visual [INFERRED 0.85]
- **5 capas de destaques do Instagram** — animamente_identidade_visual_instagram_06_destaque_1_ciencia, animamente_identidade_visual_instagram_06_destaque_2_historia, animamente_identidade_visual_instagram_06_destaque_3_curiosidades, animamente_identidade_visual_instagram_06_destaque_4_bastidores, animamente_identidade_visual_instagram_06_destaque_5_videos [EXTRACTED 1.00]
- **animamente Logo Variant Family** — animamente_identidade_visual_logo_01_simbolo_fundo_escuro, animamente_identidade_visual_logo_01_simbolo_fundo_escuro_svg, animamente_identidade_visual_logo_02_simbolo_transparente, animamente_identidade_visual_logo_02_simbolo_transparente_svg, animamente_identidade_visual_logo_03_nome_fundo_escuro, animamente_identidade_visual_logo_03_nome_fundo_escuro_svg, animamente_identidade_visual_logo_04_nome_transparente, animamente_identidade_visual_logo_04_nome_transparente_svg, animamente_identidade_visual_logo_05_completa_fundo_escuro, animamente_identidade_visual_logo_05_completa_fundo_escuro_svg [EXTRACTED 1.00]
- **animamente YouTube brand asset kit** — animamente_identidade_visual_youtube_01_foto_perfil, animamente_identidade_visual_youtube_02_banner_2560x1440, animamente_identidade_visual_youtube_03_thumbnail_modelo, animamente_identidade_visual_youtube_04_marca_dagua_150, animamente_identidade_visual_youtube_05_tela_final_1920x1080 [EXTRACTED 1.00]

## Communities (55 total, 11 thin omitted)

### Community 0 - "Elenco em Colagem"
Cohesion: 0.07
Nodes (75): BOCA, BUSTOS, VIEWBOX_BUSTO, BOCA, CABECA, Cachorro(), CAPA, QUEIXO (+67 more)

### Community 1 - "Passeio, Capa e Root"
Cohesion: 0.05
Nodes (61): desenharTraco(), entrar(), sair(), transicaoCena(), Capa(), CAPAS, Miolo(), PropsCapa (+53 more)

### Community 2 - "Roteiro e Mapa Mental"
Cohesion: 0.05
Nodes (67): blocos, destino, destinoDublador, dublador, elenco, EMOCAO, falas, frames (+59 more)

### Community 3 - "Neuro e Partes do Personagem"
Cohesion: 0.08
Nodes (43): bocaAberta(), flutuar(), respirar(), suave(), maos(), maosPorPose(), Neuro(), OMBROS (+35 more)

### Community 4 - "Comentários e Pirataria"
Cohesion: 0.05
Nodes (42): Respostas a comentários (Neuro), Como responder, Exemplo, Formato da entrega, Neuro (mascote), Prompt Neuro respondendo comentários, Prompt de contexto — Neuro respondendo comentários, Quem é o Neuro (+34 more)

### Community 5 - "Dublador: Núcleo e FFmpeg"
Cohesion: 0.07
Nodes (16): aplicar_voz(), trabalho(), converter_md(), duracao_ffmpeg(), ErroRoteiro, _ffmpeg_filtrar(), fmt(), _istft() (+8 more)

### Community 6 - "Tokens e Texto Animado"
Cohesion: 0.09
Nodes (31): ondular(), SegmentoNarrador, Cursor(), ESTILOS_TEXTO, Palavra, RECORTES, separarPalavras(), textoLimpo() (+23 more)

### Community 7 - "Estilo de Fala e Chat"
Cohesion: 0.15
Nodes (34): estiloEntrada(), GrupoPersonagens(), BalaoDeFala(), Avatar(), Chat(), FaixaNarrador(), LegendaDoNarrador(), EstiloFala (+26 more)

### Community 9 - "Galeria e Componentes"
Cohesion: 0.19
Nodes (23): contar(), zoomLento(), BarrasPreco(), Cartao(), estiloPainel(), ComparacaoMitoVerdade(), Lado(), Contador() (+15 more)

### Community 10 - "Dependências npm"
Cohesion: 0.07
Nodes (31): dependencies, @fontsource/fredoka@^5.3.0, react@^19.1.0, react-dom@^19.1.0, remotion@4.0.543, @remotion/cli@4.0.543, @remotion/transitions@^4.0.543, description (+23 more)

### Community 11 - "Cenas e Layout"
Cohesion: 0.22
Nodes (31): alturaHistoria(), CenaCapitulo(), CenaChat(), CenaComparacao(), CenaDiagrama(), CenaExplicacao(), CenaImagem(), CenaImpacto() (+23 more)

### Community 12 - "Catálogo de Componentes (Style Guide)"
Cohesion: 0.07
Nodes (31): STYLE_GUIDE, Boca South Park (Mandibula), Checklist antes de publicar, BalaoDeFala (componente), BarrasPreco (componente), CarimboAno (componente), Cartao (componente), Chat (componente) (+23 more)

### Community 13 - "Dublador: App e Vídeo"
Cohesion: 0.14
Nodes (4): App, ligar(), ler_texto_arquivo(), Video

### Community 14 - "Catálogo de Músicas"
Cohesion: 0.12
Nodes (27): Faixas CC0 duru-ai-cc0-bgm, Faixa animada-1, Faixa animada-2, Faixa animada-3, Faixa arcade-inverno, Faixa arcade-rondo, Faixa arcade-vibe, Faixa assobio (+19 more)

### Community 15 - "Animação, Quiz e Versus"
Cohesion: 0.15
Nodes (23): aleatorio(), carimbar(), crescer(), easeEntrada, easeSaida, easeSuave, estiloCarimbo(), linear() (+15 more)

### Community 16 - "Identidade YouTube e Logo"
Cohesion: 0.10
Nodes (26): Coral Brain AM Neuron Symbol, Logo 01 Symbol on Dark Background (PNG), Logo 01 Symbol on Dark Background (SVG), Logo 02 Symbol Transparent (PNG), Logo 02 Symbol Transparent (SVG), Logo 03 Wordmark on Dark Background (PNG), Logo 03 Wordmark on Dark Background (SVG), Logo 04 Wordmark Transparent (PNG) (+18 more)

### Community 17 - "Modos de Entrega e Locução"
Cohesion: 0.11
Nodes (23): animamente-base CLAUDE.md, Consultar grafo graphify primeiro, Prompt base animacao animamente, Formato do roteiro de locucao, Modo voz de IA (padrao), Prompt 1: proximas animacoes, Prompt 2: recriar a base, Regras das falas (~16 palavras, 2,4 palavras/s) (+15 more)

### Community 18 - "Objetos e Tela Retrô"
Cohesion: 0.13
Nodes (21): cursorAceso(), digitar(), girar(), duracaoDigitado(), JanelaTerminal(), TextoDigitado(), CaixaConsole(), DESENHOS (+13 more)

### Community 19 - "Gerador de Música"
Cohesion: 0.21
Nodes (12): acorde(), baixo(), bumbo(), chimbal(), dedilhado(), env(), gerar(), hz() (+4 more)

### Community 20 - "Roteiros de Locução Antigos"
Cohesion: 0.16
Nodes (19): Rafa, o elefante, Roteiro: Prazer, animamente! (apresentacao-canal), Caio (a lontra brincalhona), Lia (a gata estudante curiosa), Neuro (mascote e narrador), Slogan: o mundo explicado em animacao, Teo (o bicho-preguica professor), Roteiro Dublador: O que e a animamente? (canal-01) (+11 more)

### Community 21 - "Dublador: Exportação e Mic"
Cohesion: 0.12
Nodes (8): abrir_no_sistema(), exportar_video(), ler_wav_amostras(), limitar(), listar_microfones(), log_erro(), mixar(), salvar_cfg()

### Community 22 - "Instruções do Projeto"
Cohesion: 0.10
Nodes (16): AnimamenteINC instructions, AnimamenteINC — instruções para o Claude, Formato do roteiro de locução (Dublador), graphify, Modelos de vídeo, fala e texto, Modo padrão voz de IA, Organização e limpeza (obrigatório ao terminar um vídeo), Outras regras (+8 more)

### Community 23 - "Legendas YouTube/Instagram"
Cohesion: 0.12
Nodes (16): 10. Por que o céu é azul? 🌤️ Explicado em conversa de chat, 11. Vírus ou bactéria: qual é a diferença? 🦠, 12. Como funciona a fotossíntese? 🌱 Em um mapa mental animado, 13. Não consegue focar? Estude com a técnica Pomodoro 🍅, 14. Quiz do corpo humano: você acerta as 2? 🧠, 15. Os 3 maiores planetas do Sistema Solar 🪐, 1. Prazer, animamente! 🧠 O mundo explicado em animação, 2. O que é a animamente? 🧠 Assunto difícil virando animação (+8 more)

### Community 24 - "Princípios do Style Guide"
Cohesion: 0.12
Nodes (16): 1. Princípios, 2. Cores, 3. Tipografia: só Fredoka, 4. Forma e layout, 5. Movimento, 6.1 Áudio e vozes (regra do canal), 6. Personagens: colagem de papel, 7. Componentes (+8 more)

### Community 25 - "Destaques do Instagram"
Cohesion: 0.12
Nodes (16): Categoria Bastidores, Categoria Ciencia, Categoria Curiosidades, Categoria Historia, Categoria Videos, Destaques do Instagram, Capa destaque Ciência (átomo branco em círculo Coral), Capa destaque Ciência (átomo branco em círculo Coral) (SVG fonte) (+8 more)

### Community 26 - "Locução GTA6 (Neuro)"
Cohesion: 0.12
Nodes (16): 10. Neuro · 1:04.3 → 1:11.0, 11. Neuro · 1:12.3 → 1:18.1, 12. Neuro · 1:19.2 → 1:24.6, 13. Neuro · 1:25.7 → 1:32.4, 14. Neuro · 1:34.0 → 1:41.1, 15. Neuro · 1:42.2 → 1:45.9, 1. Neuro · 0:00.4 → 0:03.3, 2. Neuro · 0:04.2 → 0:09.6 (+8 more)

### Community 28 - "Gerador de Vozes IA"
Cohesion: 0.26
Nodes (6): duracao_wav(), fala_da_cena(), limpar(), main(), mudar_tom(), pronunciar()

### Community 29 - "Config TypeScript"
Cohesion: 0.14
Nodes (13): compilerOptions, esModuleInterop, forceConsistentCasingInFileNames, jsx, lib, module, moduleResolution, noEmit (+5 more)

### Community 30 - "Locução Finanças Casal"
Cohesion: 0.14
Nodes (13): 1. Caio · 0:02.6 → 0:06.8, 2. Neuro · 0:07.7 → 0:16.4, 3. Neuro · 0:17.3 → 0:26.9, 4. Teo · 0:27.8 → 0:36.9, 5. Teo · 0:37.8 → 0:47.8, 6. Neuro · 0:48.7 → 0:57.9, 7. Neuro · 0:58.8 → 1:09.6, 8. Lia · 1:12.2 → 1:14.3 (+5 more)

### Community 31 - "Referência do Elenco"
Cohesion: 0.19
Nodes (12): O elenco da animamente (colagem), Lia, Bento, Teo, Rafa, Caio, Galeria de referencia do design system, Bento, o cachorro, Caio, a lontra, Elenco em colagem de papel, Estilo adesivo com borda Nevoa, Lia, a gata (+4 more)

### Community 32 - "Guia de Identidade Visual"
Cohesion: 0.26
Nodes (13): Visao geral (overview of all brand pieces), Guia de identidade visual, Fundo constelacao de neuronios (Coral 12% opacidade sobre Tinta), Logo animamente (cerebro AM), Paleta: Tinta #1F1A3D, Coral #F0476B, Amarelo #FFC23D, Lavanda #C9C5DD, Nevoa #F7F6FB, guia-identidade-visual.svg (source), Tipografia Fredoka (SemiBold titulos, Regular apoio), Instagram foto de perfil (+5 more)

### Community 33 - "Dublador: Guia de Uso"
Cohesion: 0.15
Nodes (12): ABRIR_DUBLADOR.bat, Como abrir, Como usar, Dublador Animamente, Modificador de voz (tom e timbre por personagem), projetos/ (gravações persistidas por vídeo), Supressor de ruído e modificador de voz, Supressor de ruído (+4 more)

### Community 34 - "Roteiro GTA6 e Importação"
Cohesion: 0.24
Nodes (11): Fluxo importar-gravacoes.py (video se ajusta a voz), Roteiro Dublador: Como o GTA 6 vai mudar os games?, GTA 6 como regua da nova geracao (preco 80 dolares, rivais fugindo da data), Lancamento do GTA 6: 19 de novembro de 2026, Lucia e Jason (protagonistas do GTA 6), npm run locucao (gera roteiro de locucao), Roteiro Dublador: GTA 6 tudo que ja sabemos, Mapa do GTA 6 (dobro do GTA 5, Leonida, Vice City) (+3 more)

### Community 35 - "Locução GTA6 vs Zelda"
Cohesion: 0.15
Nodes (13): 1. Caio · 0:02.5 → 0:07.1, 2. Neuro · 0:08.0 → 0:13.4, 3. Bento · 0:14.5 → 0:20.7, 4. Caio · 0:22.0 → 0:28.2, 5. Bento · 0:29.5 → 0:35.3, 6. Caio · 0:36.5 → 0:42.7, 7. Neuro · 0:44.5 → 0:51.5, 8. Bento · 0:53.3 → 0:57.4 (+5 more)

### Community 37 - "Dublador: Takes e Voz"
Cohesion: 0.22
Nodes (3): processar_take(), reamostrar(), reduzir_ruido()

### Community 38 - "README da Base"
Cohesion: 0.20
Nodes (10): animamente — Base de Animação 2D, Começando, Criando um vídeo novo (4 passos), Estrutura, Licenças, Mantendo o padrão, Referência rápida do roteiro, Renderizar (+2 more)

### Community 39 - "Prompt Base de Animação"
Cohesion: 0.25
Nodes (8): 1. Prompt para as próximas animações, 2. Prompt para recriar a base do zero (referência), Fluxo de um vídeo (do roteiro ao vídeo com voz), Formato do roteiro de locução (Dublador), Prompts — Base de animação animamente (com Dublador), Regra de áudio (todo vídeo), Regras das falas (para caber no Dublador), Resumo do padrão visual

### Community 40 - "Verificador de Estilo"
Cohesion: 0.25
Nodes (5): verificar-estilo, andar(), arquivos, problemas, TIPOS

### Community 41 - "Capas de Vídeo"
Cohesion: 0.29
Nodes (8): Estilo de capa: fundo Tinta, constelacao, Fredoka, Coral/Amarelo, Capa video 1: Tudo explicado em animacao, Capa video 2: Temas gerais que geram duvida, Capa video 3: Voce escolhe o tema, Previa grid Instagram (3 capas), Capa GTA 6: tudo que voce precisa saber, Capa GTA 6 ou Zelda: quem leva?, Capa Por que jogar era tao barato? (pirataria)

### Community 42 - "Roteiros Modelo"
Cohesion: 0.33
Nodes (6): roteiro modelo-conversa.json, roteiro modelo-duelo.json, roteiro modelo-passo-a-passo.json, roteiro modelo-quiz.json, roteiro modelo-top3.json, Modelos de video (quiz, duelo, top3, passo, conversa)

### Community 43 - "Story e Capa de Reels"
Cohesion: 0.47
Nodes (6): Fundo Tinta com constelação de neurônios, Story 'Vídeo novo no canal!' (logo AM, placeholder thumbnail, botão Toque no link), Story 'Vídeo novo no canal!' (logo AM, placeholder thumbnail, botão Toque no link) (SVG fonte), Capa de Reels (logo AM, [Tema do vídeo] branco/amarelo, wordmark animamente), Capa de Reels (logo AM, [Tema do vídeo] branco/amarelo, wordmark animamente) (SVG fonte), Logo AM (cérebro Coral com neurônios)

### Community 45 - "Regras do Roteiro Dublador"
Cohesion: 0.50
Nodes (4): Como escrever o roteiro (formato obrigatório), Erros comuns, Para a fala caber no tempo, Regras

### Community 47 - "Vozes de Referência"
Cohesion: 0.67
Nodes (3): Amostras neuro.wav e lia.wav, Vídeo gta6-vs-zelda (referência de vozes), Vozes dos personagens (padrão gta6-vs-zelda, Kokoro)

### Community 48 - "Gravação GTA6"
Cohesion: 0.67
Nodes (3): Como gravar e colocar no vídeo, Elenco, Roteiro de locução: GTA 6: tudo que já sabemos

## Knowledge Gaps
- **68 isolated node(s):** `Dependências Python do Dublador (numpy, opencv-python, sounddevice, soundfile, pillow, imageio-ffmpeg)`, `projetos/ (gravações persistidas por vídeo)`, `Supressor de ruído`, `videos_finalizados/ (saída do Dublador)`, `ABRIR_DUBLADOR.bat` (+63 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 402 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **11 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `STYLE_GUIDE` connect `Catálogo de Componentes (Style Guide)` to `Passeio, Capa e Root`, `Roteiro e Mapa Mental`, `Tokens e Texto Animado`, `Estilo de Fala e Chat`, `Roteiros Modelo`, `Modos de Entrega e Locução`, `Objetos e Tela Retrô`, `Modelo Mapa Mental`, `Roteiros de Locução Antigos`, `Princípios do Style Guide`, `Referência do Elenco`?**
  _High betweenness centrality (0.284) - this node is a cross-community bridge._
- **What connects `Dependências Python do Dublador (numpy, opencv-python, sounddevice, soundfile, pillow, imageio-ffmpeg)`, `projetos/ (gravações persistidas por vídeo)`, `Supressor de ruído` to the rest of the system?**
  _68 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Elenco em Colagem` be split into smaller, more focused modules?**
  _Cohesion score 0.07286288009179576 - nodes in this community are weakly interconnected._
- **Why does `animamente-base README` connect `Modos de Entrega e Locução` to `Vozes do Passeio e Importação`, `README da Base`, `Verificador de Estilo`, `Catálogo de Componentes (Style Guide)`, `Gerador de Música`, `Gerador de Vozes IA`?**
  _High betweenness centrality (0.275) - this node is a cross-community bridge._
- **Should `Passeio, Capa e Root` be split into smaller, more focused modules?**
  _Cohesion score 0.052531645569620256 - nodes in this community are weakly interconnected._
- **Why does `Modo dublagem` connect `Modos de Entrega e Locução` to `Instruções do Projeto`?**
  _High betweenness centrality (0.109) - this node is a cross-community bridge._
- **Should `Roteiro e Mapa Mental` be split into smaller, more focused modules?**
  _Cohesion score 0.05427905427905428 - nodes in this community are weakly interconnected._