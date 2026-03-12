"use client";

import { useState, ChangeEvent, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Smartphone } from "./components/Smartphone";
import { Bounds, Center } from "@react-three/drei";
import { OrbitControls } from "@react-three/drei";
import Control from "./components/Control";

export default function Home() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [posX, setPosX] = useState(-120);
  const [posY, setPosY] = useState(200);
  const [posZ, setPosZ] = useState(-210);

  const [width, setWidth] = useState(200);
  const [height, setHeight] = useState(400);

  const [rotY, setRotY] = useState(0);

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setUploadedImage(imageUrl);
    }
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-white relative">
      {/* BOTÃO UPLOAD */}
      <label className="absolute top-6 right-6 z-20 bg-neutral-800 hover:bg-neutral-700 px-4 py-2 rounded-lg cursor-pointer transition">
        Upload imagem
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
      </label>

      {/* AREA 3D FULL */}
      <div className="w-full h-screen">
        <div className="absolute left-6 top-6 bg-black/70 p-4 rounded-xl text-xs space-y-2 z-50">
          <Control
            label="posX"
            value={posX}
            setValue={setPosX}
            min={-500}
            max={500}
          />
          <Control
            label="posY"
            value={posY}
            setValue={setPosY}
            min={-500}
            max={500}
          />
          <Control
            label="posZ"
            value={posZ}
            setValue={setPosZ}
            min={-500}
            max={500}
          />

          <Control
            label="width"
            value={width}
            setValue={setWidth}
            min={50}
            max={500}
          />
          <Control
            label="height"
            value={height}
            setValue={setHeight}
            min={50}
            max={800}
          />

          <Control
            label="rotY"
            value={rotY}
            setValue={setRotY}
            min={-3.14}
            max={3.14}
            step={0.01}
          />
        </div>
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
          <ambientLight intensity={1} />
          <directionalLight position={[2, 3, 4]} intensity={2} />

          <Suspense fallback={null}>
            <Bounds fit clip observe margin={1.2}>
              <Center>
                <Smartphone
                  imageUrl={uploadedImage ?? "/placeholder.jpg"}
                  scale={0.009}
                  rotation={[0, Math.PI, 0]}
                  screenPosition={[posX, posY, posZ]}
                  screenSize={[width, height]}
                  screenRotation={[0, rotY, 0]}
                />
              </Center>
            </Bounds>
          </Suspense>

          <OrbitControls enableZoom={false} />
        </Canvas>
      </div>
    </main>
  );
}
