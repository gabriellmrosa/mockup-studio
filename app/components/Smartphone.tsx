"use client";

import * as THREE from "three";
import React, { JSX, useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import { GLTF } from "three-stdlib";

// Função auxiliar para desenhar o shape de um retângulo arredondado centralizado
function getRoundedRectangleShape(
  width: number,
  height: number,
  radius: number,
) {
  const shape = new THREE.Shape();
  // Centralizamos o shape para que a posição do mesh funcione de forma intuitiva
  shape.moveTo(-width / 2, height / 2 - radius);
  shape.lineTo(-width / 2, radius - height / 2);
  shape.quadraticCurveTo(
    -width / 2,
    -height / 2,
    radius - width / 2,
    -height / 2,
  );
  shape.lineTo(width / 2 - radius, -height / 2);
  shape.quadraticCurveTo(
    width / 2,
    -height / 2,
    width / 2,
    radius - height / 2,
  );
  shape.lineTo(width / 2, height / 2 - radius);
  shape.quadraticCurveTo(width / 2, height / 2, width / 2 - radius, height / 2);
  shape.lineTo(radius - width / 2, height / 2);
  shape.quadraticCurveTo(
    -width / 2,
    height / 2,
    -width / 2,
    height / 2 - radius,
  );
  return shape;
}

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
  imageUrl?: string;
  screenPosition?: [number, number, number];
  screenSize?: [number, number];
  screenRotation?: [number, number, number];
};

export function Smartphone({
  imageUrl,
  screenPosition = [-125, 315, -195], // Valores hardcoded que você encontrou
  screenSize = [220, 469],
  screenRotation = [0, 0, 0],
  ...props
}: SmartphoneProps) {
  const { nodes, materials } = useGLTF(
    "/models/smartphone.glb",
  ) as unknown as GLTFResult;

  const texture = useMemo(() => {
    if (!imageUrl || imageUrl === "/placeholder.jpg") return null;
    const loader = new THREE.TextureLoader();
    const tex = loader.load(imageUrl);
    tex.flipY = false;
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, [imageUrl]);

  // Geramos o shape object centralizado
  const roundedShape = useMemo(() => {
    // Ajuste o raio (aqui 25) se a curvatura não bater com o seu 3D
    return getRoundedRectangleShape(screenSize[0], screenSize[1], 25);
  }, [screenSize]);

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

      {/* TELA RETA COM BORDER RADIUS E TEXTURA */}
      {/* Usamos <mesh> e <shapeGeometry> para criar uma geometria plana (shape reto) */}
      <mesh position={screenPosition} rotation={screenRotation}>
        {/* Passamos o shape object desenhado pela nossa função auxiliar */}
        <shapeGeometry args={[roundedShape]} />
        <meshBasicMaterial
          color={texture ? "white" : "red"}
          map={texture || null}
          side={THREE.DoubleSide}
          toneMapped={false} // Evita interferência de luzes
        />
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
