// Tokens de cores para o modelo Notebook 3D.
//
// ATENÇÃO: este arquivo está em fase inicial.
// O notebook possui 44 malhas e 28 materiais com nomes gerados automaticamente.
// Use o debug mode no app para identificar visualmente cada parte,
// depois defina os temas aqui.

export interface NotebookColors {
  [key: string]: string;
}

export const NOTEBOOK_DEFAULT_THEME = "";

export const NOTEBOOK_THEMES: Record<string, NotebookColors> = {};

export function buildNotebookColorsFromPrimary(_hex: string): NotebookColors {
  return {};
}
