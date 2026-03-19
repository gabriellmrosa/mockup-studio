# Mockup Studio

Editor de mockups em Next.js + React Three Fiber para compor imagens de app em dispositivos 3D.

## Estado Atual

O projeto esta funcional como um MVP de composicao com multiobjeto basico em cena, ainda com apenas 1 modelo 3D real: `smartphone`.

Ja implementado:

- upload de imagem para a tela do app por objeto;
- textura aplicada corretamente na tela do dispositivo;
- suporte a multiplos objetos na mesma cena;
- objeto base inicial nao deletavel;
- botao para adicionar novos objetos na cena;
- remocao de objetos adicionados pelo usuario;
- selecao de objeto ativo por painel de camadas;
- inspector separado para editar apenas o objeto selecionado;
- selecao de tema base do device por objeto;
- ajuste manual da cor do body por objeto;
- controles de posicao X, Y e Z por objeto;
- controles de rotacao X, Y e Z por objeto;
- reset das transformacoes do objeto selecionado;
- reset global de camera;
- color picker de cor de fundo do canvas na toolbar flutuante;
- export PNG transparente em `1920x1080` e `2560x1440`;
- modo debug de cores por parte por objeto;
- modo `So tela`, que remove a casca do dispositivo e deixa apenas a textura da tela;
- toggle global de `dark/light`;
- toggle global de idioma `pt-BR/en-US`;
- arquitetura inicial de catalogo de dispositivos;
- design system com variaveis CSS semanticas para dark e light mode.

## Decisoes de Produto Ja Tomadas

- foco atual: validar bem o fluxo multiobjeto antes de expandir o catalogo;
- export: somente PNG com fundo transparente;
- transformacoes liberadas nesta etapa: posicao X/Y/Z e rotacao X/Y/Z por objeto;
- camera continua global da cena;
- o giro com mouse no canvas atua na camera via `OrbitControls`, nao no estado de rotacao do objeto;
- cada objeto possui sua propria imagem e sua propria configuracao;
- o objeto inicial da cena nao pode ser deletado;
- novos objetos entram com leve deslocamento automatico para nao sobrepor totalmente o objeto base;
- ao trocar o modelo de um objeto, a imagem da tela deve ser resetada para placeholder;
- por enquanto, seguimos com apenas 1 modelo real para validar a arquitetura multiobjeto;
- multiobjeto, novos modelos e video serao tratados em etapas separadas.

## Estrutura Relevante

- [app/page.tsx](/Users/gabrielrosa/Desktop/dev/mock-photo/app/page.tsx): orquestra o estado do editor, lista de objetos da cena e selecao ativa.
- [app/components/LayersPanel.tsx](/Users/gabrielrosa/Desktop/dev/mock-photo/app/components/LayersPanel.tsx): painel esquerdo com camadas/objetos e preferencias globais.
- [app/components/InspectorPanel.tsx](/Users/gabrielrosa/Desktop/dev/mock-photo/app/components/InspectorPanel.tsx): painel direito com configuracoes do objeto selecionado.
- [app/components/MockupCanvas.tsx](/Users/gabrielrosa/Desktop/dev/mock-photo/app/components/MockupCanvas.tsx): canvas 3D, orbit controls, reset de camera, export e renderizacao de multiplos objetos.
- [app/components/Smartphone.tsx](/Users/gabrielrosa/Desktop/dev/mock-photo/app/components/Smartphone.tsx): modelo atual do smartphone, tela com textura e modo sem casca.
- [app/models/device-models.ts](/Users/gabrielrosa/Desktop/dev/mock-photo/app/models/device-models.ts): catalogo de dispositivos e metadados do modelo ativo.
- [app/lib/scene-objects.ts](/Users/gabrielrosa/Desktop/dev/mock-photo/app/lib/scene-objects.ts): helpers para criar, resetar e trocar o modelo de objetos da cena.
- [app/lib/scene-presets.ts](/Users/gabrielrosa/Desktop/dev/mock-photo/app/lib/scene-presets.ts): presets padrao de transformacao e offsets automaticos da cena.
- [app/lib/mockup-image.ts](/Users/gabrielrosa/Desktop/dev/mock-photo/app/lib/mockup-image.ts): utilitarios da textura/imagem da tela.
- [app/lib/i18n.ts](/Users/gabrielrosa/Desktop/dev/mock-photo/app/lib/i18n.ts): copy da interface em `pt-BR` e `en-US`.

## Branch de Trabalho

As alteracoes recentes foram feitas na branch:

- `work-with-codex`

## Onde Paramos

Design system revisado e estabilizado: contraste corrigido no dark mode (transform controls, capture button, brand title), codigo legado removido (EditorSidebar, icones e chaves i18n orfas), icone de reset padronizado entre camera e transform, e color picker de background do canvas adicionado na toolbar flutuante.

## Proximo Passo Sugerido

Validar com calma o fluxo multiobjeto atual e, depois disso, escolher entre:

- adicionar o segundo modelo real ao catalogo, aproveitando a nova estrutura por objeto;
- refinar os controles de composicao por objeto, incluindo limites, presets ou interacoes mais rapidas;
- refinar UX de camadas, incluindo reorder, lock ou visibilidade.

## Observacoes Tecnicas

- a textura da tela ja foi corrigida e nao deve mais deformar sozinha;
- o reset da secao `Transform` atua apenas no objeto selecionado;
- o botao flutuante central do canvas reenquadra a cena visivel via `Bounds`, de forma separada do reset de transformacao do objeto;
- presets padrao de transformacao e offsets automaticos da cena foram centralizados em uma fonte unica para evitar valores soltos;
- o offset automatico entre objetos continua ajudando a evitar sobreposicao total ao adicionar novos itens, mesmo com os controles manuais de posicao ja expostos no inspector;
- existe apenas 1 modelo real no catalogo neste momento: `smartphone`;
- `npm run lint` passa;
- `npx next build --webpack` passa;
- o `next build` com Turbopack pode falhar no sandbox, entao usar `--webpack` para validacao local quando necessario.

## Como Rodar

```bash
npm install
npm run dev
```

Build de validacao:

```bash
npx next build --webpack
```
