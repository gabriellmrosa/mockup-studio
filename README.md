# Mockup Studio

Editor de mockups em Next.js + React Three Fiber para compor imagens de app em dispositivos 3D.

## Estado Atual

O projeto esta funcional como um editor de composicao multiobjeto com catalogo de 4 modelos 3D reais.

Ja implementado:

- upload de imagem para a tela do app por objeto;
- textura aplicada corretamente na tela do dispositivo;
- suporte a multiplos objetos na mesma cena;
- objeto base inicial nao deletavel;
- botao para adicionar novos objetos na cena;
- remocao de objetos adicionados pelo usuario;
- selecao de objeto ativo por painel de camadas;
- selecao de objeto ativo tambem por double click direto no objeto 3D no canvas;
- inspector separado para editar apenas o objeto selecionado;
- selecao de tema base do device por objeto;
- customizacao manual de cores por objeto a partir de uma lista reduzida de partes nomeadas;
- toggle por objeto para acabamento `fosco` ou mais refletivo;
- controles de posicao X, Y e Z por objeto;
- controles de rotacao X, Y e Z por objeto;
- controle de escala uniforme por objeto;
- reset das transformacoes do objeto selecionado;
- reset global de camera;
- `fit scene` separado de `reset camera` na toolbar flutuante;
- color picker de cor de fundo do canvas na toolbar flutuante;
- estado da cor de fundo do canvas isolado no `MockupCanvas`, evitando rerender da shell inteira do editor durante drag do color picker;
- color picker interno do inspector agora reduz a frequencia de updates para no maximo um commit por frame e aplica mudancas de cor via `transition`, reduzindo lag durante drag nos modelos 3D;
- export PNG transparente em `1920x1080` e `2560x1440`;
- CTA `Take photo` exporta captura PNG `1920x1080` com nome timestamped, fundo transparente real e sem grid;
- loading inicial central para o primeiro carregamento real do canvas/modelo;
- loading incremental discreto no topo do canvas para troca/adicao de modelos, com atraso para evitar flicker em loads rapidos;
- infraestrutura interna de debug de cores por parte por objeto, mantida para desenvolvimento e onboarding de novos modelos, sem exposicao na UI principal;
- modo `So tela`, que remove a casca do dispositivo e deixa apenas a textura da tela;
- toggle global de `dark/light`;
- toggle global de idioma `pt-BR/en-US`;
- placeholders por modelo, independentes de idioma;
- recomendacao de upload por modelo no inspector;
- selector de modelo do inspector agora usa `CustomSelect` proprio com portal, icones e estilo consistente com a UI;
- catalogo com 4 modelos 3D: `smartphone`, `smartphone2`, `smartwatch` e `notebook`;
- arquitetura multimodelo com `modelScale`, `baseRotation`, `pivotOffset` e `modelSpawnOffset` por modelo;
- `smartwatch` com tela texturizada em plano separado, raio calibrado e casco preservando o material fisico do GLB;
- `notebook` com tela do app aplicada na malha correta do GLB, placeholder proprio, temas ativos e debug semantico inicial das partes mapeadas;
- `notebook` ganhou toggle dedicado de `Teclado`, permitindo esconder a base e manter apenas o conjunto visual da tela;
- no `notebook`, quando `Teclado` esta desligado, a lista de `Customizar` passa a mostrar apenas as partes que continuam visiveis;
- `smartphone2` agora usa o asset recortado do iPhone 14, com tela aplicada no mesh real do GLB, placeholder proprio `1290x2748`, temas ativos e debug semantico inicial;
- modo `Cor fosca` reduz reflexo dos materiais fisicos e, no `smartphone2` atual, oculta o vidro frontal para privilegiar a leitura da tela;
- `smartphone`, `smartphone2` e `notebook` passaram a usar materiais simples e consistentes por tema, enquanto o `smartwatch` manteve o casco baseado no material fisico original do GLB para evitar aparencia oca;
- no `smartphone`, os aneis da camera, speaker e botoes laterais foram refinados para eliminar artefatos visuais do GLB e respeitar melhor o toggle de acabamento;
- `smartphone`, `smartphone2`, `smartwatch` e `notebook` iniciam no tema `gray`;
- o tema visual `blood` manteve o id interno, mas a label exibida ao usuario agora e `Red`;
- design system com tokens primitivos de cor (`--black-000` a `--black-980`, `--gray-*`, `--ink-*`), border-radius (`--radius-xs` a `--radius-full`), font-weight (`--font-regular` a `--font-bold`), font-size (`--font-size-*`) e spacing (`--space-*`) para dark e light mode;
- tokens semanticos de contraste em dark/light foram rebalanceados para melhorar leitura de contornos e componentes sem deixar a UI agressiva;
- menu de preferencias com submenus cascata (Theme e Language) com checkmark no item ativo;
- menu de contexto por layer (3 pontos) com opcoes de Renomear e Deletar;
- `ContextMenu` renderizado via React Portal para evitar clipping por `overflow`;
- link `Credits` no rodape agora abre um modal proprio via portal, com atribuicoes/licencas dos assets 3D e fechamento por overlay/Esc;
- icones via `lucide-react`;
- controle de camera via `CameraControls` com pan programatico;
- configuracao basica de navegacao do canvas ajustada para wheel/trackpad scroll em dolly, pinch/2 dedos em dolly+truck e zoom ao cursor;
- botoes de seta no toolbar flutuante movem a camera (pan) proporcionalmente a distancia atual;
- setas do teclado tambem acionam o pan da camera;
- grid de profundidade infinito no canvas com cor adaptativa baseada em luminancia do fundo;
- input de hex no `ColorRow` com debounce, normalizacao e feedback visual de erro;
- no inspector, `Cor fosca` fica logo abaixo dos temas e `Customizar` expande uma lista menor de cores amigaveis por modelo;
- convencao de styling consolidada: tokens CSS para design system, Tailwind para layout e CSS de componente para estados/regras locais;
- `Suspense` por objeto para isolar o carregamento de textura sem disparar re-fit da camera;
- camera re-ajusta apenas quando objetos sao adicionados ou removidos (nao em mudancas de propriedade);
- a cor de fundo do canvas fica em estado local do `MockupCanvas` para nao re-renderizar paineis laterais a cada mudanca do color picker;
- base de testes automatizados com `Jest + Testing Library` para o `photo mode`, cobrindo helpers de `scene-objects`, fluxo de `layers + selection`, regras do `InspectorPanel` e contrato estrutural do export de foto.

