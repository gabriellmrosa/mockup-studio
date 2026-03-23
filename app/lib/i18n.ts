"use client";

export type Locale = "pt-BR" | "en-US";
export type UiTheme = "dark" | "light";

export type AppCopy = {
  appTitle: string;
  appSubtitle: string;
  addObject: string;
  baseObject: string;
  hideObject: string;
  showObject: string;
  hiddenObjectLabel: string;
  fitSceneButton: string;
  languageLabel: string;
  themeLabel: string;
  preferencesLabel: string;
  darkMode: string;
  lightMode: string;
  portuguese: string;
  english: string;
  resetCameraButton: string;
  takePhotoButton: string;
  deleteObject: string;
  renameObject: string;
  layersSectionTitle: string;
  objectOptionsLabel: string;
  propertiesEyebrow: string;
  modelLabel: string;
  sceneSectionHint: string;
  keyboardToggleLabel: string;
  screenSectionTitle: string;
  uploadImage: string;
  screenSectionHintPrefix: string;
  themesSectionTitle: string;
  bodyColorLabel: string;
  matteColorLabel: string;
  debugSectionTitle: string;
  transformSectionTitle: string;
  resetObjectButton: string;
  positionX: string;
  positionY: string;
  positionZ: string;
  rotationX: string;
  rotationY: string;
  rotationZ: string;
  scale: string;
  moveUpButton: string;
  moveDownButton: string;
  moveLeftButton: string;
  moveRightButton: string;
  zoomInButton: string;
  zoomOutButton: string;
  backgroundColorButton: string;
  debugOn: string;
  debugOff: string;
  canvasInitialLoadingLabel: string;
  canvasObjectLoadingLabel: string;
  canvasExportLoadingLabel: string;
  uploadImageError: string;
  creditsLabel: string;
  creditsDescription: string;
  creditsEyebrow: string;
  creditsTitle: string;
  creditsCloseButton: string;
  creditsIntro: string;
  creditsAuthor: string;
  creditsSource: string;
  creditsLicense: string;
  creditsFooterThanks: string;
  creditsFooterRemoval: string;
  themeNames: Record<string, string>;
};

