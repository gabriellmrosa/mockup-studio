"use client";

import * as THREE from "three";
import React, { JSX, useEffect, useMemo } from "react";
import { useGLTF, useTexture } from "@react-three/drei";
import { useGraph } from "@react-three/fiber";
import { GLTF, SkeletonUtils } from "three-stdlib";
import {
  buildScreenCanvas,
  MAX_TEXTURE_SIZE,
} from "../lib/mockup-image";
import { createSimpleFinishMaterial } from "../lib/simple-finish-material";
import {
  SMARTPHONE2_DEFAULT_THEME,
  SMARTPHONE2_THEMES,
  type Smartphone2Colors,
} from "../lib/3d-tokens/smartphone2";

export const MESH_SEMANTIC = {
  topCutout: "Object_4",
  frame: "Object_5",
  rearInset: "Object_6",
  body: "Object_7",
  sideCuts: "Object_8",
  cameraMicroPart: "Object_9",
  cameraBlock: "Object_11",
  cameraBlockInner: "Object_12",
  screen: "Object_13",
  cameraLensHighlight: "Object_14",
  cameraSideDetail: "Object_15",
} as const;

const SCREEN_MESH = MESH_SEMANTIC.screen;
const FRONT_GLASS_MESH = "Object_10";
const SCREEN_CROP_W = 421;
const SCREEN_CROP_H = 896;

export type Smartphone2DebugPartKey = keyof typeof MESH_SEMANTIC;
export type { Smartphone2Colors };

type GLTFResult = GLTF & {
  nodes: Record<string, THREE.Mesh>;
  materials: Record<string, THREE.Material>;
};

type Smartphone2Props = JSX.IntrinsicElements["group"] & {
  imageUrl?: string;
  colors?: Record<string, string>;
  matteColors?: boolean;
  debugPartColors?: Partial<Record<string, string>>;
  showDeviceShell?: boolean;
  showNotebookKeyboard?: boolean;
  screenPosition?: [number, number, number];
  screenSize?: [number, number];
  screenRotation?: [number, number, number];
};

function rotateCanvas180(source: HTMLCanvasElement) {
  const canvas = document.createElement("canvas");
  canvas.width = source.width;
  canvas.height = source.height;

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Nao foi possivel rotacionar a textura da tela.");
  }

  context.translate(canvas.width, canvas.height);
  context.rotate(Math.PI);
  context.drawImage(source, 0, 0);

  return canvas;
}

