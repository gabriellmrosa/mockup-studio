# CLAUDE.md — Guia para desenvolvimento do mock-photo

## Adicionando novos modelos 3D

### Escala canônica

O modelo de referência é `smartphone.glb`, com **~490 unidades Three.js de altura**.
Todo modelo novo deve ter a mesma altura visual na cena ao entrar.

**Regra principal:** normalize a escala no Blender antes de exportar o GLB, de forma que o dispositivo tenha altura comparável ao smartphone de referência. Se o GLB vier fora de escala, use o campo `modelScale` em `device-models.ts` para corrigir.

| Modelo      | modelScale  | Observação                              |
|-------------|-------------|------------------------------------------|
| smartphone  | [1, 1, 1]   | modelo de referência, já normalizado     |
| smartphone2 | [102.6, …]  | GLB exportado em escala Blender padrão   |

### Pivot de rotação (pivotOffset)

O `pivotOffset` corrige o centro de rotação do modelo. Sem ele, o pivot fica na origem do GLB (que raramente coincide com o centro geométrico visível), fazendo o objeto "orbitar" em vez de girar em torno de si mesmo.

**Como calcular:** é o negativo do centro do bounding box visível em coordenadas GLTF (antes do `modelScale`).
Se o centro geométrico do modelo em espaço GLTF for `(cx, cy, cz)`, então `pivotOffset = [-cx, -cy, -cz]`.

**Ideal:** exportar o GLB do Blender com `Origin to Geometry` + objeto em `[0,0,0]` + `Apply All Transforms`. Aí `pivotOffset = [0, 0, 0]`.

### Orientação (baseRotation)

O `DEFAULT_OBJECT_TRANSFORM` aplica `rotationY: 180` em todos os objetos. Com isso:

- Se o modelo aparecer **de costas** com o padrão: use `baseRotation: [0, Math.PI, 0]`
- Se aparecer **correto**: use `baseRotation: [0, 0, 0]`

### Checklist ao adicionar um novo modelo

- [ ] Arquivo `.glb` em `public/models/`
- [ ] Componente React em `app/components/NomeModelo.tsx` (seguir padrão do `Smartphone2.tsx`)
- [ ] Tokens de cores em `app/lib/3d-tokens/nome-modelo.ts`
- [ ] Entrada em `app/models/device-models.ts` com `modelScale` e `baseRotation` corretos
- [ ] `DeviceModelId` union type atualizado
- [ ] Ligar debug mode, identificar as partes visualmente, renomear `MESH_SEMANTIC`
- [ ] Definir temas de cores em `3d-tokens/nome-modelo.ts`