export const APP_COPY: Record<Locale, AppCopy> = {
  "pt-BR": {
    appTitle: "Mock Studio",
    appSubtitle: "Composicao visual de mockups",
    addObject: "Adicionar camada",
    baseObject: "Camada base",
    hideObject: "Ocultar",
    showObject: "Mostrar",
    hiddenObjectLabel: "Oculto",
    fitSceneButton: "Enquadrar conteudo",
    languageLabel: "Idioma",
    themeLabel: "Interface",
    preferencesLabel: "Preferencias",
    darkMode: "Escuro",
    lightMode: "Claro",
    portuguese: "PT-BR",
    english: "EN-US",
    resetCameraButton: "Resetar visao",
    takePhotoButton: "Exportar PNG",
    deleteObject: "Excluir",
    renameObject: "Renomear",
    layersSectionTitle: "Camadas",
    objectOptionsLabel: "Opcoes da camada",
    propertiesEyebrow: "Propriedades",
    modelLabel: "Dispositivo",
    sceneSectionHint: "Corpo do dispositivo",
    keyboardToggleLabel: "Teclado",
    screenSectionTitle: "Tela",
    uploadImage: "Substituir imagem",
    screenSectionHintPrefix: "Tamanho ideal:",
    themesSectionTitle: "Aparencia",
    bodyColorLabel: "Cores personalizadas",
    matteColorLabel: "Acabamento fosco",
    debugSectionTitle: "Debug",
    transformSectionTitle: "Transformacao",
    resetObjectButton: "Resetar transformacao",
    positionX: "Posição X",
    positionY: "Posição Y",
    positionZ: "Posição Z",
    rotationX: "Rotação X",
    rotationY: "Rotação Y",
    rotationZ: "Rotação Z",
    scale: "Escala",
    moveUpButton: "Mover para cima",
    moveDownButton: "Mover para baixo",
    moveLeftButton: "Mover para a esquerda",
    moveRightButton: "Mover para a direita",
    zoomInButton: "Aproximar",
    zoomOutButton: "Afastar",
    backgroundColorButton: "Cor de fundo",
    debugOn: "Debug interativo: ON",
    debugOff: "Debug interativo: OFF",
    canvasInitialLoadingLabel: "Preparando cena",
    canvasObjectLoadingLabel: "Atualizando visualizacao",
    canvasExportLoadingLabel: "Tirando a foto",
    uploadImageError: "Nao foi possivel carregar essa imagem.",
    creditsLabel: "CREDITOS",
    creditsDescription: "dos modelos 3D",
    creditsEyebrow: "Modelos 3D e licencas",
    creditsTitle: "Creditos e atribuicoes",
    creditsCloseButton: "Fechar creditos",
    creditsIntro:
      "Este e um projeto pessoal de estudo, sem finalidade comercial. Todos os modelos 3D sao creditados conforme exigido por suas respectivas licencas.",
    creditsAuthor: "Autor",
    creditsSource: "Fonte",
    creditsLicense: "Licenca",
    creditsFooterThanks:
      "Agradecimento especial aos artistas que compartilham seu trabalho com a comunidade.",
    creditsFooterRemoval:
      "Criadores: caso identifiquem qualquer uso inadequado dos assets, entre em contato para remocao imediata.",
    themeNames: {
      gray: "Cinza",
      black: "Preto",
      "light-gray": "Cinza Claro",
      blood: "Red",
    },
  },
  "en-US": {
    appTitle: "Mock Studio",
    appSubtitle: "Visual mockup composition",
    addObject: "Add layer",
    baseObject: "Base layer",
    hideObject: "Hide",
    showObject: "Show",
    hiddenObjectLabel: "Hidden",
    fitSceneButton: "Fit to view",
    languageLabel: "Language",
    themeLabel: "Interface",
    preferencesLabel: "Preferences",
    darkMode: "Dark",
    lightMode: "Light",
    portuguese: "PT-BR",
    english: "EN-US",
    resetCameraButton: "Reset view",
    takePhotoButton: "Export PNG",
    deleteObject: "Delete",
    renameObject: "Rename",
    layersSectionTitle: "Layers",
    objectOptionsLabel: "Layer options",
    propertiesEyebrow: "Properties",
    modelLabel: "Device",
    sceneSectionHint: "Device body",
    keyboardToggleLabel: "Keyboard",
    screenSectionTitle: "Screen",
    uploadImage: "Replace image",
    screenSectionHintPrefix: "Ideal size:",
    themesSectionTitle: "Appearance",
    bodyColorLabel: "Custom colors",
    matteColorLabel: "Matte finish",
    debugSectionTitle: "Debug",
    transformSectionTitle: "Transform",
    resetObjectButton: "Reset transform",
    positionX: "Position X",
    positionY: "Position Y",
    positionZ: "Position Z",
    rotationX: "Rotation X",
    rotationY: "Rotation Y",
    rotationZ: "Rotation Z",
    scale: "Scale",
    moveUpButton: "Move up",
    moveDownButton: "Move down",
    moveLeftButton: "Move left",
    moveRightButton: "Move right",
    zoomInButton: "Zoom in",
    zoomOutButton: "Zoom out",
    backgroundColorButton: "Background color",
    debugOn: "Interactive debug: ON",
    debugOff: "Interactive debug: OFF",
    canvasInitialLoadingLabel: "Preparing scene",
    canvasObjectLoadingLabel: "Refreshing preview",
    canvasExportLoadingLabel: "Taking photo",
    uploadImageError: "Could not load this image.",
    creditsLabel: "CREDITS",
    creditsDescription: "for 3D models",
    creditsEyebrow: "3D models and licensing",
    creditsTitle: "Credits and attributions",
    creditsCloseButton: "Close credits",
    creditsIntro:
      "This is a personal study project with no commercial intent. All 3D models are credited as required by their respective licenses.",
    creditsAuthor: "Author",
    creditsSource: "Source",
    creditsLicense: "License",
    creditsFooterThanks:
      "Special thanks to the artists who share their work with the community.",
    creditsFooterRemoval:
      "Creators: if you identify any improper use of your assets, please reach out for immediate removal.",
    themeNames: {
      gray: "Gray",
      black: "Black",
      "light-gray": "Light Gray",
      blood: "Red",
    },
  },
};
