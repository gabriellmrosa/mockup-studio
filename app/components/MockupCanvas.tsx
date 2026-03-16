"use client";

import { Suspense, useEffect, useRef } from "react";
import * as THREE from "three";
import { Canvas, useThree } from "@react-three/fiber";
import {
  Bounds,
  Center,
  Environment,
  OrbitControls,
  useBounds,
  type OrbitControlsProps,
} from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import type { UiTheme } from "../lib/i18n";
import type { SceneObject } from "../lib/scene-objects";
import { DEVICE_MODELS } from "../models/device-models";

export type ExportPreset = {
  height: number;
  label: string;
  width: number;
};

type MockupCanvasProps = {
  objects: SceneObject[];
  onExportReady: (handler: (preset: ExportPreset) => Promise<void>) => void;
  resetCameraVersion: number;
  uiTheme: UiTheme;
};

const CAMERA_POSITION: [number, number, number] = [0, 0, 5];
const CAMERA_FOV = 45;
const DEFAULT_CAMERA_DIRECTION = new THREE.Vector3(...CAMERA_POSITION).normalize();
const ORBIT_LIMITS: OrbitControlsProps = {
  enablePan: false,
  enableZoom: false,
  maxAzimuthAngle: 0.85,
  maxPolarAngle: Math.PI * 0.68,
  minAzimuthAngle: -0.85,
  minPolarAngle: Math.PI * 0.32,
};
const AUTO_OBJECT_POSITIONS: [number, number, number][] = [
  [0, 0, 0],
  [-0.8, 0.02, 0.1],
  [0.8, -0.02, -0.1],
  [-1.1, 0.04, -0.2],
  [1.1, -0.04, 0.2],
];

function getObjectPosition(index: number): [number, number, number] {
  if (AUTO_OBJECT_POSITIONS[index]) {
    return AUTO_OBJECT_POSITIONS[index];
  }

  const side = index % 2 === 0 ? 1 : -1;
  const ring = Math.floor(index / 2);
  return [side * (0.7 + ring * 0.28), 0, side * 0.12];
}

function SceneBridge({
  objects,
  onExportReady,
  resetCameraVersion,
}: MockupCanvasProps) {
  const controlsRef = useRef<OrbitControlsImpl | null>(null);
  const sceneRef = useRef<THREE.Group | null>(null);
  const { camera, gl, scene, size } = useThree();

  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) {
      return;
    }

    controls.target.set(0, 0, 0);
    controls.update();
  }, []);

  useEffect(() => {
    onExportReady(async ({ height, label, width }) => {
      const previousWidth = size.width;
      const previousHeight = size.height;
      const previousPixelRatio = gl.getPixelRatio();
      const previousAspect =
        camera instanceof THREE.PerspectiveCamera ? camera.aspect : null;

      gl.setPixelRatio(1);
      gl.setSize(width, height, false);

      if (camera instanceof THREE.PerspectiveCamera) {
        camera.aspect = width / height;
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

      downloadBlob(blob, `${label}.png`);
    });

    return () => {
      onExportReady(async () => {
        throw new Error("Export indisponivel.");
      });
    };
  }, [camera, gl, onExportReady, scene, size.height, size.width]);

  return (
    <>
      <Environment preset="studio" />
      <Suspense fallback={null}>
        <Bounds fit clip margin={1.18}>
          <Center>
            <group ref={sceneRef}>
              {objects.map((object, index) => {
                const model = DEVICE_MODELS[object.modelId];

                return (
                  <group
                    key={object.id}
                    position={getObjectPosition(index)}
                    rotation={[
                      (object.rotationX * Math.PI) / 180,
                      (object.rotationY * Math.PI) / 180,
                      (object.rotationZ * Math.PI) / 180,
                    ]}
                  >
                    <model.component
                      bodyColor={object.colors.body}
                      buttonsColor={object.colors.buttons}
                      debugPartColors={
                        object.debugMode ? object.debugPartColors : undefined
                      }
                      imageUrl={object.imageUrl}
                      screenPosition={model.screenPosition}
                      screenSize={model.screenSize}
                      showDeviceShell={object.showDeviceShell}
                    />
                  </group>
                );
              })}
            </group>
          </Center>
          <BoundsResetController
            camera={camera}
            controlsRef={controlsRef}
            resetCameraVersion={resetCameraVersion}
            sceneRef={sceneRef}
          />
        </Bounds>
      </Suspense>
      <OrbitControls
        ref={controlsRef}
        {...ORBIT_LIMITS}
        dampingFactor={0.08}
        enableDamping
      />
    </>
  );
}

function BoundsResetController({
  camera,
  controlsRef,
  resetCameraVersion,
  sceneRef,
}: {
  camera: THREE.Camera;
  controlsRef: { current: OrbitControlsImpl | null };
  resetCameraVersion: number;
  sceneRef: { current: THREE.Group | null };
}) {
  const bounds = useBounds();

  useEffect(() => {
    if (resetCameraVersion === 0) {
      return;
    }

    let frameId = 0;

    frameId = requestAnimationFrame(() => {
      const controls = controlsRef.current;
      const sceneGroup = sceneRef.current;

      if (!sceneGroup || !controls) {
        return;
      }

      bounds.refresh(sceneGroup).clip();

      const { center, distance } = bounds.getSize();
      const nextPosition = center
        .clone()
        .addScaledVector(DEFAULT_CAMERA_DIRECTION, distance);

      camera.position.copy(nextPosition);
      camera.up.set(0, 1, 0);
      camera.lookAt(center);

      if (camera instanceof THREE.PerspectiveCamera) {
        camera.updateProjectionMatrix();
      }

      controls.target.copy(center);
      controls.update();
    });

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [bounds, camera, controlsRef, resetCameraVersion, sceneRef]);

  return null;
}

export default function MockupCanvas(props: MockupCanvasProps) {
  return (
    <div
      className={`mockup-stage flex-1 h-screen ${props.uiTheme === "dark" ? "mockup-stage-dark" : "mockup-stage-light"}`}
    >
      <Canvas
        camera={{ fov: CAMERA_FOV, position: CAMERA_POSITION }}
        dpr={[1, 2]}
        gl={{ alpha: true, antialias: true, preserveDrawingBuffer: true }}
      >
        <SceneBridge {...props} />
      </Canvas>
    </div>
  );
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  link.click();

  URL.revokeObjectURL(url);
}

function dataUrlToBlob(dataUrl: string) {
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
