"use client";

import * as THREE from "three";
import React, { JSX, useEffect, useMemo, useRef } from "react";
import { useGLTF, useTexture } from "@react-three/drei";
import { useGraph } from "@react-three/fiber";
import { GLTF, SkeletonUtils } from "three-stdlib";
import {
  buildScreenCanvas,
  MAX_TEXTURE_SIZE,
} from "../lib/mockup-image";

// Dimensões da tela do smartphone2 derivadas da geometria do mesh (purple_screen).
// Proporção física: 2.071 (X) × 4.568 (Y) em unidades Three.js.
// Os UVs da mesh NÃO são 0–1: vão de U=0.2928 a U=0.6568 (V é 0–1 normal).
// O repeat/offset abaixo remapeia a textura para cobrir exatamente esse intervalo.
const SCREEN2_CROP_W = 207;
const SCREEN2_CROP_H = 457;
const SCREEN2_UV_U_MIN = 0.2928;
const SCREEN2_UV_U_MAX = 0.6568;

// ---------------------------------------------------------------------------
// Mapeamento semântico — nomes baseados nos materiais do GLTF.
// TODO: renomear após debug visual das partes no app.
// ---------------------------------------------------------------------------
export const MESH_SEMANTIC: Record<string, string> = {
  color1Part:     "Plane008_1", // material original: Color 1
  blackPart:      "Plane008_2", // material original: Black
  color2Part:     "Plane008_3", // material original: Color 2
  black3Part:     "Plane008_4", // material original: Black 3
  black2Part:     "Plane008_5", // material original: Black 2
  cameraLensPart: "Plane008_6", // material original: Camera Lens
  // Plane008_7 = tela, tratada separadamente
  whitePart:      "Plane008_8", // material original: white
};

export type Smartphone2DebugPartKey = keyof typeof MESH_SEMANTIC;

// ---------------------------------------------------------------------------
// Tipos GLTF
// ---------------------------------------------------------------------------
type GLTFResult = GLTF & {
  nodes: {
    Bone_9: THREE.Bone;
    Plane008_1: THREE.Mesh;
    Plane008_2: THREE.Mesh;
    Plane008_3: THREE.Mesh;
    Plane008_4: THREE.Mesh;
    Plane008_5: THREE.Mesh;
    Plane008_6: THREE.Mesh;
    Plane008_7: THREE.Mesh;
    Plane008_8: THREE.Mesh;
  };
  materials: Record<string, THREE.Material>;
};

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------
type Smartphone2Props = JSX.IntrinsicElements["group"] & {
  imageUrl?: string;
  colors?: Record<string, string>;
  debugPartColors?: Partial<Record<string, string>>;
  showDeviceShell?: boolean;
  screenPosition?: [number, number, number];
  screenSize?: [number, number];
  screenRotation?: [number, number, number];
};

// ---------------------------------------------------------------------------
// Componente principal
// ---------------------------------------------------------------------------
function Smartphone2Impl({
  imageUrl,
  colors: _colors,
  debugPartColors,
  showDeviceShell = true,
  screenPosition: _sp,
  screenSize: _ss,
  screenRotation: _sr,
  ...props
}: Smartphone2Props) {
  const { scene } = useGLTF("/models/smartphone2.glb");
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  // useGraph para ter acesso tipado aos nodes caso precisemos no futuro
  useGraph(clone) as unknown as GLTFResult;

  const effectiveImageUrl =
    imageUrl && imageUrl !== "/placeholder-enus.png"
      ? imageUrl
      : "/placeholder-enus.png";

  const sourceTexture = useTexture(effectiveImageUrl);

  const texture = useMemo(() => {
    const img = sourceTexture.image as HTMLImageElement | HTMLCanvasElement | undefined;
    if (!img) return sourceTexture;

    const imgW = img instanceof HTMLImageElement ? (img.naturalWidth || img.width) : img.width;
    const imgH = img instanceof HTMLImageElement ? (img.naturalHeight || img.height) : img.height;

    const canvas = buildScreenCanvas(img, imgW, imgH, SCREEN2_CROP_W, SCREEN2_CROP_H, MAX_TEXTURE_SIZE);
    const t = sourceTexture.clone();
    t.image = canvas;
    t.colorSpace = THREE.SRGBColorSpace;
    t.flipY = false;
    t.minFilter = THREE.LinearMipmapLinearFilter;
    t.magFilter = THREE.LinearFilter;
    t.anisotropy = 16;
    t.wrapS = THREE.ClampToEdgeWrapping;
    t.wrapT = THREE.ClampToEdgeWrapping;
    // Os UVs da mesh da tela mapeiam de U=0.2928 a U=0.6568 (não 0–1).
    // Ajusta repeat/offset para a imagem preencher exatamente esse intervalo.
    const uRange = SCREEN2_UV_U_MAX - SCREEN2_UV_U_MIN;
    t.repeat.set(1 / uRange, 1);
    t.offset.set(-SCREEN2_UV_U_MIN / uRange, 0);
    t.needsUpdate = true;
    return t;
  }, [sourceTexture]);

  useEffect(() => {
    if (texture !== sourceTexture) return () => texture.dispose();
  }, [sourceTexture, texture]);

  const screenMat = useMemo(
    () => new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide, toneMapped: false }),
    [texture],
  );
  useEffect(() => () => screenMat.dispose(), [screenMat]);

  // Esconde nós com scale=0 (variantes inativos do GLTF) para não distorcer bounding box
  useEffect(() => {
    clone.traverse((obj) => {
      if (obj.scale.x === 0 && obj.scale.y === 0 && obj.scale.z === 0) {
        obj.visible = false;
      }
    });
  }, [clone]);

  // Guarda materiais originais do clone para restaurar quando debug é desligado
  const originalMaterials = useRef<Map<string, THREE.Material | THREE.Material[]>>(new Map());
  useEffect(() => {
    const map = new Map<string, THREE.Material | THREE.Material[]>();
    clone.traverse((obj) => {
      if (obj instanceof THREE.Mesh && obj.name) map.set(obj.name, obj.material);
    });
    originalMaterials.current = map;
  }, [clone]);

  // Aplica textura da tela ao mesh Plane008_7 do clone
  useEffect(() => {
    const mesh = clone.getObjectByName("Plane008_7") as THREE.Mesh | undefined;
    if (mesh) mesh.material = screenMat;
  }, [clone, screenMat]);

  // Aplica / restaura materiais de debug
  useEffect(() => {
    Object.entries(MESH_SEMANTIC).forEach(([semantic, glbName]) => {
      const mesh = clone.getObjectByName(glbName) as THREE.Mesh | undefined;
      if (!mesh) return;

      if (debugPartColors?.[semantic]) {
        mesh.material = new THREE.MeshBasicMaterial({ color: debugPartColors[semantic] });
      } else {
        const orig = originalMaterials.current.get(glbName);
        if (orig) mesh.material = orig as THREE.Material;
      }
    });
  }, [clone, debugPartColors]);

  // Controla visibilidade das partes (showDeviceShell)
  useEffect(() => {
    Object.values(MESH_SEMANTIC).forEach((glbName) => {
      const mesh = clone.getObjectByName(glbName) as THREE.Mesh | undefined;
      if (mesh) mesh.visible = showDeviceShell;
    });
  }, [clone, showDeviceShell]);

  return (
    <group {...props} dispose={null}>
      <primitive object={clone} />
    </group>
  );
}

export const Smartphone2 = React.memo(Smartphone2Impl);

useGLTF.preload("/models/smartphone2.glb");
