"use client";

import {
  DEVICE_MODELS,
  type DeviceModelId,
} from "../models/device-models";
import type { Locale } from "./i18n";
import { DEFAULT_OBJECT_TRANSFORM } from "./scene-presets";

export type SceneObject = {
  colors: Record<string, string>;
  debugMode: boolean;
  debugPartColors: Record<string, string>;
  deletable: boolean;
  deviceTheme: string;
  id: string;
  imageUrl: string;
  modelId: DeviceModelId;
  name: string;
  positionX: number;
  positionY: number;
  positionZ: number;
  rotationX: number;
  rotationY: number;
  rotationZ: number;
  scale: number;
  showDeviceShell: boolean;
};

const PLACEHOLDER_BY_LOCALE: Record<Locale, string> = {
  "pt-BR": "/placeholder-ptbr.png",
  "en-US": "/placeholder-enus.png",
};

export function getPlaceholderImageUrl(locale: Locale) {
  return PLACEHOLDER_BY_LOCALE[locale];
}

export function isPlaceholderImageUrl(imageUrl: string) {
  return Object.values(PLACEHOLDER_BY_LOCALE).includes(imageUrl);
}

export function createSceneObject({
  deletable = true,
  id,
  locale = "en-US",
  modelId = "smartphone",
  name,
}: {
  deletable?: boolean;
  id?: string;
  locale?: Locale;
  modelId?: DeviceModelId;
  name: string;
}): SceneObject {
  const model = DEVICE_MODELS[modelId];

  return {
    colors: { ...(model.themes[model.defaultTheme] ?? {}) },
    debugMode: false,
    debugPartColors: { ...model.initialDebugColors },
    deletable,
    deviceTheme: model.defaultTheme,
    id: id ?? crypto.randomUUID(),
    imageUrl: getPlaceholderImageUrl(locale),
    modelId,
    name,
    ...DEFAULT_OBJECT_TRANSFORM,
    showDeviceShell: true,
  };
}

export function resetSceneObject(object: SceneObject): SceneObject {
  return {
    ...object,
    ...DEFAULT_OBJECT_TRANSFORM,
  };
}

export function changeSceneObjectModel(
  object: SceneObject,
  locale: Locale,
  modelId: DeviceModelId,
): SceneObject {
  const model = DEVICE_MODELS[modelId];

  return {
    ...object,
    colors: { ...(model.themes[model.defaultTheme] ?? {}) },
    debugMode: false,
    debugPartColors: { ...model.initialDebugColors },
    deviceTheme: model.defaultTheme,
    imageUrl: getPlaceholderImageUrl(locale),
    modelId,
    ...DEFAULT_OBJECT_TRANSFORM,
    showDeviceShell: true,
  };
}