## Catalogo de Modelos

| Modelo | Arquivo GLB | modelScale | baseRotation | modelSpawnOffset | Upload recomendado |
|---|---|---|---|---|
| smartphone | smartphone.glb | [1, 1, 1] | [0, 0, 0] | [0, 0, 0] | 1290x2755 |
| smartphone2 | apple_iphone_14_pro_orange.glb | [122.9, 122.9, 122.9] | [0, 90.5°, 0] | [0, 0, 0] | 1290x2748 |
| smartwatch | smartwatch.glb | [19.44, 19.44, 19.44] | [0, -π/2, 0] | [130, 40, 270] | 1290x1452 |
| notebook | notebook.glb | [2311, 2311, 2311] | [0, π, 0] | [120, 100, 0] | 2755x1684 |

## Decisoes de Produto Ja Tomadas

- foco atual: catalogo de modelos e composicao multiobjeto;
- export: somente PNG com fundo transparente;
- transformacoes por objeto: posicao X/Y/Z, rotacao X/Y/Z e escala uniforme;
- camera continua global da cena;
- o giro com mouse no canvas atua na camera via `CameraControls`, nao no estado de rotacao do objeto;
- cada objeto possui sua propria imagem e sua propria configuracao;
- o objeto inicial da cena nao pode ser deletado;
- novos objetos entram com leve deslocamento automatico para nao sobrepor totalmente o objeto base;
- ao trocar o modelo de um objeto, a imagem da tela e resetada para placeholder.
- a customizacao manual de cor nasce das cores atuais do objeto e limpa o `deviceTheme` ao primeiro ajuste.

## Estrutura Relevante

