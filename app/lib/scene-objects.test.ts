import {
  changeSceneObjectModel,
  createSceneObject,
  getPlaceholderImageUrl,
  isPlaceholderImageUrl,
  resetSceneObject,
} from "./scene-objects";
import { DEVICE_MODELS } from "../models/device-models";

describe("scene-objects", () => {
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
        customColorsEnabled: true,
      },
      "notebook",
    );

    expect(changed.modelId).toBe("notebook");
    expect(changed.imageUrl).toBe(getPlaceholderImageUrl("notebook"));
    expect(changed.deviceTheme).toBe(DEVICE_MODELS.notebook.defaultTheme);
    expect(changed.matteColors).toBe(true);
    expect(changed.customColorsEnabled).toBe(false);
    expect(changed.positionX).toBe(0);
    expect(changed.showNotebookKeyboard).toBe(true);
  });

  it("identifies known placeholders", () => {
    expect(isPlaceholderImageUrl("/placeholder-1290x2748.png")).toBe(true);
    expect(isPlaceholderImageUrl("data:image/png;base64,abc")).toBe(false);
  });
});
