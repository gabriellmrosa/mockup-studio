# Mockup Studio

Editor de mockups em Next.js + React Three Fiber para gerar imagens de app em dispositivos 3D.

## Estado Atual

O projeto esta funcional como um MVP de 1 objeto, com foco em export de imagem.

Ja implementado:

- upload de imagem para a tela do app;
- textura aplicada corretamente na tela do dispositivo;
- selecao de tema base do device;
- ajuste manual da cor do body;
- controles de rotacao X, Y e Z;
- reset de camera + objeto;
- export PNG transparente em `1920x1080` e `2560x1440`;
- modo debug de cores por parte;
- modo `So tela`, que remove a casca do dispositivo e deixa apenas a textura da tela;
- painel lateral componentizado;
- arquitetura inicial de catalogo de dispositivos.

## Decisoes de Produto Ja Tomadas

- foco atual: MVP consistente com 1 objeto e export de imagem;
- export: somente PNG com fundo transparente;
- transformacoes liberadas no MVP: apenas rotacao;
- sem reposicionamento horizontal/vertical por enquanto;
- cor customizavel apenas no body do objeto principal;
- multiobjeto e video ficam para depois;
- arquitetura deve ficar preparada para novos modelos.

## Estrutura Relevante

- [app/page.tsx](/Users/gabrielrosa/Desktop/dev/mock-photo/app/page.tsx): orquestra o estado do editor e conecta cena + painel.
- [app/components/MockupCanvas.tsx](/Users/gabrielrosa/Desktop/dev/mock-photo/app/components/MockupCanvas.tsx): canvas 3D, orbit controls, export e aplicacao de transform.
- [app/components/EditorSidebar.tsx](/Users/gabrielrosa/Desktop/dev/mock-photo/app/components/EditorSidebar.tsx): painel lateral do editor.
- [app/components/Smartphone.tsx](/Users/gabrielrosa/Desktop/dev/mock-photo/app/components/Smartphone.tsx): modelo atual do smartphone, tela com textura e modo sem casca.
- [app/models/device-models.ts](/Users/gabrielrosa/Desktop/dev/mock-photo/app/models/device-models.ts): catalogo de dispositivos e metadados do modelo ativo.
- [app/lib/mockup-image.ts](/Users/gabrielrosa/Desktop/dev/mock-photo/app/lib/mockup-image.ts): utilitarios da textura/imagem da tela.

## Branch de Trabalho

As alteracoes recentes foram feitas na branch:

- `work-with-codex`

## Onde Paramamos

O painel ja foi componentizado e a base para multiplos dispositivos foi preparada, mas ainda existe apenas 1 modelo real: `smartphone`.

A ultima feature implementada foi:

- toggle para esconder toda a casca do dispositivo e manter apenas a tela/textura visivel.

## Proximo Passo Sugerido

Adicionar um segundo modelo real ao catalogo, provavelmente um tablet ou notebook, reaproveitando a estrutura atual de `device-models`.

## Observacoes Tecnicas

- a textura da tela ja foi corrigida e nao deve mais deformar sozinha;
- a rotacao ficou mais responsiva apos otimizar o update do group 3D, mas ainda pode existir uma leve latencia residual;
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
