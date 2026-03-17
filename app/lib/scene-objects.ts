"use client";

import {
  DEVICE_MODELS,
  type DeviceModelId,
} from "../models/device-models";
import type { PhoneColors, ThemeName } from "../components/Smartphone";
import { DEFAULT_OBJECT_TRANSFORM } from "./scene-presets";

export type SceneObject = {
  colors: PhoneColors;
  debugMode: boolean;
  debugPartColors: Record<string, string>;
  deletable: boolean;
  deviceTheme: ThemeName | "";
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
  showDeviceShell: boolean;
};

const DEFAULT_IMAGE_URL = "/placeholder.png";

export function createSceneObject({
  deletable = true,
  modelId = "smartphone",
  name,
}: {
  deletable?: boolean;
  modelId?: DeviceModelId;
  name: string;
}): SceneObject {
  const model = DEVICE_MODELS[modelId];

  return {
    colors: { ...model.themes[model.defaultTheme] },
    debugMode: false,
    debugPartColors: { ...model.initialDebugColors },
    deletable,
    deviceTheme: model.defaultTheme,
    id: crypto.randomUUID(),
    imageUrl: DEFAULT_IMAGE_URL,
    modelId,
    name,
    ...DEFAULT_OBJECT_TRANSFORM,
    showDeviceShell: true,
  };
}

export function resetSceneObject(object: SceneObject): SceneObject {
  const model = DEVICE_MODELS[object.modelId];

  return {
    ...object,
    colors: { ...model.themes[model.defaultTheme] },
    debugMode: false,
    debugPartColors: { ...model.initialDebugColors },
    deviceTheme: model.defaultTheme,
    ...DEFAULT_OBJECT_TRANSFORM,
    showDeviceShell: true,
  };
}

export function changeSceneObjectModel(
  object: SceneObject,
  modelId: DeviceModelId,
): SceneObject {
  const model = DEVICE_MODELS[modelId];

  return {
    ...object,
    colors: { ...model.themes[model.defaultTheme] },
    debugMode: false,
    debugPartColors: { ...model.initialDebugColors },
    deviceTheme: model.defaultTheme,
    imageUrl: DEFAULT_IMAGE_URL,
    modelId,
    ...DEFAULT_OBJECT_TRANSFORM,
    showDeviceShell: true,
  };
}
