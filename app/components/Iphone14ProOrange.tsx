"use client";

import * as THREE from "three";
import React, { useEffect, useMemo } from "react";
import { useGLTF, useTexture } from "@react-three/drei";
import { useGraph } from "@react-three/fiber";
import { useControls } from "leva";
import { GLTF, SkeletonUtils } from "three-stdlib";
import {
  buildScreenCanvas,
  MAX_TEXTURE_SIZE,
} from "../lib/mockup-image";
import {
  IPHONE14PRO_ORANGE_DEFAULT_THEME,
  IPHONE14PRO_ORANGE_THEMES,
  type Iphone14ProOrangeColors,
} from "../lib/3d-tokens/iphone14pro-orange";

export const IPHONE14PRO_ORANGE_MESH_SEMANTIC = {
  topCutout: "Object_4",
  frame: "Object_5",
  rearInset: "Object_6",
  body: "Object_7",
  sideCuts: "Object_8",
  cameraMicroPart: "Object_9",
  frontGlass: "Object_10",
  cameraBlock: "Object_11",
  cameraBlockInner: "Object_12",
  screen: "Object_13",
  cameraLensHighlight: "Object_14",
  cameraSideDetail: "Object_15",
} as const;

const SCREEN_MESH = IPHONE14PRO_ORANGE_MESH_SEMANTIC.screen;
const SCREEN_CROP_W = 421;
const SCREEN_CROP_H = 896;

export type Iphone14ProOrangeDebugPartKey =
  keyof typeof IPHONE14PRO_ORANGE_MESH_SEMANTIC;

type GLTFResult = GLTF & {
  nodes: Record<string, THREE.Mesh>;
  materials: Record<string, THREE.Material>;
};