function Smartphone2Impl({
  imageUrl,
  colors,
  matteColors = true,
  debugPartColors,
  showDeviceShell = true,
  screenPosition: _sp,
  screenSize: _ss,
  screenRotation: _sr,
  ...props
}: Smartphone2Props) {
  void _sp;
  void _ss;
  void _sr;

  const { scene } = useGLTF("/models/apple_iphone_14_pro_orange.glb");
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  useGraph(clone) as unknown as GLTFResult;

  const effectiveImageUrl = imageUrl ?? "/placeholder-1290x2748.png";
  const sourceTexture = useTexture(effectiveImageUrl);
  const resolvedColors: Smartphone2Colors =
    (colors as Smartphone2Colors) ??
    SMARTPHONE2_THEMES[SMARTPHONE2_DEFAULT_THEME];

  const screenTexture = useMemo(() => {
    const img =
      sourceTexture.image as HTMLImageElement | HTMLCanvasElement | undefined;

    if (!img) return sourceTexture;

    const imgW =
      img instanceof HTMLImageElement ? (img.naturalWidth || img.width) : img.width;
    const imgH =
      img instanceof HTMLImageElement ? (img.naturalHeight || img.height) : img.height;

    const croppedCanvas = buildScreenCanvas(
      img,
      imgW,
      imgH,
      SCREEN_CROP_W,
      SCREEN_CROP_H,
      MAX_TEXTURE_SIZE,
    );
    const canvas = rotateCanvas180(croppedCanvas);

    const nextTexture = sourceTexture.clone();
    nextTexture.image = canvas;
    nextTexture.colorSpace = THREE.SRGBColorSpace;
    nextTexture.flipY = false;
    nextTexture.repeat.set(1, -1);
    nextTexture.offset.set(0, 1);
    nextTexture.minFilter = THREE.LinearMipmapLinearFilter;
    nextTexture.magFilter = THREE.LinearFilter;
    nextTexture.anisotropy = 16;
    nextTexture.wrapS = THREE.ClampToEdgeWrapping;
    nextTexture.wrapT = THREE.ClampToEdgeWrapping;
    nextTexture.needsUpdate = true;

    return nextTexture;
  }, [sourceTexture]);

  useEffect(() => {
    if (screenTexture !== sourceTexture) {
      return () => screenTexture.dispose();
    }
  }, [screenTexture, sourceTexture]);

  const screenMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        map: screenTexture,
        side: THREE.DoubleSide,
        toneMapped: false,
      }),
    [screenTexture],
  );

  useEffect(() => () => screenMaterial.dispose(), [screenMaterial]);

  const themeMaterials = useMemo(() => {
    return Object.fromEntries(
      Object.entries(MESH_SEMANTIC).flatMap(([semantic, meshName]) => {
        if (meshName === SCREEN_MESH) {
          return [];
        }

        const color = resolvedColors[semantic];
        if (!color) {
          return [];
        }

        const themedMaterial = createSimpleFinishMaterial(color, matteColors);

        return [[semantic, themedMaterial] as const];
      }),
    ) as Record<string, THREE.Material>;
  }, [matteColors, resolvedColors]);

  useEffect(() => {
    return () => {
      Object.values(themeMaterials).forEach((material) => material.dispose());
    };
  }, [themeMaterials]);

  const debugMaterials = useMemo(() => {
    if (!debugPartColors) return null;
    return Object.fromEntries(
      Object.entries(debugPartColors).map(([part, color]) => [
        part,
        new THREE.MeshBasicMaterial({ color }),
      ]),
    ) as Record<string, THREE.MeshBasicMaterial>;
  }, [debugPartColors]);

  useEffect(() => {
    if (!debugMaterials) return;
    return () => {
      Object.values(debugMaterials).forEach((material) => material.dispose());
    };
  }, [debugMaterials]);

  useEffect(() => {
    Object.entries(MESH_SEMANTIC).forEach(([semantic, meshName]) => {
      const mesh = clone.getObjectByName(meshName) as THREE.Mesh | undefined;
      if (!mesh) return;

      const debugMaterial = debugMaterials?.[semantic];
      if (debugMaterial) {
        mesh.material = debugMaterial;
        return;
      }

      if (meshName === SCREEN_MESH) {
        mesh.material = screenMaterial;
        return;
      }

      const themedMaterial = themeMaterials[semantic];
      if (themedMaterial) {
        mesh.material = themedMaterial;
        return;
      }
    });
  }, [clone, debugMaterials, screenMaterial, themeMaterials]);

  useEffect(() => {
    const frontGlassMesh = clone.getObjectByName(FRONT_GLASS_MESH) as
      | THREE.Mesh
      | undefined;
    if (frontGlassMesh) {
      frontGlassMesh.visible = false;
    }

    Object.values(MESH_SEMANTIC).forEach((meshName) => {
      const mesh = clone.getObjectByName(meshName) as THREE.Mesh | undefined;
      if (!mesh) return;

      if (meshName === SCREEN_MESH) {
        mesh.visible = true;
        return;
      }

      mesh.visible = showDeviceShell;
    });
  }, [clone, showDeviceShell]);

  return (
    <group {...props} dispose={null}>
      <group position={[1.5, 2.5, -1.0]} rotation={[0, 0, 0]} scale={1}>
        <primitive object={clone} />
      </group>
    </group>
  );
}

export const Smartphone2 = React.memo(Smartphone2Impl);

useGLTF.preload("/models/apple_iphone_14_pro_orange.glb");
