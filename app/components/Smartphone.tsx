"use client";

import * as THREE from "three";
import React, { JSX, useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import { GLTF } from "three-stdlib";

type GLTFResult = GLTF & {
  nodes: {
    o_Cube1: THREE.Mesh;
    o_Extrude2: THREE.Mesh;
    o_Cap1: THREE.Mesh;
    o_Cap2: THREE.Mesh;
    o_Extrude: THREE.Mesh;
    o_Cap1_1: THREE.Mesh;
    o_Cap2_1: THREE.Mesh;
    o_Extrude1: THREE.Mesh;
    o_Cap1_2: THREE.Mesh;
    o_Cap2_2: THREE.Mesh;
    o_Cube: THREE.Mesh;
    o_Boole1: THREE.Mesh;
    o_Extrude4: THREE.Mesh;
    o_Cap1_3: THREE.Mesh;
    o_Cap2_3: THREE.Mesh;
    o_Extrude3: THREE.Mesh;
    o_Cap1_4: THREE.Mesh;
    o_Cap2_4: THREE.Mesh;
    o_Extrude2_1: THREE.Mesh;
    o_Cap1_5: THREE.Mesh;
    o_Cap2_5: THREE.Mesh;
    o_Extrude1_1: THREE.Mesh;
    o_Cap1_6: THREE.Mesh;
    o_Cap2_6: THREE.Mesh;
    o_Capsule1: THREE.Mesh;
    o_Capsule: THREE.Mesh;
    o_Extrude_1: THREE.Mesh;
    o_Extrude_2: THREE.Mesh;
  };
  materials: {
    ["Mat.6"]: THREE.MeshStandardMaterial;
    ["default"]: THREE.MeshStandardMaterial;
    Mat: THREE.MeshStandardMaterial;
    ["Mat.1"]: THREE.MeshStandardMaterial;
    ["Mat.2"]: THREE.MeshStandardMaterial;
  };
};

type SmartphoneProps = JSX.IntrinsicElements["group"] & {
  imageUrl: string;
};

export function Smartphone({ imageUrl, ...props }: SmartphoneProps) {
  const { nodes, materials } = useGLTF(
    "/models/smartphone.glb",
  ) as unknown as GLTFResult;

  const texture = useMemo(() => {
    const loader = new THREE.TextureLoader();
    const tex = loader.load(imageUrl);
    tex.flipY = false;
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, [imageUrl]);

  return (
    <group {...props} dispose={null}>
      <mesh
        geometry={nodes.o_Extrude2.geometry}
        material={materials["Mat.6"]}
      />
      <mesh geometry={nodes.o_Cap1.geometry} material={materials["default"]} />
      <mesh geometry={nodes.o_Cap2.geometry} material={materials["default"]} />
      <mesh geometry={nodes.o_Extrude.geometry} material={materials.Mat} />
      <mesh
        geometry={nodes.o_Cap1_1.geometry}
        material={materials["default"]}
      />
      <mesh
        geometry={nodes.o_Cap2_1.geometry}
        material={materials["default"]}
      />
      <mesh geometry={nodes.o_Extrude1.geometry} material={materials.Mat} />
      <mesh
        geometry={nodes.o_Cap1_2.geometry}
        material={materials["default"]}
      />
      <mesh
        geometry={nodes.o_Cap2_2.geometry}
        material={materials["default"]}
      />
      <mesh geometry={nodes.o_Cube.geometry} material={materials["default"]} />
      <mesh geometry={nodes.o_Boole1.geometry} material={materials["Mat.1"]} />
      <mesh geometry={nodes.o_Extrude4.geometry} material={materials.Mat} />
      <mesh
        geometry={nodes.o_Cap1_3.geometry}
        material={materials["default"]}
      />
      <mesh
        geometry={nodes.o_Cap2_3.geometry}
        material={materials["default"]}
      />
      <mesh geometry={nodes.o_Extrude3.geometry} material={materials.Mat} />
      <mesh
        geometry={nodes.o_Cap1_4.geometry}
        material={materials["default"]}
      />
      <mesh
        geometry={nodes.o_Cap2_4.geometry}
        material={materials["default"]}
      />
      <mesh geometry={nodes.o_Extrude2_1.geometry} material={materials.Mat} />
      <mesh
        geometry={nodes.o_Cap1_5.geometry}
        material={materials["default"]}
      />
      <mesh
        geometry={nodes.o_Cap2_5.geometry}
        material={materials["default"]}
      />
      <mesh geometry={nodes.o_Extrude1_1.geometry} material={materials.Mat} />
      <mesh
        geometry={nodes.o_Cap1_6.geometry}
        material={materials["default"]}
      />
      <mesh
        geometry={nodes.o_Cap2_6.geometry}
        material={materials["default"]}
      />
      <mesh
        geometry={nodes.o_Capsule1.geometry}
        material={materials["Mat.1"]}
      />

      <mesh geometry={nodes.o_Cube1.geometry} material={materials["Mat.2"]}>
        <mesh position={[-100, 200, -210]}>
          <planeGeometry args={[200, 400]} />
          <meshBasicMaterial color="red" side={THREE.DoubleSide} />
        </mesh>
      </mesh>

      <mesh geometry={nodes.o_Capsule.geometry} material={materials["Mat.1"]} />
      <mesh
        geometry={nodes.o_Extrude_1.geometry}
        material={materials["Mat.1"]}
      />
      <mesh
        geometry={nodes.o_Extrude_2.geometry}
        material={materials["Mat.1"]}
      />
    </group>
  );
}

useGLTF.preload("/models/smartphone.glb");