type Iphone14ProOrangeProps = React.ComponentPropsWithoutRef<"group"> & {
  imageUrl?: string;
  colors?: Record<string, string>;
  matteColors?: boolean;
  debugPartColors?: Partial<Record<string, string>>;
  showDeviceShell?: boolean;
  screenPosition?: [number, number, number];
  screenSize?: [number, number];
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

function applyFinishMaterial(material: THREE.Material, matte: boolean) {
  material.transparent = false;
  material.opacity = 1;

  if ("roughness" in material && typeof material.roughness === "number") {
    material.roughness = matte
      ? Math.max(material.roughness, 0.82)
      : Math.min(material.roughness, 0.38);
  }
  if ("metalness" in material && typeof material.metalness === "number") {
    material.metalness = matte
      ? Math.min(material.metalness, 0.08)
      : Math.max(material.metalness, 0.14);
  }
  if ("clearcoat" in material && typeof material.clearcoat === "number") {
    material.clearcoat = matte
      ? Math.min(material.clearcoat, 0.03)
      : Math.max(material.clearcoat, 0.14);
  }
  if (
    "clearcoatRoughness" in material &&
    typeof material.clearcoatRoughness === "number"
  ) {
    material.clearcoatRoughness = matte
      ? Math.max(material.clearcoatRoughness, 0.72)
      : Math.min(material.clearcoatRoughness, 0.28);
  }

  return material;
}

function applyGlassFinishMaterial(
  material: THREE.Material,
  color: string,
  matte: boolean,
) {
  if ("color" in material && material.color instanceof THREE.Color) {
    material.color = new THREE.Color(color);
  }

  material.transparent = true;
  material.opacity = 0.28;

  if ("roughness" in material && typeof material.roughness === "number") {
    material.roughness = matte ? 0.06 : 0.02;
  }
  if ("metalness" in material && typeof material.metalness === "number") {
    material.metalness = 0;
  }

  return material;
}

function Iphone14ProOrangeImpl({
  imageUrl,
  colors,
  matteColors = true,
  debugPartColors,
  showDeviceShell = true,
  screenPosition: _sp,
  screenSize: _ss,
  ...props
}: Iphone14ProOrangeProps) {
  void _sp;
  void _ss;

  const { scene } = useGLTF("/models/apple_iphone_14_pro_orange.glb");
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  useGraph(clone) as unknown as GLTFResult;

  const calibration = useControls("iPhone 14 Pro Orange", {
    rootPositionX: { value: 1.5, min: -300, max: 300, step: 0.1 },
    rootPositionY: { value: 2.5, min: -300, max: 300, step: 0.1 },
    rootPositionZ: { value: -1.0, min: -300, max: 300, step: 0.1 },
    rootRotationX: { value: 0, min: -180, max: 180, step: 0.1 },
    rootRotationY: { value: 0, min: -180, max: 180, step: 0.1 },
    rootRotationZ: { value: 0, min: -180, max: 180, step: 0.1 },
    rootScale: { value: 1, min: 0.8, max: 1.2, step: 0.001 },
  });

  const effectiveImageUrl = imageUrl ?? "/placeholder-1290x2748.png";
  const sourceTexture = useTexture(effectiveImageUrl);
  const resolvedColors: Iphone14ProOrangeColors =
    (colors as Iphone14ProOrangeColors) ??
    IPHONE14PRO_ORANGE_THEMES[IPHONE14PRO_ORANGE_DEFAULT_THEME];

  const screenTexture = useMemo(() => {
    const img =
      sourceTexture.image as HTMLImageElement | HTMLCanvasElement | undefined;

    if (!img) {
      return sourceTexture;
    }

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

  const originalMaterials = useMemo(() => {
    const materials = new Map<string, THREE.Material | THREE.Material[]>();

    clone.traverse((obj) => {
      if (obj instanceof THREE.Mesh && obj.name) {
        materials.set(obj.name, obj.material);
      }
    });

    return materials;
  }, [clone]);

  const themeMaterials = useMemo(() => {
    return Object.fromEntries(
      Object.entries(IPHONE14PRO_ORANGE_MESH_SEMANTIC).flatMap(
        ([semantic, meshName]) => {
          if (meshName === SCREEN_MESH) {
            return [];
          }

          const originalMaterial = originalMaterials.get(meshName);
          const color = resolvedColors[semantic];

          if (!originalMaterial || Array.isArray(originalMaterial) || !color) {
            return [];
          }

          const themedMaterial = originalMaterial.clone();
          if (semantic === "frontGlass") {
            applyGlassFinishMaterial(themedMaterial, color, matteColors);
          } else {
            if (
              "color" in themedMaterial &&
              themedMaterial.color instanceof THREE.Color
            ) {
              themedMaterial.color = new THREE.Color(color);
            }

            applyFinishMaterial(themedMaterial, matteColors);
          }
          themedMaterial.needsUpdate = true;

          return [[semantic, themedMaterial] as const];
        },
      ),
    ) as Record<string, THREE.Material>;
  }, [matteColors, originalMaterials, resolvedColors]);

  useEffect(() => {
    return () => {
      Object.values(themeMaterials).forEach((material) => material.dispose());
    };
  }, [themeMaterials]);

  const debugMaterials = useMemo(() => {
    if (!debugPartColors) {
      return null;
    }

    return Object.fromEntries(
      Object.entries(debugPartColors).map(([part, color]) => [
        part,
        new THREE.MeshBasicMaterial({ color }),
      ]),
    ) as Record<string, THREE.MeshBasicMaterial>;
  }, [debugPartColors]);

  useEffect(() => {
    if (!debugMaterials) {
      return;
    }

    return () => {
      Object.values(debugMaterials).forEach((material) => material.dispose());
    };
  }, [debugMaterials]);

  useEffect(() => {
    Object.entries(IPHONE14PRO_ORANGE_MESH_SEMANTIC).forEach(
      ([semantic, meshName]) => {
        const mesh = clone.getObjectByName(meshName) as THREE.Mesh | undefined;
        if (!mesh) {
          return;
        }

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

        const originalMaterial = originalMaterials.get(meshName);
        if (originalMaterial) {
          mesh.material = originalMaterial;
        }
      },
    );
  }, [clone, debugMaterials, originalMaterials, screenMaterial, themeMaterials]);

  useEffect(() => {
    Object.values(IPHONE14PRO_ORANGE_MESH_SEMANTIC).forEach((meshName) => {
      const mesh = clone.getObjectByName(meshName) as THREE.Mesh | undefined;
      if (!mesh) {
        return;
      }

      if (meshName === SCREEN_MESH) {
        mesh.visible = true;
        return;
      }

      if (meshName === IPHONE14PRO_ORANGE_MESH_SEMANTIC.frontGlass) {
        mesh.visible = showDeviceShell && !matteColors;
        return;
      }

      mesh.visible = showDeviceShell;
    });
  }, [clone, matteColors, showDeviceShell]);

  const rootRotation: [number, number, number] = [
    (calibration.rootRotationX * Math.PI) / 180,
    (calibration.rootRotationY * Math.PI) / 180,
    (calibration.rootRotationZ * Math.PI) / 180,
  ];
  const rootPosition: [number, number, number] = [
    calibration.rootPositionX,
    calibration.rootPositionY,
    calibration.rootPositionZ,
  ];

  return (
    <group {...props} dispose={null}>
      <group
        position={rootPosition}
        rotation={rootRotation}
        scale={calibration.rootScale}
      >
        <primitive object={clone} />
      </group>
    </group>
  );
}

export const Iphone14ProOrange = React.memo(Iphone14ProOrangeImpl);

useGLTF.preload("/models/apple_iphone_14_pro_orange.glb");
