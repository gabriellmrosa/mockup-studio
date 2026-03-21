// Tokens de cores para o modelo Smartphone2 3D.
//
// ATENÇÃO: este arquivo está em fase inicial.
// Use o debug mode no app para identificar visualmente cada parte,
// depois renomeie as chaves de Smartphone2Colors e defina os temas aqui.
//
// Partes visíveis identificadas via nome dos materiais do GLTF (Armature > Plane008):
//   color1Part    → Plane008_1 (material: Color 1)
//   blackPart     → Plane008_2 (material: Black)
//   color2Part    → Plane008_3 (material: Color 2)
//   black3Part    → Plane008_4 (material: Black 3)
//   black2Part    → Plane008_5 (material: Black 2)
//   cameraLensPart→ Plane008_6 (material: Camera Lens)
//   [screen]      → Plane008_7 (material: purple_screen) — gerenciado pelo componente, não é tema
//   whitePart     → Plane008_8 (material: white)
//
// Quando os nomes estiverem definidos, criar temas aqui igual ao smartphone.ts.

// Partes a serem preenchidas após debug visual.
// O index signature permite atribuição de/para Record<string, string>.
export interface Smartphone2Colors {
  [key: string]: string;
}

export const SMARTPHONE2_DEFAULT_THEME = "";

export const SMARTPHONE2_THEMES: Record<string, Smartphone2Colors> = {};

export function buildSmartphone2ColorsFromPrimary(_hex: string): Smartphone2Colors {
  return {};
}
