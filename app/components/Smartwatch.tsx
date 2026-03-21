"use client";

import * as THREE from "three";
import React, { useEffect, useMemo, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { useGraph } from "@react-three/fiber";
import { GLTF, SkeletonUtils } from "three-stdlib";

// ---------------------------------------------------------------------------
// Malhas do GLTF — Object_2 a Object_11 compartilham um único material.
// Use o debug mode para identificar cada parte visualmente e renomear.
// ---------------------------------------------------------------------------
export const SMARTWATCH_MESH_NAMES = [
  "Object_2", "Object_3", "Object_4", "Object_5", "Object_6",
  "Object_7", "Object_8", "Object_9", "Object_10", "Object_11",
] as const;

export type SmartwatchDebugPartKey = (typeof SMARTWATCH_MESH_NAMES)[number];

// ---------------------------------------------------------------------------
type GLTFResult = GLTF & {
  nodes: Record<string, THREE.Mesh>;
  materials: Record<string, THREE.Material>;
};

type SmartwatchProps = React.ComponentPropsWithoutRef<"group"> & {
  imageUrl?: string;
  colors?: Record<string, string>;
  debugPartColors?: Partial<Record<string, string>>;
  showDeviceShell?: boolean;
  screenPosition?: [number, number, number];
  screenSize?: [number, number];
};

// ---------------------------------------------------------------------------
function SmartwatchImpl({
  imageUrl: _imageUrl,
  colors: _colors,
  debugPartColors,
  showDeviceShell = true,
  screenPosition: _sp,
  screenSize: _ss,
  ...props
}: SmartwatchProps) {
  const { scene } = useGLTF("/models/smartwatch.glb");
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  useGraph(clone) as unknown as GLTFResult;

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

  // Aplica / restaura materiais de debug por mesh
  useEffect(() => {
    SMARTWATCH_MESH_NAMES.forEach((meshName) => {
      const mesh = clone.getObjectByName(meshName) as THREE.Mesh | undefined;
      if (!mesh) return;

      if (debugPartColors?.[meshName]) {
        mesh.material = new THREE.MeshBasicMaterial({ color: debugPartColors[meshName] });
      } else {
        const orig = originalMaterials.current.get(meshName);
        if (orig) mesh.material = orig as THREE.Material;
      }
    });
  }, [clone, debugPartColors]);

  // Controla visibilidade do device shell
  useEffect(() => {
    clone.traverse((obj) => {
      if (obj instanceof THREE.Mesh) obj.visible = showDeviceShell;
    });
  }, [clone, showDeviceShell]);

  return (
    <group {...props} dispose={null}>
      <primitive object={clone} />
    </group>
  );
}

export const Smartwatch = React.memo(SmartwatchImpl);

useGLTF.preload("/models/smartwatch.glb");
