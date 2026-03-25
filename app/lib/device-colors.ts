import type { DeviceModelDefinition } from "../models/device-models";

export function buildNextDeviceColors({
  currentColors,
  hex,
  model,
  part,
}: {
  currentColors: Record<string, string>;
  hex: string;
  model: DeviceModelDefinition;
  part: string;
}) {
  if (currentColors[part] === hex) {
    return currentColors;
  }

  const primaryColorKey = model.primaryColorKey;
  const isPrimaryColorUpdate = Boolean(primaryColorKey && part === primaryColorKey);

  if (!isPrimaryColorUpdate) {
    return {
      ...currentColors,
      [part]: hex,
    };
  }

  const nextThemeColors = model.buildColorsFromPrimary(hex);

  return {
    ...nextThemeColors,
    ...Object.fromEntries(
      model.customizableColorKeys.map((key) => [
        key,
        key === part ? hex : (currentColors[key] ?? nextThemeColors[key]),
      ]),
    ),
  };
}