- [app/page.tsx](app/page.tsx): orquestra o estado do editor, lista de objetos da cena e selecao ativa.
- [app/styles/tokens.css](app/styles/tokens.css): tokens primitivos de cor, tipografia, spacing, border-radius e font-weight.
- [app/globals.css](app/globals.css): tokens semanticos e resets globais.
- [app/components/EditorPrimitives/](app/components/EditorPrimitives/): primitives compartilhados da UI do editor.
- [app/components/LayersPanel/](app/components/LayersPanel/): painel esquerdo com camadas/objetos e preferencias globais.
- [app/components/InspectorPanel/](app/components/InspectorPanel/): painel direito com configuracoes do objeto selecionado (transform e temas).
- [app/components/CustomSelect/](app/components/CustomSelect/): select custom reutilizavel com portal para menus consistentes.
- [app/components/MockupCanvas/](app/components/MockupCanvas/): canvas 3D, CameraControls, grid, export e renderizacao de multiplos objetos.
- [app/components/ContextMenu/](app/components/ContextMenu/): menu contextual via portal com trigger padronizado.
- [app/components/CreditsModal/](app/components/CreditsModal/): modal de atribuicoes/licencas dos assets 3D via portal.
- [app/components/Smartphone.tsx](app/components/Smartphone.tsx): modelo smartphone com tela texturizada.
- [app/components/Smartphone2.tsx](app/components/Smartphone2.tsx): modelo smartphone2 atual, baseado no iPhone 14 com tela aplicada no mesh real do GLB.
- [app/components/Smartwatch.tsx](app/components/Smartwatch.tsx): modelo smartwatch.
- [app/components/Notebook.tsx](app/components/Notebook.tsx): modelo notebook.
- [app/models/device-models.ts](app/models/device-models.ts): catalogo de dispositivos com metadados de escala, rotacao e offset.
- [app/lib/3d-tokens/](app/lib/3d-tokens/): tokens de cores e temas por modelo.
- [app/lib/scene-objects.ts](app/lib/scene-objects.ts): helpers para criar, resetar e trocar modelo de objetos da cena.
- [app/lib/scene-presets.ts](app/lib/scene-presets.ts): presets padrao de transformacao e posicoes automaticas da cena.
- [app/lib/mockup-image.ts](app/lib/mockup-image.ts): utilitarios da textura/imagem da tela.
- [app/lib/i18n.ts](app/lib/i18n.ts): copy da interface em `pt-BR` e `en-US`.

## Branch de Trabalho

- `work-with-codex`

## Onde Paramos

Catalogo consolidado em 4 dispositivos. Arquitetura multimodelo com `modelScale`, `baseRotation`, `pivotOffset` e `modelSpawnOffset` por modelo. `smartwatch` segue com tela texturizada funcional e material fisico preservado no casco. `notebook` aceita a imagem do app na malha correta da tela, com placeholder proprio, debug semantico inicial e um modo de tela isolada via toggle de `Teclado`; com `Teclado` desligado ficam visiveis apenas a moldura original da tela e a tela, e com `Casca` desligada entra uma tela arredondada separada. O `smartphone2` antigo foi substituido pelo asset recortado do iPhone 14, com placeholder `1290x2748`, temas ativos e tela aplicada no mesh real do GLB, sem o vidro frontal no fluxo visual atual. O `smartphone` recebeu refinamentos de materiais em aneis, speaker e botoes laterais para eliminar artefatos do asset. Placeholders sao definidos por modelo, sem troca por idioma. O inspector continua com toggle por objeto para acabamento fosco e agora usa um `CustomSelect` proprio para a troca de modelo. O rodape do painel esquerdo agora tambem abre um modal minimalista de `Credits`, via portal, com as atribuicoes e licencas dos assets 3D usados no projeto. O reset de camera agora usa `saveState/reset` do `camera-controls`, `fit scene` e `reset camera` ficaram separados, e o CTA `Take photo` exporta captura real do canvas em PNG com transparencia verdadeira, sem cor do stage nem grid.

A camada de UI tambem passou por uma refatoracao de manutencao: tipografia e spacing recorrentes foram movidos para tokens em `app/styles/tokens.css`, primitives compartilhados foram consolidados, utilitarios arbitrarios foram reduzidos nos paineis principais e o `ContextMenu` deixou de usar render prop para um trigger padronizado. O canvas agora tambem diferencia loading inicial e loading incremental de objetos. O inspector tambem ganhou uma primeira versao de `custom theme` por objeto, com lista reduzida de cores amigaveis por modelo.

## Proximo Passo Sugerido

- continuar o mapeamento semantico das malhas restantes do `notebook`, especialmente onde tampa, dobradica e vedacoes ainda compartilham geometria;
- fechar validacao do `photo mode 1.0` com QA manual orientado pelos fluxos principais ja cobertos por teste;
- revisar se vale expor mais presets visuais por modelo no inspector sem aumentar a complexidade da UI.

## Regras de Styling

