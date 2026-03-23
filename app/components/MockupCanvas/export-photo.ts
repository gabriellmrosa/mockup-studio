"use client";

import * as THREE from "three";
import type { ExportPreset } from "./MockupCanvas";

type ExportPhotoArgs = {
  camera: THREE.Camera;
  gl: Pick<
    THREE.WebGLRenderer,
    | "getClearAlpha"
    | "getClearColor"
    | "getRenderTarget"
    | "outputColorSpace"
    | "readRenderTargetPixels"
    | "render"
    | "setClearColor"
    | "setRenderTarget"
    | "capabilities"
  >;
  gridRef: { current: { visible: boolean } | null };
  preset: ExportPreset;
  scene: THREE.Scene;
};

export async function exportCanvasPhoto({
  camera,
  gl,
  gridRef,
  preset,
  scene,
}: ExportPhotoArgs) {
  const previousClearAlpha = gl.getClearAlpha();
  const previousClearColor = gl.getClearColor(new THREE.Color()).clone();
  const previousRenderTarget = gl.getRenderTarget();
  const previousAspect =
    camera instanceof THREE.PerspectiveCamera ? camera.aspect : null;
  const previousSceneBackground = scene.background;
  const previousGridVisible = gridRef.current?.visible ?? true;
  const exportTarget = new THREE.WebGLRenderTarget(preset.width, preset.height, {
    depthBuffer: true,
    stencilBuffer: false,
  });
  exportTarget.samples = gl.capabilities.isWebGL2 ? 4 : 0;
  exportTarget.texture.colorSpace = gl.outputColorSpace;
  let blob: Blob | null = null;

  try {
    gl.setClearColor(previousClearColor, 0);
    scene.background = null;

    if (gridRef.current) {
      gridRef.current.visible = false;
    }

    if (camera instanceof THREE.PerspectiveCamera) {
      camera.aspect = preset.width / preset.height;
      camera.updateProjectionMatrix();
    }

    gl.setRenderTarget(exportTarget);
    gl.render(scene, camera);

    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => resolve());
    });

    const pixels = new Uint8Array(preset.width * preset.height * 4);
    gl.readRenderTargetPixels(exportTarget, 0, 0, preset.width, preset.height, pixels);
    blob = await renderTargetPixelsToBlob(pixels, preset.width, preset.height);
  } finally {
    if (gridRef.current) {
      gridRef.current.visible = previousGridVisible;
    }
    scene.background = previousSceneBackground;
    gl.setClearColor(previousClearColor, previousClearAlpha);
    gl.setRenderTarget(previousRenderTarget);
    exportTarget.dispose();

    if (camera instanceof THREE.PerspectiveCamera && previousAspect !== null) {
      camera.aspect = previousAspect;
      camera.updateProjectionMatrix();
    }

    gl.render(scene, camera);
  }

  if (!blob) {
    throw new Error("Não foi possível gerar o PNG.");
  }

  downloadBlob(blob, `${preset.label}.png`);
}

export async function renderTargetPixelsToBlob(
  pixels: Uint8Array,
  width: number,
  height: number,
) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Não foi possível preparar a imagem exportada.");
  }

  const rowLength = width * 4;
  const flippedPixels = new Uint8ClampedArray(pixels.length);

  for (let row = 0; row < height; row += 1) {
    const sourceStart = (height - row - 1) * rowLength;
    const targetStart = row * rowLength;
    flippedPixels.set(pixels.subarray(sourceStart, sourceStart + rowLength), targetStart);
  }

  const imageData = context.createImageData(width, height);
  imageData.data.set(flippedPixels);
  context.putImageData(imageData, 0, 0);

  return (
    (await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, "image/png");
    })) ?? dataUrlToBlob(canvas.toDataURL("image/png"))
  );
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  link.click();

  URL.revokeObjectURL(url);
}

export function dataUrlToBlob(dataUrl: string) {
  const [header, base64] = dataUrl.split(",");
  const mimeMatch = header.match(/data:(.*?);base64/);
  const mimeType = mimeMatch?.[1] ?? "image/png";
  const binary = window.atob(base64);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return new Blob([bytes], { type: mimeType });
}

export function formatTimestampForFilename(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
}
