// Tokens de cores para o modelo Smartwatch 3D.
//
// ATENÇÃO: este arquivo está em fase inicial.
// Use o debug mode no app para identificar visualmente cada parte.
//
// Malhas visíveis do GLTF: Object_2 a Object_11 (todas compartilham o mesmo material).
// Quando os nomes semânticos estiverem definidos, crie temas aqui.

export interface SmartwatchColors {
  [key: string]: string;
}

export const SMARTWATCH_DEFAULT_THEME = "";

export const SMARTWATCH_THEMES: Record<string, SmartwatchColors> = {};

export function buildSmartwatchColorsFromPrimary(_hex: string): SmartwatchColors {
  return {};
}