- tokens CSS em `app/styles/tokens.css` sao a fonte de verdade para cor, `font-size`, `font-weight`, spacing, radius e escalas recorrentes;
- `app/globals.css` concentra variaveis semanticas dependentes de tema ou contexto;
- Tailwind deve ser usado principalmente para layout e composicao estrutural: `flex`, `grid`, posicionamento, overflow e responsividade;
- CSS de componente deve cuidar de estados visuais e regras locais do componente;
- evitar utilitarios arbitrarios como `text-[...]`, `rounded-[...]`, `border-[...]` e `w-[...]` quando ja houver token equivalente;
- inline style deve ficar restrito a valores realmente dinamicos, como posicao calculada, cor variavel, progresso de slider e custom properties derivadas de estado.

## Regras de Copy

### Tom de voz

- a interface deve soar como ferramenta criativa profissional, nao como painel tecnico de engenharia;
- preferir frases curtas, neutras e operacionais, no estilo de produtos como Figma, Adobe e Blender;
- evitar termos improvisados, coloquiais ou internos de implementacao quando houver equivalente mais claro para design/marketing;
- a UI deve privilegiar clareza funcional antes de personalidade de marca.

### Nomenclatura

- usar `Camadas` / `Layers` como modelo mental principal da composicao;
- usar `Propriedades` / `Properties` para o painel do item selecionado;
- usar `Aparencia` / `Appearance` para cores e acabamento do dispositivo;
- usar `Interface` / `Interface` apenas para preferencias globais da UI, como dark/light;
- usar `Dispositivo` / `Device` para o tipo de mockup 3D;
- usar `Escala` / `Scale` para tamanho do objeto na cena;
- usar `Exportar PNG` / `Export PNG` para a acao principal de saida;
- usar `Resetar transformacao` / `Reset transform` quando a acao afetar apenas posicao, rotacao e escala.

### Localizacao e consistencia

- evitar misturar portugues e ingles no mesmo contexto visual;
- textos de botoes, menus, tooltips e modais devem passar por `app/lib/i18n.ts`;
- labels iguais devem usar o mesmo termo em toda a interface;
- microcopy de loading deve descrever estado visual do editor, nao detalhes tecnicos de implementacao.

### Defaults de idioma e tema

- na primeira visita, o app deve respeitar `navigator.languages` / `navigator.language` e `prefers-color-scheme`;
- depois que o usuario alterar idioma ou tema, a preferencia salva em `localStorage` passa a prevalecer;
- o comportamento atual nao deve sobrescrever automaticamente a escolha salva quando o navegador ou sistema mudar depois.

## Adicionando Novos Modelos 3D

### Escala canonica

O modelo de referencia e `smartphone.glb`, com altura visual de aproximadamente `490` unidades Three.js.
Todo modelo novo deve entrar com altura equivalente na cena.

Regra principal:
- normalizar a escala no Blender antes de exportar o GLB;
- se o GLB ainda vier fora de escala, corrigir com `modelScale` em `app/models/device-models.ts`.

Referencias atuais:

| Modelo | modelScale | Observacao |
|---|---|---|
| smartphone | [1, 1, 1] | modelo de referencia, ja normalizado |
| smartphone2 | [122.9, 122.9, 122.9] | GLB exportado em escala Blender padrao |

### Pivot de rotacao

`pivotOffset` corrige o centro de rotacao do modelo. Sem isso, o objeto pode orbitar em volta da origem do GLB em vez de girar sobre si.

Como calcular:
- usar o negativo do centro do bounding box visivel em coordenadas GLTF, antes de aplicar `modelScale`;
- se o centro geometrico for `(cx, cy, cz)`, entao `pivotOffset = [-cx, -cy, -cz]`.

Ideal na exportacao:
- `Origin to Geometry`;
- objeto em `[0, 0, 0]`;
- `Apply All Transforms`.

### Orientacao

`DEFAULT_OBJECT_TRANSFORM` aplica `rotationY: 180` em todos os objetos.

Regra pratica:
- se o modelo aparecer de costas com o padrao, usar `baseRotation: [0, Math.PI, 0]`;
- se aparecer correto, usar `baseRotation: [0, 0, 0]`.

### Checklist ao adicionar modelo

- colocar o `.glb` em `public/models/`;
- criar o componente React em `app/components/`;
- criar os tokens de cor em `app/lib/3d-tokens/`;
- adicionar entrada em `app/models/device-models.ts` com `modelScale`, `baseRotation`, `pivotOffset` e metadados;
- atualizar a union `DeviceModelId`;
- usar a infraestrutura interna de `debugPartColors`/`debugMode` para identificar visualmente as partes e renomear `MESH_SEMANTIC` antes de expor o modelo na UI;
- definir temas de cor e `buildColorsFromPrimary` no token file do modelo.

