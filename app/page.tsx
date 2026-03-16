"use client";

import { ChangeEvent, useEffect, useState } from "react";
import EditorSidebar from "./components/EditorSidebar";
import MockupCanvas, { type ExportPreset } from "./components/MockupCanvas";
import { type PhoneColors, type ThemeName } from "./components/Smartphone";
import { APP_COPY, type Locale, type UiTheme } from "./lib/i18n";
import { readFileAsDataUrl } from "./lib/mockup-image";
import {
  DEFAULT_DEVICE_MODEL,
  DEVICE_MODELS,
  type DeviceModelId,
} from "./models/device-models";

const EXPORT_PRESETS: ExportPreset[] = [
  { height: 1080, label: "mockup-1080p", width: 1920 },
  { height: 1440, label: "mockup-1440p", width: 2560 },
];

export default function Home() {
  const [selectedModelId, setSelectedModelId] =
    useState<DeviceModelId>(DEFAULT_DEVICE_MODEL.id);
  const model = DEVICE_MODELS[selectedModelId];
  const [locale, setLocale] = useState<Locale>("pt-BR");
  const [uiTheme, setUiTheme] = useState<UiTheme>("dark");
  const [uploadedImage, setUploadedImage] =
    useState<string>("/placeholder.png");
  const [uploadError, setUploadError] = useState<string>("");
  const [deviceTheme, setDeviceTheme] = useState<ThemeName>(model.defaultTheme);
  const [colors, setColors] = useState<PhoneColors>(
    model.themes[model.defaultTheme],
  );
  const [rotationX, setRotationX] = useState(0);
  const [rotationY, setRotationY] = useState(180);
  const [rotationZ, setRotationZ] = useState(0);
  const [showDeviceShell, setShowDeviceShell] = useState(true);
  const [debugMode, setDebugMode] = useState(false);
  const [debugPartColors, setDebugPartColors] =
    useState<Record<string, string>>(model.initialDebugColors);
  const [exportHandler, setExportHandler] =
    useState<((preset: ExportPreset) => Promise<void>) | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [resetVersion, setResetVersion] = useState(0);
  const copy = APP_COPY[locale];

  useEffect(() => {
    const storedLocale = window.localStorage.getItem("mock-photo-locale");
    const storedUiTheme = window.localStorage.getItem("mock-photo-ui-theme");

    if (storedLocale === "pt-BR" || storedLocale === "en-US") {
      setLocale(storedLocale);
    }

    if (storedUiTheme === "dark" || storedUiTheme === "light") {
      setUiTheme(storedUiTheme);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("mock-photo-locale", locale);
    document.documentElement.lang = locale;
  }, [locale]);

  useEffect(() => {
    window.localStorage.setItem("mock-photo-ui-theme", uiTheme);
    document.documentElement.dataset.theme = uiTheme;
  }, [uiTheme]);

  useEffect(() => {
    setDeviceTheme(model.defaultTheme);
    setColors(model.themes[model.defaultTheme]);
    setDebugPartColors(model.initialDebugColors);
  }, [model]);

  async function handleImageUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    try {
      const nextImage = await readFileAsDataUrl(file);
      setUploadedImage(nextImage);
      setUploadError("");
    } catch (error) {
      console.error(error);
      setUploadError(copy.uploadImageError);
    } finally {
      event.target.value = "";
    }
  }

  function applyTheme(themeId: ThemeName) {
    setDeviceTheme(themeId);
    setColors(model.themes[themeId]);
  }

  function updateColor(part: keyof PhoneColors, hex: string) {
    setDeviceTheme("" as ThemeName);
    setColors((prev) => ({ ...prev, [part]: hex }));
  }

  function updateDebugColor(part: string, hex: string) {
    setDebugPartColors((prev) => ({ ...prev, [part]: hex }));
  }

  function resetMockup() {
    setRotationX(0);
    setRotationY(180);
    setRotationZ(0);
    setResetVersion((current) => current + 1);
  }

  async function exportImage(preset: ExportPreset) {
    if (!exportHandler || isExporting) {
      return;
    }

    try {
      setIsExporting(true);
      await exportHandler(preset);
    } catch (error) {
      console.error(error);
      setUploadError(copy.exportImageError);
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <main className="app-shell min-h-screen relative flex">
      <MockupCanvas
        colors={colors}
        debugMode={debugMode}
        debugPartColors={debugPartColors}
        imageUrl={uploadedImage}
        model={model}
        onExportReady={(handler) => setExportHandler(() => handler)}
        resetVersion={resetVersion}
        showDeviceShell={showDeviceShell}
        uiTheme={uiTheme}
        transform={{
          position: [0, 0, 0],
          rotation: [
            (rotationX * Math.PI) / 180,
            (rotationY * Math.PI) / 180,
            (rotationZ * Math.PI) / 180,
          ],
        }}
      />

      <EditorSidebar
        copy={copy}
        colors={colors}
        debugMode={debugMode}
        debugPartColors={debugPartColors}
        deviceTheme={deviceTheme}
        exportPresets={EXPORT_PRESETS}
        isExporting={isExporting}
        locale={locale}
        model={model}
        onColorChange={updateColor}
        onDebugColorChange={updateDebugColor}
        onExport={exportImage}
        onImageUpload={handleImageUpload}
        onLocaleChange={setLocale}
        onModelChange={setSelectedModelId}
        onReset={resetMockup}
        onThemeChange={applyTheme}
        onToggleDeviceShell={() => setShowDeviceShell((current) => !current)}
        onToggleDebugMode={() => setDebugMode((current) => !current)}
        onUiThemeChange={setUiTheme}
        rotationX={rotationX}
        rotationY={rotationY}
        rotationZ={rotationZ}
        selectedModelId={selectedModelId}
        setRotationX={setRotationX}
        setRotationY={setRotationY}
        setRotationZ={setRotationZ}
        showDeviceShell={showDeviceShell}
        uiTheme={uiTheme}
        uploadError={uploadError}
      />
    </main>
  );
}
