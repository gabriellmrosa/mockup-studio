"use client";

import { Suspense, useEffect, useRef, useState } from "react";
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
import {
  AUTO_OBJECT_POSITIONS,
  OBJECT_POSITION_MULTIPLIER,
} from "../lib/scene-presets";
import { DEVICE_MODELS } from "../models/device-models";
import FloatingCanvasControls from "./FloatingCanvasControls";

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

type ViewportControlsApi = {
  fitToScene: () => void;
  resetToInitial: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
};

type SceneBridgeProps = MockupCanvasProps & {
  onViewportControlsReady: (api: ViewportControlsApi | null) => void;
};

const CAMERA_POSITION: [number, number, number] = [0, 0, 5];
const CAMERA_FOV = 45;
const ORBIT_LIMITS: OrbitControlsProps = {
  enablePan: false,
  enableZoom: true,
  maxAzimuthAngle: 0.85,
  maxPolarAngle: Math.PI * 0.68,
  minAzimuthAngle: -0.85,
  minPolarAngle: Math.PI * 0.32,
};
function getObjectPosition(index: number): [number, number, number] {
  if (AUTO_OBJECT_POSITIONS[index]) {
    return AUTO_OBJECT_POSITIONS[index];
  }

  const side = index % 2 === 0 ? 1 : -1;
  const ring = Math.floor(index / 2);
  return [side * (0.7 + ring * 0.28), 0, side * 0.12];
}

function getResolvedObjectPosition(
  object: SceneObject,
  index: number,
): [number, number, number] {
  const [baseX, baseY, baseZ] = getObjectPosition(index);

  return [
    baseX + object.positionX * OBJECT_POSITION_MULTIPLIER,
    baseY + object.positionY * OBJECT_POSITION_MULTIPLIER,
    baseZ + object.positionZ * OBJECT_POSITION_MULTIPLIER,
  ];
}

function SceneBridge({
  objects,
  onExportReady,
  onViewportControlsReady,
  resetCameraVersion,
}: SceneBridgeProps) {
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
    controls.saveState();
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
                    position={getResolvedObjectPosition(object, index)}
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
            controlsRef={controlsRef}
            onViewportControlsReady={onViewportControlsReady}
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
  controlsRef,
  onViewportControlsReady,
  resetCameraVersion,
  sceneRef,
}: {
  controlsRef: { current: OrbitControlsImpl | null };
  onViewportControlsReady: (api: ViewportControlsApi | null) => void;
  resetCameraVersion: number;
  sceneRef: { current: THREE.Group | null };
}) {
  const bounds = useBounds();
  const hasCapturedInitialState = useRef(false);

  useEffect(() => {
    const controls = controlsRef.current;
    const sceneGroup = sceneRef.current;

    if (!controls || !sceneGroup || hasCapturedInitialState.current) {
      return;
    }

    let frameId = 0;

    frameId = requestAnimationFrame(() => {
      bounds.refresh(sceneGroup).reset().clip();
      controls.saveState();
      hasCapturedInitialState.current = true;
    });

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [bounds, controlsRef, sceneRef]);

  useEffect(() => {
    const controls = controlsRef.current;

    if (!controls) {
      return;
    }

    const runZoom = (direction: "in" | "out") => {
      const zoomStep = 1.16;
      const zoomHandler =
        direction === "in"
          ? (controls as OrbitControlsImpl & { dollyIn?: (scale: number) => void })
              .dollyIn
          : (controls as OrbitControlsImpl & {
              dollyOut?: (scale: number) => void;
            }).dollyOut;

      zoomHandler?.call(controls, zoomStep);
      controls.update();
    };

    onViewportControlsReady({
      fitToScene: () => {
        const sceneGroup = sceneRef.current;

        if (!sceneGroup) {
          return;
        }

        bounds.refresh(sceneGroup).reset().clip();
      },
      resetToInitial: () => {
        controls.reset();
        controls.update();
      },
      zoomIn: () => {
        runZoom("out");
      },
      zoomOut: () => {
        runZoom("in");
      },
    });

    return () => {
      onViewportControlsReady(null);
    };
  }, [bounds, controlsRef, onViewportControlsReady, sceneRef]);

  useEffect(() => {
    if (resetCameraVersion === 0) {
      return;
    }

    let frameId = 0;

    frameId = requestAnimationFrame(() => {
      const controls = controlsRef.current;
      const sceneGroup = sceneRef.current;

      if (!controls || !sceneGroup) {
        return;
      }

      controls.reset();
      controls.update();
    });

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [bounds, controlsRef, resetCameraVersion, sceneRef]);

  return null;
}

export default function MockupCanvas(props: MockupCanvasProps) {
  const [viewportControls, setViewportControls] =
    useState<ViewportControlsApi | null>(null);

  return (
    <div
      className={`mockup-stage relative flex-1 h-screen ${props.uiTheme === "dark" ? "mockup-stage-dark" : "mockup-stage-light"}`}
    >
      <Canvas
        camera={{ fov: CAMERA_FOV, position: CAMERA_POSITION }}
        dpr={[1, 2]}
        gl={{ alpha: true, antialias: true, preserveDrawingBuffer: true }}
      >
        <SceneBridge
          {...props}
          onViewportControlsReady={setViewportControls}
        />
      </Canvas>

      <div className="canvas-stage-overlay">
        <FloatingCanvasControls
          onFitToScene={() => viewportControls?.fitToScene()}
          onZoomIn={() => viewportControls?.zoomIn()}
          onZoomOut={() => viewportControls?.zoomOut()}
        />
      </div>
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