### Debug interno para novos modelos

Existe uma camada de debug ja pronta no estado dos objetos (`debugMode` e `debugPartColors`) e no render dos modelos para coloracao semantica temporaria das malhas.

Utilidade pratica:

- isolar rapidamente quais meshes pertencem a corpo, moldura, tela, vedacoes, dobradicas e detalhes;
- validar se a separacao semantica proposta para `MESH_SEMANTIC` faz sentido antes de criar temas finais;
- acelerar a entrada de novos GLBs sem depender de tentativa e erro manual em materiais definitivos.

Esse debug foi mantido no codigo como ferramenta interna de desenvolvimento e nao deve ser tratado como parte da interface principal do editor.

## Aprendizados

- no `smartwatch`, `Object_11` nao e um `screen mesh` puro; ele faz parte do corpo frontal interno;
- aplicar a textura do app diretamente em `Object_11` vaza para o casco e gera aparencia incorreta;
- a solucao robusta para o `smartwatch` foi usar um plano separado para a tela e preservar o material original do GLB no casco;
- trocar `MeshPhysicalMaterial` original por `MeshLambertMaterial` no `smartwatch` fazia o corpo parecer oco; clonar o material original e trocar apenas a cor resolveu isso;
- no `smartphone`, certas marcas aparentes de aneis, speaker e botoes laterais vinham de sobreposicao/geometria auxiliar do GLB; simplificar os materiais visiveis e remover as malhas de botoes antigas do fluxo principal resolveu o artefato;
- no `notebook`, a malha de tela correta e `tfTbkkzhxqpKRgC`; o contorno preto da tela e `nAIWMiVEtSYdjdZ`, e a barra inferior da dobra e `WyuoVWKMOcOlXJM`;
- no `smartphone2` atual, a malha de tela correta e `Object_13`; o recorte superior preto e `Object_4`, o body principal e `Object_7`, e os pequenos cortes laterais seguem a cor do body via `Object_8`;
- `screenBezel` e `lowerHingeBar` do `notebook` devem permanecer sempre pretos; a borracha de tela/dobra tambem deve ser tratada como detalhe fixo escuro;
- o controle de `fosco` precisa atuar no material real de cada modelo, nao apenas existir na UI;
- no `smartphone2` atual, esconder o vidro frontal no modo fosco produz leitura melhor da textura do app;
- no `notebook`, a estrategia mais simples para `Teclado` desligado foi esconder tudo e manter apenas `screenBezel` + `screen`; para `Casca` desligada, uma tela arredondada separada evita o recorte superior do asset.

## Observacoes Tecnicas

- `SkeletonUtils.clone` + `<primitive object={clone}/>` para modelos carregados via GLTF;
- nos com `scale=[0,0,0]` no GLTF sao ocultados para nao distorcer o bounding box;
- `Suspense` por objeto (nao global) evita re-fit da camera ao carregar texturas;
- `sceneFitKey` baseado apenas nos IDs dos objetos garante re-fit so em add/remove;
- `modelSpawnOffset` e somado ao `AUTO_OBJECT_POSITIONS` por indice;
- placeholders agora sao unicos por modelo e nao mudam com o idioma;
- `notebook` usa placeholder `/placeholder-2755x1684.png`;
- `OBJECT_POSITION_MULTIPLIER = 140` (X/Y) e `OBJECT_POSITION_MULTIPLIER_Z = 420` (Z);
- grid em `y=-300` com `infiniteGrid`, `cellSize=50`, `sectionSize=200`;
- durante o `Take photo`, grid e fundo visivel do canvas sao removidos temporariamente para garantir PNG transparente;
- a logica de export de foto foi extraida para `app/components/MockupCanvas/export-photo.ts`, facilitando teste e manutencao;
- `npm run lint` deve passar;
- `npm test -- --runInBand` deve passar;
- `npx tsc --noEmit` deve passar;
- `Notebook` nao deve mais expor calibracao temporaria via `leva` na UI;
- `npx next build --webpack` para validacao de build.

## Como Rodar

```bash
npm install
npm run dev
```

Build de validacao:

```bash
npx next build --webpack
```

Checks de qualidade:

```bash
npm test -- --runInBand
npm run lint
npx tsc --noEmit
```
