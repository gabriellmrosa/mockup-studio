// Tokens de cores para o modelo Notebook 3D.
//
// Estratégia visual:
// - superfícies principais seguem a cor primária
// - algumas peças recebem pequenas variações para evitar um bloco chapado
// - borrachas, bezel da tela e barra inferior da dobradiça permanecem escuras
// - tela continua sendo controlada separadamente pelo componente

export type NotebookThemeName = "gray" | "black" | "light-gray" | "blood";

export interface NotebookColors {
  [key: string]: string;
}

export const NOTEBOOK_DEFAULT_THEME: NotebookThemeName = "gray";

const NOTEBOOK_FIXED_DARK = {
  screenBezel: "#000000",
  screenRubberSeal: "#1a1a1d",
  lowerHingeBar: "#000000",
  hingeRubberSeal: "#141416",
  keyboardGlyphs: "#101113",
} as const;

const NOTEBOOK_THEME_SURFACES = [
  "AQdtiiJfiakvCKx",
  "DmUcWNXfiLPcftc",
  "ELAWKPIQpGuqYuU",
  "FmsrGmNZGtSredn",
  "jbtMEbemwaBHRTw",
  "jfSniDGKVWZvpyG",
  "lZDBMTdjXPebUMa",
  "ZroMGzfQtHrkgUh",
  "bckGBpxpLXNHmCa",
  "JXvTyELxHLGtnWp",
  "sIzFavpnYbDfLWk",
  "sonZrhRIQDlQHcy",
  "aBJxhjUzVIkBmJN",
  "mTDvrHXNRqkIrBd",
  "fVNvUQeYMdbMNOA",
  "IJeReHnhQHJFtgB",
  "lzNeOaWQWAReGok",
  "WZqbfOdYdlPMpRs",
  "EBRhBFNqcMTaWWv",
  "rFquJMQWzuecHQa",
  "eFpSjyrDhTgtyuf",
  "LBeBZdkKmrJVhJd",
  "MwJmMcLbTBwQpxl",
  "OCxZAMeEkQKexHA",
  "XodVrcYKiUPGCmX",
  "xiLiwJHfkqIwaTs",
  "LQtuXuSGFKsUXjP",
  "QSjoCOCzvxPnLpK",
  "screen",
  "screenBackCover",
  "speakerGrilles",
  "bodyBottom",
  "keyboardBaseOuter",
  "powerButtonInner",
  "keyboardDeck",
  "keyboardKeys",
  "touchpad",
  "touchpadBorder",
  "keyboardBacklight",
  "laptopOpenNotch",
] as const;

export const NOTEBOOK_THEMES: Record<NotebookThemeName, NotebookColors> = {
  gray: buildNotebookColorsFromPrimary("#8A8A8E"),
  black: buildNotebookColorsFromPrimary("#1C1C1E"),
  "light-gray": buildNotebookColorsFromPrimary("#d1d1d1"),
  blood: buildNotebookColorsFromPrimary("#6a2525"),
};

export function buildNotebookColorsFromPrimary(hex: string): NotebookColors {
  const darker = lerpHexToBlack(hex, 0.16);
  const darkest = lerpHexToBlack(hex, 0.28);
  const lighter = lerpHexToWhite(hex, 0.12);
  const lightest = lerpHexToWhite(hex, 0.2);

  const colors: NotebookColors = {
    ...NOTEBOOK_FIXED_DARK,
    keyboardBaseOuter: hex,
    keyboardDeck: lighter,
    bodyBottom: darkest,
    screenBackCover: hex,
    touchpad: lightest,
    touchpadBorder: darker,
    powerButtonInner: darker,
    speakerGrilles: darker,
    keyboardKeys: darker,
    keyboardBacklight: lightest,
    laptopOpenNotch: darkest,
  };

  NOTEBOOK_THEME_SURFACES.forEach((part) => {
    if (!(part in colors)) {
      colors[part] = hex;
    }
  });

  return colors;
}

function lerpHexToWhite(hex: string, t: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return toHex(
    Math.round(r + t * (255 - r)),
    Math.round(g + t * (255 - g)),
    Math.round(b + t * (255 - b)),
  );
}

function lerpHexToBlack(hex: string, t: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return toHex(
    Math.round(r * (1 - t)),
    Math.round(g * (1 - t)),
    Math.round(b * (1 - t)),
  );
}

function toHex(r: number, g: number, b: number): string {
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}
