export type Iphone14ProOrangeThemeName =
  | "gray"
  | "black"
  | "light-gray"
  | "blood";

export interface Iphone14ProOrangeColors {
  [key: string]: string;
  body: string;
  sideCuts: string;
  topCutout: string;
  frame: string;
  rearInset: string;
  cameraMicroPart: string;
  frontGlass: string;
  cameraBlock: string;
  cameraBlockInner: string;
  cameraLensHighlight: string;
  cameraSideDetail: string;
}

export const IPHONE14PRO_ORANGE_DEFAULT_THEME: Iphone14ProOrangeThemeName =
  "gray";

export const IPHONE14PRO_ORANGE_THEMES: Record<
  Iphone14ProOrangeThemeName,
  Iphone14ProOrangeColors
> = {
  gray: buildIphone14ProOrangeColorsFromPrimary("#8A8A8E"),
  black: buildIphone14ProOrangeColorsFromPrimary("#1C1C1E"),
  "light-gray": buildIphone14ProOrangeColorsFromPrimary("#d1d1d1"),
  blood: buildIphone14ProOrangeColorsFromPrimary("#6a2525"),
};

export function buildIphone14ProOrangeColorsFromPrimary(
  hex: string,
): Iphone14ProOrangeColors {
  return {
    body: hex,
    sideCuts: hex,
    topCutout: "#000000",
    frame: lerpHexToBlack(hex, 0.18),
    rearInset: lerpHexToBlack(hex, 0.08),
    cameraMicroPart: lerpHexToBlack(hex, 0.22),
    frontGlass: lerpHexToBlack(hex, 0.62),
    cameraBlock: lerpHexToBlack(hex, 0.1),
    cameraBlockInner: lerpHexToBlack(hex, 0.16),
    cameraLensHighlight: lerpHexToWhite(hex, 0.28),
    cameraSideDetail: lerpHexToBlack(hex, 0.2),
  };
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
  return `#${r.toString(16).padStart(2, "0")}${g
    .toString(16)
    .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}
