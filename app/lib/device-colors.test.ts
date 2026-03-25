import { buildNextDeviceColors } from "./device-colors";
import { DEVICE_MODELS } from "../models/device-models";

describe("buildNextDeviceColors", () => {
  it("preserves previous custom changes across sequential notebook updates", () => {
    const model = DEVICE_MODELS.notebook;
    const afterBackCover = buildNextDeviceColors({
      currentColors: model.themes[model.defaultTheme],
      hex: "#aa0000",
      model,
      part: "screenBackCover",
    });

    const afterBezel = buildNextDeviceColors({
      currentColors: afterBackCover,
      hex: "#00aa00",
      model,
      part: "screenBezel",
    });

    expect(afterBezel.screenBackCover).toBe("#aa0000");
    expect(afterBezel.screenBezel).toBe("#00aa00");
  });

  it("preserves customized notebook parts when the primary color changes", () => {
    const model = DEVICE_MODELS.notebook;
    const customColors = {
      ...model.themes[model.defaultTheme],
      screenBezel: "#112233",
      touchpad: "#445566",
    };

    const nextColors = buildNextDeviceColors({
      currentColors: customColors,
      hex: "#778899",
      model,
      part: "keyboardBaseOuter",
    });

    expect(nextColors.keyboardBaseOuter).toBe("#778899");
    expect(nextColors.screenBezel).toBe("#112233");
    expect(nextColors.touchpad).toBe("#445566");
  });
});
