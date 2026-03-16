"use client";

import type { ThemeName } from "../components/Smartphone";

export type Locale = "pt-BR" | "en-US";
export type UiTheme = "dark" | "light";

type AppCopy = {
  appTitle: string;
  appSubtitle: string;
  languageLabel: string;
  themeLabel: string;
  darkMode: string;
  lightMode: string;
  portuguese: string;
  english: string;
  deviceSectionTitle: string;
  activeDevice: string;
  deviceSectionHint: string;
  sceneSectionTitle: string;
  shellOn: string;
  screenOnly: string;
  sceneSectionHint: string;
  screenSectionTitle: string;
  uploadImage: string;
  screenSectionHintLine1: string;
  screenSectionHintLine2: string;
  themesSectionTitle: string;
  bodyColorSectionTitle: string;
  bodyColorLabel: string;
  debugSectionTitle: string;
  transformSectionTitle: string;
  resetButton: string;
  rotationX: string;
  rotationY: string;
  rotationZ: string;
  transformSectionHint: string;
  exportSectionTitle: string;
  exportSectionHint: string;
  debugOn: string;
  debugOff: string;
  uploadImageError: string;
  exportImageError: string;
  themeNames: Record<ThemeName, string>;
};

export const APP_COPY: Record<Locale, AppCopy> = {
  "pt-BR": {
    appTitle: "Mockup Studio",
    appSubtitle: "MVP de 1 objeto com export transparente",
    languageLabel: "Idioma",
    themeLabel: "Interface",
    darkMode: "Dark",
    lightMode: "Light",
    portuguese: "PT-BR",
    english: "EN-US",
    deviceSectionTitle: "Dispositivo",
    activeDevice: "Ativo",
    deviceSectionHint:
      "A base agora suporta catalogo de dispositivos, mesmo com apenas um modelo ativo por enquanto.",
    sceneSectionTitle: "Cena",
    shellOn: "Casca ligada",
    screenOnly: "So tela",
    sceneSectionHint:
      "Desligue a casca para trabalhar apenas com a textura da tela, sem moldura de dispositivo ao redor.",
    screenSectionTitle: "Tela do App",
    uploadImage: "Upload imagem",
    screenSectionHintLine1: "Proporcao recomendada: 9:19.3.",
    screenSectionHintLine2: "Export final sempre em PNG com fundo transparente.",
    themesSectionTitle: "Temas",
    bodyColorSectionTitle: "Cor do Body",
    bodyColorLabel: "Body",
    debugSectionTitle: "Debug",
    transformSectionTitle: "Transform",
    resetButton: "Reset camera + objeto",
    rotationX: "Rotacao X",
    rotationY: "Rotacao Y",
    rotationZ: "Rotacao Z",
    transformSectionHint:
      "O objeto continua centralizado; por enquanto so liberamos rotacao.",
    exportSectionTitle: "Export PNG",
    exportSectionHint:
      "O arquivo sai sem fundo e com supersampling pelo resize do render.",
    debugOn: "Debug interativo: ON",
    debugOff: "Debug interativo: OFF",
    uploadImageError: "Nao foi possivel preparar essa imagem.",
    exportImageError: "Nao foi possivel exportar o PNG.",
    themeNames: {
      gray: "Cinza",
      black: "Preto",
      white: "Branco",
    },
  },
  "en-US": {
    appTitle: "Mockup Studio",
    appSubtitle: "Single-object MVP with transparent export",
    languageLabel: "Language",
    themeLabel: "Interface",
    darkMode: "Dark",
    lightMode: "Light",
    portuguese: "PT-BR",
    english: "EN-US",
    deviceSectionTitle: "Device",
    activeDevice: "Active",
    deviceSectionHint:
      "The foundation now supports a device catalog, even with only one active model for now.",
    sceneSectionTitle: "Scene",
    shellOn: "Shell on",
    screenOnly: "Screen only",
    sceneSectionHint:
      "Turn the shell off to work only with the screen texture, without the device frame around it.",
    screenSectionTitle: "App Screen",
    uploadImage: "Upload image",
    screenSectionHintLine1: "Recommended ratio: 9:19.3.",
    screenSectionHintLine2: "Final export is always a PNG with transparent background.",
    themesSectionTitle: "Themes",
    bodyColorSectionTitle: "Body Color",
    bodyColorLabel: "Body",
    debugSectionTitle: "Debug",
    transformSectionTitle: "Transform",
    resetButton: "Reset camera + object",
    rotationX: "Rotation X",
    rotationY: "Rotation Y",
    rotationZ: "Rotation Z",
    transformSectionHint:
      "The object stays centered; for now we only expose rotation.",
    exportSectionTitle: "Export PNG",
    exportSectionHint:
      "The file is exported without background and uses supersampling via render resize.",
    debugOn: "Interactive debug: ON",
    debugOff: "Interactive debug: OFF",
    uploadImageError: "Could not prepare this image.",
    exportImageError: "Could not export the PNG.",
    themeNames: {
      gray: "Gray",
      black: "Black",
      white: "White",
    },
  },
};
