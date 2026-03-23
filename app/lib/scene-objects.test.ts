import {
  changeSceneObjectModel,
  createSceneObject,
  getPlaceholderImageUrl,
  isPlaceholderImageUrl,
  resetSceneObject,
} from "./scene-objects";
import {
  DEVICE_MODELS,
  type DeviceModelId,
} from "../models/device-models";
import { DEFAULT_OBJECT_TRANSFORM } from "./scene-presets";

describe("scene-objects", () => {
  it.each([
    "smartphone",
    "smartphone2",
    "smartwatch",
    "notebook",
  ] as const)(
    "creates model-specific defaults for %s",
    (modelId: DeviceModelId) => {
      const object = createSceneObject({
        id: `${modelId}-object`,
        modelId,
        name: `${modelId} object`,
      });

      const model = DEVICE_MODELS[modelId];

      expect(object.modelId).toBe(modelId);
      expect(object.imageUrl).toBe(getPlaceholderImageUrl(modelId));
      expect(object.deviceTheme).toBe(model.defaultTheme);
      expect(object.colors).toEqual(model.themes[model.defaultTheme]);
      expect(object.debugPartColors).toEqual(model.initialDebugColors);
      expect(object.customColorsEnabled).toBe(false);
      expect(object.debugMode).toBe(false);
      expect(object.showDeviceShell).toBe(true);
      expect(object.showNotebookKeyboard).toBe(true);
      expect(object).toMatchObject(DEFAULT_OBJECT_TRANSFORM);
    },
  );

  it("creates a visible scene object with the expected defaults", () => {
    const object = createSceneObject({
      id: "test-object",
      modelId: "smartphone",
      name: "Object 1",
    });

    expect(object.id).toBe("test-object");
    expect(object.name).toBe("Object 1");
    expect(object.isVisible).toBe(true);
    expect(object.showDeviceShell).toBe(true);
    expect(object.showNotebookKeyboard).toBe(true);
    expect(object.matteColors).toBe(true);
    expect(object.imageUrl).toBe("/placeholder-1290x2755.png");
    expect(object.deviceTheme).toBe(DEVICE_MODELS.smartphone.defaultTheme);
  });

  it("resets transform only when resetting an object", () => {
    const original = createSceneObject({
      id: "scene-object",
      modelId: "smartwatch",
      name: "Watch",
    });

    const modified = {
      ...original,
      positionX: 2.4,
      positionY: -1.2,
      positionZ: 0.8,
      rotationX: 10,
      rotationY: 210,
      rotationZ: -8,
      scale: 1.7,
      isVisible: false,
    };

    const reset = resetSceneObject(modified);

    expect(reset.positionX).toBe(0);
    expect(reset.positionY).toBe(0);
    expect(reset.positionZ).toBe(0);
    expect(reset.rotationX).toBe(0);
    expect(reset.rotationY).toBe(180);
    expect(reset.rotationZ).toBe(0);
    expect(reset.scale).toBe(1);
    expect(reset.isVisible).toBe(false);
  });

  it("changes model and refreshes placeholder/theme defaults", () => {
    const object = createSceneObject({
      id: "scene-object",
      modelId: "smartphone",
      name: "Device",
    });

    const changed = changeSceneObjectModel(
      {
        ...object,
        imageUrl: "data:image/png;base64,abc",
        deviceTheme: "custom",
        matteColors: false,
        positionX: 1,
        positionY: 4,
        positionZ: -2,
        rotationX: 33,
        rotationY: 15,
        rotationZ: -11,
        scale: 2,
        customColorsEnabled: true,
        debugMode: true,
        showDeviceShell: false,
        showNotebookKeyboard: false,
      },
      "notebook",
    );

    expect(changed.id).toBe(object.id);
    expect(changed.name).toBe(object.name);
    expect(changed.deletable).toBe(object.deletable);
    expect(changed.isVisible).toBe(object.isVisible);
    expect(changed.modelId).toBe("notebook");
    expect(changed.imageUrl).toBe(getPlaceholderImageUrl("notebook"));
    expect(changed.deviceTheme).toBe(DEVICE_MODELS.notebook.defaultTheme);
    expect(changed.colors).toEqual(
      DEVICE_MODELS.notebook.themes[DEVICE_MODELS.notebook.defaultTheme],
    );
    expect(changed.debugPartColors).toEqual(
      DEVICE_MODELS.notebook.initialDebugColors,
    );
    expect(changed.matteColors).toBe(true);
    expect(changed.customColorsEnabled).toBe(false);
    expect(changed.debugMode).toBe(false);
    expect(changed).toMatchObject(DEFAULT_OBJECT_TRANSFORM);
    expect(changed.showDeviceShell).toBe(true);
    expect(changed.showNotebookKeyboard).toBe(true);
  });

  it("identifies known placeholders", () => {
    const knownModelIds: DeviceModelId[] = [
      "smartphone",
      "smartphone2",
      "smartwatch",
      "notebook",
    ];

    for (const modelId of knownModelIds) {
      expect(isPlaceholderImageUrl(getPlaceholderImageUrl(modelId))).toBe(true);
    }

    expect(isPlaceholderImageUrl("data:image/png;base64,abc")).toBe(false);
  });
});
