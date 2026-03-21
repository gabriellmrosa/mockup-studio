"use client";

import * as THREE from "three";
import React, { useEffect, useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import { useGraph } from "@react-three/fiber";
import { GLTF, SkeletonUtils } from "three-stdlib";

// ---------------------------------------------------------------------------
// Notebook — 44 malhas, 28 materiais com nomes gerados automaticamente.
// Tela e partes semânticas a identificar via debug mode.
// ---------------------------------------------------------------------------

type GLTFResult = GLTF & {
  nodes: Record<string, THREE.Mesh>;
  materials: Record<string, THREE.Material>;
};

type NotebookProps = React.ComponentPropsWithoutRef<"group"> & {
  imageUrl?: string;
  colors?: Record<string, string>;
  debugPartColors?: Partial<Record<string, string>>;
  showDeviceShell?: boolean;
  screenPosition?: [number, number, number];
  screenSize?: [number, number];
};

// ---------------------------------------------------------------------------
function NotebookImpl({
  imageUrl: _imageUrl,
  colors: _colors,
  debugPartColors: _debugPartColors,
  showDeviceShell = true,
  screenPosition: _sp,
  screenSize: _ss,
  ...props
}: NotebookProps) {
  const { scene } = useGLTF("/models/notebook.glb");
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

export const Notebook = React.memo(NotebookImpl);

useGLTF.preload("/models/notebook.glb");
