import * as THREE from "three";
import {
  dataUrlToBlob,
  exportCanvasPhoto,
  formatTimestampForFilename,
} from "./export-photo";

describe("export-photo", () => {
  const originalCreateElement = document.createElement.bind(document);

  beforeEach(() => {
    jest
      .spyOn(window, "requestAnimationFrame")
      .mockImplementation((callback: FrameRequestCallback) => {
        callback(0);
        return 1;
      });

    global.URL.createObjectURL = jest.fn(() => "blob:mock-photo");
    global.URL.revokeObjectURL = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("exports a PNG, downloads it and restores render state", async () => {
    const blob = new Blob(["png"], { type: "image/png" });
    const clickSpy = jest
      .spyOn(HTMLAnchorElement.prototype, "click")
      .mockImplementation(() => {});
    const createdLinks: HTMLAnchorElement[] = [];

    jest
      .spyOn(document, "createElement")
      .mockImplementation((tagName: string) => {
        const element = originalCreateElement(tagName);

        if (tagName === "a") {
          createdLinks.push(element as HTMLAnchorElement);
        }

        return element;
      });

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#101010");

    const camera = new THREE.PerspectiveCamera(45, 1280 / 720, 0.1, 1000);
    const updateProjectionMatrixSpy = jest.spyOn(camera, "updateProjectionMatrix");
    const gridRef = { current: { visible: true } };
    const gl = {
      domElement: {
        toBlob: jest.fn((callback: (value: Blob | null) => void) => callback(blob)),
        toDataURL: jest.fn(),
      },
      getClearAlpha: jest.fn(() => 1),
      getClearColor: jest.fn((color: THREE.Color) => color.set("#123456")),
      getPixelRatio: jest.fn(() => 2),
      render: jest.fn(),
      setClearColor: jest.fn(),
      setPixelRatio: jest.fn(),
      setSize: jest.fn(),
    };

    await exportCanvasPhoto({
      camera,
      gl,
      gridRef,
      preset: {
        height: 1080,
        label: "mock-photo-2026-03-23_12-34-56",
        width: 1920,
      },
      scene,
      size: {
        height: 720,
        width: 1280,
      },
    });

    expect(gl.setPixelRatio).toHaveBeenNthCalledWith(1, 1);
    expect(gl.setPixelRatio).toHaveBeenLastCalledWith(2);
    expect(gl.setSize).toHaveBeenNthCalledWith(1, 1920, 1080, false);
    expect(gl.setSize).toHaveBeenLastCalledWith(1280, 720, false);
    expect(gl.setClearColor).toHaveBeenNthCalledWith(1, expect.any(THREE.Color), 0);
    expect(gl.setClearColor).toHaveBeenLastCalledWith(expect.any(THREE.Color), 1);
    expect(gl.render).toHaveBeenCalledTimes(2);
    expect(updateProjectionMatrixSpy).toHaveBeenCalledTimes(2);
    expect(gridRef.current?.visible).toBe(true);
    expect(scene.background).toEqual(expect.any(THREE.Color));
    expect(clickSpy).toHaveBeenCalledTimes(1);
    expect(createdLinks[0]?.download).toBe("mock-photo-2026-03-23_12-34-56.png");
    expect(global.URL.createObjectURL).toHaveBeenCalledWith(blob);
    expect(global.URL.revokeObjectURL).toHaveBeenCalledWith("blob:mock-photo");
  });

  it("falls back to data URL conversion when toBlob returns null", async () => {
    const clickSpy = jest
      .spyOn(HTMLAnchorElement.prototype, "click")
      .mockImplementation(() => {});

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera();
    const gridRef = { current: { visible: true } };
    const gl = {
      domElement: {
        toBlob: jest.fn((callback: (value: Blob | null) => void) => callback(null)),
        toDataURL: jest.fn(() => "data:image/png;base64,cG5n"),
      },
      getClearAlpha: jest.fn(() => 1),
      getClearColor: jest.fn((color: THREE.Color) => color.set("#123456")),
      getPixelRatio: jest.fn(() => 2),
      render: jest.fn(),
      setClearColor: jest.fn(),
      setPixelRatio: jest.fn(),
      setSize: jest.fn(),
    };

    await exportCanvasPhoto({
      camera,
      gl,
      gridRef,
      preset: {
        height: 1080,
        label: "mock-photo-2026-03-23_12-34-56",
        width: 1920,
      },
      scene,
      size: {
        height: 720,
        width: 1280,
      },
    });

    expect(gl.domElement.toDataURL).toHaveBeenCalledWith("image/png");
    expect(global.URL.createObjectURL).toHaveBeenCalledWith(
      expect.objectContaining({ type: "image/png" }),
    );
    expect(clickSpy).toHaveBeenCalledTimes(1);
  });

  it("formats the export timestamp for filenames", () => {
    expect(
      formatTimestampForFilename(new Date("2026-03-23T12:34:56")),
    ).toBe("2026-03-23_12-34-56");
  });

  it("converts a PNG data URL into a blob", () => {
    const blob = dataUrlToBlob("data:image/png;base64,cG5n");

    expect(blob).toBeInstanceOf(Blob);
    expect(blob.type).toBe("image/png");
  });
});
