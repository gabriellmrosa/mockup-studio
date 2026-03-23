"use client";

import * as THREE from "three";
import type { ExportPreset } from "./MockupCanvas";

type ExportPhotoArgs = {
  camera: THREE.Camera;
  gl: {
    domElement: {
      toBlob: (callback: (blob: Blob | null) => void, type?: string) => void;
      toDataURL: (type?: string) => string;
    };
    getClearAlpha: () => number;
    getClearColor: (color: THREE.Color) => THREE.Color;
    getPixelRatio: () => number;
    render: (scene: THREE.Scene, camera: THREE.Camera) => void;
    setClearColor: (color: THREE.Color, alpha?: number) => void;
    setPixelRatio: (value: number) => void;
    setSize: (width: number, height: number, updateStyle?: boolean) => void;
  };
  gridRef: { current: { visible: boolean } | null };
  preset: ExportPreset;
  scene: THREE.Scene;
  size: {
    height: number;
    width: number;
  };
};

export async function exportCanvasPhoto({
  camera,
  gl,
  gridRef,
  preset,
  scene,
  size,
}: ExportPhotoArgs) {
  const previousWidth = size.width;
  const previousHeight = size.height;
  const previousPixelRatio = gl.getPixelRatio();
  const previousClearAlpha = gl.getClearAlpha();
  const previousClearColor = gl.getClearColor(new THREE.Color()).clone();
  const previousAspect =
    camera instanceof THREE.PerspectiveCamera ? camera.aspect : null;
  const previousSceneBackground = scene.background;
  const previousGridVisible = gridRef.current?.visible ?? true;

  gl.setPixelRatio(1);
  gl.setSize(preset.width, preset.height, false);
  gl.setClearColor(previousClearColor, 0);
  scene.background = null;

  if (gridRef.current) {
    gridRef.current.visible = false;
  }

  if (camera instanceof THREE.PerspectiveCamera) {
    camera.aspect = preset.width / preset.height;
    camera.updateProjectionMatrix();
  }

  gl.render(scene, camera);

  await new Promise<void>((resolve) => {
    requestAnimationFrame(() => resolve());
  });

  const blob =
    (await new Promise<Blob | null>((resolve) => {
      gl.domElement.toBlob(resolve, "image/png");
    })) ?? dataUrlToBlob(gl.domElement.toDataURL("image/png"));

  if (gridRef.current) {
    gridRef.current.visible = previousGridVisible;
  }
  scene.background = previousSceneBackground;
  gl.setClearColor(previousClearColor, previousClearAlpha);
  gl.setPixelRatio(previousPixelRatio);
  gl.setSize(previousWidth, previousHeight, false);

  if (camera instanceof THREE.PerspectiveCamera && previousAspect !== null) {
    camera.aspect = previousAspect;
    camera.updateProjectionMatrix();
  }

  gl.render(scene, camera);

  if (!blob) {
    throw new Error("Nao foi possivel gerar o PNG.");
  }

  downloadBlob(blob, `${preset.label}.png`);
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
